// handlers/command-handler.js
// Modul untuk menangani perintah-perintah bot

const winston = require('winston');
const { updateUserSession } = require('../utils/context-manager');
const { dbConnector } = require('../utils/db-connector');
const { createHelpResponse, createAboutResponse } = require('../utils/response-generator');

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
    new winston.transports.File({ filename: 'command-handler.log' })
  ]
});

/**
 * Setup handler untuk semua command bot
 * @param {Object} bot - Instance Telegraf bot
 * @param {Object} config - Konfigurasi bot
 */
function setupCommandHandler(bot, config) {
  // Command /start
  bot.command('start', async (ctx) => {
    await handleStartCommand(ctx, bot);
  });
  
  // Command /help
  bot.command('help', async (ctx) => {
    await handleHelpCommand(ctx, bot);
  });
  
  // Command /about
  bot.command('about', async (ctx) => {
    await handleAboutCommand(ctx);
  });
  
  // Command /admin
  bot.command('admin', async (ctx) => {
    await handleAdminCommand(ctx, config);
  });
  
  // Command /source
  bot.command('source', async (ctx) => {
    await handleSourceCommand(ctx);
  });
  
  // Command /reset
  bot.command('reset', async (ctx) => {
    await handleResetCommand(ctx, config);
  });
  
  logger.info('Command handlers initialized');
}

/**
 * Handle command /start
 * @param {Object} ctx - Telegraf context
 * @param {Object} bot - Telegraf bot instance
 */
async function handleStartCommand(ctx, bot) {
  const userId = ctx.message.from.id.toString();
  const username = ctx.message.from.username || ctx.message.from.first_name || 'unknown';
  const isPrivate = ctx.chat.type === 'private';
  
  try {
    // Show typing indicator
    await ctx.replyWithChatAction('typing');
    
    // Update user profile
    await updateUserSession(userId, { 
      lastActive: new Date(),
      username,
      firstName: ctx.message.from.first_name,
      lastName: ctx.message.from.last_name,
      startedAt: new Date()
    });
    
    // Different responses for private vs group chats
    if (isPrivate) {
      setTimeout(async () => {
        const privateGreetings = [
          `Haloo ${username}! 👋 Saya bot AI buatan @hiyaok yang belajar dari percakapan. Asik banget kamu udah chat langsung sama aku! Mau tanya-tanya apa nih hari ini?`,
          
          `Heyy ${username}! 😎 Makasih udah chat sama gue! Gue bot yang terus belajar dari percakapan, jadinya makin banyak kita ngobrol, makin pinter gue! Ada yang bisa dibantu hari ini?`,
          
          `Hai ${username}! ✌️ Kenalin, gue bot AI yang dibuat @hiyaok! Gue belajar dari chit-chat, jadi semakin sering kita ngobrol, gue bakal makin ngerti sama lo. So, whats up?`,
          
          `Yuhuuu ${username}! 🤗 Gue AI buatan @hiyaok, yang bisa belajar dan ngobrol kayak temen. Langsung aja mau tanya atau bahas apa?`
        ];
        
        const greeting = privateGreetings[Math.floor(Math.random() * privateGreetings.length)];
        await ctx.reply(greeting);
      }, 1000);
    } else {
      setTimeout(async () => {
        const groupGreetings = [
          `Halo semuanya! 👋 Gue bot AI yang selalu belajar dari percakapan. Mention gue kalo mau ngobrol ya!`,
          
          `Hey guys! 😎 Makasih udah aktivin bot! Gue bakal jadi lebih pinter dengan belajar dari obrolan di grup ini. Mau tanya apapun? Tag gue aja!`,
          
          `Yuhuu! 🤙 Bot sudah aktif! Gue bakal diam-diam belajar dari semua obrolan di grup ini. Kalo butuh gue, mention aja ya!`
        ];
        
        const greeting = groupGreetings[Math.floor(Math.random() * groupGreetings.length)];
        await ctx.reply(greeting);
      }, 1000);
    }
    
    logger.info(`Start command processed for user ${username} (${userId})`);
  } catch (err) {
    logger.error('Error processing start command:', err);
    await ctx.reply("Hai! Ada masalah teknis, tapi aku tetap bisa bantu. Ada yang bisa dibantu?");
  }
}

/**
 * Handle command /help
 * @param {Object} ctx - Telegraf context
 * @param {Object} bot - Telegraf bot instance
 */
async function handleHelpCommand(ctx, bot) {
  try {
    // Show typing indicator
    await ctx.replyWithChatAction('typing');
    
    setTimeout(async () => {
      const helpResponse = createHelpResponse(bot.botInfo.username);
      await ctx.reply(helpResponse, { parse_mode: 'HTML' });
      logger.info(`Help command processed for user ${ctx.message.from.username || ctx.message.from.id}`);
    }, 1000);
  } catch (err) {
    logger.error('Error processing help command:', err);
    await ctx.reply("Bantuan: Mention aku di grup atau langsung chat di private untuk ngobrol. Makin banyak interaksi, makin pinter aku!");
  }
}

/**
 * Handle command /about
 * @param {Object} ctx - Telegraf context
 */
