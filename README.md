学習記録と復習を管理できるアプリケーションです。  
フロントエンドは Next.js (App Router) + Tailwind CSS v4、  
バックエンドは Go + MySQL を Docker 上で動作させています。

review-me-app/
├─ docker-compose.yml
├─ backend/        # Go バックエンド
│  ├─ main.go
│  └─ ...
├─ frontend/       # Next.js フロントエンド
│  ├─ package.json
│  ├─ next.config.mjs
│  └─ src/app/
│     ├─ layout.tsx
│     ├─ globals.css
│     └─ page.tsx

技術スタック
Go (バックエンドAPI)
MySQL (DB)
Docker
Next.js (App Router)
Tailwind CSS v4
