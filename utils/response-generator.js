// utils/response-generator.js
// Modul untuk membuat respons natural dan ekspresif

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
    new winston.transports.File({ filename: 'response-generator.log' })
  ]
});

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

// Response styles untuk berbagai tipe respons
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
  
  yesno_question: [
    "Iya dong, ", 
    "Yoi, ",
    "Hmm, kayaknya iya. ",
    "Nope, ",
    "Kayaknya engga deh. "
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
  
  gratitude: [
    "Sama-sama! ",
    "No prob! ",
    "Santuy~ ",
    "Anytime! ",
    "Dengan senang hati! "
  ],
  
  apology: [
    "It's okay kok! ",
    "Gapapa, santai aja! ",
    "No worries! ",
    "Gak masalah! ",
    "Santuy aja kali! "
  ],
  
  greeting: [
    "Heyy! ",
    "Haloo! ",
    "Haii! ",
    "Yuhuuu! ",
    "Hai there! "
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

// Fallback responses ketika tidak ada jawaban yang cocok
const fallbackResponses = {
  learning: [
    "Hmm, menarik nih. Bisa cerita lebih lengkap ga?",
    "Wah, gue masih belajar soal ini nih. Bisa jelasin lebih detail?",
    "Kayaknya gue perlu belajar lebih banyak soal ini. Ceritain dong lebih banyak",
    "Gue lagi nyoba ngerti soal ini. Ada info tambahan yang bisa lo kasih?",
    "Ini baru buat gue. Seneng bisa belajar lebih banyak dari lo soal ini.",
    "Asik nih topiknya, tapi gue masih kurang info. Bisa sharing lebih?",
    "Aduh, gue gak terlalu paham soal ini. Ajarin gue dong~",
    "Ini masih agak blur buat gue. Bisa kasih pencerahan?"
  ],
  
  question: [
    "Pertanyaan bagus! Sayangnya gue belum punya cukup info nih. Menurut lo gimana?",
    "Gue masih ngumpulin data soal itu. Kalo menurut lo sendiri gimana?",
    "Hmm, gue perlu belajar lebih banyak buat jawab itu dengan bener. Ada ide lo?",
    "Gue masih proses belajar buat jawab itu. Lo sendiri gimana mikirnya?",
    "Pertanyaan menarik! Tp jujur gue blm bs jawab skrg. Menurut lo gmn?"
  ],
  
  conversation: [
    "Menarik! Cerita lebih dong",
    "Oh gitu, terus gmn?",
    "Wah oke, ada lagi yg mau diomongin?",
    "I see. Ada hal lain yg mau dibahas?",
    "Hmm, jadi penasaran. Next?",
    "Oh gitu toh. Anyway, ada topik lain?"
  ]
};

/**
 * Pilih respons terbaik dari pengetahuan yang relevan
 * @param {Array} knowledge - Array knowledge entries
 * @param {string} query - Query user
 * @param {Array} context - Konteks percakapan
 * @param {string} responseType - Tipe respons yang dibutuhkan
 * @returns {Object} Knowledge entry terbaik
 */
function selectBestResponse(knowledge, query, context, responseType) {
  // Validasi input untuk menghindari error
  if (!Array.isArray(knowledge) || knowledge.length === 0) {
    return null;
  }
  
  // Score setiap knowledge entry
  const scoredKnowledge = knowledge.map(k => {
    let score = k.confidence || 0.5;
    
    // Calculate keyword match score
    if (query && typeof query === 'string') {
      const queryWords = query.toLowerCase().split(/\s+/);
      queryWords.forEach(word => {
        if (k.content && typeof k.content === 'string' && k.content.toLowerCase().includes(word)) {
          score += 0.05;
        }
        
        if (Array.isArray(k.keywords) && k.keywords.includes(word)) {
          score += 0.1;
        }
      });
    }
    
    // Context match bonus - with safety checks
    if (context && Array.isArray(context) && context.length > 0) {
      const lastMessages = context.slice(-3);
      lastMessages.forEach(msg => {
        if (msg && msg.text && k.context && Array.isArray(k.context)) {
          // Safely check each context item
          for (let i = 0; i < k.context.length; i++) {
            const c = k.context[i];
            if (c && c.text && typeof c.text === 'string' && c.text.includes(msg.text)) {
              score += 0.15;
              break; // Found a match, no need to continue checking
            }
          }
        }
      });
    }
    
    // Response type match bonus
    if (responseType === 'factual' && k.isQuestion === false) {
      score += 0.1;
    } else if (responseType === 'question' && k.isQuestion === true) {
      score += 0.1;
    } else if (responseType === 'joke' && k.isJoke === true) {
      score += 0.2;
    }
    
    // Recency bonus
    if (k.learned && k.learned instanceof Date) {
      const ageInDays = (new Date() - new Date(k.learned)) / (1000 * 60 * 60 * 24);
      score += Math.max(0, 0.2 - (ageInDays / 30) * 0.2);
    }
    
    // Prioritaskan jawaban non-pertanyaan untuk pertanyaan
    if (responseType && responseType.includes('question') && k.isQuestion === true) {
      score -= 0.1;
    }
    
    // Prioritaskan respon dari konteks yang sama (private/group)
    if (k.sourceType === 'private_chat' && responseType && responseType.includes('private')) {
      score += 0.05;
    } else if (k.sourceType === 'group_chat' && responseType && responseType.includes('group')) {
      score += 0.05;
    }
    
    return { knowledge: k, score };
  });
  
  // Sort by score
  scoredKnowledge.sort((a, b) => b.score - a.score);
  
  // Return the highest scored knowledge entry
  return scoredKnowledge.length > 0 ? scoredKnowledge[0].knowledge : null;
}

/**
 * Buat respons dinamis yang terdengar alami
 * @param {Object} knowledge - Knowledge entry yang dipilih
 * @param {string} query - Query user
 * @param {Array} context - Konteks percakapan
 * @param {string} responseType - Tipe respons yang dibutuhkan
 * @param {string} userStyle - Gaya bahasa user (gaul, formal, normal)
 * @returns {string} Respons yang telah diolah
 */
function createDynamicResponse(knowledge, query, context, responseType, userStyle) {
  // Safety check
  if (!knowledge || !knowledge.content) {
    return createFallbackResponse(query, context, responseType && responseType.includes('question'), userStyle || 'normal');
  }
  
  const content = knowledge.content;
  
  // Jika ini pengetahuan awal, bisa langsung digunakan dengan beberapa variasi
  if (knowledge.source === 'initial_knowledge') {
    return addNaturalVariations(content, responseType, userStyle || 'normal');
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
  if (context && Array.isArray(context) && context.length > 0 && responseType && responseType.includes('conversation')) {
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
      return addNaturalVariations(phrase, responseType, userStyle || 'normal');
    }
  }
  
  return addNaturalVariations(response, responseType, userStyle || 'normal');
}

/**
 * Tambahkan variasi natural dengan style gaul
 * @param {string} text - Teks dasar
 * @param {string} responseType - Tipe respons
 * @param {string} userStyle - Gaya bahasa user
 * @returns {string} Teks dengan variasi natural
 */
function addNaturalVariations(text, responseType, userStyle) {
  if (!text) return "Hmm, aku bingung mau jawab apa nih...";
  
  // Split teks jadi kalimat
  let sentences = text.split(/(?<=[.!?])\s+/);
  if (!Array.isArray(sentences) || sentences.length === 0) sentences = [text];
  
  // Jika userStyle formal, kurangi efek gaul
  const gaulLevel = userStyle === 'formal' ? 0.2 : (userStyle === 'gaul' ? 0.9 : 0.6);
  
  // Ambil tipe respons dasar (tanpa _private atau _group)
  const baseResponseType = responseType ? responseType.split('_')[0] : 'conversation';
  
  // Pilih style random yang sesuai dengan response type
  const styles = responseStyles[baseResponseType] || responseStyles.conversation;
  if (!Array.isArray(styles) || styles.length === 0) return text; // Safety check
  
  const selectedStyle = styles[Math.floor(Math.random() * styles.length)];
  
  // Modifikasi teks utama dengan bahasa gaul (jika level gaul tinggi)
  let modifiedText = text;
  if (Math.random() < gaulLevel) {
    // Replace beberapa kata dengan versi gaul
    for (const [formal, gaulOptions] of Object.entries(gaulDictionary.slang)) {
      if (!Array.isArray(gaulOptions) || gaulOptions.length === 0) continue; // Safety check
      
      const regex = new RegExp(`\\b${formal}\\b`, 'gi');
      // Randomly select a gaul version
      if (modifiedText.match(regex) && Math.random() < gaulLevel) {
        const gaulWord = gaulOptions[Math.floor(Math.random() * gaulOptions.length)];
        modifiedText = modifiedText.replace(regex, gaulWord);
      }
    }
  }
  
  // Tambahkan akhiran kalimat gaul (40% chance jika level gaul tinggi)
  if (Math.random() < gaulLevel * 0.6) {
    const endingExpressions = gaulDictionary.endingExpressions;
    if (Array.isArray(endingExpressions) && endingExpressions.length > 0) {
      const ending = endingExpressions[Math.floor(Math.random() * endingExpressions.length)];
      modifiedText = modifiedText.replace(/[.!?]$/, '') + ending + '.';
    }
  }
  
  // Tambahkan emoji (60% chance jika level gaul tinggi)
  if (Math.random() < gaulLevel * 0.8) {
    const emojis = gaulDictionary.emojis;
    if (Array.isArray(emojis) && emojis.length > 0) {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      // Posisikan emoji di awal, tengah, atau akhir
      const position = Math.random();
      if (position < 0.3) {
        modifiedText = emoji + ' ' + modifiedText;
      } else if (position < 0.7) {
        modifiedText = modifiedText.replace(/[.!?]$/, '') + ' ' + emoji;
      } else {
        // Coba posisikan di tengah kalimat
        const parts = modifiedText.split(' ');
        if (parts.length > 3) {
          const middleIndex = Math.floor(parts.length / 2);
          parts.splice(middleIndex, 0, emoji);
          modifiedText = parts.join(' ');
        } else {
          modifiedText = modifiedText + ' ' + emoji;
        }
      }
    }
  }
  
  // 70% chance untuk menambahkan prefix style
  if (Math.random() < 0.7) {
    return selectedStyle + modifiedText;
  }
  
  return modifiedText;
}

/**
 * Buat fallback response ketika tidak ada knowledge match
 * @param {string} query - Query user
 * @param {Array} context - Konteks percakapan
 * @param {boolean} isQuestion - Apakah query adalah pertanyaan
 * @param {string} userStyle - Gaya bahasa user
 * @returns {string} Fallback response
 */
function createFallbackResponse(query, context, isQuestion, userStyle) {
  const gaulLevel = userStyle === 'formal' ? 0.2 : (userStyle === 'gaul' ? 0.9 : 0.6);
  
  let responses;
  if (isQuestion) {
    responses = fallbackResponses.question;
  } else if (context && Array.isArray(context) && context.length > 0) {
    responses = fallbackResponses.conversation;
  } else {
    responses = fallbackResponses.learning;
  }
  
  if (!Array.isArray(responses) || responses.length === 0) {
    return "Hmm, menarik. Bisa cerita lebih?";
  }
  
  let response = responses[Math.floor(Math.random() * responses.length)];
  
  // Tambahkan emoji (70% chance jika level gaul tinggi)
  if (Math.random() < gaulLevel * 0.7 && Array.isArray(gaulDictionary.emojis) && gaulDictionary.emojis.length > 0) {
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

/**
 * Buat respons salam setelah diundang ke grup baru
 * @param {string} groupTitle - Nama grup
 * @param {string} addedBy - Username yang mengundang bot
 * @returns {string} Respons salam
 */
function createGroupJoinResponse(groupTitle, addedBy) {
  const greetings = [
    `Hai semuanya! Makasih udah nambahin gue ke grup ${groupTitle}! 🤗 Gue bot yang terus belajar dari percakapan. Semakin banyak kalian ngobrol, gue bakal makin pinter!`,
    
    `Halo guys! Salam kenal semuanya di grup ${groupTitle}! 👋 Gue AI yang dibuat @hiyaok, yang bakal belajar dari obrolan kalian. Mention gue kalo butuh bantuan ya!`,
    
    `Yuhuuu! Akhirnya gue join juga di ${groupTitle}! 🥳 Btw, gue bakal belajar dari percakapan kalian, jadi santai aja ngobrolnya. Mau tanya sesuatu? Mention gue aja ya!`,
    
    `Hola geng ${groupTitle}! 😎 Makasih @${addedBy} udah invite gue! Gue bot yang bisa belajar dari semua obrolan di grup. Makin sering kalian chat, makin pinter gue!`,
    
    `Heyy! Salam kenal semuanya di ${groupTitle}! ✌️ Gue bot AI yang terus belajar. Kalo mau nanya atau ngobrol, tag gue ya. Let's have fun!`
  ];
  
  if (!Array.isArray(greetings) || greetings.length === 0) {
    return `Halo semua! Makasih udah nambahin saya ke grup ini. Saya akan belajar dari percakapan kalian!`;
  }
  
  return greetings[Math.floor(Math.random() * greetings.length)];
}

/**
 * Buat respons tentang identitas bot
 * @returns {string} Respons identitas
 */
function createIdentityResponse() {
  const responses = [
    "Saya adalah AI buatan @hiyaok, dirancang untuk belajar dan berbicara dengan cara yang natural! 🤖 Saya belajar dari setiap percakapan kita, jadi semakin banyak kita ngobrol, semakin pintar saya.",
    
    "Hai! Saya adalah AI yang dibuat oleh @hiyaok. Saya terus belajar dari setiap obrolan, baik di grup maupun chat pribadi. Dengan cara ini, saya bisa berkembang dan memberikan jawaban yang lebih baik seiring waktu.",
    
    "Perkenalkan, saya adalah AI pembelajaran yang dikembangkan oleh @hiyaok. Berbeda dari AI biasa, saya belajar dari percakapan dan terus berkembang, menyesuaikan diri dengan cara kamu dan orang lain berkomunikasi.",
    
    "Saya adalah AI yang selalu belajar, buatan @hiyaok. Yang membuat saya berbeda adalah kemampuan untuk terus mengembangkan pengetahuan dari setiap interaksi. Senang berkenalan dengan kamu!"
  ];
  
  if (!Array.isArray(responses) || responses.length === 0) {
    return "Saya adalah AI buatan @hiyaok yang belajar dari percakapan.";
  }
  
  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Buat respons help
 * @param {string} botUsername - Username bot
 * @returns {string} Respons help
 */
function createHelpResponse(botUsername) {
  return "🤖 <b>Bantuan Penggunaan Bot</b>\n\n" +
    "• Aku belajar dari setiap percakapan di grup dan chat pribadi\n" +
    "• Di grup: mention aku dengan @" + botUsername + " untuk mendapat respon\n" +
    "• Di chat pribadi: langsung chat aja, gak perlu mention\n" +
    "• Aku merespon dengan gaya natural dan ekspresif\n\n" +
    "Perintah yang tersedia:\n" +
    "/start - Memulai percakapan dengan bot\n" +
    "/help - Menampilkan bantuan ini\n" +
    "/about - Informasi tentang bot\n\n" +
    "Makin banyak kalian ngobrol, makin pinter aku! 😎";
}

/**
 * Buat respons about
 * @returns {string} Respons about
 */
function createAboutResponse() {
  return "Gue adalah AI buatan @hiyaok, yang dirancang untuk belajar terus menerus dan ngobrol dengan gaya yang natural! 🤖✨\n\n" +
    "Gue belajar dari setiap interaksi, baik di grup maupun chat pribadi. Pengetahuan gue terus nambah seiring waktu.\n\n" +
    "Gue bisa diajak bahas berbagai topik dan selalu berusaha kasih respons yang asik, bukan jawaban kaku dari template.\n\n" +
    "Semakin sering kita ngobrol, semakin gue bisa nyesuaiin sama gaya lo!";
}

// Export fungsi-fungsi
module.exports = {
  selectBestResponse,
  createDynamicResponse,
  addNaturalVariations,
  createFallbackResponse,
  createGroupJoinResponse,
  createIdentityResponse,
  createHelpResponse,
  createAboutResponse,
  responseStyles,
  gaulDictionary,
  fallbackResponses
};
