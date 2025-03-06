// data/slang-dictionary.js
// Kamus bahasa gaul dan slang Indonesia untuk respons natural

/**
 * Kamus kata formal ke kata gaul
 * Format: { "kata_formal": ["gaul1", "gaul2", ...] }
 */
const formalToSlang = {
  // Pronoun / Kata ganti
  "saya": ["gue", "gw", "w", "aku", "aing", "ane", "gua"],
  "kamu": ["lu", "lo", "elu", "elo", "u", "kau", "kalian"],
  "dia": ["dy", "doi", "dia", "si dia", "mereka"],
  "mereka": ["mrk", "mereka2", "merekaa", "mreka", "mereq"],
  "kita": ["kita2", "qta", "kitah", "kt"],
  "kami": ["kami2", "qmi", "kmi"],
  
  // Verbs / Kata kerja
  "ingin": ["pengen", "pgn", "pen", "pingin", "mau"],
  "pergi": ["cabut", "cabs", "capcus", "cap cus", "otw", "metu", "minggat", "gas", "gass", "ngacir"],
  "makan": ["mam", "mamam", "mangan", "nyam", "ngemil", "makan2"],
  "tidur": ["bobo", "boboan", "tdr", "merem", "molor", "rebahan", "hibernate"],
  "bermain": ["mabar", "mainin", "main2", "main", "mainan"],
  "belajar": ["bljr", "studi", "jigong", "ngopi"],
  "bekerja": ["kerja", "keja", "grind", "hustle", "nguli"],
  "berbicara": ["ngomong", "ngmg", "ngbrl", "bacot", "chat", "ngechat", "ngobrol", "omongan", "omong"],
  "berpikir": ["mikir", "mikin", "berpikir keras", "bengong", "loading"],
  "melihat": ["ngeliat", "nonton", "liat", "ngintip", "mantau", "ngeliatin", "ngelirik"],
  "tertawa": ["ketawa", "ngakak", "wkwk", "lol", "awok", "haha", "xixi", "kekw"],
  
  // Adjectives / Kata sifat
  "bagus": ["keren", "mantap", "mantul", "jos", "goks", "gokil", "glxy", "ajib", "mantab", "terbaik", "mumpuni", "maknyus"],
  "buruk": ["jelek", "parah", "ancur", "sampah", "amburadul", "bobrok", "burik", "ampas"],
  "banyak": ["byk", "buanyak", "akeh", "bnyk", "buanyakk"],
  "sedikit": ["dikit", "dkt", "sikit", "sitik", "stengah"],
  "senang": ["seneng", "happy", "hepi", "bahagia", "riang", "gembira"],
  "sedih": ["galau", "melow", "sedi", "sdh", "nangis", "mewek", "mellow", "baper"],
  "marah": ["ngamuk", "kesel", "bete", "bt", "sebel", "sewot", "geram", "murka"],
  "takut": ["takoot", "wedi", "parno", "paranoid", "ciut", "kecut"],
  "cantik": ["cakep", "pretty", "geulis", "ayu", "cute", "kyut", "unyu", "gemesin"],
  "tampan": ["ganteng", "cakep", "gans", "tamvan", "kece", "cool", "keren"],
  "pintar": ["pinter", "jenius", "genius", "cerdas", "smart", "jago", "mastah"],
  "bodoh": ["bego", "goblok", "tolol", "dongok", "lemot", "gblk", "bloon", "pepeg", "oon"],
  "lucu": ["kocak", "ngakak", "lawak", "gokil", "receh", "ngocol", "ngekek"],
  "menarik": ["asik", "asyik", "seru", "rame", "kece", "epic", "hokinya", "mupeni"],
  "hebat": ["keren", "gila", "goks", "gokil", "gilak", "gileee", "anjay", "anjir", "anjer", "asik", "epik", "goks", "asoi"],
  
  // Common words / Kata umum
  "sangat": ["banget", "bgt", "bet", "bngt", "bener2", "super", "parah", "bgtt", "sangad"],
  "sekali": ["bgt", "banget", "bgtt", "amat", "sangat", "bet"],
  "tetapi": ["tapi", "tp", "cuma", "btw", "but", "cuman"],
  "dan": ["n", "&", "ama", "ma", "ame", "sama", "bareng"],
  "dengan": ["pake", "dgn", "dg", "pk", "pakai", "ama", "make", "ampe", "sampe"],
  "untuk": ["buat", "utk", "bwt", "4", "tuk", "of"],
  "lagi": ["lg", "again", "maning", "maneh", "lgy"],
  "sedang": ["lagi", "lg", "currently", "atm", "lge"],
  "sudah": ["udah", "dah", "sdh", "wis", "uwis", "uda", "done", "kelar", "beres"],
  "belum": ["blm", "belom", "blom", "durung", "not yet"],
  "tidak": ["nggak", "gak", "ga", "g", "kagak", "kaga", "ndak", "ora", "no", "tdk", "nope", "nggk"],
  "iya": ["y", "ya", "yoi", "yo", "iyes", "yes", "yess", "iye", "iyh", "yeh", "yupp", "yup", "he'eh", "yo'i"],
  "apa": ["ap", "ape", "apaan", "apasi", "naon"],
  "kapan": ["kpn", "kapansi", "kapantu", "when"],
  "dimana": ["dmn", "dimana sih", "dimana si", "dimn", "dmana", "where"],
  "kenapa": ["knp", "kenapose", "why", "napa", "ngapa", "ngapain", "y", "kenape"],
  "bagaimana": ["gmn", "gimana", "kepriwe", "piw", "howto", "gimane", "piye"],
  
  // Internet Slang / Slang internet
  "sahabat": ["bestie", "besti", "sobat", "bro", "sis", "gaes", "guys", "men", "man", "bre", "cuy", "brader", "bray"],
  "bercanda": ["kidding", "jk", "joke", "becanda", "canda", "just kidding", "jks"],
  "juga": ["too", "jg", "as well", "uga", "jg"],
  "serius": ["srius", "seriously", "seris", "rly", "rl", "bener", "fr", "for real"],
  "karena": ["krn", "karna", "bcz", "because", "soalnya", "gegara", "gara2"],
  "sekarang": ["skrg", "now", "skg", "saiki", "skr", "now"],
  "terima kasih": ["thx", "thanks", "tq", "ty", "thank you", "makasih", "makasi", "maksih", "tengkyu", "tengks"],
  "maaf": ["sorry", "sry", "mb", "my bad", "maap", "maapin", "sori", "srry"],
  "sepertinya": ["sprt", "sptny", "kynya", "nya", "ny", "rasa", "rasanya", "kayaknya", "keknya", "yknya"],
  "soalnya": ["cuz", "because", "krn", "karna", "karena", "gegara", "gara2"],
  "kalau": ["klo", "kalo", "if", "klo", "misal", "misalnya"],
  "terlalu": ["kelewat", "klamaan", "2lalu", "too"],
  "tentang": ["about", "ttg", "soal", "mengenai"],
  
  // Popular Indonesian Slang / Populer slang Indonesia
  "begitu": ["gitu", "gitu", "gt", "begono", "ngono", "mcm gt", "mcm gtu"],
  "begini": ["gini", "gini", "gn", "begene", "mcm gni"],
  "santai": ["nyantai", "santuy", "sante", "relax", "rileks", "enteng", "chillax"],
  "bisa": ["bs", "biza", "iso", "bsa", "can"],
  "jalan": ["jln", "jln2", "jlnin", "jalan2", "jalanan"],
  "jadi": ["so", "jd", "jdnya", "jdny", "jadinya", "makanya"],
  "teman": ["tmn", "frens", "temen", "men", "friend", "fwen", "frenz", "kawan", "sob"],
  "mengerti": ["ngerti", "paham", "mudeng", "ngeh", "ngeh", "connect", "konek", "donlot"],
  "luar biasa": ["amazing", "amazeballs", "kece", "boljug", "boleh juga"],
  "sungguh": ["sumpah", "serius", "bener", "fr", "for real", "enelan", "tenan"],
  "kasihan": ["kasian", "kesian", "ksian", "huhuu", "sedih"],
  "biasanya": ["biasany", "bsanya", "biasa", "normalnya", "umumnya"],
  
  // Time expressions / Ekspresi waktu
  "hari ini": ["today", "hri ini", "hari ni", "hr ini", "h ini", "tdy"],
  "kemarin": ["kmrn", "yesterday", "kmaren", "kmrin", "kemaren"],
  "besok": ["bsk", "besuk", "tmrw", "tomorrow", "next day"],
  "lusa": ["day after tomorrow", "besok besoknya", "2 hari lagi"],
  "tadi": ["td", "earlier", "barusan", "sblmnya", "before", "baru"],
  "nanti": ["nnti", "nti", "later", "tar", "entar", "ntar"],
  "sebentar": ["bentar", "sntr", "sbntr", "bentaran", "sbtr"],
  
  // Interjections / Seruan
  "astaga": ["astagfir", "astaga", "astgfr", "aseli", "ya ampun", "ya Lord", "ya Allah", "masya Allah", "duh Gusti"],
  "aduh": ["aduh", "aduduh", "hadeh", "ndolo", "wadaw", "waduh", "astaghfirullah"],
  "waduh": ["wadaw", "wadoh", "hadeh", "waduh", "aduduh", "jancok"],
  "wow": ["woah", "wah", "uwow", "woww", "zaamn", "weew"],
  "duh": ["aduh", "duhhh", "dhh", "hadeh", "astaghfirullah", "astagfir"],
  
  // Popular phrases / Frasa populer
  "bukan": ["bkn", "no", "kagak", "kga", "ndak"],
  "hanya": ["only", "doang", "cuma", "aja", "just", "cuman", "doank"],
  "semua": ["all", "smua", "smuanya", "semuana", "kabeh"],
  "beberapa": ["some", "bbrp", "sekian", "several"],
  "mungkin": ["mgkn", "mngkn", "kali", "perhaps", "maybe", "mkin", "mgkin", "most likely", "barangkali"],
  "pasti": ["pst", "def", "definitely", "for sure", "suer", "sure", "certainly"],
  "tentu": ["ttu", "obviously", "obviously", "ofc", "of course", "for sure"],
  "kadang": ["kadang2", "kadang", "sometimes", "sekali2", "sometimes", "smtms", "kadang-kadang", "kdg", "kdg2"],
  "sering": ["srg", "often", "frequently", "sering2", "banyak banget", "mesti"],
  "jarang": ["jrg", "rarely", "jrng", "sesekali", "dikit banget", "jrg2"],
  "masih": ["msh", "still", "msih", "tetep", "tetap"],
  
  // Intensifiers / Penguat
  "benar-benar": ["banget", "beneran", "asli", "literally", "lit", "sumpah", "serius", "parah", "anjir"],
  "terlalu": ["kegituan", "banget", "kelewatan", "parah"],
  "hampir": ["almost", "nyaris", "dikit lagi", "msh kurang dikit", "dikit lagi"],
  "sedikit": ["dkit", "dikit", "sikit", "secuil", "sedikit", "stgh", "setengah", "separo"],
  "saja": ["aja", "just", "only", "doang", "doank", "aj"],
  "harus": ["kudu", "must", "mesti", "wajib", "hrs"],
  "boleh": ["blh", "allowed", "may", "silakan", "monggoh", "monggo"],
  
  // Internet abbreviations / Singkatan internet
  "omong-omong": ["btw", "by the way", "ngomong2", "oh iya"],
  "tertawa terbahak-bahak": ["lmao", "lmfao", "wkwk", "wkwkwk", "haha", "xixixixi"],
  "apa kabar": ["how are you", "hru", "kbr", "kabare piye", "gmn kabar", "wsgd"],
  "sedang apa": ["what's up", "lagi ngapain", "lg ngapain", "wassup", "wsp", "wsup"],
  "sampai jumpa": ["see you", "cu", "cya", "dadah", "bye", "byee", "jmp", "smpai jmp"],
  "dalam perjalanan": ["otw", "on the way", "dijalan", "di jalan", "otw", "on my way"],
  "setuju": ["agree", "stju", "setubuh", "stj", "acc", "oke", "ok"],
  "menurut pendapatku": ["imo", "imho", "menurutku", "mnrtku", "menurutq", "mnrt gue"],
  "aku pergi dulu": ["gtg", "got to go", "cabut dulu", "off dulu", "harus pergi"],
  "semoga sukses": ["gl", "good luck", "sukses", "semangat", "gas", "gaskeun"],
  "tanpa melihat": ["didn't read", "tldr", "too long", "kepanjangan"],
  "informasi saja": ["fyi", "for your info", "sekedar info", "info aja", "info doang"],
  
  // Technology / Teknologi
  "handphone": ["hp", "hape", "ponsel", "smartphone", "gadget", "mobile", "telpon", "telfon", "telp", "tlp", "tlpn"],
  "komputer": ["pc", "laptop", "komp", "kompi", "komp", "cpu"],
  "aplikasi": ["app", "apk", "application", "program", "software", "apl"],
  "internet": ["inet", "net", "online", "connection", "koneksi"],
  "media sosial": ["socmed", "sosmed", "sosial media"],
  "youtube": ["yutub", "ytb", "yt", "tuktube"],
  "instagram": ["ig", "insta", "instageram", "instakolorejo"],
  "facebook": ["fb", "fesbuk", "fsbk", "fesbok", "pesbuk"],
  "twitter": ["x", "twitter", "tuiter", "twt", "twitt"],
  "tiktok": ["tt", "titok", "tiktokan", "ticitoci"],
  
  // Random popular slang / Slang populer acak
  "mantap": ["mantul", "mantap", "mantep", "maknyos", "maknyuss", "mntl", "keren"],
  "kepo": ["curious", "penasaran", "pnsr", "pnasrn", "ke po"],
  "receh": ["jayus", "garing", "boring", "boring"],
  "gercep": ["gerak cepat", "agile", "gesit", "cepet"],
  "baper": ["sensitive", "sentimen", "emosional", "sensitif", "sensitive", "sensi"],
  "auto": ["langsung", "lsg", "instan", "lngsng"],
  "ciyee": ["cie", "cieee", "ciyeee", "ciyee", "hayoo", "ahayy"],
  "ghosting": ["ngilang", "ilang", "menghilang", "hilang", "ga dibales"],
  "bucin": ["budak cinta", "simp", "simping", "lovesick", "kangen"],
  "gaskeun": ["gas", "laju", "go", "ayok", "ayookkk", "gasgasgas"],
  "zonk": ["scammed", "kecewa", "fail", "gagal", "nipu", "deceived", "broken"],
  "dongo": ["noob", "madesu", "lemot", "lola", "gaptek", "gak jelas"]
};

