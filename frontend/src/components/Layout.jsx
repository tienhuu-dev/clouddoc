import { Link, Outlet } from "react-router-dom"
import { Cloud, Upload } from "lucide-react"
import { Button } from "./ui/button"

export default function Layout() {
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
            <Link to="/upload">
              <Button className="gap-2 shadow-sm">
                <Upload className="h-4 w-4" />
                Đóng góp tài liệu
              </Button>
            </Link>
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
