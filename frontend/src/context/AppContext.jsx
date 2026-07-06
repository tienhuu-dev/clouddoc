import { createContext, useCallback, useEffect, useState, useContext } from "react"
import { MOCK_DOCUMENTS } from "@/services/mockData"
import {
  apiEnabled,
  createDocument,
  deleteDocument as deleteDocumentApi,
  listDocuments,
  presignDownload,
  presignUpload,
  updateDocumentStatus as updateDocumentStatusApi,
  uploadFileToS3,
} from "@/services/api"

const AppContext = createContext()

export function AppProvider({ children }) {
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(apiEnabled)
  const [documentError, setDocumentError] = useState("")

  const refreshDocuments = useCallback(async () => {
    if (!apiEnabled) return
    setIsLoadingDocuments(true)
    setDocumentError("")
    try {
      const data = await listDocuments({ limit: 100 })
      setDocuments(data)
    } catch (error) {
      setDocumentError(error.message)
    } finally {
      setIsLoadingDocuments(false)
    }
  }, [])

  useEffect(() => {
    let active = true

    const loadDocuments = async () => {
      if (!apiEnabled) return
      try {
        const data = await listDocuments({ limit: 100 })
        if (active) setDocuments(data)
      } catch (error) {
        if (active) setDocumentError(error.message)
      } finally {
        if (active) setIsLoadingDocuments(false)
      }
    }

    loadDocuments()

    return () => {
      active = false
    }
  }, [])

  const login = (role = "student") => {
    setIsLoggedIn(true)
    if (role === "admin") {
      setCurrentUser({
        name: "Lê Thị B",
        email: "admin.lethib@hutech.edu.vn",
        school: "HUTECH",
        department: "CNTT",
        role: "admin",
      })
    } else {
      setCurrentUser({
        name: "Nguyễn Văn A",
        email: "nguyenvana@hutech.edu.vn",
        school: "HUTECH",
        department: "CNTT",
        role: "student",
      })
    }
  }

  const logout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
  }

  const updateUserProfile = (updatedData) => {
    const previousName = currentUser?.name
    if (previousName && updatedData.name && updatedData.name !== previousName) {
      setDocuments(prev => prev.map(doc => (
        doc.uploader?.startsWith(previousName)
          ? { ...doc, uploader: doc.uploader.replace(previousName, updatedData.name) }
          : doc
      )))
    }
    setCurrentUser(prev => ({ ...prev, ...updatedData }))
  }

  const addDocument = async (doc, file) => {
    if (!apiEnabled) {
      setDocuments(prev => [{ ...doc, id: `doc-00${prev.length + 1}` }, ...prev])
      return doc
    }

    if (!file) {
      throw new Error("File is required when API mode is enabled")
    }

    const fileType = doc.fileType || file.name.split(".").pop()
    const upload = await presignUpload({
      fileName: file.name,
      fileType,
      contentType: file.type || "application/octet-stream",
      fileSizeBytes: file.size,
    })

    await uploadFileToS3(upload.uploadUrl, file)

    const created = await createDocument({
      title: doc.title,
      school: doc.school,
      department: doc.department,
      subject: doc.subject,
      fileType,
      fileSizeBytes: file.size,
      s3Key: upload.key,
      uploaderName: doc.uploader,
      contentIndex: doc.contentIndex,
    })

    setDocuments(prev => [created, ...prev])
    return created
  }

  const addNotification = (message) => {
    const newNotif = {
      id: Date.now(),
      message,
      read: false,
      time: new Date().toISOString()
    }
    setNotifications(prev => [newNotif, ...prev])
  }

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const updateDocumentStatus = async (id, newStatus) => {
    let updatedFromApi = null
    if (apiEnabled) {
      updatedFromApi = await updateDocumentStatusApi(id, newStatus)
    }

    setDocuments(prev => {
      const updatedDocs = prev.map(d => d.id === id ? (updatedFromApi || { ...d, status: newStatus }) : d)
      // Send notification if approved
      if (newStatus === "approved") {
        const doc = updatedDocs.find(d => d.id === id)
        if (doc) {
          addNotification(`Tài liệu "${doc.title}" của bạn đã được duyệt và xuất bản!`)
        }
      }
      return updatedDocs
    })
  }

  const deleteDocument = async (id) => {
    if (apiEnabled) {
      await deleteDocumentApi(id)
    }
    setDocuments(prev => prev.filter(d => d.id !== id))
  }

  const getDocumentUrl = useCallback(async (doc) => {
    if (apiEnabled) {
      const data = await presignDownload(doc.id)
      setDocuments(prev => prev.map(item => (
        item.id === doc.id ? { ...item, downloadCount: (item.downloadCount || 0) + 1 } : item
      )))
      return data.downloadUrl
    }

    return doc.s3Url && doc.s3Url !== "#" ? doc.s3Url : ""
  }, [])

  return (
    <AppContext.Provider value={{
      documents,
      isLoadingDocuments,
      documentError,
      isLoggedIn,
      currentUser,
      notifications,
      login,
      logout,
      updateUserProfile,
      addDocument,
      updateDocumentStatus,
      deleteDocument,
      getDocumentUrl,
      refreshDocuments,
      markNotificationsAsRead
    }}>
      {children}
    </AppContext.Provider>
  )
}

// Context hooks intentionally live beside the provider for this small application.
// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext() {
  return useContext(AppContext)
}
