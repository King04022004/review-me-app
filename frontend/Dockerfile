# frontend/Dockerfile

# 1. ベースとなるDockerイメージを指定 (軽量なNode.js v18)
FROM node:18-alpine

# 2. コンテナ内の作業ディレクトリを指定
WORKDIR /app

# 3. 最初にpackage.jsonだけコピーしてライブラリをインストール
# (ソースコードの変更時に毎回インストールが走らないようにするための工夫)
COPY package*.json ./
RUN npm install

# 4. プロジェクトの全ファイルをコンテナにコピー
COPY . .

# 5. コンテナ起動時に実行するコマンド（Next.jsの開発サーバーを起動）
CMD ["npm", "run", "dev"]