// utils/text-processor.js
// Modul untuk memproses dan menganalisis teks

const natural = require('natural');
const { WordTokenizer, PorterStemmer, TfIdf } = natural;
const _ = require('lodash');
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
    new winston.transports.File({ filename: 'text-processor.log' })
  ]
});

// Inisialisasi tokenizer
const tokenizer = new WordTokenizer();

// Daftar stopwords Indonesia
const STOPWORDS = [
  "yang", "dan", "di", "dengan", "dari", "untuk", "pada", "adalah", "ini", "itu", 
  "atau", "juga", "ke", "ada", "saya", "kamu", "dia", "mereka", "kita", "kami", 
  "akan", "sudah", "telah", "bisa", "dapat", "harus", "boleh", "mau", "ingin",
  "tidak", "tak", "bukan", "belum", "oleh", "si", "sang", "nya", "tersebut",
  "seperti", "sebagai", "dalam", "tentang", "secara", "karena", "sehingga",
  "maka", "saat", "ketika", "bila", "jika", "kalau", "agar", "supaya",
  "lalu", "kemudian", "setelah", "sebelum", "sejak", "hingga", "sampai",
  "selama", "bahwa", "walaupun", "meskipun", "yakni", "yaitu", "sedangkan",
  "padahal", "namun", "tetapi", "pun", "lah", "pula", "lagi", "ya", "sih",
  "kok", "deh", "oh", "eh", "ah", "lho", "dong", "kan", "nih", "tuh", "per", "yg"
];

// Pola untuk deteksi emoji
const EMOJI_PATTERN = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

// Pola-pola topik untuk kategorisasi teks
const TOPIC_PATTERNS = [
  { pattern: /\b(teknologi|komputer|internet|aplikasi|software|program|coding|web|website|hp|handphone|ponsel|gadget|laptop|android|ios|iphone|samsung|xiaomi)\b/i, topic: 'teknologi' },
  { pattern: /\b(politik|pemerintah|negara|demokrasi|pemilu|presiden|dpr|mpr|pilkada|gubernur|walikota|bupati|menteri|kabinet|korupsi|partai)\b/i, topic: 'politik' },
  { pattern: /\b(film|bioskop|movie|cinema|nonton|netflix|series|drama|actor|actress|aktor|aktris|sutradara|produser|hollywood|marvel|dc|anime|drakor)\b/i, topic: 'film' },
  { pattern: /\b(musik|lagu|konser|band|penyanyi|singer|album|playlist|spotify|dangdut|kpop|pop|rock|jazz|metal|lirik|chord|gitar|piano|drum|bass)\b/i, topic: 'musik' },
  { pattern: /\b(sejarah|kerajaan|perang|masa\s?lalu|zaman\s?dulu|kuno|ancient|bersejarah|majapahit|sriwijaya|mataram|kolonial|belanda|jepang|kemerdekaan)\b/i, topic: 'sejarah' },
  { pattern: /\b(makanan|minuman|kuliner|restoran|resto|cafe|masak|masakan|menu|rasa|resep|food|drink|restaurant|warung|kedai|makan|minum|lezat|enak|gurih|pedas|manis)\b/i, topic: 'kuliner' },
  { pattern: /\b(game|gaming|gamer|main\s?game|steam|esport|mobile\s?legend|pubg|ml|ff|free\s?fire|valorant|dota|moba|battle\s?royale|console|ps5|playstation|xbox)\b/i, topic: 'games' },
  { pattern: /\b(sekolah|kuliah|pendidikan|guru|dosen|pelajar|siswa|mahasiswa|mapel|ujian|tugas|pr|education|study|studying|kampus|universitas|fakultas|jurusan)\b/i, topic: 'pendidikan' },
  { pattern: /\b(bisnis|usaha|jualan|dagang|ekonomi|investasi|saham|forex|crypto|uang|duit|cuan|passive\s?income|modal|profit|untung|rugi|bankrupt|bangkrut|startup)\b/i, topic: 'bisnis' },
  { pattern: /\b(kesehatan|sehat|penyakit|sakit|dokter|rumah\s?sakit|rs|obat|vitamin|workout|exercise|diet|gym|virus|covid|corona|pandemi|vaksin|imun|antibodi)\b/i, topic: 'kesehatan' },
  { pattern: /\b(olahraga|sepak\s?bola|basket|voli|badminton|renang|lari|marathon|sport|bola|football|soccer|basketball|bulutangkis|atletik|tinju|boxing)\b/i, topic: 'olahraga' },
  { pattern: /\b(liburan|wisata|travel|jalan-jalan|piknik|vacation|holiday|pantai|gunung|beach|mountain|hotel|resort|villa|trip|bali|lombok|jogja|bandung|malang)\b/i, topic: 'travel' },
  { pattern: /\b(anime|manga|wibu|otaku|cosplay|japan|jepang|naruto|one\s?piece|boruto|bleach|dragon\s?ball|jujutsu|demon\s?slayer|attack\s?on\s?titan|haikyuu)\b/i, topic: 'anime' },
  { pattern: /\b(gosip|artis|selebritis|infotainment|celebrity|viral|trending|hot\s?news|berita|kabar|skandal|affair|selingkuh|nikah|cerai|pacaran|putus)\b/i, topic: 'gosip' },
  { pattern: /\b(relationship|hubungan|pacar|pacaran|cinta|love|gebetan|pdkt|jodoh|nikah|married|pernikahan|cerai|putus|selingkuh|bucin|friendzone|toxic)\b/i, topic: 'relationship' },
  { pattern: /\b(bahasa|kata|kalimat|grammar|vocabulary|kosakata|slang|gaul|formal|baku|alay|translate|terjemah|inggris|indonesia|daerah|jawa|sunda|batak)\b/i, topic: 'bahasa' },
  { pattern: /\b(agama|religi|tuhan|allah|islam|muslim|kristen|katolik|hindu|buddha|konghucu|doa|ibadah|sholat|puasa|haji|umroh|misa|puja|karma|dosa)\b/i, topic: 'agama' },
  { pattern: /\b(fashion|baju|celana|sepatu|sandal|tas|dompet|pakaian|outfit|style|gaya|brand|merk|thrift|thrifting|branded|design|model|kaos|kemeja|dress)\b/i, topic: 'fashion' },
  { pattern: /\b(beauty|makeup|skincare|kosmetik|perawatan|wajah|kulit|rambut|facial|hair|face|skin|cream|serum|toner|maskara|lipstik|foundation|bedak)\b/i, topic: 'beauty' },
  { pattern: /\b(otomotif|mobil|motor|kendaraan|mesin|bengkel|oli|ban|velg|knalpot|modifikasi|modif|racing|balap|drift|sport|toyota|honda|yamaha|suzuki)\b/i, topic: 'otomotif' }
];

