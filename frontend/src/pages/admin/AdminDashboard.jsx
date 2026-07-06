import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  Files,
  HardDrive,
  MoreHorizontal,
  Sparkles,
  Search,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const fileStyles = {
  pdf: "bg-red-50 text-red-600 ring-red-100",
  docx: "bg-blue-50 text-blue-600 ring-blue-100",
  zip: "bg-amber-50 text-amber-600 ring-amber-100",
}

const activity = [
  { day: "T2", value: 42 },
  { day: "T3", value: 65 },
  { day: "T4", value: 48 },
  { day: "T5", value: 82 },
  { day: "T6", value: 61 },
  { day: "T7", value: 92 },
  { day: "CN", value: 73 },
]

export default function AdminDashboard() {
  const { documents, updateDocumentStatus, deleteDocument } = useAppContext()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [docToDelete, setDocToDelete] = useState(null)
  const [toastMessage, setToastMessage] = useState("")
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const pendingDocs = documents.filter((doc) => doc.status === "pending")
  const approvedDocs = documents.filter((doc) => doc.status === "approved")
  const totalDownloads = approvedDocs.reduce((acc, doc) => acc + doc.downloadCount, 0)
  const todayLabel = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date())

  const filteredDocs = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi")
    return documents.filter((doc) => {
      const matchesStatus = statusFilter === "all" || doc.status === statusFilter
      const matchesQuery =
        !normalizedQuery ||
        [doc.title, doc.uploader, doc.school, doc.department]
          .join(" ")
          .toLocaleLowerCase("vi")
          .includes(normalizedQuery)
      return matchesStatus && matchesQuery
    })
  }, [documents, query, statusFilter])

  const stats = [
    {
      title: "Tổng tài liệu",
      value: documents.length,
      detail: `${approvedDocs.length} tài liệu đã xuất bản`,
      change: "+12.5%",
      trend: "up",
      icon: Files,
      style: "bg-[#55c694]/20 text-[#006c49]",
      surface: "from-[#55c694]/10",
    },
    {
      title: "Chờ phê duyệt",
      value: pendingDocs.length,
      detail: "Cần được xử lý sớm",
      change: pendingDocs.length ? `${pendingDocs.length} mới` : "Đã xử lý",
      trend: pendingDocs.length ? "down" : "up",
      icon: Clock3,
      style: "bg-amber-100 text-amber-600",
      surface: "from-amber-50/80",
    },
    {
      title: "Tổng lượt tải",
      value: totalDownloads.toLocaleString("vi-VN"),
      detail: "Trong toàn hệ thống",
      change: "+18.2%",
      trend: "up",
      icon: Download,
      style: "bg-[#8ef3f2]/30 text-[#006a69]",
      surface: "from-[#8ef3f2]/10",
    },
    {
      title: "Dung lượng lưu trữ",
      value: "1.2 GB",
      detail: "Trên tổng dung lượng 5 GB",
      change: "24%",
      trend: "up",
      icon: HardDrive,
      style: "bg-[#86bcb7]/25 text-[#316763]",
      surface: "from-[#86bcb7]/10",
    },
  ]

  const showToast = (message) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(""), 3000)
  }

  const handleApprove = async (id) => {
    try {
      await updateDocumentStatus(id, "approved")
      showToast("Tài liệu đã được duyệt và xuất bản.")
    } catch (error) {
      showToast(error.message || "Duyệt tài liệu thất bại.")
    }
  }

  const confirmDelete = (doc) => {
    setDocToDelete(doc)
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setDocToDelete(null)
  }

  const handleDelete = async () => {
    try {
      await deleteDocument(docToDelete.id)
      closeDeleteModal()
      showToast("Đã xóa tài liệu khỏi hệ thống.")
    } catch (error) {
      showToast(error.message || "Xóa tài liệu thất bại.")
    }
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 pb-10">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#006c49]">
            <Sparkles className="h-3.5 w-3.5" /> Control center
          </span>
          <h1 className="mt-2 text-4xl font-bold tracking-[-0.03em] text-[#171d19]">Tổng quan hệ thống</h1>
          <p className="mt-2 text-sm text-[#6d7a72]">Theo dõi hiệu suất và quản lý tài liệu trên CloudDoc.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-500 shadow-sm sm:flex">
            <CalendarDays className="h-4 w-4 text-violet-500" />
            Hôm nay, {todayLabel}
          </span>
          <a href="#documents" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#006c49] px-4 text-xs font-bold text-white shadow-[0_4px_20px_rgba(19,78,74,0.15)] transition hover:bg-[#005c3f]">
            <FileCheck2 className="h-4 w-4" />
            Kiểm duyệt ngay
          </a>
        </div>
      </section>

      {pendingDocs.length > 0 && (
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#006c49] to-[#316763] px-5 py-4 text-white shadow-[0_12px_32px_rgba(19,78,74,0.15)]">
          <div className="absolute -right-8 -top-16 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
          <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
              <p className="text-sm font-bold">Bạn có {pendingDocs.length} tài liệu mới đang chờ duyệt</p>
              <p className="mt-1 text-xs text-white/70">Kiểm tra nội dung để duy trì chất lượng thư viện.</p>
          </div>
            <a href="#documents" className="w-fit rounded-xl border border-white/20 bg-white/15 px-4 py-2 text-xs font-bold backdrop-blur-sm transition hover:bg-white/25">Xem hàng chờ →</a>
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.title} className={`rounded-2xl border border-[#bdcac0]/45 bg-gradient-to-br ${stat.surface} to-white p-5 shadow-[0_4px_20px_rgba(19,78,74,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(85,198,148,0.12)]`}>
            <div className="flex items-start justify-between">
              <span className={`grid h-11 w-11 place-items-center rounded-xl ${stat.style}`}>
                <stat.icon className="h-5 w-5" />
              </span>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold ${
                stat.trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
              }`}>
                {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {stat.change}
              </span>
            </div>
            <p className="mt-5 text-sm font-medium text-slate-500">{stat.title}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-400">{stat.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <article className="overflow-hidden rounded-2xl bg-[#134e4a] p-5 text-white shadow-[0_12px_32px_rgba(19,78,74,0.18)] sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-bold text-white">Hoạt động tải xuống</h2>
              <p className="mt-1 text-xs text-slate-400">Thống kê trong 7 ngày gần nhất</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              +18.2%
            </span>
          </div>
          <div className="mt-7 flex h-44 items-end gap-3 sm:gap-5">
            {activity.map((item) => (
              <div key={item.day} className="group flex h-full flex-1 flex-col justify-end gap-2">
                <div className="relative flex flex-1 items-end overflow-hidden rounded-lg bg-white/[0.06]">
                  <div
                    className="w-full rounded-lg bg-gradient-to-t from-[#55c694] to-[#8ef3f2] transition-all duration-300"
                    style={{ height: `${item.value}%` }}
                  />
                </div>
                <span className="text-center text-[11px] font-medium text-slate-400">{item.day}</span>
              </div>
            ))}
          </div>
        </article>

        <article id="storage" className="scroll-mt-24 rounded-2xl border border-[#bdcac0]/45 bg-white p-5 shadow-[0_4px_20px_rgba(19,78,74,0.04)] sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Dung lượng lưu trữ</h2>
              <p className="mt-1 text-xs text-slate-400">Phân bổ theo định dạng tệp</p>
            </div>
            <button type="button" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-bold tracking-tight text-slate-900">1.2</span>
                <span className="ml-1 text-sm font-semibold text-slate-400">GB đã dùng</span>
              </div>
              <span className="text-xs font-bold text-[#006c49]">24%</span>
            </div>
            <Progress value={24} className="mt-4 h-2 bg-[#dee4de] [&>div]:bg-gradient-to-r [&>div]:from-[#006c49] [&>div]:to-[#55c694]" />
          </div>
          <div className="mt-5 space-y-3">
            {[
              { label: "PDF", value: "620 MB", color: "bg-red-500" },
              { label: "DOCX", value: "410 MB", color: "bg-blue-500" },
              { label: "ZIP & khác", value: "170 MB", color: "bg-amber-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center text-xs">
                <span className={`mr-2.5 h-2 w-2 rounded-full ${item.color}`} />
                <span className="font-medium text-slate-600">{item.label}</span>
                <span className="ml-auto font-semibold text-slate-400">{item.value}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section id="documents" className="scroll-mt-24 overflow-hidden rounded-2xl border border-[#bdcac0]/45 bg-white shadow-[0_4px_20px_rgba(19,78,74,0.04)]">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
            <div>
              <h2 className="font-bold text-slate-900">Quản lý tài liệu</h2>
              <p className="mt-1 text-xs text-slate-400">Tìm kiếm, phê duyệt và quản lý tài liệu trong hệ thống</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative min-w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Tìm tên tài liệu, người đăng..."
                    className="h-10 w-full rounded-full border border-[#bdcac0]/50 bg-[#f5fbf4] pl-9 pr-3 text-sm outline-none transition focus:border-[#55c694] focus:bg-white focus:ring-4 focus:ring-[#55c694]/10"
                />
              </label>
              <div className="flex rounded-xl bg-slate-100 p-1">
                {[
                  { value: "all", label: "Tất cả" },
                  { value: "pending", label: "Chờ duyệt" },
                  { value: "approved", label: "Đã duyệt" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setStatusFilter(item.value)}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      statusFilter === item.value ? "bg-white text-[#006c49] shadow-sm" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-3.5">Tài liệu</th>
                <th className="px-6 py-3.5">Phân loại</th>
                <th className="px-6 py-3.5">Người đăng</th>
                <th className="px-6 py-3.5">Trạng thái</th>
                <th className="px-6 py-3.5 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="group transition-colors hover:bg-[#55c694]/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[10px] font-extrabold uppercase ring-1 ${fileStyles[doc.fileType] || fileStyles.zip}`}>
                        {doc.fileType}
                      </span>
                      <div className="max-w-sm">
                        <p className="truncate font-semibold text-slate-800">{doc.title}</p>
                        <p className="mt-1 text-xs text-slate-400">{doc.fileSize} · {doc.uploadDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-700">{doc.subject}</p>
                    <p className="mt-1 text-xs text-slate-400">{doc.school} · {doc.department}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">{doc.uploader}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      doc.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${doc.status === "pending" ? "bg-amber-500" : "bg-emerald-500"}`} />
                      {doc.status === "pending" ? "Chờ duyệt" : "Đã duyệt"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {doc.status === "pending" && (
                        <Button size="sm" onClick={() => handleApprove(doc.id)} className="h-8 gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs shadow-none hover:bg-emerald-700">
                          <Check className="h-3.5 w-3.5" />
                          Duyệt
                        </Button>
                      )}
                      {doc.status === "approved" && (
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600">
                          <Link to={`/preview/${doc.id}`} title="Xem tài liệu"><Eye className="h-4 w-4" /></Link>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => confirmDelete(doc)} className="h-8 w-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600" title="Xóa tài liệu">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredDocs.length && (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <Search className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-3 font-semibold text-slate-600">Không tìm thấy tài liệu</p>
                    <p className="mt-1 text-xs text-slate-400">Thử thay đổi từ khóa hoặc bộ lọc trạng thái.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-xs text-slate-400">
          <span>Hiển thị {filteredDocs.length} trên {documents.length} tài liệu</span>
          <span>Dữ liệu được cập nhật tức thời</span>
        </div>
      </section>

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-600">
                <Trash2 className="h-5 w-5" />
              </span>
              <button type="button" onClick={closeDeleteModal} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <h3 className="mt-5 text-xl font-bold text-slate-900">Xóa tài liệu?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Tài liệu <span className="font-semibold text-slate-700">“{docToDelete?.title}”</span> sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={closeDeleteModal} className="rounded-xl">Hủy bỏ</Button>
              <Button variant="destructive" onClick={handleDelete} className="rounded-xl shadow-none">Xác nhận xóa</Button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-2xl bg-[#101c35] px-4 py-3.5 text-white shadow-2xl">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
