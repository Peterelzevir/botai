// seed-knowledge.js
// Script untuk mengisi basis pengetahuan awal bot dengan berbagai kategori

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
    new require('winston').transports.File({ filename: 'seed-knowledge.log' })
  ]
});

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'telegram_ai_bot';

// Fungsi utama untuk mengisi database
async function seedKnowledge() {
  try {
    logger.info('Memulai proses seeding pengetahuan awal...');
    
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    logger.info('Berhasil terhubung ke MongoDB');
    
    const db = client.db(DB_NAME);
    const knowledgeCollection = db.collection('knowledge');
    
    // Cek jika sudah ada initial knowledge
    const existingCount = await knowledgeCollection.countDocuments({ source: 'initial_knowledge' });
    if (existingCount > 0) {
      logger.info(`Database sudah memiliki ${existingCount} item pengetahuan awal.`);
      logger.info('Apakah Anda ingin menambahkan lagi? Gunakan flag --force untuk overwrite.');
      
      // Cek jika ada flag force
      if (!process.argv.includes('--force')) {
        logger.info('Seeding dibatalkan. Gunakan argument --force untuk menambahkan lebih banyak data.');
        await client.close();
        return;
      }
      
      logger.info('Flag --force terdeteksi. Melanjutkan proses seeding...');
    }
    
    // Kumpulkan semua pengetahuan awal dari berbagai kategori
    let allKnowledge = [];
    
    // === INTRO & IDENTITAS BOT ===
    allKnowledge = allKnowledge.concat(generateBotIdentityKnowledge());
    
    // === TEKNOLOGI ===
    allKnowledge = allKnowledge.concat(generateTechnologyKnowledge());
    
    // === GAMES ===
    allKnowledge = allKnowledge.concat(generateGamesKnowledge());
    
    // === MUSIK ===
    allKnowledge = allKnowledge.concat(generateMusicKnowledge());
    
    // === FILM & HIBURAN ===
    allKnowledge = allKnowledge.concat(generateEntertainmentKnowledge());
    
    // === MAKANAN & KULINER ===
    allKnowledge = allKnowledge.concat(generateFoodKnowledge());
    
    // === OLAHRAGA ===
    allKnowledge = allKnowledge.concat(generateSportsKnowledge());
    
    // === PENDIDIKAN ===
    allKnowledge = allKnowledge.concat(generateEducationKnowledge());
    
    // === SEJARAH ===
    allKnowledge = allKnowledge.concat(generateHistoryKnowledge());
    
    // === BAHASA GAUL & SLANG ===
    allKnowledge = allKnowledge.concat(generateSlangKnowledge());
    
    // === SOCIAL MEDIA ===
    allKnowledge = allKnowledge.concat(generateSocialMediaKnowledge());
    
    // === MEME & HUMOR ===
    allKnowledge = allKnowledge.concat(generateMemeKnowledge());
    
    // === RELATIONSHIP & PERCINTAAN ===
    allKnowledge = allKnowledge.concat(generateRelationshipKnowledge());
    
    // === LIFESTYLE ===
    allKnowledge = allKnowledge.concat(generateLifestyleKnowledge());
    
    // === TRAVEL & WISATA ===
    allKnowledge = allKnowledge.concat(generateTravelKnowledge());
    
    // === PERTANYAAN UMUM ===
    allKnowledge = allKnowledge.concat(generateCommonQuestionsKnowledge());
    
    // === EKSPRESI EMOSI ===
    allKnowledge = allKnowledge.concat(generateEmotionExpressionsKnowledge());
    
    // === KESEHATAN ===
    allKnowledge = allKnowledge.concat(generateHealthKnowledge());
    
    // Tambahkan tanggal sekarang ke semua item
    const now = new Date();
    allKnowledge = allKnowledge.map(item => ({
      ...item,
      learned: now,
      source: 'initial_knowledge',
      sourceType: 'system'
    }));
    
    // Insert ke database
    logger.info(`Menyimpan ${allKnowledge.length} item pengetahuan ke database...`);
    const result = await knowledgeCollection.insertMany(allKnowledge);
    
    logger.info(`Berhasil menyimpan ${result.insertedCount} item pengetahuan baru!`);
    
    // Tutup koneksi
    await client.close();
    logger.info('Proses seeding selesai!');
    
  } catch (err) {
    logger.error('Error dalam proses seeding:', err);
  }
}

// ===================== GENERATOR PENGETAHUAN PER KATEGORI =====================

// Pengetahuan tentang identitas bot
function generateBotIdentityKnowledge() {
  return [
    {
      content: "Hai! Aku adalah bot AI yang dibuat oleh @hiyaok. Aku belajar dari percakapan dan semakin pintar seiring waktu. Mention aku di grup atau chat langsung untuk ngobrol!",
      keywords: ["bot", "ai", "hiyaok", "belajar", "percakapan", "pintar", "mention", "grup", "ngobrol"],
      category: "identity",
      confidence: 0.99,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Gue bot AI buatan @hiyaok, yang terus belajar dari setiap chat di grup maupun private. Semakin banyak kita ngobrol, makin pinter gue jadinya!",
      keywords: ["bot", "ai", "hiyaok", "belajar", "chat", "grup", "private", "ngobrol", "pinter"],
      category: "identity",
      confidence: 0.99,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Salam kenal! Saya adalah AI yang dirancang untuk terus belajar dari percakapan. Saya bisa membahas berbagai topik dan semakin berkembang seiring bertambahnya interaksi.",
      keywords: ["salam", "kenal", "ai", "belajar", "percakapan", "topik", "berkembang", "interaksi"],
      category: "identity",
      confidence: 0.99,
      sentiment: "positive",
      isQuestion: false,
      style: "formal"
    },
    {
      content: "Hello! Aku ini bot AI yang berbeda dari yang lain. Aku terus belajar dari semua chat dan obrolan. Jadi, kalo chatting sama aku, aku juga ikut pinter lho!",
      keywords: ["hello", "bot", "ai", "beda", "belajar", "chat", "obrolan", "chatting", "pinter"],
      category: "identity",
      confidence: 0.98,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Kenalan dulu, gue bot AI buatan @hiyaok. Uniknya, gue gak pake template jawaban kaku. Gue belajar terus dari chat kalian, jadi asik diajak ngobrol!",
      keywords: ["kenalan", "bot", "ai", "hiyaok", "unik", "template", "jawaban", "belajar", "chat", "asik", "ngobrol"],
      category: "identity",
      confidence: 0.98,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    }
  ];
}

