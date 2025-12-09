import Fastify from 'fastify'
import { getConfig } from './config/index.js'
import { createErrorHandler } from './utils/errors.js'
import { registerSecurityMiddleware } from './middleware/security.js'
import { healthRoutes } from './routes/health.js'
import { apiRoutes } from './routes/api.js'

export async function createApp() {
  const config = getConfig()

  const app = Fastify({
    logger: {
      level: config.logging.level,
      transport: config.environment === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss',
              ignore: 'pid,hostname',
              colorize: true,
              singleLine: false,
            },
          }
        : undefined,
    },
  })

  await registerSecurityMiddleware(app, config)

  await app.register(healthRoutes)
  await app.register(apiRoutes)

  app.setErrorHandler(createErrorHandler(config.environment))

  return app
}

