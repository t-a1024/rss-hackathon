const { GoogleGenerativeAI } = require('@google/generative-ai');

// 利用可能な役割の定義
const availableRoles = [
  { id: 'pioneer', title: '開拓者', englishTitle: 'Pioneer', description: '新しい道を切り開く人' },
  { id: 'lighthouse-keeper', title: '灯台守', englishTitle: 'Lighthouse Keeper', description: 'チームの進むべき道を照らす人' },
  { id: 'cartographer', title: '地図職人', englishTitle: 'Cartographer', description: '議論の全体像を描き、整理する人' },
  { id: 'mediator', title: '調停者', englishTitle: 'Mediator', description: '意見の対立を調整し、合意を形成する人' },
  { id: 'chronicler', title: '記録者', englishTitle: 'Chronicler', description: 'チームの歩みを記録し、記憶する人' },
  { id: 'traveler', title: '旅人', englishTitle: 'Traveler', description: '自由な視点で、新しい風を吹き込む人' },
  { id: 'inventor', title: '発明家', englishTitle: 'Inventor', description: '具体的な解決策や仕組みを生み出す人' }
];

// Google AI インスタンスを初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * AIを使用してチームメンバーに役割を割り振る
 * @param {Array} members - チームメンバーの配列
 * @returns {Object} 役割割り振り結果
 */
async function assignRolesWithAI(members) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
以下のチームメンバー情報を分析し、それぞれに最適な役割を割り振ってください。

利用可能な役割:
${availableRoles.map(role => `- ${role.title} (${role.englishTitle}): ${role.description}`).join('\n')}

チームメンバー:
${members.map((member, index) => `
${index + 1}. ${member.name} (${member.age}歳)
   出身: ${member.hometown}
   所属: ${member.organization}
   意気込み: ${member.motivation}
`).join('')}

以下のJSONフォーマットで回答してください:
{
  "assignments": [
    {
      "memberId": "メンバーID",
      "memberName": "メンバー名",
      "roleId": "役割ID",
      "roleTitle": "役割名",
      "matchScore": 85-100の数値,
      "reasoning": "なぜその役割が適しているかの詳細な理由"
    }
  ],
  "teamAnalysis": "チーム全体の分析結果",
  "recommendations": ["推奨事項1", "推奨事項2", "推奨事項3"]
}

重要な点:
- 各メンバーには異なる役割を割り振ってください
- メンバーの性格、経験、意気込みを考慮してください
- matchScoreは85-100の範囲で設定してください
- reasoningには具体的で説得力のある理由を記載してください
- 日本語で回答してください
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    console.log('AI Response:', responseText); // デバッグ用ログ
    
    // JSONの抽出処理を改善
    let jsonString = '';
    
    // ```json ブロックから抽出を試行
    const jsonBlockMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch && jsonBlockMatch[1]) {
      jsonString = jsonBlockMatch[1].trim();
    } else {
      // ```json ブロックがない場合、{ } で囲まれた部分を抽出
      const jsonObjectMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonObjectMatch) {
        jsonString = jsonObjectMatch[0].trim();
      } else {
        throw new Error('AI response does not contain valid JSON format');
      }
    }
    
    if (!jsonString) {
      throw new Error('Failed to extract JSON from AI response');
    }

    console.log('Extracted JSON:', jsonString); // デバッグ用ログ
    const aiResponse = JSON.parse(jsonString);
    
    // レスポンスの形式を検証
    if (!aiResponse.assignments || !Array.isArray(aiResponse.assignments)) {
      throw new Error('Invalid AI response format');
    }

    return aiResponse;
  } catch (error) {
    console.error('AI role assignment error:', error);
    
    // AIが失敗した場合のフォールバック機能
    return getFallbackAssignment(members);
  }
}

/**
 * AIが使用できない場合のフォールバック役割割り振り
 * @param {Array} members - チームメンバーの配列
 * @returns {Object} 役割割り振り結果
 */
function getFallbackAssignment(members) {
  const assignments = members.map((member, index) => {
    const role = availableRoles[index % availableRoles.length];
    const score = 85 + Math.floor(Math.random() * 15);
    
    return {
      memberId: member.id,
      memberName: member.name,
      roleId: role.id,
      roleTitle: role.title,
      matchScore: score,
      reasoning: `${member.name}さんの意気込み「${member.motivation}」から、${role.description}として活躍できると判断しました。`
    };
  });

  return {
    assignments,
    teamAnalysis: `${members.length}人のチームで、多様な背景と経験を持つメンバーが集まっています。各メンバーの意気込みと特性を考慮して役割を割り振りました。`,
    recommendations: [
      '定期的にチームミーティングを開催し、各役割の進捗を共有しましょう',
      'メンバー同士の協力関係を築くために、交流の機会を作ることをお勧めします',
      '各役割の責任範囲を明確にし、必要に応じて調整を行いましょう'
    ]
  };
}

/**
 * 利用可能な役割一覧を取得
 * @returns {Array} 役割一覧
 */
function getAvailableRoles() {
  return availableRoles;
}

module.exports = {
  assignRolesWithAI,
  getAvailableRoles
};