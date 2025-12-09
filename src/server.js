import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'

const app = Fastify({ logger: { level: 'info' } })

await app.register(cors, { origin: true, credentials: true })
await app.register(helmet)

// Health endpoints
app.get('/healthz', async () => ({ status: 'ok' }))
app.get('/readyz', async () => ({ ready: true }))

// RFC7807 error utility
function problem(status, title, detail, instance) {
  return {
    type: 'about:blank',
    title,
    status,
    detail,
    instance,
  }
}

// Global error handler
app.setErrorHandler((err, req, reply) => {
  const status = err.statusCode || 500
  const title = status >= 500 ? 'Internal Server Error' : 'Bad Request'
  const detail = process.env.NODE_ENV === 'production' && status === 500 ? undefined : err.message
  req.log.error({ err }, 'request error')
  reply
    .code(status)
    .type('application/problem+json')
    .send(problem(status, title, detail, req.url))
})

// Basic API route
app.get('/api/v1/ping', async () => ({ pong: true }))

const port = process.env.PORT ? Number(process.env.PORT) : 4000
const host = process.env.HOST || '127.0.0.1'

try {
  await app.listen({ port, host })
  app.log.info(`api listening on http://${host}:${port}`)
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
