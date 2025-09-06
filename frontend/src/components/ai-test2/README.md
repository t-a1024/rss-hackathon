# AI Test2 Components - Room API Testing

`assignRolesForRoom(answerData)`を使用した新形式のAPI をテストするためのコンポーネント集です。

## 使用方法

```tsx
import { RoomTestApp } from './components/ai-test2';

// App.tsxで使用する場合
function App() {
  return <RoomTestApp />;
}
```

## テスト手順

1. **部屋作成**: 参加人数を設定して部屋を作成
2. **回答入力**: 参加者分（テスト用に1人で複数人分）の回答を入力
3. **AI分析**: 定員が満たされると自動的に`assignRolesForRoom`が実行
4. **結果確認**: 新形式のAPI結果（roleId, roleTitle, roleTitleEnglish, reason, tips）を表示

## コンポーネント一覧

- `RoomTestApp` - 完全なテストアプリケーション
- `RoomCreator` - 部屋作成コンポーネント  
- `RoomAnswerForm` - 回答フォーム（個人情報＋質問回答）
- `RoomResultDisplay` - 結果表示（自動更新機能付き）

## API エンドポイント

- `POST /rooms` - 部屋作成
- `GET /rooms/{id}` - 部屋情報取得
- `POST /rooms/{id}/answers` - 回答提出
- `GET /rooms/{id}/results` - 結果取得（新形式）

## 新形式の出力フィールド

- `roleId`: 数値形式の役割ID ("1", "2", ...)
- `roleTitle`: 日本語役割名 ("開拓者", "灯台守", ...)
- `roleTitleEnglish`: 英語役割名 ("Pioneer", "Lighthouse Keeper", ...)
- `reason`: AI分析による詳細な理由
- `tips`: 役割を果たすためのアドバイス

## バックエンド要件

- `http://localhost:3000` でバックエンドが起動している必要があります
- 新しい部屋関連のエンドポイントが実装されている必要があります