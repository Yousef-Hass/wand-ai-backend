# Wand AI API

A modern, high-performance Node.js API built with Fastify 5 for the Wand AI multi-agent orchestration system with Gemini AI integration.

## 🚀 Features

- **Fastify 5** - High-performance web framework with ESM support
- **WebSocket Support** - Real-time agent processing via WebSocket connections
- **Multi-Agent Orchestration** - Intelligent agent selection and parallel processing
- **Gemini AI Integration** - Google Gemini AI for content generation
- **Event-Driven Architecture** - Real-time event dispatcher for agent updates
- **Security** - CORS and Helmet middleware for secure API endpoints
- **Error Handling** - RFC 7807 compliant error responses
- **Structured Responses** - Clean, consistent API response format
- **Health Checks** - Built-in health and readiness endpoints
- **Environment Configuration** - Flexible environment-based configuration
- **Modern JavaScript** - ES Modules (ESM) support
- **Structured Logging** - Built-in request logging with pino-pretty in development

## 📋 Prerequisites

- Node.js 18+ (recommended: Node.js 22 LTS)
- npm 9+
- Gemini API Key (optional, for AI features)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wand-ai-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Configure environment variables**
   ```env
   PORT=4000
   HOST=127.0.0.1
   NODE_ENV=development
   LOG_LEVEL=info
   CORS_ORIGIN=true
   CORS_CREDENTIALS=true
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-pro
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
Starts the server with auto-reload on file changes.

### Production Mode
```bash
npm start
```
Starts the server in production mode.

## 📡 API Endpoints

### Health Endpoints

- **GET** `/healthz` - Health check endpoint
  ```json
  {
    "data": {
      "status": "ok"
    }
  }
  ```

- **GET** `/readyz` - Readiness check endpoint
  ```json
  {
    "data": {
      "ready": true
    }
  }
  ```

### API Endpoints

- **GET** `/api/v1/ping` - Basic API test endpoint
  ```json
  {
    "data": {
      "pong": true
    }
  }
  ```

- **POST** `/api/v1/gemini` - Generate content using Gemini AI
  ```json
  Request:
  {
    "prompt": "Explain quantum computing",
    "context": { "topic": "science" }
  }
  
  Response:
  {
    "data": {
      "text": "Generated content...",
      "context": { "topic": "science" }
    },
    "meta": {
      "model": "gemini-pro",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### WebSocket Endpoint

- **WS** `/ws` - Real-time agent processing
  ```json
  Connect and send:
  {
    "request": "Analyze sales data for Q4"
  }
  
  Receives real-time events:
  - planning.complete
  - agent.started
  - agent.completed
  - agents.all_completed
  - gemini.complete
  ```

## 🤖 Agent System

The API includes an intelligent multi-agent orchestration system with specialized agents:

- **Data Analysis Agent** - Handles data, sales, performance, financial analysis
- **Research Agent** - Performs research, market analysis, competitor research
- **Summary Agent** - Creates summaries, reports, overviews
- **Visualization Agent** - Generates charts, graphs, visualizations

Agents are automatically selected based on request content using intelligent keyword matching and scoring.

## 🔧 Error Handling

The API implements RFC 7807 (Problem Details for HTTP APIs) for consistent error responses:

```json
{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "Validation error message",
  "instance": "/api/v1/endpoint"
}
```

For API errors, responses follow this structure:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## 🏗️ Project Structure

```
wand-ai-api/
├── .env                 # Environment configuration (not in git)
├── .env.example        # Environment template
├── package.json        # Dependencies and scripts
├── README.md          # This file
└── src/
    ├── app.js         # Application factory
    ├── server.js      # Server entry point
    ├── agents/
    │   └── index.js  # Agent orchestrator
    ├── config/
    │   └── index.js  # Configuration management
    ├── middleware/
    │   └── security.js  # Security middleware
    ├── routes/
    │   ├── index.js  # Route registration
    │   ├── health.js # Health endpoints
    │   ├── api.js    # API endpoints
    │   ├── agents.js # WebSocket agent routes
    │   └── gemini.js # Gemini AI routes
    ├── services/
    │   └── gemini.js # Gemini AI service
    └── utils/
        ├── errors.js  # Error handling utilities
        ├── response.js # Response formatting utilities
        └── schemas.js  # Reusable schema definitions
```

## 🧪 Testing

```bash
# Test health endpoint
curl http://127.0.0.1:4000/healthz

# Test API endpoint
curl http://127.0.0.1:4000/api/v1/ping

# Test Gemini endpoint
curl -X POST http://127.0.0.1:4000/api/v1/gemini \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, how are you?"}'
```

## 📦 Dependencies

### Production Dependencies
- **fastify** (^5.6.0) - Web framework
- **@fastify/cors** (^10.1.0) - CORS support
- **@fastify/helmet** (^12.0.1) - Security headers
- **@fastify/websocket** (^11.2.0) - WebSocket support
- **@google/generative-ai** (^0.24.1) - Gemini AI SDK
- **dotenv** (^17.2.2) - Environment variable management
- **zod** (^4.1.5) - Schema validation

### Development Dependencies
- **pino-pretty** (^13.1.3) - Pretty logging for development

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `HOST` | Server host | `127.0.0.1` |
| `NODE_ENV` | Environment mode | `development` |
| `LOG_LEVEL` | Logging level | `info` |
| `CORS_ORIGIN` | CORS allowed origins | `true` |
| `CORS_CREDENTIALS` | CORS credentials | `true` |
| `GEMINI_API_KEY` | Gemini API key | Required |
| `GEMINI_MODEL` | Gemini model name | `gemini-pro` |

## 📝 Response Format

All API responses follow a consistent structure:

**Success Response:**
```json
{
  "data": { ... },
  "meta": { ... }  // optional
}
```

**Error Response:**
```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": { ... }  // optional
  }
}
```

## 🎯 Features in Detail

### Multi-Agent Orchestration
- Intelligent agent selection based on request content
- Parallel agent execution for faster processing
- Real-time event updates via WebSocket
- Automatic fallback to research agent if no match

### Gemini AI Integration
- Content generation with context support
- Configurable model selection
- Graceful error handling with fallback responses
- Model metadata in responses

### WebSocket Support
- Real-time bidirectional communication
- Event-driven architecture
- Connection management and cleanup
- Structured event payloads

**Built with ❤️ using Fastify 5, Gemini AI, and modern Node.js practices**
