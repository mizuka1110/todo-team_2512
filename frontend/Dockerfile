# 開発用の Node イメージ
FROM node:20-alpine

# コンテナ内の作業ディレクトリ
WORKDIR /app

# 依存関係だけ先にコピー → npm install
COPY package*.json ./
RUN npm install

# 残りのソースコードをコピー
COPY . .

# 開発用サーバーを起動
CMD ["npm", "run", "dev"]
