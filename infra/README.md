# docker立ち上げガイド

このフォルダでは、チーム開発で利用する 
**Docker / MySQL / Backend / Frontend の開発環境** をまとめています。  
全員が同じ環境で作業できるように、この手順に沿ってセットアップしてください。

---

#  ディレクトリ

- **frontend** … Next.js 開発サーバー（ポート 3000）
- **backend** … FastAPI（予定） / ポート 8000
- **db** … MySQL 8.0（ポート 3307 → 3306）

構成、設定は `docker-compose.yml` に記載されています。

---

#  1. Docker コンテナの起動

<font color="Red">※ すべてプロジェクトの `infra` ディレクトリで実行する必要があります。</font>

```
ターミナル
cd infra
docker compose up -d
```

コンテナが正常に起動すると、💡Docker Desktop で  
`frontend` / `backend` / `todo-mysql` が **Running** 状態になります。

※特定のサーバーだけ起動したい場合は次のように実行します：
```
docker compose up -d db　 # DB だけ起動
```


# 2. Docker コンテナの状態確認

現在起動しているコンテナは以下で確認できます：
```
ターミナル
docker ps
```
`todo-mysql` / `backend` / `frontend` が表示されていればOKです。

---


# 3. MySQL への接続方法

MySQLへの接続方法

このプロジェクトでは Docker コンテナ内の MySQL を使う想定です。
そのため、まず Docker コンテナに入ってから MySQL を起動します。
```
ターミナル
docker exec -it todo-mysql mysql -u todo_user -p
```

※パスワードはdocker-compose.ymlで決めた `todo_pass` です。


# 4. DBの確認

MySQL にログインしたあと（`mysql>` のプロンプトが出ている状態）で、次のコマンドを実行します。

```
ターミナル
SHOW DATABASES;      -- データベース一覧を確認
USE todo_app;        -- todo_app データベースを選択
SHOW TABLES;         -- テーブル一覧を確認
DESC users;          -- users テーブルの構造を確認
DESC tasks;          -- tasks テーブルの構造を確認
```