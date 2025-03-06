// data/expressions.js
// Kumpulan ekspresi dan frasa untuk membangun respons yang natural dan gaul

/**
 * Koleksi ekspresi berdasarkan jenis respons
 */
const responseExpressions = {
  // Ekspresi sapaan dan salam
  greetings: {
    casual: [
      "Halo broo! 👋",
      "Hey there! 😎",
      "Haloo, apa kabar? 🤙",
      "Yuhuuu! 🤗",
      "Heyy! Apa kabar? ✌️",
      "Hi guyss! 😄",
      "Helloww!",
      "Haii~ 👋",
      "Hadir! 🙌",
      "Siapp! 👍"
    ],
    formal: [
      "Selamat pagi/siang/sore/malam",
      "Halo, selamat datang",
      "Salam kenal",
      "Hai, senang bertemu dengan Anda",
      "Selamat datang"
    ],
    morning: [
      "Pagi! 🌞",
      "Morning! 🌄",
      "Selamat pagi! 🌅",
      "Sudah sarapan?",
      "Pagi ceria! ☀️"
    ],
    afternoon: [
      "Siang! 🌤️",
      "Selamat siang! 🍱",
      "Met siang~",
      "Udah makan siang?",
      "Siang bolong nih"
    ],
    evening: [
      "Sore! 🌆",
      "Selamat sore! 🧋",
      "Sore-sore enaknya ngapain ya?",
      "Sore cuy! 🌇",
      "Asik, udah sore aja"
    ],
    night: [
      "Malam! 🌃",
      "Selamat malam! 🌙",
      "Belum tidur?",
      "Malam-malam masih aktif aja nih",
      "Night owl ya? 🦉"
    ]
  },
  
  // Ekspresi persetujuan
  agreements: [
    "Sipp!",
    "Oke banget deh",
    "Mantaapp",
    "Jelas dong",
    "Sikat!",
    "Gas!",
    "Cuss!",
    "Bener banget!",
    "Setuju!",
    "Iya sih menurutku juga",
    "Betul itu!",
    "Pastinya!",
    "Tentu sajaa~",
    "Absolutely!",
    "Iyalah, masa engga",
    "Jelas itu!",
    "Correct!"
  ],
  
  // Ekspresi kagum/keren
  amazed: [
    "Anjay keren!",
    "Goks banget!",
    "Gila sih!",
    "Kece badai!",
    "Mantul!",
    "Auto ngaceng nih!",
    "Demi apa??",
    "Keren parah!",
    "Sumpah keren!",
    "Gak ngerti lagi deh, top!",
    "Asli? Gokil!",
    "Epic sih!",
    "Kerennn 🔥",
    "Wow banget!",
    "Serius lo? Amazing!",
    "Gak habis pikir deh!",
    "Parah sih keren banget!",
    "Awokawok keren bat!"
  ],
  
  // Ekspresi bingung
  confused: [
    "Hah? 🤔",
    "Gimana tuh?",
    "Gak mudeng deh",
    "Bingung euy",
    "Pusing akutuh",
    "Wait, apa?",
    "Ha? Maksudnya?",
    "Hmm? 🤨",
    "Bentar, gak ngerti",
    "Maap, bisa jelasin lagi?",
    "Gak nyambung deh",
    "Gubrak, gak paham",
    "Hah? Seriusan?",
    "Aduh, gak ngerti",
    "Hmm, let me think about it",
    "Wait wait, ulangi dong",
    "Maksudnya gimana ya?",
    "What??"
  ],
  
  // Ekspresi tawa
  laughing: [
    "Wkwkwk 😂",
    "Hahaha",
    "LMAO",
    "LOL",
    "Ngakak",
    "Anjay lucu 🤣",
    "Xixi",
    "Huahuahua",
    "ROFL",
    "Wkwkwk receh",
    "Awokawokawok",
    "Hahaha bisa aja",
    "Wkkwkw gokil",
    "Ngakak abis",
    "Lmfao",
    "Wkwk ngakak parah",
    "Ahaha garing",
    "Ketawa ngakak"
  ],
  
  // Ekspresi perpisahan
  farewell: [
    "Bye! 👋",
    "See you!",
    "Sampai ketemu lagi",
    "Dadah~ 👋",
    "Good bye!",
    "Babay!",
    "Byeee 👋",
    "Sampai jumpa!",
    "Dadahh~",
    "Seeya later!",
    "Bye-bye~",
    "Take care!",
    "Jaa ne~",
    "Bubay!",
    "See u!",
    "Bai-bai~"
  ],
  
  // Ekspresi terima kasih
  gratitude: [
    "Makasih! 🙏",
    "Thanks yaa",
    "Thx bro",
    "Terima kasih banyak",
    "Makasii~",
    "Tengkyuu",
    "Thanks a lot!",
    "Suwun!",
    "Sankyu~",
    "Makasih banyak!",
    "Thx banget!",
    "Arigatou~",
    "Thankyou so much!"
  ],
  
  // Ekspresi maaf
  apology: [
    "Maaf ya 🙏",
    "Sorry nih",
    "Mohon maaf",
    "Sorryy banget",
    "My bad",
    "Maapin yaaa",
    "Maaf banget",
    "Sori bgt",
    "Sorry sorry",
    "Maapkeun 🙏",
    "Gomenasai~",
    "Maap yaaa"
  ],
  
  // Ekspresi sedih
  sad: [
    "Sedih banget 😢",
    "Huhuhu 😭",
    "Jadi sedih",
    "Menyedihkan ya",
    "Kasian banget",
    "Ikut sedih dengernya",
    "Ya ampun sedih 😢",
    "Sedih sumpah",
    "Jadi pengen nangis",
    "Sakit hati dengernya",
    "Nangis beneran nih",
    "Nyesek ya"
  ],
  
  // Ekspresi menunggu
  waiting: [
    "Ditunggu...",
    "Oke, gue tunggu ya",
    "Sip, take your time",
    "No rush~",
    "Santai, gue tungguin",
    "Oke, kabarin aja",
    "Siap, nanti kabari lagi ya",
    "Gue tungguin nih",
    "Roger that, ditunggu",
    "Wait ya sis/bro",
    "Standing by~"
  ],
  
  // Ekspresi mengerti/paham
  understanding: [
    "Oke, ngerti",
    "I see...",
    "Ah, paham",
    "Ohhh gitu",
    "Paham banget",
    "Ngerti sih",
    "Ohh, I get it",
    "Make sense",
    "Hmm, oke ngerti",
    "Oh jadi gitu ya",
    "Sekarang gue paham",
    "Ohh, jelas sekarang"
  ]
};

