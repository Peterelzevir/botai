// data/emoji-data.js
// Data emoji untuk respons ekspresif

/**
 * Emoji berdasarkan kategori emosi/ekspresi
 */
const emojiByMood = {
  // Emoji untuk ekspresi senang/happy
  happy: [
    "😄", "😊", "🙂", "😀", "😁", "😆", "😃", "☺️", "🥰", "😇",
    "🤗", "🤩", "😋", "😌", "😎", "🤠", "🥳", "🙃", "😛", "🫶"
  ],
  
  // Emoji untuk ekspresi cinta/love
  love: [
    "❤️", "💖", "💘", "💕", "💓", "💗", "💞", "💝", "💟", "♥️",
    "😍", "😘", "🥰", "😻", "💑", "👩‍❤️‍👩", "👨‍❤️‍👨", "💏", "👩‍❤️‍💋‍👩", "👨‍❤️‍💋‍👨"
  ],
  
  // Emoji untuk ekspresi sedih/sad
  sad: [
    "😢", "😭", "🥺", "😞", "😔", "😟", "😕", "😿", "😥", "😓",
    "😪", "😩", "😫", "😖", "😣", "😨", "😰", "😧", "😦", "💔"
  ],
  
  // Emoji untuk ekspresi marah/angry
  angry: [
    "😠", "😡", "🤬", "😤", "😾", "👿", "😒", "😑", "😐", "🙄",
    "😯", "💢", "💥", "🔥", "👊", "🤜", "💩", "🖕", "😈", "💀"
  ],
  
  // Emoji untuk ekspresi terkejut/surprised
  surprised: [
    "😮", "😯", "😲", "😱", "🤯", "😳", "😵", "🫢", "🤭", "🤨",
    "🧐", "❓", "❗", "‼️", "⁉️", "😶", "😬", "🫠", "🤪", "🥴"
  ],
  
  // Emoji untuk ekspresi geli/lucu/tertawa
  laughing: [
    "😂", "🤣", "😆", "😁", "😄", "😅", "😹", "🙈", "🤭", "😝",
    "😜", "🤪", "🤡", "😏", "😼", "😸", "😺", "🤓", "🥲", "🙃"
  ],
  
  // Emoji untuk ekspresi keren/cool
  cool: [
    "😎", "🕶️", "🤙", "👍", "👌", "🤘", "✌️", "🤞", "🤟", "🫰",
    "💯", "🔥", "🆒", "💪", "🦾", "😏", "😼", "👊", "🫵", "👑"
  ],
  
  // Emoji untuk ekspresi berpikir/thinking
  thinking: [
    "🤔", "🧐", "🤨", "🙄", "😶", "😑", "😐", "😒", "🫥", "🤥",
    "💭", "❓", "🤷", "🤷‍♀️", "🤷‍♂️", "🫡", "🫤", "🫣", "🎯", "🧩"
  ],
  
  // Emoji untuk ekspresi aman/sakit
  sick: [
    "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🥴", "😵", "😵‍💫",
    "🧠", "💊", "💉", "🩹", "🩺", "🧫", "🦠", "🏥", "👨‍⚕️", "👩‍⚕️"
  ],
  
  // Emoji untuk ekspresi setuju/agreement
  agreement: [
    "👍", "👌", "🤝", "👏", "🫡", "🤗", "😊", "💯", "✅", "☑️",
    "✓", "✔️", "🗹", "👀", "💪", "🙌", "👐", "🫶", "🤌", "👉"
  ],
  
  // Emoji untuk ekspresi tidak setuju/disagreement
  disagreement: [
    "👎", "🙅", "🙅‍♂️", "🙅‍♀️", "🤦", "🤦‍♂️", "🤦‍♀️", "😒", "🙄", "👊",
    "❌", "❎", "🚫", "🙊", "🙉", "🙈", "💩", "🙃", "💀", "👀"
  ],
  
  // Emoji untuk ekspresi makanan/food
  food: [
    "🍔", "🍕", "🍟", "🍖", "🍗", "🍜", "🍝", "🍛", "🍱", "🍣",
    "🍤", "🍦", "🍩", "🍰", "🍪", "🍫", "🥗", "🥘", "🥙", "🌮"
  ],
  
  // Emoji untuk ekspresi minuman/drink
  drinks: [
    "☕", "🍵", "🍼", "🥛", "🧃", "🧋", "🧉", "🥤", "🍶", "🍺",
    "🍻", "🥂", "🍷", "🥃", "🍸", "🍹", "🍾", "🧴", "🧊", "🥥"
  ],
  
  // Emoji untuk ekspresi aktivitas/activity
  activities: [
    "🎮", "🎯", "🎲", "🎭", "🎨", "🎤", "🎧", "🎬", "📱", "💻",
    "⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🎿", "🏄", "🚴", "🏃"
  ],
  
  // Emoji untuk ekspresi alam/nature
  nature: [
    "🌳", "🌲", "🌴", "🌵", "🌿", "☘️", "🍀", "🌱", "🌷", "🌸",
    "🌹", "🌺", "🌻", "🌼", "🌞", "⛅", "🌤️", "🌦️", "🌧️", "🌈"
  ],
  
  // Emoji untuk ekspresi transportasi/travel
  travel: [
    "🚗", "🚕", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚜", "🚲",
    "🛵", "🏍️", "⛵", "🚢", "🛥️", "🚀", "✈️", "🛫", "🛬", "🏖️"
  ],
  
  // Emoji untuk ekspresi teknologi/technology
  technology: [
    "📱", "💻", "⌨️", "🖥️", "🖨️", "💿", "💾", "💽", "🧮", "🔌",
    "🔋", "📷", "📹", "📺", "📻", "📡", "🕹️", "⌚", "📱", "🖲️"
  ],
  
  // Emoji untuk ekspresi penunjuk/pointing
  pointing: [
    "👆", "👇", "👈", "👉", "👍", "👎", "👏", "🙌", "👋", "✋",
    "🤚", "🖐️", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘"
  ],
  
  // Emoji untuk ekspresi party/celebration
  celebration: [
    "🎉", "🎊", "🎂", "🍰", "🧁", "🎈", "🎁", "🎀", "🎆", "🎇",
    "✨", "🎏", "🎐", "🎑", "🎃", "🎄", "🎋", "🎍", "🎎", "🎗️"
  ],
  
  // Emoji untuk ekspresi hewan/animals
  animals: [
    "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯",
    "🦁", "🐮", "🐷", "🐸", "🐵", "🙈", "🙉", "🙊", "🦆", "🦅"
  ],
  
  // Emoji untuk ekspresi buah & sayur/fruits & vegetables
  food_natural: [
    "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈",
    "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🥑", "🥦", "🥬"
  ],
  
  // Emoji untuk ekspresi waktu/time
  time: [
    "⏰", "⏱️", "⏲️", "🕰️", "🗓️", "📅", "📆", "🕛", "🕧", "🕐",
    "🕜", "🕑", "🕝", "🕒", "🕞", "🕓", "🕟", "🕔", "🕠", "🕕"
  ],
  
  // Emoji untuk ekspresi cuaca/weather
  weather: [
    "☀️", "🌤️", "⛅", "🌥️", "☁️", "🌦️", "🌧️", "⛈️", "🌩️", "🌨️",
    "❄️", "🌬️", "💨", "🌪️", "🌫️", "☔", "⚡", "⛄", "☃️", "🌡️"
  ]
};