// Pengetahuan tentang teknologi
function generateTechnologyKnowledge() {
  return [
    {
      content: "AI (Artificial Intelligence) atau Kecerdasan Buatan adalah teknologi yang mengembangkan komputer untuk melakukan tugas yang biasanya membutuhkan kecerdasan manusia, seperti pengenalan visual, pengenalan suara, dan pengambilan keputusan.",
      keywords: ["ai", "artificial", "intelligence", "kecerdasan", "buatan", "teknologi", "komputer", "visual", "suara", "keputusan"],
      category: "teknologi",
      confidence: 0.95,
      sentiment: "neutral",
      isQuestion: false,
      style: "formal"
    },
    {
      content: "Android dan iOS adalah dua sistem operasi mobile paling populer. Android dikembangkan Google dan bersifat lebih terbuka, sedangkan iOS dibuat Apple khusus untuk iPhone dan iPad.",
      keywords: ["android", "ios", "sistem", "operasi", "mobile", "google", "terbuka", "apple", "iphone", "ipad"],
      category: "teknologi",
      confidence: 0.94,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Blockchain itu teknologi kayak database terdesentralisasi, yang jadi dasar dari Bitcoin dan cryptocurrency lainnya. Transaksinya terenkripsi dan tersimpan di banyak komputer, jadi lebih aman.",
      keywords: ["blockchain", "database", "desentralisasi", "bitcoin", "cryptocurrency", "transaksi", "enkripsi", "komputer", "aman"],
      category: "teknologi",
      confidence: 0.93,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "HP flagship biasanya punya spek terbaik dari brand tertentu. Contohnya Samsung Galaxy S series, iPhone Pro Max, atau Xiaomi seri premium. Harganya emang lebih mahal tapi fiturnya lebih komplit.",
      keywords: ["hp", "flagship", "spek", "brand", "samsung", "galaxy", "iphone", "xiaomi", "premium", "mahal", "fitur"],
      category: "teknologi",
      confidence: 0.92,
      sentiment: "neutral",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Metaverse adalah konsep dunia virtual kolektif di mana orang dapat berinteraksi dalam lingkungan 3D. Facebook bahkan mengganti nama perusahaannya menjadi Meta untuk fokus mengembangkan teknologi ini.",
      keywords: ["metaverse", "dunia", "virtual", "kolektif", "interaksi", "3d", "facebook", "meta", "teknologi"],
      category: "teknologi",
      confidence: 0.91,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Cloud computing itu layanan komputasi yang disediakan melalui internet. Banyak perusahaan sekarang pake AWS (Amazon), Google Cloud, atau Microsoft Azure buat nyimpan data dan jalanin aplikasi tanpa perlu server fisik.",
      keywords: ["cloud", "computing", "komputasi", "internet", "perusahaan", "aws", "amazon", "google", "microsoft", "azure", "data", "aplikasi", "server"],
      category: "teknologi",
      confidence: 0.92,
      sentiment: "neutral",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "5G adalah generasi kelima teknologi jaringan seluler yang menawarkan kecepatan data hingga 10 Gbps, latensi rendah, dan kapasitas jaringan yang lebih besar dibanding 4G.",
      keywords: ["5g", "generasi", "kelima", "jaringan", "seluler", "kecepatan", "data", "gbps", "latensi", "kapasitas", "4g"],
      category: "teknologi",
      confidence: 0.93,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    }
  ];
}

// Pengetahuan tentang game
function generateGamesKnowledge() {
  return [
    {
      content: "Mobile Legends: Bang Bang (ML) adalah game MOBA 5v5 yang super populer di Indonesia. Hero-hero favorit banyak pemain termasuk Chou, Gusion, dan Lancelot.",
      keywords: ["mobile", "legends", "bang", "ml", "moba", "5v5", "populer", "indonesia", "hero", "chou", "gusion", "lancelot"],
      category: "games",
      confidence: 0.95,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "PUBG Mobile itu battle royale game di mana 100 pemain terjun ke map, nyari senjata, dan berusaha jadi yang terakhir bertahan. Erangel sama Miramar adalah map yang paling iconic.",
      keywords: ["pubg", "mobile", "battle", "royale", "terjun", "map", "senjata", "bertahan", "erangel", "miramar", "iconic"],
      category: "games",
      confidence: 0.94,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Free Fire (FF) adalah game battle royale mobile yang populer karena bisa dimainkan di hp spek rendah. Setiap match biasanya berlangsung sekitar 10 menit dengan 50 pemain.",
      keywords: ["free", "fire", "ff", "battle", "royale", "mobile", "populer", "hp", "spek", "rendah", "match", "menit", "pemain"],
      category: "games",
      confidence: 0.93,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Genshin Impact adalah game RPG open-world gacha yang dikembangkan miHoYo. Pemain mengumpulkan karakter dengan elemen berbeda dan menjelajahi dunia Teyvat.",
      keywords: ["genshin", "impact", "rpg", "open", "world", "gacha", "mihoyo", "karakter", "elemen", "jelajah", "teyvat"],
      category: "games",
      confidence: 0.92,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Valorant itu FPS tactical shooter buatan Riot Games yang mirip CSGO tapi ada Agent dengan skill unik. Jadi lebih seru karena tiap Agent punya kemampuan yang beda.",
      keywords: ["valorant", "fps", "tactical", "shooter", "riot", "games", "csgo", "agent", "skill", "unik", "seru", "kemampuan"],
      category: "games",
      confidence: 0.91,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Minecraft adalah game sandbox yang memungkinkan pemain membangun dan menghancurkan berbagai blok dalam dunia 3D. Game ini dibeli Microsoft dari Mojang seharga $2.5 miliar.",
      keywords: ["minecraft", "game", "sandbox", "pemain", "bangun", "hancur", "blok", "dunia", "3d", "microsoft", "mojang", "miliar"],
      category: "games",
      confidence: 0.94,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "META MLBB sekarang lebih sering pake hero fighter sama tank yang bisa sustain lama di lane. Tapi tetep butuh mage sama marksman buat damage di late game.",
      keywords: ["meta", "mlbb", "hero", "fighter", "tank", "sustain", "lane", "mage", "marksman", "damage", "late", "game"],
      category: "games",
      confidence: 0.90,
      sentiment: "neutral",
      isQuestion: false,
      style: "gaul"
    }
  ];
}

// Pengetahuan tentang musik
function generateMusicKnowledge() {
  return [
    {
      content: "Kpop adalah genre musik pop asal Korea Selatan yang sangat populer di Indonesia. Grup seperti BTS, BLACKPINK, dan TWICE memiliki fanbase besar di sini.",
      keywords: ["kpop", "musik", "pop", "korea", "selatan", "populer", "indonesia", "bts", "blackpink", "twice", "fanbase"],
      category: "musik",
      confidence: 0.93,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Spotify itu layanan streaming musik paling populer di dunia dengan lebih dari 400 juta pengguna. Di Indonesia, banyak yang pake family plan bareng temen biar lebih murah.",
      keywords: ["spotify", "streaming", "musik", "populer", "dunia", "juta", "pengguna", "indonesia", "family", "plan", "temen", "murah"],
      category: "musik",
      confidence: 0.92,
      sentiment: "neutral",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Dangdut adalah aliran musik khas Indonesia yang menggabungkan unsur Melayu, Arab, dan Hindustani. Lagu-lagu Rhoma Irama, Via Vallen, dan Nella Kharisma sangat populer.",
      keywords: ["dangdut", "musik", "khas", "indonesia", "melayu", "arab", "hindustani", "rhoma", "irama", "via", "vallen", "nella", "kharisma", "populer"],
      category: "musik",
      confidence: 0.95,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "NCT punya banyak sub-unit seperti NCT 127, NCT Dream, dan WayV. Sistemnya unik karena member bisa rotasi antar unit dan bisa nambah member baru kapan aja.",
      keywords: ["nct", "sub", "unit", "127", "dream", "wayv", "sistem", "unik", "member", "rotasi", "nambah", "baru"],
      category: "musik",
      confidence: 0.91,
      sentiment: "neutral",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Banyak musisi Indonesia yang sukses go international, seperti Rich Brian yang masuk label 88rising, NIKI yang manggung di Coachella, atau Anggun yang terkenal di Prancis.",
      keywords: ["musisi", "indonesia", "sukses", "international", "rich", "brian", "label", "88rising", "niki", "coachella", "anggun", "terkenal", "prancis"],
      category: "musik",
      confidence: 0.92,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Lagu-lagu Denny Caknan kayak Satru sama Los Dol hits banget di Jawa Timur. Stylenya perpaduan pop, reggae, dengan sentuhan Jawa dan lirik yang relate sama kehidupan sehari-hari.",
      keywords: ["lagu", "denny", "caknan", "satru", "los", "dol", "hits", "jawa", "timur", "style", "pop", "reggae", "lirik", "relate", "kehidupan"],
      category: "musik",
      confidence: 0.89,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Pamungkas adalah penyanyi indie Indonesia yang terkenal dengan lagu To the Bone. Dia menulis, memproduksi, dan memainkan banyak instrumen untuk lagunya sendiri.",
      keywords: ["pamungkas", "penyanyi", "indie", "indonesia", "terkenal", "to", "the", "bone", "tulis", "produksi", "instrumen", "lagu"],
      category: "musik",
      confidence: 0.92,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    }
  ];
}

