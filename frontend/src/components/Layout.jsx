import { Link, Outlet } from "react-router-dom"
import { Cloud, Upload, UserCircle, Settings } from "lucide-react"
import { Button } from "./ui/button"
import { useAppContext } from "@/context/AppContext"

export default function Layout() {
  const { currentUser, toggleRole } = useAppContext()

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-primary hover:opacity-90 transition-opacity">
            <Cloud className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight text-slate-800">
              CloudDoc <span className="text-primary">HUTECH</span>
            </span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              Trang chủ
            </Link>
            
            {/* Mock Login Switcher */}
            <div className="flex items-center gap-3 border-l pl-6 ml-2 border-slate-200">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-700">{currentUser.name}</p>
                <button onClick={toggleRole} className="text-[10px] text-blue-500 hover:underline">
                  [Đổi quyền: {currentUser.role === 'admin' ? 'Admin' : 'Student'}]
                </button>
              </div>
              <UserCircle className="h-8 w-8 text-slate-400" />
            </div>

            <Link to="/upload">
              <Button className="gap-2 shadow-sm">
                <Upload className="h-4 w-4" />
                Đóng góp tài liệu
              </Button>
            </Link>

            {currentUser.role === 'admin' && (
              <Link to="/admin">
                <Button variant="outline" className="gap-2 shadow-sm">
                  <Settings className="h-4 w-4" />
                  Admin
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-slate-50 py-8 text-center text-slate-500">
        <div className="container mx-auto px-4">
          <p className="font-medium text-slate-600 mb-2">CloudDoc HUTECH - Nền tảng chia sẻ tài liệu sinh viên</p>
          <p className="text-sm">Đồ án môn học • Công nghệ sử dụng: React, Tailwind CSS, AWS (S3), OpenSearch</p>
          <p className="text-sm mt-4">&copy; {new Date().getFullYear()} Nhóm sinh viên thực hiện. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
