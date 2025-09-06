import React, { useState } from 'react';
import { apiClient } from '../api/roleApi';
import { MemberForm } from './MemberForm';
import type { TeamMember, Role, TeamRoleAssignmentResponse } from '../types/api';

const availableRoles: Role[] = [
  {
    id: 'pioneer',
    title: '開拓者',
    englishTitle: 'Pioneer',
    description: '新しい道を切り開く人'
  },
  {
    id: 'lighthouse-keeper',
    title: '灯台守',
    englishTitle: 'Lighthouse Keeper',
    description: 'チームの進むべき道を照らす人'
  },
  {
    id: 'cartographer',
    title: '地図職人',
    englishTitle: 'Cartographer',
    description: '議論の全体像を描き、整理する人'
  },
  {
    id: 'mediator',
    title: '調停者',
    englishTitle: 'Mediator',
    description: '意見の対立を調整し、合意を形成する人'
  },
  {
    id: 'chronicler',
    title: '記録者',
    englishTitle: 'Chronicler',
    description: 'チームの歩みを記録し、記憶する人'
  },
  {
    id: 'traveler',
    title: '旅人',
    englishTitle: 'Traveler',
    description: '自由な視点で、新しい風を吹き込む人'
  },
  {
    id: 'inventor',
    title: '発明家',
    englishTitle: 'Inventor',
    description: '具体的な解決策や仕組みを生み出す人'
  }
];

export const RoleAssignmentTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TeamRoleAssignmentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);

  const handleHealthCheck = async () => {
    try {
      setError(null);
      const health = await apiClient.healthCheck();
      setHealthStatus(`✅ ${health.status} - ${health.service}`);
    } catch (err) {
      setHealthStatus(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleAddMember = (member: TeamMember) => {
    setMembers(prev => [...prev, member]);
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
      const response = await apiClient.assignRoles({
        members: members,
        availableRoles: availableRoles
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🤖 AI役割割り振りシステム</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>📊 ヘルスチェック</h2>
        <button 
          onClick={handleHealthCheck}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          サーバー状態確認
        </button>
        {healthStatus && (
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            {healthStatus}
          </div>
        )}
      </div>

      <MemberForm onAddMember={handleAddMember} members={members} />

      <div style={{ marginBottom: '30px' }}>
        <h2>🎭 利用可能な役割</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
          {availableRoles.map(role => (
            <div key={role.id} style={{ 
              padding: '15px', 
              border: '2px solid #6c757d', 
              borderRadius: '8px',
              backgroundColor: '#f8f9fa'
            }}>
              <strong style={{ fontSize: '18px', color: '#495057' }}>
                {role.title} ({role.englishTitle})
              </strong>
              <br />
              <div style={{ marginTop: '8px', color: '#6c757d', lineHeight: '1.4' }}>
                {role.description}
              </div>
            </div>
          ))}
        </div>
      </div>

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
};