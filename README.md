# 📝 Todo App (Monorepo)

シンプルな **個人向け Todo 管理アプリ**。  
フロントエンド・バックエンド・DB・インフラをまとめた **monorepo 構成**です。

---

## 1 リポジトリ概要

This repository contains:

- **/frontend**  
  Next.js（TypeScript）によるフロントエンド

- **/backend**  
  FastAPI（Python）によるバックエンド API

- **/db**  
  MySQL 用の初期データ・永続化データ

- **/infra**  
  Docker / docker-compose による開発環境構築

---

## 2 アプリの目的（Purpose）

- ユーザーがやるべきタスクを簡単に登録・管理できる
- Firebase 認証を利用し、**ユーザーごとにタスクを完全に分離**
- シンプルで直感的な UI

## 3 対象ユーザー（User）

- 個人利用のみ
- 1ユーザー = 1タスクリスト
- Firebase Authentication（Email / Password）
- ログインユーザーの **Firebase UID に紐づくタスクのみ取得**
- ロール管理なし（一般ユーザーのみ）

---

## 4. 必須機能（MUST）

### ✅ タスク登録（Create）
- タスク名を入力して追加
- 空文字は登録不可

### ✅ タスク一覧表示（Read）
- 登録済みタスクを一覧表示
- 並び順：新しい順 or 古い順（どちらか）

### ✅ タスク完了切替（Update）
- チェックボックスで完了状態を切り替え
- 完了タスクはグレー表示など視覚的に区別

### ✅ タスク削除（Delete）
- タスクを個別に削除可能

---

## 5 余裕があれば実装したい機能

- 完了タスクの一括削除
- タスク編集
- 並び替え（ドラッグ＆ドロップ）
- 通知機能
- カテゴリ分け（仕事 / プライベート）

---

## 6 リポジトリ構成（Monorepo）

```
/todo-app
├── frontend/   # Next.js (TypeScript)
├── backend/    # FastAPI (Python)
├── DB/         # MySQL
└── infra/      # Docker / 環境構築

🧩 フロントエンド構成（Next.js）
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx          # トップページ
│   │   ├── login/page.tsx    # ログイン
│   │   └── dashboard/page.tsx # タスク管理
│   ├── components/
│   │   ├── TaskItem.tsx
│   │   ├── TaskList.tsx
│   │   └── TaskForm.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useTasks.ts
│   ├── lib/
│   │   ├── firebase.ts
│   │   ├── apiClient.ts
│   │   └── types.ts
│   └── utils/
│       └── validators.ts

🐍 バックエンド構成（FastAPI）
backend/
├── app/
│   ├── main.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── database.py
│   ├── models/
│   │   ├── user.py
│   │   └── task.py
│   ├── schemas/
│   │   └── task_schema.py
│   ├── crud/
│   │   └── task_crud.py
│   └── routes/
│       └── task_route.py
├── alembic/
└── requirements.txt
```
## 7 データ構造

🧱 DB設計（ER）
```
┌─────────────────────────┐
│          users           │
├─────────────────────────┤
│ user_id (PK)              │ INT AUTO_INCREMENT
│ firebase_uid             │ VARCHAR(128) UNIQUE
│ name                     │ VARCHAR(100)  ※任意
│ email                    │ VARCHAR(255)  ※任意
│ created_at               │ DATETIME
└─────────────────────────┘
              1
              │  (1:N)
              N
┌─────────────────────────┐
│          tasks           │
├─────────────────────────┤
│ task_id (PK)              │ INT AUTO_INCREMENT
│ user_id 　　　　　　　    │ INT
│ title                    │ VARCHAR(255)
│ description              │ TEXT NULL
│ due_date                 │ DATETIME NULL
│ is_done                  │ BOOLEAN
│ created_at               │ DATETIME
└─────────────────────────┘
```

## 8 API設計
| Method | Endpoint        | Description                                  | Auth |
|--------|-----------------|----------------------------------------------|------|
| POST   | /tasks          | タスク作成                                   | Firebase ID Token |
| GET    | /tasks          | タスク一覧取得（ログインユーザーのみ）       | Firebase ID Token |
| PATCH  | /tasks/{id}     | タスク更新（ログインユーザーのみ）           | Firebase ID Token |
| DELETE | /tasks/{id}     | タスク削除（ログインユーザーのみ）           | Firebase ID Token |

## 9 テスト設計

### 1. 認証系（Firebase ID Token）

