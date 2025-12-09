import cors from '@fastify/cors'
import helmet from '@fastify/helmet'

export async function setupSecurityPlugins(app, settings) {
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })

  await app.register(cors, {
    origin: settings.cors.origin,
    credentials: settings.cors.credentials,
  })
}