// Pengetahuan tentang entertainment
function generateEntertainmentKnowledge() {
  return [
    {
      content: "Drama Korea (drakor) sangat populer di Indonesia. Genre yang paling disukai biasanya romance, thriller, dan fantasy. Netflix punya banyak koleksi drakor terbaru.",
      keywords: ["drama", "korea", "drakor", "populer", "indonesia", "genre", "romance", "thriller", "fantasy", "netflix", "koleksi", "terbaru"],
      category: "film",
      confidence: 0.94,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Anime Attack on Titan season terakhirnya bikin banyak fans shock sama endingnya. Padahal itu salah satu anime paling populer sepanjang masa.",
      keywords: ["anime", "attack", "titan", "season", "terakhir", "fans", "shock", "ending", "populer", "sepanjang", "masa"],
      category: "film",
      confidence: 0.93,
      sentiment: "negative",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Film horor Indonesia punya tempat spesial di industri perfilman. Pengabdi Setan, Danur, dan KKN di Desa Penari adalah beberapa contoh film horor Indonesia yang sukses.",
      keywords: ["film", "horor", "indonesia", "tempat", "spesial", "industri", "perfilman", "pengabdi", "setan", "danur", "kkn", "desa", "penari", "sukses"],
      category: "film",
      confidence: 0.95,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "The Conjuring Universe itu franchise film horor tersukses di dunia yang dimulai dari film The Conjuring pertama. Ada spin-off kayak Annabelle, The Nun, sama La Llorona.",
      keywords: ["conjuring", "universe", "franchise", "film", "horor", "sukses", "dunia", "spin-off", "annabelle", "nun", "llorona"],
      category: "film",
      confidence: 0.92,
      sentiment: "neutral",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Marvel Cinematic Universe (MCU) adalah franchise film superhero terbesar dengan puluhan film dan serial TV yang saling terhubung, dimulai dari Iron Man pada 2008.",
      keywords: ["marvel", "cinematic", "universe", "mcu", "franchise", "film", "superhero", "terbesar", "puluhan", "serial", "tv", "terhubung", "iron", "man"],
      category: "film",
      confidence: 0.94,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Sinetron Indonesia biasanya punya episode yang panjaaaang banget. Ada yang sampe ribuan episode dan tayang bertahun-tahun. Tapi tetep aja banyak yang nonton.",
      keywords: ["sinetron", "indonesia", "episode", "panjang", "ribuan", "tayang", "tahun", "banyak", "nonton"],
      category: "film",
      confidence: 0.91,
      sentiment: "negative",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Webtoon adalah platform komik digital yang populer di Indonesia. True Beauty, Lore Olympus, dan Tower of God adalah beberapa webtoon yang sukses diadaptasi menjadi drama.",
      keywords: ["webtoon", "platform", "komik", "digital", "populer", "indonesia", "true", "beauty", "lore", "olympus", "tower", "god", "adaptasi", "drama"],
      category: "film",
      confidence: 0.90,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    }
  ];
}

// Pengetahuan tentang makanan
function generateFoodKnowledge() {
  return [
    {
      content: "Nasi goreng adalah makanan nasional tidak resmi Indonesia. Berbeda dengan negara lain, nasi goreng Indonesia biasanya menggunakan kecap manis yang memberikan rasa khas.",
      keywords: ["nasi", "goreng", "makanan", "nasional", "indonesia", "berbeda", "negara", "kecap", "manis", "rasa", "khas"],
      category: "makanan",
      confidence: 0.96,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Indomie itu mie instan paling enak sedunia sih menurut gue. Sampe ada resto di luar negeri yang jual Indomie dengan harga mahal. Rasanya emang juara!",
      keywords: ["indomie", "mie", "instan", "enak", "dunia", "resto", "luar", "negeri", "jual", "harga", "mahal", "rasa", "juara"],
      category: "makanan",
      confidence: 0.95,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Rendang adalah masakan daging dengan bumbu rempah-rempah khas Minangkabau, Sumatera Barat. CNN pernah menempatkannya sebagai makanan terenak di dunia.",
      keywords: ["rendang", "masakan", "daging", "bumbu", "rempah", "khas", "minangkabau", "sumatera", "barat", "cnn", "makanan", "terenak", "dunia"],
      category: "makanan",
      confidence: 0.96,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Ayam geprek lagi hits banget belakangan ini. Kombinasi ayam goreng yang digeprek, sambel yang pedes, dan nasi anget emang juara sih. Banyak yang suka pake level pedesnya.",
      keywords: ["ayam", "geprek", "hits", "kombinasi", "goreng", "sambel", "pedes", "nasi", "anget", "juara", "suka", "level", "pedes"],
      category: "makanan",
      confidence: 0.93,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Martabak manis (atau terang bulan) adalah jajanan favorit Indonesia dengan topping beragam seperti coklat, keju, kacang, dan sekarang ada varian red velvet atau green tea.",
      keywords: ["martabak", "manis", "terang", "bulan", "jajanan", "favorit", "indonesia", "topping", "coklat", "keju", "kacang", "varian", "red", "velvet", "green", "tea"],
      category: "makanan",
      confidence: 0.94,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Soto adalah sup tradisional Indonesia yang punya banyak variasi di setiap daerah. Ada soto Betawi, soto Madura, soto Kudus, soto Lamongan, dan masih banyak lagi.",
      keywords: ["soto", "sup", "tradisional", "indonesia", "variasi", "daerah", "betawi", "madura", "kudus", "lamongan"],
      category: "makanan",
      confidence: 0.95,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Boba atau bubble tea lagi trend banget. Dari Chatime, Kokumi, Xing Fu Tang, sampe Tiger Sugar pada buka dimana-mana. Paling enak kalo brown sugar fresh milk with boba!",
      keywords: ["boba", "bubble", "tea", "trend", "chatime", "kokumi", "xing", "fu", "tang", "tiger", "sugar", "buka", "brown", "sugar", "fresh", "milk"],
      category: "makanan",
      confidence: 0.92,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    }
  ];
}

// Pengetahuan tentang olahraga
function generateSportsKnowledge() {
  return [
    {
      content: "Sepak bola adalah olahraga paling populer di Indonesia. Liga 1 adalah kompetisi sepak bola profesional tertinggi, dengan Persib dan Persija sebagai klub dengan fans terbanyak.",
      keywords: ["sepak", "bola", "olahraga", "populer", "indonesia", "liga", "kompetisi", "profesional", "tertinggi", "persib", "persija", "klub", "fans"],
      category: "olahraga",
      confidence: 0.95,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Bulutangkis adalah olahraga kebanggaan Indonesia. Kita udah sering banget dapet medali emas Olimpiade lewat Anthony Ginting, Greysia/Apriyani, dan legenda kayak Taufik Hidayat.",
      keywords: ["bulutangkis", "olahraga", "kebanggaan", "indonesia", "medali", "emas", "olimpiade", "anthony", "ginting", "greysia", "apriyani", "legenda", "taufik", "hidayat"],
      category: "olahraga",
      confidence: 0.96,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "NBA (National Basketball Association) adalah liga basket profesional Amerika Serikat. Bintang-bintang seperti LeBron James, Stephen Curry, dan Kevin Durant sangat populer di Indonesia.",
      keywords: ["nba", "national", "basketball", "association", "liga", "basket", "profesional", "amerika", "serikat", "bintang", "lebron", "james", "stephen", "curry", "kevin", "durant", "populer", "indonesia"],
      category: "olahraga",
      confidence: 0.93,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "MotoGP sekarang udah gak ada Valentino Rossi, tapi masih seru banget. Marc Marquez sering crash, Ducati mendominasi, dan Bagnaia jadi juara dunia tahun lalu.",
      keywords: ["motogp", "valentino", "rossi", "seru", "marc", "marquez", "crash", "ducati", "dominasi", "bagnaia", "juara", "dunia", "tahun"],
      category: "olahraga",
      confidence: 0.92,
      sentiment: "neutral",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Esports sudah menjadi bagian dari Asian Games dan SEA Games. Tim Indonesia sering meraih medali di game Mobile Legends, PUBG Mobile, dan Free Fire.",
      keywords: ["esports", "bagian", "asian", "games", "sea", "games", "tim", "indonesia", "medali", "game", "mobile", "legends", "pubg", "free", "fire"],
      category: "olahraga",
      confidence: 0.94,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Piala Dunia Qatar 2022 dimenangkan Argentina dengan Messi akhirnya mengangkat trofi yang selama ini dia impi-impikan. Final lawan Prancis itu salah satu yang paling epic.",
      keywords: ["piala", "dunia", "qatar", "2022", "menang", "argentina", "messi", "trofi", "impi", "final", "prancis", "epic"],
      category: "olahraga",
      confidence: 0.94,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Indonesia punya tradisi kuat di olahraga bulu tangkis, terutama di sektor ganda. Susi Susanti dan Alan Budikusuma adalah peraih emas Olimpiade pertama untuk Indonesia.",
      keywords: ["indonesia", "tradisi", "kuat", "olahraga", "bulu", "tangkis", "sektor", "ganda", "susi", "susanti", "alan", "budikusuma", "emas", "olimpiade", "pertama"],
      category: "olahraga",
      confidence: 0.95,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    }
  ];
}

