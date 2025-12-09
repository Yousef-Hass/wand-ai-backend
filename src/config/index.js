export function getConfig() {
  return {
    server: {
      port: process.env.PORT ? Number(process.env.PORT) : 4000,
      host: process.env.HOST || '127.0.0.1',
    },
    environment: process.env.NODE_ENV || 'development',
    logging: {
      level: process.env.LOG_LEVEL || 'info',
    },
    cors: {
      origin: process.env.CORS_ORIGIN !== undefined 
        ? process.env.CORS_ORIGIN.split(',') 
        : true,
      credentials: process.env.CORS_CREDENTIALS === 'true' || true,
    },
  }
}

