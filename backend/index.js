// .envファイルから環境変数を読み込む
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000; // Expressサーバーのポート

// 環境変数から許可するオリジンを取得
const allowedOrigin = process.env.CORS_ORIGIN;

// CORSミドルウェアの設定
app.use(cors({
  origin: allowedOrigin,
}));

// ルートエンドポイントの例
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express server!' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Allowed CORS origin: ${allowedOrigin}`);
});