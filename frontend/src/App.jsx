import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import HomePage from "./pages/HomePage"
import SearchBrowsePage from "./pages/SearchBrowsePage"
import DocumentPreviewPage from "./pages/DocumentPreviewPage"
import UploadPage from "./pages/UploadPage"
import AdminLayout from "./components/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchBrowsePage />} />
          <Route path="preview/:id" element={<DocumentPreviewPage />} />
          <Route path="upload" element={<UploadPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
