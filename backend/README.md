# CloudDoc Backend

Express API cho CloudDoc, dung PostgreSQL RDS va S3 presigned URL.

## Local setup

```bash
cd backend
npm install
copy .env.example .env
```

Cap nhat `.env` bang thong tin AWS/RDS that. Khong commit `.env`.

## Database

RDS dang dung PostgreSQL. Neu database `clouddoc` chua ton tai:

```bash
npm run db:create
```

Chay migration:

```bash
npm run db:migrate
```

## Run API

```bash
npm run dev
```

Health check:

```bash
curl http://localhost:3000/api/health
```

## API endpoints

```text
GET    /api/health
GET    /api/documents
GET    /api/documents/:id
POST   /api/documents/presign-upload
POST   /api/documents
PATCH  /api/documents/:id/status
POST   /api/documents/:id/presign-download
DELETE /api/documents/:id
```

## Upload flow

1. Frontend goi `POST /api/documents/presign-upload`.
2. Frontend `PUT` file truc tiep len S3 bang `uploadUrl`.
3. Frontend goi `POST /api/documents` de luu metadata vao Postgres.
4. Admin duyet bang `PATCH /api/documents/:id/status`.
5. Frontend goi `POST /api/documents/:id/presign-download` de lay URL tai/xem file.

## AWS info hien co

```text
AWS_REGION=ap-southeast-1
S3_UPLOAD_BUCKET=clouddoc-upload-20260701
DB_HOST=clouddoc-pg-dev.c3cqsgqy680s.ap-southeast-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=clouddoc
DB_USER=clouddoc_admin
EC2_ACCESS=SSM Session Manager
```

DB password phai nam trong `.env` tren may dev/EC2, khong luu vao repo.