// Pola untuk deteksi bahasa formal vs gaul
const GAUL_PATTERNS = /(gue|lu|elo|coy|bro|sis|guys|wkwk|xixi|btw|otw|fyi|lol|yoi|gitu|sih|dong|banget|parah|anjay|dah|udah|gak|ga|nggak|ngga|mager|yaudah|gapapa|gada|weh|aje|aja)/i;
const FORMAL_PATTERNS = /(saya|anda|bapak|ibu|mereka|menurut|sebagaimana|oleh\s?karena\s?itu|sehingga|terima\s?kasih|mohon|harap|berkenan|perihal|sesuai|sebagaimana|demikian)/i;

// Pola untuk tipe pertanyaan
const QUESTION_PATTERNS = {
  factual: /\b(apa|siapa|kapan|dimana|dmn|apakah)\b/i,
  how: /\b(bagaimana|gimana|gmn|caranya|cara|how)\b/i,
  why: /\b(mengapa|kenapa|why|knp)\b/i,
  yesno: /\b(apakah|bukankah|akankah|haruskah|bolehkah|mungkinkah)\b/i
};

// Kamus sentimen (sample, bisa diperluas)
const SENTIMENT_WORDS = {
  positive: [
    "baik", "senang", "bagus", "suka", "bahagia", "indah", "berhasil", "sukses", "cinta", "hebat",
    "mantap", "mantul", "keren", "asik", "asikk", "cool", "top", "oke", "love", "nice", "bersyukur",
    "bangga", "menarik", "enak", "lezat", "ramah", "santai", "relax", "nyaman", "sejuk", "segar",
    "semangat", "optimis", "antusias", "gembira", "ceria", "lucu", "ngakak", "tertawa", "damai",
    "membantu", "membanggakan", "memuaskan", "luar biasa", "spektakuler", "kece", "jempolan"
  ],
  negative: [
    "buruk", "sedih", "jelek", "benci", "marah", "gagal", "rugi", "sakit", "susah", "masalah",
    "parah", "payah", "burik", "cupu", "kampungan", "bego", "bodoh", "suram", "bad", "hancur",
    "menyebalkan", "kesal", "frustasi", "kecewa", "menyedihkan", "menderita", "lelah", "capek",
    "bosan", "jenuh", "malas", "sulit", "rumit", "membingungkan", "tersinggung", "kasar", "kejam",
    "jahat", "menyakitkan", "mengerikan", "sebal", "jengkel", "bête", "bt", "gondok", "sebel"
  ]
};

