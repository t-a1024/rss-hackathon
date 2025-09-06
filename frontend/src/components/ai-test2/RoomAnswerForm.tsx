import React, { useState, useEffect } from 'react';
import type { Room, UserAnswer, SubmitAnswerResponse } from '../../types/room-api';

interface RoomAnswerFormProps {
  room: Room;
  onAnswerSubmitted: (response: SubmitAnswerResponse) => void;
}

export default function RoomAnswerForm({ room, onAnswerSubmitted }: RoomAnswerFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    birthdate: '',
    age: '',
    hometown: '',
    affiliation: '',
    aspiration: ''
  });

  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 部屋の質問に対応する回答を初期化
  useEffect(() => {
    const initialAnswers = room.questions.map(q => ({
      questionId: q.questionId,
      answer: ''
    }));
    setAnswers(initialAnswers);
  }, [room.questions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => prev.map(a => 
      a.questionId === questionId ? { ...a, answer } : a
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    if (!formData.name || !formData.birthdate || !formData.age || 
        !formData.hometown || !formData.affiliation || !formData.aspiration) {
      setError('全ての個人情報項目を入力してください');
      return;
    }

    if (answers.some(a => !a.answer.trim())) {
      setError('全ての質問に回答してください');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/rooms/${room.id}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          birthdate: formData.birthdate,
          age: parseInt(formData.age),
          hometown: formData.hometown,
          affiliation: formData.affiliation,
          aspiration: formData.aspiration,
          answers: answers
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: SubmitAnswerResponse = await response.json();
      onAnswerSubmitted(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      border: '2px solid #28a745',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#f8fff9'
    }}>
      <h2>📝 回答フォーム (部屋ID: {room.id})</h2>
      <p><strong>定員:</strong> {room.capacity}人</p>
      
      <form onSubmit={handleSubmit}>
        {/* 個人情報 */}
        <h3>👤 個人情報</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>名前 *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="例: 田中太郎"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>誕生日 *</label>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>年齢 *</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="例: 25"
              min="1"
              max="100"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>出身 *</label>
            <input
              type="text"
              name="hometown"
              value={formData.hometown}
              onChange={handleInputChange}
              placeholder="例: 東京都"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>所属 *</label>
            <input
              type="text"
              name="affiliation"
              value={formData.affiliation}
              onChange={handleInputChange}
              placeholder="例: ○○大学 情報学部 / ○○株式会社 開発部"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>意気込み *</label>
            <textarea
              name="aspiration"
              value={formData.aspiration}
              onChange={handleInputChange}
              placeholder="チームでの活動に対する意気込みや、どんな貢献をしたいかを教えてください"
              rows={3}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>
        </div>

        {/* 質問への回答 */}
        <h3>❓ 質問への回答</h3>
        {room.questions.map((question) => (
          <div key={question.questionId} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              {question.question} *
            </label>
            <textarea
              value={answers.find(a => a.questionId === question.questionId)?.answer || ''}
              onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
              placeholder="あなたの回答を入力してください"
              rows={3}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>
        ))}

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

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? '🔄 送信中...' : '📤 回答を送信'}
        </button>
      </form>
    </div>
  );
}