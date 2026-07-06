import { Router } from "express"
import {
  createDocument,
  deleteDocumentById,
  getDocumentById,
  incrementDownloadCount,
  listDocuments,
  updateDocumentStatus,
} from "./documents.repository.js"
import { createDocumentKey, createPresignedDownloadUrl, createPresignedUploadUrl, deleteObject } from "./s3.js"
import { createDocumentSchema, listDocumentsSchema, presignUploadSchema, updateStatusSchema } from "./validators.js"

export const documentsRouter = Router()

documentsRouter.get("/", async (req, res) => {
  const filters = listDocumentsSchema.parse(req.query)
  const documents = await listDocuments(filters)
  res.json({ data: documents })
})

documentsRouter.get("/:id", async (req, res) => {
  const document = await getDocumentById(req.params.id)
  if (!document) {
    return res.status(404).json({ error: "Document not found" })
  }
  res.json({ data: document })
})

documentsRouter.post("/presign-upload", async (req, res) => {
  const input = presignUploadSchema.parse(req.body)
  const key = createDocumentKey(input)
  const uploadUrl = await createPresignedUploadUrl({
    key,
    contentType: input.contentType,
  })

  res.status(201).json({
    data: {
      key,
      uploadUrl,
      method: "PUT",
      expiresIn: Number(process.env.S3_PRESIGN_EXPIRES_SECONDS || 300),
    },
  })
})

documentsRouter.post("/", async (req, res) => {
  const input = createDocumentSchema.parse(req.body)
  const document = await createDocument(input)
  res.status(201).json({ data: document })
})

documentsRouter.patch("/:id/status", async (req, res) => {
  const { status } = updateStatusSchema.parse(req.body)
  const document = await updateDocumentStatus(req.params.id, status)
  if (!document) {
    return res.status(404).json({ error: "Document not found" })
  }
  res.json({ data: document })
})

documentsRouter.post("/:id/presign-download", async (req, res) => {
  const document = await incrementDownloadCount(req.params.id)
  if (!document) {
    return res.status(404).json({ error: "Document not found" })
  }

  const downloadUrl = await createPresignedDownloadUrl({
    key: document.s3Key,
    fileName: `${document.title}.${document.fileType}`,
  })

  res.json({
    data: {
      downloadUrl,
      expiresIn: Number(process.env.S3_PRESIGN_EXPIRES_SECONDS || 300),
    },
  })
})

documentsRouter.delete("/:id", async (req, res) => {
  const deleted = await deleteDocumentById(req.params.id)
  if (!deleted) {
    return res.status(404).json({ error: "Document not found" })
  }

  await deleteObject({ key: deleted.s3_key })
  res.status(204).send()
})
