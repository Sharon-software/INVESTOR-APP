import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const register = (data) => axios.post(`${API_URL}/register`, data);
export const login = (data) => axios.post(`${API_URL}/login`, data);
export const deposit = (amount, token) =>
    axios.post(`${API_URL}/deposit?amount=${amount}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
export const invest = (productId, amount, token) =>
    axios.post(`${API_URL}/invest?productId=${productId}&amount=${amount}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
export const getPortfolio = (token) =>
    axios.get(`${API_URL}/portfolio`, {
        headers: { Authorization: `Bearer ${token}` }
    });