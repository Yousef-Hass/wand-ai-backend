import { createApp } from './app.js'
import { getConfig } from './config/index.js'

async function start() {
  try {
    const config = getConfig()
    const app = await createApp()

    await app.listen({
      port: config.server.port,
      host: config.server.host,
    })

    app.log.info(
      `Server listening on http://${config.server.host}:${config.server.port}`
    )
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()
