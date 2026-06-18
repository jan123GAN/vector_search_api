const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'about', 'after', 'all', 'also', 'am', 'can', 'could', 'into',
  'may', 'most', 'other', 'our', 'some', 'such', 'than', 'then', 'these'
]);

function processText(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Convert to lowercase, remove special chars, and tokenize
  const tokens = text.toLowerCase()
                    .replace(/[^\w\s]/g, ' ')
                    .split(/\s+/)
                    .filter(token => token && token.length > 1)
                    .map(token => stemmer.stem(token))
                    .filter(token => !STOPWORDS.has(token));

  return [...new Set(tokens)]; // Remove duplicates
}

function calculateTermFrequency(term, tokens) {
  const termCount = tokens.filter(t => t === term).length;
  return termCount / tokens.length;
}

function calculateIDF(term, docs) {
  const docsWithTerm = docs.filter(doc => doc.includes(term)).length;
  return Math.log(docs.length / (1 + docsWithTerm));
}

function createTFIDFVector(tokens, allDocs) {
  if (!Array.isArray(tokens) || !Array.isArray(allDocs)) {
    return [];
  }

  // Get unique terms across all documents
  const allTerms = new Set();
  [tokens, ...allDocs].forEach(doc => {
    doc.forEach(term => allTerms.add(term));
  });
  const terms = Array.from(allTerms);

  // Calculate TF-IDF for each term
  return terms.map(term => {
    const tf = calculateTermFrequency(term, tokens);
    const idf = calculateIDF(term, allDocs);
    return tf * idf;
  });
}

function cosineSimilarity(vec1, vec2) {
  if (!Array.isArray(vec1) || !Array.isArray(vec2) || vec1.length !== vec2.length) {
    return 0;
  }

  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }

  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);

  if (mag1 === 0 || mag2 === 0) return 0;
  return dotProduct / (mag1 * mag2);
}




module.exports = {
  processText,
  createTFIDFVector,
  cosineSimilarity
};
