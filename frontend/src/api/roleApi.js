const API_BASE_URL = 'http://localhost:3001/api';

class APIClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
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
        throw new Error(`API Error: ${data.message || 'Unknown error'}`);
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server. Make sure the backend is running on http://localhost:3001');
      }
      throw error;
    }
  }

  async healthCheck() {
    return this.request('/health');
  }

  async assignRoles(request) {
    return this.request('/roles/assign', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

export const apiClient = new APIClient();