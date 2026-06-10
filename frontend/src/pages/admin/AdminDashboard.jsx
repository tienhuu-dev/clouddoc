import { useState } from "react"
import { FileText, Download, HardDrive, Eye, Trash2, X, CheckCircle2 } from "lucide-react"
import { MOCK_DOCUMENTS } from "@/services/mockData"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboard() {
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [docToDelete, setDocToDelete] = useState(null)
  const [toastMessage, setToastMessage] = useState("")

  // Thống kê giả lập
  const stats = [
    {
      title: "Tổng số tài liệu",
      value: documents.length,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      title: "Tổng số lượt tải",
      value: documents.reduce((acc, doc) => acc + doc.downloadCount, 0).toLocaleString(),
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

  const confirmDelete = (doc) => {
    setDocToDelete(doc)
    setDeleteModalOpen(true)
  }

  const handleDelete = () => {
    // Thực hiện xoá khỏi state (giả lập xoá S3 & DynamoDB)
    setDocuments(prev => prev.filter(d => d.id !== docToDelete.id))
    setDeleteModalOpen(false)
    setDocToDelete(null)
    
    // Hiển thị Toast
    setToastMessage("Đã xóa tài liệu thành công (Giả lập cập nhật S3 & OpenSearch)")
    setTimeout(() => setToastMessage(""), 3000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Tổng quan Hệ thống</h1>
        <p className="text-slate-500 mt-1">Quản lý tài liệu và theo dõi lưu lượng trên AWS S3.</p>
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

      {/* Document Management Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Danh sách tài liệu đã Upload
          </h2>
          <Button variant="outline" size="sm">Xuất báo cáo</Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Tên tài liệu</th>
                <th className="px-6 py-4">Phân loại (Trường - Ngành)</th>
                <th className="px-6 py-4">Người đăng</th>
                <th className="px-6 py-4">Ngày đăng</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((doc) => (
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
                  <td className="px-6 py-4 text-slate-700">{doc.uploader}</td>
                  <td className="px-6 py-4 text-slate-500">{doc.uploadDate}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
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
                    </div>
                  </td>
                </tr>
              ))}
              {documents.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    Không có tài liệu nào trong hệ thống.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-slate-800">Xác nhận xóa tài liệu</h3>
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-slate-600 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa tài liệu <span className="font-semibold text-slate-800">"{docToDelete?.title}"</span> không?<br/><br/>
              Hành động này sẽ <span className="font-semibold text-red-600">xóa vĩnh viễn</span> file khỏi AWS S3 bucket và gỡ index khỏi OpenSearch. Không thể hoàn tác.
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
