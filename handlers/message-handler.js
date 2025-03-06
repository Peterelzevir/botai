// handlers/message-handler.js
// Modul untuk menangani semua pesan masuk

const { message } = require('telegraf/filters');
const winston = require('winston');
const { extractKeywords, analyzeText, determineResponseType, isTalkingAboutBot } = require('../utils/text-processor');
const { updateConversationContext, getConversationContext, updateUserSession } = require('../utils/context-manager');
const { createDynamicResponse, createFallbackResponse } = require('../utils/response-generator');
const learningHandler = require('./learning-handler');
const { dbConnector } = require('../utils/db-connector');

// Konfigurasi logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'message-handler.log' })
  ]
});

/**
 * Setup handler pesan masuk
 * @param {Object} bot - Instance Telegraf bot
 */
function setupMessageHandler(bot) {
  bot.on(message('text'), async (ctx) => {
    try {
      // Jangan proses pesan dari bot lain
      if (ctx.message.from.is_bot) return;
      
      const text = ctx.message.text;
      const isGroupChat = ctx.chat.type === 'group' || ctx.chat.type === 'supergroup';
      // Fix: Replacing optional chaining with traditional null check
      const isMentioned = ctx.message.entities ? ctx.message.entities.some(entity => 
        entity.type === 'mention' && text.slice(entity.offset, entity.offset + entity.length).includes(bot.botInfo.username)
      ) : false;
      // Fix: Replacing optional chaining with traditional null check
      const isReply = ctx.message.reply_to_message && ctx.message.reply_to_message.from && 
                      ctx.message.reply_to_message.from.id === bot.botInfo.id;
      const isPrivateChat = ctx.chat.type === 'private';
      
      // Proses admin commands
      if (text.startsWith('/admin')) {
        return; // Sudah ditangani oleh command handler
      }
      
      // Proses dan pelajari SEMUA pesan di grup DAN chat pribadi
      await learningHandler.learnFromMessage(ctx);
      
      // Hanya respon jika di-mention, direply, atau di private chat
      if (isMentioned || isReply || isPrivateChat) {
        await handleBotResponse(ctx, bot, text, isMentioned, isPrivateChat);
      }
    } catch (err) {
      logger.error('Error handling message:', err);
      try {
        await ctx.reply("Aduh, ada masalah teknis nih. Coba lagi nanti ya!");
      } catch (replyErr) {
        logger.error('Error sending error message:', replyErr);
      }
    }
  });
}

/**
 * Handle respons bot ke pesan user
 * @param {Object} ctx - Telegraf context
 * @param {Object} bot - Telegraf bot instance
 * @param {string} text - Teks pesan
 * @param {boolean} isMentioned - Apakah bot di-mention
 * @param {boolean} isPrivateChat - Apakah ini private chat
 */
async function handleBotResponse(ctx, bot, text, isMentioned, isPrivateChat) {
  try {
    // Bersihkan teks dari mention
    let cleanText = text;
    if (isMentioned && bot.botInfo.username) {
      cleanText = cleanText.replace(new RegExp(`@${bot.botInfo.username}`, 'gi'), '').trim();
    }
    
    // Tunjukkan indikator mengetik untuk efek natural
    await ctx.replyWithChatAction('typing');
    
    // Generate response (dengan delay acak untuk efek lebih natural)
    const typingDelay = Math.random() * 2000 + 1000; // 1-3 detik
    
    // Persiapkan data untuk generasi respons
    const userId = ctx.message.from.id.toString();
    const chatId = ctx.chat.id.toString();
    
    // Analisis gaya bahasa user untuk menyesuaikan respons
    const { style } = analyzeText(cleanText);
    
    // Menyimpan pending response dalam promise untuk dieksekusi setelah delay
    setTimeout(async () => {
      try {
        // Dapatkan respons yang tepat
        const response = await generateProperResponse(cleanText, ctx, style);
        
        // Kirim respons ke user
        await ctx.reply(response, { 
          reply_to_message_id: ctx.message.message_id 
        });
        
        // Log interaksi
        logger.info(`Sent response to user ${ctx.message.from.username || ctx.message.from.id} in ${isPrivateChat ? 'private' : 'group'} chat`);
      } catch (err) {
        logger.error('Error sending delayed response:', err);
        await ctx.reply("Maaf, ada masalah saat memproses respons. Coba lagi nanti ya!");
      }
    }, typingDelay);
    
  } catch (err) {
    logger.error('Error handling bot response:', err);
    throw err;
  }
}

/**
 * Generate respons yang tepat berdasarkan pesan user
 * @param {string} text - Teks pesan
 * @param {Object} ctx - Telegraf context
 * @param {string} userStyle - Gaya bahasa user
 * @returns {Promise<string>} Respons yang dihasilkan
 */
