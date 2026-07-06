import cors from "cors"
import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import { ZodError } from "zod"
import { config } from "./config.js"
import { checkDatabase } from "./db.js"
import { documentsRouter } from "./documents.routes.js"

export const app = express()

app.use(helmet())
app.use(cors({
  origin: config.appOrigin.split(",").map((origin) => origin.trim()),
}))
app.use(express.json({ limit: "1mb" }))
app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"))

app.get("/api/health", async (req, res) => {
  const database = await checkDatabase()
  res.json({
    status: "ok",
    service: "clouddoc-api",
    database,
    timestamp: new Date().toISOString(),
  })
})

app.use("/api/documents", documentsRouter)

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

app.use((error, req, res, next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.issues,
    })
  }

  console.error(error)
  res.status(500).json({
    error: "Internal server error",
  })
})
