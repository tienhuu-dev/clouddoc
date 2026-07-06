import "dotenv/config"
import pg from "pg"

const { Client } = pg

const database = process.env.DB_NAME || "clouddoc"
const maintenanceDatabase = process.env.DB_MAINTENANCE_NAME || "postgres"

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: maintenanceDatabase,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
})

await client.connect()

const exists = await client.query("select 1 from pg_database where datname = $1", [database])
if (exists.rowCount === 0) {
  await client.query(`create database "${database.replaceAll("\"", "\"\"")}"`)
  console.log(`Created database ${database}`)
} else {
  console.log(`Database ${database} already exists`)
}

await client.end()
