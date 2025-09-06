export interface TeamMember {
  id: string;
  name: string;
  birthday: string;
  age: number;
  hometown: string;
  organization: string;
  motivation: string;
}

export interface Role {
  id: string;
  title: string;
  englishTitle: string;
  description: string;
}

export interface RoleAssignment {
  memberId: string;
  memberName: string;
  roleId: string;
  roleTitle: string;
  matchScore: number;
  reasoning: string;
}

export interface TeamRoleAssignmentRequest {
  members: TeamMember[];
}

export interface TeamRoleAssignmentResponse {
  assignments: RoleAssignment[];
  teamAnalysis: string;
  recommendations: string[];
}

export interface APIError {
  error: string;
  message: string;
  code?: number;
}