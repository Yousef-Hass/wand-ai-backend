import { GoogleGenerativeAI } from '@google/generative-ai'
import { config } from '../config/index.js'

class GeminiService {
  constructor() {
    if (!config.gemini.apiKey) {
      this.genAI = null
      this.model = null
      return
    }
    this.genAI = new GoogleGenerativeAI(config.gemini.apiKey)
    this.model = this.genAI.getGenerativeModel({ model: config.gemini.model })
  }

  async generateContent(prompt, context = null) {
    if (!this.genAI || !this.model) {
      throw new Error('Gemini API key not configured')
    }

    try {
      let enhancedPrompt = prompt
      if (context) {
        enhancedPrompt = `Context: ${JSON.stringify(context)}\n\nRequest: ${prompt}`
      }

      const result = await this.model.generateContent(enhancedPrompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      throw new Error(`Gemini API error: ${error.message}`)
    }
  }
}

export const geminiService = new GeminiService()
