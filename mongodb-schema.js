// mongodb-schema.js
// Setup database schema untuk Telegram AI Bot

require('dotenv').config();
const { MongoClient } = require('mongodb');
const logger = require('winston').createLogger({
  level: 'info',
  format: require('winston').format.combine(
    require('winston').format.timestamp(),
    require('winston').format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new require('winston').transports.Console(),
    new require('winston').transports.File({ filename: 'mongodb-setup.log' })
  ]
});

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'telegram_ai_bot';

// Function untuk setup database
async function setupDatabase() {
  try {
    logger.info('Memulai setup database MongoDB...');
    
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    logger.info('Berhasil terhubung ke MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Buat collections
    const knowledgeCollection = db.collection('knowledge');
    const conversationsCollection = db.collection('conversations');
    const userProfilesCollection = db.collection('user_profiles');
    const contextMemoryCollection = db.collection('context_memory');
    const groupsCollection = db.collection('groups');
    
    logger.info('Membuat indexes untuk optimasi performa...');
    
    // Indexes untuk knowledge collection
    await knowledgeCollection.createIndex({ keywords: 1 });
    await knowledgeCollection.createIndex({ content: "text" });
    await knowledgeCollection.createIndex({ category: 1 });
    await knowledgeCollection.createIndex({ source: 1 });
    await knowledgeCollection.createIndex({ learned: -1 });
    await knowledgeCollection.createIndex({ sourceType: 1 });
    await knowledgeCollection.createIndex({ chatId: 1 });
    await knowledgeCollection.createIndex({ isQuestion: 1 });
    await knowledgeCollection.createIndex({ confidence: -1 });
    
    // Indexes untuk conversations collection
    await conversationsCollection.createIndex({ userId: 1 });
    await conversationsCollection.createIndex({ chatId: 1 });
    await conversationsCollection.createIndex({ timestamp: -1 });
    await conversationsCollection.createIndex({ keywords: 1 });
    await conversationsCollection.createIndex({ sentiment: 1 });
    await conversationsCollection.createIndex({ topics: 1 });
    
    // Indexes untuk user_profiles collection
    await userProfilesCollection.createIndex({ userId: 1 }, { unique: true });
    await userProfilesCollection.createIndex({ interests: 1 });
    await userProfilesCollection.createIndex({ lastActive: -1 });
    await userProfilesCollection.createIndex({ username: 1 });
    
    // Indexes untuk context_memory collection
    await contextMemoryCollection.createIndex({ chatId: 1 });
    await contextMemoryCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    
    // Indexes untuk groups collection
    await groupsCollection.createIndex({ groupId: 1 }, { unique: true });
    await groupsCollection.createIndex({ joinedAt: -1 });
    await groupsCollection.createIndex({ lastActivity: -1 });
    await groupsCollection.createIndex({ messageCount: -1 });
    
    logger.info('Indexes berhasil dibuat');
    
    // Setup validasi skema dokumen (opsional)
    try {
      logger.info('Membuat validasi skema...');
      
      await db.command({
        collMod: 'knowledge',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['content', 'keywords', 'learned'],
            properties: {
              content: {
                bsonType: 'string',
                description: 'Konten pengetahuan yang dipelajari'
              },
              keywords: {
                bsonType: 'array',
                description: 'Kata kunci dari konten'
              },
              category: {
                bsonType: 'string',
                description: 'Kategori pengetahuan'
              },
              confidence: {
                bsonType: 'double',
                minimum: 0,
                maximum: 1,
                description: 'Tingkat kepercayaan (0-1)'
              },
              learned: {
                bsonType: 'date',
                description: 'Waktu pengetahuan dipelajari'
              }
            }
          }
        },
        validationLevel: 'moderate'
      });
      
      logger.info('Validasi skema berhasil dibuat');
    } catch (validationErr) {
      logger.warn('Gagal membuat validasi skema:', validationErr);
      logger.info('Melanjutkan tanpa validasi skema...');
    }
    
    // Buat dokumen contoh untuk referensi
    logger.info('Membuat dokumen contoh...');
    
    // Contoh dokumen knowledge
    const knowledgeExample = {
      content: "Indonesia adalah negara kepulauan terbesar di dunia dengan lebih dari 17.000 pulau.",
      keywords: ["indonesia", "negara", "kepulauan", "pulau", "terbesar"],
      category: "education",
      confidence: 0.95,
      source: "initial_knowledge",
      sourceType: "system",
      chatId: null,
      sourceUsername: "system",
      learned: new Date(),
      sentiment: "neutral",
      isQuestion: false,
      style: "normal",
      context: []
    };
    
    // Contoh dokumen conversation
    const conversationExample = {
      chatId: "-100123456789",
      userId: "123456789",
      username: "johndoe",
      text: "Indonesia adalah negara kepulauan terbesar di dunia dengan lebih dari 17.000 pulau.",
      messageId: 42,
      replyToMessageId: 41,
      timestamp: new Date(),
      keywords: ["indonesia", "negara", "kepulauan", "pulau", "terbesar"],
      sentiment: "neutral",
      topics: ["education", "geography"],
      style: "normal"
    };
    
    // Contoh dokumen user_profile
    const userProfileExample = {
      userId: "123456789",
      username: "johndoe",
      firstName: "John",
      lastName: "Doe",
      startedAt: new Date(),
      lastActive: new Date(),
      lastQuery: "Berapa jumlah pulau di Indonesia?",
      lastResponseConfidence: 0.85,
      messageCount: 42,
      interests: ["geography", "history", "technology"],
      recentInteractions: [
        {
          timestamp: new Date(),
          query: "Berapa jumlah pulau di Indonesia?",
          response: "Indonesia memiliki lebih dari 17.000 pulau, menjadikannya negara kepulauan terbesar di dunia.",
          chatId: "-100123456789"
        }
      ]
    };
    
    // Contoh dokumen context_memory
    const contextMemoryExample = {
      chatId: "-100123456789",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 jam dari sekarang
      messages: [
        {
          messageId: 41,
          userId: "987654321",
          username: "janedoe",
          text: "Ada yang tahu berapa jumlah pulau di Indonesia?",
          timestamp: new Date(Date.now() - 60000) // 1 menit lalu
        },
        {
          messageId: 42,
          userId: "123456789",
          username: "johndoe",
          text: "Indonesia adalah negara kepulauan terbesar di dunia dengan lebih dari 17.000 pulau.",
          timestamp: new Date()
        }
      ]
    };
    
    // Contoh dokumen group
    const groupExample = {
      groupId: "-100123456789",
      title: "Cinta Indonesia",
      joinedAt: new Date(),
      lastActivity: new Date(),
      addedBy: "johndoe",
      messageCount: 1542,
      memberCount: 256,
      admins: ["johndoe", "janedoe"],
      settings: {
        learningEnabled: true,
        responseMode: "natural"
      }
    };
    
    // Print struktur koleksi untuk referensi
    logger.info('Struktur koleksi knowledge:');
    logger.info(JSON.stringify(knowledgeExample, null, 2));
    
    logger.info('Struktur koleksi conversations:');
    logger.info(JSON.stringify(conversationExample, null, 2));
    
    logger.info('Struktur koleksi user_profiles:');
    logger.info(JSON.stringify(userProfileExample, null, 2));
    
    logger.info('Struktur koleksi context_memory:');
    logger.info(JSON.stringify(contextMemoryExample, null, 2));
    
    logger.info('Struktur koleksi groups:');
    logger.info(JSON.stringify(groupExample, null, 2));
    
    // Cek apakah perlu seed data awal
    const knowledgeCount = await knowledgeCollection.countDocuments();
    if (knowledgeCount === 0) {
      logger.info('Database kosong, membuat initial seeder (opsional)...');
      logger.info('Untuk mengisi data awal, jalankan: node seed-knowledge.js');
    } else {
      logger.info(`Database sudah berisi ${knowledgeCount} item pengetahuan.`);
    }
    
    // Tutup koneksi
    await client.close();
    logger.info('Koneksi MongoDB ditutup');
    logger.info('Setup database selesai!');
    
    return {
      success: true,
      message: 'Database setup berhasil'
    };
  } catch (err) {
    logger.error('Error setup database:', err);
    return {
      success: false,
      message: 'Database setup gagal: ' + err.message,
      error: err
    };
  }
}

