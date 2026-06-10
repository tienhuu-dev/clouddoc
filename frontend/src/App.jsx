import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import HomePage from "./pages/HomePage"
import SearchBrowsePage from "./pages/SearchBrowsePage"
import DocumentPreviewPage from "./pages/DocumentPreviewPage"
import UploadPage from "./pages/UploadPage"
import UserProfilePage from "./pages/user/UserProfilePage"
import AdminLayout from "./components/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import { AppProvider, useAppContext } from "./context/AppContext"
import { Navigate } from "react-router-dom"

function ProtectedRoute({ children, requireAdmin = false }) {
  const { isLoggedIn, currentUser } = useAppContext()
  
  if (!isLoggedIn) {
    return <Navigate to="/" replace />
  }

  if (requireAdmin && currentUser?.role !== "admin") {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchBrowsePage />} />
          <Route path="preview/:id" element={<DocumentPreviewPage />} />
          <Route path="upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AppProvider>
  )
}

export default App
