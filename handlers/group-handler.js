// handlers/group-handler.js
// Modul untuk menangani event grup (join, left, dll)

const winston = require('winston');
const { saveNewGroupInfo, updateGroupInfo } = require('../utils/context-manager');
const { createGroupJoinResponse } = require('../utils/response-generator');

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
    new winston.transports.File({ filename: 'group-handler.log' })
  ]
});

/**
 * Setup handler untuk event grup
 * @param {Object} bot - Instance Telegraf bot
 */
function setupGroupHandler(bot) {
  // Event bot ditambahkan ke grup
  bot.on('new_chat_members', async (ctx) => {
    // Cek apakah bot yang ditambahkan
    const newMembers = ctx.message.new_chat_members;
    const botAdded = newMembers.some(member => member.id === bot.botInfo.id);
    
    if (botAdded) {
      await handleBotAddedToGroup(ctx, bot);
    } else {
      // Bot tidak ditambahkan, tapi ada member baru
      // Bisa implementasikan welcome message jika diperlukan
      await handleNewMembersInGroup(ctx, newMembers);
    }
  });
  
  // Event bot dikeluarkan dari grup
  bot.on('left_chat_member', async (ctx) => {
    // Cek apakah bot yang dikeluarkan
    const leftMember = ctx.message.left_chat_member;
    
    if (leftMember.id === bot.botInfo.id) {
      await handleBotRemovedFromGroup(ctx);
    } else {
      // Bukan bot yang dikeluarkan
      // Bisa implementasikan goodbye message jika diperlukan
    }
  });
  
  // Event perubahan judul grup
  bot.on('new_chat_title', async (ctx) => {
    await handleGroupTitleChanged(ctx);
  });
  
  // Event perubahan foto grup
  bot.on('new_chat_photo', async (ctx) => {
    await handleGroupPhotoChanged(ctx);
  });
  
  // Event foto grup dihapus
  bot.on('delete_chat_photo', async (ctx) => {
    await handleGroupPhotoDeleted(ctx);
  });
  
  // Event grup menjadi supergroup
  bot.on('migrate_to_chat_id', async (ctx) => {
    await handleGroupMigration(ctx, ctx.message.migrate_to_chat_id);
  });
  
  logger.info('Group event handlers initialized');
}

/**
 * Handle event bot ditambahkan ke grup baru
 * @param {Object} ctx - Telegraf context
 * @param {Object} bot - Telegraf bot instance
 */
async function handleBotAddedToGroup(ctx, bot) {
  try {
    const groupId = ctx.chat.id.toString();
    const groupTitle = ctx.chat.title || 'Group Chat';
    // Fix: Replacing optional chaining with traditional null check
    const addedBy = ctx.from ? (ctx.from.username || ctx.from.first_name || 'someone') : 'someone';
    
    // Dapatkan jumlah member
    let memberCount = 0;
    try {
      memberCount = await ctx.getChatMembersCount();
    } catch (err) {
      logger.warn(`Could not get member count for group ${groupId}:`, err);
      memberCount = 2; // Minimal ada grup creator dan bot sendiri
    }
    
    // Simpan info grup ke database
    await saveNewGroupInfo(groupId, groupTitle, addedBy, memberCount);
    
    logger.info(`Bot added to group: ${groupTitle} (${groupId}) by ${addedBy}`);
    
    // Tunggu sebentar dan kirim pesan sambutan natural
    setTimeout(async () => {
      try {
        // Simulasi typing
        await ctx.replyWithChatAction('typing');
        
        // Buat pesan sambutan yang natural dan gaul
        const greeting = createGroupJoinResponse(groupTitle, addedBy);
        
        // Kirim sambutan
        await ctx.reply(greeting);
        logger.info(`Welcome message sent to group ${groupId}`);
      } catch (err) {
        logger.error(`Error sending welcome message to group ${groupId}:`, err);
      }
    }, 2000); // Delay 2 detik agar terlihat natural
  } catch (err) {
    logger.error('Error handling bot added to group:', err);
  }
}

/**
 * Handle event ada member baru di grup
 * @param {Object} ctx - Telegraf context
 * @param {Array} newMembers - Array member-member baru
 */
async function handleNewMembersInGroup(ctx, newMembers) {
  // Implementasi ini opsional, bisa digunakan untuk menyambut user baru
  // saat ini tidak diimplementasikan untuk menghindari spam di grup
}

