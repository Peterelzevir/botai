// utils/context-manager.js
// Modul untuk mengelola konteks percakapan

const { dbConnector } = require('./db-connector');
const winston = require('winston');

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
    new winston.transports.File({ filename: 'context-manager.log' })
  ]
});

// Simpan konteks percakapan dalam memory untuk akses cepat
const activeConversations = new Map();
const userSessions = new Map();

/**
 * Update konteks percakapan
 * @param {string} chatId - ID chat (grup atau private)
 * @param {Object} messageData - Data pesan untuk disimpan
 * @returns {Promise<boolean>} Status operasi
 */
async function updateConversationContext(chatId, messageData) {
  try {
    // Tambahkan ke active conversations di memory
    if (!activeConversations.has(chatId)) {
      activeConversations.set(chatId, []);
    }
    
    const chatContext = activeConversations.get(chatId);
    chatContext.push(messageData);
    
    // Simpan hanya 20 pesan terakhir dalam memory
    if (chatContext.length > 20) {
      chatContext.shift();
    }
    
    // Update di database dengan expiration (24 jam)
    const expireAt = new Date();
    expireAt.setHours(expireAt.getHours() + 24);
    
    const contextMemoryCollection = dbConnector.getCollection('contextMemory');
    await contextMemoryCollection.updateOne(
      { chatId },
      {
        $push: {
          messages: {
            $each: [messageData],
            $slice: -20 // Simpan hanya 20 pesan terakhir
          }
        },
        $set: {
          expiresAt: expireAt
        }
      },
      { upsert: true }
    );
    
    return true;
  } catch (err) {
    logger.error('Error updating conversation context:', err);
    return false;
  }
}

/**
 * Dapatkan konteks percakapan
 * @param {string} chatId - ID chat (grup atau private)
 * @returns {Promise<Array>} Array berisi pesan-pesan konteks
 */
async function getConversationContext(chatId) {
  try {
    // Coba ambil dari memory dulu (lebih cepat)
    if (activeConversations.has(chatId)) {
      return activeConversations.get(chatId);
    }
    
    // Jika tidak ada di memory, ambil dari database
    const contextMemoryCollection = dbConnector.getCollection('contextMemory');
    const contextDoc = await contextMemoryCollection.findOne({ chatId });
    
    if (contextDoc && contextDoc.messages) {
      // Update memory cache
      activeConversations.set(chatId, contextDoc.messages);
      return contextDoc.messages;
    }
    
    return [];
  } catch (err) {
    logger.error('Error getting conversation context:', err);
    return [];
  }
}

/**
 * Dapatkan informasi session user
 * @param {string} userId - ID user
 * @returns {Promise<Object>} Data session user
 */
async function getUserSession(userId) {
  try {
    // Coba ambil dari memory dulu
    if (userSessions.has(userId)) {
      return userSessions.get(userId);
    }
    
    // Jika tidak ada di memory, ambil dari database
    const userProfilesCollection = dbConnector.getCollection('userProfiles');
    const userProfile = await userProfilesCollection.findOne({ userId });
    
    if (userProfile) {
      // Update memory cache
      userSessions.set(userId, userProfile);
      return userProfile;
    }
    
    // Return empty session jika belum ada
    return { userId, createdAt: new Date() };
  } catch (err) {
    logger.error('Error getting user session:', err);
    return { userId, createdAt: new Date() };
  }
}

/**
 * Update session user
 * @param {string} userId - ID user
 * @param {Object} updates - Data yang akan diupdate
 * @returns {Promise<boolean>} Status operasi
 */
