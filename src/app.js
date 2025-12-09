import Fastify from 'fastify'
import websocket from '@fastify/websocket'
import { EventEmitter } from 'events'
import { loadAppSettings } from './config/index.js'
import { buildErrorHandler } from './utils/errors.js'
import { setupSecurityPlugins } from './middleware/security.js'
import { registerAllRoutes } from './routes/index.js'
import { AgentOrchestrator } from './agents/index.js'

export async function buildApplication() {
  const settings = loadAppSettings()

  const appInstance = Fastify({
    logger: {
      level: settings.logging.level,
      transport: settings.environment === 'development'
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

  await appInstance.register(websocket)
  await setupSecurityPlugins(appInstance, settings)

  appInstance.eventDispatcher = new EventEmitter()

  const workflowManager = new AgentOrchestrator()
  appInstance.decorate('agentOrchestrator', workflowManager)

  appInstance.setErrorHandler(buildErrorHandler(settings.environment))

  await registerAllRoutes(appInstance)

  return appInstance
}