/**
 * Emoji berdasarkan sentiment
 */
const sentimentEmojis = {
  // Emoji untuk sentimen positif
  positive: [
    "👍", "💯", "🔥", "✅", "👌", "💪", "🙌", "✨", "🌟", "⭐", 
    "💝", "🎯", "🎉", "🎊", "🥳", "🤩", "😍", "🥰", "😘", "💖"
  ],
  
  // Emoji untuk sentimen netral
  neutral: [
    "👀", "👋", "👏", "🤔", "🧐", "🙄", "🤷", "🤷‍♂️", "🤷‍♀️", "😐",
    "😑", "😶", "🫢", "🫣", "🫡", "🤝", "👉", "👈", "🔍", "📊"
  ],
  
  // Emoji untuk sentimen negatif
  negative: [
    "👎", "😞", "😔", "😒", "😕", "😟", "😣", "😖", "😫", "😩",
    "😤", "😠", "😡", "🤬", "😰", "😨", "💔", "🚫", "⛔", "❌"
  ]
};

/**
 * Emoji berdasarkan topik/kategori
 */
const topicEmojis = {
  teknologi: ["🖥️", "📱", "🔌", "💾", "⌨️", "🖱️", "📡", "🌐", "📶", "🤖"],
  politik: ["🏛️", "🗳️", "🎭", "📰", "📊", "🔍", "⚖️", "🔨", "📋", "🗣️"],
  film: ["🎬", "🎥", "📽️", "🎞️", "🍿", "📺", "🎭", "🎦", "🎪", "📀"],
  musik: ["🎵", "🎶", "🎸", "🎷", "🎺", "🎻", "🪘", "🎤", "🎧", "🎹"],
  sejarah: ["📜", "⌛", "⏳", "🏺", "🗿", "🏛️", "🏰", "⚔️", "🛡️", "⚱️"],
  kuliner: ["🍽️", "🍴", "🥄", "🍖", "🍗", "🍜", "🍲", "🍛", "👨‍🍳", "👩‍🍳"],
  games: ["🎮", "🎯", "🎲", "🎰", "🎪", "👾", "🕹️", "🎴", "♟️", "🎪"],
  pendidikan: ["📚", "📖", "📝", "📓", "🎓", "🧠", "👨‍🏫", "👩‍🏫", "👨‍🎓", "👩‍🎓"],
  bisnis: ["📊", "📈", "💹", "💰", "💵", "💸", "💱", "💲", "📝", "📑"],
  kesehatan: ["💊", "💉", "🩺", "🧬", "🦠", "🧫", "👨‍⚕️", "👩‍⚕️", "🏥", "🧪"],
  olahraga: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎿", "🏊", "🏄"],
  travel: ["✈️", "🧳", "🗺️", "🗿", "🏟️", "🏞️", "🌆", "🌇", "🏖️", "🏕️"],
  anime: ["🥷", "🦊", "👺", "🐉", "🎎", "👘", "🏯", "🦸", "🦹", "🧙"],
  gosip: ["💅", "👁️‍🗨️", "📱", "📞", "🗣️", "📰", "📊", "👂", "👄", "🤫"],
  relationship: ["❤️", "💔", "💏", "💑", "👫", "👬", "👭", "💍", "💐", "🌹"],
  bahasa: ["🔤", "🔡", "🔠", "📝", "📚", "📖", "🗣️", "👂", "👄", "🧠"],
  agama: ["🙏", "📿", "🛐", "⛪", "🕌", "🕍", "🕋", "✝️", "☪️", "🕉️"],
  fashion: ["👕", "👖", "👗", "👚", "👔", "👠", "👟", "👜", "👒", "🧢"],
  beauty: ["💄", "💋", "💅", "👁️", "🧖", "🧴", "🧼", "🧽", "🧫", "💇"],
  otomotif: ["🚗", "🚕", "🏎️", "🚓", "🚑", "🚒", "🚚", "🚜", "🏍️", "🛵"],
  general: ["🌟", "💬", "📑", "🔍", "🔎", "🎯", "📌", "📍", "🔖", "📎"]
};

