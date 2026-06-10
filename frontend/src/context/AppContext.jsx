import { createContext, useState, useContext } from "react"
import { MOCK_DOCUMENTS } from "@/services/mockData"

const AppContext = createContext()

export function AppProvider({ children }) {
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [notifications, setNotifications] = useState([])

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
    setCurrentUser(prev => ({ ...prev, ...updatedData }))
    // Trong thực tế, lúc này cũng có thể update các documents của uploader đó nếu đổi tên.
    // (Ở ví dụ này giữ nguyên để đơn giản, hoặc có thể map update tuỳ ý)
  }

  const addDocument = (doc) => {
    setDocuments(prev => [{ ...doc, id: `doc-00${prev.length + 1}` }, ...prev])
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

  const updateDocumentStatus = (id, newStatus) => {
    setDocuments(prev => {
      const updatedDocs = prev.map(d => d.id === id ? { ...d, status: newStatus } : d)
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

  const deleteDocument = (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id))
  }

  return (
    <AppContext.Provider value={{
      documents,
      isLoggedIn,
      currentUser,
      notifications,
      login,
      logout,
      updateUserProfile,
      addDocument,
      updateDocumentStatus,
      deleteDocument,
      markNotificationsAsRead
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}