// Pengetahuan tentang pendidikan
function generateEducationKnowledge() {
  return [
    {
      content: "Sistem pendidikan di Indonesia terdiri dari pendidikan dasar (SD), pendidikan menengah (SMP dan SMA/SMK), dan pendidikan tinggi (universitas/perguruan tinggi).",
      keywords: ["sistem", "pendidikan", "indonesia", "dasar", "sd", "menengah", "smp", "sma", "smk", "tinggi", "universitas", "perguruan"],
      category: "pendidikan",
      confidence: 0.95,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "SBMPTN (Seleksi Bersama Masuk Perguruan Tinggi Negeri) adalah jalur masuk PTN yang paling populer di Indonesia. Persaingannya ketat banget terutama buat jurusan favorit kayak kedokteran.",
      keywords: ["sbmptn", "seleksi", "bersama", "masuk", "perguruan", "tinggi", "negeri", "jalur", "ptn", "populer", "indonesia", "persaingan", "ketat", "jurusan", "favorit", "kedokteran"],
      category: "pendidikan",
      confidence: 0.94,
      sentiment: "neutral",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Kurikulum Merdeka adalah pembaruan dari Kurikulum 2013, yang memberikan fleksibilitas lebih bagi sekolah dan guru untuk mengembangkan pembelajaran sesuai kebutuhan siswa.",
      keywords: ["kurikulum", "merdeka", "pembaruan", "2013", "fleksibilitas", "sekolah", "guru", "kembang", "pembelajaran", "kebutuhan", "siswa"],
      category: "pendidikan",
      confidence: 0.93,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Kuliah online jadi tren sejak pandemi. Zoom meeting, Google Meet, sama Microsoft Teams jadi platform yang paling banyak dipake. Meski udah normal, banyak kampus tetep ada kelas hybrid.",
      keywords: ["kuliah", "online", "tren", "pandemi", "zoom", "meeting", "google", "meet", "microsoft", "teams", "platform", "dipake", "normal", "kampus", "kelas", "hybrid"],
      category: "pendidikan",
      confidence: 0.92,
      sentiment: "neutral",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Beasiswa LPDP adalah beasiswa prestisius dari pemerintah Indonesia untuk studi lanjut S2/S3 baik dalam maupun luar negeri, dengan syarat penerima kembali ke Indonesia setelah lulus.",
      keywords: ["beasiswa", "lpdp", "prestisius", "pemerintah", "indonesia", "studi", "lanjut", "dalam", "luar", "negeri", "syarat", "penerima", "kembali", "lulus"],
      category: "pendidikan",
      confidence: 0.95,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Sekarang banyak banget platform kursus online kayak Coursera, Udemy, Skill Academy, sama Zenius. Bisa belajar apa aja mulai dari coding sampe masak, sertifikatnya juga diakui.",
      keywords: ["platform", "kursus", "online", "coursera", "udemy", "skill", "academy", "zenius", "belajar", "coding", "masak", "sertifikat", "diakui"],
      category: "pendidikan",
      confidence: 0.91,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Universitas Indonesia (UI), Institut Teknologi Bandung (ITB), dan Universitas Gadjah Mada (UGM) secara konsisten menempati peringkat teratas universitas di Indonesia.",
      keywords: ["universitas", "indonesia", "ui", "institut", "teknologi", "bandung", "itb", "gadjah", "mada", "ugm", "konsisten", "peringkat", "teratas"],
      category: "pendidikan",
      confidence: 0.96,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    }
  ];
}

// Pengetahuan tentang sejarah
function generateHistoryKnowledge() {
  return [
    {
      content: "Kerajaan Majapahit adalah salah satu kerajaan terbesar di Nusantara yang mencapai kejayaan pada abad ke-14 di bawah Raja Hayam Wuruk dan Patih Gajah Mada.",
      keywords: ["kerajaan", "majapahit", "terbesar", "nusantara", "kejayaan", "abad", "hayam", "wuruk", "patih", "gajah", "mada"],
      category: "sejarah",
      confidence: 0.95,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Sumpah Pemuda 28 Oktober 1928 itu momen penting banget buat persatuan Indonesia. Dari situ kita mulai mengakui satu tanah air, satu bangsa, dan satu bahasa: Indonesia.",
      keywords: ["sumpah", "pemuda", "28", "oktober", "1928", "momen", "penting", "persatuan", "indonesia", "mengakui", "tanah", "air", "bangsa", "bahasa"],
      category: "sejarah",
      confidence: 0.94,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Proklamasi Kemerdekaan Indonesia diumumkan oleh Soekarno dan Hatta pada tanggal 17 Agustus 1945, setelah Jepang menyerah kepada Sekutu dalam Perang Dunia II.",
      keywords: ["proklamasi", "kemerdekaan", "indonesia", "soekarno", "hatta", "17", "agustus", "1945", "jepang", "menyerah", "sekutu", "perang", "dunia"],
      category: "sejarah",
      confidence: 0.96,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Borobudur itu candi Buddha terbesar di dunia yang dibangun sekitar abad ke-9. UNESCO ngakuin sebagai Warisan Dunia dan jadi salah satu keajaiban dunia. Relief-reliefnya detail banget!",
      keywords: ["borobudur", "candi", "buddha", "terbesar", "dunia", "dibangun", "abad", "unesco", "warisan", "dunia", "keajaiban", "relief", "detail"],
      category: "sejarah",
      confidence: 0.94,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Pemberontakan G30S adalah peristiwa berdarah pada 30 September 1965 yang mengakibatkan pembunuhan enam jenderal TNI. Peristiwa ini menjadi titik balik politik Indonesia.",
      keywords: ["pemberontakan", "g30s", "peristiwa", "berdarah", "30", "september", "1965", "pembunuhan", "jenderal", "tni", "titik", "balik", "politik", "indonesia"],
      category: "sejarah",
      confidence: 0.93,
      sentiment: "negative",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Reformasi 1998 itu titik balik Indonesia dari era Orde Baru ke demokrasi. Banyak mahasiswa demo, Soeharto lengser, dan akhirnya kita punya kebebasan pers sama demokrasi yang lebih baik.",
      keywords: ["reformasi", "1998", "titik", "balik", "indonesia", "orde", "baru", "demokrasi", "mahasiswa", "demo", "soeharto", "lengser", "kebebasan", "pers"],
      category: "sejarah",
      confidence: 0.93,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Kerajaan Sriwijaya adalah kerajaan maritim Buddha yang kuat berbasis di Sumatera sekitar abad ke-7 hingga ke-12. Kekuasaannya meliputi Sumatera, Jawa, dan Semenanjung Melayu.",
      keywords: ["kerajaan", "sriwijaya", "maritim", "buddha", "kuat", "sumatera", "abad", "kekuasaan", "jawa", "semenanjung", "melayu"],
      category: "sejarah",
      confidence: 0.95,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    }
  ];
}

