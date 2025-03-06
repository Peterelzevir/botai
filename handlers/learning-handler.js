// handlers/learning-handler.js
// Modul untuk proses pembelajaran dari pesan-pesan

const winston = require('winston');
const { extractKeywords, analyzeText, isTalkingAboutBot } = require('../utils/text-processor');
const { updateConversationContext, getConversationContext, updateGroupInfo } = require('../utils/context-manager');
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
    new winston.transports.File({ filename: 'learning-handler.log' })
  ]
});

/**
 * Belajar dari pesan user
 * @param {Object} ctx - Telegraf context
 * @returns {Promise<boolean>} Status pembelajaran
 */
async function learnFromMessage(ctx) {
  try {
    if (!ctx.message || !ctx.message.text || ctx.message.text.length < 3) return false;
    if (ctx.message.text.startsWith('/')) return false; // Skip commands
    if (ctx.message.from.is_bot) return false; // Skip pesan dari bot lain
    
    const chatId = ctx.chat.id.toString();
    const userId = ctx.message.from.id.toString();
    const username = ctx.message.from.username || ctx.message.from.first_name || 'unknown';
    const messageText = ctx.message.text;
    const replyToMessageId = ctx.message.reply_to_message ? ctx.message.reply_to_message.message_id : null;
    const isGroupChat = ctx.chat.type === 'group' || ctx.chat.type === 'supergroup';
    
    // Proses pesan
    const keywords = extractKeywords(messageText);
    const { sentiment, topics, isQuestion, style, hasEmoji } = analyzeText(messageText);
    
    // Dapatkan konteks percakapan
    const conversation = await getConversationContext(chatId);
    
    // Cek apakah pesan ini membicarakan tentang bot
    const isTalkingAboutTheBot = ctx.botInfo && isTalkingAboutBot(messageText, ctx.botInfo.username);
    
    // Siapkan entry pengetahuan
    const knowledgeEntry = {
      content: messageText,
      keywords,
      category: topics.length > 0 ? topics[0] : 'general',
      sentiment,
      isQuestion,
      confidence: calculateConfidence(messageText, topics, isQuestion),
      source: `user:${userId}`,
      sourceType: isGroupChat ? 'group_chat' : 'private_chat',
      chatId,
      sourceUsername: username,
      learned: new Date(),
      style,
      hasEmoji,
      isTalkingAboutBot: isTalkingAboutTheBot,
      context: conversation.slice(-3).map(m => ({
        text: m.text,
        userId: m.userId,
        username: m.username
      }))
    };
    
    // Simpan ke koleksi knowledge
    const knowledgeCollection = dbConnector.getCollection('knowledge');
    await knowledgeCollection.insertOne(knowledgeEntry);
    
    // Simpan ke koleksi conversations
    const conversationsCollection = dbConnector.getCollection('conversations');
    await conversationsCollection.insertOne({
      chatId,
      userId,
      username,
      text: messageText,
      messageId: ctx.message.message_id,
      replyToMessageId,
      timestamp: new Date(),
      keywords,
      sentiment,
      topics,
      style,
      hasEmoji
    });
    
    // Update profil user dengan interests
    if (topics.length > 0) {
      const userProfilesCollection = dbConnector.getCollection('userProfiles');
      await userProfilesCollection.updateOne(
        { userId },
        { 
          $set: { 
            lastActive: new Date(),
            username,
            firstName: ctx.message.from.first_name,
            lastName: ctx.message.from.last_name
          },
          $addToSet: { 
            interests: { $each: topics }
          },
          $inc: {
            messageCount: 1
          }
        },
        { upsert: true }
      );
    }
    
    // Update konteks percakapan
    await updateConversationContext(chatId, {
      messageId: ctx.message.message_id,
      userId,
      username,
      text: messageText,
      timestamp: new Date()
    });
    
    // Update statistik group jika ini group chat
    if (isGroupChat) {
      await updateGroupInfo(chatId, {
        lastActivity: new Date(),
        title: ctx.chat.title,
        $inc: {
          messageCount: 1
        }
      });
    }
    
    logger.info(`Learned from ${isGroupChat ? 'group' : 'private'} message from @${username} in ${chatId}`);
    return true;
  } catch (err) {
    logger.error('Error learning from message:', err);
    return false;
  }
}

/**
 * Hitung nilai confidence untuk pesan
 * @param {string} text - Teks pesan
 * @param {Array} topics - Topik yang terdeteksi
 * @param {boolean} isQuestion - Apakah pesan adalah pertanyaan
 * @returns {number} Skor confidence (0-1)
 */
function calculateConfidence(text, topics, isQuestion) {
  let confidence = 0.7; // Nilai default
  
  // Penalti untuk pesan yang terlalu pendek
  if (text.length < 10) {
    confidence -= 0.2;
  }
  
  // Bonus untuk pesan yang memiliki kategori jelas
  if (topics && topics.length > 0) {
    confidence += 0.1;
  }
  
  // Pesan yang bukan pertanyaan biasanya lebih dapat dipercaya sebagai sumber pengetahuan
  if (!isQuestion) {
    confidence += 0.05;
  }
  
  // Pesan yang terlalu panjang mungkin lebih berharga
  if (text.length > 100) {
    confidence += 0.05;
  }
  
  // Batasi nilai antara 0.4 dan 0.95
  return Math.min(0.95, Math.max(0.4, confidence));
}

/**
 * Cari pesan serupa di database
 * @param {string} text - Teks untuk dicari kemiripannya
 * @param {Array} keywords - Kata kunci yang diekstrak
 * @returns {Promise<Object>} Pesan serupa jika ditemukan
 */
