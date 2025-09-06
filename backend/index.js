// .envファイルから環境変数を読み込む
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { assignRolesWithAI, getAvailableRoles } = require('./aiRoleAssignment');

const app = express();
const port = 3000; // Expressサーバーのポート

// 環境変数から許可するオリジンを取得
const allowedOrigin = process.env.CORS_ORIGIN;

// CORSミドルウェアの設定
app.use(cors({
  origin: allowedOrigin,
}));

// JSONパーサーミドルウェアを追加
app.use(express.json());


// ルートエンドポイント
app.get('/', (req, res) => {
  res.json({ message: 'AI Team Role Assignment API is running!' });
});

// 役割割り振りエンドポイント
app.post('/api/roles/assign', async (req, res) => {
  try {
    const { members } = req.body;
    
    // 基本的なバリデーション
    if (!members || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({
        error: 'INVALID_INPUT',
        message: 'Members array is required and must not be empty'
      });
    }

    // 各メンバーの必須フィールドをチェック
    for (const member of members) {
      if (!member.name || !member.age || !member.hometown || !member.organization || !member.motivation) {
        return res.status(400).json({
          error: 'VALIDATION_ERROR',
          message: 'All member fields (name, age, hometown, organization, motivation) are required'
        });
      }
    }

    // AIを使用して役割割り振りを実行
    const response = await assignRolesWithAI(members);
    
    res.json(response);
  } catch (error) {
    console.error('Role assignment error:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    });
  }
});

// 利用可能な役割一覧を取得するエンドポイント
app.get('/api/roles', (req, res) => {
  res.json({ roles: getAvailableRoles() });
});

// ヘルスチェックエンドポイント
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Team Role Assignment API'
  });
});

app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
  console.log(`📍 API endpoints:`);
  console.log(`   POST /api/roles/assign - Assign roles to team members`);
  console.log(`   GET  /api/roles - Get available roles`);
  console.log(`   GET  /api/health - Health check`);
  console.log(`Allowed CORS origin: ${allowedOrigin}`);
});