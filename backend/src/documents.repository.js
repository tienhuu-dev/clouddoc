import { query } from "./db.js"

const mapDocument = (row) => ({
  id: row.id,
  title: row.title,
  school: row.school,
  department: row.department,
  subject: row.subject,
  fileType: row.file_type,
  fileSizeBytes: Number(row.file_size_bytes),
  fileSize: row.file_size_label,
  s3Key: row.s3_key,
  status: row.status,
  downloadCount: row.download_count,
  uploader: row.uploader_name,
  contentIndex: row.content_index,
  uploadDate: row.created_at?.toISOString?.().slice(0, 10),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

const fileSizeLabelSql = `
  case
    when file_size_bytes >= 1048576 then round((file_size_bytes / 1048576.0)::numeric, 1)::text || 'MB'
    when file_size_bytes >= 1024 then round((file_size_bytes / 1024.0)::numeric, 1)::text || 'KB'
    else file_size_bytes::text || 'B'
  end as file_size_label
`

export async function listDocuments(filters) {
  const values = []
  const where = []

  if (filters.status) {
    values.push(filters.status)
    where.push(`status = $${values.length}`)
  }

  if (filters.school) {
    values.push(filters.school)
    where.push(`school = $${values.length}`)
  }

  const department = filters.department || filters.dept
  if (department) {
    values.push(department)
    where.push(`department = $${values.length}`)
  }

  if (filters.subject) {
    values.push(filters.subject)
    where.push(`subject = $${values.length}`)
  }

  if (filters.q) {
    values.push(`%${filters.q}%`)
    where.push(`(title ilike $${values.length} or content_index ilike $${values.length} or subject ilike $${values.length})`)
  }

  values.push(filters.limit)
  const limitPlaceholder = `$${values.length}`
  values.push(filters.offset)
  const offsetPlaceholder = `$${values.length}`

  const result = await query(
    `
      select *, ${fileSizeLabelSql}
      from documents
      ${where.length ? `where ${where.join(" and ")}` : ""}
      order by created_at desc
      limit ${limitPlaceholder}
      offset ${offsetPlaceholder}
    `,
    values,
  )

  return result.rows.map(mapDocument)
}

export async function getDocumentById(id) {
  const result = await query(
    `
      select *, ${fileSizeLabelSql}
      from documents
      where id = $1
    `,
    [id],
  )
  return result.rows[0] ? mapDocument(result.rows[0]) : null
}

export async function createDocument(input) {
  const result = await query(
    `
      insert into documents (
        title,
        school,
        department,
        subject,
        file_type,
        file_size_bytes,
        s3_key,
        uploader_name,
        content_index
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      returning *, ${fileSizeLabelSql}
    `,
    [
      input.title,
      input.school,
      input.department,
      input.subject,
      input.fileType,
      input.fileSizeBytes,
      input.s3Key,
      input.uploaderName || "Ẩn danh",
      input.contentIndex || input.title,
    ],
  )

  return mapDocument(result.rows[0])
}

export async function updateDocumentStatus(id, status) {
  const result = await query(
    `
      update documents
      set status = $2, updated_at = now()
      where id = $1
      returning *, ${fileSizeLabelSql}
    `,
    [id, status],
  )

  return result.rows[0] ? mapDocument(result.rows[0]) : null
}

export async function incrementDownloadCount(id) {
  const result = await query(
    `
      update documents
      set download_count = download_count + 1, updated_at = now()
      where id = $1
      returning *, ${fileSizeLabelSql}
    `,
    [id],
  )

  return result.rows[0] ? mapDocument(result.rows[0]) : null
}

export async function deleteDocumentById(id) {
  const result = await query("delete from documents where id = $1 returning s3_key", [id])
  return result.rows[0] || null
}