/**
 * Ekstrak keywords dari teks
 * @param {string} text - Teks yang akan diproses
 * @param {number} maxKeywords - Jumlah maksimum keyword yang akan dikembalikan
 * @returns {Array} Array berisi keyword
 */
function extractKeywords(text, maxKeywords = 8) {
  if (!text || text.length < 3) return [];
  
  try {
    // Tokenize teks
    const tokens = tokenizer.tokenize(text.toLowerCase());
    
    // Filter stopwords dan token pendek
    let filteredTokens = tokens.filter(token => 
      token.length > 2 && !STOPWORDS.includes(token)
    );
    
    // Jika tidak ada token yang tersisa setelah filtering
    if (filteredTokens.length === 0) {
      // Gunakan token asli tanpa filtering stopwords, tapi tetap minimal 3 karakter
      filteredTokens = tokens.filter(token => token.length > 2);
    }
    
    // Gunakan TF-IDF untuk mengidentifikasi terms penting
    const tfidf = new TfIdf();
    tfidf.addDocument(filteredTokens);
    
    // Dapatkan top keywords
    const keywords = tfidf.listTerms(0)
      .slice(0, maxKeywords)
      .map(term => term.term);
    
    return keywords;
  } catch (err) {
    logger.error('Error extracting keywords:', err);
    return [];
  }
}

/**
 * Analisis teks untuk deteksi sentimen, topik, pertanyaan, dll
 * @param {string} text - Teks yang akan dianalisis
 * @returns {Object} Hasil analisis
 */
function analyzeText(text) {
  if (!text) return { 
    sentiment: 'neutral', 
    topics: [], 
    isQuestion: false,
    style: 'normal',
    hasEmoji: false,
    questionType: null
  };
  
  try {
    // Deteksi pertanyaan
    const isQuestion = text.includes('?') || 
                      Object.values(QUESTION_PATTERNS).some(pattern => pattern.test(text));
    
    // Deteksi tipe pertanyaan jika ini pertanyaan
    let questionType = null;
    if (isQuestion) {
      if (QUESTION_PATTERNS.factual.test(text)) {
        questionType = 'factual';
      } else if (QUESTION_PATTERNS.how.test(text)) {
        questionType = 'how';
      } else if (QUESTION_PATTERNS.why.test(text)) {
        questionType = 'why';
      } else if (QUESTION_PATTERNS.yesno.test(text)) {
        questionType = 'yesno';
      } else {
        questionType = 'general';
      }
    }
    
    // Analisis sentimen sederhana
    let sentiment = 'neutral';
    const words = text.toLowerCase().split(/\s+/);
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (SENTIMENT_WORDS.positive.some(pos => word.includes(pos))) positiveCount++;
      if (SENTIMENT_WORDS.negative.some(neg => word.includes(neg))) negativeCount++;
    });
    
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';
    
    // Deteksi topik
    const topics = [];
    TOPIC_PATTERNS.forEach(({ pattern, topic }) => {
      if (pattern.test(text)) {
        topics.push(topic);
      }
    });
    
    // Deteksi bahasa formal vs gaul
    let style = 'normal';
    if (GAUL_PATTERNS.test(text)) {
      style = 'gaul';
    } else if (FORMAL_PATTERNS.test(text)) {
      style = 'formal';
    }
    
    // Deteksi emoji
    const hasEmoji = EMOJI_PATTERN.test(text);
    
    // Deteksi konten meme/jokes
    const isJoke = /\b(joke|jokes|meme|memes|lucu|humor|funny|komedi|comedy|lawak|lelucon|receh|dagelan|ngakak)\b/i.test(text);
    
    return { 
      sentiment, 
      topics, 
      isQuestion, 
      style, 
      hasEmoji, 
      questionType,
      isJoke
    };
  } catch (err) {
    logger.error('Error analyzing text:', err);
    return { 
      sentiment: 'neutral', 
      topics: [], 
      isQuestion: false,
      style: 'normal',
      hasEmoji: false,
      questionType: null,
      isJoke: false
    };
  }
}

/**
 * Bersihkan teks dari karakter-karakter khusus, dll.
 * @param {string} text - Teks yang akan dibersihkan
 * @returns {string} Teks yang sudah dibersihkan
 */
