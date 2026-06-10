import { Link, Outlet, useLocation } from "react-router-dom"
import { LayoutDashboard, FileText, Settings, ArrowLeft, LogOut } from "lucide-react"

export default function AdminLayout() {
  const location = useLocation()

  const navigation = [
    { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
    { name: "Quản lý tài liệu", href: "/admin", icon: FileText }, // Currently using one dashboard page
    { name: "Cấu hình hệ thống", href: "#", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Cố định */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full shadow-xl z-20">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-primary">Admin</span>Panel
          </h2>
          <p className="text-sm text-slate-500 mt-1">CloudDoc HUTECH</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-primary text-white font-medium" 
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link 
            to="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Về Trang Sinh Viên
          </Link>
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
