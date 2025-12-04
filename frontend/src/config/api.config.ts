/**
 * API Configuration
 * Centralizes all API URL configuration to ensure consistency across the application
 */

// Get the API URL from environment variables
// VITE_APP_API_URL should be set in .env files
const getApiUrl = (): string => {
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  
  if (!apiUrl) {
    console.warn('VITE_APP_API_URL environment variable is not set. Using default fallback.');
    // Default fallback for development
    return 'http://localhost:3001/api';
  }
  
  return apiUrl;
};

export const API_BASE_URL = getApiUrl();

export default {
  API_BASE_URL,
};