async function handleAboutCommand(ctx) {
  try {
    // Show typing indicator
    await ctx.replyWithChatAction('typing');
    
    setTimeout(async () => {
      const aboutResponse = createAboutResponse();
      await ctx.reply(aboutResponse);
      logger.info(`About command processed for user ${ctx.message.from.username || ctx.message.from.id}`);
    }, 1200);
  } catch (err) {
    logger.error('Error processing about command:', err);
    await ctx.reply("Gue bot AI buatan @hiyaok yang belajar dari percakapan! Makin banyak kita ngobrol, makin pinter gue!");
  }
}

/**
 * Handle command /admin
 * @param {Object} ctx - Telegraf context
 * @param {Object} config - Konfigurasi bot
 */
async function handleAdminCommand(ctx, config) {
  const ADMIN_USER_ID = config.ADMIN_USER_ID;
  const text = ctx.message.text;
  const command = text.replace('/admin', '').trim();
  const userId = ctx.message.from.id.toString();
  
  // Verifikasi apakah user adalah admin
  if (userId !== ADMIN_USER_ID) {
    logger.warn(`Unauthorized admin command attempt from user ${userId}`);
    await ctx.reply("Maaf, kamu tidak memiliki akses untuk perintah ini.");
    return;
  }
  
  try {
    if (command) {
      // Process specific admin command
      if (command === "stats") {
        await handleAdminStats(ctx);
      } else if (command.startsWith("reset")) {
        await handleAdminReset(ctx, command);
      } else if (command.startsWith("broadcast")) {
        await handleAdminBroadcast(ctx, command);
      } else {
        await ctx.reply("Perintah admin tidak dikenali. Gunakan /admin untuk melihat daftar perintah.");
      }
    } else {
      // Show admin help
      await ctx.reply(
        "🔐 Admin commands:\n" +
        "/admin stats - Tampilkan statistik bot\n" +
        "/admin reset memory - Reset memori percakapan\n" +
        "/admin reset all - Reset semua pengetahuan (kecuali pengetahuan awal)\n" +
        "/admin broadcast [pesan] - Kirim pesan ke semua grup"
      );
    }
    
    logger.info(`Admin command '${command || "help"}' processed for admin ${userId}`);
  } catch (err) {
    logger.error('Error processing admin command:', err);
    await ctx.reply("Terjadi kesalahan saat memproses perintah admin.");
  }
}

/**
 * Handle admin stats command
 * @param {Object} ctx - Telegraf context
 */
async function handleAdminStats(ctx) {
  try {
    await ctx.replyWithChatAction('typing');
    
    // Get collections
    const knowledgeCollection = dbConnector.getCollection('knowledge');
    const userProfilesCollection = dbConnector.getCollection('userProfiles');
    const conversationsCollection = dbConnector.getCollection('conversations');
    const groupsCollection = dbConnector.getCollection('groups');
    
    // Get stats
    const knowledgeCount = await knowledgeCollection.countDocuments();
    const userCount = await userProfilesCollection.countDocuments();
    const conversationCount = await conversationsCollection.countDocuments();
    const groupCount = await groupsCollection.countDocuments();
    
    // Get top 5 categories
    const topCategories = await knowledgeCollection.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]).toArray();
    
    // Get top 5 active groups
    const topGroups = await groupsCollection.find()
      .sort({ messageCount: -1 })
      .limit(5)
      .toArray();
    
    setTimeout(async () => {
      await ctx.reply(
        `📊 <b>Statistik Bot</b>\n\n` +
        `Pengetahuan: <b>${knowledgeCount}</b> item\n` +
        `Pengguna: <b>${userCount}</b>\n` +
        `Percakapan: <b>${conversationCount}</b>\n` +
        `Grup: <b>${groupCount}</b>\n` +
        `Memori aktif: <b>${require('../utils/context-manager').activeConversations.size}</b> obrolan\n\n` +
        
        `📈 <b>Top Kategori:</b>\n` +
        topCategories.map(cat => `- ${cat._id || 'undefined'}: ${cat.count} item`).join('\n') + `\n\n` +
        
        `👥 <b>Grup Teraktif:</b>\n` +
        topGroups.map(g => `- ${g.title || g.groupId}: ${g.messageCount} pesan`).join('\n'),
        { parse_mode: 'HTML' }
      );
    }, 1000);
  } catch (err) {
    logger.error('Error getting stats:', err);
    await ctx.reply("Gagal mengambil statistik.");
  }
}

/**
 * Handle admin reset command
 * @param {Object} ctx - Telegraf context
 * @param {string} command - Command string
 */
