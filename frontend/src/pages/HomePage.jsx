import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Archive, ArrowRight, ChevronDown, Download, FileText, Folder, MoreVertical, Search, SlidersHorizontal, Sparkles, Star, Upload, Users, X } from "lucide-react"
import { SCHOOL_DATA } from "@/services/mockData"
import { useAppContext } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const fileStyles = {
  pdf: "bg-[#55c694] text-[#004f34]",
  docx: "bg-[#8ef3f2] text-[#00504f]",
  zip: "bg-[#86bcb7] text-[#114d49]",
}

export default function HomePage() {
  const navigate = useNavigate()
  const { documents, isLoggedIn, login } = useAppContext()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSchool, setSelectedSchool] = useState("")
  const [selectedDept, setSelectedDept] = useState("")
  const [filtersOpen, setFiltersOpen] = useState(false)

  const schools = Object.keys(SCHOOL_DATA)
  const departments = selectedSchool ? Object.keys(SCHOOL_DATA[selectedSchool]) : []
  const approvedDocs = documents.filter((document) => document.status === "approved")
  const featuredDocs = approvedDocs.slice(0, 4)
  const totalDownloads = approvedDocs.reduce((sum, document) => sum + document.downloadCount, 0)

  const runSearch = (queryOverride = searchQuery) => {
    const params = new URLSearchParams()
    if (queryOverride) params.append("q", queryOverride)
    if (selectedSchool) params.append("school", selectedSchool)
    if (selectedDept) params.append("dept", selectedDept)
    navigate(`/search?${params.toString()}`)
  }

  const handleSearch = (event) => {
    event.preventDefault()
    runSearch()
  }

  const handleContribute = () => {
    if (!isLoggedIn) login("student")
    navigate("/upload")
  }

  return (
    <div className="user-page-enter relative min-h-screen overflow-hidden bg-[#f5fbf4] pb-16">
      <MobileHome documents={approvedDocs} navigate={navigate} />
      <div className="hidden lg:block">
      <div className="float-blob pointer-events-none absolute -top-48 left-1/2 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-[#88f8c2]/30 blur-[120px]" />
      <div className="float-blob-slow pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-[#b5ede7]/40 blur-[100px]" />

      <section className="relative px-4 pb-8 pt-12 sm:px-6 lg:px-10 lg:pb-10 lg:pt-16">
        <div className="reveal-up mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#bdcac0]/70 bg-white/60 px-4 py-2 text-xs font-semibold text-[#006c49] backdrop-blur-xl">
            <Sparkles className="h-4 w-4" /> Tìm kiếm nội dung tài liệu thông minh
          </div>
          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-[#171d19] sm:text-6xl">
            Tìm kiếm tài liệu học tập thông minh
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-[#3e4a42] sm:text-lg">
            Tìm kiếm nội dung bên trong PDF, Word và Slide chỉ trong vài mili giây. Tối ưu thời gian nghiên cứu cho sinh viên và giảng viên.
          </p>

          <form onSubmit={handleSearch} className="mx-auto mt-9 flex max-w-4xl items-center gap-3 rounded-2xl border border-[#bdcac0]/50 bg-white p-2 shadow-[0_12px_32px_rgba(19,78,74,0.12)] transition focus-within:border-[#55c694] focus-within:shadow-[0_12px_36px_rgba(85,198,148,0.22)] sm:rounded-full">
            <Search className="ml-3 h-6 w-6 shrink-0 text-[#006c49]" />
            <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Nhập từ khóa, tên môn học, hoặc nội dung cần tìm..." className="h-12 flex-1 border-0 bg-transparent px-1 text-base shadow-none focus-visible:ring-0" />
            <Button type="submit" className="h-12 shrink-0 rounded-xl bg-[#006c49] px-6 font-semibold text-white shadow-none hover:bg-[#005c3f] sm:rounded-full">
              <Search className="mr-2 h-4 w-4 sm:hidden" /> <span className="hidden sm:inline">Tìm kiếm</span>
            </Button>
          </form>

          <div className="mx-auto mt-3 max-w-4xl text-left">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button type="button" onClick={() => setFiltersOpen(!filtersOpen)} className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition ${filtersOpen ? "bg-[#006c49] text-white" : "border border-[#bdcac0]/50 bg-white/60 text-[#006c49] hover:bg-white"}`}>
                <SlidersHorizontal className="h-3.5 w-3.5" /> Lọc nâng cao
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
              </button>
              {selectedSchool && <span className="rounded-full bg-[#55c694]/20 px-3 py-2 text-xs font-semibold text-[#005236]">{selectedSchool}</span>}
              {selectedDept && <span className="rounded-full bg-[#8ef3f2]/30 px-3 py-2 text-xs font-semibold text-[#00504f]">{selectedDept}</span>}
              {(selectedSchool || selectedDept) && <button type="button" onClick={() => { setSelectedSchool(""); setSelectedDept("") }} className="grid h-8 w-8 place-items-center rounded-full text-[#6d7a72] hover:bg-white hover:text-red-600" aria-label="Xóa bộ lọc"><X className="h-3.5 w-3.5" /></button>}
            </div>

            {filtersOpen && (
              <form onSubmit={handleSearch} className="reveal-scale mt-3 grid gap-3 rounded-2xl border border-[#bdcac0]/40 bg-white/75 p-3 shadow-[0_8px_24px_rgba(19,78,74,0.08)] backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
                <select value={selectedSchool} onChange={(event) => { setSelectedSchool(event.target.value); setSelectedDept("") }} className="h-11 rounded-xl border border-[#bdcac0]/60 bg-white px-4 text-sm text-[#3e4a42] outline-none focus:border-[#006c49]">
                  <option value="">Tất cả trường đại học</option>
                  {schools.map((school) => <option key={school} value={school}>{school}</option>)}
                </select>
                <select value={selectedDept} onChange={(event) => setSelectedDept(event.target.value)} disabled={!selectedSchool} className="h-11 rounded-xl border border-[#bdcac0]/60 bg-white px-4 text-sm text-[#3e4a42] outline-none focus:border-[#006c49] disabled:bg-[#eff5ef]">
                  <option value="">Khoa / Chuyên ngành</option>
                  {departments.map((department) => <option key={department} value={department}>{department}</option>)}
                </select>
                <Button type="submit" className="h-11 rounded-xl bg-[#006c49] px-6 font-semibold text-white shadow-none hover:bg-[#005c3f] sm:col-span-2 lg:col-span-1">Áp dụng</Button>
              </form>
            )}
          </div>

          <div className="mx-auto mt-6 grid max-w-3xl overflow-hidden rounded-2xl border border-[#bdcac0]/35 bg-white/50 backdrop-blur-sm sm:grid-cols-3">
            <StatCard icon={FileText} value={`${approvedDocs.length}+`} label="Tài liệu chia sẻ" tone="bg-[#55c694]/20 text-[#006c49]" />
            <StatCard icon={Download} value={`${totalDownloads}+`} label="Lượt tải xuống" tone="bg-[#8ef3f2]/35 text-[#006a69]" />
            <StatCard icon={Users} value="8.2K" label="Người dùng active" tone="bg-[#86bcb7]/25 text-[#316763]" />
          </div>
        </div>
      </section>

      <main className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#171d19]">Tài liệu nổi bật</h2>
              <p className="mt-1 text-sm text-[#6d7a72]">Các tài liệu được cộng đồng quan tâm nhiều nhất.</p>
            </div>
            <Link to="/search" className="hidden items-center gap-2 text-sm font-semibold text-[#006c49] hover:gap-3 sm:flex">Xem tất cả <ArrowRight className="h-4 w-4" /></Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {featuredDocs.map((document, index) => (
              <article key={document.id} style={{ "--delay": `${index * 80}ms` }} className="interactive-card reveal-up group flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-[#bdcac0]/45 bg-white shadow-[0_4px_20px_rgba(19,78,74,0.04)]">
                <Link to={`/preview/${document.id}`} className={`grid h-48 shrink-0 place-items-center ${index === 1 ? "bg-[#8ef3f2]/20" : index === 2 ? "bg-[#86bcb7]/25" : "bg-[#55c694]/20"}`}>
                  <span className="grid h-20 w-20 place-items-center rounded-2xl border border-white/70 bg-white/45 text-[#006c49] backdrop-blur-sm transition-transform group-hover:scale-105">
                    <FileText className="h-9 w-9" />
                  </span>
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex gap-2">
                    <span className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase ${fileStyles[document.fileType] || fileStyles.zip}`}>{document.subject}</span>
                    <span className="rounded-md bg-[#eaefe9] px-2.5 py-1 text-[10px] font-bold uppercase text-[#3e4a42]">{document.fileType}</span>
                  </div>
                  <Link to={`/preview/${document.id}`} className="mt-4 line-clamp-3 block min-h-[72px] text-base font-semibold leading-6 text-[#171d19] group-hover:text-[#006c49]">{document.title}</Link>
                  <p className="mt-2 truncate text-xs text-[#6d7a72]">{document.uploader} · {document.school}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-[#bdcac0]/25 pt-4 text-[11px] text-[#6d7a72]">
                    <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5" /> {document.downloadCount} lượt tải</span>
                    <span>{document.uploadDate}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="reveal-up mt-12 flex flex-col justify-between gap-5 rounded-3xl bg-gradient-to-r from-[#006c49] to-[#316763] p-7 text-white shadow-[0_12px_32px_rgba(19,78,74,0.18)] sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">Bạn có tài liệu hữu ích?</h2>
            <p className="mt-1 text-sm text-white/70">Chia sẻ kiến thức và cùng xây dựng kho học liệu cho cộng đồng.</p>
          </div>
          <Button onClick={handleContribute} className="h-11 gap-2 rounded-full bg-white px-5 font-semibold text-[#006c49] shadow-none hover:bg-[#f5fbf4]"><Upload className="h-4 w-4" /> {isLoggedIn ? "Đóng góp tài liệu" : "Đăng nhập để đóng góp"}</Button>
        </section>
      </main>
      </div>
    </div>
  )
}

function MobileHome({ documents, navigate }) {
  const recentDocs = documents.slice(0, 5)
  const folders = [
    { label: "HUTECH", icon: Folder, query: "HUTECH" },
    { label: "CNTT", icon: Folder, query: "CNTT" },
    { label: "Được tải nhiều", icon: Star, query: "" },
    { label: "Đã lưu", icon: Archive, query: "" },
  ]

  return (
    <div className="space-y-9 px-4 py-7 lg:hidden">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-sm font-bold uppercase tracking-[0.12em] text-[#3e4a42]">Gần đây</h1>
          <Link to="/search" className="text-xs font-semibold text-[#006c49]">Xem tất cả</Link>
        </div>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {recentDocs.map((document, index) => (
            <Link key={document.id} to={`/preview/${document.id}`} style={{ "--delay": `${index * 70}ms` }} className="reveal-up w-40 shrink-0 rounded-2xl border border-[#bdcac0]/35 bg-white p-2.5 shadow-[0_4px_12px_rgba(19,78,74,0.06)]">
              <span className={`grid h-32 place-items-center rounded-xl ${index % 3 === 1 ? "bg-[#8ef3f2]/20" : index % 3 === 2 ? "bg-[#55c694]/20" : "bg-[#dee4de]"}`}>
                <FileText className="h-8 w-8 text-[#006a69]" />
              </span>
              <p className="mt-3 truncate text-sm font-semibold">{document.title}</p>
              <p className="mt-1 text-xs text-[#6d7a72]">{document.subject}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-[#3e4a42]">Thư mục</h2>
        <div className="grid grid-cols-2 gap-3">
          {folders.map(({ label, icon: Icon, query }) => (
            <button key={label} type="button" onClick={() => navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search")} className="interactive-card flex min-h-20 items-center gap-3 rounded-2xl border border-[#bdcac0]/35 bg-white px-4 text-left shadow-[0_4px_12px_rgba(19,78,74,0.05)]">
              <Icon className="h-6 w-6 shrink-0 text-[#006c49]" />
              <span className="text-sm font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-[#3e4a42]">Tất cả tài liệu</h2>
        <div className="space-y-3">
          {documents.map((document, index) => (
            <article key={document.id} style={{ "--delay": `${index * 60}ms` }} className="reveal-up flex items-center gap-3 rounded-2xl border border-[#bdcac0]/35 bg-white p-3 shadow-[0_4px_12px_rgba(19,78,74,0.05)]">
              <Link to={`/preview/${document.id}`} className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-[#dee4de] text-[#006c49]">
                <FileText className="h-6 w-6" />
              </Link>
              <Link to={`/preview/${document.id}`} className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{document.title}</p>
                <p className="mt-1 text-xs text-[#6d7a72]">{document.fileSize} · {document.uploadDate}</p>
              </Link>
              <button type="button" className="rounded-full p-2 text-[#6d7a72]" aria-label="Tùy chọn"><MoreVertical className="h-5 w-5" /></button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function StatCard({ icon: Icon, value, label, tone }) {
  return (
    <div className="flex items-center justify-center gap-3 border-b border-[#bdcac0]/30 px-4 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${tone}`}><Icon className="h-4 w-4" /></span>
      <span className="text-left"><strong className="block text-2xl font-bold tracking-tight text-[#171d19]">{value}</strong><span className="text-[11px] font-medium text-[#3e4a42]">{label}</span></span>
    </div>
  )
}
