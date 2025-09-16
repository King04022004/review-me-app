// backend/main.go
package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors" // CORSミドルウェアをインポート
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

// Record構造体を定義（DBのテーブル構成と対応させる）
type Record struct {
	ID             int       `json:"id"`
	Title          string    `json:"title"`
	Content        string    `json:"content"`
	CreatedAt      time.Time `json:"created_at"`
	LastReviewedAt time.Time `json:"last_reviewed_at"`
}

func main() {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		"user", "password", "db", "3306", "review_me_db")

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("データベースへの接続に失敗しました: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("データベースへのPingに失敗しました: %v", err)
	}

	log.Println("データベースへの接続に成功しました！")

	router := gin.Default()

	// CORS設定を追加（全てのオリジンを許可するデフォルト設定）
	router.Use(cors.Default())

	// --- APIエンドポイントの定義 ---
	// GET /api/health (動作確認用)
	router.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// GET /api/records (全件取得)
	router.GET("/api/records", func(c *gin.Context) {
		rows, err := db.Query("SELECT id, title, content, created_at, last_reviewed_at FROM learning_records")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		var records []Record
		for rows.Next() {
			var r Record
			if err := rows.Scan(&r.ID, &r.Title, &r.Content, &r.CreatedAt, &r.LastReviewedAt); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			records = append(records, r)
		}
		c.JSON(http.StatusOK, records)
	})

	// POST /api/records (新規作成)
	router.POST("/api/records", func(c *gin.Context) {
		var newRecord Record

		if err := c.ShouldBindJSON(&newRecord); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		query := "INSERT INTO learning_records (title, content) VALUES (?, ?)"
		result, err := db.Exec(query, newRecord.Title, newRecord.Content)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		id, _ := result.LastInsertId()
		log.Printf("新しいレコードが追加されました: ID=%d", id)

		c.JSON(http.StatusCreated, gin.H{"message": "Record created successfully"})
	})

	router.Run(":8080")
}