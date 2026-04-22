import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
        baseURL: `${BASE_URL}/api`,
        headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'ngrok-skip-browser-warning': '69420',
        },
});

// Interceptor Request: Menyisipkan Token
api.interceptors.request.use(
        (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                        console.log('🔑 Token dikirim:', token.substring(0, 20) + '...');
                }
                return config;
        },
        (error) => {
                return Promise.reject(error);
        }
);

// Interceptor Response: Menangani 401 Unauthorized
api.interceptors.response.use(
        (response) => response,
        (error) => {
                if (error.response?.status === 401) {
                        console.warn('🚫 401 Unauthorized - Redirect ke login');
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/signin';
                }
                return Promise.reject(error);
        }
);

export default api;