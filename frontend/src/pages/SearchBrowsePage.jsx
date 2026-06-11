import { useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Download, Eye, FileText, Search, SlidersHorizontal, Sparkles, X } from "lucide-react"
import { SCHOOL_DATA } from "@/services/mockData"
import { useAppContext } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const fileStyles = {
  pdf: "bg-[#55c694]/20 text-[#006c49]",
  docx: "bg-[#8ef3f2]/30 text-[#006a69]",
  zip: "bg-[#86bcb7]/25 text-[#316763]",
}

function FilterPanel({ query, schoolParam, deptParam, subjectParam, localQuery, setLocalQuery, selectedSchool, setSelectedSchool, selectedDept, setSelectedDept, selectedSubject, setSelectedSubject, schools, departments, subjects, applyFilters, clearFilters }) {
  const filters = [
    { label: "Trường đại học", value: selectedSchool, options: schools, onChange: (value) => { setSelectedSchool(value); setSelectedDept(""); setSelectedSubject("") }, disabled: false },
    { label: "Chuyên ngành", value: selectedDept, options: departments, onChange: (value) => { setSelectedDept(value); setSelectedSubject("") }, disabled: !selectedSchool },
    { label: "Môn học", value: selectedSubject, options: subjects, onChange: setSelectedSubject, disabled: !selectedDept },
  ]

  return (
    <form onSubmit={applyFilters} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#006c49]">Bộ lọc</h2>
        <p className="mt-1 text-sm text-[#6d7a72]">Thu hẹp kết quả tìm kiếm</p>
      </div>
      <label className="relative block">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#006c49]" />
        <Input value={localQuery} onChange={(event) => setLocalQuery(event.target.value)} placeholder="Nhập từ khóa..." className="h-11 rounded-full border-[#bdcac0]/60 bg-white pl-10 shadow-none focus-visible:ring-[#55c694]/30" />
      </label>
      {filters.map((filter) => (
        <label key={filter.label} className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#3e4a42]">{filter.label}</span>
          <select value={filter.value} onChange={(event) => filter.onChange(event.target.value)} disabled={filter.disabled} className="h-11 w-full rounded-xl border border-[#bdcac0]/60 bg-white px-3 text-sm text-[#3e4a42] outline-none focus:border-[#006c49] disabled:bg-[#eff5ef] disabled:opacity-60">
            <option value="">Tất cả</option>
            {filter.options.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
      ))}
      <Button type="submit" className="h-11 w-full rounded-full bg-[#006c49] shadow-none hover:bg-[#005c3f]">Áp dụng bộ lọc</Button>
      {(query || schoolParam || deptParam || subjectParam) && <button type="button" onClick={clearFilters} className="w-full text-xs font-semibold text-[#6d7a72] hover:text-red-600">Xóa tất cả bộ lọc</button>}
    </form>
  )
}

export default function SearchBrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams()

  return <SearchBrowseContent key={searchParams.toString()} searchParams={searchParams} setSearchParams={setSearchParams} />
}

