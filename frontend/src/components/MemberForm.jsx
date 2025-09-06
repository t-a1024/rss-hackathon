import React, { useState } from 'react';

export const MemberForm = ({ onAddMember, members }) => {
  const [formData, setFormData] = useState({
    name: '',
    birthday: '',
    age: '',
    hometown: '',
    organization: '',
    motivation: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.birthday || !formData.age || !formData.hometown || !formData.organization || !formData.motivation) {
      alert('全ての項目を入力してください');
      return;
    }

    const newMember = {
      id: `member-${Date.now()}`,
      name: formData.name,
      birthday: formData.birthday,
      age: parseInt(formData.age),
      hometown: formData.hometown,
      organization: formData.organization,
      motivation: formData.motivation
    };

    onAddMember(newMember);
    setFormData({
      name: '',
      birthday: '',
      age: '',
      hometown: '',
      organization: '',
      motivation: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ 
      border: '2px solid #007bff', 
      borderRadius: '10px', 
      padding: '20px', 
      marginBottom: '20px',
      backgroundColor: '#f8f9fa'
    }}>
      <h3>👥 チームメンバー追加</h3>
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
      
      <div style={{ marginTop: '20px' }}>
        <h4>📝 追加されたメンバー ({members.length}人)</h4>
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
    </div>
  );
};