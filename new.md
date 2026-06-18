# Smart Document Search Engine (TF‑IDF + Cosine Similarity)

## Overview

Smart Document Search Engine is a document retrieval system built using:

- Node.js
- Express.js
- MongoDB
- Mongoose
- Natural (NLP Library)

The project implements a complete Information Retrieval pipeline using:

1. Tokenization
2. Stopword Removal
3. Stemming
4. Term Frequency (TF)
5. Inverse Document Frequency (IDF)
6. TF‑IDF Vector Generation
7. Cosine Similarity Ranking

Unlike basic keyword search, this system ranks documents according to their relevance to the user's query.

---

# Features

### Document Management

- Create and store documents
- Store processed tokens for faster searching
- Automatic text preprocessing

### Intelligent Search

- TF‑IDF based ranking
- Cosine Similarity matching
- Query preprocessing
- Stemming support
- Title boosting
- Content relevance scoring
- Ranked search results

### Search Result Enhancements

- Relevance score
- Match details
- Content preview generation
- Top ranked results

---

# System Architecture

```text
User Query
    |
    v
Text Processing
(Tokenization + Stopwords + Stemming)
    |
    v
Query Tokens
    |
    v
Vocabulary Builder
    |
    v
TF-IDF Vector Creation
    |
    v
Cosine Similarity
    |
    v
Ranking Engine
    |
    v
Top Matching Documents
```

---

# Technology Stack

| Component | Technology |
|-----------|------------|
| Backend | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| NLP | Natural |
| Similarity Metric | Cosine Similarity |
| Search Algorithm | TF‑IDF |

---

# Project Structure

```text
project/
│
├── models/
│   └── Document.js
│
├── routes/
│   └── api/
│       └── documents.js
│
├── utils/
│   └── vectorizer.js
│
├── server.js
│
└── package.json
```

---

# Working of the Search Engine

## Step 1: Document Creation

When a document is added:

```text
Original Text
      ↓
Tokenization
      ↓
Stopword Removal
      ↓
Stemming
      ↓
processedContent Stored in MongoDB
```

Example:

Input:

```text
Django is a powerful Python web framework.
```

Processed Tokens:

```text
django
power
python
web
framework
```

---

## Step 2: Search Query Processing

Query:

```text
django authentication
```

The query undergoes the same processing pipeline:

```text
Tokenization
Stopword Removal
Stemming
```

This ensures consistency between documents and queries.

---

## Step 3: TF‑IDF Calculation

### Term Frequency (TF)

Measures how often a term appears inside a document.

Formula:

```text
TF(term) =
Occurrences of Term
-------------------
Total Terms
```

### Inverse Document Frequency (IDF)

Measures how unique a term is across all documents.

Formula:

```text
IDF(term) =
log((N + 1)/(DF + 1)) + 1
```

Where:

- N = Total Documents
- DF = Documents containing the term

### TF‑IDF

```text
TF-IDF = TF × IDF
```

---

## Step 4: Cosine Similarity

Each document and query is converted into a vector.

Similarity is calculated using:

```text
Cosine Similarity =
(A · B)
-----------------
|A| × |B|
```

Result:

- 1 = Perfect Match
- 0 = No Match

Documents with higher scores appear first.

---

# API Documentation

## Create Document

### Endpoint

```http
POST /api/documents
```

### Request

```json
{
  "title": "Django Tutorial",
  "content": "Django is a Python web framework."
}
```

### Response

```json
{
  "_id": "...",
  "title": "Django Tutorial",
  "content": "Django is a Python web framework."
}
```

---

## Search Documents

### Endpoint

```http
POST /api/documents/search
```

### Request

```json
{
  "query": "django"
}
```

### Response

```json
{
  "results": [
    {
      "title": "Django Tutorial",
      "score": 0.93
    }
  ]
}
```

---

# Installation Guide

## Clone Repository

```bash
git clone <repository-url>
```

## Install Dependencies

```bash
npm install
```

## Create Environment File

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/document-search
```

## Start MongoDB

Make sure MongoDB is running.

## Run Server

```bash
npm start
```

or

```bash
npm run dev
```

---

# Testing Example

### Insert Documents

Document 1

```text
Django Authentication System
```

Document 2

```text
Python Basics Guide
```

Document 3

```text
Geography Notes
```

### Search

```text
django authentication
```

Expected Ranking:

```text
1. Django Authentication System
2. Python Basics Guide
3. Geography Notes
```

---

# Educational Value

This project demonstrates:

- Information Retrieval
- Search Engine Fundamentals
- Natural Language Processing
- TF‑IDF
- Vector Space Model
- Cosine Similarity
- MongoDB Integration
- REST API Development

It is suitable for:

- Final Year Projects
- Mini Projects
- NLP Demonstrations
- Information Retrieval Subjects
- Academic Submission

---

# Future Enhancements

- BM25 Ranking
- Semantic Search using Embeddings
- Elasticsearch Integration
- User Authentication
- Search Analytics Dashboard
- Search Suggestions
- Fuzzy Search
- Document Categories

---

# Conclusion

This project is a complete implementation of a classical search engine using TF‑IDF and Cosine Similarity. It demonstrates how modern search systems preprocess text, build vector representations, and rank documents based on relevance. The project is easy to understand, academically strong, and suitable for final-year academic submissions and demonstrations.