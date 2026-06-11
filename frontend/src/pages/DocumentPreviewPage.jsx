import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, BookOpen, Building2, Calendar, CheckCircle2, Download, Eye, FileText, Share2, User } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { Button } from "@/components/ui/button"

const fileStyles = {
  pdf: "bg-[#55c694]/20 text-[#006c49]",
  docx: "bg-[#8ef3f2]/30 text-[#006a69]",
  zip: "bg-[#86bcb7]/25 text-[#316763]",
}

export default function DocumentPreviewPage() {
  const { id } = useParams()
  const { documents } = useAppContext()
  const navigate = useNavigate()
  const document = documents.find((item) => item.id === id)
  const relatedDocs = document ? documents.filter((item) => item.subject === document.subject && item.id !== document.id && item.status === "approved").slice(0, 3) : []

  if (!document) {
    return <div className="grid min-h-[70vh] place-items-center bg-[#f5fbf4] text-center"><div><FileText className="mx-auto h-12 w-12 text-[#6d7a72]" /><h1 className="mt-4 text-xl font-semibold">Không tìm thấy tài liệu</h1><Button onClick={() => navigate("/search")} className="mt-5 rounded-full bg-[#006c49]">Về thư viện</Button></div></div>
  }

  const downloadDocument = () => {
    if (document.s3Url && document.s3Url !== "#") {
      const anchor = window.document.createElement("a")
      anchor.href = document.s3Url
      anchor.download = `${document.title}.${document.fileType}`
      anchor.click()
    } else window.alert("Tính năng tải xuống file Demo này hiện không khả dụng do không có link S3 thật!")
  }

  const shareDocument = async () => {
    await navigator.clipboard.writeText(window.location.href)
    window.alert("Đã sao chép liên kết chia sẻ!")
  }

  return (
    <div className="user-page-enter min-h-screen bg-[#f5fbf4] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <button type="button" onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#3e4a42] hover:text-[#006c49]"><ArrowLeft className="h-4 w-4" /> Quay lại kết quả tìm kiếm</button>

        <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_350px]">
          <main className="reveal-up overflow-hidden rounded-2xl border border-[#bdcac0]/45 bg-[#d6dcd5] shadow-[0_4px_20px_rgba(19,78,74,0.06)]">
            <div className="flex items-center justify-between border-b border-[#bdcac0]/50 bg-[#eff5ef] px-5 py-4 text-sm text-[#3e4a42]">
              <span className="flex min-w-0 items-center gap-2"><FileText className="h-5 w-5 shrink-0 text-[#006c49]" /><span className="truncate">{document.title}.{document.fileType}</span></span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold">{document.fileSize}</span>
            </div>
            <div className={`grid place-items-center p-5 ${document.s3Url !== "#" && document.fileType?.toLowerCase() === "pdf" ? "min-h-[620px] lg:min-h-[800px]" : "min-h-[520px]"}`}>
              {document.s3Url !== "#" && document.fileType?.toLowerCase() === "pdf" ? (
                <iframe src={document.s3Url} className="h-full min-h-[620px] w-full max-w-4xl border-0 bg-white shadow-lg lg:min-h-[800px]" title={document.title} />
              ) : (
                <div className="w-full max-w-xl rounded-2xl border border-[#bdcac0]/50 bg-white p-8 text-center shadow-lg">
                  <span className={`mx-auto grid h-20 w-20 place-items-center rounded-2xl text-xs font-bold uppercase ${fileStyles[document.fileType] || fileStyles.zip}`}>{document.fileType}</span>
                  <h2 className="mt-5 text-xl font-semibold">Chưa hỗ trợ xem trước định dạng {document.fileType?.toUpperCase()}</h2>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6d7a72]">Tài liệu đã sẵn sàng để tải xuống và mở bằng ứng dụng tương thích.</p>
                  <Button onClick={downloadDocument} className="mt-6 gap-2 rounded-full bg-[#006c49] px-6 shadow-none hover:bg-[#005c3f]"><Download className="h-4 w-4" /> Tải tài liệu</Button>
                </div>
              )}
            </div>
          </main>

          <aside style={{ "--delay": "100ms" }} className="reveal-up space-y-5 xl:sticky xl:top-24">
            <section className="overflow-hidden rounded-2xl border border-[#bdcac0]/45 bg-white shadow-[0_4px_20px_rgba(19,78,74,0.04)]">
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#55c694]/20 px-3 py-1.5 text-xs font-semibold text-[#005236]">{document.subject}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#eff5ef] px-3 py-1.5 text-xs font-semibold text-[#006c49]"><CheckCircle2 className="h-3 w-3" /> Đã kiểm duyệt</span>
                </div>
                <h1 className="mt-5 text-3xl font-bold leading-tight tracking-[-0.03em]">{document.title}</h1>
                <p className="mt-4 text-sm leading-6 text-[#3e4a42]">Tài liệu học tập thuộc môn {document.subject}, được chia sẻ cho cộng đồng sinh viên {document.school}.</p>
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#bdcac0]/30 pt-5">
                  <Meta icon={Building2} label="Trường" value={document.school} />
                  <Meta icon={BookOpen} label="Chuyên ngành" value={document.department} />
                  <Meta icon={User} label="Người đăng" value={document.uploader} />
                  <Meta icon={Calendar} label="Ngày đăng" value={document.uploadDate} />
                </div>
              </div>
              <div className="border-t border-[#bdcac0]/30 bg-[#f5fbf4] p-5">
                <Button onClick={downloadDocument} className="h-12 w-full gap-2 rounded-xl bg-[#006c49] shadow-none hover:bg-[#005c3f]"><Download className="h-4 w-4" /> Tải {document.fileType.toUpperCase()} ({document.fileSize})</Button>
                <Button variant="outline" onClick={shareDocument} className="mt-3 h-11 w-full gap-2 rounded-xl border-[#bdcac0]/60 bg-white text-[#006a69]"><Share2 className="h-4 w-4" /> Chia sẻ liên kết</Button>
                <p className="mt-3 flex items-center justify-center gap-1 text-xs text-[#6d7a72]"><Download className="h-3 w-3" /> {document.downloadCount} lượt tải xuống</p>
              </div>
            </section>

            {relatedDocs.length > 0 && (
              <section>
                <h2 className="mb-3 font-semibold">Tài liệu cùng môn học</h2>
                <div className="space-y-2">
                  {relatedDocs.map((related) => (
                    <Link to={`/preview/${related.id}`} key={related.id} className="group flex gap-3 rounded-xl border border-[#bdcac0]/40 bg-white p-3 hover:border-[#55c694]">
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[9px] font-bold uppercase ${fileStyles[related.fileType] || fileStyles.zip}`}>{related.fileType}</span>
                      <div className="min-w-0"><p className="line-clamp-2 text-xs font-semibold leading-5 group-hover:text-[#006c49]">{related.title}</p><p className="mt-1 flex items-center gap-1 text-[10px] text-[#6d7a72]"><Eye className="h-3 w-3" /> {related.downloadCount} lượt tải</p></div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}

function Meta({ icon: Icon, label, value }) {
  return <div className="min-w-0"><p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#6d7a72]"><Icon className="h-3 w-3 text-[#006c49]" /> {label}</p><p className="mt-1 truncate text-xs font-semibold" title={value}>{value}</p></div>
}