async function handleAdminReset(ctx, command) {
  try {
    await ctx.replyWithChatAction('typing');
    
    if (command === "reset all") {
      // Reset semua pengetahuan kecuali initial
      const knowledgeCollection = dbConnector.getCollection('knowledge');
      const contextMemoryCollection = dbConnector.getCollection('contextMemory');
      
      const deleteKnowledge = await knowledgeCollection.deleteMany({ source: { $ne: 'initial_knowledge' } });
      const deleteMemory = await contextMemoryCollection.deleteMany({});
      
      // Reset memory cache
      require('../utils/context-manager').activeConversations.clear();
      
      setTimeout(async () => {
        await ctx.reply(`Reset berhasil. ${deleteKnowledge.deletedCount} pengetahuan dan ${deleteMemory.deletedCount} memori percakapan dihapus. Hanya pengetahuan awal yang dipertahankan.`);
      }, 1500);
    } else if (command === "reset memory") {
      // Reset hanya memori percakapan
      const contextMemoryCollection = dbConnector.getCollection('contextMemory');
      const deleteResult = await contextMemoryCollection.deleteMany({});
      
      // Reset memory cache
      require('../utils/context-manager').activeConversations.clear();
      
      setTimeout(async () => {
        await ctx.reply(`Reset memori percakapan berhasil. ${deleteResult.deletedCount} memori dihapus.`);
      }, 1000);
    } else {
      await ctx.reply("Perintah reset tidak valid. Gunakan 'reset all' atau 'reset memory'.");
    }
  } catch (err) {
    logger.error('Error handling reset command:', err);
    await ctx.reply("Gagal melakukan reset.");
  }
}

/**
 * Handle admin broadcast command
 * @param {Object} ctx - Telegraf context
 * @param {string} command - Command string
 */
async function handleAdminBroadcast(ctx, command) {
  const message = command.replace("broadcast", "").trim();
  if (!message) {
    return await ctx.reply("Format: /admin broadcast [pesan]");
  }
  
  try {
    await ctx.replyWithChatAction('typing');
    
    // Get all groups
    const groupsCollection = dbConnector.getCollection('groups');
    const groups = await groupsCollection.find().toArray();
    
    let sentCount = 0;
    let failedCount = 0;
    
    for (const group of groups) {
      try {
        await ctx.telegram.sendMessage(group.groupId, message);
        sentCount++;
      } catch (err) {
        failedCount++;
        logger.error(`Failed to send broadcast to group ${group.groupId}:`, err);
      }
      
      // Delay to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    await ctx.reply(`Broadcast selesai.\nBerhasil: ${sentCount}\nGagal: ${failedCount}`);
  } catch (err) {
    logger.error('Error broadcasting message:', err);
    await ctx.reply("Gagal melakukan broadcast.");
  }
}

/**
 * Handle command /source
 * @param {Object} ctx - Telegraf context
 */
async function handleSourceCommand(ctx) {
  try {
    const userId = ctx.message.from.id.toString();
    
    // Get user profile from database
    const userProfilesCollection = dbConnector.getCollection('userProfiles');
    const userProfile = await userProfilesCollection.findOne({ userId });
    
    if (!userProfile || !userProfile.lastSource) {
      return await ctx.reply("Maaf, aku tidak memiliki informasi sumber untuk pertanyaan terakhirmu.");
    }
    
    const source = userProfile.lastSource;
    let sourceText = "Sumber informasi: ";
    
    if (source.type === 'initial_knowledge') {
      sourceText += "pengetahuan dasar yang sudah diprogramkan";
    } else if (source.type === 'private_chat') {
      sourceText += `dipelajari dari chat pribadi dengan @${source.username} pada ${new Date(source.learned).toLocaleDateString('id-ID')}`;
    } else if (source.type === 'group_chat') {
      sourceText += `dipelajari dari obrolan grup dengan @${source.username} pada ${new Date(source.learned).toLocaleDateString('id-ID')}`;
    } else {
      sourceText += "tidak diketahui";
    }
    
    await ctx.reply(sourceText);
    logger.info(`Source command processed for user ${ctx.message.from.username || ctx.message.from.id}`);
  } catch (err) {
    logger.error('Error processing source command:', err);
    await ctx.reply("Maaf, terjadi kesalahan saat mencari sumber informasi.");
  }
}

/**
 * Handle command /reset
 * @param {Object} ctx - Telegraf context
 * @param {Object} config - Konfigurasi bot
 */
async function handleResetCommand(ctx, config) {
  const userId = ctx.message.from.id.toString();
  const chatId = ctx.chat.id.toString();
  
  try {
    // Reset hanya untuk chat saat ini
    const contextMemoryCollection = dbConnector.getCollection('contextMemory');
    await contextMemoryCollection.deleteOne({ chatId });
    
    // Reset memory cache
    const { activeConversations } = require('../utils/context-manager');
    if (activeConversations.has(chatId)) {
      activeConversations.delete(chatId);
    }
    
    await ctx.reply("Reset percakapan berhasil. Aku telah melupakan konteks percakapan sebelumnya di chat ini.");
    logger.info(`Reset command processed for chat ${chatId} by user ${userId}`);
  } catch (err) {
    logger.error('Error processing reset command:', err);
    await ctx.reply("Maaf, terjadi kesalahan saat mereset percakapan.");
  }
}

// Export fungsi-fungsi
module.exports = {
  setupCommandHandler,
  handleStartCommand,
  handleHelpCommand,
  handleAboutCommand,
  handleAdminCommand,
  handleSourceCommand,
  handleResetCommand
};