import { createContext, useState, useContext } from "react"
import { MOCK_DOCUMENTS } from "@/services/mockData"

const AppContext = createContext()

export function AppProvider({ children }) {
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS)
  const [currentUser, setCurrentUser] = useState({
    name: "Nguyễn Văn A",
    role: "student", // 'student' or 'admin'
  })

  const addDocument = (doc) => {
    setDocuments(prev => [{ ...doc, id: `doc-00${prev.length + 1}` }, ...prev])
  }

  const updateDocumentStatus = (id, newStatus) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d))
  }

  const deleteDocument = (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id))
  }

  const toggleRole = () => {
    setCurrentUser(prev => 
      prev.role === "student" 
        ? { name: "Lê Thị B (Admin)", role: "admin" } 
        : { name: "Nguyễn Văn A", role: "student" }
    )
  }

  return (
    <AppContext.Provider value={{
      documents,
      currentUser,
      addDocument,
      updateDocumentStatus,
      deleteDocument,
      toggleRole
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}
