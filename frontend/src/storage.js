// frontend/src/storage.js
let memoryStorage = {};

export const setAuthToken = (token) => {
  try {
    localStorage.setItem('token', token);
  } catch (e) {
    console.warn("localStorage blocked. Using memory storage.");
    memoryStorage['token'] = token;
  }
};

export const getAuthToken = () => {
  try {
    return localStorage.getItem('token') || memoryStorage['token'];
  } catch (e) {
    return memoryStorage['token'];
  }
};

export const clearAuthToken = () => {
  try {
    localStorage.removeItem('token');
  } catch (e) {
    delete memoryStorage['token'];
  }
};