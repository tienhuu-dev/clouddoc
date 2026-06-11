import { useState } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Cloud,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react"
import { useAppContext } from "@/context/AppContext"

const navigation = [
  { name: "Tổng quan", href: "/admin", hash: "", icon: LayoutDashboard },
  { name: "Quản lý tài liệu", href: "/admin#documents", hash: "#documents", icon: FileText },
  { name: "Quản lý lưu trữ", href: "/admin#storage", hash: "#storage", icon: Settings },
]

function SidebarContent({ location, logout, onClose }) {
  return (
    <>
      <div className="flex h-20 items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-3" onClick={onClose}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#55c694] text-[#004f34]">
            <Cloud className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-extrabold tracking-tight text-[#006c49]">CloudDoc</span>
            <span className="block text-[9px] font-bold uppercase tracking-[0.22em] text-[#006a69]">
              Control center
            </span>
          </span>
        </Link>
        <button
          type="button"
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
          onClick={onClose}
          aria-label="Đóng menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-4 mt-3 rounded-2xl border border-[#55c694]/30 bg-[#55c694]/10 p-3.5">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-bold text-emerald-900">Hệ thống ổn định</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[10px] font-medium text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Tất cả dịch vụ trực tuyến
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Không gian quản trị</p>
        {navigation.map((item) => {
          const isActive = location.pathname === "/admin" && location.hash === item.hash
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[#55c694] text-[#004f34]"
                  : "text-[#3e4a42] hover:bg-[#e4eae3] hover:text-[#171d19]"
              }`}
            >
              <item.icon className="h-[18px] w-[18px]" />
              <span className="flex-1">{item.name}</span>
              <ChevronRight className={`h-4 w-4 transition-transform ${isActive ? "opacity-70" : "opacity-0 group-hover:opacity-50"}`} />
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <Link
          to="/"
          className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="h-[18px] w-[18px]" />
          Về trang sinh viên
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Đăng xuất
        </button>
      </div>
    </>
  )
}

export default function AdminLayout() {
  const location = useLocation()
  const { currentUser, logout } = useAppContext()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const initials = currentUser?.name
    ?.split(" ")
    .slice(-2)
    .map((word) => word[0])
    .join("")

  return (
    <div className="min-h-screen bg-[#f5fbf4] text-[#171d19]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[#bdcac0]/30 bg-[#f5fbf4] lg:flex">
        <SidebarContent location={location} logout={logout} onClose={() => setSidebarOpen(false)} />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-label="Đóng menu"
          />
          <aside className="relative flex h-full w-[min(17rem,85vw)] flex-col bg-white shadow-2xl">
            <SidebarContent location={location} logout={logout} onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[#bdcac0]/30 bg-[#f5fbf4]/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Mở menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden md:block">
              <label className="relative block w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input placeholder="Tìm kiếm nhanh..." className="h-10 w-full rounded-full border border-[#bdcac0]/50 bg-white pl-9 pr-12 text-sm outline-none transition focus:border-[#55c694] focus:ring-4 focus:ring-[#55c694]/10" />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold text-slate-400">⌘ K</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button type="button" className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition-colors hover:border-violet-200 hover:text-violet-600">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
            </button>
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#006c49] to-[#55c694] text-sm font-bold text-white">
                {initials || "AD"}
              </span>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">{currentUser?.name || "Quản trị viên"}</p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
