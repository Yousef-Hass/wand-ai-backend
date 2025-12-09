# Wand AI API

A modern, high-performance Node.js API built with Fastify 5 for the Wand AI multi-agent orchestration system.

## 🚀 Features

- **Fastify 5** - High-performance web framework with ESM support
- **Security** - CORS and Helmet middleware for secure API endpoints
- **Error Handling** - RFC 7807 compliant error responses
- **Health Checks** - Built-in health and readiness endpoints
- **Environment Configuration** - Flexible environment-based configuration
- **Modern JavaScript** - ES Modules (ESM) support
- **Structured Logging** - Built-in request logging and error tracking

## 📋 Prerequisites

- Node.js 18+ (recommended: Node.js 22 LTS)
- npm 9+

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
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
    "status": "ok"
  }
  ```

- **GET** `/readyz` - Readiness check endpoint
  ```json
  {
    "ready": true
  }
  ```

### API Endpoints

- **GET** `/api/v1/ping` - Basic API test endpoint
  ```json
  {
    "pong": true
  }
  ```

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

## 🏗️ Project Structure

```
apps/wand-ai-api/
├── .env                 # Environment configuration
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies and scripts
├── README.md          # This file
└── src/
    └── server.js      # Main server file
```

## 🧪 Testing

```bash
# Test health endpoint
curl http://127.0.0.1:4000/healthz

# Test API endpoint
curl http://127.0.0.1:4000/api/v1/ping
```

## 📦 Dependencies

### Production Dependencies
- **fastify** (^5.6.0) - Web framework
- **@fastify/cors** (^10.1.0) - CORS support
- **@fastify/helmet** (^12.0.1) - Security headers
- **zod** (^4.1.5) - Schema validation

**Built with ❤️ using Fastify 5 and modern Node.js practices**
