import  { useState } from 'react';
import type { CreateRoomResponse, Room, SubmitAnswerResponse } from '../../types/room-api';
import RoomCreator from './RoomCreator';
import RoomAnswerForm from './RoomAnswerForm';
import RoomResultDisplay from './RoomResultDisplay';

export default function RoomTestApp() {
  const [currentRoom, setCurrentRoom] = useState<CreateRoomResponse | null>(null);
  const [roomDetails, setRoomDetails] = useState<Room | null>(null);
  const [submittedAnswers, setSubmittedAnswers] = useState<SubmitAnswerResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoomCreated = async (room: CreateRoomResponse) => {
    setCurrentRoom(room);
    
    // 部屋の詳細情報を取得
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/rooms/${room.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const roomData: Room = await response.json();
      setRoomDetails(roomData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch room details');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmitted = (response: SubmitAnswerResponse) => {
    setSubmittedAnswers(prev => [...prev, response]);
  };

  const resetTest = () => {
    setCurrentRoom(null);
    setRoomDetails(null);
    setSubmittedAnswers([]);
    setError(null);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>🧪 部屋API テストアプリ (assignRolesForRoom)</h1>
        {currentRoom && (
          <button
            onClick={resetTest}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔄 リセット
          </button>
        )}
      </div>

      {/* ステップ1: 部屋作成 */}
      {!currentRoom && (
        <>
          <div style={{
            padding: '15px',
            backgroundColor: '#e7f3ff',
            border: '1px solid #b3d9ff',
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            <h3>📋 テスト手順</h3>
            <ol>
              <li>部屋を作成します</li>
              <li>参加者分の回答フォームを入力します</li>
              <li>定員が満たされると自動的にAI分析が開始されます</li>
              <li>結果画面で新形式のAPI結果を確認できます</li>
            </ol>
          </div>
          <RoomCreator onRoomCreated={handleRoomCreated} />
        </>
      )}

      {/* エラー表示 */}
      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <strong>❌ エラー:</strong> {error}
        </div>
      )}

      {/* ローディング */}
      {loading && (
        <div style={{
          padding: '15px',
          backgroundColor: '#d1ecf1',
          border: '1px solid #bee5eb',
          borderRadius: '5px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          🔄 部屋情報を読み込み中...
        </div>
      )}

      {/* ステップ2: 回答フォーム */}
      {roomDetails && (
        <>
          <div style={{
            padding: '15px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            <h3>✅ 部屋が作成されました!</h3>
            <p><strong>部屋ID:</strong> {currentRoom?.id}</p>
            <p><strong>定員:</strong> {roomDetails.capacity}人</p>
            <p><strong>送信済み回答:</strong> {submittedAnswers.length}/{roomDetails.capacity}人</p>
            <p><strong>URL:</strong> {currentRoom?.url}</p>
          </div>

          {submittedAnswers.length < roomDetails.capacity ? (
            <>
              <div style={{
                padding: '10px',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '5px',
                marginBottom: '15px'
              }}>
                <strong>📝 参加者 {submittedAnswers.length + 1}/{roomDetails.capacity} の回答</strong>
                <br />
                <small>※ テスト用に複数人分の回答を1人で入力してください</small>
              </div>
              <RoomAnswerForm room={roomDetails} onAnswerSubmitted={handleAnswerSubmitted} />
            </>
          ) : (
            <div style={{
              padding: '15px',
              backgroundColor: '#d1ecf1',
              border: '1px solid #bee5eb',
              borderRadius: '5px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <h3>✅ 全ての回答が集まりました!</h3>
              <p>AI分析が開始されます。下の「結果を見る」ボタンで結果を確認してください。</p>
            </div>
          )}
        </>
      )}

      {/* ステップ3: 結果表示 */}
      {currentRoom && (
        <RoomResultDisplay roomId={currentRoom.id} />
      )}
    </div>
  );
}