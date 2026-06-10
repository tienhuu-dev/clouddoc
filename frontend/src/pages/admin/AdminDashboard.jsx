import { useState } from "react"
import { FileText, Download, HardDrive, Eye, Trash2, X, CheckCircle2, CheckCircle, Clock } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboard() {
  const { documents, updateDocumentStatus, deleteDocument } = useAppContext()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [docToDelete, setDocToDelete] = useState(null)
  const [toastMessage, setToastMessage] = useState("")

  // Phân loại tài liệu
  const pendingDocs = documents.filter(d => d.status === "pending")
  const approvedDocs = documents.filter(d => d.status === "approved")

  // Thống kê giả lập
  const stats = [
    {
      title: "Tổng số tài liệu",
      value: approvedDocs.length,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      title: "Tổng số lượt tải",
      value: approvedDocs.reduce((acc, doc) => acc + doc.downloadCount, 0).toLocaleString(),
      icon: Download,
      color: "text-emerald-600",
      bg: "bg-emerald-100"
    },
    {
      title: "Dung lượng đã dùng",
      value: "1.2 GB / 5 GB", // Cứng để làm mock AWS S3
      icon: HardDrive,
      color: "text-purple-600",
      bg: "bg-purple-100"
    }
  ]

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(""), 3000)
  }

  const handleApprove = (id) => {
    updateDocumentStatus(id, "approved")
    showToast("Đã duyệt tài liệu thành công. Đã cập nhật lên Trang chủ!")
  }

  const confirmDelete = (doc) => {
    setDocToDelete(doc)
    setDeleteModalOpen(true)
  }

  const handleDelete = () => {
    deleteDocument(docToDelete.id)
    setDeleteModalOpen(false)
    setDocToDelete(null)
    showToast("Đã xóa tài liệu khỏi hệ thống (Giả lập xoá S3 & DynamoDB)")
  }

  const renderTable = (docs, isPendingTable = false) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
          <tr>
            <th className="px-6 py-4">Tên tài liệu</th>
            <th className="px-6 py-4">Phân loại</th>
            <th className="px-6 py-4">Người đăng</th>
            <th className="px-6 py-4">Trạng thái</th>
            <th className="px-6 py-4 text-right w-48">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {docs.map((doc) => (
            <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-6 py-4">
                <div className="font-semibold text-slate-800">{doc.title}</div>
                <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <Badge variant="outline" className="text-[10px] px-1 py-0 font-normal">
                    .{doc.fileType.toUpperCase()}
                  </Badge>
                  {doc.fileSize}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="block text-slate-700">{doc.school}</span>
                <span className="text-xs text-slate-500">{doc.department}</span>
              </td>
              <td className="px-6 py-4 text-slate-700 font-medium">{doc.uploader}</td>
              <td className="px-6 py-4">
                {doc.status === 'pending' ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Clock className="w-3 h-3 mr-1" /> Chờ duyệt
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" /> Đã duyệt
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {isPendingTable ? (
                    <>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                        onClick={() => handleApprove(doc.id)}
                      >
                        Duyệt
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => confirmDelete(doc)}
                      >
                        Từ chối
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-blue-50" title="Xem trước">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:bg-red-50"
                        title="Xóa tài liệu"
                        onClick={() => confirmDelete(doc)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {docs.length === 0 && (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                Không có tài liệu nào trong danh sách này.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Tổng quan Hệ thống</h1>
        <p className="text-slate-500 mt-1">Quản lý tài liệu và phê duyệt nội dung đóng góp từ sinh viên.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
            <div className={`p-4 rounded-full ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Documents Table */}
      <div className="bg-white rounded-xl shadow-sm border border-yellow-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-yellow-50/30">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            Tài liệu Chờ duyệt ({pendingDocs.length})
          </h2>
        </div>
        {renderTable(pendingDocs, true)}
      </div>

      {/* Approved Documents Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Tài liệu Đã duyệt ({approvedDocs.length})
          </h2>
        </div>
        {renderTable(approvedDocs, false)}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-slate-800">Xác nhận {docToDelete?.status === 'pending' ? 'từ chối' : 'xóa'} tài liệu</h3>
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-slate-600 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa tài liệu <span className="font-semibold text-slate-800">"{docToDelete?.title}"</span> không?<br/><br/>
              Hành động này sẽ <span className="font-semibold text-red-600">xóa vĩnh viễn</span> file khỏi AWS S3 bucket.
            </p>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                Hủy bỏ
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Chắc chắn xóa
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-5 w-5 text-green-400" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

    </div>
  )
}
