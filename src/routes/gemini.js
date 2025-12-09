import { createSuccessResponse, createErrorResponse } from '../utils/response.js'
import { geminiService } from '../services/gemini.js'
import { successResponseWithMetaSchema, errorResponseSchema } from '../utils/schemas.js'

export async function geminiRoutes(app) {
  app.post('/api/v1/gemini', {
    schema: {
      description: 'Generate content using Gemini AI',
      tags: ['ai', 'gemini'],
      body: {
        type: 'object',
        required: ['prompt'],
        properties: {
          prompt: { type: 'string' },
          context: { type: 'object' },
        },
      },
      response: {
        200: successResponseWithMetaSchema(
          {
            type: 'object',
            properties: {
              text: { type: 'string' },
              context: { type: ['object', 'null'] },
            },
          },
          {
            model: { type: 'string' },
            timestamp: { type: 'string' },
          }
        ),
        400: errorResponseSchema,
        500: errorResponseSchema,
      },
    },
  }, async (req, res) => {
    try {
      const { prompt, context } = req.body

      if (!prompt) {
        return res.code(400).send(createErrorResponse('Prompt is required', 'VALIDATION_ERROR'))
      }

      let responseText = 'Mock Gemini response: This is a placeholder response.'

      try {
        responseText = await geminiService.generateContent(prompt, context)
      } catch (geminiErr) {
        app.log.warn({ geminiError: geminiErr.message }, 'Gemini API failed, using mock response')
        responseText = `Mock AI Response: ${prompt}\n\nThis is a simulated response. To get real AI responses, please add your Gemini API key to the .env file.`
      }

      const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

      return res.send(createSuccessResponse(
        {
          text: responseText,
          context: context || null,
        },
        {
          model,
          timestamp: new Date().toISOString(),
        }
      ))
    } catch (err) {
      app.log.error({ error: err }, 'Gemini API error')
      return res.code(500).send(createErrorResponse('Failed to generate content', 'GEMINI_API_ERROR'))
    }
  })
}
