# Team Role Assignment Backend API

AI-powered team role assignment service using Google's Gemini AI.

## Features

- AI-driven role assignment based on member skills, experience, and preferences
- RESTful API with TypeScript
- Input validation and error handling
- Health check endpoints
- CORS support for frontend integration

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

Add your Gemini API key to `.env`:
```
GEMINI_API_KEY=your_api_key_here
PORT=3001
NODE_ENV=development
```

### 3. Run the Server

Development:
```bash
npm run dev
```

Production:
```bash
npm run build
npm start
```

## API Endpoints

### POST `/api/roles/assign`

Assigns roles to team members using AI.

**Request Body:**
```json
{
  "members": [
    {
      "id": "1",
      "name": "田中太郎",
      "skills": ["JavaScript", "React", "Node.js"],
      "experience": "3年のフロントエンド開発経験",
      "interests": ["UI/UX", "パフォーマンス最適化"],
      "availability": "full-time",
      "preferredRoles": ["フロントエンド開発者"]
    }
  ],
  "availableRoles": [
    {
      "id": "1",
      "title": "フロントエンド開発者",
      "description": "Reactアプリケーションの開発を担当",
      "requiredSkills": ["JavaScript", "React", "CSS"],
      "responsibilities": ["UI実装", "コンポーネント設計"],
      "timeCommitment": "full-time"
    }
  ]
}
```

**Response:**
```json
{
  "assignments": [
    {
      "memberId": "1",
      "memberName": "田中太郎",
      "roleId": "1",
      "roleTitle": "フロントエンド開発者",
      "matchScore": 95,
      "reasoning": "JavaScriptとReactのスキルが役割要件と完全に一致し、UI/UXへの興味も関連している"
    }
  ],
  "teamAnalysis": "チーム全体の強みと構成の分析",
  "recommendations": ["推奨事項1", "推奨事項2"]
}
```

### GET `/api/roles/health`
Role service health check

### GET `/api/health`
General API health check

## Usage Example

```typescript
const response = await fetch('http://localhost:3001/api/roles/assign', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    members: [/* member data */],
    availableRoles: [/* role data */]
  })
});

const result = await response.json();
```

## Data Types

### TeamMember
- `id`: Unique identifier
- `name`: Member name
- `skills`: Array of skills
- `experience`: Experience description
- `interests`: Array of interests
- `availability`: 'full-time' | 'part-time' | 'limited'
- `preferredRoles`: Optional array of preferred role titles

### Role
- `id`: Unique identifier
- `title`: Role title
- `description`: Role description
- `requiredSkills`: Array of required skills
- `responsibilities`: Array of responsibilities
- `timeCommitment`: 'full-time' | 'part-time' | 'limited'

## Development

```bash
npm run dev    # Start development server with hot reload
npm run build  # Build TypeScript to JavaScript
npm run lint   # Run ESLint
```