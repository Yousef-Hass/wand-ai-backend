export function loadAppSettings() {
  const allowedOrigins = process.env.CORS_ORIGIN !== undefined 
    ? process.env.CORS_ORIGIN.split(',') 
    : true

  return {
    server: {
      port: process.env.PORT ? Number(process.env.PORT) : 4000,
      host: process.env.HOST || '127.0.0.1',
      logLevel: process.env.LOG_LEVEL || 'info',
    },
    environment: process.env.NODE_ENV || 'development',
    logging: {
      level: process.env.LOG_LEVEL || 'info',
    },
    cors: {
      origin: allowedOrigins,
      credentials: process.env.CORS_CREDENTIALS === 'true' || true,
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    },
  }
}

let cachedConfig = null

export function getConfig() {
  if (!cachedConfig) {
    cachedConfig = loadAppSettings()
  }
  return cachedConfig
}
