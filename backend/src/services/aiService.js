import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIService {
  constructor() {
    this.genAI = null;
    this.model = null;
  }

  initializeAI() {
    if (this.genAI) return;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async assignRoles(members, roles) {
    this.initializeAI();
    const prompt = this.createRoleAssignmentPrompt(members, roles);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseAIResponse(text, members, roles);
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate role assignments');
    }
  }

  createRoleAssignmentPrompt(members, roles) {
    const membersText = members.map(member => `
Name: ${member.name}
Birthday: ${member.birthday}
Age: ${member.age}
Hometown: ${member.hometown}
Organization: ${member.organization}
Motivation: ${member.motivation}
    `).join('\n---\n');

    const rolesText = roles.map(role => `
Title: ${role.title} (${role.englishTitle})
Description: ${role.description}
    `).join('\n---\n');

    return `
あなたはチーム役割割り当ての専門AIアシスタントです。提供されたチームメンバーの自己紹介と利用可能な役割に基づいて、各メンバーに最も適した役割を1つずつ割り当ててください。

チームメンバー:
${membersText}

利用可能な役割:
${rolesText}

以下の形式のJSONオブジェクトで回答してください:
{
  "assignments": [
    {
      "memberId": "member_id",
      "memberName": "member_name",
      "roleId": "role_id", 
      "roleTitle": "role_title",
      "matchScore": 0から100の数値,
      "reasoning": "この割り当ての詳細な理由説明"
    }
  ],
  "teamAnalysis": "チーム全体の構成と強みに関する分析",
  "recommendations": ["推奨事項1", "推奨事項2", "..."]
}

割り当て時に考慮すべき要因:
1. メンバーの出身地や年齢から推測される価値観や視点の多様性
2. 所属組織から推測される専門性や経験
3. 意気込みから読み取れる性格や志向性
4. 各役割の特性とメンバーの個性のマッチング
5. チーム全体のバランスと補完関係

各役割の特性:
- 開拓者(Pioneer): 新しいことに挑戦し、道を切り開く積極性
- 灯台守(Lighthouse Keeper): チームを導く指導力とビジョン
- 地図職人(Cartographer): 物事を整理し、構造化する能力
- 調停者(Mediator): 人の間を取り持つコミュニケーション能力
- 記録者(Chronicler): 詳細を記録し、情報を管理する能力
- 旅人(Traveler): 自由な発想と柔軟な視点
- 発明家(Inventor): 具体的な解決策を生み出す創造性

必ず各メンバーに1つずつ異なる役割を割り当て、適合度を0-100のスコアで示し、詳細な理由を日本語で説明してください。
    `;
  }

  parseAIResponse(text, members, roles) {
    try {
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleanedText);
      
      const assignments = parsed.assignments.map((assignment) => ({
        memberId: assignment.memberId,
        memberName: assignment.memberName,
        roleId: assignment.roleId,
        roleTitle: assignment.roleTitle,
        matchScore: Math.min(100, Math.max(0, assignment.matchScore)),
        reasoning: assignment.reasoning || 'No reasoning provided'
      }));

      return {
        assignments,
        teamAnalysis: parsed.teamAnalysis || 'No team analysis provided',
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : []
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return this.generateFallbackResponse(members, roles);
    }
  }

  generateFallbackResponse(members, roles) {
    const assignments = members.map((member, index) => {
      const role = roles[index % roles.length];
      return {
        memberId: member.id,
        memberName: member.name,
        roleId: role.id,
        roleTitle: role.title,
        matchScore: 50,
        reasoning: 'Fallback assignment due to AI processing error'
      };
    });

    return {
      assignments,
      teamAnalysis: 'Team analysis unavailable due to AI processing error',
      recommendations: ['Please review assignments manually', 'Consider re-running the assignment process']
    };
  }
}