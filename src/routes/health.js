import { formatSuccessPayload } from '../utils/response.js'

export async function registerHealthEndpoints(app) {
  app.get('/readyz', {
    schema: {
      description: 'Readiness check endpoint',
      tags: ['health'],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                ready: { type: 'boolean' },
              },
            },
          },
        },
      },
    },
  }, async () => {
    return formatSuccessPayload({ ready: true })
  })

  app.get('/healthz', {
    schema: {
      description: 'Health check endpoint',
      tags: ['health'],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                status: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }, async () => {
    return formatSuccessPayload({ status: 'ok' })
  })
}
