// utils/db-connector.js
// Modul untuk menangani koneksi database MongoDB

require('dotenv').config();
const { MongoClient } = require('mongodb');
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
    new winston.transports.File({ filename: 'db-connector.log' })
  ]
});

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'telegram_ai_bot';

// Class untuk mengelola koneksi MongoDB
class DbConnector {
  constructor() {
    this.client = null;
    this.db = null;
    this.collections = {};
    this.isConnected = false;
  }

  // Membuat koneksi ke MongoDB
  async connect() {
    try {
      logger.info('Mencoba terhubung ke MongoDB...');
      
      this.client = new MongoClient(MONGODB_URI);
      await this.client.connect();
      
      this.db = this.client.db(DB_NAME);
      this.isConnected = true;
      
      // Inisialisasi koleksi
      this.collections = {
        knowledge: this.db.collection('knowledge'),
        conversations: this.db.collection('conversations'),
        userProfiles: this.db.collection('user_profiles'),
        contextMemory: this.db.collection('context_memory'),
        groups: this.db.collection('groups')
      };
      
      logger.info('Berhasil terhubung ke MongoDB');
      return true;
    } catch (err) {
      logger.error('Gagal terhubung ke MongoDB:', err);
      this.isConnected = false;
      throw err;
    }
  }

  // Mendapatkan database instance
  getDb() {
    if (!this.isConnected) {
      throw new Error('Belum terhubung ke database. Silakan panggil connect() terlebih dahulu.');
    }
    return this.db;
  }

  // Mendapatkan collection berdasarkan nama
  getCollection(name) {
    if (!this.isConnected) {
      throw new Error('Belum terhubung ke database. Silakan panggil connect() terlebih dahulu.');
    }
    
    if (!this.collections[name]) {
      throw new Error(`Collection ${name} tidak ditemukan`);
    }
    
    return this.collections[name];
  }

  // Menutup koneksi
  async close() {
    if (this.client) {
      try {
        await this.client.close();
        this.isConnected = false;
        logger.info('Koneksi MongoDB ditutup');
      } catch (err) {
        logger.error('Gagal menutup koneksi MongoDB:', err);
        throw err;
      }
    }
  }

  // Mengecek apakah koneksi masih aktif
  async ping() {
    if (!this.isConnected) {
      return false;
    }
    
    try {
      await this.db.command({ ping: 1 });
      return true;
    } catch (err) {
      logger.error('Ping failed:', err);
      this.isConnected = false;
      return false;
    }
  }

  // Memastikan koneksi aktif, reconnect jika perlu
  async ensureConnected() {
    if (!this.isConnected) {
      return await this.connect();
    }
    
    const isAlive = await this.ping();
    if (!isAlive) {
      return await this.connect();
    }
    
    return true;
  }
}

// Buat singleton instance
const dbConnector = new DbConnector();

// Util functions untuk operasi database umum
async function findOne(collectionName, query, options = {}) {
  await dbConnector.ensureConnected();
  const collection = dbConnector.getCollection(collectionName);
  return await collection.findOne(query, options);
}

async function find(collectionName, query, options = {}) {
  await dbConnector.ensureConnected();
  const collection = dbConnector.getCollection(collectionName);
  return await collection.find(query, options);
}

async function insertOne(collectionName, document) {
  await dbConnector.ensureConnected();
  const collection = dbConnector.getCollection(collectionName);
  return await collection.insertOne(document);
}

async function insertMany(collectionName, documents) {
  await dbConnector.ensureConnected();
  const collection = dbConnector.getCollection(collectionName);
  return await collection.insertMany(documents);
}

async function updateOne(collectionName, filter, update, options = {}) {
  await dbConnector.ensureConnected();
  const collection = dbConnector.getCollection(collectionName);
  return await collection.updateOne(filter, update, options);
}

async function updateMany(collectionName, filter, update, options = {}) {
  await dbConnector.ensureConnected();
  const collection = dbConnector.getCollection(collectionName);
  return await collection.updateMany(filter, update, options);
}

async function deleteOne(collectionName, filter) {
  await dbConnector.ensureConnected();
  const collection = dbConnector.getCollection(collectionName);
  return await collection.deleteOne(filter);
}

async function deleteMany(collectionName, filter) {
  await dbConnector.ensureConnected();
  const collection = dbConnector.getCollection(collectionName);
  return await collection.deleteMany(filter);
}

async function aggregate(collectionName, pipeline) {
  await dbConnector.ensureConnected();
  const collection = dbConnector.getCollection(collectionName);
  return await collection.aggregate(pipeline);
}

async function countDocuments(collectionName, query = {}) {
  await dbConnector.ensureConnected();
  const collection = dbConnector.getCollection(collectionName);
  return await collection.countDocuments(query);
}

// Export
module.exports = {
  dbConnector,
  findOne,
  find,
  insertOne,
  insertMany,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany,
  aggregate,
  countDocuments
};