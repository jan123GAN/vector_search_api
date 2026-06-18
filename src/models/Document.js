const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  vector: {
    type: [Number],
    required: true,
    default: []
  },
  processedContent: {
    type: [String],
    required: true
  }
}, {
  timestamps: true
});

// Add text index for basic text search
documentSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Document', documentSchema);
