import { useState } from 'react';
import type { CreateRoomResponse } from '../../types/room-api';

interface RoomCreatorProps {
  onRoomCreated: (room: CreateRoomResponse) => void;
}

export default function RoomCreator({ onRoomCreated }: RoomCreatorProps) {
  const [capacity, setCapacity] = useState<number>(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateRoom = async () => {
    if (capacity < 2 || capacity > 10) {
      setError('参加人数は2-10人の範囲で設定してください');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ capacity })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CreateRoomResponse = await response.json();
      onRoomCreated(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      border: '2px solid #007bff',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#f8f9fa'
    }}>
      <h2>🏠 部屋作成</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          参加人数 (2-10人)
        </label>
        <input
          type="number"
          min="2"
          max="10"
          value={capacity}
          onChange={(e) => setCapacity(parseInt(e.target.value))}
          style={{
            width: '100px',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
      </div>

      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          marginBottom: '15px'
        }}>
          <strong>❌ エラー:</strong> {error}
        </div>
      )}

      <button
        onClick={handleCreateRoom}
        disabled={loading}
        style={{
          padding: '12px 24px',
          backgroundColor: loading ? '#6c757d' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        {loading ? '🔄 作成中...' : '🏠 部屋を作成'}
      </button>
    </div>
  );
}