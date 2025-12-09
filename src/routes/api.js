import { formatSuccessPayload } from '../utils/response.js'

export async function registerApiEndpoints(app) {
  app.get('/api/v1/ping', {
    schema: {
      description: 'Basic API test endpoint',
      tags: ['api'],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                pong: { type: 'boolean' },
              },
            },
          },
        },
      },
    },
  }, async () => {
    return formatSuccessPayload({ pong: true })
  })
}

