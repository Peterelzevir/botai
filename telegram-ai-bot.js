// telegram-ai-bot.js
// Bot Telegram AI yang belajar dari semua grup yang diikuti

require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');
const { MongoClient, ObjectId } = require('mongodb');
const natural = require('natural');
const { WordTokenizer, PorterStemmerID, TfIdf } = natural;
const tokenizer = new WordTokenizer();
const moment = require('moment');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
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
    new winston.transports.File({ filename: 'bot.log' })
  ]
});

// Environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'telegram_ai_bot';
const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

// Periksa apakah token bot tersedia
if (!BOT_TOKEN) {
  logger.error('BOT_TOKEN tidak ditemukan. Pastikan Anda mengatur BOT_TOKEN di file .env');
  process.exit(1);
}

// Inisialisasi bot
const bot = new Telegraf(BOT_TOKEN);

// Koneksi MongoDB
let db;
let knowledgeCollection;
let conversationsCollection;
let userProfilesCollection;
let contextMemoryCollection;
let groupsCollection;

// Penyimpanan memori aktif untuk konteks percakapan
const activeConversations = new Map();
const userSessions = new Map();
const groupsInfo = new Map();

// Kosakata gaul dan slang Indonesia
const gaulDictionary = {
  // Ekspresi gaul dengan variasi untuk dipilih secara acak
  greetings: [
    "Halo broo! 👋", 
    "Hai guyss! 😎", 
    "Haloo, apa kabar? 🤙", 
    "Yuhuuu! 🤗", 
    "Heyy! Apa kabar? ✌️"
  ],
  
  agreements: [
    "Sipp!", 
    "Oke banget deh", 
    "Mantaapp", 
    "Jelas dong", 
    "Sikat!", 
    "Gas!", 
    "Cuss!"
  ],
  
  amazed: [
    "Anjay keren!", 
    "Goks banget!", 
    "Gila sih!", 
    "Kece badai!", 
    "Mantul!", 
    "Auto ngaceng nih!", 
    "Demi apa??"
  ],
  
  confused: [
    "Hah? 🤔", 
    "Gimana tuh?", 
    "Gak mudeng deh", 
    "Bingung euy", 
    "Pusing akutuh", 
    "Wait, apa?"
  ],
  
  // Slang words untuk digunakan dalam respons
  slang: {
    "kamu": ["lu", "elu", "kamu", "lo"],
    "saya": ["gue", "aku", "gw", "w"],
    "bagus": ["keren", "mantap", "mantul", "goks", "gila", "jos", "joss"],
    "sangat": ["banget", "parah", "bet", "bgt", "bgtt"],
    "tidak": ["ga", "gak", "nggak", "ngga", "no", "kagak"],
    "iya": ["yoi", "yup", "yo", "yess", "oke", "sip", "y"],
    "teman": ["bro", "sis", "gaes", "guys", "bestie", "brader", "geng"],
    "tertawa": ["wkwk", "haha", "xixi", "awokawok", "wkkw", "kwkw", "ngakak", "hahaha"],
    "jalan": ["gas", "gass", "gaskeun", "cuss", "let's go", "cabut", "lah"],
    "makan": ["nyam", "makan", "ngemil", "cemilan", "kuliner"],
    "handphone": ["hape", "hp", "ponsel", "gadget"],
    "uang": ["duit", "cuan", "dana", "moolah", "doku"],
    "tidur": ["bobo", "molor", "rebahan"],
    "bingung": ["pusing", "mumet", "bingung", "gagal paham"],
    "apa": ["apaan", "apasi", "apa sih"],
    "bagaimana": ["gimana", "gmn", "howw"]
  },
  
  // Frasa untuk membuat respons lebih natural dan gaul
  phrases: [
    "Btw, ",
    "Anyway, ",
    "Nah gitu loh, ",
    "Ngomongin soal itu, ",
    "Jadi gini, ",
    "Eitsss, ",
    "Hmm, ",
    "Wkwk ",
    "Yoi, ",
    "Btw ya, ",
    "IMHO sih, ",
    "TBH, ",
    "Oiya, ",
    "Eh iya, ",
    "Lah, ",
    "Duh, ",
    "Whoa, ",
    "OMG, ",
    "Hmmm, let me think, ",
    "Well, "
  ],
  
  // Ekspresi untuk akhir kalimat
  endingExpressions: [
    " sih menurutku",
    " gitu deh",
    " hehe",
    " wkwk",
    " btw",
    " dong",
    " kan",
    " lah ya",
    " gitu loh",
    " ya kan",
    " cmiiw",
    " kayaknya",
    " nih",
    " banget",
    " banget sih",
    " deh",
    " yaa",
    " btw",
    " bro",
    " sis",
    " guys",
    " bestie"
  ],
  
  // Emoji untuk menambah ekspresi
  emojis: [
    "😎", "😂", "🤣", "👍", "🔥", "✌️", "🤙", "👊", "💯", "🙌", "😁", 
    "😏", "🤪", "😌", "🤔", "😉", "🥳", "🤗", "😊", "🤩", "😳", "🤭"
  ]
};

// Koneksi ke MongoDB
async function connectToMongoDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    logger.info('Berhasil terhubung ke MongoDB');
    
    db = client.db(DB_NAME);
    knowledgeCollection = db.collection('knowledge');
    conversationsCollection = db.collection('conversations');
    userProfilesCollection = db.collection('user_profiles');
    contextMemoryCollection = db.collection('context_memory');
    groupsCollection = db.collection('groups');
    
    // Buat indexes untuk performa lebih baik
    await knowledgeCollection.createIndex({ keywords: 1 });
    await knowledgeCollection.createIndex({ content: "text" });
    await knowledgeCollection.createIndex({ category: 1 });
    
    await conversationsCollection.createIndex({ userId: 1 });
    await conversationsCollection.createIndex({ chatId: 1 });
    await conversationsCollection.createIndex({ timestamp: -1 });
    
    await userProfilesCollection.createIndex({ userId: 1 }, { unique: true });
    
    await contextMemoryCollection.createIndex({ chatId: 1 });
    await contextMemoryCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    
    await groupsCollection.createIndex({ groupId: 1 }, { unique: true });
    
    logger.info('Database siap digunakan');
    
    // Load existing groups to memory
    const groups = await groupsCollection.find({}).toArray();
    groups.forEach(group => {
      groupsInfo.set(group.groupId, {
        title: group.title,
        memberCount: group.memberCount,
        joinedAt: group.joinedAt,
        lastActivity: group.lastActivity
      });
    });
    logger.info(`Loaded ${groups.length} groups into memory`);
    
    // Cek jika perlu initial seeding
    const knowledgeCount = await knowledgeCollection.countDocuments();
    if (knowledgeCount < 50) {
      logger.info('Melakukan seeding pengetahuan awal...');
      await seedInitialKnowledge();
    }
  } catch (err) {
    logger.error('Gagal terhubung ke MongoDB:', err);
    process.exit(1);
  }
}

