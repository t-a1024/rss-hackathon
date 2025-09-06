export interface TeamMember {
  id: string;
  name: string;
  skills: string[];
  experience: string;
  interests: string[];
  availability: 'full-time' | 'part-time' | 'limited';
  preferredRoles?: string[];
}

export interface Role {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  responsibilities: string[];
  timeCommitment: 'full-time' | 'part-time' | 'limited';
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
  availableRoles: Role[];
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