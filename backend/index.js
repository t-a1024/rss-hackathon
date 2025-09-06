// .envファイルから環境変数を読み込む
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { assignRolesWithAI, assignRolesForRoom, getAvailableRoles } = require('./aiRoleAssignment');

const { randomUUID } = require('crypto');


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

// インメモリデータストレージ
/**
 * 部屋のデータ
 * roomId: room
 */
const rooms = new Map();
/**
 * 回答のデータ
 * roomId: answers[]
 */
const answers = new Map();
/**
 * 診断結果
 * roomId: result
 */
const results = new Map();

/** デフォルトの質問リスト */
// TODO: 問題の調整
const defaultQuestions = [
  {
    questionId: "q1",
    question: "好きな歌は？"
  },
  {
    questionId: "q2", 
    question: "好きな映画は？"
  },
  {
    questionId: "q3",
    question: "好きなゲームは？"
  },
  {
    questionId: "q4",
    question: "休日の過ごし方は？"
  },
  {
    questionId: "q5",
    question: "理想のチームとは？"
  }
];

// ユーティリティ関数
/** 部屋idの生成 */
function generateId() {
  return 'room_' + randomUUID();
}

/** 質問の生成 */
function selectRandomQuestions(questions, count = 2) {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/** 役割割り振り結果の生成 */
async function generateRoleAssignmentResults(roomId, answerData) {
  try {
    console.log(`Generating role assignments for room: ${roomId}`);
    
    const roleAssignmentResults = await assignRolesForRoom(answerData);
    
    const result = {
      results: roleAssignmentResults,
      generatedAt: new Date().toISOString()
    };
    
    results.set(roomId, result);
    console.log(`Role assignments generated successfully for room: ${roomId}`);
  } catch (error) {
    console.error(`Failed to generate role assignments for room ${roomId}:`, error);
    
    // エラーが発生した場合もエラー情報を保存
    const errorResult = {
      error: 'Failed to generate role assignments',
      message: error.message,
      generatedAt: new Date().toISOString()
    };
    
    results.set(roomId, errorResult);
  }
}

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

// POST /rooms - 新しい部屋を作成
app.post('/rooms', (req, res) => {
  try {
    const { capacity } = req.body;
    
    // バリデーション
    if (!capacity || typeof capacity !== 'number' || capacity < 2 || capacity > 10) {
      return res.status(400).json({
        error: 'Invalid capacity value',
        code: 'INVALID_PARAMETER'
      });
    }

    const roomId = generateId();
    const selectedQuestions = selectRandomQuestions(defaultQuestions, 1); // TODO: 問題数の調整
    
    const room = {
      id: roomId,
      capacity: capacity,
      questions: selectedQuestions,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    rooms.set(roomId, room);
    answers.set(roomId, []);

    res.status(201).json({
      id: roomId,
      url: `page/url/${roomId}`
    });

  } catch (error) {
    console.error('Room creation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /rooms/{id} - 特定の部屋の情報を取得
app.get('/rooms/:id', (req, res) => {
  try {
    const roomId = req.params.id;
    const room = rooms.get(roomId);

    if (!room) {
      return res.status(404).json({
        error: 'Room not found',
        code: 'RESOURCE_NOT_FOUND'
      });
    }

    res.json({
      id: room.id,
      capacity: room.capacity,
      questions: room.questions
    });

  } catch (error) {
    console.error('Room retrieval error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// POST /rooms/{id}/answers - 特定の部屋に回答を提出
app.post('/rooms/:id/answers', async (req, res) => {
  try {
    const roomId = req.params.id;
    const {
      name,
      birthdate,
      age,
      hometown,
      affiliation,
      aspiration,
      answers: userAnswers
    } = req.body;

    // 部屋の存在確認
    const room = rooms.get(roomId);
    if (!room) {
      return res.status(404).json({
        error: 'Room not found',
        code: 'RESOURCE_NOT_FOUND'
      });
    }

    // バリデーション
    if (!name || !birthdate || !age || !hometown || !affiliation || !aspiration || !userAnswers) {
      return res.status(400).json({
        error: 'Missing required fields',
        code: 'INVALID_PARAMETER'
      });
    }

    // 回答の形式をチェック
    const requiredQuestionIds = room.questions.map(q => q.questionId);
    const providedQuestionIds = userAnswers.map(a => a.questionId);


    // 回答必須チェック: 部屋に設定された質問に全て答えているか
    for (const requiredId of requiredQuestionIds) {
      if (!providedQuestionIds.includes(requiredId)) {
        return res.status(400).json({
          error: `Missing answer for question: ${requiredId}`,
          code: 'INVALID_PARAMETER'
        });
      }
    }

    // 現在の回答数をチェック
    const currentAnswers = answers.get(roomId) || [];
    if (currentAnswers.length >= room.capacity) {
      return res.status(400).json({
        error: 'Room is full',
        code: 'ROOM_FULL'
      });
    }
    
    for (const requiredId of requiredQuestionIds) {
      if (!providedQuestionIds.includes(requiredId)) {
        return res.status(400).json({
          error: `Missing answer for question: ${requiredId}`,
          code: 'INVALID_PARAMETER'
        });
      }
    }

    const answerData = {
      name,
      birthdate,
      age,
      hometown,
      affiliation,
      aspiration,
      answers: userAnswers,
      submittedAt: new Date().toISOString()
    };

    currentAnswers.push(answerData);
    answers.set(roomId, currentAnswers);

    // 部屋が満員になった場合、結果を生成
    if (currentAnswers.length === room.capacity) {
      console.log("結果が揃いました。");
      console.log("全ての回答:", currentAnswers);
      
      // 非同期で結果を生成（レスポンスを遅延させないため）
      generateRoleAssignmentResults(roomId, currentAnswers);
    }

    res.status(201).json({
      roomId: roomId,
      submittedAt: answerData.submittedAt,
      status: 'accepted'
    });

  } catch (error) {
    console.error('Answer submission error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /rooms/{id}/results - 特定の部屋の結果を取得
app.get('/rooms/:id/results', (req, res) => {
  try {
    const roomId = req.params.id;
    
    // 部屋の存在確認
    const room = rooms.get(roomId);
    if (!room) {
      return res.status(404).json({
        error: 'Room not found',
        code: 'RESOURCE_NOT_FOUND'
      });
    }

    // 結果が生成されているかチェック
    const result = results.get(roomId);
    const currentAnswers = answers.get(roomId) || [];

    if (result) {
      // 結果が生成されている場合
      if (result.error) {
        // エラーが発生していた場合
        res.status(500).json({
          roomId: roomId,
          status: 'error',
          generatedAt: result.generatedAt,
          error: result.error,
          message: result.message
        });
      } else {
        // 正常に結果が生成されている場合
        res.json({
          roomId: roomId,
          status: 'completed',
          generatedAt: result.generatedAt,
          participants: result.results.length,
          results: result.results
        });
      }
    } else {
      // 結果が生成されていない場合
      const remainingParticipants = room.capacity - currentAnswers.length;
      let message;
      
      if (remainingParticipants === 1) {
        message = '残り一人です。';
      } else if (remainingParticipants > 1) {
        message = `残り${remainingParticipants}人です。`;
      } else {
        message = '結果を生成中です。';
      }

      res.json({
        roomId: roomId,
        status: 'processing',
        message: message,
        estimatedCompletionTime: new Date(Date.now() + 60000).toISOString() // 1分後
      });
    }

  } catch (error) {
    console.error('Results retrieval error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
  console.log(`📍 API endpoints:`);
  console.log(`   POST /api/roles/assign - Assign roles to team members`);
  console.log(`   GET  /api/roles - Get available roles`);
  console.log(`   GET  /api/health - Health check`);
  console.log(`Allowed CORS origin: ${allowedOrigin}`);
});