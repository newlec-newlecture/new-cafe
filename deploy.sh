#!/bin/bash

# === new-cafe 배포 스크립트 ===
# 이 스크립트는 로컬 PC에서 실행하여
# new-cafe 프로젝트를 cloud.newlecture.com 서버에 rsync로 전송하고,
# PM2를 이용해 정적 파일 서버를 실행/재시작합니다.

REMOTE_USER="newlec"
REMOTE_HOST="cloud.newlecture.com"
REMOTE_DIR="/var/www/new-cafe"
LOCAL_DIR="$(pwd)/new-cafe"
PORT=8080

echo "📦 new-cafe 프로젝트 배포 시작..."

# 1. 프로젝트 파일 원격 서버로 전송 (rsync)
echo "📡 파일 전송 중..."
rsync -avz --delete --progress \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='test.html' \
  "$LOCAL_DIR/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"

if [ $? -ne 0 ]; then
  echo "❌ 파일 전송 실패"
  exit 1
fi

echo "✅ 파일 전송 완료"

# 2. 원격 서버에서 PM2로 정적 서버 실행
echo "🚀 PM2로 정적 파일 서버 시작..."
ssh "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
# serve 패키지가 없으면 설치
if ! command -v serve &> /dev/null; then
  npm install -g serve
fi

# 기존 new-cafe 프로세스가 있으면 삭제
pm2 delete new-cafe 2>/dev/null

# /var/www/new-cafe 디렉토리의 정적 파일을 serve로 8080 포트에서 실행
pm2 start "serve -s /var/www/new-cafe -l 8080" --name new-cafe

# PM2 설정 저장 (리부팅 시 자동 시작)
pm2 save

# 상태 확인
pm2 list
EOF

if [ $? -ne 0 ]; then
  echo "❌ PM2 설정 실패"
  exit 1
fi

echo "✅ new-cafe 배포 완료! http://cloud.newlecture.com:8080 에서 확인하세요."
