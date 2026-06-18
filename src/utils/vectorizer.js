const natural = require('natural');
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

  const tokens = text.toLowerCase()
                    .replace(/[^\w\s]/g, ' ')
                    .split(/\s+/)
                    .filter(token => token && token.length > 1)
                    .map(token => stemmer.stem(token))
                    .filter(token => !STOPWORDS.has(token));

  return tokens;
}

function buildTermFrequencyMap(tokens) {
  const termFrequency = new Map();

  if (!Array.isArray(tokens)) {
    return termFrequency;
  }

  tokens.forEach(term => {
    termFrequency.set(term, (termFrequency.get(term) || 0) + 1);
  });

  return termFrequency;
}

function calculateTermFrequency(term, termFrequencyMap, tokenCount) {
  if (!(termFrequencyMap instanceof Map) || tokenCount === 0) {
    return 0;
  }

  return (termFrequencyMap.get(term) || 0) / tokenCount;
}

function buildVocabulary(documents, queryTokens = []) {
  const vocabulary = new Set();

  documents.forEach(doc => {
    if (Array.isArray(doc)) {
      doc.forEach(term => vocabulary.add(term));
    }
  });

  queryTokens.forEach(term => vocabulary.add(term));

  return Array.from(vocabulary);
}

function calculateDocumentFrequencies(documents) {
  const df = new Map();

  documents.forEach(doc => {
    if (!Array.isArray(doc)) {
      return;
    }

    const seenTerms = new Set(doc);
    seenTerms.forEach(term => {
      df.set(term, (df.get(term) || 0) + 1);
    });
  });

  return df;
}

function buildIDFMap(vocabulary, documentFrequencies, documentCount) {
  const idfMap = new Map();

  vocabulary.forEach(term => {
    const df = documentFrequencies.get(term) || 0;
    idfMap.set(term, Math.log((documentCount + 1) / (df + 1)) + 1);
  });

  return idfMap;
}

function createTFIDFVector(termFrequencyMap, tokenCount, vocabulary, idfMap) {
  if (!(termFrequencyMap instanceof Map) || !Array.isArray(vocabulary) || !idfMap) {
    return Array.isArray(vocabulary) ? vocabulary.map(() => 0) : [];
  }

  return vocabulary.map(term => {
    const tf = calculateTermFrequency(term, termFrequencyMap, tokenCount);
    const idf = idfMap.get(term) || 0;
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
  buildTermFrequencyMap,
  buildVocabulary,
  calculateDocumentFrequencies,
  buildIDFMap,
  createTFIDFVector,
  cosineSimilarity
};
