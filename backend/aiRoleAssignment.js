const { GoogleGenerativeAI } = require('@google/generative-ai');

// 利用可能な役割の定義
const availableRoles = [
  { id: '1', title: '開拓者', englishTitle: 'Pioneer', description: '新しい道を切り開く人' },
  { id: '2', title: '灯台守', englishTitle: 'Lighthouse Keeper', description: 'チームの進むべき道を照らす人' },
  { id: '3', title: '地図職人', englishTitle: 'Cartographer', description: '議論の全体像を描き、整理する人' },
  { id: '4', title: '調停者', englishTitle: 'Mediator', description: '意見の対立を調整し、合意を形成する人' },
  { id: '5', title: '記録者', englishTitle: 'Chronicler', description: 'チームの歩みを記録し、記憶する人' },
  { id: '6', title: '旅人', englishTitle: 'Traveler', description: '自由な視点で、新しい風を吹き込む人' },
  { id: '7', title: '発明家', englishTitle: 'Inventor', description: '具体的な解決策や仕組みを生み出す人' }
];

// Google AI インスタンスを初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * 部屋の回答データから役割を割り振る（新形式）
 * @param {Array} answerData - 回答データの配列
 * @returns {Array} 役割割り振り結果
 */
async function assignRolesForRoom(answerData) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
以下の参加者情報と回答を分析し、それぞれに最適な役割を割り振ってください。

利用可能な役割:
${availableRoles.map(role => `- ${role.id}: ${role.title} (${role.englishTitle}): ${role.description}`).join('\n')}

参加者情報と回答:
${answerData.map((data, index) => `
${index + 1}. ${data.name} (${data.age}歳)
   誕生日: ${data.birthdate}
   出身: ${data.hometown}
   所属: ${data.affiliation}
   意気込み: ${data.aspiration}
   回答: ${data.answers.map(a => `${a.questionId}: ${a.answer}`).join(', ')}
`).join('')}

以下のJSONフォーマットで回答してください:
[
  {
    "name": "参加者名",
    "birthdate": "誕生日",
    "age": 年齢,
    "hometown": "出身地",
    "affiliation": "所属",
    "aspiration": "意気込み",
    "roleId": "役割ID",
    "roleTitle": "役割名",
    "roleTitleEnglish": "英語役割名",
    "reason": "なぜその役割が適しているかの詳細な理由",
    "tips": "司会、書記、タイムキーパー、発表者、アイデアマン、情報収集・分析役のうちどのタスクを担うのがおすすめなのかと実践的なアドバイスを記載してください"
  }
]

重要な点:
- 各参加者には異なる役割を割り振ってください
- 参加者の回答内容、意気込み、背景を考慮してください
- reasonには具体的で説得力のある理由を記載してください
- tipsでは司会、書記、発表者にチームの誰か一人はおすすめされるようにしてください。ただし、チーム内でおすすめのタスクが被らないようにしてください。
- 役割,reason,tipsのタスクはそれぞれのメンバーで一貫性のある内容にしてください
- reason,tipsでマイナスの内容を言わないようにしてください
- 日本語で回答してください
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
        
    // JSONの抽出処理を改善
    let jsonString = '';
    
    // ```json ブロックから抽出を試行
    const jsonBlockMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch && jsonBlockMatch[1]) {
      jsonString = jsonBlockMatch[1].trim();
    } else {
      // ```json ブロックがない場合、[ ] で囲まれた部分を抽出
      const jsonArrayMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonArrayMatch) {
        jsonString = jsonArrayMatch[0].trim();
      } else {
        throw new Error('AI response does not contain valid JSON array format');
      }
    }
    
    if (!jsonString) {
      throw new Error('Failed to extract JSON from AI response');
    }

    const aiResponse = JSON.parse(jsonString);
    
    // レスポンスの形式を検証
    if (!Array.isArray(aiResponse)) {
      throw new Error('AI response should be an array');
    }

    return aiResponse;
  } catch (error) {
    console.error('AI role assignment error:', error);
    
    // AIが失敗した場合のフォールバック機能
    return getFallbackAssignmentForRoom(answerData);
  }
}

/**
 * AIを使用してチームメンバーに役割を割り振る（従来形式）
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
 * 新形式用のフォールバック役割割り振り
 * @param {Array} answerData - 回答データの配列
 * @returns {Array} 役割割り振り結果
 */
function getFallbackAssignmentForRoom(answerData) {
  return answerData.map((data, index) => {
    const role = availableRoles[index % availableRoles.length];
    
    return {
      name: data.name,
      birthdate: data.birthdate,
      age: data.age,
      hometown: data.hometown,
      affiliation: data.affiliation,
      aspiration: data.aspiration,
      roleId: role.id,
      roleTitle: role.title,
      roleTitleEnglish: role.englishTitle,
      reason: `${data.name}さんの意気込み「${data.aspiration}」から、${role.description}として活躍できると判断しました。`,
      tips: `${role.title}として、チームの中で${role.description}役割を意識して行動してください。`
    };
  });
}

/**
 * AIが使用できない場合のフォールバック役割割り振り（従来形式）
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
  assignRolesForRoom,
  getAvailableRoles
};