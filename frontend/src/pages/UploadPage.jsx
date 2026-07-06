import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { UploadCloud, File, X, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck, FileCheck2, LockKeyhole, ScanSearch } from "lucide-react"
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
          return Math.min(100, prev + Math.floor(Math.random() * 15) + 5)
        })
      }, 400)
    }
    return () => clearInterval(interval)
  }, [isUploading])

  useEffect(() => {
    if (isUploading && progress >= 100) {
      const timer = setTimeout(() => {
        const submitDocument = async () => {
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
            s3Url: objectUrl,
            contentIndex: title.toLowerCase(),
          uploadDate: new Date().toISOString().split('T')[0],
          uploadTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }
        
          try {
            await addDocument(newDoc, file)
            setIsSuccess(true)
          } catch (uploadError) {
            setError(uploadError.message || "Tải lên thất bại. Vui lòng thử lại.")
          } finally {
            setIsUploading(false)
          }
        }

        submitDocument()
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
    <div className="user-page-enter min-h-screen bg-[#f5fbf4] px-4 py-8 text-[#171d19] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
      <Button 
        variant="ghost" 
        className="mb-5 -ml-2 gap-2 rounded-full text-[#6d7a72] hover:bg-[#e4eae3] hover:text-[#006c49]"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
      </Button>

      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#006c49]"><FileCheck2 className="h-3.5 w-3.5" /> Đóng góp cho cộng đồng</span>
          <h1 className="mt-2 text-4xl font-bold tracking-[-0.03em]">Chia sẻ tài liệu học tập</h1>
          <p className="mt-2 text-sm text-[#6d7a72]">Tải lên tài liệu và cung cấp thông tin để cộng đồng dễ dàng tìm thấy.</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#55c694]/20 px-3 py-2 text-xs font-bold text-[#005236]"><ShieldCheck className="h-4 w-4" /> Kiểm duyệt trước khi xuất bản</span>
      </div>

      <div className="reveal-up rounded-2xl border border-[#bdcac0]/45 bg-white p-5 shadow-[0_4px_20px_rgba(19,78,74,0.04)] md:p-6">
        
        {isSuccess ? (
          <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
            <span className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-[#55c694]/20 text-[#006c49]"><CheckCircle2 className="h-10 w-10" /></span>
            <h2 className="mb-2 text-2xl font-bold">Tải lên thành công</h2>
            <p className="mb-4 text-[#6d7a72]">
              Tài liệu <span className="font-semibold text-[#3e4a42]">"{title}"</span> đã được tải lên máy chủ AWS S3 an toàn.
            </p>
            <div className="mx-auto mb-8 max-w-md rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
              Tài liệu của bạn đang ở trạng thái <strong>Chờ duyệt</strong>. Xin vui lòng chờ Admin phê duyệt trước khi tài liệu xuất hiện trên Trang chủ!
            </div>
            <Button size="lg" onClick={resetForm} className="rounded-full bg-[#006c49] px-8 hover:bg-[#005c3f]">
              Tiếp tục đóng góp tài liệu khác
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-4">
              <div
                className={`grid min-h-[330px] cursor-pointer place-items-center border-2 border-dashed p-6 text-center transition-all
                  ${file ? 'border-[#55c694] bg-[#55c694]/10' : 'border-[#bdcac0]/70 bg-[#f5fbf4] hover:border-[#55c694] hover:bg-[#55c694]/10'}
                  ${error ? 'border-red-400 bg-red-50' : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => !file && fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.zip,.rar" />
                {file ? (
                  <div className="w-full" onClick={(event) => event.stopPropagation()}>
                    <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#55c694]/20 text-[#006c49]"><File className="h-8 w-8" /></span>
                    <p className="mx-auto mt-4 max-w-xs truncate font-bold">{file.name}</p>
                    <p className="mt-1 text-xs text-[#6d7a72]">{(file.size / (1024 * 1024)).toFixed(2)} MB · Sẵn sàng tải lên</p>
                    <div className="mt-5 flex justify-center gap-2">
                      <Button type="button" variant="outline" size="sm" className="rounded-md" onClick={() => fileInputRef.current?.click()}>Đổi file</Button>
                      <Button type="button" variant="ghost" size="sm" className="rounded-md text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = "" }}><X className="mr-1 h-4 w-4" /> Xóa</Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#55c694]/20 text-[#006c49]"><UploadCloud className="h-8 w-8" /></span>
                    <p className="mt-5 text-lg font-bold">Kéo thả file vào đây</p>
                    <p className="mt-1 text-sm text-[#6d7a72]">hoặc nhấn để lựa chọn từ thiết bị</p>
                    <span className="mt-5 inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#6d7a72] shadow-sm ring-1 ring-[#bdcac0]/50">PDF, DOCX, ZIP · Tối đa 20MB</span>
                  </div>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="flex gap-3 rounded-xl bg-[#eff5ef] p-3"><LockKeyhole className="h-4 w-4 shrink-0 text-[#006c49]" /><div><p className="text-xs font-bold">Lưu trữ an toàn</p><p className="mt-0.5 text-[10px] leading-4 text-[#6d7a72]">File được bảo vệ trên hệ thống.</p></div></div>
                <div className="flex gap-3 rounded-xl bg-[#eff5ef] p-3"><ScanSearch className="h-4 w-4 shrink-0 text-[#006a69]" /><div><p className="text-xs font-bold">Dễ dàng tìm kiếm</p><p className="mt-0.5 text-[10px] leading-4 text-[#6d7a72]">Thông tin giúp tài liệu dễ tiếp cận.</p></div></div>
              </div>
            </div>

            <div className="space-y-5 rounded-2xl border border-[#bdcac0]/45 bg-[#f5fbf4] p-5">
              <div className="flex items-center gap-2 border-b border-[#bdcac0]/35 pb-4">
                <ShieldCheck className="h-5 w-5 text-[#006c49]" />
                <div><h2 className="text-sm font-bold">Thông tin tài liệu</h2><p className="text-xs text-[#6d7a72]">Giúp người học tìm thấy tài liệu dễ dàng hơn.</p></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên tài liệu <span className="text-red-500">*</span></label>
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tên hiển thị của tài liệu..."
                  className="h-12 rounded-xl border-[#bdcac0]/60 bg-white shadow-none focus-visible:ring-[#55c694]/30"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Trường <span className="text-red-500">*</span></label>
                  <select 
                    className="flex h-12 w-full rounded-xl border border-[#bdcac0]/60 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#55c694]/30"
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
                    className="flex h-12 w-full rounded-xl border border-[#bdcac0]/60 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#55c694]/30 disabled:opacity-50"
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
                    className="flex h-12 w-full rounded-xl border border-[#bdcac0]/60 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#55c694]/30 disabled:opacity-50"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={!dept}
                  >
                    <option value="">Chọn Môn</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle className="h-5 w-5 shrink-0" /> {error}
                </div>
              )}

              <div className="border-t border-[#bdcac0]/35 pt-4">
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
                  className="h-14 w-full rounded-full bg-[#006c49] text-base font-bold shadow-none hover:bg-[#005c3f]"
                  onClick={handleUpload}
                >
                  <UploadCloud className="h-5 w-5 mr-2" />
                  Bắt đầu tải lên
                </Button>
              )}
              </div>
            </div>
          </div>
        )}

      </div>
      </div>
    </div>
  )
}