/**
 * Kamus kata gaul ke kata formal
 * Ini dibuat otomatis dari formalToSlang untuk lookup cepat
 */
const slangToFormal = {};

// Build reverse mapping
for (const [formal, slangList] of Object.entries(formalToSlang)) {
  for (const slang of slangList) {
    slangToFormal[slang] = formal;
  }
}

/**
 * Daftar emoji populer berdasarkan kategori
 */
const popularEmojis = {
  happy: ["😊", "😄", "😁", "😆", "🙂", "😀", "😃", "🤗", "🥰", "☺️"],
  love: ["❤️", "💕", "💖", "💓", "💗", "💘", "💝", "💞", "😍", "😘"],
  sad: ["😢", "😭", "😿", "😥", "😓", "😔", "🥺", "😞", "😟", "😕"],
  angry: ["😡", "😠", "🤬", "😤", "👿", "💢", "💣", "💥", "😒", "😑"],
  shock: ["😱", "😲", "😯", "😮", "😦", "😧", "😨", "🤯", "😬", "😳"],
  funny: ["😂", "🤣", "😹", "😅", "😝", "😜", "😛", "🤪", "🤭", "🤫"],
  cool: ["😎", "🤩", "🤟", "🤘", "👍", "👌", "🔥", "✌️", "👊", "💯"],
  confused: ["🤔", "🧐", "😕", "😟", "🙄", "😒", "😑", "😐", "❓", "🤨"],
  sick: ["🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🥴", "😵", "🤠", "🥵"],
  animals: ["🐱", "🐶", "🦊", "🐰", "🐻", "🐼", "🦁", "🐯", "🐨", "🐮"],
  food: ["🍕", "🍔", "🍟", "🌭", "🍖", "🍗", "🥩", "🍝", "🍜", "🍣"],
  activities: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🎮", "🎬", "📱", "💻"],
  nature: ["🌳", "🌲", "🌴", "🌵", "🌿", "🍀", "🌱", "🌷", "🌸", "🌹"]
};

