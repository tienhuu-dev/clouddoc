import { z } from "zod"

export const presignUploadSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileType: z.string().min(1).max(20).optional(),
  contentType: z.string().min(1).max(120).optional(),
  fileSizeBytes: z.number().int().positive().max(20 * 1024 * 1024),
})

export const createDocumentSchema = z.object({
  title: z.string().min(1).max(255),
  school: z.string().min(1).max(100),
  department: z.string().min(1).max(100),
  subject: z.string().min(1).max(100),
  fileType: z.string().min(1).max(20),
  fileSizeBytes: z.number().int().positive().max(20 * 1024 * 1024),
  s3Key: z.string().min(1).max(512),
  uploaderName: z.string().max(255).optional(),
  contentIndex: z.string().max(2000).optional(),
})

export const updateStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
})

export const listDocumentsSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  q: z.string().max(255).optional(),
  school: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
  dept: z.string().max(100).optional(),
  subject: z.string().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
})