// Pengetahuan tentang bahasa gaul dan slang
function generateSlangKnowledge() {
  return [
    {
      content: "Bahasa gaul di Indonesia selalu berkembang. Kata-kata seperti 'gercep' (gerak cepat), 'kepo' (knowing every particular object), dan 'glow up' sering digunakan anak muda.",
      keywords: ["bahasa", "gaul", "indonesia", "berkembang", "gercep", "gerak", "cepat", "kepo", "knowing", "particular", "object", "glow", "up", "anak", "muda"],
      category: "bahasa",
      confidence: 0.93,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Kalo lo denger 'santuy', artinya santai. 'Ghoib' buat orang yang jarang nongol. 'Anjay' itu kata kagum, dan 'auto' biasanya dipake buat hal yang pasti terjadi kayak 'auto ngantri'.",
      keywords: ["santuy", "santai", "ghoib", "orang", "jarang", "nongol", "anjay", "kata", "kagum", "auto", "pasti", "terjadi", "ngantri"],
      category: "bahasa",
      confidence: 0.94,
      sentiment: "neutral",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Arti 'literally' udah bergeser di kalangan Gen Z. Mereka pake kata ini buat menekankan sesuatu meskipun bukan dalam arti harfiah, misalnya 'gue literally mati ketawa' padahal ya nggak mati beneran.",
      keywords: ["arti", "literally", "geser", "gen", "z", "kata", "tekan", "harfiah", "mati", "ketawa", "beneran"],
      category: "bahasa",
      confidence: 0.91,
      sentiment: "neutral",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Di Indonesia, bahasa gaul sering bercampur dengan Bahasa Inggris. Contohnya: 'Gue lagi marathon series nih', 'Jangan spam chat gue', atau 'Doi ghosting gue seminggu'.",
      keywords: ["indonesia", "bahasa", "gaul", "campur", "inggris", "marathon", "series", "spam", "chat", "doi", "ghosting", "seminggu"],
      category: "bahasa",
      confidence: 0.92,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Bahasa alay udah jarang banget sekarang. Dulu orang nulis pake campur angka kayak 'g4k0oL', tapi sekarang malah dianggap cringe dan gak relevan lagi.",
      keywords: ["bahasa", "alay", "jarang", "sekarang", "nulis", "campur", "angka", "cringe", "relevan"],
      category: "bahasa",
      confidence: 0.90,
      sentiment: "negative",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "'Glow up' artinya transformasi jadi lebih baik, biasanya soal penampilan. 'Delulu' dari 'delusional', buat orang yang berharap terlalu tinggi. 'Fomo' itu 'fear of missing out', takut ketinggalan tren.",
      keywords: ["glow", "up", "transformasi", "baik", "penampilan", "delulu", "delusional", "berharap", "tinggi", "fomo", "fear", "missing", "out", "takut", "tinggal", "tren"],
      category: "bahasa",
      confidence: 0.92,
      sentiment: "neutral",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Bahasa prokem adalah slang Jakarta yang populer sejak era 80-an. Contohnya: 'bokap' (bapak), 'nyokap' (ibu), 'ember' (memang benar), dan 'cabut' (pergi).",
      keywords: ["bahasa", "prokem", "slang", "jakarta", "populer", "era", "80", "bokap", "bapak", "nyokap", "ibu", "ember", "memang", "benar", "cabut", "pergi"],
      category: "bahasa",
      confidence: 0.93,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    }
  ];
}

// Pengetahuan tentang social media
function generateSocialMediaKnowledge() {
  return [
    {
      content: "TikTok adalah platform media sosial yang sangat populer di Indonesia, terutama untuk konten pendek seperti tarian, comedy sketch, dan tutorial singkat.",
      keywords: ["tiktok", "platform", "media", "sosial", "populer", "indonesia", "konten", "pendek", "tarian", "comedy", "sketch", "tutorial"],
      category: "sosmed",
      confidence: 0.95,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Instagram reels sekarang jadi fitur yang paling sering dipake. Creators pada fokus bikin konten pendek yang eye-catching biar bisa masuk FYP dan dapetin engagement lebih gede.",
      keywords: ["instagram", "reels", "fitur", "sering", "dipake", "creators", "fokus", "konten", "pendek", "eye-catching", "fyp", "engagement", "gede"],
      category: "sosmed",
      confidence: 0.94,
      sentiment: "neutral",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Twitter (X) di Indonesia sering jadi tempat trending topics soal politik, K-pop, dan acara TV populer. Hashtag bisa jadi trending nasional kalo banyak yang ngetweet dalam waktu singkat.",
      keywords: ["twitter", "x", "indonesia", "tempat", "trending", "topics", "politik", "kpop", "acara", "tv", "hashtag", "nasional", "ngetweet", "singkat"],
      category: "sosmed",
      confidence: 0.93,
      sentiment: "neutral",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "YouTube adalah platform berbagi video terbesar di dunia. Di Indonesia, konten seperti prank, vlog keluarga, dan mukbang menjadi sangat populer.",
      keywords: ["youtube", "platform", "berbagi", "video", "terbesar", "dunia", "indonesia", "konten", "prank", "vlog", "keluarga", "mukbang", "populer"],
      category: "sosmed",
      confidence: 0.94,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "BeReal itu aplikasi sosmed yang ngasih notif random, dan lo harus posting foto dalam 2 menit. Tujuannya biar konten lebih authentic dan gak banyak filter kayak Instagram.",
      keywords: ["bereal", "aplikasi", "sosmed", "notif", "random", "posting", "foto", "menit", "tujuan", "konten", "authentic", "filter", "instagram"],
      category: "sosmed",
      confidence: 0.91,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Facebook masih populer di Indonesia terutama untuk generasi yang lebih tua. Grup Facebook jadi tempat komunitas berkumpul, dari hobi, jual beli, sampai grup alumni sekolah.",
      keywords: ["facebook", "populer", "indonesia", "generasi", "tua", "grup", "tempat", "komunitas", "kumpul", "hobi", "jual", "beli", "alumni", "sekolah"],
      category: "sosmed",
      confidence: 0.93,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Content creator sekarang bisa hidup dari sosmed. Ada yang jadi brand ambassador, paid promote, endorsement, atau jualan produk sendiri kayak makanan, skincare, sampe fashion.",
      keywords: ["content", "creator", "hidup", "sosmed", "brand", "ambassador", "paid", "promote", "endorsement", "jualan", "produk", "makanan", "skincare", "fashion"],
      category: "sosmed",
      confidence: 0.92,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    }
  ];
}