function SearchBrowseContent({ searchParams, setSearchParams }) {
  const { documents } = useAppContext()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const query = searchParams.get("q") || ""
  const schoolParam = searchParams.get("school") || ""
  const deptParam = searchParams.get("dept") || ""
  const subjectParam = searchParams.get("subject") || ""
  const [localQuery, setLocalQuery] = useState(query)
  const [selectedSchool, setSelectedSchool] = useState(schoolParam)
  const [selectedDept, setSelectedDept] = useState(deptParam)
  const [selectedSubject, setSelectedSubject] = useState(subjectParam)
  const schools = Object.keys(SCHOOL_DATA)
  const departments = selectedSchool ? Object.keys(SCHOOL_DATA[selectedSchool]) : []
  const subjects = selectedDept ? SCHOOL_DATA[selectedSchool][selectedDept] : []

  const results = useMemo(() => {
    let filtered = documents.filter((document) => document.status === "approved")
    if (query) {
      const normalizedQuery = query.toLocaleLowerCase("vi")
      filtered = filtered.filter((document) => `${document.title} ${document.contentIndex} ${document.subject}`.toLocaleLowerCase("vi").includes(normalizedQuery))
    }
    if (schoolParam) filtered = filtered.filter((document) => document.school === schoolParam)
    if (deptParam) filtered = filtered.filter((document) => document.department === deptParam)
    if (subjectParam) filtered = filtered.filter((document) => document.subject === subjectParam)
    return filtered
  }, [documents, query, schoolParam, deptParam, subjectParam])

  const applyFilters = (event) => {
    event?.preventDefault()
    const params = new URLSearchParams()
    if (localQuery) params.append("q", localQuery)
    if (selectedSchool) params.append("school", selectedSchool)
    if (selectedDept) params.append("dept", selectedDept)
    if (selectedSubject) params.append("subject", selectedSubject)
    setSearchParams(params)
    setFiltersOpen(false)
  }

  const clearFilters = () => {
    setLocalQuery(""); setSelectedSchool(""); setSelectedDept(""); setSelectedSubject(""); setSearchParams({})
  }

  const downloadDocument = (document) => {
    if (document.s3Url && document.s3Url !== "#") {
      const anchor = window.document.createElement("a")
      anchor.href = document.s3Url
      anchor.download = `${document.title}.${document.fileType}`
      anchor.click()
    } else window.alert("Tính năng tải xuống file Demo này hiện không khả dụng do không có link S3 thật!")
  }

  const filterPanelProps = { query, schoolParam, deptParam, subjectParam, localQuery, setLocalQuery, selectedSchool, setSelectedSchool, selectedDept, setSelectedDept, selectedSubject, setSelectedSubject, schools, departments, subjects, applyFilters, clearFilters }

  return (
    <div className="user-page-enter min-h-screen bg-[#f5fbf4]">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-10 lg:py-14">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-[#bdcac0]/35 bg-white/45 p-6 backdrop-blur-xl"><FilterPanel {...filterPanelProps} /></div>
        </aside>

        <main className="min-w-0">
          <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#006c49]"><Sparkles className="h-3.5 w-3.5" /> Tìm kiếm thông minh</span>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Kết quả tìm kiếm</h1>
              <p className="mt-2 text-sm text-[#3e4a42]">Tìm thấy <strong className="text-[#006c49]">{results.length} tài liệu</strong>{query ? <> cho “{query}”</> : " trong thư viện"}.</p>
            </div>
            <button type="button" onClick={() => setFiltersOpen(true)} className="flex h-11 items-center justify-center gap-2 rounded-full border border-[#bdcac0]/60 bg-white px-4 text-sm font-semibold text-[#006c49] lg:hidden"><SlidersHorizontal className="h-4 w-4" /> Bộ lọc</button>
          </header>

          {results.length > 0 ? (
            <div className="space-y-5">
              {results.map((document, index) => (
                <article key={document.id} style={{ "--delay": `${index * 70}ms` }} className="interactive-card reveal-up group relative overflow-hidden rounded-2xl border border-[#bdcac0]/45 bg-white p-5 shadow-[0_4px_20px_rgba(19,78,74,0.04)] sm:p-6">
                  <span className="absolute inset-y-0 left-0 w-1 bg-[#006c49]" />
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-[10px] font-bold uppercase ${fileStyles[document.fileType] || fileStyles.zip}`}>{document.fileType}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <Link to={`/preview/${document.id}`} className="text-lg font-semibold leading-7 group-hover:text-[#006c49]">{document.title}</Link>
                        <span className="rounded-full bg-[#55c694]/15 px-2.5 py-1 text-[11px] font-semibold text-[#005236]">{Math.max(60, 98 - index * 7)}% phù hợp</span>
                      </div>
                      <p className="mt-1 text-xs text-[#6d7a72]">{document.uploader} · {document.fileType.toUpperCase()} · {document.uploadDate}</p>
                      <div className="mt-4 rounded-xl border-l-2 border-[#006a69]/50 bg-[#eff5ef] px-4 py-3 text-sm leading-6 text-[#3e4a42]">
                        Tài liệu về <mark className="rounded bg-[#8ef3f2]/60 px-1 text-[#00504f]">{query || document.subject}</mark>, thuộc môn {document.subject} tại {document.school}.
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-[#eaefe9] px-2.5 py-1 text-[11px] font-semibold text-[#3e4a42]">{document.subject}</span>
                        <span className="rounded-md bg-[#eaefe9] px-2.5 py-1 text-[11px] font-semibold text-[#3e4a42]">{document.department}</span>
                        <span className="ml-auto flex items-center gap-1 text-xs text-[#6d7a72]"><Download className="h-3.5 w-3.5" /> {document.downloadCount}</span>
                        <Link to={`/preview/${document.id}`} className="grid h-8 w-8 place-items-center rounded-full text-[#006c49] hover:bg-[#55c694]/15"><Eye className="h-4 w-4" /></Link>
                        <button type="button" onClick={() => downloadDocument(document)} className="grid h-8 w-8 place-items-center rounded-full text-[#006c49] hover:bg-[#55c694]/15"><Download className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-[#bdcac0]/60 bg-white/60 py-20 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#55c694]/15 text-[#006c49]"><FileText className="h-7 w-7" /></span>
              <h3 className="mt-5 text-lg font-semibold">Không tìm thấy tài liệu</h3>
              <p className="mt-2 text-sm text-[#6d7a72]">Hãy thử từ khóa ngắn hơn hoặc thay đổi bộ lọc.</p>
              <Button variant="outline" onClick={clearFilters} className="mt-5 rounded-full border-[#bdcac0]/60">Xóa bộ lọc</Button>
            </div>
          )}
        </main>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 bg-[#171d19]/40 p-4 backdrop-blur-sm lg:hidden">
          <button type="button" className="absolute inset-0" onClick={() => setFiltersOpen(false)} aria-label="Đóng bộ lọc" />
          <div className="reveal-scale relative ml-auto h-full max-w-sm overflow-y-auto rounded-2xl bg-[#f5fbf4] p-6 shadow-2xl">
            <button type="button" onClick={() => setFiltersOpen(false)} className="absolute right-4 top-4 rounded-full p-2 text-[#6d7a72] hover:bg-[#e4eae3]"><X className="h-5 w-5" /></button>
            <FilterPanel {...filterPanelProps} />
          </div>
        </div>
      )}
    </div>
  )
}
