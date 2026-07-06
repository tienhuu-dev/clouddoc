const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || ""

export const apiBaseUrl = rawApiBaseUrl.replace(/\/$/, "")
export const apiEnabled = Boolean(apiBaseUrl)

async function request(path, options = {}) {
  if (!apiEnabled) {
    throw new Error("VITE_API_BASE_URL is not configured")
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error || `Request failed with status ${response.status}`)
  }

  if (response.status === 204) return null
  return response.json()
}

export async function listDocuments(params = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") search.set(key, value)
  })
  const suffix = search.toString() ? `?${search.toString()}` : ""
  const result = await request(`/documents${suffix}`)
  return result.data
}

export async function presignUpload(payload) {
  const result = await request("/documents/presign-upload", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  return result.data
}

export async function createDocument(payload) {
  const result = await request("/documents", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  return result.data
}

export async function updateDocumentStatus(id, status) {
  const result = await request(`/documents/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
  return result.data
}

export async function deleteDocument(id) {
  await request(`/documents/${id}`, {
    method: "DELETE",
  })
}

export async function presignDownload(id) {
  const result = await request(`/documents/${id}/presign-download`, {
    method: "POST",
  })
  return result.data
}

export async function uploadFileToS3(uploadUrl, file) {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  })

  if (!response.ok) {
    throw new Error(`S3 upload failed with status ${response.status}`)
  }
}
