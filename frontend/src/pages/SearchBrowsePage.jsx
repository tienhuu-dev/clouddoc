import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { FileText, Download, Eye, Search as SearchIcon, Filter, BookOpen } from "lucide-react"
import { SCHOOL_DATA } from "@/services/mockData"
import { useAppContext } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function SearchBrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const schoolParam = searchParams.get("school") || ""
  const deptParam = searchParams.get("dept") || ""
  const subjectParam = searchParams.get("subject") || ""

  const { documents } = useAppContext()

  const [isLoading, setIsLoading] = useState(true)
  const [results, setResults] = useState([])

  // Filters State
  const [localQuery, setLocalQuery] = useState(query)
  const [selectedSchool, setSelectedSchool] = useState(schoolParam)
  const [selectedDept, setSelectedDept] = useState(deptParam)
  const [selectedSubject, setSelectedSubject] = useState(subjectParam)

  const schools = Object.keys(SCHOOL_DATA)
  const departments = selectedSchool ? Object.keys(SCHOOL_DATA[selectedSchool]) : []
  const subjects = selectedDept ? SCHOOL_DATA[selectedSchool][selectedDept] : []

  useEffect(() => {
    // Simulate API delay with OpenSearch
    setIsLoading(true)
    const timer = setTimeout(() => {
      // Chỉ tìm trong các tài liệu đã được duyệt
      let filtered = documents.filter(d => d.status === "approved")

      if (query) {
        const q = query.toLowerCase()
        filtered = filtered.filter(doc => 
          doc.title.toLowerCase().includes(q) || 
          doc.contentIndex.toLowerCase().includes(q)
        )
      }
      if (schoolParam) filtered = filtered.filter(doc => doc.school === schoolParam)
      if (deptParam) filtered = filtered.filter(doc => doc.department === deptParam)
      if (subjectParam) filtered = filtered.filter(doc => doc.subject === subjectParam)

      setResults(filtered)
      setIsLoading(false)
    }, 800) // 800ms skeleton loading

    return () => clearTimeout(timer)
  }, [query, schoolParam, deptParam, subjectParam, documents])

  const handleApplyFilters = () => {
    const params = new URLSearchParams()
    if (localQuery) params.append("q", localQuery)
    if (selectedSchool) params.append("school", selectedSchool)
    if (selectedDept) params.append("dept", selectedDept)
    if (selectedSubject) params.append("subject", selectedSubject)
    setSearchParams(params)
  }

  const getBadgeVariant = (fileType) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return 'pdf'
      case 'docx': return 'docx'
      case 'zip': return 'zip'
      default: return 'secondary'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Premium Header Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-8 md:p-12 mb-10 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <BookOpen className="w-96 h-96 text-white" />
        </div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-32 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 text-white max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">Khám phá Kho Tàng Tri Thức</h1>
          <p className="text-indigo-100 text-lg md:text-xl opacity-90 leading-relaxed font-medium">
            Tìm kiếm hàng ngàn tài liệu học tập, slide bài giảng và đề thi được chia sẻ bởi cộng đồng sinh viên HUTECH.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar - Filters (1/4) */}
        <aside className="w-full md:w-1/4 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] sticky top-24 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
              <Filter className="h-5 w-5 text-indigo-600" /> Bộ lọc tìm kiếm
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Từ khóa</label>
                <Input 
                  value={localQuery} 
                  onChange={(e) => setLocalQuery(e.target.value)}
                  placeholder="Nhập từ khóa..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Trường</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={selectedSchool}
                  onChange={(e) => {
                    setSelectedSchool(e.target.value)
                    setSelectedDept("")
                    setSelectedSubject("")
                  }}
                >
                  <option value="">Tất cả</option>
                  {schools.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ngành</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(e.target.value)
                    setSelectedSubject("")
                  }}
                  disabled={!selectedSchool}
                >
                  <option value="">Tất cả</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Môn học</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  disabled={!selectedDept}
                >
                  <option value="">Tất cả</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <Button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-md h-12 shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 rounded-xl font-semibold" onClick={handleApplyFilters}>
                Áp dụng bộ lọc
              </Button>
            </div>
          </div>
        </aside>

        {/* Right Main Content - Results (3/4) */}
        <main className="w-full md:w-3/4">
          <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end border-b border-slate-200 pb-5">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                {isLoading ? "Đang tìm kiếm..." : `Tìm thấy ${results.length} tài liệu`}
              </h2>
              {!isLoading && query && (
                <p className="text-slate-500 mt-1 font-medium">
                  Cho từ khóa: <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">"{query}"</span>
                </p>
              )}
            </div>
          </div>

          {isLoading ? (
            // Skeleton Loading
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
                  <div className="h-4 w-16 bg-slate-200 rounded-full mb-4"></div>
                  <div className="h-6 w-full bg-slate-200 rounded mb-2"></div>
                  <div className="h-6 w-3/4 bg-slate-200 rounded mb-4"></div>
                  <div className="space-y-2 mt-4">
                    <div className="h-3 w-full bg-slate-100 rounded"></div>
                    <div className="h-3 w-5/6 bg-slate-100 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            // Document Cards Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(doc => (
                <Card key={doc.id} className="flex flex-col h-full hover:-translate-y-1.5 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 bg-white rounded-2xl overflow-hidden border-slate-200">
                  <CardHeader className="pb-3 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant={getBadgeVariant(doc.fileType)}>
                        .{doc.fileType.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-slate-400 font-medium">{doc.fileSize}</span>
                    </div>
                    <CardTitle className="text-lg line-clamp-2 leading-tight" title={doc.title}>
                      {doc.title}
                    </CardTitle>
                    <div className="mt-2 text-sm text-slate-500">
                      <p className="line-clamp-1">{doc.school} &bull; {doc.department}</p>
                      <p className="font-medium text-slate-700">{doc.subject}</p>
                    </div>
                  </CardHeader>
                  <CardFooter className="pt-0 flex flex-col gap-3">
                    <div className="w-full flex justify-between items-center text-xs text-slate-500 mb-2">
                      <span>👤 {doc.uploader}</span>
                      <span>⬇️ {doc.downloadCount}</span>
                    </div>
                      <div className="pt-0 flex gap-2 w-full">
                        <Link to={`/preview/${doc.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full text-slate-600 bg-slate-50 hover:bg-slate-100 h-9">
                            <Eye className="w-3.5 h-3.5 mr-1.5" /> Xem
                          </Button>
                        </Link>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex-1 h-9 bg-blue-600 hover:bg-blue-700 shadow-sm"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            if (doc.s3Url && doc.s3Url !== "#") {
                              const a = window.document.createElement('a')
                              a.href = doc.s3Url
                              a.download = `${doc.title}.${doc.fileType}`
                              a.click()
                            } else {
                              alert("Tính năng tải xuống file Demo này hiện không khả dụng do không có link S3 thật!")
                            }
                          }}
                        >
                          <Download className="w-3.5 h-3.5 mr-1.5" /> Tải
                        </Button>
                      </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-24 bg-gradient-to-b from-slate-50 to-white rounded-2xl border-2 border-dashed border-slate-200 shadow-sm">
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <FileText className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-3 tracking-tight">Không tìm thấy tài liệu nào</h3>
              <p className="text-slate-500 max-w-md mx-auto text-lg leading-relaxed">
                Rất tiếc, chúng tôi không tìm thấy tài liệu nào khớp với yêu cầu của bạn. Hãy thử dùng từ khóa ngắn hơn hoặc nới lỏng bộ lọc nhé.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
