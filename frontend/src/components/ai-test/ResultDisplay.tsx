import type { TeamRoleAssignmentResponse } from '../../types/api';

interface ResultDisplayProps {
  result: TeamRoleAssignmentResponse | null;
  error: string | null;
}

export default function ResultDisplay({ result, error }: ResultDisplayProps) {
  return (
    <>
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
    </>
  );
}