async function findSimilarMessage(text, keywords) {
  try {
    if (!text || !keywords || keywords.length === 0) return null;
    
    const knowledgeCollection = dbConnector.getCollection('knowledge');
    
    // Cari berdasarkan keyword yang sama
    const similarByKeyword = await knowledgeCollection.find({
      keywords: { $in: keywords },
      // Pengecekan tambahan untuk memastikan tidak terlalu mirip
      content: { $ne: text }
    }).sort({ learned: -1 }).limit(5).toArray();
    
    if (similarByKeyword.length > 0) {
      // Hitung skor kemiripan untuk setiap pesan
      const scoredMessages = similarByKeyword.map(msg => {
        let score = 0;
        
        // Hitung berapa keyword yang cocok
        const sharedKeywords = msg.keywords.filter(kw => keywords.includes(kw));
        score += sharedKeywords.length * 0.2;
        
        // Periksa juga kata-kata yang sama di konten
        const textWords = new Set(text.toLowerCase().split(/\s+/));
        const msgWords = new Set(msg.content.toLowerCase().split(/\s+/));
        const sharedWords = [...textWords].filter(word => msgWords.has(word));
        
        score += sharedWords.length * 0.1;
        
        return { message: msg, score };
      });
      
      // Urutkan berdasarkan skor
      scoredMessages.sort((a, b) => b.score - a.score);
      
      // Kembalikan yang paling mirip jika skornya di atas threshold
      if (scoredMessages.length > 0 && scoredMessages[0].score > 1.5) {
        return scoredMessages[0].message;
      }
    }
    
    return null;
  } catch (err) {
    logger.error('Error finding similar message:', err);
    return null;
  }
}

/**
 * Perbarui confidence pesan yang sudah ada
 * @param {string} messageId - ID pesan di database
 * @param {number} newConfidence - Nilai confidence baru
 * @returns {Promise<boolean>} Status update
 */
async function updateMessageConfidence(messageId, newConfidence) {
  try {
    const knowledgeCollection = dbConnector.getCollection('knowledge');
    
    await knowledgeCollection.updateOne(
      { _id: new ObjectId(messageId) },
      { $set: { confidence: newConfidence } }
    );
    
    return true;
  } catch (err) {
    logger.error('Error updating message confidence:', err);
    return false;
  }
}

/**
 * Dapatkan statistik pembelajaran
 * @returns {Promise<Object>} Statistik pembelajaran
 */
async function getLearningStats() {
  try {
    const knowledgeCollection = dbConnector.getCollection('knowledge');
    const conversationsCollection = dbConnector.getCollection('conversations');
    const userProfilesCollection = dbConnector.getCollection('userProfiles');
    const groupsCollection = dbConnector.getCollection('groups');
    
    // Total knowledge items
    const totalKnowledge = await knowledgeCollection.countDocuments();
    
    // Knowledge breakdown by source
    const sourceBreakdown = await knowledgeCollection.aggregate([
      { $group: { _id: "$sourceType", count: { $sum: 1 } } }
    ]).toArray();
    
    // Knowledge breakdown by category
    const categoryBreakdown = await knowledgeCollection.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();
    
    // Other stats
    const totalConversations = await conversationsCollection.countDocuments();
    const totalUsers = await userProfilesCollection.countDocuments();
    const totalGroups = await groupsCollection.countDocuments();
    const activeGroups = await groupsCollection.countDocuments({ lastActivity: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });
    
    return {
      totalKnowledge,
      sourceBreakdown,
      categoryBreakdown,
      totalConversations,
      totalUsers,
      totalGroups,
      activeGroups,
      timestamp: new Date()
    };
  } catch (err) {
    logger.error('Error getting learning stats:', err);
    return {
      error: 'Failed to retrieve learning statistics',
      timestamp: new Date()
    };
  }
}

/**
 * Hapus pesan dari basis pengetahuan
 * @param {string} messageId - ID pesan di database
 * @returns {Promise<boolean>} Status operasi
 */
async function deleteKnowledgeItem(messageId) {
  try {
    const knowledgeCollection = dbConnector.getCollection('knowledge');
    
    const result = await knowledgeCollection.deleteOne({ _id: new ObjectId(messageId) });
    
    return result.deletedCount === 1;
  } catch (err) {
    logger.error('Error deleting knowledge item:', err);
    return false;
  }
}

/**
 * Dapatkan topik yang paling banyak dipelajari
 * @param {number} limit - Jumlah topik yang akan diambil
 * @returns {Promise<Array>} Array dari topik dan jumlahnya
 */
async function getTopLearnedTopics(limit = 10) {
  try {
    const knowledgeCollection = dbConnector.getCollection('knowledge');
    
    const topTopics = await knowledgeCollection.aggregate([
      { $match: { category: { $ne: null, $ne: "" } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]).toArray();
    
    return topTopics;
  } catch (err) {
    logger.error('Error getting top learned topics:', err);
    return [];
  }
}

/**
 * Dapatkan user yang paling aktif
 * @param {number} limit - Jumlah user yang akan diambil
 * @returns {Promise<Array>} Array dari user dan jumlah pesannya
 */
async function getMostActiveUsers(limit = 10) {
  try {
    const userProfilesCollection = dbConnector.getCollection('userProfiles');
    
    const activeUsers = await userProfilesCollection.find()
      .sort({ messageCount: -1 })
      .limit(limit)
      .project({ userId: 1, username: 1, messageCount: 1, interests: 1 })
      .toArray();
    
    return activeUsers;
  } catch (err) {
    logger.error('Error getting most active users:', err);
    return [];
  }
}

// Export fungsi-fungsi
module.exports = {
  learnFromMessage,
  findSimilarMessage,
  updateMessageConfidence,
  getLearningStats,
  deleteKnowledgeItem,
  getTopLearnedTopics,
  getMostActiveUsers
};