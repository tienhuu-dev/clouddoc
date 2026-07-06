# Deploy backend len AWS

May local hien chua co AWS CLI, nen chay cac lenh AWS nay trong CloudShell hoac terminal da cau hinh AWS.

## 1. Bat RDS va EC2 app

```bash
aws rds start-db-instance --region ap-southeast-1 --db-instance-identifier clouddoc-pg-dev
aws rds wait db-instance-available --region ap-southeast-1 --db-instance-identifier clouddoc-pg-dev

aws ec2 start-instances --region ap-southeast-1 --instance-ids i-0aea0f00c4c6ee102
aws ec2 wait instance-running --region ap-southeast-1 --instance-ids i-0aea0f00c4c6ee102
```

## 2. Bat CORS cho S3 upload bucket

Chay tu root repo neu file `backend/deploy/s3-upload-cors.json` co san trong CloudShell:

```bash
aws s3api put-bucket-cors \
  --bucket clouddoc-upload-20260701 \
  --cors-configuration file://backend/deploy/s3-upload-cors.json
```

Kiem tra:

```bash
aws s3api get-bucket-cors --bucket clouddoc-upload-20260701
```

## 3. Vao EC2 bang SSM

```bash
aws ssm start-session --region ap-southeast-1 --target i-0aea0f00c4c6ee102
```

Neu instance chua hien trong SSM:

```bash
aws ssm describe-instance-information --region ap-southeast-1 --output table
```

Can nhom kiem tra SSM Agent/IAM role neu danh sach rong sau khi EC2 da running vai phut.

## 4. Cai runtime tren EC2

Trong SSM session:

```bash
sudo apt update
sudo apt install -y git nginx postgresql-client
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

## 5. Dua code len EC2

Neu repo da co remote Git:

```bash
git clone <YOUR_REPO_URL> clouddoc
cd clouddoc/backend
```

Neu da clone roi:

```bash
cd ~/clouddoc
git pull
cd backend
```

## 6. Tao `.env` tren EC2

Khong commit file nay.

```bash
cat > .env <<'EOF'
NODE_ENV=production
PORT=3000
APP_ORIGIN=http://localhost:5173,https://d2dseci8bbrmee.cloudfront.net

AWS_REGION=ap-southeast-1
S3_UPLOAD_BUCKET=clouddoc-upload-20260701
S3_PRESIGN_EXPIRES_SECONDS=300

DB_HOST=clouddoc-pg-dev.c3cqsgqy680s.ap-southeast-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=clouddoc
DB_USER=clouddoc_admin
DB_PASSWORD=<RDS_PASSWORD>
DB_SSL=false
EOF
```

Thay `<RDS_PASSWORD>` bang password RDS that.

## 7. Chay backend

```bash
chmod +x deploy/ec2-run-api.sh
./deploy/ec2-run-api.sh
```

Test tren EC2:

```bash
curl http://localhost:3000/api/health
```

## 8. Public API qua ALB/Nginx

Security group EC2 hien nhan inbound port 3000 tu ALB security group. Neu ALB da ton tai, target group nen tro toi port 3000 cua EC2 app.

Neu dung Nginx tren EC2:

```nginx
server {
  listen 80;
  server_name _;

  location /api/ {
    proxy_pass http://127.0.0.1:3000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Frontend build can set:

```env
VITE_API_BASE_URL=http://<API_DOMAIN_OR_ALB_DNS>/api
```
