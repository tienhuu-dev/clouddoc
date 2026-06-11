import { useState } from "react"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  GraduationCap,
  Mail,
  Pencil,
  Save,
  School,
  Sparkles,
  Upload,
  User,
} from "lucide-react"
import { Link } from "react-router-dom"
import { useAppContext } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const cardClass = "rounded-2xl border border-[#bdcac0]/50 bg-white shadow-[0_4px_20px_rgba(19,78,74,0.04)]"
const inputClass = "h-12 rounded-xl border-[#bdcac0]/60 bg-white shadow-none focus-visible:ring-[#55c694]/30 disabled:border-transparent disabled:bg-[#eff5ef] disabled:text-[#3e4a42]"

export default function UserProfilePage() {
  const { currentUser, documents, updateUserProfile } = useAppContext()
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    school: currentUser?.school || "",
    department: currentUser?.department || "",
  })

  const myDocuments = currentUser?.name ? documents.filter((doc) => doc.uploader?.startsWith(currentUser.name)) : []
  const approvedDocuments = myDocuments.filter((doc) => doc.status === "approved")
  const totalDownloads = approvedDocuments.reduce((total, doc) => total + (doc.downloadCount || 0), 0)
  const initials = currentUser?.name
    ?.split(" ")
    .slice(-2)
    .map((word) => word[0])
    .join("")

  const handleSaveProfile = (event) => {
    event.preventDefault()
    updateUserProfile(formData)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
      school: currentUser.school,
      department: currentUser.department,
    })
  }

  if (!currentUser) return null

  const stats = [
    { label: "Tài liệu đã đăng", value: myDocuments.length, icon: FileText, color: "bg-[#006c49]/10 text-[#006c49]" },
    { label: "Đã xuất bản", value: approvedDocuments.length, icon: CheckCircle2, color: "bg-[#006a69]/10 text-[#006a69]" },
    { label: "Lượt tải xuống", value: totalDownloads, icon: Download, color: "bg-[#316763]/10 text-[#316763]" },
  ]

  return (
    <div className="user-page-enter relative min-h-full overflow-hidden bg-[#f5fbf4] pb-16 text-[#171d19]">
      <div className="float-blob pointer-events-none absolute -right-32 -top-40 h-[520px] w-[520px] rounded-full bg-[#b5ede7]/40 blur-[110px]" />
      <div className="float-blob-slow pointer-events-none absolute -left-40 top-[520px] h-96 w-96 rounded-full bg-[#88f8c2]/20 blur-[100px]" />

      <div className="page-shell relative pt-10 sm:pt-14">
        <header className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#bdcac0]/70 bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#006c49] backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5" /> Không gian học thuật của bạn
            </div>
            <h1 className="text-4xl font-bold tracking-[-0.03em] text-[#171d19] sm:text-5xl">Hồ sơ cá nhân</h1>
            <p className="mt-2 text-sm text-[#3e4a42] sm:text-base">Quản lý thông tin và theo dõi đóng góp của bạn trên CloudDoc.</p>
          </div>
          <Link to="/upload">
            <Button className="h-11 gap-2 rounded-full bg-[#006c49] px-5 font-semibold text-white shadow-[0_4px_20px_rgba(19,78,74,0.15)] hover:-translate-y-0.5 hover:bg-[#005c3f]">
              <Upload className="h-4 w-4" /> Tài liệu mới
            </Button>
          </Link>
        </header>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className={`${cardClass} reveal-up h-fit overflow-hidden lg:sticky lg:top-24`}>
            <div className="h-24 bg-gradient-to-br from-[#55c694] to-[#86bcb7]" />
            <div className="px-5 pb-5">
              <div className="-mt-11 grid h-20 w-20 place-items-center rounded-full border-4 border-white bg-[#006c49] text-xl font-bold text-white shadow-lg">
                {initials || <User className="h-8 w-8" />}
              </div>
              <h2 className="mt-4 text-xl font-bold tracking-tight">{currentUser.name}</h2>
              <p className="mt-1 truncate text-sm text-[#6d7a72]">{currentUser.email}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#55c694]/20 px-2.5 py-1 text-[11px] font-bold text-[#004f34]">
                  {currentUser.role === "admin" ? "Quản trị viên" : "Sinh viên"}
                </span>
                <span className="rounded-full bg-[#eaefe9] px-2.5 py-1 text-[11px] font-semibold text-[#3e4a42]">{currentUser.school}</span>
              </div>
              <div className="mt-5 border-t border-[#bdcac0]/30 pt-4">
                <p className="flex items-center gap-2 text-sm text-[#3e4a42]"><GraduationCap className="h-4 w-4 text-[#006c49]" /> {currentUser.department}</p>
                <p className="mt-3 flex items-center gap-2 text-sm text-[#3e4a42]"><CheckCircle2 className="h-4 w-4 text-[#006c49]" /> Tài khoản đã xác thực</p>
              </div>
            </div>
          </aside>

          <main className="min-w-0">
            <section className="mb-6 grid gap-4 sm:grid-cols-3">
              {stats.map(({ label, value, icon: Icon, color }, index) => (
                <article key={label} style={{ "--delay": `${index * 80}ms` }} className={`${cardClass} interactive-card reveal-up group p-5`}>
                  <div className={`grid h-11 w-11 place-items-center rounded-xl ${color} transition-transform group-hover:scale-110`}><Icon className="h-5 w-5" /></div>
                  <p className="mt-5 text-sm font-medium text-[#3e4a42]">{label}</p>
                  <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
                </article>
              ))}
            </section>

            <div className="mb-5 flex w-full gap-1 rounded-full border border-[#bdcac0]/40 bg-[#eaefe9] p-1 sm:w-fit">
              <TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")} icon={User}>Thông tin cá nhân</TabButton>
              <TabButton active={activeTab === "documents"} onClick={() => setActiveTab("documents")} icon={FileText}>
                Tài liệu của tôi <span className="ml-1 rounded-full bg-current/10 px-2 py-0.5 text-[10px]">{myDocuments.length}</span>
              </TabButton>
            </div>

            {activeTab === "profile" ? (
              <section className={`${cardClass} overflow-hidden`}>
                <div className="flex flex-col justify-between gap-4 border-b border-[#bdcac0]/30 px-6 py-5 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">Thông tin cá nhân</h2>
                    <p className="mt-1 text-sm text-[#6d7a72]">Thông tin hiển thị cùng các tài liệu bạn đóng góp.</p>
                  </div>
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2 rounded-full border-[#bdcac0]/70 text-[#006a69] hover:bg-[#eff5ef]">
                      <Pencil className="h-3.5 w-3.5" /> Chỉnh sửa
                    </Button>
                  )}
                </div>

                <form onSubmit={handleSaveProfile} className="p-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <ProfileField label="Họ và tên" icon={User}>
                      <Input required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} disabled={!isEditing} className={inputClass} />
                    </ProfileField>
                    <ProfileField label="Email sinh viên" icon={Mail}>
                      <Input required type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} disabled={!isEditing} className={inputClass} />
                    </ProfileField>
                    <ProfileField label="Trường đại học" icon={School}>
                      <Input required value={formData.school} onChange={(event) => setFormData({ ...formData, school: event.target.value })} disabled={!isEditing} className={inputClass} />
                    </ProfileField>
                    <ProfileField label="Chuyên ngành" icon={BookOpen}>
                      <Input required value={formData.department} onChange={(event) => setFormData({ ...formData, department: event.target.value })} disabled={!isEditing} className={inputClass} />
                    </ProfileField>
                  </div>
                  {isEditing && (
                    <div className="mt-6 flex justify-end gap-2 border-t border-[#bdcac0]/30 pt-5">
                      <Button type="button" variant="ghost" onClick={handleCancelEdit} className="rounded-full">Hủy bỏ</Button>
                      <Button type="submit" className="gap-2 rounded-full bg-[#006c49] px-5 shadow-none hover:bg-[#005c3f]"><Save className="h-4 w-4" /> Lưu thay đổi</Button>
                    </div>
                  )}
                </form>
              </section>
            ) : (
              <section className={`${cardClass} overflow-hidden`}>
                <div className="border-b border-[#bdcac0]/30 px-6 py-5">
                  <h2 className="text-xl font-semibold tracking-tight">Tài liệu đã đóng góp</h2>
                  <p className="mt-1 text-sm text-[#6d7a72]">Theo dõi trạng thái kiểm duyệt và lượt tải xuống.</p>
                </div>
                {myDocuments.length === 0 ? (
                  <div className="px-6 py-16 text-center">
                    <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#55c694]/15 text-[#006c49]"><FileText className="h-7 w-7" /></span>
                    <p className="mt-4 font-semibold">Chưa có tài liệu nào</p>
                    <p className="mt-1 text-sm text-[#6d7a72]">Tài liệu đầu tiên của bạn sẽ xuất hiện tại đây.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#bdcac0]/25">
                    {myDocuments.map((doc) => (
                      <article key={doc.id} className="group flex flex-col gap-4 px-6 py-5 transition-colors hover:bg-[#f5fbf4] sm:flex-row sm:items-center">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#006c49]/10 text-[10px] font-bold uppercase text-[#006c49]">{doc.fileType}</span>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold group-hover:text-[#006c49]">{doc.title}</h3>
                          <p className="mt-1.5 text-xs text-[#6d7a72]">{doc.subject} · {doc.fileSize} · {doc.uploadDate}</p>
                        </div>
                        <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
                          {doc.status === "pending" ? (
                            <StatusBadge className="bg-amber-50 text-amber-700" icon={Clock3}>Đang chờ duyệt</StatusBadge>
                          ) : (
                            <StatusBadge className="bg-[#55c694]/15 text-[#005236]" icon={CheckCircle2}>Đã xuất bản</StatusBadge>
                          )}
                          {doc.status === "approved" && <p className="mt-2 flex items-center justify-end gap-1 text-[11px] font-medium text-[#6d7a72]"><Download className="h-3 w-3" /> {doc.downloadCount} lượt tải</p>}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            <section className="mt-6 flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#006c49] to-[#316763] p-6 text-white shadow-[0_12px_32px_rgba(19,78,74,0.15)] sm:flex-row sm:items-center">
              <div>
                <p className="text-lg font-semibold">Cùng xây dựng thư viện học thuật</p>
                <p className="mt-1 text-sm text-white/70">Mỗi tài liệu được duyệt đều giúp cộng đồng học tập hiệu quả hơn.</p>
              </div>
              <Link to="/upload" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold hover:gap-3">
                Chia sẻ tài liệu <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, icon: Icon, children }) {
  return (
    <button type="button" onClick={onClick} className={`flex min-w-max flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all sm:flex-none ${active ? "bg-white text-[#006c49] shadow-sm" : "text-[#3e4a42] hover:bg-white/50"}`}>
      <Icon className="h-4 w-4" /> {children}
    </button>
  )
}

function ProfileField({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#3e4a42]"><Icon className="h-3.5 w-3.5 text-[#006c49]" /> {label}</span>
      {children}
    </label>
  )
}

function StatusBadge({ className, icon: Icon, children }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${className}`}><Icon className="h-3 w-3" /> {children}</span>
}
