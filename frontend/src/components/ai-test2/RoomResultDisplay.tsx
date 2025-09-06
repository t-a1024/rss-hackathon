import React, { useState, useEffect } from 'react';
import type { RoomResultResponse } from '../../types/room-api';

interface RoomResultDisplayProps {
  roomId: string;
}

export default function RoomResultDisplay({ roomId }: RoomResultDisplayProps) {
  const [result, setResult] = useState<RoomResultResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/rooms/${roomId}/results`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RoomResultResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // 自動更新は削除（手動更新のみ）

  return (
    <div style={{
      border: '2px solid #17a2b8',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#f1f9fc'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2>📊 結果表示 (部屋ID: {roomId})</h2>
        <button
          onClick={fetchResults}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#6c757d' : '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? '🔄 読み込み中...' : '👁️ 結果を見る'}
        </button>
      </div>

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

      {result && (
        <div>
          <div style={{
            padding: '10px',
            backgroundColor: result.status === 'completed' ? '#d4edda' : 
                           result.status === 'error' ? '#f8d7da' : '#d1ecf1',
            border: `1px solid ${result.status === 'completed' ? '#c3e6cb' : 
                                result.status === 'error' ? '#f5c6cb' : '#bee5eb'}`,
            borderRadius: '5px',
            marginBottom: '15px'
          }}>
            <strong>ステータス:</strong> {
              result.status === 'completed' ? '✅ 完了' :
              result.status === 'error' ? '❌ エラー' :
              '⏳ 処理中'
            }
            {result.generatedAt && (
              <span style={{ marginLeft: '10px', fontSize: '14px', color: '#666' }}>
                ({new Date(result.generatedAt).toLocaleString()})
              </span>
            )}
          </div>

          {result.status === 'completed' && result.results && (
            <div>
              <h3>🎯 AI役割割り振り結果 ({result.participants}人)</h3>
              {result.results.map((assignment, index) => (
                <div key={index} style={{
                  margin: '15px 0',
                  padding: '15px',
                  border: '2px solid #28a745',
                  borderRadius: '8px',
                  backgroundColor: '#d4edda'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <strong style={{ fontSize: '18px' }}>
                      {assignment.name} ({assignment.age}歳)
                    </strong>
                    <span style={{
                      marginLeft: '10px',
                      padding: '2px 8px',
                      backgroundColor: '#17a2b8',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}>
                      {assignment.hometown}出身
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                    🏢 {assignment.affiliation}
                  </div>
                  
                  <div style={{ marginBottom: '10px', fontSize: '24px', fontWeight: 'bold', color: '#155724' }}>
                    🎯 {assignment.roleTitle} ({assignment.roleTitleEnglish}) [ID: {assignment.roleId}]
                  </div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <strong>💭 意気込み:</strong>
                    <div style={{ fontStyle: 'italic', color: '#555' }}>{assignment.aspiration}</div>
                  </div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <strong>🔍 理由:</strong>
                    <div style={{ color: '#155724' }}>{assignment.reason}</div>
                  </div>
                  
                  <div>
                    <strong>💡 アドバイス:</strong>
                    <div style={{ color: '#0c5460' }}>{assignment.tips}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {result.status === 'processing' && (
            <div style={{
              padding: '15px',
              backgroundColor: '#d1ecf1',
              border: '1px solid #bee5eb',
              borderRadius: '5px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>⏳ {result.message}</div>
              {result.estimatedCompletionTime && (
                <div style={{ fontSize: '14px', color: '#666' }}>
                  予想完了時刻: {new Date(result.estimatedCompletionTime).toLocaleString()}
                </div>
              )}
              <div style={{ fontSize: '14px', color: '#0c5460', marginTop: '10px' }}>
                「結果を見る」ボタンを押して最新の状況を確認してください。
              </div>
            </div>
          )}

          {result.status === 'error' && (
            <div style={{
              padding: '15px',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              border: '1px solid #f5c6cb',
              borderRadius: '5px'
            }}>
              <strong>エラーが発生しました:</strong> {result.error || result.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}