// Create src/services/api.js
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("userToken");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Specific API functions for your coffee app
export const cafeAPI = {
  getAll: () => apiCall("/cafes"),
  getById: (id) => apiCall(`/cafes/${id}`),
};

export const tastingAPI = {
  getPublic: () => apiCall("/tastings/public"),
  getUserTastings: () => apiCall("/tastings"),
  create: (tastingData) =>
    apiCall("/tastings", {
      method: "POST",
      body: JSON.stringify(tastingData),
    }),
  search: (query) =>
    apiCall(`/tastings/public/search?query=${encodeURIComponent(query)}`),
};

export const authAPI = {
  login: (credentials) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  register: (userData) =>
    apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
};
