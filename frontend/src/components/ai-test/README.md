# AI Test Components

AI役割割り振り機能のテスト用コンポーネント集です。

## 使用方法

メインアプリに影響を与えずにAI機能をテストしたい場合：

```tsx
import { AITestApp } from './components/ai-test';

// App.tsxで使用する場合
function App() {
  return <AITestApp />;
}
```

## コンポーネント一覧

- `AITestApp` - AI機能の完全なテストアプリ
- `MemberForm` - メンバー追加フォーム
- `MemberList` - メンバー一覧表示
- `RoleAssignmentButton` - AI役割割り振り実行ボタン
- `ResultDisplay` - 結果・エラー表示

## バックエンド要件

- `/api/roles/assign` エンドポイントが利用可能である必要があります

## マージ時の注意

このフォルダは独立しているため、他の人の変更とコンフリクトしにくい構造になっています。