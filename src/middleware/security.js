import cors from '@fastify/cors'
import helmet from '@fastify/helmet'

export async function registerSecurityMiddleware(fastify, config) {
  await fastify.register(cors, {
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  })

  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
}