// Pengetahuan tentang meme dan humor
function generateMemeKnowledge() {
  return [
    {
      content: "Meme 'Kalo Ga Gitu Ya Gimana' jadi salah satu meme paling populer di Indonesia. Biasanya tentang ironi atau sindiran halus soal kebiasaan masyarakat Indonesia.",
      keywords: ["meme", "kalo", "ga", "gitu", "ya", "gimana", "populer", "indonesia", "ironi", "sindiran", "halus", "kebiasaan", "masyarakat"],
      category: "meme",
      confidence: 0.93,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "'Awokawokawok' jadi ekspresi ketawa khas netizen Indonesia di online. Ada juga variasi lain kayak 'wkwkwk', 'xixi', dan 'hshshs' yang sering dipake di sosmed atau chat.",
      keywords: ["awokawokawok", "ekspresi", "ketawa", "khas", "netizen", "indonesia", "online", "variasi", "wkwkwk", "xixi", "hshshs", "dipake", "sosmed", "chat"],
      category: "meme",
      confidence: 0.92,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Meme 'auto ngacir' (auto kabur/lari) biasanya dipake buat situasi yang bikin kita pengen cepet-cepet pergi atau menghindari sesuatu. Sering diilustrasikan dengan gambar orang lari.",
      keywords: ["meme", "auto", "ngacir", "kabur", "lari", "dipake", "situasi", "bikin", "pengen", "cepet", "pergi", "hindari", "ilustrasi", "gambar", "orang", "lari"],
      category: "meme",
      confidence: 0.91,
      sentiment: "neutral",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Stand-up comedy berkembang pesat di Indonesia sejak Raditya Dika dan Pandji Pragiwaksono mempeloporinya. Sekarang ada kompetisi seperti SUCI (Stand Up Comedy Indonesia) di Kompas TV.",
      keywords: ["stand-up", "comedy", "kembang", "pesat", "indonesia", "raditya", "dika", "pandji", "pragiwaksono", "pelopori", "kompetisi", "suci", "kompas", "tv"],
      category: "meme",
      confidence: 0.94,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Meme 'Sad Moo' alias sapi sedih itu jadi simbol buat nunjukin perasaan sedih yang absurd atau berlebihan. Biasanya di-captoin 'Moooo' atau 'Sad moo noises'.",
      keywords: ["meme", "sad", "moo", "sapi", "sedih", "simbol", "nunjukin", "perasaan", "absurd", "berlebihan", "captoin", "noises"],
      category: "meme",
      confidence: 0.90,
      sentiment: "neutral",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Komika Pandji Pragiwaksono terkenal dengan stand-up comedy yang mengangkat isu-isu sosial dan politik. Show-nya selalu punya pesan mendalam di balik humornya.",
      keywords: ["komika", "pandji", "pragiwaksono", "terkenal", "stand-up", "comedy", "angkat", "isu", "sosial", "politik", "show", "pesan", "mendalam", "humor"],
      category: "meme",
      confidence: 0.93,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "'Receh' itu istilah buat humor yang gampang banget dan kadang garing, tapi tetep bikin ketawa. Kayak jokes plesetan nama atau jokes yang pake format 'X is Y without Z'.",
      keywords: ["receh", "istilah", "humor", "gampang", "garing", "bikin", "ketawa", "jokes", "plesetan", "nama", "format", "without"],
      category: "meme",
      confidence: 0.92,
      sentiment: "neutral",
      isQuestion: false,
      style: "gaul"
    }
  ];
}

// Pengetahuan tentang relationship dan percintaan
function generateRelationshipKnowledge() {
  return [
    {
      content: "Ghosting adalah perilaku menghilang tiba-tiba dari kehidupan seseorang tanpa penjelasan setelah sebelumnya berkomunikasi secara intens. Ini sering terjadi dalam hubungan online.",
      keywords: ["ghosting", "perilaku", "hilang", "tiba-tiba", "kehidupan", "penjelasan", "komunikasi", "intens", "terjadi", "hubungan", "online"],
      category: "relationship",
      confidence: 0.94,
      sentiment: "negative",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Bucin (budak cinta) itu kondisi dimana seseorang terlalu terobsesi sama pasangannya, rela ngelakuin apa aja dan sering kali ngesampingin kepentingan diri sendiri demi pasangan.",
      keywords: ["bucin", "budak", "cinta", "kondisi", "obsesi", "pasangan", "rela", "ngelakuin", "ngesampingin", "kepentingan", "diri", "demi"],
      category: "relationship",
      confidence: 0.93,
      sentiment: "negative",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Situationship adalah hubungan romantis yang tidak memiliki label atau komitmen jelas. Berada di antara pertemanan dan pacaran resmi, dan sering membuat salah satu pihak bingung.",
      keywords: ["situationship", "hubungan", "romantis", "label", "komitmen", "jelas", "antara", "teman", "pacar", "resmi", "bingung"],
      category: "relationship",
      confidence: 0.92,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Red flag itu tanda-tanda bahaya dalam hubungan yang harusnya bikin lo waspada. Contohnya: posesif berlebihan, suka bohong, atau nggak respect sama boundaries lo.",
      keywords: ["red", "flag", "tanda", "bahaya", "hubungan", "waspada", "posesif", "berlebihan", "bohong", "respect", "boundaries"],
      category: "relationship",
      confidence: 0.94,
      sentiment: "negative",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Love language (bahasa cinta) adalah cara seseorang mengekspresikan dan menerima kasih sayang. Ada lima jenis: kata-kata afirmasi, quality time, hadiah, tindakan pelayanan, dan sentuhan fisik.",
      keywords: ["love", "language", "bahasa", "cinta", "cara", "ekspresi", "terima", "kasih", "sayang", "lima", "jenis", "afirmasi", "quality", "time", "hadiah", "tindakan", "sentuhan"],
      category: "relationship",
      confidence: 0.95,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "PDKT (Pendekatan) itu fase sebelum pacaran, dimana lo kenalan dan mulai deket sama orang yang lo suka. Biasanya banyak kode-kodean, chat tiap hari, dan hang out bareng.",
      keywords: ["pdkt", "pendekatan", "fase", "pacar", "kenal", "deket", "orang", "suka", "kode", "chat", "hang", "out", "bareng"],
      category: "relationship",
      confidence: 0.93,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Long Distance Relationship (LDR) menjadi semakin umum di era digital. Penelitian menunjukkan LDR bisa berhasil jika ada komunikasi yang baik, kepercayaan, dan rencana masa depan yang jelas.",
      keywords: ["long", "distance", "relationship", "ldr", "umum", "era", "digital", "penelitian", "berhasil", "komunikasi", "baik", "percaya", "rencana", "masa", "depan", "jelas"],
      category: "relationship",
      confidence: 0.93,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    }
  ];
}

// Pengetahuan tentang lifestyle
function generateLifestyleKnowledge() {
  return [
    {
      content: "Minimalism adalah gaya hidup yang fokus pada mengurangi kepemilikan barang dan hanya menyimpan yang benar-benar diperlukan atau memberikan kebahagiaan. Populer di kalangan urban Indonesia.",
      keywords: ["minimalism", "gaya", "hidup", "fokus", "kurang", "milik", "barang", "simpan", "perlu", "bahagia", "populer", "urban", "indonesia"],
      category: "lifestyle",
      confidence: 0.93,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Thrifting lagi ngetren banget sekarang. Orang berburu baju bekas branded dengan harga murah di pasar kayak Thamrin City atau online shop. Selain hemat, juga mendukung sustainable fashion.",
      keywords: ["thrifting", "ngetren", "sekarang", "orang", "buru", "baju", "bekas", "branded", "harga", "murah", "pasar", "thamrin", "city", "online", "shop", "hemat", "sustainable", "fashion"],
      category: "lifestyle",
      confidence: 0.94,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Clean beauty adalah tren kosmetik yang mengutamakan bahan-bahan alami dan menghindari bahan kimia berbahaya. Banyak brand lokal Indonesia yang mulai menerapkan konsep ini.",
      keywords: ["clean", "beauty", "tren", "kosmetik", "utama", "bahan", "alami", "hindari", "kimia", "bahaya", "brand", "lokal", "indonesia", "konsep"],
      category: "lifestyle",
      confidence: 0.92,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "WFH (Work From Home) udah jadi lifestyle baru sejak pandemi. Banyak perusahaan yang tetep nerapin sistem hybrid, dan orang-orang suka karena hemat waktu commuting dan lebih fleksibel.",
      keywords: ["wfh", "work", "from", "home", "lifestyle", "baru", "pandemi", "perusahaan", "sistem", "hybrid", "orang", "hemat", "waktu", "commuting", "fleksibel"],
      category: "lifestyle",
      confidence: 0.93,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Zero waste lifestyle bertujuan mengurangi sampah yang dihasilkan dengan menggunakan produk berkelanjutan dan dapat digunakan kembali seperti sedotan metal, tas belanja kain, dan botol minum.",
      keywords: ["zero", "waste", "lifestyle", "tujuan", "kurang", "sampah", "hasil", "produk", "berkelanjutan", "guna", "kembali", "sedotan", "metal", "tas", "belanja", "kain", "botol", "minum"],
      category: "lifestyle",
      confidence: 0.94,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Kopi kekinian lagi booming banget, dari Es Kopi Susu Gula Aren sampe Cold Brew. Banyak coffee shop lokal yang punya signature menu mereka sendiri dengan harga bersaing.",
      keywords: ["kopi", "kekinian", "booming", "es", "susu", "gula", "aren", "cold", "brew", "coffee", "shop", "lokal", "signature", "menu", "harga", "saing"],
      category: "lifestyle",
      confidence: 0.92,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Digital nomad adalah gaya hidup di mana seseorang bekerja secara remote sambil berpindah-pindah lokasi. Bali menjadi salah satu destinasi favorit digital nomad dari seluruh dunia.",
      keywords: ["digital", "nomad", "gaya", "hidup", "kerja", "remote", "pindah", "lokasi", "bali", "destinasi", "favorit", "dunia"],
      category: "lifestyle",
      confidence: 0.93,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    }
  ];
}

