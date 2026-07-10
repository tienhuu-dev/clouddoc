import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { config } from "./config.js"

export const s3 = new S3Client({
  region: config.awsRegion,
})

export function createDocumentKey({ fileName, fileType }) {
  const safeName = fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)
  const extension = fileType ? `.${fileType.replace(/^\./, "")}` : ""
  const finalName = safeName || `document${extension}`
  const date = new Date().toISOString().slice(0, 10)
  return `documents/${date}/${crypto.randomUUID()}-${finalName}`
}

export async function createPresignedUploadUrl({ key, contentType }) {
  const command = new PutObjectCommand({
    Bucket: config.s3UploadBucket,
    Key: key,
    ContentType: contentType || "application/octet-stream",
  })

  return getSignedUrl(s3, command, {
    expiresIn: config.s3PresignExpiresSeconds,
  })
}

export async function createPresignedDownloadUrl({ key, fileName, disposition = "attachment", contentType }) {
  const command = new GetObjectCommand({
    Bucket: config.s3UploadBucket,
    Key: key,
    ResponseContentDisposition: fileName ? `${disposition}; filename="${encodeURIComponent(fileName)}"` : undefined,
    ResponseContentType: contentType,
  })

  return getSignedUrl(s3, command, {
    expiresIn: config.s3PresignExpiresSeconds,
  })
}

export async function deleteObject({ key }) {
  const command = new DeleteObjectCommand({
    Bucket: config.s3UploadBucket,
    Key: key,
  })

  await s3.send(command)
}