// Seeding pengetahuan awal
async function seedInitialKnowledge() {
  const initialKnowledge = [
    {
      content: "Halo! Saya adalah bot AI yang terus belajar dari percakapan. Semakin banyak kita ngobrol, semakin pintar saya!",
      keywords: ["halo", "bot", "ai", "belajar", "percakapan", "pintar"],
      category: "introduction",
      confidence: 0.95,
      source: "initial_knowledge",
      learned: new Date(),
      context: "greeting"
    },
    {
      content: "Saya adalah AI buatan @hiyaok, dirancang untuk belajar dan berbicara dengan cara yang natural! Saya belajar dari percakapan di grup dan chat pribadi.",
      keywords: ["ai", "buatan", "hiyaok", "belajar", "berbicara", "natural", "grup", "chat", "pribadi"],
      category: "introduction",
      confidence: 0.99,
      source: "initial_knowledge",
      learned: new Date(),
      context: "identity"
    },
    {
      content: "Assalamualaikum! Selamat datang di grup. Saya akan membantu menjawab pertanyaan dan belajar dari percakapan di sini.",
      keywords: ["assalamualaikum", "selamat", "datang", "grup", "bantu", "jawab", "pertanyaan", "belajar"],
      category: "greeting",
      confidence: 0.9,
      source: "initial_knowledge",
      learned: new Date(),
      context: "group_joined"
    }
  ];
  
  // Tambahkan lebih banyak pengetahuan dasar berbagai kategori
  const basicCategories = ['teknologi', 'games', 'musik', 'film', 'makanan', 'olahraga', 'pendidikan'];
  initialKnowledge.push(...generateBasicKnowledge(basicCategories));
  
  try {
    await knowledgeCollection.insertMany(initialKnowledge);
    logger.info(`Berhasil menambahkan ${initialKnowledge.length} pengetahuan awal`);
  } catch (err) {
    logger.error('Gagal menambahkan pengetahuan awal:', err);
  }
}

// Generate pengetahuan dasar berdasarkan kategori
function generateBasicKnowledge(categories) {
  const knowledge = [];
  
  // Teknologi
  knowledge.push({
    content: "Android dan iOS adalah dua sistem operasi mobile paling populer saat ini. Android dikembangkan Google, sedangkan iOS oleh Apple.",
    keywords: ["android", "ios", "sistem", "operasi", "mobile", "google", "apple"],
    category: "teknologi",
    confidence: 0.9,
    source: "initial_knowledge",
    learned: new Date(),
    context: "mobile_os"
  });
  
  knowledge.push({
    content: "Game MLBB (Mobile Legends: Bang Bang) adalah game MOBA yang sangat populer di Indonesia, banyak dimainkan dari anak-anak sampai dewasa.",
    keywords: ["game", "mlbb", "mobile", "legends", "bang", "moba", "populer", "indonesia"],
    category: "games",
    confidence: 0.92,
    source: "initial_knowledge",
    learned: new Date(),
    context: "mobile_games"
  });
  
  knowledge.push({
    content: "Kpop adalah genre musik pop asal Korea Selatan yang sangat populer di Indonesia. Grup-grup seperti BTS, BLACKPINK, dan TWICE memiliki banyak penggemar.",
    keywords: ["kpop", "musik", "korea", "pop", "bts", "blackpink", "twice", "penggemar"],
    category: "musik",
    confidence: 0.91,
    source: "initial_knowledge",
    learned: new Date(),
    context: "music_genre"
  });
  
  knowledge.push({
    content: "Nasi goreng adalah salah satu makanan khas Indonesia yang populer. Biasanya terbuat dari nasi, bumbu-bumbu, dan bisa ditambahkan dengan telur, ayam, atau seafood.",
    keywords: ["nasi", "goreng", "makanan", "indonesia", "populer", "bumbu", "telur", "ayam", "seafood"],
    category: "makanan",
    confidence: 0.94,
    source: "initial_knowledge",
    learned: new Date(),
    context: "indonesian_food"
  });
  
  knowledge.push({
    content: "Film Indonesia semakin berkembang dalam beberapa tahun terakhir, dengan genre yang semakin beragam mulai dari drama, horor, komedi, hingga action.",
    keywords: ["film", "indonesia", "berkembang", "genre", "drama", "horor", "komedi", "action"],
    category: "film",
    confidence: 0.9,
    source: "initial_knowledge",
    learned: new Date(),
    context: "indonesian_cinema"
  });
  
  knowledge.push({
    content: "Sepak bola adalah olahraga paling populer di Indonesia. Liga 1 adalah kompetisi sepak bola tertinggi di Indonesia.",
    keywords: ["sepak", "bola", "olahraga", "populer", "indonesia", "liga", "kompetisi"],
    category: "olahraga",
    confidence: 0.93,
    source: "initial_knowledge",
    learned: new Date(),
    context: "sports"
  });
  
  knowledge.push({
    content: "UN (Ujian Nasional) telah digantikan dengan sistem asesmen yang baru yaitu Asesmen Nasional yang terdiri dari AKM, Survei Karakter, dan Survei Lingkungan Belajar.",
    keywords: ["un", "ujian", "nasional", "asesmen", "akm", "survei", "karakter", "lingkungan", "belajar"],
    category: "pendidikan",
    confidence: 0.92,
    source: "initial_knowledge",
    learned: new Date(),
    context: "education_system"
  });
  
  // Generate more basic knowledge...
  // Bisa ditambahkan lebih banyak lagi
  
  return knowledge;
}

