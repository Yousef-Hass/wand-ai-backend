import { createSuccessResponse } from '../utils/response.js'
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
  data: createAgent('Data Analysis', ['data', 'analysis', 'analyze', 'sales', 'performance', 'financial', 'numbers', 'statistics', 'metrics', 'revenue', 'profit', 'budget']),
  research: createAgent('Research', ['research', 'find', 'market', 'competitor', 'industry', 'information', 'investigate', 'study', 'explore']),
  summary: createAgent('Summary', ['summary', 'report', 'overview', 'conclusion', 'summarize', 'brief', 'recap', 'synopsis', 'abstract']),
  visual: createAgent('Visualization', ['chart', 'visual', 'visualize', 'graph', 'dashboard', 'plot', 'diagram', 'presentation', 'display', 'show'])
}

function selectAgents(request) {
  const requestLower = request.toLowerCase()
  const words = requestLower.split(/\s+/)
  
  const agentScores = {}
  
  Object.entries(AGENTS).forEach(([key, agent]) => {
    let score = 0
    agent.keywords.forEach(keyword => {
      if (requestLower.includes(keyword)) {
        score += 2
      }
      if (words.some(word => word.includes(keyword) || keyword.includes(word))) {
        score += 1
      }
    })
    if (score > 0) {
      agentScores[key] = score
    }
  })
  
  const sortedAgents = Object.entries(agentScores)
    .sort(([, a], [, b]) => b - a)
    .map(([key]) => key)
  
  if (sortedAgents.length > 0) {
    const topScore = agentScores[sortedAgents[0]]
    return sortedAgents.filter(key => agentScores[key] >= topScore * 0.7)
  }
  
  return ['research']
}

export class AgentOrchestrator {
  async processRequest(request, app) {
    const requestId = `req_${Date.now()}`
    
    const agentsToUse = selectAgents(request)

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

    return createSuccessResponse({
      requestId,
      request,
      agents: agentsToUse,
      results,
      totalTime: Math.max(...results.map(r => r.processingTime)),
      status: 'completed',
    }, {
      timestamp: new Date().toISOString(),
    })
  }
}
