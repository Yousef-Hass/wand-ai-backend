import { createErrorResponse } from '../utils/response.js'
import { geminiService } from '../services/gemini.js'

export async function agentRoutes(app) {
  app.get('/ws', { websocket: true }, (connection, req) => {
    connection.send(JSON.stringify({
      status: 'connected',
      message: 'WebSocket connected successfully',
      timestamp: new Date().toISOString()
    }))

    const requestId = `req_${Date.now()}`

    const eventHandlers = {
      'planning.complete': (data) => {
        connection.send(JSON.stringify({
          requestId: data.requestId,
          status: 'planning_complete',
          selectedAgents: data.selectedAgents,
          timestamp: data.timestamp
        }))
      },
      'agent.started': (data) => {
        connection.send(JSON.stringify({
          requestId: data.requestId,
          agent: data.agent,
          status: 'started',
          timestamp: data.timestamp
        }))
      },
      'agent.completed': (data) => {
        connection.send(JSON.stringify({
          requestId: data.requestId,
          agent: data.agent,
          status: 'completed',
          result: data.result,
          timestamp: data.timestamp
        }))
      },
      'agents.all_completed': (data) => {
        connection.send(JSON.stringify({
          requestId: data.requestId,
          status: 'all_completed',
          results: data.results,
          totalTime: data.totalTime,
          timestamp: data.timestamp
        }))
      },
      'gemini.complete': (data) => {
        connection.send(JSON.stringify({
          requestId: data.requestId,
          status: 'gemini_complete',
          geminiSynthesis: data.geminiSynthesis,
          timestamp: data.timestamp
        }))
      }
    }

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      app.eventDispatcher.on(event, handler)
    })

    connection.on('message', async (message) => {
      try {
        const parsedMessage = JSON.parse(message)
        const { request: businessRequest } = parsedMessage

        if (!businessRequest || typeof businessRequest !== 'string') {
          connection.send(JSON.stringify(
            createErrorResponse('Business request is required and must be a string', 'VALIDATION_ERROR')
          ))
          return
        }

        const agentResult = await app.agentOrchestrator.processRequest(businessRequest, app)

        let finalText = 'Mock synthesis: Agent processing completed successfully.'
        let individualResults = {}

        try {
          agentResult.data.results.forEach((result) => {
            individualResults[result.agent] = result.result
          })

          const geminiPrompt = `Answer this business request: "${businessRequest}"

Based on these expert analyses:
${Object.entries(individualResults).map(([agent, result]) => `${agent}: ${result}`).join('\n\n')}

Provide a direct, actionable answer that addresses the request.`

          finalText = await geminiService.generateContent(geminiPrompt)
        } catch (geminiErr) {
          finalText = `I apologize, but I'm unable to provide a complete answer to "${businessRequest}" at this time.`
        }

        app.eventDispatcher.emit('gemini.complete', {
          requestId: agentResult.data.requestId,
          geminiSynthesis: {
            text: finalText,
            model: process.env.GEMINI_MODEL,
            individualResults: individualResults
          },
          timestamp: new Date().toISOString()
        })

      } catch (err) {
        connection.send(JSON.stringify(
          createErrorResponse('Failed to process request', 'PROCESSING_ERROR', { details: err.message })
        ))
      }
    })

    connection.on('close', () => {
      Object.keys(eventHandlers).forEach(event => {
        app.eventDispatcher.removeAllListeners(event)
      })
    })
  })
}