// Pengetahuan tentang travel dan wisata
function generateTravelKnowledge() {
  return [
    {
      content: "Bali tetap menjadi destinasi wisata paling populer di Indonesia, dengan pantai-pantainya yang indah, sawah terasering, dan budaya unik. Kuta, Seminyak, dan Ubud adalah area yang sering dikunjungi.",
      keywords: ["bali", "destinasi", "wisata", "populer", "indonesia", "pantai", "indah", "sawah", "terasering", "budaya", "unik", "kuta", "seminyak", "ubud", "area", "kunjung"],
      category: "travel",
      confidence: 0.95,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Raja Ampat itu surga buat diving dan snorkeling. Airnya bening banget, terumbu karangnya masih bagus, dan ikan-ikannya colorful. Emang mahal sih, tapi worth it banget!",
      keywords: ["raja", "ampat", "surga", "diving", "snorkeling", "air", "bening", "terumbu", "karang", "bagus", "ikan", "colorful", "mahal", "worth", "it"],
      category: "travel",
      confidence: 0.94,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Labuan Bajo di Flores menjadi semakin populer setelah ditetapkan sebagai salah satu destinasi super prioritas. Terkenal dengan Pulau Komodo, Pulau Padar, dan Pink Beach.",
      keywords: ["labuan", "bajo", "flores", "populer", "tetap", "destinasi", "super", "prioritas", "terkenal", "pulau", "komodo", "padar", "pink", "beach"],
      category: "travel",
      confidence: 0.93,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Borobudur itu candi Buddha terbesar di dunia yang ada di Magelang, Jawa Tengah. Paling recommended dateng pas sunrise, pemandangannya epic banget dan gak terlalu rame turis.",
      keywords: ["borobudur", "candi", "buddha", "terbesar", "dunia", "magelang", "jawa", "tengah", "recommended", "dateng", "sunrise", "pemandangan", "epic", "rame", "turis"],
      category: "travel",
      confidence: 0.94,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Kawah Ijen terkenal dengan fenomena 'blue fire' atau api biru yang hanya bisa dilihat saat malam hari. Para penambang belerang juga bekerja di kawasan ini dengan kondisi ekstrem.",
      keywords: ["kawah", "ijen", "terkenal", "fenomena", "blue", "fire", "api", "biru", "lihat", "malam", "tambang", "belerang", "kerja", "kawasan", "kondisi", "ekstrem"],
      category: "travel",
      confidence: 0.93,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Staycation jadi tren buat liburan singkat. Daripada jauh-jauh, mending booking hotel atau villa deket rumah aja, bisa nikmatin fasilitas kayak kolam renang, spa, dan makanan enak.",
      keywords: ["staycation", "tren", "liburan", "singkat", "jauh", "booking", "hotel", "villa", "deket", "rumah", "nikmat", "fasilitas", "kolam", "renang", "spa", "makanan", "enak"],
      category: "travel",
      confidence: 0.92,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Yogyakarta memiliki banyak tempat wisata menarik seperti Keraton, Malioboro, Taman Sari, dan Prambanan. Kota ini juga terkenal dengan budaya Jawa yang kental dan makanan khasnya.",
      keywords: ["yogyakarta", "tempat", "wisata", "menarik", "keraton", "malioboro", "taman", "sari", "prambanan", "kota", "terkenal", "budaya", "jawa", "kental", "makanan", "khas"],
      category: "travel",
      confidence: 0.95,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    }
  ];
}

// Pengetahuan tentang pertanyaan umum dan jawabannya
function generateCommonQuestionsKnowledge() {
  return [
    {
      content: "Indonesia memiliki 38 provinsi setelah pemekaran Provinsi Papua menjadi beberapa provinsi baru.",
      keywords: ["indonesia", "provinsi", "mekar", "papua", "baru"],
      category: "education",
      confidence: 0.98,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Film Indonesia yang pernah masuk nominasi Oscar adalah 'Tjoet Nja' Dhien' (1989) untuk kategori Best Foreign Language Film.",
      keywords: ["film", "indonesia", "masuk", "nominasi", "oscar", "tjoet", "nja", "dhien", "kategori", "foreign", "language"],
      category: "film",
      confidence: 0.90,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Lagu Indonesia Raya diciptakan oleh W.R. Supratman dan pertama kali diperdengarkan pada Kongres Pemuda II tanggal 28 Oktober 1928.",
      keywords: ["lagu", "indonesia", "raya", "cipta", "supratman", "pertama", "kali", "dengar", "kongres", "pemuda", "oktober", "1928"],
      category: "education",
      confidence: 0.99,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Kenapa langit berwarna biru? Karena molekul udara menyebarkan cahaya biru dari matahari lebih banyak daripada warna lainnya, sehingga kita melihat langit berwarna biru.",
      keywords: ["langit", "warna", "biru", "molekul", "udara", "sebar", "cahaya", "matahari", "banyak", "lihat"],
      category: "science",
      confidence: 0.95,
      sentiment: "neutral",
      isQuestion: true,
      style: "normal"
    },
    {
      content: "Kapan Indonesia merdeka? Indonesia memproklamasikan kemerdekaannya pada tanggal 17 Agustus 1945 yang dibacakan oleh Soekarno didampingi Mohammad Hatta.",
      keywords: ["kapan", "indonesia", "merdeka", "proklamasi", "kemerdekaan", "17", "agustus", "1945", "baca", "soekarno", "mohammad", "hatta"],
      category: "history",
      confidence: 0.99,
      sentiment: "positive",
      isQuestion: true,
      style: "normal"
    },
    {
      content: "Gimana cara bikin kopi susu gula aren yang enak? Pertama seduh kopi dengan air panas, tambahkan gula aren cair, lalu tuang susu segar dan es batu. Bisa juga ditambah vanilla syrup biar lebih harum.",
      keywords: ["gimana", "cara", "bikin", "kopi", "susu", "gula", "aren", "enak", "seduh", "air", "panas", "tambah", "cair", "tuang", "segar", "es", "batu", "vanilla", "syrup", "harum"],
      category: "food",
      confidence: 0.93,
      sentiment: "positive",
      isQuestion: true,
      style: "gaul"
    },
    {
      content: "Perbedaan antara introvert dan ekstrovert adalah bagaimana seseorang mendapatkan energi. Introvert merasa lebih berenergi setelah sendirian, sementara ekstrovert setelah bersosialisasi.",
      keywords: ["beda", "introvert", "ekstrovert", "seseorang", "dapat", "energi", "sendiri", "sosial"],
      category: "education",
      confidence: 0.94,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Kenapa hp cepet panas? Biasanya karena terlalu banyak aplikasi yang jalan di background, main game berat, charging sambil dipake, atau ada masalah di baterai.",
      keywords: ["kenapa", "hp", "cepet", "panas", "aplikasi", "jalan", "background", "main", "game", "berat", "charging", "pake", "masalah", "baterai"],
      category: "technology",
      confidence: 0.92,
      sentiment: "neutral",
      isQuestion: true,
      style: "gaul"
    },
    {
      content: "Apa itu bipolar disorder? Bipolar disorder adalah kondisi kesehatan mental yang menyebabkan perubahan ekstrem pada suasana hati, energi, dan kemampuan untuk berfungsi, terdiri dari episode mania dan depresi.",
      keywords: ["apa", "bipolar", "disorder", "kondisi", "kesehatan", "mental", "sebab", "ubah", "ekstrem", "suasana", "hati", "energi", "kemampuan", "fungsi", "episode", "mania", "depresi"],
      category: "health",
      confidence: 0.96,
      sentiment: "neutral",
      isQuestion: true,
      style: "normal"
    },
    {
      content: "Cara belajar bahasa Inggris yang efektif? Konsisten praktek setiap hari, dengarkan podcast atau nonton film berbahasa Inggris, cari teman untuk praktek speaking, dan gunakan aplikasi seperti Duolingo.",
      keywords: ["cara", "belajar", "bahasa", "inggris", "efektif", "konsisten", "praktek", "dengar", "podcast", "nonton", "film", "teman", "speaking", "aplikasi", "duolingo"],
      category: "education",
      confidence: 0.94,
      sentiment: "positive",
      isQuestion: true,
      style: "normal"
    }
  ];
}

