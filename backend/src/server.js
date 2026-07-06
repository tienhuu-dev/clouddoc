import { app } from "./app.js"
import { config } from "./config.js"
import { closeDatabase } from "./db.js"

const server = app.listen(config.port, () => {
  console.log(`CloudDoc API listening on port ${config.port}`)
})

const shutdown = async () => {
  console.log("Shutting down CloudDoc API")
  server.close(async () => {
    await closeDatabase()
    process.exit(0)
  })
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
