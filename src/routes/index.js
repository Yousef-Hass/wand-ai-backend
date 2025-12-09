import { registerHealthEndpoints } from './health.js'
import { registerApiEndpoints } from './api.js'
import { agentRoutes } from './agents.js'
import { geminiRoutes } from './gemini.js'

export async function registerAllRoutes(app) {
  await app.register(registerHealthEndpoints)
  await app.register(registerApiEndpoints)
  await app.register(agentRoutes)
  await app.register(geminiRoutes)
}