/**
 * Handle event bot dikeluarkan dari grup
 * @param {Object} ctx - Telegraf context
 */
async function handleBotRemovedFromGroup(ctx) {
  try {
    const groupId = ctx.chat.id.toString();
    const groupTitle = ctx.chat.title || 'Group Chat';
    // Fix: Replacing optional chaining with traditional null check
    const removedBy = ctx.from ? (ctx.from.username || ctx.from.first_name || 'someone') : 'someone';
    
    // Update status grup di database (bisa tandai sebagai inactive)
    await updateGroupInfo(groupId, {
      isActive: false,
      leftAt: new Date(),
      removedBy
    });
    
    logger.info(`Bot removed from group: ${groupTitle} (${groupId}) by ${removedBy}`);
  } catch (err) {
    logger.error('Error handling bot removed from group:', err);
  }
}

/**
 * Handle event perubahan judul grup
 * @param {Object} ctx - Telegraf context
 */
async function handleGroupTitleChanged(ctx) {
  try {
    const groupId = ctx.chat.id.toString();
    const newTitle = ctx.message.new_chat_title;
    
    // Update judul grup di database
    await updateGroupInfo(groupId, {
      title: newTitle,
      lastActivity: new Date()
    });
    
    logger.info(`Group title changed to "${newTitle}" in group ${groupId}`);
  } catch (err) {
    logger.error('Error handling group title change:', err);
  }
}

/**
 * Handle event perubahan foto grup
 * @param {Object} ctx - Telegraf context
 */
async function handleGroupPhotoChanged(ctx) {
  try {
    const groupId = ctx.chat.id.toString();
    
    // Update informasi grup di database
    await updateGroupInfo(groupId, {
      hasPhoto: true,
      lastActivity: new Date()
    });
    
    logger.info(`Group photo updated in group ${groupId}`);
  } catch (err) {
    logger.error('Error handling group photo change:', err);
  }
}

/**
 * Handle event foto grup dihapus
 * @param {Object} ctx - Telegraf context
 */
async function handleGroupPhotoDeleted(ctx) {
  try {
    const groupId = ctx.chat.id.toString();
    
    // Update informasi grup di database
    await updateGroupInfo(groupId, {
      hasPhoto: false,
      lastActivity: new Date()
    });
    
    logger.info(`Group photo deleted in group ${groupId}`);
  } catch (err) {
    logger.error('Error handling group photo deletion:', err);
  }
}

/**
 * Handle event grup menjadi supergroup
 * @param {Object} ctx - Telegraf context
 * @param {string} newChatId - ID supergroup baru
 */
async function handleGroupMigration(ctx, newChatId) {
  try {
    const oldGroupId = ctx.chat.id.toString();
    const newGroupId = newChatId.toString();
    
    // Update database untuk mencatat migrasi
    await updateGroupInfo(oldGroupId, {
      migratedTo: newGroupId,
      isActive: false,
      migratedAt: new Date()
    });
    
    // Buat entry baru untuk supergroup dengan menyalin data dari grup lama
    const { dbConnector } = require('../utils/db-connector');
    const groupsCollection = dbConnector.getCollection('groups');
    
    const oldGroupData = await groupsCollection.findOne({ groupId: oldGroupId });
    if (oldGroupData) {
      // Hapus field yang tidak relevan
      delete oldGroupData._id;
      delete oldGroupData.groupId;
      delete oldGroupData.migratedTo;
      delete oldGroupData.isActive;
      
      // Tambahkan info baru
      await groupsCollection.updateOne(
        { groupId: newGroupId },
        {
          $set: {
            ...oldGroupData,
            groupId: newGroupId,
            isActive: true,
            migratedFrom: oldGroupId,
            lastActivity: new Date()
          }
        },
        { upsert: true }
      );
    }
    
    logger.info(`Group ${oldGroupId} migrated to supergroup ${newGroupId}`);
  } catch (err) {
    logger.error('Error handling group migration:', err);
  }
}

// Export fungsi-fungsi
module.exports = {
  setupGroupHandler,
  handleBotAddedToGroup,
  handleNewMembersInGroup,
  handleBotRemovedFromGroup,
  handleGroupTitleChanged,
  handleGroupPhotoChanged,
  handleGroupPhotoDeleted,
  handleGroupMigration
};
