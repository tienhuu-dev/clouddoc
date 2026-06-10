import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Download, Share2, Info, FileText, ChevronLeft, Calendar, User } from "lucide-react"
import { MOCK_DOCUMENTS } from "@/services/mockData"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DocumentPreviewPage() {
  const { id } = useParams()
  const [document, setDocument] = useState(null)
  const [relatedDocs, setRelatedDocs] = useState([])

  useEffect(() => {
    // Mock API Fetch
    const doc = MOCK_DOCUMENTS.find(d => d.id === id)
    setDocument(doc)

    if (doc) {
      const related = MOCK_DOCUMENTS.filter(
        d => d.subject === doc.subject && d.id !== doc.id
      ).slice(0, 3)
      setRelatedDocs(related)
    }
  }, [id])

  if (!document) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const getBadgeVariant = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case 'pdf': return 'pdf'
      case 'docx': return 'docx'
      case 'zip': return 'zip'
      default: return 'secondary'
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Breadcrumb / Back Button */}
      <div className="mb-6">
        <Link to={-1} className="inline-flex items-center text-sm text-slate-500 hover:text-primary transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" /> Quay lại danh sách
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
        
        {/* Left Column - PDF Viewer (3/4 on large screens) */}
        <div className="w-full lg:w-3/4 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative border border-slate-200">
          <div className="bg-slate-800 text-slate-300 py-3 px-4 flex justify-between items-center text-sm border-b border-slate-700">
            <span className="truncate max-w-xl font-medium">{document.title}.{document.fileType}</span>
            <div className="flex items-center gap-4">
              <span>Trang 1 / 15</span>
              <span>100%</span>
            </div>
          </div>
          <div className="flex-1 w-full h-full bg-slate-100 flex items-center justify-center relative">
            {document.s3Url !== "#" ? (
              <iframe 
                src={document.s3Url} 
                className="w-full h-full border-0" 
                title={document.title}
              />
            ) : (
              <div className="text-center text-slate-500">
                <FileText className="h-20 w-20 mx-auto mb-4 text-slate-300" />
                <p>Bản xem trước không khả dụng cho định dạng này.</p>
                <p className="text-sm mt-2">Vui lòng tải về máy để xem.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Metadata & Actions (1/4 on large screens) */}
        <div className="w-full lg:w-1/4 flex flex-col gap-6 overflow-y-auto pr-2 pb-8">
          
          {/* Main Info Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-start gap-3 mb-4">
              <Badge variant={getBadgeVariant(document.fileType)} className="mt-1">
                .{document.fileType?.toUpperCase()}
              </Badge>
              <h1 className="text-xl font-bold text-slate-800 leading-tight">
                {document.title}
              </h1>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Dung lượng</span>
                <span className="font-semibold text-slate-700">{document.fileSize}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-sm text-slate-500 flex items-center gap-1"><User className="h-4 w-4"/> Người đăng</span>
                <span className="font-medium text-primary">{document.uploader}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-sm text-slate-500 flex items-center gap-1"><Calendar className="h-4 w-4"/> Ngày đăng</span>
                <span className="font-medium text-slate-700">{document.uploadDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Lượt tải</span>
                <span className="font-medium text-slate-700">{document.downloadCount} lượt</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button size="lg" className="w-full text-lg h-14 shadow-md bg-indigo-600 hover:bg-indigo-700 gap-2">
                <Download className="h-5 w-5" />
                Tải Xuống Ngay
              </Button>
              <Button variant="outline" className="w-full h-12 text-slate-600 gap-2">
                <Share2 className="h-4 w-4" />
                Chia sẻ Link
              </Button>
            </div>
          </div>

          {/* Academic Info */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" /> Thông tin học thuật
            </h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p><span className="font-medium text-slate-700">Trường:</span> {document.school}</p>
              <p><span className="font-medium text-slate-700">Ngành:</span> {document.department}</p>
              <p><span className="font-medium text-slate-700">Môn học:</span> {document.subject}</p>
            </div>
          </div>

          {/* Related Documents */}
          {relatedDocs.length > 0 && (
            <div className="mt-4">
              <h3 className="font-bold text-slate-800 mb-4 text-lg">Tài liệu cùng môn học</h3>
              <div className="space-y-3">
                {relatedDocs.map(doc => (
                  <Link to={`/preview/${doc.id}`} key={doc.id} className="block group">
                    <div className="bg-white p-3 rounded-lg border border-slate-200 hover:border-primary/50 hover:shadow-md transition-all">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getBadgeVariant(doc.fileType)} className="text-[10px] px-1.5 py-0">
                          {doc.fileType}
                        </Badge>
                        <span className="text-xs text-slate-400">{doc.fileSize}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-700 group-hover:text-primary line-clamp-2 leading-tight">
                        {doc.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
