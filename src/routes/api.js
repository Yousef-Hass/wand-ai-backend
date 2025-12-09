import { createSuccessResponse } from '../utils/response.js'
import { successResponseSchema } from '../utils/schemas.js'

export async function registerApiEndpoints(app) {
  app.get('/api/v1/ping', {
    schema: {
      description: 'Basic API test endpoint',
      tags: ['api'],
      response: {
        200: successResponseSchema({
          type: 'object',
          properties: {
            pong: { type: 'boolean' },
          },
        }),
      },
    },
  }, async () => {
    return createSuccessResponse({ pong: true })
  })
}
