import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { UploadCloud, File, X, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react"
import { SCHOOL_DATA } from "@/services/mockData"
import { useAppContext } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"

export default function UploadPage() {
  const { addDocument, currentUser } = useAppContext()
  const navigate = useNavigate()
  
  const [file, setFile] = useState(null)
  const [error, setError] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const fileInputRef = useRef(null)

  // Form states
  const [title, setTitle] = useState("")
  const [school, setSchool] = useState("")
  const [dept, setDept] = useState("")
  const [subject, setSubject] = useState("")

  const schools = Object.keys(SCHOOL_DATA)
  const departments = school ? Object.keys(SCHOOL_DATA[school]) : []
  const subjects = dept ? SCHOOL_DATA[school][dept] : []

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    // Validate size (< 20MB)
    if (selectedFile.size > 20 * 1024 * 1024) {
      setError("File quá lớn. Vui lòng chọn file dưới 20MB.")
      setFile(null)
      return
    }

    setError("")
    setFile(selectedFile)
    if (!title) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""))
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange({ target: { files: [e.dataTransfer.files[0]] } })
    }
  }

  const handleUpload = () => {
    if (!file || !title || !school || !dept || !subject) {
      setError("Vui lòng điền đầy đủ thông tin và chọn file.")
      return
    }

    setIsUploading(true)
    setError("")
    setProgress(0)
  }

  // Effect to handle progress and submission
  useEffect(() => {
    let interval;
    if (isUploading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 100
          return prev + Math.floor(Math.random() * 15) + 5
        })
      }, 400)
    }
    return () => clearInterval(interval)
  }, [isUploading])

  useEffect(() => {
    if (isUploading && progress >= 100) {
      // Simulate final delay
      const timer = setTimeout(() => {
          // Thêm document vào Context (status pending)
          const ext = file.name.split('.').pop()
          const objectUrl = URL.createObjectURL(file)
          
          const newDoc = {
            title: title,
            school: school,
            department: dept,
            subject: subject,
            fileType: ext,
            fileSize: (file.size / (1024 * 1024)).toFixed(1) + "MB",
            uploader: currentUser?.name || "Ẩn danh",
            status: "pending",
            downloadCount: 0,
            s3Url: objectUrl, // Dùng Blob URL để preview và tải xuống thật trong session này
            contentIndex: title.toLowerCase(),
          uploadDate: new Date().toISOString().split('T')[0],
          uploadTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }
        
        addDocument(newDoc)
        setIsUploading(false)
        setIsSuccess(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [progress, isUploading, addDocument, currentUser, file, title, school, dept, subject])

  const resetForm = () => {
    setFile(null)
    setTitle("")
    setSchool("")
    setDept("")
    setSubject("")
    setIsSuccess(false)
    setProgress(0)
    setError("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button 
        variant="ghost" 
        className="mb-4 text-slate-500 hover:text-slate-800 -ml-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
      </Button>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-3">Đóng góp tài liệu</h1>
        <p className="text-slate-500">
          Chia sẻ tài liệu học tập của bạn để giúp đỡ cộng đồng sinh viên. <br/>
          Hỗ trợ định dạng: PDF, DOCX, ZIP (Tối đa 20MB).
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-10">
        
        {isSuccess ? (
          <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload Thành Công!</h2>
            <p className="text-slate-500 mb-4">
              Tài liệu <span className="font-semibold text-slate-700">"{title}"</span> đã được tải lên máy chủ AWS S3 an toàn.
            </p>
            <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 p-3 rounded-lg text-sm max-w-md mx-auto mb-8">
              Tài liệu của bạn đang ở trạng thái <strong>Chờ duyệt</strong>. Xin vui lòng chờ Admin phê duyệt trước khi tài liệu xuất hiện trên Trang chủ!
            </div>
            <Button size="lg" onClick={resetForm} className="px-8">
              Tiếp tục đóng góp tài liệu khác
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* File Dropzone */}
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors
                ${file ? 'border-primary/50 bg-blue-50/50' : 'border-slate-300 hover:border-primary hover:bg-slate-50'}
                ${error ? 'border-red-400 bg-red-50' : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".pdf,.doc,.docx,.zip,.rar"
              />
              
              {file ? (
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm max-w-md mx-auto relative z-10" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-3 overflow-hidden">
                    <File className="h-8 w-8 text-primary shrink-0" />
                    <div className="text-left overflow-hidden">
                      <p className="font-medium text-slate-700 truncate">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setFile(null)
                      if (fileInputRef.current) fileInputRef.current.value = ""
                    }}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4 cursor-pointer">
                  <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center mx-auto">
                    <UploadCloud className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-slate-700">Kéo thả file vào đây hoặc Click để chọn file</p>
                    <p className="text-sm text-slate-500 mt-1">Hỗ trợ PDF, DOCX, ZIP (Max 20MB)</p>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            )}

            {/* Metadata Form */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên tài liệu <span className="text-red-500">*</span></label>
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tên hiển thị của tài liệu..."
                  className="h-12"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Trường <span className="text-red-500">*</span></label>
                  <select 
                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={school}
                    onChange={(e) => {
                      setSchool(e.target.value)
                      setDept("")
                      setSubject("")
                    }}
                  >
                    <option value="">Chọn Trường</option>
                    {schools.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ngành <span className="text-red-500">*</span></label>
                  <select 
                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    value={dept}
                    onChange={(e) => {
                      setDept(e.target.value)
                      setSubject("")
                    }}
                    disabled={!school}
                  >
                    <option value="">Chọn Ngành</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Môn học <span className="text-red-500">*</span></label>
                  <select 
                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={!dept}
                  >
                    <option value="">Chọn Môn</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Upload Button & Progress */}
            <div className="pt-4 border-t border-slate-100">
              {isUploading ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium text-slate-700">
                    <span>Đang tải lên máy chủ AWS S3...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>
              ) : (
                <Button 
                  size="lg" 
                  className="w-full h-14 text-lg shadow-md"
                  onClick={handleUpload}
                >
                  <UploadCloud className="h-5 w-5 mr-2" />
                  Bắt đầu tải lên
                </Button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
