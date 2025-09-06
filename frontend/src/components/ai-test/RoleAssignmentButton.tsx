import React from 'react';

interface RoleAssignmentButtonProps {
  loading: boolean;
  membersCount: number;
  onAssignRoles: () => void;
}

export default function RoleAssignmentButton({ loading, membersCount, onAssignRoles }: RoleAssignmentButtonProps) {
  return (
    <div style={{ marginBottom: '30px' }}>
      <h2>🚀 AI役割割り振り実行</h2>
      <button 
        onClick={onAssignRoles}
        disabled={loading || membersCount === 0}
        style={{
          padding: '15px 30px',
          backgroundColor: loading || membersCount === 0 ? '#6c757d' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading || membersCount === 0 ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {loading ? '🤖 AI分析中...' : membersCount === 0 ? '👥 メンバーを追加してください' : '🎯 役割を割り振る'}
      </button>
    </div>
  );
}