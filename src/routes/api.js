export async function apiRoutes(fastify) {
  fastify.get('/api/v1/ping', {
    schema: {
      description: 'Basic API test endpoint',
      tags: ['api'],
      response: {
        200: {
          type: 'object',
          properties: {
            pong: { type: 'boolean' },
          },
        },
      },
    },
  }, async () => {
    return { pong: true }
  })
}