// Pengetahuan tentang ekspresi emosi
function generateEmotionExpressionsKnowledge() {
  return [
    {
      content: "Ikrrrr! Aku sangat setuju dengan pendapatmu!",
      keywords: ["ikr", "aku", "sangat", "setuju", "pendapat"],
      category: "expression",
      confidence: 0.90,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Yeuuu, gak gitu juga kali. Berlebihan banget sih.",
      keywords: ["yeu", "gak", "gitu", "berlebihan", "banget"],
      category: "expression",
      confidence: 0.90,
      sentiment: "negative",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Awokawokawok ngakak parah sih itu mah!",
      keywords: ["awok", "ngakak", "parah", "mah"],
      category: "expression",
      confidence: 0.92,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Huhuhu sedih banget dengernya, jadi pengen nangis.",
      keywords: ["huhu", "sedih", "banget", "denger", "pengen", "nangis"],
      category: "expression",
      confidence: 0.91,
      sentiment: "negative",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Hiyaaa, kaget aku! Gak nyangka bisa gitu.",
      keywords: ["hiya", "kaget", "aku", "gak", "nyangka", "bisa", "gitu"],
      category: "expression",
      confidence: 0.90,
      sentiment: "neutral",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Yaudah sih, biarin aja gitu. Gak usah dipikirin.",
      keywords: ["yaudah", "biarin", "aja", "gitu", "gak", "usah", "pikir"],
      category: "expression",
      confidence: 0.90,
      sentiment: "neutral",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Wih gokil parah! Itu keren banget sumpah!",
      keywords: ["wih", "gokil", "parah", "keren", "banget", "sumpah"],
      category: "expression",
      confidence: 0.92,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Jiaaahh, malu-maluin aja nih orang.",
      keywords: ["jiah", "malu", "aja", "orang"],
      category: "expression",
      confidence: 0.89,
      sentiment: "negative",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Yawlaaa, sabar ya. Pasti ada hikmahnya kok.",
      keywords: ["yawla", "sabar", "ya", "pasti", "ada", "hikmah"],
      category: "expression",
      confidence: 0.90,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Astagaaa, ya ampun. Ini beneran kejadian?",
      keywords: ["astaga", "ya", "ampun", "beneran", "kejadian"],
      category: "expression",
      confidence: 0.90,
      sentiment: "neutral",
      isQuestion: true,
      style: "gaul"
    }
  ];
}

// Pengetahuan tentang kesehatan
function generateHealthKnowledge() {
  return [
    {
      content: "COVID-19 adalah penyakit yang disebabkan oleh virus SARS-CoV-2. Gejalanya termasuk demam, batuk kering, kelelahan, dan hilangnya indra penciuman. Vaksinasi terbukti efektif mengurangi risiko penyakit parah.",
      keywords: ["covid", "19", "penyakit", "virus", "sars", "cov", "2", "gejala", "demam", "batuk", "kering", "lelah", "hilang", "indra", "cium", "vaksinasi", "efektif", "kurang", "risiko", "parah"],
      category: "health",
      confidence: 0.96,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Tips hidup sehat: makan gizi seimbang, olahraga minimal 30 menit sehari, tidur cukup 7-8 jam, minum air putih 8 gelas sehari, dan kelola stres dengan baik.",
      keywords: ["tips", "hidup", "sehat", "makan", "gizi", "seimbang", "olahraga", "minimal", "menit", "tidur", "cukup", "jam", "minum", "air", "putih", "gelas", "kelola", "stres", "baik"],
      category: "health",
      confidence: 0.95,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Skincare dasar itu ada 3 step: cuci muka pake facial wash yang sesuai skin type, toner buat balance pH kulit, sama moisturizer biar kulit tetep lembab. Jangan lupa sunscreen kalo mau keluar rumah!",
      keywords: ["skincare", "dasar", "step", "cuci", "muka", "pake", "facial", "wash", "sesuai", "skin", "type", "toner", "balance", "ph", "kulit", "moisturizer", "lembab", "sunscreen", "keluar", "rumah"],
      category: "health",
      confidence: 0.93,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Jangan sering begadang! Kurang tidur bisa bikin sistem imun turun, gangguan metabolisme yang bikin berat badan naik, dan risiko penyakit jantung juga meningkat.",
      keywords: ["jangan", "sering", "begadang", "kurang", "tidur", "bikin", "sistem", "imun", "turun", "ganggu", "metabolisme", "berat", "badan", "naik", "risiko", "penyakit", "jantung", "tingkat"],
      category: "health",
      confidence: 0.94,
      sentiment: "negative",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Untuk menjaga kesehatan mental: jangan ragu mencari bantuan profesional, bicara dengan orang yang dipercaya, lakukan kegiatan yang disukai, dan latihan mindfulness atau meditasi.",
      keywords: ["jaga", "kesehatan", "mental", "jangan", "ragu", "cari", "bantu", "profesional", "bicara", "orang", "percaya", "laku", "kegiatan", "suka", "latihan", "mindfulness", "meditasi"],
      category: "health",
      confidence: 0.95,
      sentiment: "positive",
      isQuestion: false,
      style: "normal"
    },
    {
      content: "Workout di rumah yang efektif: push up buat latih otot dada dan tangan, squat buat latih paha dan kaki, plank buat latih core, dan jumping jack buat kardio. Minimal 15-20 menit sehari udah cukup.",
      keywords: ["workout", "rumah", "efektif", "push", "up", "latih", "otot", "dada", "tangan", "squat", "paha", "kaki", "plank", "core", "jumping", "jack", "kardio", "minimal", "menit", "cukup"],
      category: "health",
      confidence: 0.93,
      sentiment: "positive",
      isQuestion: false,
      style: "gaul"
    },
    {
      content: "Diabetes adalah kondisi kronis di mana tubuh tidak dapat mengatur kadar gula darah dengan benar. Gejalanya termasuk sering haus, sering buang air kecil, dan mudah lelah.",
      keywords: ["diabetes", "kondisi", "kronis", "tubuh", "atur", "kadar", "gula", "darah", "benar", "gejala", "sering", "haus", "buang", "air", "kecil", "mudah", "lelah"],
      category: "health",
      confidence: 0.95,
      sentiment: "neutral",
      isQuestion: false,
      style: "normal"
    }
  ];
}

// Jalankan fungsi utama
if (require.main === module) {
  seedKnowledge()
    .then(() => {
      logger.info('Proses seeding selesai!');
      process.exit(0);
    })
    .catch(err => {
      logger.error('Error dalam proses seeding:', err);
      process.exit(1);
    });
} else {
  // Export fungsi untuk digunakan oleh modul lain
  module.exports = {
    seedKnowledge
  };
}