// Ekstrak keywords dari teks
function extractKeywords(text) {
  if (!text || text.length < 3) return [];
  
  // Tokenize teks
  const tokens = tokenizer.tokenize(text.toLowerCase());
  
  // Filter stopwords
  const stopWords = ["yang", "dan", "di", "dengan", "dari", "untuk", "pada", "adalah", "ini", "itu", 
                     "atau", "juga", "ke", "ada", "saya", "kamu", "dia", "mereka", "kita", "kami", 
                     "akan", "sudah", "telah", "bisa", "dapat", "harus", "boleh", "mau", "ingin"];
  
  let filteredTokens = tokens.filter(token => 
    token.length > 2 && !stopWords.includes(token)
  );
  
  // Gunakan TF-IDF untuk mengidentifikasi terms penting
  const tfidf = new TfIdf();
  tfidf.addDocument(filteredTokens);
  
  // Dapatkan top keywords
  return tfidf.listTerms(0)
    .slice(0, 8)  // Ambil 8 keyword teratas
    .map(term => term.term);
}

// Analisis teks untuk deteksi topik, sentimen, dll.
function analyzeText(text) {
  if (!text) return { sentiment: 'neutral', topics: [], isQuestion: false };
  
  // Deteksi pertanyaan
  const isQuestion = text.includes('?') || 
                     /\b(apa|bagaimana|siapa|kapan|di\s?mana|mengapa|kenapa|gimana|caranya|piye)\b/i.test(text);
  
  // Analisis sentimen sederhana
  const positiveWords = ["baik", "senang", "bagus", "suka", "bahagia", "indah", "berhasil", "sukses", "cinta", "hebat",
                        "mantap", "mantul", "keren", "asik", "asikk", "cool", "top", "oke", "love", "nice"];
                        
  const negativeWords = ["buruk", "sedih", "jelek", "benci", "marah", "gagal", "rugi", "sakit", "susah", "masalah",
                        "parah", "payah", "burik", "cupu", "kampungan", "bego", "bodoh", "suram", "bad", "jelek"];
  
  let sentiment = 'neutral';
  const words = text.toLowerCase().split(/\s+/);
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.some(pos => word.includes(pos))) positiveCount++;
    if (negativeWords.some(neg => word.includes(neg))) negativeCount++;
  });
  
  if (positiveCount > negativeCount) sentiment = 'positive';
  else if (negativeCount > positiveCount) sentiment = 'negative';
  
  // Deteksi topik
  const topics = [];
  const topicPatterns = [
    { pattern: /\b(teknologi|komputer|internet|aplikasi|software|program|coding|web|website|hp|handphone|ponsel|gadget|laptop)\b/i, topic: 'teknologi' },
    { pattern: /\b(politik|pemerintah|negara|demokrasi|pemilu|presiden|dpr|mpr|pilkada|gubernur|walikota|bupati)\b/i, topic: 'politik' },
    { pattern: /\b(film|bioskop|movie|cinema|nonton|netflix|series|drama|actor|actress|aktor|aktris)\b/i, topic: 'film' },
    { pattern: /\b(musik|lagu|konser|band|penyanyi|singer|album|playlist|spotify|dangdut|kpop|pop|rock|lirik)\b/i, topic: 'musik' },
    { pattern: /\b(sejarah|kerajaan|perang|masa\s?lalu|zaman\s?dulu|kuno|ancient|bersejarah)\b/i, topic: 'sejarah' },
    { pattern: /\b(makanan|minuman|kuliner|restoran|resto|cafe|masak|masakan|menu|rasa|resep|food|drink|restaurant)\b/i, topic: 'kuliner' },
    { pattern: /\b(game|gaming|gamer|main\s?game|steam|esport|mobile\s?legend|pubg|ml|ff|free\s?fire|valorant)\b/i, topic: 'games' },
    { pattern: /\b(sekolah|kuliah|pendidikan|guru|dosen|pelajar|siswa|mahasiswa|mapel|ujian|tugas|pr|education|study|studying)\b/i, topic: 'pendidikan' },
    { pattern: /\b(bisnis|usaha|jualan|dagang|ekonomi|investasi|saham|forex|crypto|uang|duit|cuan|passive\s?income|modal)\b/i, topic: 'bisnis' },
    { pattern: /\b(kesehatan|sehat|penyakit|sakit|dokter|rumah\s?sakit|rs|obat|vitamin|workout|exercise|diet|gym)\b/i, topic: 'kesehatan' },
    { pattern: /\b(olahraga|sepak\s?bola|basket|voli|badminton|renang|lari|marathon|sport|bola|football|soccer|basketball)\b/i, topic: 'olahraga' },
    { pattern: /\b(liburan|wisata|travel|jalan-jalan|piknik|vacation|holiday|pantai|gunung|beach|mountain|hotel|resort|villa)\b/i, topic: 'travel' },
    { pattern: /\b(anime|manga|wibu|otaku|cosplay|japan|jepang|naruto|one\s?piece|boruto|bleach|dragon\s?ball)\b/i, topic: 'anime' },
    { pattern: /\b(gosip|artis|selebritis|infotainment|celebrity|viral|trending|hot\s?news|berita|kabar)\b/i, topic: 'gosip' },
    { pattern: /\b(relationship|hubungan|pacar|pacaran|cinta|love|gebetan|pdkt|jodoh|nikah|married|pernikahan|cerai|putus)\b/i, topic: 'relationship' }
  ];
  
  topicPatterns.forEach(({ pattern, topic }) => {
    if (pattern.test(text)) {
      topics.push(topic);
    }
  });
  
  // Deteksi bahasa formal vs gaul
  let style = 'normal';
  const gaulPatterns = /(gue|lu|elo|coy|bro|sis|guys|wkwk|xixi|btw|otw|fyi|lol|yoi|gitu|sih|dong|banget|parah|anjay|dah|udah|gak|ga|nggak|ngga)/i;
  const formalPatterns = /(saya|anda|bapak|ibu|mereka|menurut|sebagaimana|oleh\s?karena\s?itu|sehingga|terima\s?kasih|mohon|harap)/i;
  
  if (gaulPatterns.test(text)) {
    style = 'gaul';
  } else if (formalPatterns.test(text)) {
    style = 'formal';
  }
  
  // Deteksi konten meme/jokes
  const isJoke = /\b(joke|jokes|meme|memes|lucu|humor|funny|komedi|comedy|lawak|lelucon|receh|dagelan|ngakak)\b/i.test(text);
  
  return { sentiment, topics, isQuestion, style, isJoke };
}

