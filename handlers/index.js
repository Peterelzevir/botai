// handlers/index.js
// File indeks untuk mengekspor semua handler

const messageHandler = require('./message-handler');
const commandHandler = require('./command-handler');
const groupHandler = require('./group-handler');
const learningHandler = require('./learning-handler');

/**
 * Setup semua handler untuk bot
 * @param {Object} bot - Instance Telegraf bot
 * @param {Object} config - Konfigurasi bot
 */
function setupAllHandlers(bot, config) {
  // Setup message handler
  messageHandler.setupMessageHandler(bot);
  
  // Setup command handler
  commandHandler.setupCommandHandler(bot, config);
  
  // Setup group handler
  groupHandler.setupGroupHandler(bot);
  
  // Setup custom handler lainnya jika diperlukan
  setupIdentityHandler(bot);
  setupFunResponseHandler(bot);
}

/**
 * Setup handler untuk pertanyaan identitas bot
 * @param {Object} bot - Instance Telegraf bot
 */
function setupIdentityHandler(bot) {
  // Tangkap pertanyaan terkait "siapa kamu", "tentang kamu", dll
  bot.hears(/siapa (kamu|lo|lu|elo|kau)|who are you|tentang (kamu|lo|lu|elo|kau)|about you|kamu siapa|dirimu|siapakah kamu/i, async (ctx) => {
    try {
      // Show typing indicator
      await ctx.replyWithChatAction('typing');
      
      const responses = [
        "Gue adalah AI buatan @hiyaok, yang dirancang buat belajar dan ngobrol natural kayak temen! 🤖 Gue belajar dari semua percakapan kita, jadi makin banyak kita ngobrol, makin asik juga gue.",
        
        "Hai! Gue AI yang dibuat sama @hiyaok. Gue terus belajar dari semua obrolan, baik di grup maupun chat pribadi. Dengan gitu, gue jadi bisa berkembang terus!",
        
        "Kenalin, gue bot AI pembelajaran buatan @hiyaok. Yang bikin gue beda dari bot biasa, gue gak pake template jawaban. Gue belajar dari percakapan dan terus berkembang, nyesuaiin sama gaya kalian ngobrol.",
        
        "Gue bot AI yang selalu belajar, buatan @hiyaok. Yang unik dari gue adalah kemampuan buat terus ngembangin pengetahuan dari setiap interaksi. Seneng bisa kenalan sama lo! 😎"
      ];
      
      setTimeout(async () => {
        await ctx.reply(responses[Math.floor(Math.random() * responses.length)], { 
          reply_to_message_id: ctx.message.message_id 
        });
      }, 1500);
    } catch (err) {
      console.error('Error in identity response:', err);
      await ctx.reply("Gue bot AI buatan @hiyaok yang terus belajar dari percakapan!");
    }
  });
}

/**
 * Setup handler untuk respons menyenangkan dan gaul
 * @param {Object} bot - Instance Telegraf bot
 */
function setupFunResponseHandler(bot) {
  // Tangkap ekspresi tawa dan tanggapi dengan tawa juga
  bot.hears(/\b(wk{2,}|ha{2,}h|xi{2,}|wkwk|haha|hihi|lmao|lol|hehe)\b/i, async (ctx) => {
    try {
      // 40% chance to respond with laughter
      if (Math.random() < 0.4) {
        // Tidak perlu respond ke semua tawa, hanya sebagian
        const laughResponses = [
          "wkwkwk 😂",
          "hahaha iya lucu ya",
          "xixi",
          "LMAO 🤣",
          "wkwkwk gokil",
          "😂😂😂",
          "njir lucu banget"
        ];
        
        // Simulasi pengetikan
        await ctx.replyWithChatAction('typing');
        
        // Delay random
        setTimeout(async () => {
          await ctx.reply(laughResponses[Math.floor(Math.random() * laughResponses.length)], {
            reply_to_message_id: ctx.message.message_id
          });
        }, Math.random() * 1000 + 500);
      }
    } catch (err) {
      console.error('Error in fun response handler:', err);
    }
  });
  
  // Tangkap ekspresi populer
  bot.hears(/\b(anjay|anjir|anjer|gokil|mantap|mantul|keren|asik|ngeri|sadis|parah|gila|gabisa|gabisa|sumpah|demi)\b/i, async (ctx) => {
    try {
      // 30% chance to respond with similar expression
      if (Math.random() < 0.3) {
        const expressionResponses = [
          "Anjay sih emang 🔥",
          "Mantap banget!",
          "Keren sih itu",
          "Gokil emang",
          "Ngeri kamu 😎",
          "Oh gitu? Parah sih",
          "Iya bener banget!"
        ];
        
        // Simulasi pengetikan
        await ctx.replyWithChatAction('typing');
        
        // Delay random
        setTimeout(async () => {
          await ctx.reply(expressionResponses[Math.floor(Math.random() * expressionResponses.length)], {
            reply_to_message_id: ctx.message.message_id
          });
        }, Math.random() * 1000 + 500);
      }
    } catch (err) {
      console.error('Error in expression response handler:', err);
    }
  });
  
  // Tangkap ucapan terima kasih dan respons
  bot.hears(/\b(makasih|terima\s*kasih|thanks|thx|thank you|ty|makasi)\b/i, async (ctx) => {
    try {
      // 60% chance to respond to thanks
      if (Math.random() < 0.6) {
        const thanksResponses = [
          "Sama-sama! 😊",
          "Np, kapan saja!",
          "Santai aja kali",
          "You're welcome~",
          "Anytime bro!",
          "Okee, no problem!",
          "Senang bisa bantu 👍"
        ];
        
        // Simulasi pengetikan
        await ctx.replyWithChatAction('typing');
        
        // Delay random
        setTimeout(async () => {
          await ctx.reply(thanksResponses[Math.floor(Math.random() * thanksResponses.length)], {
            reply_to_message_id: ctx.message.message_id
          });
        }, Math.random() * 1000 + 500);
      }
    } catch (err) {
      console.error('Error in thanks response handler:', err);
    }
  });
}

// Export fungsi-fungsi dan modul
module.exports = {
  setupAllHandlers,
  messageHandler,
  commandHandler,
  groupHandler,
  learningHandler
};