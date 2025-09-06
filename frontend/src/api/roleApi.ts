import type { TeamRoleAssignmentRequest, TeamRoleAssignmentResponse, APIError } from '../types/api';

const API_BASE_URL = 'http://localhost:3001/api';

class APIClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        const error = data as APIError;
        throw new Error(`API Error: ${error.message || 'Unknown error'}`);
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server. Make sure the backend is running on http://localhost:3001');
      }
      throw error;
    }
  }

  async healthCheck(): Promise<{ status: string; timestamp: string; service: string }> {
    return this.request('/health');
  }

  async assignRoles(request: TeamRoleAssignmentRequest): Promise<TeamRoleAssignmentResponse> {
    return this.request('/roles/assign', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

export const apiClient = new APIClient();