/**
 * Fungsi bantuan untuk mengubah kalimat ke versi gaul
 * @param {string} text - Teks formal untuk diubah
 * @param {number} gaulLevel - Tingkat kegaulan (0-1)
 * @returns {string} Versi gaul dari teks
 */
function makeTextGaul(text, gaulLevel = 0.6) {
  if (!text) return text;
  
  // Split into words, preserving punctuation
  const words = text.split(/\b/);
  
  // Chance to convert each formal word to slang based on gaulLevel
  return words.map(word => {
    // Skip punctuation and short words
    if (word.length <= 2 || /[^\w\s]/.test(word)) return word;
    
    const lowerWord = word.toLowerCase();
    // Try to find slang version
    if (formalToSlang[lowerWord] && Math.random() < gaulLevel) {
      const slangOptions = formalToSlang[lowerWord];
      return slangOptions[Math.floor(Math.random() * slangOptions.length)];
    }
    
    return word;
  }).join('');
}

/**
 * Fungsi bantuan untuk mengubah kalimat gaul ke versi formal
 * @param {string} text - Teks gaul untuk diubah
 * @returns {string} Versi formal dari teks
 */
function makeTextFormal(text) {
  if (!text) return text;
  
  // Split into words, preserving punctuation
  const words = text.split(/\b/);
  
  // Convert each slang word to formal
  return words.map(word => {
    // Skip punctuation and short words
    if (word.length <= 2 || /[^\w\s]/.test(word)) return word;
    
    const lowerWord = word.toLowerCase();
    // Try to find formal version
    if (slangToFormal[lowerWord]) {
      return slangToFormal[lowerWord];
    }
    
    return word;
  }).join('');
}

