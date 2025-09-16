# 1. ベースとなるDockerイメージを指定 (軽量なGo v1.21)
FROM golang:1.25-alpine

# 2. コンテナ内の作業ディレクトリを指定
WORKDIR /app

# 3. 最初にGoのモジュール管理ファイルをコピー
COPY go.* ./
# 4. 依存ライブラリをダウンロード
RUN go mod download
# main.goで使うginをインストール
RUN go get -u github.com/gin-gonic/gin

# 5. プロジェクトの全ファイルをコンテナにコピー
COPY . .

# 6. コンテナ起動時に実行するコマンド (main.goを実行してサーバーを起動)
CMD ["go", "run", "main.go"]