function cleanText(text) {
  if (!text) return '';
  
  try {
    // Hapus karakter non-alfanumerik kecuali spasi dan tanda baca umum
    let cleaned = text.replace(/[^\p{L}\p{N}\s.,!?;:'"()-]/gu, '');
    
    // Hapus multiple spaces
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    return cleaned;
  } catch (err) {
    logger.error('Error cleaning text:', err);
    return text;
  }
}

/**
 * Deteksi bahasa yang digunakan dalam teks
 * @param {string} text - Teks yang akan dideteksi bahasanya
 * @returns {string} Kode bahasa (id, en, mix)
 */
function detectLanguage(text) {
  if (!text) return 'unknown';
  
  try {
    // Pola kata-kata dalam Bahasa Indonesia
    const idWords = /\b(yang|dan|di|dengan|dari|untuk|pada|adalah|ini|itu|atau|juga|ke|ada|saya|kamu|dia|mereka|kita|kami|akan|sudah|telah|bisa|dapat|harus|boleh|mau|ingin)\b/i;
    
    // Pola kata-kata dalam Bahasa Inggris
    const enWords = /\b(the|and|in|on|at|with|from|for|to|is|are|am|was|were|be|been|being|have|has|had|do|does|did|will|would|should|could|can|may|might)\b/i;
    
    const idCount = (text.match(idWords) || []).length;
    const enCount = (text.match(enWords) || []).length;
    
    if (idCount > enCount) return 'id';
    if (enCount > idCount) return 'en';
    if (idCount > 0 && enCount > 0) return 'mix';
    
    // Jika tidak terdeteksi pola spesifik, gunakan distribusi karakter
    const idChars = /[àáèéìíòóùúëïü]/g;
    const enChars = /[qwertyuiopasdfghjklzxcvbnm]/gi;
    
    const idCharCount = (text.match(idChars) || []).length;
    const enCharCount = (text.match(enChars) || []).length;
    
    if (idCharCount > enCharCount) return 'id';
    return 'en';
  } catch (err) {
    logger.error('Error detecting language:', err);
    return 'unknown';
  }
}

/**
 * Tentukan tipe respons yang dibutuhkan berdasarkan teks
 * @param {string} text - Teks input
 * @param {boolean} isQuestion - Apakah teks merupakan pertanyaan
 * @param {boolean} isJoke - Apakah teks merupakan joke/meme
 * @returns {string} Tipe respons
 */
function determineResponseType(text, isQuestion, isJoke) {
  let type = '';
  
  if (isJoke) {
    type = 'joke';
  } else if (isQuestion) {
    if (QUESTION_PATTERNS.factual.test(text)) {
      type = 'factual_question';
    } else if (QUESTION_PATTERNS.how.test(text)) {
      type = 'how_question';
    } else if (QUESTION_PATTERNS.why.test(text)) {
      type = 'why_question';
    } else if (QUESTION_PATTERNS.yesno.test(text)) {
      type = 'yesno_question';
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
  } else if (text.match(/\b(makasih|thanks|thx|tq|terima\s?kasih)\b/i)) {
    type = 'gratitude';
  } else if (text.match(/\b(maaf|sorry|sori|apologize|apologise)\b/i)) {
    type = 'apology';
  } else if (text.match(/\b(halo|hai|hello|hi|hey|hola|assalamualaikum|selamat|pagi|siang|sore|malam)\b/i)) {
    type = 'greeting';
  }
  
  // Tambahkan konteks chat
  if (text.includes('private_chat')) {
    type += '_private';
  } else {
    type += '_group';
  }
  
  return type || 'conversation';
}

/**
 * Cek apakah teks membicarakan tentang bot
 * @param {string} text - Teks yang akan diperiksa
 * @param {string} botUsername - Username bot
 * @returns {boolean} True jika teks membicarakan bot
 */
function isTalkingAboutBot(text, botUsername) {
  if (!text || !botUsername) return false;
  
  const botPattern = new RegExp(`\\b(bot|${botUsername}|kamu|elu|lu|lo|ngomong|bilang|jawab)\\b`, 'i');
  
  return botPattern.test(text);
}

// Export fungsi-fungsi
module.exports = {
  extractKeywords,
  analyzeText,
  cleanText,
  detectLanguage,
  determineResponseType,
  isTalkingAboutBot,
  STOPWORDS,
  TOPIC_PATTERNS,
  SENTIMENT_WORDS
};