/**
 * Menambahkan emoji acak ke teks
 * @param {string} text - Teks untuk ditambahkan emoji
 * @param {number} emojiLevel - Tingkat emoji (0-1)
 * @returns {string} Teks dengan emoji
 */
function addRandomEmoji(text, emojiLevel = 0.5) {
  if (!text || emojiLevel <= 0) return text;
  
  // Get all emoji categories
  const categories = Object.keys(popularEmojis);
  
  // Choose a random category
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  // Choose a random emoji from that category
  const emoji = popularEmojis[category][Math.floor(Math.random() * popularEmojis[category].length)];
  
  // Position emoji at beginning, end, or both based on emojiLevel
  if (emojiLevel > 0.8) {
    // High emoji level = emoji at both start and end
    return `${emoji} ${text} ${emoji}`;
  } else if (emojiLevel > 0.5 || Math.random() < 0.5) {
    // Medium-high emoji level or 50% chance = emoji at end
    return `${text} ${emoji}`;
  } else {
    // Otherwise emoji at beginning
    return `${emoji} ${text}`;
  }
}

// Export semua yang dibutuhkan
module.exports = {
  formalToSlang,
  slangToFormal,
  popularEmojis,
  makeTextGaul,
  makeTextFormal,
  addRandomEmoji
};