/**
 * Frasa pembuka untuk berbagai tipe respons
 */
const responseOpeners = {
  factual: [
    "Setahu gw, ",
    "Dari yang gue tau nih, ",
    "Kalo ga salah sih, ",
    "Hmm, kayaknya ",
    "CMIIW ya, tapi ",
    "Based on what I know, ",
    "Info yang gue punya, ",
    "Sepengetahuan gue, ",
    "Jadi, setau gue ",
    "Menurut yang udah gue pelajari, ",
    "Dari informasi yang ada, ",
    "Dari yang pernah gue baca, "
  ],
  
  explanation: [
    "Jadi gini, ",
    "Nah, jadi ceritanya ",
    "Gini loh, ",
    "Bisa gue jelasin, ",
    "So, basically ",
    "Ini penjelasannya: ",
    "Intinya tuh, ",
    "Jadi ceritanya gini, ",
    "Let me explain, ",
    "Simplenya gini, ",
    "Jadi sebenernya, ",
    "Kalo dijelasin, "
  ],
  
  opinion: [
    "Menurut gue sih, ",
    "IMO ya, ",
    "Kalo menurut gw, ",
    "Pandangan gue, ",
    "Gue rasa sih, ",
    "If you ask me, ",
    "In my humble opinion, ",
    "Kalo boleh jujur, ",
    "Jujur aja ya, ",
    "Opini pribadi nih, ",
    "Hot take: ",
    "Unpopular opinion maybe, but "
  ],
  
  storytelling: [
    "Jadi ceritanya, ",
    "Gini nih, ",
    "Alkisah, ",
    "Dulu tuh, ",
    "Once upon a time, ",
    "Singkat cerita, ",
    "Konon katanya, ",
    "Ini ceritanya: ",
    "Suatu waktu, ",
    "Waktu itu, ",
    "Let me tell you a story, ",
    "Jaman dulu, "
  ],
  
  question: [
    "Btw, ",
    "Ngomong-ngomong, ",
    "Oh iya, ",
    "Penasaran, ",
    "Just curious, ",
    "Mau tanya dong, ",
    "Random question, ",
    "Quick question, ",
    "Mau tau aja, ",
    "Kalo boleh tanya, ",
    "Wondering, ",
    "Pengen tau nih, "
  ],
  
  transition: [
    "Anyway, ",
    "By the way, ",
    "Moving on, ",
    "Oh ya, ",
    "Speaking of which, ",
    "Omong-omong, ",
    "Terus, ",
    "Lagian, ",
    "Also, ",
    "Selain itu, ",
    "On another note, ",
    "In other news, "
  ],
  
  surprise: [
    "Wait what? ",
    "Serius?? ",
    "Eh, beneran? ",
    "No way! ",
    "OMG! ",
    "Demi apa? ",
    "Are you serious? ",
    "Wutt?? ",
    "Gak mungkin! ",
    "Astaga, beneran? ",
    "Whaaatt?! ",
    "Masa sih?? "
  ],
  
  agreement: [
    "Yap, betul. ",
    "Exactly! ",
    "Bener banget. ",
    "100% agree. ",
    "Nah itu dia. ",
    "Tepat sekali. ",
    "Itu dia! ",
    "Setuju banget. ",
    "Couldn't agree more. ",
    "Precisely. ",
    "Nailed it. ",
    "You got it. "
  ],
  
  disagreement: [
    "Hmm, tapi kayaknya, ",
    "Actually, not really. ",
    "Sebenarnya sih engga. ",
    "Gue kurang setuju. ",
    "Well, gue pikir sebaliknya. ",
    "I beg to differ. ",
    "Agak kurang tepat. ",
    "Sebenernya gak gitu. ",
    "Gak juga sih. ",
    "Hmm, I have to disagree. ",
    "Not exactly. ",
    "Well, sebenarnya... "
  ]
};

