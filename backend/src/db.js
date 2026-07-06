import pg from "pg"
import { config } from "./config.js"

const { Pool } = pg

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  ssl: config.db.ssl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
})

export const query = (text, params) => pool.query(text, params)

export async function checkDatabase() {
  const result = await query("select now() as now")
  return result.rows[0]
}

export async function closeDatabase() {
  await pool.end()
}
