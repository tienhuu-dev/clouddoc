import { useState } from "react"
import { User, Mail, School, BookOpen, Clock, CheckCircle, Save, FileText } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function UserProfilePage() {
  const { currentUser, documents, updateUserProfile } = useAppContext()
  
  const [activeTab, setActiveTab] = useState("profile") // 'profile' | 'documents'
  const [isEditing, setIsEditing] = useState(false)
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    school: currentUser?.school || "",
    department: currentUser?.department || ""
  })

  // Lọc bài đăng của user này
  const myDocuments = documents.filter(doc => doc.uploader === currentUser?.name)

  const handleSaveProfile = (e) => {
    e.preventDefault()
    updateUserProfile(formData)
    setIsEditing(false)
  }

  if (!currentUser) return null // Guard for rendering before redirect

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar - Profile Summary */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
            <div className="bg-primary/10 h-32 relative">
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md">
                  <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-primary border-2 border-primary/20">
                    <User className="w-10 h-10" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-14 pb-6 px-6 text-center">
              <h2 className="text-xl font-bold text-slate-800">{currentUser.name}</h2>
              <p className="text-sm text-slate-500 mb-4">{currentUser.email}</p>
              
              <div className="flex justify-center gap-2 mb-6">
                <Badge variant="outline" className="bg-slate-50 text-slate-600">{currentUser.role === 'admin' ? 'Quản trị viên' : 'Sinh viên'}</Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{currentUser.school}</Badge>
              </div>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setActiveTab("profile")}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left flex items-center gap-3 ${activeTab === 'profile' ? 'bg-primary text-white shadow-sm' : 'hover:bg-slate-50 text-slate-600'}`}
                >
                  <User className="w-4 h-4" /> Thông tin cá nhân
                </button>
                <button 
                  onClick={() => setActiveTab("documents")}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left flex items-center justify-between ${activeTab === 'documents' ? 'bg-primary text-white shadow-sm' : 'hover:bg-slate-50 text-slate-600'}`}
                >
                  <span className="flex items-center gap-3"><FileText className="w-4 h-4" /> Bài đã đăng</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{myDocuments.length}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="w-full md:w-2/3">
          
          {/* TAB 1: PROFILE INFO */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Thông tin cá nhân</h3>
                  <p className="text-sm text-slate-500 mt-1">Quản lý và cập nhật hồ sơ của bạn</p>
                </div>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Chỉnh sửa
                  </Button>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" /> Họ và tên
                      </label>
                      <Input 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-slate-50 border-transparent text-slate-700" : ""}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" /> Email
                      </label>
                      <Input 
                        type="email"
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-slate-50 border-transparent text-slate-700" : ""}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                        <School className="w-4 h-4 text-slate-400" /> Trường Đại học
                      </label>
                      <Input 
                        value={formData.school} 
                        onChange={(e) => setFormData({...formData, school: e.target.value})}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-slate-50 border-transparent text-slate-700" : ""}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-slate-400" /> Chuyên ngành
                      </label>
                      <Input 
                        value={formData.department} 
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-slate-50 border-transparent text-slate-700" : ""}
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                    <Button type="button" variant="ghost" onClick={() => {
                      setIsEditing(false)
                      setFormData(currentUser) // Reset
                    }}>
                      Hủy bỏ
                    </Button>
                    <Button type="submit" className="gap-2">
                      <Save className="w-4 h-4" /> Lưu thay đổi
                    </Button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB 2: MY DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Tài liệu đã đóng góp</h3>
                  <p className="text-sm text-slate-500 mt-1">Lịch sử tải lên và trạng thái kiểm duyệt</p>
                </div>
              </div>

              {myDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Bạn chưa đăng tài liệu nào.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myDocuments.map((doc) => (
                    <div key={doc.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-slate-50 transition-colors gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 line-clamp-1" title={doc.title}>{doc.title}</h4>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">.{doc.fileType.toUpperCase()}</Badge>
                          <span>{doc.uploadDate}</span>
                          <span className="hidden md:inline">&bull;</span>
                          <span className="hidden md:inline">{doc.subject} ({doc.school})</span>
                        </div>
                      </div>
                      
                      <div className="shrink-0 flex items-center md:flex-col md:items-end gap-2 md:gap-1.5 w-full md:w-auto">
                        {doc.status === 'pending' ? (
                          <span className="inline-flex items-center text-yellow-600 bg-yellow-50 border border-yellow-200 px-2.5 py-1 rounded-full text-xs font-medium">
                            <Clock className="w-3 h-3 mr-1.5" /> Đang chờ duyệt
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full text-xs font-medium">
                            <CheckCircle className="w-3 h-3 mr-1.5" /> Đã xuất bản
                          </span>
                        )}
                        {doc.status === 'approved' && (
                          <span className="text-xs text-slate-400">Lượt tải: {doc.downloadCount}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
