import "dotenv/config"

const required = (name, fallback) => {
  const value = process.env[name] ?? fallback
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  appOrigin: process.env.APP_ORIGIN || "http://localhost:5173",
  awsRegion: required("AWS_REGION", "ap-southeast-1"),
  s3UploadBucket: required("S3_UPLOAD_BUCKET", "clouddoc-upload-20260701"),
  s3PresignExpiresSeconds: Number(process.env.S3_PRESIGN_EXPIRES_SECONDS || 300),
  db: {
    host: required("DB_HOST"),
    port: Number(process.env.DB_PORT || 5432),
    database: required("DB_NAME", "clouddoc"),
    user: required("DB_USER"),
    password: required("DB_PASSWORD"),
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  },
}
