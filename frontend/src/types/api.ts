interface TeamMember {
  id: string;
  name: string;
  birthday: string;
  age: number;
  hometown: string;
  organization: string;
  motivation: string;
}

interface Role {
  id: string;
  title: string;
  englishTitle: string;
  description: string;
}

interface RoleAssignment {
  memberId: string;
  memberName: string;
  roleId: string;
  roleTitle: string;
  matchScore: number;
  reasoning: string;
}

interface TeamRoleAssignmentRequest {
  members: TeamMember[];
  availableRoles: Role[];
}

interface TeamRoleAssignmentResponse {
  assignments: RoleAssignment[];
  teamAnalysis: string;
  recommendations: string[];
}

interface APIError {
  error: string;
  message: string;
  code?: number;
}

export type {
  TeamMember,
  Role,
  RoleAssignment,
  TeamRoleAssignmentRequest,
  TeamRoleAssignmentResponse,
  APIError
};