/**
 * Frasa penutup untuk berbagai tipe respons
 */
const responseClosers = {
  general: [
    " sih menurutku.",
    " gitu deh.",
    " hehe.",
    " wkwk.",
    " btw.",
    " dong.",
    " kan.",
    " lah ya.",
    " gitu loh.",
    " ya kan.",
    " cmiiw.",
    " kayaknya.",
    " nih.",
    " banget.",
    " banget sih.",
    " deh.",
    " yaa.",
    " btw.",
    " bro.",
    " sis.",
    " guys.",
    " bestie."
  ],
  
  question: [
    " Gimana menurutmu?",
    " Kamu sendiri gimana?",
    " What do you think?",
    " Setuju gak?",
    " Pernah ngalamin?",
    " Agree?",
    " Ya kan?",
    " Iya ga sih?",
    " Bener ga?",
    " Pemikiran lo gimana?",
    " Punya pendapat lain?",
    " Ada ide?"
  ],
  
  encouragement: [
    " Jangan nyerah ya!",
    " Semangat terus!",
    " Keep going!",
    " You got this!",
    " Ayo bisa!",
    " Tetap semangat!",
    " Jangan patah semangat!",
    " Percaya diri aja!",
    " Optimis aja!",
    " Yakin pasti bisa!",
    " Go for it!",
    " Fighting!"
  ],
  
  recommendation: [
    " Cobain deh!",
    " Recommended banget!",
    " Worth it sih!",
    " Must try!",
    " Gak akan nyesel!",
    " Dijamin suka!",
    " Gue jamin bagus!",
    " Coba aja dulu!",
    " Trust me on this!",
    " Pokoknya oke!",
    " Gak bakal rugi!",
    " Worth every penny!"
  ],
  
  warning: [
    " Hati-hati ya.",
    " Be careful.",
    " Think twice.",
    " Pikir-pikir lagi.",
    " Jangan gegabah.",
    " Pertimbangkan baik-baik.",
    " Jangan sampai nyesel.",
    " Watch out.",
    " Perhatikan risikonya.",
    " Jangan main-main.",
    " Take it seriously.",
    " Jangan anggap remeh."
  ]
};

