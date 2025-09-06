import { useState } from 'react';
import type { TeamMember, TeamRoleAssignmentResponse } from './types/api';

function App() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [result, setResult] = useState<TeamRoleAssignmentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // フォーム入力用の状態
  const [formData, setFormData] = useState({
    name: '',
    birthday: '',
    age: '',
    hometown: '',
    organization: '',
    motivation: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.birthday || !formData.age || !formData.hometown || !formData.organization || !formData.motivation) {
      alert('全ての項目を入力してください');
      return;
    }

    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: formData.name,
      birthday: formData.birthday,
      age: parseInt(formData.age),
      hometown: formData.hometown,
      organization: formData.organization,
      motivation: formData.motivation
    };

    setMembers(prev => [...prev, newMember]);
    setFormData({
      name: '',
      birthday: '',
      age: '',
      hometown: '',
      organization: '',
      motivation: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleAssignment = async () => {
    if (members.length === 0) {
      setError('最低1人のメンバーを追加してください');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:3000/api/roles/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ members })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const clearMembers = () => {
    setMembers([]);
    setResult(null);
    setError(null);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🤖 AI役割割り振りシステム</h1>
      
      {/* メンバー追加フォーム */}
      <div style={{ 
        border: '2px solid #007bff', 
        borderRadius: '10px', 
        padding: '20px', 
        marginBottom: '20px',
        backgroundColor: '#f8f9fa'
      }}>
        <h2>👥 チームメンバー追加</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>名前 *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
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
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                name="organization"
                value={formData.organization}
                onChange={handleChange}
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
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
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
          
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            ➕ メンバーを追加
          </button>
        </form>
      </div>

      {/* 追加されたメンバー一覧 */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>📝 追加されたメンバー ({members.length}人)</h2>
          {members.length > 0 && (
            <button
              onClick={clearMembers}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              全てクリア
            </button>
          )}
        </div>
        
        {members.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>まだメンバーが追加されていません</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {members.map((member, index) => (
              <div 
                key={member.id} 
                style={{
                  padding: '12px',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '16px', color: '#333' }}>
                    {index + 1}. {member.name} ({member.age}歳)
                  </strong>
                  <span style={{ 
                    marginLeft: '10px', 
                    padding: '2px 8px', 
                    backgroundColor: '#e9ecef', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    color: '#666'
                  }}>
                    {member.hometown}出身
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                  🏢 {member.organization}
                </div>
                <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.4' }}>
                  💭 {member.motivation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI役割割り振り実行 */}
      <div style={{ marginBottom: '30px' }}>
        <h2>🚀 AI役割割り振り実行</h2>
        <button 
          onClick={handleRoleAssignment}
          disabled={loading || members.length === 0}
          style={{
            padding: '15px 30px',
            backgroundColor: loading || members.length === 0 ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading || members.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? '🤖 AI分析中...' : members.length === 0 ? '👥 メンバーを追加してください' : '🎯 役割を割り振る'}
        </button>
      </div>

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

      {/* 結果表示 */}
      {result && (
        <div style={{ marginTop: '20px' }}>
          <h2>✨ AI分析結果</h2>
          
          <h3>👤 役割割り振り結果</h3>
          {result.assignments.map((assignment, index) => (
            <div key={index} style={{
              margin: '15px 0',
              padding: '15px',
              border: '2px solid #28a745',
              borderRadius: '8px',
              backgroundColor: '#d4edda'
            }}>
              <strong>🎯 {assignment.memberName}</strong> → <strong>{assignment.roleTitle}</strong>
              <br />
              <span style={{ color: '#155724', fontWeight: 'bold' }}>
                マッチ度: {assignment.matchScore}/100点
              </span>
              <br />
              <div style={{ marginTop: '8px', fontStyle: 'italic' }}>
                💭 理由: {assignment.reasoning}
              </div>
            </div>
          ))}

          <h3>📈 チーム全体分析</h3>
          <div style={{
            padding: '15px',
            backgroundColor: '#d1ecf1',
            border: '1px solid #bee5eb',
            borderRadius: '5px',
            marginBottom: '15px'
          }}>
            {result.teamAnalysis}
          </div>

          <h3>💡 推奨事項</h3>
          <ul>
            {result.recommendations.map((rec, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;