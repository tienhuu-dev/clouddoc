import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, BookOpen } from "lucide-react"
import { SCHOOL_DATA } from "@/services/mockData"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HomePage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSchool, setSelectedSchool] = useState("")
  const [selectedDept, setSelectedDept] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")

  const schools = Object.keys(SCHOOL_DATA)
  const departments = selectedSchool ? Object.keys(SCHOOL_DATA[selectedSchool]) : []
  const subjects = selectedDept ? SCHOOL_DATA[selectedSchool][selectedDept] : []

  const handleSearch = (e) => {
    e.preventDefault()
    // Navigate to Search page with query params
    const params = new URLSearchParams()
    if (searchQuery) params.append("q", searchQuery)
    if (selectedSchool) params.append("school", selectedSchool)
    if (selectedDept) params.append("dept", selectedDept)
    if (selectedSubject) params.append("subject", selectedSubject)
    
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50/50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-12 text-center -mt-20">
        
        {/* Hero Title */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Kho tài liệu học tập <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">CloudDoc</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Tìm kiếm bài giảng, đề thi, và tài liệu chuyên ngành nhanh chóng. Dữ liệu được chia sẻ bởi cộng đồng sinh viên HUTECH.
          </p>
        </div>

        {/* Search & Filter Box */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100 space-y-6">
          <form onSubmit={handleSearch} className="space-y-6">
            
            {/* Main Search Bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-slate-400 group-focus-within:text-primary transition-colors" />
              </div>
              <Input 
                type="text" 
                placeholder="Nhập tên tài liệu, môn học hoặc từ khóa bạn cần tìm..." 
                className="pl-12 h-16 text-lg rounded-xl bg-slate-50 border-slate-200 focus-visible:bg-white shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                <Button type="submit" size="lg" className="rounded-lg px-8 h-12 text-base font-semibold shadow-md">
                  Tìm kiếm
                </Button>
              </div>
            </div>

            {/* Cascading Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select 
                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedSchool}
                onChange={(e) => {
                  setSelectedSchool(e.target.value)
                  setSelectedDept("")
                  setSelectedSubject("")
                }}
              >
                <option value="">-- Chọn Trường --</option>
                {schools.map(school => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </select>

              <select 
                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value)
                  setSelectedSubject("")
                }}
                disabled={!selectedSchool}
              >
                <option value="">-- Chọn Ngành --</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <select 
                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                disabled={!selectedDept}
              >
                <option value="">-- Chọn Môn Học --</option>
                {subjects.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

          </form>
        </div>

        {/* Popular Tags */}
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          <span className="text-sm text-slate-500 font-medium mr-2">Tìm kiếm phổ biến:</span>
          {["Cơ sở dữ liệu", "Toán rời rạc", "Đề thi C++", "Tài liệu React"].map(tag => (
            <button 
              key={tag} 
              onClick={() => { setSearchQuery(tag); handleSearch({preventDefault: () => {}}); }}
              className="text-sm px-3 py-1 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}
