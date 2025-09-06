import React from 'react';

interface MemberFormProps {
  formData: {
    name: string;
    birthday: string;
    age: string;
    hometown: string;
    organization: string;
    motivation: string;
  };
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function MemberForm({ formData, onSubmit, onChange }: MemberFormProps) {
  return (
    <div style={{ 
      border: '2px solid #007bff', 
      borderRadius: '10px', 
      padding: '20px', 
      marginBottom: '20px',
      backgroundColor: '#f8f9fa'
    }}>
      <h2>👥 チームメンバー追加</h2>
      <form onSubmit={onSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>名前 *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
  );
}