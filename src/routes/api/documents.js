const express = require('express');
const natural = require('natural');
const stemmer = natural.PorterStemmer;
const router = express.Router();
const Document = require('../../models/Document');
const {
  processText,
  buildTermFrequencyMap,
  buildVocabulary,
  calculateDocumentFrequencies,
  buildIDFMap,
  createTFIDFVector,
  cosineSimilarity
} = require('../../utils/vectorizer');

// Document creation endpoint
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const processedContent = processText(content);

    const document = new Document({
      title,
      content,
      processedContent
    });

    await document.save();
    res.status(201).json(document);
  } catch (err) {
    console.error('Document creation error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Search endpoint
router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Valid search query is required' });
    }

    const documents = await Document.find({}, { title: 1, content: 1, processedContent: 1 });
    if (!documents.length) {
      return res.json({ results: [], message: 'No documents found' });
    }

    const queryTokens = processText(query);
    if (!queryTokens.length) {
      return res.json({ results: [], message: 'No valid search terms found' });
    }

    const queryTermSet = new Set(queryTokens);
    const queryFrequency = buildTermFrequencyMap(queryTokens);
    const queryTokenCount = queryTokens.length;

    const indexedDocs = documents.map(doc => {
      const tokens = Array.isArray(doc.processedContent) && doc.processedContent.length
        ? doc.processedContent
        : processText(doc.content);

      const titleTokens = processText(doc.title);
      return {
        doc,
        tokens,
        titleTokens,
        titleTermSet: new Set(titleTokens),
        termFrequency: buildTermFrequencyMap(tokens),
        tokenCount: tokens.length,
        termSet: new Set(tokens)
      };
    });

    const vocabulary = buildVocabulary(indexedDocs.map(item => item.tokens), queryTokens);
    const documentFrequencies = calculateDocumentFrequencies(indexedDocs.map(item => item.tokens));
    const idfMap = buildIDFMap(vocabulary, documentFrequencies, indexedDocs.length);

    const queryVector = createTFIDFVector(queryFrequency, queryTokenCount, vocabulary, idfMap);

    const results = indexedDocs
      .map(item => {
        const docVector = createTFIDFVector(item.termFrequency, item.tokenCount, vocabulary, idfMap);
        const similarity = cosineSimilarity(queryVector, docVector);
        const textMatchScore = calculateTextMatchScore(queryTermSet, item.titleTermSet, item.termSet);
        const finalScore = similarity * 0.75 + textMatchScore * 0.25;

        return {
          _id: item.doc._id,
          title: item.doc.title,
          content: item.doc.content,
          preview: generatePreview(item.doc.content, queryTermSet),
          score: finalScore,
          matchDetails: {
            vectorSimilarity: similarity,
            textMatchScore: textMatchScore
          }
        };
      })
      .filter(result => result.score > 0.05)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    res.json({
      results,
      total: results.length,
      query
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: err.message });
  }
});

function calculateTextMatchScore(queryTermSet, titleTermSet, contentTermSet) {
  if (!queryTermSet || !titleTermSet || !contentTermSet) {
    return 0;
  }

  const querySize = queryTermSet.size || 1;
  let titleMatches = 0;
  let contentMatches = 0;

  queryTermSet.forEach(term => {
    if (titleTermSet.has(term)) {
      titleMatches += 1;
    }
    if (contentTermSet.has(term)) {
      contentMatches += 1;
    }
  });

  const titleScore = titleMatches / querySize;
  const contentScore = contentMatches / querySize;
  let score = titleScore * 0.4 + contentScore * 0.5;

  if (titleScore === 1) {
    score += 0.1;
  }

  return Math.min(1, score);
}

function generatePreview(content, queryTermSet) {
  if (!content || !queryTermSet || queryTermSet.size === 0) return '';

  const previewLength = 200;
  const tokenPattern = /\w+/g;
  let matchIndex = -1;
  let match;

  while ((match = tokenPattern.exec(content)) !== null) {
    const token = match[0].toLowerCase();
    const stemmedToken = stemmer.stem(token);

    if (queryTermSet.has(stemmedToken)) {
      matchIndex = match.index;
      break;
    }
  }

  if (matchIndex === -1) {
    return content.substring(0, previewLength) + '...';
  }

  const start = Math.max(0, matchIndex - 60);
  const end = Math.min(content.length, matchIndex + previewLength);
  let preview = content.substring(start, end);

  if (start > 0) preview = '...' + preview;
  if (end < content.length) preview += '...';

  return preview;
}

module.exports = router;
