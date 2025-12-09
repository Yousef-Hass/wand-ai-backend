import 'dotenv/config'
import { buildApplication } from './app.js'
import { loadAppSettings } from './config/index.js'

async function initializeServer() {
  try {
    const appConfig = loadAppSettings()
    const serverApp = await buildApplication()

    await serverApp.listen({
      port: appConfig.server.port,
      host: appConfig.server.host,
    })

    serverApp.log.info(
      `Server listening on http://${appConfig.server.host}:${appConfig.server.port}`
    )
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

initializeServer()