// Belajar dari pesan user
async function learnFromMessage(message, context) {
  if (!message.text || message.text.length < 3) return;
  
  const chatId = context.chat.id.toString();
  const userId = message.from.id.toString();
  const username = message.from.username || message.from.first_name || 'unknown';
  const messageText = message.text;
  const replyToMessageId = message.reply_to_message ? message.reply_to_message.message_id : null;
  const isGroupChat = context.chat.type === 'group' || context.chat.type === 'supergroup';
  
  try {
    // Proses pesan
    const keywords = extractKeywords(messageText);
    const { sentiment, topics, isQuestion, style } = analyzeText(messageText);
    
    // Dapatkan konteks percakapan
    const conversation = await getConversationContext(chatId);
    
    // Cek apakah ini ngomongin bot (self-reference)
    const isTalkingAboutBot = new RegExp(`\\b(bot|${bot.botInfo.username || 'bot'})\\b`, 'i').test(messageText);
    
    // Siapkan entry pengetahuan
    const knowledgeEntry = {
      content: messageText,
      keywords,
      category: topics.length > 0 ? topics[0] : 'general',
      sentiment,
      isQuestion,
      confidence: 0.85,
      source: `user:${userId}`,
      sourceType: isGroupChat ? 'group_chat' : 'private_chat',
      chatId,
      sourceUsername: username,
      learned: new Date(),
      style,
      isTalkingAboutBot,
      context: conversation.slice(-3).map(m => ({
        text: m.text,
        userId: m.userId,
        username: m.username
      }))
    };
    
    // Simpan ke koleksi knowledge
    await knowledgeCollection.insertOne(knowledgeEntry);
    
    // Simpan ke koleksi conversations
    await conversationsCollection.insertOne({
      chatId,
      userId,
      username,
      text: messageText,
      messageId: message.message_id,
      replyToMessageId,
      timestamp: new Date(),
      keywords,
      sentiment,
      topics,
      style
    });
    
    // Update profil user dengan interests
    if (topics.length > 0) {
      await userProfilesCollection.updateOne(
        { userId },
        { 
          $set: { 
            lastActive: new Date(),
            username
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
      messageId: message.message_id,
      userId,
      username,
      text: messageText,
      timestamp: new Date()
    });
    
    // Update statistik group jika ini group chat
    if (isGroupChat) {
      await groupsCollection.updateOne(
        { groupId: chatId },
        {
          $set: {
            lastActivity: new Date(),
            title: context.chat.title
          },
          $inc: {
            messageCount: 1
          }
        },
        { upsert: true }
      );
    }
    
    logger.info(`Learned from ${isGroupChat ? 'group' : 'private'} message from @${username} in ${chatId}`);
  } catch (err) {
    logger.error('Error learning from message:', err);
  }
}

// Update konteks percakapan
async function updateConversationContext(chatId, messageData) {
  try {
    // Tambahkan ke active conversations di memory
    if (!activeConversations.has(chatId)) {
      activeConversations.set(chatId, []);
    }
    
    const chatContext = activeConversations.get(chatId);
    chatContext.push(messageData);
    
    // Keep only the latest 20 messages in memory
    if (chatContext.length > 20) {
      chatContext.shift();
    }
    
    // Update di database dengan expiration (24 jam)
    const expireAt = new Date();
    expireAt.setHours(expireAt.getHours() + 24);
    
    await contextMemoryCollection.updateOne(
      { chatId },
      {
        $push: {
          messages: {
            $each: [messageData],
            $slice: -20 // Keep only the latest 20 messages
          }
        },
        $set: {
          expiresAt: expireAt
        }
      },
      { upsert: true }
    );
  } catch (err) {
    logger.error('Error updating conversation context:', err);
  }
}

// Dapatkan konteks percakapan
async function getConversationContext(chatId) {
  try {
    // Coba ambil dari memory dulu
    if (activeConversations.has(chatId)) {
      return activeConversations.get(chatId);
    }
    
    // Jika tidak ada di memory, ambil dari database
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

// Generate respons berdasarkan pesan user dan konteks
async function generateResponse(text, context) {
  try {
    if (!text || text.length < 2) {
      return { text: "Hmm, ada yang bisa aku bantu?" };
    }
    
    const userId = context.message.from.id.toString();
    const chatId = context.chat.id.toString();
    const isGroupChat = context.chat.type === 'group' || context.chat.type === 'supergroup';
    
    // Get user profile
    const userProfile = await userProfilesCollection.findOne({ userId });
    
    // Get conversation context
    const conversationContext = await getConversationContext(chatId);
    
    // Analisis query
    const keywords = extractKeywords(text);
    const { sentiment, topics, isQuestion, style, isJoke } = analyzeText(text);
    
    // Tentukan tipe respons yang dibutuhkan
    const responseType = determineResponseType(text, isQuestion, isJoke);
    
    // Cari knowledge yang relevan
    let relevantKnowledge = [];
    
    // Build search query
    const searchQuery = {
      $or: [
        { keywords: { $in: keywords } },
        { content: { $regex: keywords.join('|'), $options: 'i' } }
      ]
    };
    
    // Jika ada topik yang terdeteksi, prioritaskan
    if (topics.length > 0) {
      searchQuery.$or.push({ category: { $in: topics } });
    }
    
    // Jika user memiliki interests, pertimbangkan juga
    if (userProfile && userProfile.interests && userProfile.interests.length > 0) {
      searchQuery.$or.push({ category: { $in: userProfile.interests } });
    }
    
    // Dapatkan knowledge
    relevantKnowledge = await knowledgeCollection.find(searchQuery)
      .sort({ confidence: -1, learned: -1 })
      .limit(15)
      .toArray();
    
    let responseText = '';
    let confidenceScore = 0;
    
    // Jika menemukan knowledge yang relevan, gunakan
    if (relevantKnowledge.length > 0) {
      // Pilih respons terbaik berdasarkan konteks
      const selectedResponse = selectBestResponse(relevantKnowledge, text, conversationContext, responseType);
      
      if (selectedResponse) {
        responseText = createDynamicResponse(selectedResponse, text, conversationContext, responseType, style);
        confidenceScore = selectedResponse.confidence;
      }
    }
    
    // Jika tidak ada respon yang bagus, buat fallback
    if (!responseText || confidenceScore < 0.5) {
      responseText = createFallbackResponse(text, conversationContext, isQuestion, style);
    }
    
    // Update session user dengan interaksi ini
    await userProfilesCollection.updateOne(
      { userId },
      { 
        $set: { 
          lastActive: new Date(),
          lastQuery: text,
          lastResponseConfidence: confidenceScore
        },
        $push: {
          recentInteractions: {
            timestamp: new Date(),
            query: text,
            response: responseText,
            chatId
          }
        }
      },
      { upsert: true }
    );
    
    return { text: responseText };
  } catch (err) {
    logger.error('Error generating response:', err);
    return { text: "Aduh, aku bingung mau jawab apa nih. Coba tanya yang lain deh." };
  }
}

// Pilih respon terbaik dari knowledge yang relevan
function selectBestResponse(knowledge, query, context, responseType) {
  // Score setiap knowledge entry
  const scoredKnowledge = knowledge.map(k => {
    let score = k.confidence || 0.5;
    
    // Hitung keyword match score
    const queryWords = query.toLowerCase().split(/\s+/);
    queryWords.forEach(word => {
      if (k.content.toLowerCase().includes(word)) {
        score += 0.05;
      }
      
      if (k.keywords.includes(word)) {
        score += 0.1;
      }
    });
    
    // Context match bonus
    if (context && context.length > 0) {
      const lastMessages = context.slice(-3);
      lastMessages.forEach(msg => {
        if (k.context && k.context.some(c => c.text.includes(msg.text))) {
          score += 0.15;
        }
      });
    }
    
    // Response type match bonus
    if (responseType === 'factual' && !k.isQuestion) {
      score += 0.1;
    } else if (responseType === 'question' && k.isQuestion) {
      score += 0.1;
    } else if (responseType === 'joke' && k.isJoke) {
      score += 0.2;
    }
    
    // Recency bonus
    const ageInDays = (new Date() - new Date(k.learned)) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 0.2 - (ageInDays / 30) * 0.2);
    
    // Prioritaskan jawaban non-pertanyaan untuk pertanyaan
    if (responseType.includes('question') && k.isQuestion) {
      score -= 0.1;
    }
    
    // Prioritaskan respon dari konteks yang sama (private/group)
    if (k.sourceType === 'private_chat' && responseType.includes('private')) {
      score += 0.05;
    } else if (k.sourceType === 'group_chat' && responseType.includes('group')) {
      score += 0.05;
    }
    
    return { knowledge: k, score };
  });
  
  // Sort by score
  scoredKnowledge.sort((a, b) => b.score - a.score);
  
  // Return highest scored knowledge entry
  return scoredKnowledge.length > 0 ? scoredKnowledge[0].knowledge : null;
}

// Tentukan tipe respons yang dibutuhkan
function determineResponseType(text, isQuestion, isJoke) {
  let type = '';
  
  if (isJoke) {
    type = 'joke';
  } else if (isQuestion) {
    if (text.toLowerCase().includes('apa') || 
        text.toLowerCase().includes('siapa') || 
        text.toLowerCase().includes('kapan') || 
        text.toLowerCase().includes('dimana') ||
        text.toLowerCase().includes('dmn') ||
        text.toLowerCase().includes('apakah')) {
      type = 'factual_question';
    } else if (text.toLowerCase().includes('bagaimana') || 
              text.toLowerCase().includes('gimana') || 
              text.toLowerCase().includes('gmn') || 
              text.toLowerCase().includes('caranya') ||
              text.toLowerCase().includes('cara') ||
              text.toLowerCase().includes('how')) {
      type = 'how_question';
    } else if (text.toLowerCase().includes('mengapa') || 
              text.toLowerCase().includes('kenapa') || 
              text.toLowerCase().includes('why') ||
              text.toLowerCase().includes('knp')) {
      type = 'why_question';
    } else {
      type = 'general_question';
    }
  } else if (text.toLowerCase().includes('ceritakan') || 
            text.toLowerCase().includes('cerita') ||
            text.toLowerCase().includes('jelaskan') ||
            text.toLowerCase().includes('jelasin')) {
    type = 'storytelling';
  } else if (text.toLowerCase().includes('pendapat') || 
            text.toLowerCase().includes('menurutmu') ||
            text.toLowerCase().includes('menurut kamu') ||
            text.toLowerCase().includes('menurut lo') ||
            text.toLowerCase().includes('menurut lu')) {
    type = 'opinion';
  } else if (text.match(/\b(ha(ha)+|wk(wk)+|xi(xi)+)\b/i)) {
    type = 'laughing';
  }
  
  // Tambahkan konteks chat
  if (text.includes('private_chat')) {
    type += '_private';
  } else {
    type += '_group';
  }
  
  return type || 'conversation';
}

// Buat respons dinamis yang terdengar alami dan gaul
function createDynamicResponse(knowledge, query, context, responseType, userStyle) {
  const content = knowledge.content;
  
  // Jika ini pengetahuan awal, bisa langsung digunakan dengan beberapa variasi
  if (knowledge.source === 'initial_knowledge') {
    return addGaulNaturalVariations(content, responseType, userStyle || 'normal');
  }
  
  // Untuk learned content, lakukan lebih banyak modifikasi
  let response = content;
  
  // Hindari mengembalikan pertanyaan sebagai jawaban
  if (knowledge.isQuestion && response.includes('?')) {
    // Buang tanda tanya dan buat jadi pernyataan
    response = response.replace(/\?/g, '') + '.';
    response = response.replace(/\b(apa|siapa|kapan|dimana|bagaimana|mengapa|kenapa|gimana)\b/i, '');
  }
  
  // Tambahkan awareness konteks jika ini percakapan
  if (context && context.length > 0 && responseType.includes('conversation')) {
    const lastMessage = context[context.length - 1];
    const continuityPhrases = [
      `Soal itu, ${response}`,
      `Kalo ngomongin itu, ${response}`,
      `Btw, ${response}`,
      `Oh, ${response}`,
      `Jadi gini, ${response}`
    ];
    
    // 30% chance untuk menambahkan phrase konteks jika sesuai
    if (Math.random() < 0.3) {
      const phrase = continuityPhrases[Math.floor(Math.random() * continuityPhrases.length)];
      return addGaulNaturalVariations(phrase, responseType, userStyle || 'normal');
    }
  }
  
  return addGaulNaturalVariations(response, responseType, userStyle || 'normal');
}

// Tambahkan variasi natural style gaul ke respon
function addGaulNaturalVariations(text, responseType, userStyle) {
  // Split teks jadi kalimat
  let sentences = text.split(/(?<=[.!?])\s+/);
  if (sentences.length === 0) return text;
  
  // Jika userStyle formal, kurangi efek gaul
  const gaulLevel = userStyle === 'formal' ? 0.2 : (userStyle === 'gaul' ? 0.9 : 0.6);
  
  // Define style untuk berbagai tipe respons
  const responseStyles = {
    factual_question: [
      "Setahu gw, ", 
      "Dari yang gue tau nih, ", 
      "Kalo ga salah sih, ",
      "Hmm, kayaknya ", 
      "CMIIW ya, tapi "
    ],
    how_question: [
      "Jadi gini, ", 
      "Cara nya tuh, ",
      "Gini loh, ", 
      "Bisa banget, caranya: "
    ],
    why_question: [
      "Karena ya, ", 
      "Itu karena, ",
      "Nah alasannya, ", 
      "Hmm, jadi gini, "
    ],
    general_question: [
      "Hmm, menarik nih. ", 
      "Well, ", 
      "Kalo itu sih, ",
      "Jadi ya, "
    ],
    storytelling: [
      "Jadi ceritanya, ", 
      "Gini nih, ", 
      "Oke jadi, ",
      "Singkat cerita, "
    ],
    opinion: [
      "Menurut gue sih, ", 
      "IMO ya, ", 
      "Kalo menurut gw, ",
      "Pandangan gue, ",
      "Gue rasa sih, "
    ],
    joke: [
      "Wkwkwk ", 
      "Hahaha ", 
      "LMAO ", 
      "Receh sih, tapi ",
      "Njir, "
    ],
    laughing: [
      "Wkwkwk ", 
      "Hahaha iya ya", 
      "LMAO bener banget", 
      "Ngakak gw",
      "Xixi iya", 
      "Wkwkwk gokil"
    ],
    conversation: [
      "", // Kadang tanpa prefix
      "Hmm, ", 
      "Btw, ", 
      "Well, ",
      "Oh, ",
      "Anyway, "
    ]
  };
  
  // Pilih style random yang sesuai dengan response type
  const styles = responseStyles[responseType.split('_')[0]] || responseStyles.conversation;
  const selectedStyle = styles[Math.floor(Math.random() * styles.length)];
  
  // Modifikasi teks utama dengan bahasa gaul (jika level gaul tinggi)
  if (Math.random() < gaulLevel) {
    // Replace beberapa kata dengan versi gaul
    for (const [formal, gaulOptions] of Object.entries(gaulDictionary.slang)) {
      const regex = new RegExp(`\\b${formal}\\b`, 'gi');
      // Randomly select a gaul version
      if (text.match(regex) && Math.random() < gaulLevel) {
        const gaulWord = gaulOptions[Math.floor(Math.random() * gaulOptions.length)];
        text = text.replace(regex, gaulWord);
      }
    }
  }
  
  // Tambahkan akhiran kalimat gaul (40% chance jika level gaul tinggi)
  if (Math.random() < gaulLevel * 0.6) {
    const ending = gaulDictionary.endingExpressions[Math.floor(Math.random() * gaulDictionary.endingExpressions.length)];
    text = text.replace(/[.!?]$/, '') + ending + '.';
  }
  
  // Tambahkan emoji (60% chance jika level gaul tinggi)
  if (Math.random() < gaulLevel * 0.8) {
    const emoji = gaulDictionary.emojis[Math.floor(Math.random() * gaulDictionary.emojis.length)];
    // Posisikan emoji di awal, tengah, atau akhir
    const position = Math.random();
    if (position < 0.3) {
      text = emoji + ' ' + text;
    } else if (position < 0.7) {
      text = text.replace(/[.!?]$/, '') + ' ' + emoji;
    } else {
      // Coba posisikan di tengah kalimat
      const parts = text.split(' ');
      if (parts.length > 3) {
        const middleIndex = Math.floor(parts.length / 2);
        parts.splice(middleIndex, 0, emoji);
        text = parts.join(' ');
      } else {
        text = text + ' ' + emoji;
      }
    }
  }
  
  // 70% chance untuk menambahkan prefix style
  if (Math.random() < 0.7) {
    return selectedStyle + text;
  }
  
  return text;
}

// Buat fallback response ketika tidak ada knowledge match
function createFallbackResponse(query, context, isQuestion, userStyle) {
  const gaulLevel = userStyle === 'formal' ? 0.2 : (userStyle === 'gaul' ? 0.9 : 0.6);
  
  const learningResponses = [
    "Hmm, menarik nih. Bisa cerita lebih lengkap ga?",
    "Wah, gue masih belajar soal ini nih. Bisa jelasin lebih detail?",
    "Kayaknya gue perlu belajar lebih banyak soal ini. Ceritain dong lebih banyak",
    "Gue lagi nyoba ngerti soal ini. Ada info tambahan yang bisa lo kasih?",
    "Ini baru buat gue. Seneng bisa belajar lebih banyak dari lo soal ini.",
    "Asik nih topiknya, tapi gue masih kurang info. Bisa sharing lebih?",
    "Aduh, gue gak terlalu paham soal ini. Ajarin gue dong~",
    "Ini masih agak blur buat gue. Bisa kasih pencerahan?"
  ];
  
  const questionResponses = [
    "Pertanyaan bagus! Cuma gue belum punya cukup info nih. Menurut lo gimana?",
    "Gue masih ngumpulin data soal itu. Kalo menurut lo sendiri gimana?",
    "Hmm, gue perlu belajar lebih banyak buat jawab itu dengan bener. Ada ide lo?",
    "Gue masih proses belajar buat jawab itu. Lo sendiri gimana mikirnya?",
    "Pertanyaan menarik! Tp jujur gue blm bs jawab skrg. Menurut lo gmn?"
  ];
  
  const conversationResponses = [
    "Menarik! Cerita lebih dong",
    "Oh gitu, terus gmn?",
    "Wah oke, ada lagi yg mau diomongin?",
    "I see. Ada hal lain yg mau dibahas?",
    "Hmm, jadi penasaran. Next?",
    "Oh gitu toh. Anyway, ada topik lain?"
  ];
  
  let responses;
  if (isQuestion) {
    responses = questionResponses;
  } else if (context && context.length > 0) {
    responses = conversationResponses;
  } else {
    responses = learningResponses;
  }
  
  let response = responses[Math.floor(Math.random() * responses.length)];
  
  // Tambahkan emoji (70% chance jika level gaul tinggi)
  if (Math.random() < gaulLevel * 0.7) {
    const emoji = gaulDictionary.emojis[Math.floor(Math.random() * gaulDictionary.emojis.length)];
    // Posisikan emoji di awal atau akhir
    if (Math.random() < 0.5) {
      response = emoji + ' ' + response;
    } else {
      response = response + ' ' + emoji;
    }
  }
  
  return response;
}

// Handler saat bot dimasukkan ke grup baru
async function handleBotAddedToGroup(ctx) {
  const groupId = ctx.chat.id.toString();
  const groupTitle = ctx.chat.title || 'Group Chat';
  const addedBy = ctx.from?.username || ctx.from?.first_name || 'someone';
  
  try {
    // Simpan info grup ke database
    await groupsCollection.updateOne(
      { groupId },
      {
        $set: {
          title: groupTitle,
          joinedAt: new Date(),
          lastActivity: new Date(),
          addedBy
        },
        $setOnInsert: {
          messageCount: 0,
          memberCount: await ctx.getChatMembersCount()
        }
      },
      { upsert: true }
    );
    
    // Simpan ke memory
    groupsInfo.set(groupId, {
      title: groupTitle,
      joinedAt: new Date(),
      lastActivity: new Date(),
      addedBy
    });
    
    logger.info(`Bot ditambahkan ke grup: ${groupTitle} (${groupId}) oleh ${addedBy}`);
    
    // Tunggu sebentar dan kirim pesan sambutan natural
    setTimeout(async () => {
      // Simulasi typing
      await ctx.replyWithChatAction('typing');
      
      // Pilih pesan sambutan acak dan gaul
      const greetings = [
        `Hai semuanya! Makasih udah nambahin gue ke grup ${groupTitle}! 🤗 Gue bot yang terus belajar dari percakapan. Semakin banyak kalian ngobrol, gue bakal makin pinter!`,
        
        `Halo guys! Salam kenal semuanya di grup ${groupTitle}! 👋 Gue AI yang dibuat @hiyaok, yang bakal belajar dari obrolan kalian. Mention @${bot.botInfo.username} kalo butuh bantuan ya!`,
        
        `Yuhuuu! Akhirnya gue join juga di ${groupTitle}! 🥳 Btw, gue bakal belajar dari percakapan kalian, jadi santai aja ngobrolnya. Mau tanya sesuatu? Mention gue aja ya!`,
        
        `Hola geng ${groupTitle}! 😎 Makasih @${addedBy} udah invite gue! Gue bot yang bisa belajar dari semua obrolan di grup. Makin sering kalian chat, makin pinter gue!`,
        
        `Heyy! Salam kenal semuanya di ${groupTitle}! ✌️ Gue bot AI yang terus belajar. Kalo mau nanya atau ngobrol, tag gue ya pake @${bot.botInfo.username}. Let's have fun!`
      ];
      
      const greeting = greetings[Math.floor(Math.random() * greetings.length)];
      
      // Kirim sambutan
      await ctx.reply(greeting);
    }, 2000); // Delay 2 detik agar terlihat natural
  } catch (err) {
    logger.error('Error handling bot added to group:', err);
  }
}

// Admin commands handler
async function handleAdminCommand(ctx, command) {
  const userId = ctx.message.from.id.toString();
  
  // Cek apakah user ID sama dengan ADMIN_USER_ID dari env
  if (userId !== ADMIN_USER_ID) {
    return ctx.reply("Maaf, hanya admin yang bisa menggunakan perintah ini.");
  }
  
  if (command === "stats") {
    try {
      // Show typing indicator
      await ctx.replyWithChatAction('typing');
      
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
          `Memori aktif: <b>${activeConversations.size}</b> obrolan\n\n` +
          
          `📈 <b>Top Kategori:</b>\n` +
          topCategories.map(cat => `- ${cat._id}: ${cat.count} item`).join('\n') + `\n\n` +
          
          `👥 <b>Grup Teraktif:</b>\n` +
          topGroups.map(g => `- ${g.title}: ${g.messageCount} pesan`).join('\n'),
          { parse_mode: 'HTML' }
        );
      }, 1000);
    } catch (err) {
      logger.error('Stats error:', err);
      return ctx.reply("Gagal mengambil statistik.");
    }
  } else if (command.startsWith("reset")) {
    if (command === "reset all") {
      try {
        await ctx.replyWithChatAction('typing');
        
        await knowledgeCollection.deleteMany({ source: { $ne: 'initial_knowledge' } });
        await contextMemoryCollection.deleteMany({});
        activeConversations.clear();
        
        setTimeout(async () => {
          await ctx.reply("Reset pengetahuan dan memori berhasil. Hanya pengetahuan awal yang dipertahankan.");
        }, 1500);
      } catch (err) {
        logger.error('Reset error:', err);
        return ctx.reply("Gagal melakukan reset.");
      }
    } else if (command === "reset memory") {
      try {
        await ctx.replyWithChatAction('typing');
        
        await contextMemoryCollection.deleteMany({});
        activeConversations.clear();
        
        setTimeout(async () => {
          await ctx.reply("Reset memori percakapan berhasil.");
        }, 1000);
      } catch (err) {
        logger.error('Reset memory error:', err);
        return ctx.reply("Gagal melakukan reset memori.");
      }
    }
  } else if (command.startsWith("broadcast")) {
    const message = command.replace("broadcast", "").trim();
    if (!message) {
      return ctx.reply("Format: /admin broadcast [pesan]");
    }
    
    try {
      await ctx.replyWithChatAction('typing');
      
      // Get all groups
      const groups = await groupsCollection.find().toArray();
      let sentCount = 0;
      let failedCount = 0;
      
      for (const group of groups) {
        try {
          await bot.telegram.sendMessage(group.groupId, message);
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
      logger.error('Broadcast error:', err);
      return ctx.reply("Gagal melakukan broadcast.");
    }
  }
}

// Bot commands setup
bot.command('start', async (ctx) => {
  const userId = ctx.message.from.id.toString();
  const username = ctx.message.from.username || ctx.message.from.first_name || 'unknown';
  const isPrivate = ctx.chat.type === 'private';
  
  try {
    // Show typing indicator
    await ctx.replyWithChatAction('typing');
    
    // Update user profile
    await userProfilesCollection.updateOne(
      { userId },
      { 
        $set: { 
          lastActive: new Date(),
          username,
          startedAt: new Date()
        }
      },
      { upsert: true }
    );
    
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
  } catch (err) {
    logger.error('Error in start command:', err);
    await ctx.reply("Hai! Ada masalah teknis, tapi aku tetap bisa bantu. Ada yang bisa dibantu?");
  }
});

bot.command('help', async (ctx) => {
  try {
    // Show typing indicator
    await ctx.replyWithChatAction('typing');
    
    setTimeout(async () => {
      await ctx.reply(
        "🤖 <b>Bantuan Penggunaan Bot</b>\n\n" +
        "• Aku belajar dari setiap percakapan di grup dan chat pribadi\n" +
        "• Di grup: mention aku dengan @" + bot.botInfo.username + " untuk mendapat respon\n" +
        "• Di chat pribadi: langsung chat aja, gak perlu mention\n" +
        "• Aku merespon dengan gaya natural dan ekspresif\n\n" +
        "Perintah yang tersedia:\n" +
        "/start - Memulai percakapan dengan bot\n" +
        "/help - Menampilkan bantuan ini\n" +
        "/about - Informasi tentang bot\n\n" +
        "Makin banyak kalian ngobrol, makin pinter aku! 😎",
        { parse_mode: 'HTML' }
      );
    }, 1000);
  } catch (err) {
    logger.error('Error in help command:', err);
    await ctx.reply("Bantuan: Mention aku di grup atau langsung chat di private untuk ngobrol. Makin banyak interaksi, makin pinter aku!");
  }
});

bot.command('about', async (ctx) => {
  try {
    // Show typing indicator
    await ctx.replyWithChatAction('typing');
    
    setTimeout(async () => {
      await ctx.reply(
        "Gue adalah AI buatan @hiyaok, yang dirancang untuk belajar terus menerus dan ngobrol dengan gaya yang natural! 🤖✨\n\n" +
        "Gue belajar dari setiap interaksi, baik di grup maupun chat pribadi. Pengetahuan gue terus nambah seiring waktu.\n\n" +
        "Gue bisa diajak bahas berbagai topik dan selalu berusaha kasih respons yang asik, bukan jawaban kaku dari template.\n\n" +
        "Semakin sering kita ngobrol, semakin gue bisa nyesuaiin sama gaya lo!"
      );
    }, 1200);
  } catch (err) {
    logger.error('Error in about command:', err);
    await ctx.reply("Gue bot AI buatan @hiyaok yang belajar dari percakapan! Makin banyak kita ngobrol, makin pinter gue!");
  }
});

// Admin commands
bot.command('admin', async (ctx) => {
  const text = ctx.message.text;
  const command = text.replace('/admin', '').trim();
  
  if (command) {
    await handleAdminCommand(ctx, command);
  } else {
    await ctx.reply(
      "🔐 Admin commands:\n" +
      "/admin stats - Tampilkan statistik bot\n" +
      "/admin reset memory - Reset memori percakapan\n" +
      "/admin reset all - Reset semua pengetahuan (kecuali pengetahuan awal)\n" +
      "/admin broadcast [pesan] - Kirim pesan ke semua grup"
    );
  }
});

// Handler ketika bot ditambahkan ke grup
bot.on('new_chat_members', async (ctx) => {
  // Cek apakah bot yang ditambahkan
  const newMembers = ctx.message.new_chat_members;
  const botAdded = newMembers.some(member => member.id === bot.botInfo.id);
  
  if (botAdded) {
    await handleBotAddedToGroup(ctx);
  }
});

// Handler untuk semua pesan teks
bot.on(message('text'), async (ctx) => {
  try {
    // Jangan proses pesan dari bot lain
    if (ctx.message.from.is_bot) return;
    
    const text = ctx.message.text;
    const isGroupChat = ctx.chat.type === 'group' || ctx.chat.type === 'supergroup';
    const isMentioned = ctx.message.entities?.some(entity => 
      entity.type === 'mention' && text.slice(entity.offset, entity.offset + entity.length).includes(bot.botInfo.username)
    );
    const isReply = ctx.message.reply_to_message?.from.id === bot.botInfo.id;
    const isPrivateChat = ctx.chat.type === 'private';
    
    // Proses admin commands
    if (text.startsWith('/admin')) {
      return; // Sudah ditangani oleh handler command
    }
    
    // Proses dan pelajari SEMUA pesan di grup DAN chat pribadi
    await learnFromMessage(ctx.message, ctx);
    
    // Hanya respon jika di-mention, direply, atau di private chat
    if (isMentioned || isReply || isPrivateChat) {
      // Bersihkan teks dari mention
      let cleanText = text;
      if (isMentioned && bot.botInfo.username) {
        cleanText = cleanText.replace(new RegExp(`@${bot.botInfo.username}`, 'gi'), '').trim();
      }
      
      // Tunjukkan indikator mengetik untuk efek natural
      await ctx.replyWithChatAction('typing');
      
      // Generate response (dengan delay acak untuk efek lebih natural)
      const typingDelay = Math.random() * 2000 + 1000; // 1-3 detik
      
      setTimeout(async () => {
        const { text: responseText } = await generateResponse(cleanText, ctx);
        
        try {
          // Reply langsung ke pesan user
          await ctx.reply(responseText, { reply_to_message_id: ctx.message.message_id });
        } catch (err) {
          logger.error('Error sending response:', err);
          // Fallback, coba kirim tanpa reply
          await ctx.reply(responseText);
        }
      }, typingDelay);
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

// Handler pertanyaan tentang identitas bot
bot.hears(/siapa (kamu|lo|lu|elu|kau)|who are you|tentang (kamu|lo|lu|elo|kau)|about you|kamu siapa|dirimu|siapakah kamu/i, async (ctx) => {
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
    logger.error('Error in identity response:', err);
    await ctx.reply("Gue bot AI buatan @hiyaok yang terus belajar dari percakapan!");
  }
});

// Error handling
bot.catch((err, ctx) => {
  logger.error('Bot error:', err);
  try {
    ctx.reply("Aduh, ada error nih. Coba lagi nanti ya!");
  } catch (replyErr) {
    logger.error('Error sending error message:', replyErr);
  }
});

// Start bot
async function startBot() {
  try {
    // Connect to MongoDB first
    await connectToMongoDB();
    
    // Get bot info
    await bot.telegram.getMe().then((botInfo) => {
      bot.botInfo = botInfo;
      logger.info(`Bot started as @${botInfo.username}`);
    });
    
    // Launch bot
    await bot.launch();
    logger.info('Bot running...');
    
    // Log launch time
    logger.info(`Bot launched at ${new Date().toISOString()}`);
  } catch (err) {
    logger.error('Failed to start bot:', err);
    process.exit(1);
  }
}

// Enable graceful shutdown
process.once('SIGINT', () => {
  logger.info('SIGINT signal received, shutting down bot...');
  bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  logger.info('SIGTERM signal received, shutting down bot...');
  bot.stop('SIGTERM');
});

// Start the bot
startBot();