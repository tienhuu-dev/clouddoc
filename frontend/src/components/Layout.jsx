import { useState } from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { Cloud, Upload, UserCircle, Settings, LogIn, LogOut, ChevronDown, User } from "lucide-react"
import { Button } from "./ui/button"
import { useAppContext } from "@/context/AppContext"

export default function Layout() {
  const { isLoggedIn, currentUser, login, logout } = useAppContext()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    logout()
    setShowDropdown(false)
    navigate('/')
  }

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

          <nav className="flex items-center space-x-4">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              Trang chủ
            </Link>
            
            {/* Conditional Auth UI */}
            {isLoggedIn ? (
              <>
                <Link to="/upload">
                  <Button className="gap-2 shadow-sm">
                    <Upload className="h-4 w-4" />
                    Đóng góp tài liệu
                  </Button>
                </Link>

                {currentUser?.role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="outline" className="gap-2 shadow-sm text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                      <Settings className="h-4 w-4" />
                      Admin
                    </Button>
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="relative border-l pl-4 ml-2 border-slate-200">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 text-left hover:bg-slate-50 p-1.5 rounded-lg transition-colors"
                  >
                    <UserCircle className="h-8 w-8 text-slate-400" />
                    <div className="hidden md:block">
                      <p className="text-sm font-bold text-slate-700 leading-tight">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-500 capitalize">{currentUser.role}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-100 mb-2 md:hidden">
                        <p className="text-sm font-bold text-slate-700 truncate">{currentUser.name}</p>
                        <p className="text-[10px] text-slate-500">{currentUser.email}</p>
                      </div>
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <User className="h-4 w-4" /> Quản lý cá nhân
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 border-l pl-4 ml-2 border-slate-200">
                <Button variant="ghost" onClick={() => login("student")} className="text-slate-600 hover:text-primary gap-2">
                  <LogIn className="h-4 w-4" />
                  Đăng nhập (SV)
                </Button>
                <Button variant="outline" onClick={() => login("admin")} className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 gap-2">
                  <Settings className="h-4 w-4" />
                  Đăng nhập (Admin)
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-slate-50 py-8 text-center text-slate-500 mt-auto">
        <div className="container mx-auto px-4">
          <p className="font-medium text-slate-600 mb-2">CloudDoc HUTECH - Nền tảng chia sẻ tài liệu sinh viên</p>
          <p className="text-sm">Đồ án môn học • Công nghệ sử dụng: React, Tailwind CSS, AWS (S3), OpenSearch</p>
          <p className="text-sm mt-4">&copy; {new Date().getFullYear()} Nhóm sinh viên thực hiện. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
