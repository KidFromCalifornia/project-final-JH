// Create src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('userToken');

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    signal: controller.signal,
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = 'API request failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }

    console.error('API Error:', error);
    throw error;
  }
};

// Specific API functions for your coffee app
export const cafeAPI = {
  getAll: () => apiCall('/cafes'),
  getById: (id) => apiCall(`/cafes/${id}`),
};

export const tastingAPI = {
  getPublic: () => apiCall('/tastings/public'),
  getUserTastings: () => apiCall('/tastings'),
  create: (tastingData) =>
    apiCall('/tastings', {
      method: 'POST',
      body: JSON.stringify(tastingData),
    }),
  update: (id, tastingData) =>
    apiCall(`/tastings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tastingData),
    }),
  delete: (id) =>
    apiCall(`/tastings/${id}`, {
      method: 'DELETE',
    }),
  search: (query) => apiCall(`/tastings/public/search?query=${encodeURIComponent(query)}`),
};

export const authAPI = {
  login: (credentials) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  register: (userData) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
};
