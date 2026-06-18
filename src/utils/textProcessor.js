const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

// Enhanced stopwords list
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'about', 'after', 'all', 'also', 'am', 'can', 'could', 'into',
  'may', 'most', 'other', 'our', 'some', 'such', 'than', 'then', 'these'
]);

function preprocessText(text) {
  if (!text || typeof text !== 'string') return '';

  // Convert to lowercase and remove special characters
  const cleanText = text.toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Tokenize
  const tokens = tokenizer.tokenize(cleanText);

  // Remove stopwords and apply stemming
  const processedTokens = tokens
    .filter(token => !STOPWORDS.has(token))
    .map(token => stemmer.stem(token));

  return processedTokens;
}

module.exports = {
  preprocessText
};