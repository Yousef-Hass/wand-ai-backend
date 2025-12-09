import { formatSuccessPayload } from '../utils/response.js'
import { EventEmitter } from 'events'
import { geminiService } from '../services/gemini.js'

class Agent {
  constructor(name, type, keywords, generateResult) {
    this.name = name
    this.type = type
    this.keywords = keywords
    this.generateResult = generateResult
  }

  async execute(app, requestId, originalRequest) {
    const startTime = Date.now()
    
    app.eventDispatcher.emit('agent.started', {
      requestId,
      agent: this.name,
      status: 'started',
      timestamp: new Date().toISOString()
    })

    let agentResult
    try {
      agentResult = await this.generateResult(originalRequest)
    } catch (err) {
      agentResult = `Error processing ${this.name.toLowerCase()} for "${originalRequest}": ${err.message}`
    }

    const processingTime = Date.now() - startTime

    const result = {
      agent: this.name,
      type: this.type,
      result: agentResult,
      processingTime: Math.round(processingTime)
    }

    app.eventDispatcher.emit('agent.completed', {
      requestId,
      agent: this.name,
      status: 'completed',
      result,
      timestamp: new Date().toISOString()
    })

    return result
  }
}

const createAgent = (name, keywords) => new Agent(name, 'AI Agent', keywords, async (request) => {
  const prompt = `As a ${name} expert, provide a concise answer to: "${request}". Keep your response to maximum 5 lines.`
  return await geminiService.generateContent(prompt)
})

const AGENTS = {
  data: createAgent('Data Analysis', ['data', 'analysis', 'analyze', 'sales', 'performance', 'financial']),
  research: createAgent('Research', ['research', 'find', 'market', 'competitor', 'industry']),
  summary: createAgent('Summary', ['summary', 'report', 'overview', 'conclusion', 'summarize']),
  visual: createAgent('Visualization', ['chart', 'visual', 'graph', 'dashboard'])
}

export class AgentOrchestrator {
  async processRequest(request, app) {
    const requestId = `req_${Date.now()}`
    const keywords = request.toLowerCase()

    const selectedAgents = Object.entries(AGENTS)
      .filter(([_, agent]) => agent.keywords.some(k => keywords.includes(k)))
      .map(([key]) => key)

    const agentsToUse = selectedAgents.length > 0 ? selectedAgents : ['research']

    app.eventDispatcher.emit('planning.complete', {
      requestId,
      selectedAgents: agentsToUse.map(key => AGENTS[key].name),
      timestamp: new Date().toISOString()
    })

    const results = await Promise.all(
      agentsToUse.map(key => AGENTS[key].execute(app, requestId, request))
    )

    app.eventDispatcher.emit('agents.all_completed', {
      requestId,
      results,
      totalTime: Math.max(...results.map(r => r.processingTime)),
      timestamp: new Date().toISOString()
    })

    return formatSuccessPayload({
      requestId,
      request,
      agents: agentsToUse,
      results,
      totalTime: Math.max(...results.map(r => r.processingTime)),
      status: 'completed'
    })
  }
}