async function generateProperResponse(text, ctx, userStyle) {
  try {
    const userId = ctx.message.from.id.toString();
    const chatId = ctx.chat.id.toString();
    const isGroupChat = ctx.chat.type === 'group' || ctx.chat.type === 'supergroup';
    
    // Ambil konteks percakapan
    const conversationContext = await getConversationContext(chatId);
    
    // Analisis query
    const keywords = extractKeywords(text);
    const { sentiment, topics, isQuestion, isJoke } = analyzeText(text);
    
    // Tentukan tipe respons
    const responseType = determineResponseType(text, isQuestion, isJoke);
    
    // Cek apakah user bertanya tentang identitas bot
    const isBotIdentityQuestion = isTalkingAboutBot(text, ctx.botInfo.username) && 
                                (text.toLowerCase().includes('siapa') || 
                                text.toLowerCase().includes('who') || 
                                text.toLowerCase().includes('tentang') || 
                                text.toLowerCase().includes('about') ||
                                text.toLowerCase().includes('identitas') ||
                                text.toLowerCase().includes('identity'));
    
    // Jika pertanyaan tentang identitas bot, gunakan respons khusus
    if (isBotIdentityQuestion) {
      return createIdentityResponse();
    }
    
    // Cari knowledge yang relevan dari database
    let relevantKnowledge = await findRelevantKnowledge(text, topics, keywords, responseType);
    
    let response = '';
    let confidenceScore = 0;
    
    // Jika menemukan knowledge yang relevan, gunakan
    if (relevantKnowledge.length > 0) {
      // Pilih respons terbaik dan buat respons dinamis
      const result = await createResponseFromKnowledge(relevantKnowledge, text, conversationContext, responseType, userStyle);
      response = result.response;
      confidenceScore = result.confidence;
    }
    
    // Jika tidak ada respons yang bagus, buat fallback
    if (!response || confidenceScore < 0.5) {
      response = createFallbackResponse(text, conversationContext, isQuestion, userStyle);
    }
    
    // Update session user dengan interaksi ini
    await updateUserSession(userId, { 
      lastActive: new Date(),
      lastQuery: text,
      lastResponseConfidence: confidenceScore,
      lastResponse: response
    });
    
    return response;
  } catch (err) {
    logger.error('Error generating response:', err);
    return "Hmm, aku bingung mau jawab apa nih. Coba tanya yang lain deh.";
  }
}

/**
 * Mencari knowledge yang relevan dari database
 * @param {string} text - Teks query
 * @param {Array} topics - Topik yang terdeteksi
 * @param {Array} keywords - Kata kunci yang diekstrak
 * @param {string} responseType - Tipe respons yang dibutuhkan
 * @returns {Promise<Array>} Knowledge yang relevan
 */
async function findRelevantKnowledge(text, topics, keywords, responseType) {
  try {
    // Build query untuk pencarian knowledge
    const searchQuery = {
      $or: [
        { keywords: { $in: keywords } },
        { content: { $regex: keywords.join('|'), $options: 'i' } }
      ]
    };
    
    // Jika ada topik yang terdeteksi, prioritaskan
    if (topics && topics.length > 0) {
      searchQuery.$or.push({ category: { $in: topics } });
    }
    
    // Get knowledge collection
    const knowledgeCollection = dbConnector.getCollection('knowledge');
    
    // Dapatkan knowledge yang relevan
    return await knowledgeCollection.find(searchQuery)
      .sort({ confidence: -1, learned: -1 })
      .limit(15)
      .toArray();
  } catch (err) {
    logger.error('Error finding relevant knowledge:', err);
    return [];
  }
}

/**
 * Buat respons dari knowledge yang ditemukan
 * @param {Array} knowledgeList - List knowledge entries
 * @param {string} text - Teks query
 * @param {Array} context - Konteks percakapan
 * @param {string} responseType - Tipe respons yang dibutuhkan
 * @param {string} userStyle - Gaya bahasa user
 * @returns {Promise<Object>} Respons dan confidence score
 */
async function createResponseFromKnowledge(knowledgeList, text, context, responseType, userStyle) {
  try {
    // Import fungsi secara dinamis untuk menghindari circular dependency
    const { selectBestResponse, createDynamicResponse } = require('../utils/response-generator');
    
    // Pilih knowledge terbaik
    const selectedKnowledge = selectBestResponse(knowledgeList, text, context, responseType);
    
    if (selectedKnowledge) {
      // Buat respons dinamis
      const response = createDynamicResponse(selectedKnowledge, text, context, responseType, userStyle);
      return {
        response,
        confidence: selectedKnowledge.confidence || 0.7
      };
    }
    
    return {
      response: '',
      confidence: 0
    };
  } catch (err) {
    logger.error('Error creating response from knowledge:', err);
    return {
      response: '',
      confidence: 0
    };
  }
}

/**
 * Buat respons identitas bot
 * @returns {string} Respons identitas
 */
function createIdentityResponse() {
  const responses = [
    "Gue adalah AI buatan @hiyaok, yang dirancang untuk belajar dan berbicara dengan cara yang natural! 🤖 Gue belajar dari setiap percakapan kita, jadi semakin banyak kita ngobrol, semakin pintar gue.",
    
    "Hai! Gue AI yang dibuat sama @hiyaok. Gue terus belajar dari semua obrolan, baik di grup maupun chat pribadi. Dengan gitu, gue jadi bisa berkembang terus!",
    
    "Kenalin, gue bot AI pembelajaran buatan @hiyaok. Yang bikin gue beda dari bot biasa, gue gak pake template jawaban. Gue belajar dari percakapan dan terus berkembang, nyesuaiin sama gaya kalian ngobrol.",
    
    "Gue bot AI yang selalu belajar, buatan @hiyaok. Yang unik dari gue adalah kemampuan buat terus ngembangin pengetahuan dari setiap interaksi. Seneng bisa kenalan sama lo! 😎"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

// Export fungsi-fungsi
module.exports = {
  setupMessageHandler,
  handleBotResponse,
  generateProperResponse,
  findRelevantKnowledge,
  createResponseFromKnowledge
};
