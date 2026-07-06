#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

npm ci --omit=dev
npm run db:create
npm run db:migrate

if ! command -v pm2 >/dev/null 2>&1; then
  sudo npm install -g pm2
fi

pm2 start src/server.js --name clouddoc-api --update-env || pm2 restart clouddoc-api --update-env
pm2 save

echo "CloudDoc API is running under PM2"
