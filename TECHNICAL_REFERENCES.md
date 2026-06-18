# Project References

## Core Technologies
- Node.js - Runtime environment
- Express.js - Web application framework
- MongoDB - NoSQL database
- Mongoose - MongoDB object modeling tool

## Key Libraries
1. **Natural (natural)** 
   - Used for natural language processing
   - Features used: WordTokenizer, PorterStemmer
   - Purpose: Text processing and tokenization

2. **Bcrypt**
   - Used for password hashing in authentication
   - Purpose: Security and user authentication

3. **Express Middleware**
   - CORS - Cross-Origin Resource Sharing
   - Helmet - Security headers
   - Body-parser - Request body parsing

## Search Implementation
- TF-IDF (Term Frequency-Inverse Document Frequency) for document vectorization
- Cosine Similarity for vector comparison
- Custom text preprocessing including:
  - Stopword removal
  - Stemming
  - Text chunking
  - Vector normalization

## Security Features
- Password hashing using bcrypt
- CORS protection
- Environment variable management using dotenv
- Basic authentication system

## Development Tools
- Nodemon - Development server
- Jest - Testing framework (configured)
- Docker support (Dockerfile and .dockerignore included)

## API Features
1. Document Management
   - CRUD operations
   - Text processing
   - Vector-based search
2. User Authentication
   - Registration
   - Login
3. Health Monitoring
   - Database connection status
   - Server status endpoints

## References & Algorithms
1. Text Processing:
   - Porter Stemming Algorithm (via natural library)
   - TF-IDF Implementation
   - Cosine Similarity for vector comparison

2. Search Relevancy:
   - Vector similarity scoring
   - Exact match scoring
   - Term overlap scoring
   - Combined weighted scoring system

## Project Structure
- MVC (Model-View-Controller) pattern
- Modular routing
- Utility-based code organization
- Environment-based configuration


