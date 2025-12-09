import { formatSuccessPayload, formatErrorPayload } from '../utils/response.js'
import { geminiService } from '../services/gemini.js'

export async function geminiRoutes(app) {
	app.post('/api/v1/gemini', async (req, res) => {
		try {
			const { prompt, context } = req.body;

			if (!prompt) {
				return res.code(400).send(formatErrorPayload('Prompt is required'));
			}

			let responseText = "Mock Gemini response: This is a placeholder response.";

			try {
				responseText = await geminiService.generateContent(prompt, context);
			} catch (geminiErr) {
				app.log.warn({ geminiError: geminiErr.message }, 'Gemini API failed, using mock response');
				responseText = `Mock AI Response: ${prompt}\n\nThis is a simulated response. To get real AI responses, please add your Gemini API key to the .env file.`;
			}

			return res.send(formatSuccessPayload({
				text: responseText,
				model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
				context: context || null
			}));
		} catch (err) {
			app.log.error({ error: err }, 'Gemini API error');
			return res.code(500).send(formatErrorPayload('Failed to generate content'));
		}
	});
}