/**
 * Deskripsi Skema Collection MongoDB:
 * 
 * 1. knowledge
 *    Koleksi ini menyimpan semua pengetahuan yang dipelajari bot
 *    - content: String (teks pengetahuan)
 *    - keywords: Array<String> (kata kunci penting dari konten)
 *    - category: String (kategori topik seperti "education", "technology", dll)
 *    - confidence: Number (tingkat kepercayaan bot tentang pengetahuan ini, 0-1)
 *    - source: String (sumber pengetahuan, seperti "user:123456789" atau "initial_knowledge")
 *    - sourceType: String (tipe sumber, seperti "private_chat", "group_chat", "system")
 *    - chatId: String (di mana pengetahuan dipelajari, jika ada)
 *    - sourceUsername: String (username sumber, jika ada)
 *    - learned: Date (kapan pengetahuan diperoleh)
 *    - sentiment: String (positif, negatif, netral)
 *    - isQuestion: Boolean (apakah ini pertanyaan)
 *    - style: String (gaya bahasa: formal, gaul, normal)
 *    - context: Array (konteks percakapan saat pengetahuan dipelajari)
 * 
 * 2. conversations
 *    Koleksi ini menyimpan pesan-pesan individual dari percakapan
 *    - chatId: String (ID grup atau chat pribadi)
 *    - userId: String (user yang mengirim pesan)
 *    - username: String (username pengirim)
 *    - text: String (konten pesan)
 *    - messageId: Number (ID pesan Telegram)
 *    - replyToMessageId: Number (ID pesan yang dibalas, jika ada)
 *    - timestamp: Date (waktu pesan dikirim)
 *    - keywords: Array<String> (kata kunci yang diekstrak)
 *    - sentiment: String (positif, negatif, netral)
 *    - topics: Array<String> (topik yang terdeteksi)
 *    - style: String (gaya bahasa: formal, gaul, normal)
 * 
 * 3. user_profiles
 *    Koleksi ini menyimpan informasi tentang pengguna yang berinteraksi dengan bot
 *    - userId: String (ID unik pengguna)
 *    - username: String (username Telegram)
 *    - firstName: String (nama depan user)
 *    - lastName: String (nama belakang user)
 *    - startedAt: Date (kapan user pertama kali berinteraksi dengan bot)
 *    - lastActive: Date (kapan user terakhir berinteraksi)
 *    - lastQuery: String (query terakhir user)
 *    - lastResponseConfidence: Number (tingkat kepercayaan respon terakhir)
 *    - messageCount: Number (total pesan dari user ini)
 *    - interests: Array<String> (topik yang sering dibahas user)
 *    - recentInteractions: Array (query dan respon terakhir)
 * 
 * 4. context_memory
 *    Koleksi ini menyimpan konteks percakapan jangka pendek dengan expirasi otomatis
 *    - chatId: String (ID grup atau chat pribadi)
 *    - expiresAt: Date (kapan konteks ini kadaluarsa, biasanya 24 jam)
 *    - messages: Array (pesan terbaru dalam percakapan)
 *      - messageId: Number (ID pesan Telegram)
 *      - userId: String (user yang mengirim pesan)
 *      - username: String (username pengirim)
 *      - text: String (konten pesan)
 *      - timestamp: Date (waktu pesan dikirim)
 * 
 * 5. groups
 *    Koleksi ini menyimpan informasi tentang grup yang diikuti bot
 *    - groupId: String (ID grup Telegram)
 *    - title: String (judul grup)
 *    - joinedAt: Date (kapan bot bergabung dengan grup)
 *    - lastActivity: Date (aktivitas terakhir di grup)
 *    - addedBy: String (siapa yang menambahkan bot)
 *    - messageCount: Number (total pesan di grup)
 *    - memberCount: Number (jumlah anggota grup)
 *    - admins: Array<String> (daftar admin grup)
 *    - settings: Object (pengaturan khusus untuk grup)
 */

// Jalankan setup
if (require.main === module) {
  setupDatabase()
    .then(result => {
      if (result.success) {
        logger.info('Setup database berhasil!');
        process.exit(0);
      } else {
        logger.error('Setup database gagal:', result.message);
        process.exit(1);
      }
    })
    .catch(err => {
      logger.error('Error tidak terduga:', err);
      process.exit(1);
    });
} else {
  // Export fungsi untuk digunakan oleh modul lain
  module.exports = {
    setupDatabase
  };
}