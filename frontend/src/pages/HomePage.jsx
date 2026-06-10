import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Search, Download, Eye } from "lucide-react"
import { SCHOOL_DATA } from "@/services/mockData"
import { useAppContext } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const navigate = useNavigate()
  const { documents } = useAppContext()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSchool, setSelectedSchool] = useState("")
  const [selectedDept, setSelectedDept] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")

  const schools = Object.keys(SCHOOL_DATA)
  const departments = selectedSchool ? Object.keys(SCHOOL_DATA[selectedSchool]) : []
  const subjects = selectedDept ? SCHOOL_DATA[selectedSchool][selectedDept] : []

  // Lấy các tài liệu đã duyệt để hiển thị mục Mới cập nhật
  const approvedDocs = documents.filter(d => d.status === "approved").slice(0, 8)

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.append("q", searchQuery)
    if (selectedSchool) params.append("school", selectedSchool)
    if (selectedDept) params.append("dept", selectedDept)
    if (selectedSubject) params.append("subject", selectedSubject)
    
    navigate(`/search?${params.toString()}`)
  }

  const getBadgeVariant = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case 'pdf': return 'pdf'
      case 'docx': return 'docx'
      case 'zip': return 'zip'
      default: return 'secondary'
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* Hero Banner Section */}
      <div className="relative w-full bg-blue-600 overflow-hidden py-24 border-b border-blue-700 shadow-inner">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-20">
          <svg className="absolute left-0 top-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon fill="white" points="0,100 100,0 100,100"/>
          </svg>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-24 -left-24 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="bg-white/10 backdrop-blur-md inline-block px-6 py-2 rounded-full mb-6 border border-white/20">
            <span className="text-white font-medium text-sm">Hệ thống Thư viện số hiện đại</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4 drop-shadow-md">
            KHO TÀI LIỆU HỌC TẬP CLOUDDOC
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Tìm kiếm bài giảng, đề thi, và tài liệu chuyên ngành nhanh chóng. Dữ liệu được chia sẻ bởi cộng đồng sinh viên.
          </p>

          {/* Search Box */}
          <div className="bg-white/95 backdrop-blur-xl p-4 md:p-6 rounded-2xl shadow-2xl max-w-5xl mx-auto border border-white/40">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
              
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>
                <Input 
                  type="text" 
                  placeholder="Nhập từ khóa cần tìm kiếm..." 
                  className="pl-12 h-14 text-base rounded-xl bg-slate-50 border-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select 
                className="h-14 rounded-xl border border-input bg-slate-50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary w-full md:w-48"
                value={selectedSchool}
                onChange={(e) => { setSelectedSchool(e.target.value); setSelectedDept(""); setSelectedSubject(""); }}
              >
                <option value="">[Chọn Trường]</option>
                {schools.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <select 
                className="h-14 rounded-xl border border-input bg-slate-50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary w-full md:w-48 disabled:opacity-50"
                value={selectedDept}
                onChange={(e) => { setSelectedDept(e.target.value); setSelectedSubject(""); }}
                disabled={!selectedSchool}
              >
                <option value="">[Chọn Ngành]</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <select 
                className="h-14 rounded-xl border border-input bg-slate-50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary w-full md:w-48 disabled:opacity-50"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                disabled={!selectedDept}
              >
                <option value="">[Chọn Môn Học]</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <Button type="submit" size="lg" className="h-14 px-8 rounded-xl text-base font-bold">
                Tìm kiếm
              </Button>
            </form>

            {/* Popular Tags */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="text-sm text-slate-500 font-medium mr-2 self-center">Tin nhiều nhất:</span>
              {["Cơ sở dữ liệu", "Toán rời rạc", "Đề thi C++", "Tài liệu React"].map(tag => (
                <button 
                  key={tag} 
                  onClick={() => { setSearchQuery(tag); handleSearch({preventDefault: () => {}}); }}
                  className="text-xs px-3 py-1.5 rounded-md bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Documents Section */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex justify-between items-end mb-8 border-b pb-4">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            ✨ TÀI LIỆU MỚI CẬP NHẬT (Đã duyệt)
          </h2>
          <Link to="/search" className="text-sm font-medium text-primary hover:underline">
            Xem tất cả &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {approvedDocs.map(doc => (
            <Card key={doc.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 border-slate-200 bg-white">
              <CardHeader className="pb-3 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={getBadgeVariant(doc.fileType)} className="px-2 py-0.5">
                    .{doc.fileType.toUpperCase()}
                  </Badge>
                </div>
                <CardTitle className="text-[15px] leading-snug line-clamp-2 hover:text-primary transition-colors cursor-pointer" title={doc.title}>
                  <Link to={`/preview/${doc.id}`}>{doc.title}</Link>
                </CardTitle>
                <div className="mt-2 text-xs text-slate-500">
                  <p className="font-medium text-slate-700 line-clamp-1 mb-1">
                    <span className="text-slate-400 font-normal">Uploader:</span> {doc.uploader}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">📄 {doc.fileSize}</span>
                    <span className="flex items-center gap-1">⬇️ {doc.downloadCount}</span>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="pt-0 flex gap-2">
                <Link to={`/preview/${doc.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-slate-600 bg-slate-50 hover:bg-slate-100 h-9">
                    <Eye className="w-3.5 h-3.5 mr-1.5" /> Xem
                  </Button>
                </Link>
                <Button variant="default" size="sm" className="flex-1 h-9 bg-blue-600 hover:bg-blue-700 shadow-sm">
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Tải
                </Button>
              </CardFooter>
            </Card>
          ))}
          {approvedDocs.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              Chưa có tài liệu nào được duyệt.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