/**
 * Emoji berdasarkan jenis pertanyaan
 */
const questionEmojis = {
  factual: ["📊", "📈", "📝", "📋", "🧾", "📑", "📂", "📒", "🔍", "🧐"],
  how: ["🛠️", "🔧", "🔨", "⚙️", "🔩", "🔬", "🔭", "📐", "📏", "📌"],
  why: ["🤔", "❓", "🧠", "💭", "🔍", "🔎", "🕵️", "🔮", "👁️", "🧩"],
  yesno: ["✅", "❌", "❓", "❔", "🤷", "👍", "👎", "☑️", "✓", "✗"],
  who: ["👤", "👥", "👪", "👨", "👩", "👶", "🧑", "👮", "👷", "🕵️"],
  when: ["⏰", "⌚", "🕐", "📅", "🗓️", "⏳", "⌛", "⏱️", "🔮", "📆"],
  where: ["🗺️", "🧭", "🗾", "🏙️", "🌆", "🌇", "🌃", "🌉", "🏘️", "🏚️"]
};

/**
 * Funsi untuk mendapatkan emoji berdasarkan mood atau perasaan
 * @param {string} mood - Mood atau perasaan
 * @returns {string} Emoji yang sesuai
 */
function getEmojiByMood(mood) {
  const defaultMood = "neutral";
  const moodKey = mood && emojiByMood[mood] ? mood : defaultMood;
  
  const emojis = emojiByMood[moodKey] || sentimentEmojis[defaultMood];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

/**
 * Funsi untuk mendapatkan emoji berdasarkan sentiment
 * @param {string} sentiment - Sentiment (positive, neutral, negative)
 * @returns {string} Emoji yang sesuai
 */
function getEmojiBySentiment(sentiment) {
  const defaultSentiment = "neutral";
  const sentimentKey = sentiment && sentimentEmojis[sentiment] ? sentiment : defaultSentiment;
  
  const emojis = sentimentEmojis[sentimentKey];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

/**
 * Funsi untuk mendapatkan emoji berdasarkan topik
 * @param {string} topic - Topik
 * @returns {string} Emoji yang sesuai
 */
function getEmojiByTopic(topic) {
  const defaultTopic = "general";
  const topicKey = topic && topicEmojis[topic] ? topic : defaultTopic;
  
  const emojis = topicEmojis[topicKey];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

/**
 * Funsi untuk mendapatkan emoji berdasarkan jenis pertanyaan
 * @param {string} questionType - Jenis pertanyaan
 * @returns {string} Emoji yang sesuai
 */
function getEmojiByQuestionType(questionType) {
  const defaultType = "factual";
  const typeKey = questionType && questionEmojis[questionType] ? questionType : defaultType;
  
  const emojis = questionEmojis[typeKey];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

/**
 * Funsi untuk menambahkan emoji berdasarkan konteks ke dalam teks
 * @param {string} text - Teks yang akan ditambahkan emoji
 * @param {Object} context - Konteks (mood, sentiment, topic, questionType)
 * @param {number} emojiLevel - Tingkat emoji (0-1)
 * @returns {string} Teks dengan emoji
 */
function addContextualEmoji(text, context, emojiLevel = 0.6) {
  if (!text || emojiLevel <= 0) return text;
  
  // Skip if random value is greater than emojiLevel
  if (Math.random() > emojiLevel) return text;
  
  let emoji = "";
  
  // Choose emoji based on available context
  if (context.mood && Math.random() < 0.4) {
    emoji = getEmojiByMood(context.mood);
  } else if (context.sentiment && Math.random() < 0.3) {
    emoji = getEmojiBySentiment(context.sentiment);
  } else if (context.topic && Math.random() < 0.2) {
    emoji = getEmojiByTopic(context.topic);
  } else if (context.questionType && Math.random() < 0.1) {
    emoji = getEmojiByQuestionType(context.questionType);
  } else {
    // Random emoji from any category if no specific context
    const allCategories = Object.keys(emojiByMood);
    const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
    emoji = getEmojiByMood(randomCategory);
  }
  
  // Position emoji at beginning, end, or both based on emojiLevel
  if (emojiLevel > 0.8) {
    // High emoji level = emoji at both start and end
    return `${emoji} ${text} ${emoji}`;
  } else if (emojiLevel > 0.5 || Math.random() < 0.7) {
    // Medium-high emoji level or 70% chance = emoji at end
    return `${text} ${emoji}`;
  } else {
    // Otherwise emoji at beginning
    return `${emoji} ${text}`;
  }
}

/**
 * Funsi untuk mendapatkan emoji acak dari kategori
 * @param {string} category - Kategori emoji
 * @returns {string} Emoji acak
 */
function getRandomEmoji(category = null) {
  if (category && emojiByMood[category]) {
    const emojis = emojiByMood[category];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }
  
  // If no category or invalid category, return a truly random emoji
  const allCategories = Object.keys(emojiByMood);
  const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
  const emojis = emojiByMood[randomCategory];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// Export semua yang dibutuhkan
module.exports = {
  emojiByMood,
  sentimentEmojis,
  topicEmojis,
  questionEmojis,
  getEmojiByMood,
  getEmojiBySentiment,
  getEmojiByTopic,
  getEmojiByQuestionType,
  addContextualEmoji,
  getRandomEmoji
};