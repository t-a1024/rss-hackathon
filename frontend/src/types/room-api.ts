// 部屋API用の型定義
export interface Question {
  questionId: string;
  question: string;
}

export interface UserAnswer {
  questionId: string;
  answer: string;
}

export interface Room {
  id: string;
  capacity: number;
  questions: Question[];
}

export interface AnswerData {
  name: string;
  birthdate: string;
  age: number;
  hometown: string;
  affiliation: string;
  aspiration: string;
  answers: UserAnswer[];
}

export interface RoleAssignmentResult {
  name: string;
  birthdate: string;
  age: number;
  hometown: string;
  affiliation: string;
  aspiration: string;
  roleId: string;
  roleTitle: string;
  roleTitleEnglish: string;
  reason: string;
  tips: string;
}

export interface RoomResultResponse {
  roomId: string;
  status: 'completed' | 'processing' | 'error';
  generatedAt?: string;
  participants?: number;
  results?: RoleAssignmentResult[];
  message?: string;
  error?: string;
  estimatedCompletionTime?: string;
}

export interface CreateRoomRequest {
  capacity: number;
}

export interface CreateRoomResponse {
  id: string;
  url: string;
}

export interface SubmitAnswerRequest {
  name: string;
  birthdate: string;
  age: number;
  hometown: string;
  affiliation: string;
  aspiration: string;
  answers: UserAnswer[];
}

export interface SubmitAnswerResponse {
  roomId: string;
  submittedAt: string;
  status: string;
}