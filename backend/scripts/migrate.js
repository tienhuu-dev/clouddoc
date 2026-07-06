import "dotenv/config"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import pg from "pg"

const { Client } = pg
const __dirname = dirname(fileURLToPath(import.meta.url))

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "clouddoc",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
})

const migration = await readFile(join(__dirname, "..", "sql", "001_init.sql"), "utf8")

await client.connect()
await client.query(migration)
await client.end()

console.log("Migrations applied")
