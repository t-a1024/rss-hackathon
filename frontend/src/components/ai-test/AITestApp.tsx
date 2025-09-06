import { useState } from 'react';
import type { TeamMember, TeamRoleAssignmentResponse } from '../../types/api';
import MemberForm from './MemberForm';
import MemberList from './MemberList';
import RoleAssignmentButton from './RoleAssignmentButton';
import ResultDisplay from './ResultDisplay';

function AITestApp() {
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
      <h1>🤖 AI役割割り振りシステム（テスト版）</h1>
      
      <MemberForm 
        formData={formData}
        onSubmit={handleSubmit}
        onChange={handleChange}
      />

      <MemberList 
        members={members}
        onClearMembers={clearMembers}
      />

      <RoleAssignmentButton 
        loading={loading}
        membersCount={members.length}
        onAssignRoles={handleRoleAssignment}
      />

      <ResultDisplay 
        result={result}
        error={error}
      />
    </div>
  );
}

export default AITestApp;