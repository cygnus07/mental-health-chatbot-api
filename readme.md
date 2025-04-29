# Mental Health Chatbot Backend

A robust Node.js backend for a mental health chatbot mobile application, built with Express, MongoDB, and TypeScript.

## Features

- RESTful API for chat interactions with an AI mental health assistant
- OpenAI GPT integration for natural language processing
- MongoDB for data persistence
- JWT authentication
- TypeScript for type safety
- Comprehensive error handling and logging
- Rate limiting for API protection
- Production-ready configuration

## Project Structure

```
project-root/
├── src/
│   ├── index.ts              # Entry point
│   ├── app.ts                # Express app setup
│   ├── config/               # Configuration settings
│   ├── controllers/          # Request handlers
│   ├── middlewares/          # Express middlewares
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Utility functions
└── tests/                    # Test files
```

## Requirements

- Node.js 18+
- MongoDB 5+
- OpenAI API key

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration

### Development

Run the development server:

```bash
npm run dev
```

### Production Build

Build for production:

```bash
npm run build
```

Run in production:

```bash
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Check API status

### API Root
- `GET /api/v1` - API information

### Chat
- `POST /api/v1/chat` - Send a message to the chatbot
- `GET /api/v1/chat/:userId/history` - Get chat history for a user

### Users
- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - User login
- `GET /api/v1/users/profile` - Get user profile (authenticated)

## Environment Variables

See `.env.example` for all required environment variables.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the ISC License.