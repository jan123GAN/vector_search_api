const express = require('express');
const router = express.Router();
const Document = require('../../models/Document');
const { processText, createTFIDFVector, cosineSimilarity } = require('../../utils/vectorizer');

// Document creation endpoint
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Get all existing documents for TF-IDF calculation
    const existingDocs = await Document.find({}, { content: 1 });
    const processedDocs = existingDocs.map(doc => processText(doc.content));
    
    // Process new document
    const processedContent = processText(content);
    const vector = createTFIDFVector(processedContent, processedDocs);

    const document = new Document({
      title,
      content,
      vector,
      processedContent // Store processed tokens for future searches
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

    // Get all documents and their processed content
    const documents = await Document.find();
    if (!documents.length) {
      return res.json({ results: [], message: 'No documents found' });
    }

    const processedDocs = documents.map(doc => processText(doc.content));
    const queryTokens = processText(query);

    if (!queryTokens.length) {
      return res.json({ results: [], message: 'No valid search terms found' });
    }

    // Create query vector using all documents for context
    const queryVector = createTFIDFVector(queryTokens, processedDocs);

    // Calculate similarities and rank results
    const results = documents
      .map(doc => {
        const similarity = cosineSimilarity(queryVector, doc.vector);
        const textMatchScore = calculateTextMatchScore(query, doc);
        const finalScore = (similarity * 0.7) + (textMatchScore * 0.3);

        return {
          _id: doc._id,
          title: doc.title,
          content: doc.content,
          preview: generatePreview(doc.content, query),
          score: finalScore,
          matchDetails: {
            vectorSimilarity: similarity,
            textMatchScore: textMatchScore
          }
        };
      })
      .filter(result => result.score > 0.1)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Top 10 results

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

// Helper functions
function calculateTextMatchScore(query, doc) {
  const queryLower = query.toLowerCase();
  const contentLower = doc.content.toLowerCase();
  const titleLower = doc.title.toLowerCase();
  
  let score = 0;
  
  // Exact matches in title (high weight)
  if (titleLower.includes(queryLower)) {
    score += 0.6;
  }
  
  // Exact matches in content
  if (contentLower.includes(queryLower)) {
    score += 0.4;
  }
  
  // Partial word matches
  const queryWords = queryLower.split(/\s+/);
  const contentWords = new Set(contentLower.split(/\s+/));
  
  const partialMatches = queryWords.filter(word => 
    Array.from(contentWords).some(docWord => docWord.includes(word))
  ).length;
  
  score += (partialMatches / queryWords.length) * 0.2;
  
  return Math.min(1, score);
}

function generatePreview(content, query) {
  if (!content) return '';
  
  const previewLength = 200;
  const queryLower = query.toLowerCase();
  const contentLower = content.toLowerCase();
  
  const matchIndex = contentLower.indexOf(queryLower);
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
