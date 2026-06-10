import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { FileText, Download, Eye, Search as SearchIcon } from "lucide-react"
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
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar - Filters (1/4) */}
        <aside className="w-full md:w-1/4 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <SearchIcon className="h-5 w-5 text-primary" /> Bộ lọc tìm kiếm
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

              <Button className="w-full mt-4" onClick={handleApplyFilters}>
                Áp dụng bộ lọc
              </Button>
            </div>
          </div>
        </aside>

        {/* Right Main Content - Results (3/4) */}
        <main className="w-full md:w-3/4">
          <div className="mb-6 flex justify-between items-center border-b pb-4">
            <h1 className="text-2xl font-bold text-slate-800">
              {isLoading ? "Đang tìm kiếm..." : `Tìm thấy ${results.length} tài liệu`}
            </h1>
            {!isLoading && query && (
              <p className="text-slate-500">
                Cho từ khóa: <span className="font-semibold text-primary">"{query}"</span>
              </p>
            )}
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
                <Card key={doc.id} className="flex flex-col h-full hover:-translate-y-1 transition-transform duration-200">
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
                    <div className="flex w-full gap-2">
                      <Link to={`/preview/${doc.id}`} className="flex-1">
                        <Button variant="outline" className="w-full text-primary border-primary/20 hover:bg-primary/5">
                          <Eye className="w-4 h-4 mr-2" /> Xem
                        </Button>
                      </Link>
                      <Button variant="default" className="px-3" title="Tải xuống nhanh">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Không tìm thấy tài liệu nào</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Rất tiếc, chúng tôi không tìm thấy tài liệu nào khớp với yêu cầu của bạn. Thử dùng từ khóa ngắn hơn hoặc thay đổi bộ lọc.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
