import { createSuccessResponse } from '../utils/response.js'
import { successResponseSchema } from '../utils/schemas.js'

export async function registerHealthEndpoints(app) {
  app.get('/readyz', {
    schema: {
      description: 'Readiness check endpoint',
      tags: ['health'],
      response: {
        200: successResponseSchema({
          type: 'object',
          properties: {
            ready: { type: 'boolean' },
          },
        }),
      },
    },
  }, async () => {
    return createSuccessResponse({ ready: true })
  })

  app.get('/healthz', {
    schema: {
      description: 'Health check endpoint',
      tags: ['health'],
      response: {
        200: successResponseSchema({
          type: 'object',
          properties: {
            status: { type: 'string' },
          },
        }),
      },
    },
  }, async () => {
    return createSuccessResponse({ status: 'ok' })
  })
}
