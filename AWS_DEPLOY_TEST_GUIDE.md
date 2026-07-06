# CloudDoc AWS deploy/test guide

Guide nay viet theo trang thai repo hien tai:

- Frontend: React + Vite, dang dung mock data trong `frontend/src/services/mockData.js`.
- Backend: thu muc `backend/` chua co API Node/Express that.
- Upload file: UI dang gia lap bang Blob URL, chua upload len S3 that.
- Metadata tai lieu: dang nam trong React state, chua luu vao Aurora/RDS.

Vi vay co the test ngay S3 + CloudFront cho frontend static site. EC2, Aurora/RDS, va S3 upload API can backend that de test end-to-end.

## 1. Canh bao credentials

Khong commit AWS access key vao repo. File CSV credentials nen nam ngoai git va tot nhat them pattern rieng vao `.gitignore` neu team hay export credential:

```gitignore
*_credentials.csv
```

Neu key da tung bi push/chia se nham, vao IAM rotate access key ngay.

Nen dung IAM Role cho EC2 thay vi dat `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` trong `.env` tren server.

## 2. Chay local va build frontend

```bash
cd frontend
npm install
npm run dev
```

Mo URL Vite hien tren terminal, thu cac luong:

- Dang nhap user/admin tu header.
- Search tai lieu.
- Preview PDF mau.
- Upload file demo.
- Admin duyet/xoa tai lieu.

Build production:

```bash
cd frontend
npm run build
```

Neu thanh cong, output nam o:

```text
frontend/dist/
```

Day la thu muc upload len S3 hoac copy len EC2/Nginx.

## 3. S3 static hosting cho frontend

Dung khi team muon dua frontend len S3 va CloudFront.

Bucket goi y:

- Ten bucket: `clouddoc-frontend-<env>` vi du `clouddoc-frontend-dev`.
- Block Public Access: bat neu dung CloudFront Origin Access Control.
- Static website hosting: khong bat neu CloudFront doc qua S3 REST endpoint + OAC.

Upload build:

```bash
cd frontend
npm run build
aws s3 sync dist/ s3://<FRONTEND_BUCKET_NAME>/ --delete
```

Test S3 co file:

```bash
aws s3 ls s3://<FRONTEND_BUCKET_NAME>/ --recursive
```

Can thay `index.html` va folder `assets/`.

## 4. CloudFront cho frontend

CloudFront distribution nen tro origin ve S3 bucket frontend.

Checklist cau hinh:

- Origin: S3 bucket frontend.
- Origin access: Origin Access Control (OAC), khong public bucket.
- Default root object: `index.html`.
- Viewer protocol policy: Redirect HTTP to HTTPS.
- Allowed methods: GET, HEAD.
- Compress objects automatically: Yes.
- SPA fallback:
  - Custom error response `403` -> `/index.html`, HTTP `200`.
  - Custom error response `404` -> `/index.html`, HTTP `200`.

Sau khi upload frontend moi, invalidate cache:

```bash
aws cloudfront create-invalidation \
  --distribution-id <DISTRIBUTION_ID> \
  --paths "/*"
```

Test:

```bash
curl -I https://<CLOUDFRONT_DOMAIN>/
curl -I https://<CLOUDFRONT_DOMAIN>/search
```

Ky vong:

- Status 200.
- Co header CloudFront nhu `x-cache`.
- Route `/search` khong bi 403/404 vi da co SPA fallback.

## 5. EC2 cho backend

Hien repo chua co backend that, nen EC2 chi co the chuan bi moi truong. Khi co API Express, luong hop ly la:

```text
Browser -> CloudFront/S3 frontend -> EC2 backend API -> Aurora/RDS + S3 document bucket
```

EC2 checklist:

- OS: Ubuntu 22.04/24.04 LTS.
- Security group:
  - Inbound SSH `22` chi mo IP cua team.
  - Inbound HTTP `80` / HTTPS `443` neu dung Nginx public.
  - Backend port noi bo vi du `3000` khong can public neu Nginx reverse proxy.
- IAM Role gan vao EC2:
  - Cho phep thao tac voi document S3 bucket can thiet.
  - Khong nen luu long-term access key tren EC2.

Cai Node va tool co ban tren EC2:

```bash
sudo apt update
sudo apt install -y git nginx mysql-client
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

Neu backend Express sau nay chay port `3000`, test health:

```bash
curl http://localhost:3000/health
curl http://<EC2_PUBLIC_IP>/api/health
```

Nen dung PM2 hoac systemd de giu process backend:

```bash
sudo npm install -g pm2
pm2 start server.js --name clouddoc-api
pm2 save
pm2 startup
```

## 6. Aurora/RDS

Metadata nen luu trong Aurora MySQL/PostgreSQL hoac RDS. Repo hien chua co schema, co the bat dau voi bang `documents`.

Schema MySQL goi y:

```sql
CREATE TABLE documents (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  school VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  file_type VARCHAR(20) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  s3_key VARCHAR(512) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  download_count INT NOT NULL DEFAULT 0,
  uploader_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

Security group can dung:

- RDS/Aurora inbound `3306` MySQL hoac `5432` PostgreSQL chi cho phep tu EC2 security group.
- Khong mo database public neu khong bat buoc.

Test tu EC2 vao MySQL:

```bash
mysql -h <RDS_ENDPOINT> -P 3306 -u <DB_USER> -p
```

Trong MySQL:

```sql
SELECT NOW();
SHOW DATABASES;
```

Neu timeout:

- Kiem tra EC2 va RDS cung VPC/subnet route hop ly.
- Kiem tra RDS security group inbound tu EC2 security group.
- Kiem tra database public/private va NACL.

## 7. S3 document bucket

Frontend static bucket va document upload bucket nen tach rieng.

Document bucket goi y:

- Ten: `clouddoc-documents-<env>`.
- Block Public Access: bat.
- File tai lieu private.
- Backend tao presigned URL de upload/download/preview.

Test bucket bang AWS CLI:

```bash
aws s3 ls s3://<DOCUMENT_BUCKET_NAME>/
aws s3 cp ./frontend/public/dummy.pdf s3://<DOCUMENT_BUCKET_NAME>/test/dummy.pdf
aws s3 presign s3://<DOCUMENT_BUCKET_NAME>/test/dummy.pdf --expires-in 300
```

Mo presigned URL trong browser, ky vong xem/tai duoc PDF trong 5 phut.

## 8. Backend API da scaffold

Backend Express da nam trong `backend/`, dung PostgreSQL RDS va S3 presigned URL.

Local/EC2 setup:

```bash
cd backend
npm install
cp .env.example .env
```

Cap nhat `.env`, khong commit file nay. Tren EC2 nen dung IAM Role `clouddoc-ec2-app-role`, khong can AWS access key trong `.env`.

Tao database va schema:

```bash
npm run db:create
npm run db:migrate
```

Chay API:

```bash
npm run start
```

Health check:

```bash
curl http://localhost:3000/api/health
```

Frontend nen goi API qua `VITE_API_BASE_URL`.

`.env.local` frontend:

```env
VITE_API_BASE_URL=https://<api-domain-or-ec2-domain>/api
```

API hien co:

```text
GET    /api/health
GET    /api/documents?status=approved&q=&school=&dept=&subject=
GET    /api/documents/:id
POST   /api/documents/presign-upload
POST   /api/documents
PATCH  /api/documents/:id/status
POST   /api/documents/:id/presign-download
DELETE /api/documents/:id
```

Flow upload that:

```text
1. Frontend gui metadata file cho backend.
2. Backend tao S3 key va presigned upload URL.
3. Frontend PUT file truc tiep len S3.
4. Frontend goi backend tao document record trong RDS voi status pending.
5. Admin approve, backend update status approved.
6. User preview/download, backend tao presigned download URL.
```

## 9. Test end-to-end sau khi co backend

Checklist nhanh:

- `GET /api/health` tra ve 200 tren EC2.
- Backend ket noi duoc RDS bang endpoint private.
- Backend tao duoc presigned URL S3.
- Frontend build voi `VITE_API_BASE_URL` dung domain API.
- Upload file tren frontend tao object trong S3.
- Database co row moi status `pending`.
- Admin approve doi status sang `approved`.
- Search thay tai lieu approved.
- Preview/download dung presigned URL.
- CloudFront route `/`, `/search`, `/preview/<id>` deu load dung.

## 10. Loi hay gap

- CloudFront `/search` bi 403/404: thieu custom error response ve `/index.html`.
- Frontend goi API sai URL: chua set `VITE_API_BASE_URL` truoc khi build.
- CORS loi upload S3: document bucket thieu CORS rule cho domain CloudFront/local dev.
- RDS timeout: security group RDS chua allow tu EC2 security group.
- AWS key loi tren EC2: nen dung IAM Role, neu dung env thi kiem tra `aws sts get-caller-identity`.
- Upload thanh cong nhung search khong thay: backend chua insert metadata vao RDS hoac status van `pending`.