| No | ケース | 入力 / 前提 | 期待結果 |
|----|--------|-------------|----------|
| 1-1 | 有効なトークン | Authorization: Bearer `<valid_token>` | 200 OK / UID 取得 |
| 1-2 | 無効なトークン | Authorization: Bearer `invalidtoken` | 401 Unauthorized |
| 1-3 | トークンなし | Authorization ヘッダーなし | 401 Unauthorized |

---

### 2. タスク作成（POST /tasks）

| No | ケース | 入力 / 前提 | 期待結果 |
|----|--------|-------------|----------|
| 2-1 | 作成成功 | 有効トークン<br>`{ "title": "test task" }` | 201 Created / DB保存 |
| 2-2 | 認証なし | Authorization ヘッダーなし | 401 Unauthorized |
| 2-3 | バリデーションエラー | `{ "title": "" }` | 400 Bad Request |

### 3. タスク一覧取得（GET /tasks）

| No | ケース | 入力 / 前提 | 期待結果 |
|----|--------|-------------|----------|
| 3-1 | 取得成功 | 有効なトークン | 200 OK / ログインユーザーのタスクのみ返却 |
| 3-2 | 認証なし | Authorization ヘッダーなし | 401 Unauthorized |

---

### 4. タスク更新（PATCH /tasks/{id}）

| No | ケース | 入力 / 前提 | 期待結果 |
|----|--------|-------------|----------|
| 4-1 | 更新成功 | 本人のタスク<br>`{ "title": "updated title" }` | 200 OK / タスク更新 |
| 4-2 | 他ユーザーのタスク | 他ユーザーの task ID | 403 Forbidden |
| 4-3 | 存在しないID | 存在しない task ID | 404 Not Found |

---

### 5. タスク削除（DELETE /tasks/{id}）

| No | ケース | 入力 / 前提 | 期待結果 |
|----|--------|-------------|----------|
| 5-1 | 削除成功 | 本人のタスク | 204 No Content |
| 5-2 | 他ユーザーのタスク | 他ユーザーの task ID | 403 Forbidden |
| 5-3 | 存在しないID | 存在しない task ID | 404 Not Found |



## 10 技術選定

- フロント：TypeScript / Next.js / React / Firebase SDK
- バックエンド：Python / FastAPI
- DB：MySQL
  - マイグレーションツール：Alembic（💡テーブル構造を変更するために使用）
  - ORM / モデル：SQLAlchemy
  - ER 図（user / task）：DB設計として作成済み
  - タスク一覧取得：ユーザーごとに取得範囲を制限
- Token 検証：Firebase Admin SDK（Python）


## 11 非機能要件

- Docker を使用してフロントエンド / API / DB を起動
- SQL Injection / XSS 対策
- レスポンシブ対応
- シンプルで直感的な操作

## 12 画面構成 / ワイヤーフレーム（テキスト）

### 1. トップページ（未ログイン）
```
┌───────────────────────────┐
│                           │
│      Todo                 │
│                           │
│      A simple task        │
│      management tool      │
│                           │
│                           │
│      ┌────────────┐       │
│      │   Log In   │       │
│      └────────────┘       │
│                           │
└───────────────────────────┘
```
- アプリ概要を表示
- 「Log In」押下でログイン画面へ遷移

---

### 2. ログイン画面
- Firebase Authentication を使用
- 認証成功後、タスク一覧画面へ遷移
```
┌───────────────────────────────────┐
│                                   │
│      Log In                       │
│                                   │
│      Email                        │
│      ┌────────────────────┐       │
│      │                    │       │
│      └────────────────────┘       │
│                                   │
│      Password                     │
│      ┌────────────────────┐       │
│      │                    │       │
│      └────────────────────┘       │
│                                   │
│        ┌────────────┐             │
│        │   Log In   │             │
│        └────────────┘             │
│                                   │
└───────────────────────────────────┘
```
---

### 3. タスク一覧画面（ログイン後）
```
┌──────────────────────────────────────┐
│                                      │
│          Todo                        │
│                                      │
│      ┌────────────────────┐ ┌────┐   │
│      │  Enter a new task  │ │Add │   │
│      └────────────────────┘ └────┘   │
│                                      │
│      ☐  Task item 1              🗑  │
│                                      │
│      ☐  Task item 2              🗑  │
│                                      │
│      ☑  Task item 3              🗑  │
│                                      │
└──────────────────────────────────────┘
```