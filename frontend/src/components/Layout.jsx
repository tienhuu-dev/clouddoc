import { useState } from "react"
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom"
import {
  Bell,
  ChevronDown,
  Cloud,
  FileText,
  GraduationCap,
  LogIn,
  LogOut,
  Menu,
  Search,
  Settings,
  Upload,
  User,
  X,
} from "lucide-react"
import { Button } from "./ui/button"
import { useAppContext } from "@/context/AppContext"

export default function Layout() {
  const { isLoggedIn, currentUser, notifications, login, logout, markNotificationsAsRead } = useAppContext()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const unreadCount = notifications.filter((notification) => !notification.read).length
  const initials = currentUser?.name
    ?.split(" ")
    .slice(-2)
    .map((word) => word[0])
    .join("")

  const handleLogout = () => {
    logout()
    setShowDropdown(false)
    setMobileMenuOpen(false)
    navigate("/")
  }

  const handleAdminLogin = () => {
    login("admin")
    setMobileMenuOpen(false)
    navigate("/admin")
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5fbf4] font-sans text-[#171d19]">
      <header className="sticky top-0 z-50 border-b border-[#bdcac0]/35 bg-[#f5fbf4]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-5 px-4 sm:px-6 lg:px-10">
          <Link to="/" className="flex shrink-0 items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#55c694] text-[#004f34]">
              <Cloud className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xl font-bold tracking-tight text-[#006c49]">CloudDoc</span>
              <span className="block text-[10px] font-semibold tracking-wide text-[#3e4a42]">Academic Hub</span>
            </span>
          </Link>

          <nav className="ml-5 hidden h-full items-center gap-2 lg:flex">
            <HeaderNavLink to="/" end>Trang chủ</HeaderNavLink>
            <HeaderNavLink to="/search">Khám phá tài liệu</HeaderNavLink>
            {isLoggedIn && <HeaderNavLink to="/upload">Đóng góp</HeaderNavLink>}
          </nav>

          <Link to="/search" className="ml-auto hidden h-10 w-64 items-center gap-2 rounded-full border border-[#bdcac0]/45 bg-[#eff5ef] px-4 text-sm text-[#6d7a72] transition hover:border-[#55c694] xl:flex">
            <Search className="h-4 w-4 text-[#006c49]" /> Tìm tài liệu...
          </Link>

          <div className="ml-auto hidden items-center gap-2 lg:flex xl:ml-0">
            {isLoggedIn ? (
              <>
                <Link to="/upload">
                  <Button className="h-10 gap-2 rounded-full bg-[#006c49] px-4 font-semibold text-white shadow-none hover:bg-[#005c3f]">
                    <Upload className="h-4 w-4" /> Tải tài liệu
                  </Button>
                </Link>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotifications(!showNotifications)
                      if (!showNotifications) markNotificationsAsRead()
                      setShowDropdown(false)
                    }}
                    className="relative rounded-full p-2.5 text-[#3e4a42] hover:bg-[#e4eae3]"
                    aria-label="Thông báo"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-[#bdcac0]/45 bg-white shadow-xl">
                      <div className="flex items-center justify-between border-b border-[#bdcac0]/30 px-4 py-3">
                        <p className="text-sm font-semibold">Thông báo</p>
                        <span className="rounded-full bg-[#55c694]/20 px-2 py-0.5 text-[10px] font-bold text-[#006c49]">{notifications.length}</span>
                      </div>
                      {notifications.length === 0 ? (
                        <p className="px-4 py-8 text-center text-sm text-[#6d7a72]">Chưa có thông báo mới.</p>
                      ) : notifications.map((notification) => (
                        <p key={notification.id} className="border-b border-[#bdcac0]/20 px-4 py-3 text-sm last:border-0">{notification.message}</p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDropdown(!showDropdown)
                      setShowNotifications(false)
                    }}
                    className="flex items-center gap-2 rounded-full p-1.5 pr-3 hover:bg-[#e4eae3]"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-[#006c49] to-[#55c694] text-xs font-bold text-white">{initials || "SV"}</span>
                    <span className="max-w-28 truncate text-xs font-semibold">{currentUser?.name}</span>
                    <ChevronDown className="h-4 w-4 text-[#6d7a72]" />
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-[#bdcac0]/45 bg-white p-2 shadow-xl">
                      <Link to="/profile" onClick={() => setShowDropdown(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[#3e4a42] hover:bg-[#eff5ef] hover:text-[#006c49]">
                        <User className="h-4 w-4" /> Hồ sơ cá nhân
                      </Link>
                      {currentUser?.role === "admin" && (
                        <Link to="/admin" onClick={() => setShowDropdown(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[#3e4a42] hover:bg-[#eff5ef] hover:text-[#006c49]">
                          <Settings className="h-4 w-4" /> Trang quản trị
                        </Link>
                      )}
                      <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
                        <LogOut className="h-4 w-4" /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => login("student")} className="h-10 gap-2 rounded-full text-[#3e4a42] hover:bg-[#e4eae3]">
                  <LogIn className="h-4 w-4" /> Đăng nhập
                </Button>
                <Button onClick={handleAdminLogin} className="h-10 gap-2 rounded-full bg-[#006c49] px-5 font-semibold shadow-none hover:bg-[#005c3f]">
                  <Settings className="h-4 w-4" /> Admin
                </Button>
              </>
            )}
          </div>

          <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="ml-auto rounded-full p-2.5 text-[#3e4a42] hover:bg-[#e4eae3] lg:hidden" aria-label="Mở menu">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[#bdcac0]/30 bg-[#f5fbf4] px-4 py-4 shadow-lg lg:hidden">
            <nav className="mx-auto max-w-[1440px] space-y-1">
              <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>Trang chủ</MobileNavLink>
              <MobileNavLink to="/search" onClick={() => setMobileMenuOpen(false)}>Khám phá tài liệu</MobileNavLink>
              {isLoggedIn && <MobileNavLink to="/upload" onClick={() => setMobileMenuOpen(false)}>Đóng góp tài liệu</MobileNavLink>}
              {isLoggedIn && <MobileNavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>Hồ sơ cá nhân</MobileNavLink>}
              {currentUser?.role === "admin" && <MobileNavLink to="/admin" onClick={() => setMobileMenuOpen(false)}>Trang quản trị</MobileNavLink>}
              <div className="my-3 h-px bg-[#bdcac0]/30" />
              {isLoggedIn ? (
                <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" /> Đăng xuất</button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => { login("student"); setMobileMenuOpen(false) }} className="rounded-full border border-[#bdcac0]/60 bg-white px-4 py-3 text-sm font-semibold text-[#3e4a42]">Sinh viên</button>
                  <button type="button" onClick={handleAdminLogin} className="rounded-full bg-[#006c49] px-4 py-3 text-sm font-semibold text-white">Admin</button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1"><Outlet /></main>

      <footer className="border-t border-[#bdcac0]/35 bg-[#eff5ef]">
        <div className="mx-auto grid max-w-[1440px] gap-9 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-10">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#55c694] text-[#004f34]"><Cloud className="h-5 w-5" /></span>
              <span>
                <span className="block text-xl font-bold tracking-tight text-[#006c49]">CloudDoc</span>
                <span className="text-xs font-medium text-[#6d7a72]">Academic Hub</span>
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#3e4a42]">
              Nền tảng chia sẻ và tìm kiếm tài liệu học tập dành cho cộng đồng sinh viên.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#006c49]">Khám phá</p>
            <div className="mt-4 space-y-3 text-sm text-[#3e4a42]">
              <Link to="/search" className="flex items-center gap-2 hover:text-[#006c49]"><Search className="h-4 w-4" /> Tìm tài liệu</Link>
              {isLoggedIn ? (
                <>
                  <Link to="/upload" className="flex items-center gap-2 hover:text-[#006c49]"><Upload className="h-4 w-4" /> Đóng góp tài liệu</Link>
                  <Link to="/profile" className="flex items-center gap-2 hover:text-[#006c49]"><User className="h-4 w-4" /> Hồ sơ cá nhân</Link>
                </>
              ) : (
                <button type="button" onClick={() => login("student")} className="flex items-center gap-2 hover:text-[#006c49]"><LogIn className="h-4 w-4" /> Đăng nhập sinh viên</button>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#006c49]">Nền tảng</p>
            <div className="mt-4 space-y-3 text-sm text-[#3e4a42]">
              <p className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Thư viện học thuật</p>
              <p className="flex items-center gap-2"><FileText className="h-4 w-4" /> Tài liệu được kiểm duyệt</p>
              <p>React · Tailwind CSS · AWS</p>
            </div>
          </div>
        </div>
        <div className="border-t border-[#bdcac0]/35 px-4 py-4 text-center text-xs text-[#6d7a72]">
          © {new Date().getFullYear()} CloudDoc Academic Hub. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

function HeaderNavLink({ to, end, children }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => `relative flex h-full items-center px-3 text-sm font-semibold transition-colors ${isActive ? "text-[#006c49]" : "text-[#3e4a42] hover:text-[#006c49]"}`}>
      {({ isActive }) => <>{children}{isActive && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#006c49]" />}</>}
    </NavLink>
  )
}

function MobileNavLink({ to, onClick, children }) {
  return <Link to={to} onClick={onClick} className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-[#3e4a42] hover:bg-[#e4eae3] hover:text-[#006c49]">{children}</Link>
}
