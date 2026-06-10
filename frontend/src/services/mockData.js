export const MOCK_DOCUMENTS = [
  {
    id: "doc-001",
    title: "Slide bài giảng Hệ quản trị cơ sở dữ liệu - Chương 1",
    school: "HUTECH",
    department: "CNTT",
    subject: "Cơ sở dữ liệu",
    fileType: "pdf",
    fileSize: "4.5MB",
    uploader: "Nguyễn Văn A",
    downloadCount: 125,
    s3Url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", 
    contentIndex: "mô hình dữ liệu quan hệ e.f. codd hệ quản trị cơ sở dữ liệu toán rời rạc",
    uploadDate: "2023-09-15"
  },
  {
    id: "doc-002",
    title: "Đề thi mẫu môn Toán rời rạc kì 1 2025",
    school: "HUTECH",
    department: "CNTT",
    subject: "Toán rời rạc",
    fileType: "docx",
    fileSize: "1.2MB",
    uploader: "Trần Thị B",
    downloadCount: 89,
    s3Url: "#",
    contentIndex: "đề thi đáp án logic mệnh đề tập hợp đồ thị đại số boolean",
    uploadDate: "2023-10-01"
  },
  {
    id: "doc-003",
    title: "Bài tập lớn môn Cấu trúc dữ liệu và giải thuật",
    school: "HUTECH",
    department: "CNTT",
    subject: "Cấu trúc dữ liệu",
    fileType: "zip",
    fileSize: "15MB",
    uploader: "Lê Văn C",
    downloadCount: 300,
    s3Url: "#",
    contentIndex: "danh sách liên kết cây nhị phân sắp xếp đồ thị thuật toán",
    uploadDate: "2023-11-20"
  },
  {
    id: "doc-004",
    title: "Hướng dẫn thực hành Nhập môn lập trình (C/C++)",
    school: "HUTECH",
    department: "CNTT",
    subject: "Nhập môn lập trình",
    fileType: "pdf",
    fileSize: "8.1MB",
    uploader: "Phạm Văn D",
    downloadCount: 450,
    s3Url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    contentIndex: "con trỏ vòng lặp mảng hàm biến if else",
    uploadDate: "2024-01-10"
  },
  {
    id: "doc-005",
    title: "Tài liệu môn Kinh tế vĩ mô - FTU",
    school: "FTU",
    department: "Kinh tế quốc tế",
    subject: "Kinh tế vĩ mô",
    fileType: "pdf",
    fileSize: "5.5MB",
    uploader: "Hoàng Thị E",
    downloadCount: 60,
    s3Url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    contentIndex: "lạm phát gdp thất nghiệp chính sách tiền tệ tài khóa",
    uploadDate: "2024-02-15"
  }
];

export const SCHOOL_DATA = {
  "HUTECH": {
    "CNTT": ["Cơ sở dữ liệu", "Toán rời rạc", "Cấu trúc dữ liệu", "Nhập môn lập trình"],
    "Kinh Tế": ["Quản trị học", "Marketing căn bản"]
  },
  "FTU": {
    "Kinh tế quốc tế": ["Kinh tế vĩ mô", "Kinh tế vi mô"],
    "Tài chính ngân hàng": ["Tiền tệ ngân hàng"]
  }
};
