// src/config/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Example: Login
const login = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return response.json();
};

// Example: Get Products
const getProducts = async (token) => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};