/**
 * Frasa transisi antar ide atau topik
 */
const transitionPhrases = [
  "Anyway, ",
  "BTW, ",
  "Ngomong-ngomong, ",
  "Oh ya, ",
  "Speaking of which, ",
  "BTW ya, ",
  "Oh iya, ",
  "Terus, ",
  "Selain itu, ",
  "Balik ke topik tadi, ",
  "On another note, ",
  "To change the subject, ",
  "Omong-omong, ",
  "By the way, ",
  "Yaudah, jadi, ",
  "Tapi serius, ",
  "Real talk ya, ",
  "Nah terus, ",
  "Eh iya, ",
  "Kalo dipikir-pikir, "
];

/**
 * Frasa ekspresi berpikir
 */
const thinkingPhrases = [
  "Hmm... ",
  "Let me think... ",
  "Bentar ya... ",
  "Wait a sec... ",
  "Hmm, gimana ya... ",
  "Sebentar, berpikir dulu... ",
  "Gue mikir dulu ya... ",
  "Ng... ",
  "Hmm, jadi... ",
  "Gimana ya... ",
  "Ok, jadi gini... ",
  "So... ",
  "Gini loh... ",
  "Biar gue pikir dulu... ",
  "Wait, I'm thinking... ",
  "Let's see... ",
  "Okay, so basically... ",
  "Oke, jadi intinya... ",
  "Jadi begini... ",
  "Ah, I think... "
];

/**
 * Frasa untuk terkesan sedang berpikir
 */
const fillerPhrases = [
  "Umm...",
  "Eh...",
  "Well...",
  "Jadi...",
  "Okay...",
  "So...",
  "Hmm...",
  "You know...",
  "Gitu deh...",
  "Gimana ya...",
  "Let's see...",
  "Ya begitulah...",
  "Gimana jelasinnya ya...",
  "How do I put this...",
  "Aduh, gimana ya...",
  "Gak tau deh...",
  "Bingung jelasinnya...",
  "Apa ya..."
];

/**
 * Frasa untuk humor dan kelakar
 */
const humorPhrases = [
  "Kocak deh pokoknya!",
  "Receh banget sih!",
  "Lucu gaaaak? Enggak ya? Yaudah.",
  "Jokes aside ya...",
  "Don't judge my humor please.",
  "Itu candaan, ketawa dong!",
  "But seriously though...",
  "Kidding, kidding!",
  "Just kidding ya!",
  "Bercanda doang kok!",
  "*ba dum tss*",
  "Get it? No? Ok.",
  "Ahahahaha... garing ya?",
  "Lucu kan? Kan? Kan?",
  "Sorry, receh!",
  "Becanda doang btw.",
  "Garing ya? Maaf deh.",
  "Wkwkwk abaikan."
];

/**
 * Frasa untuk pendapat kontroversial atau hot take
 */
const controversialOpeners = [
  "Hot take: ",
  "Unpopular opinion: ",
  "Don't @ me but... ",
  "Mungkin gue bakal dibully, tapi... ",
  "I know this is controversial but... ",
  "Controversial opinion incoming: ",
  "Oke, ini kontroversial ya: ",
  "Ini pendapat pribadi banget: ",
  "Call me crazy but... ",
  "Tau sih ini ga populer tapi... ",
  "This might be an unpopular take but... ",
  "Brace yourself: ",
  "Oke gue tau gue bakal diserang, tapi... ",
  "Ini bukan mainstream sih, tapi menurutku... ",
  "Pada gak setuju sih, tapi... "
];

module.exports = {
  responseExpressions,
  responseOpeners,
  responseClosers,
  transitionPhrases,
  thinkingPhrases,
  fillerPhrases,
  humorPhrases,
  controversialOpeners
};