async function updateUserSession(userId, updates) {
  try {
    // Update di memory
    if (userSessions.has(userId)) {
      const currentSession = userSessions.get(userId);
      userSessions.set(userId, { ...currentSession, ...updates });
    } else {
      userSessions.set(userId, { userId, createdAt: new Date(), ...updates });
    }
    
    // Update di database
    const userProfilesCollection = dbConnector.getCollection('userProfiles');
    await userProfilesCollection.updateOne(
      { userId },
      { 
        $set: updates,
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );
    
    return true;
  } catch (err) {
    logger.error('Error updating user session:', err);
    return false;
  }
}

/**
 * Dapatkan informasi grup
 * @param {string} groupId - ID grup
 * @returns {Promise<Object>} Data grup
 */
async function getGroupInfo(groupId) {
  try {
    const groupsCollection = dbConnector.getCollection('groups');
    return await groupsCollection.findOne({ groupId });
  } catch (err) {
    logger.error('Error getting group info:', err);
    return null;
  }
}

/**
 * Update informasi grup
 * @param {string} groupId - ID grup
 * @param {Object} updates - Data yang akan diupdate
 * @returns {Promise<boolean>} Status operasi
 */
async function updateGroupInfo(groupId, updates) {
  try {
    const groupsCollection = dbConnector.getCollection('groups');
    await groupsCollection.updateOne(
      { groupId },
      { 
        $set: updates,
        $setOnInsert: { joinedAt: new Date() }
      },
      { upsert: true }
    );
    
    return true;
  } catch (err) {
    logger.error('Error updating group info:', err);
    return false;
  }
}

/**
 * Simpan informasi ketika bot diundang ke grup baru
 * @param {string} groupId - ID grup
 * @param {string} groupTitle - Judul grup
 * @param {string} addedBy - Username yang mengundang bot
 * @param {number} memberCount - Jumlah anggota grup
 * @returns {Promise<boolean>} Status operasi
 */
async function saveNewGroupInfo(groupId, groupTitle, addedBy, memberCount) {
  try {
    const groupsCollection = dbConnector.getCollection('groups');
    await groupsCollection.updateOne(
      { groupId },
      {
        $set: {
          title: groupTitle,
          lastActivity: new Date(),
          addedBy,
          memberCount
        },
        $setOnInsert: {
          joinedAt: new Date(),
          messageCount: 0,
          settings: {
            learningEnabled: true,
            responseMode: 'natural'
          }
        }
      },
      { upsert: true }
    );
    
    return true;
  } catch (err) {
    logger.error('Error saving new group info:', err);
    return false;
  }
}

/**
 * Bersihkan konteks yang sudah kadaluarsa
 * @returns {Promise<boolean>} Status operasi
 */
async function cleanupExpiredContexts() {
  try {
    const contextMemoryCollection = dbConnector.getCollection('contextMemory');
    await contextMemoryCollection.deleteMany({ expiresAt: { $lt: new Date() } });
    
    // Also clean up memory cache
    for (const [chatId, context] of activeConversations.entries()) {
      // Bersihkan cache lebih dari 6 jam tidak aktif
      const lastMessage = context[context.length - 1];
      if (lastMessage && lastMessage.timestamp) {
        const timestamp = new Date(lastMessage.timestamp);
        const sixHoursAgo = new Date();
        sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);
        
        if (timestamp < sixHoursAgo) {
          activeConversations.delete(chatId);
        }
      }
    }
    
    return true;
  } catch (err) {
    logger.error('Error cleaning up expired contexts:', err);
    return false;
  }
}

/**
 * Lihat pesan terakhir dari konteks
 * @param {string} chatId - ID chat
 * @param {number} count - Jumlah pesan yang ingin dilihat
 * @returns {Promise<Array>} Array berisi pesan terakhir
 */
async function getLastMessages(chatId, count = 1) {
  try {
    const context = await getConversationContext(chatId);
    return context.slice(-count);
  } catch (err) {
    logger.error('Error getting last messages:', err);
    return [];
  }
}

/**
 * Reset konteks percakapan untuk chat tertentu
 * @param {string} chatId - ID chat
 * @returns {Promise<boolean>} Status operasi
 */
async function resetConversationContext(chatId) {
  try {
    // Reset di memory
    if (activeConversations.has(chatId)) {
      activeConversations.delete(chatId);
    }
    
    // Reset di database
    const contextMemoryCollection = dbConnector.getCollection('contextMemory');
    await contextMemoryCollection.deleteOne({ chatId });
    
    return true;
  } catch (err) {
    logger.error('Error resetting conversation context:', err);
    return false;
  }
}

/**
 * Reset semua konteks percakapan
 * @returns {Promise<boolean>} Status operasi
 */
async function resetAllContexts() {
  try {
    // Reset di memory
    activeConversations.clear();
    
    // Reset di database
    const contextMemoryCollection = dbConnector.getCollection('contextMemory');
    await contextMemoryCollection.deleteMany({});
    
    return true;
  } catch (err) {
    logger.error('Error resetting all contexts:', err);
    return false;
  }
}

/**
 * Cek apakah ada percakapan aktif
 * @param {string} chatId - ID chat
 * @returns {boolean} Status percakapan aktif
 */
function hasActiveConversation(chatId) {
  return activeConversations.has(chatId) && activeConversations.get(chatId).length > 0;
}

/**
 * Inisialisasi konteks dari database saat startup
 * @returns {Promise<boolean>} Status operasi
 */
async function initializeContextsFromDb() {
  try {
    // Load konteks aktif ke memory
    const contextMemoryCollection = dbConnector.getCollection('contextMemory');
    const activeContexts = await contextMemoryCollection.find({ expiresAt: { $gt: new Date() } }).toArray();
    
    for (const context of activeContexts) {
      if (context.chatId && context.messages) {
        activeConversations.set(context.chatId, context.messages);
      }
    }
    
    // Load session aktif ke memory
    const userProfilesCollection = dbConnector.getCollection('userProfiles');
    const activeUsers = await userProfilesCollection
      .find({ lastActive: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } })
      .toArray();
    
    for (const user of activeUsers) {
      if (user.userId) {
        userSessions.set(user.userId, user);
      }
    }
    
    logger.info(`Loaded ${activeContexts.length} conversation contexts and ${activeUsers.length} user sessions from database`);
    return true;
  } catch (err) {
    logger.error('Error initializing contexts from database:', err);
    return false;
  }
}

// Schedule regular cleanup (every hour)
setInterval(cleanupExpiredContexts, 60 * 60 * 1000);

// Export fungsi-fungsi
module.exports = {
  updateConversationContext,
  getConversationContext,
  getUserSession,
  updateUserSession,
  getGroupInfo,
  updateGroupInfo,
  saveNewGroupInfo,
  cleanupExpiredContexts,
  getLastMessages,
  resetConversationContext,
  resetAllContexts,
  hasActiveConversation,
  initializeContextsFromDb,
  
  // Export collections untuk akses langsung
  activeConversations,
  userSessions
};