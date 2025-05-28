export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Helper function to construct API URLs
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`; 