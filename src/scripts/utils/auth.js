const TOKEN_KEY = 'story_app_token';

export function setToken(token) {
  localStorage.setItem('authToken', token);
}

export function getToken() {
  return localStorage.getItem('authToken');
}

export const clearToken = () => localStorage.removeItem('authToken');