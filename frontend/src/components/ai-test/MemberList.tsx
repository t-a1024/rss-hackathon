import React from 'react';
import type { TeamMember } from '../types/api';

interface MemberListProps {
  members: TeamMember[];
  onClearMembers: () => void;
}

export default function MemberList({ members, onClearMembers }: MemberListProps) {
  return (
    <div style={{ marginBottom: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>📝 追加されたメンバー ({members.length}人)</h2>
        {members.length > 0 && (
          <button
            onClick={onClearMembers}
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
  );
}