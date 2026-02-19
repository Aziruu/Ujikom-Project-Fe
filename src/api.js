import axios from 'axios';

const api = axios.create({
        baseURL: 'http://127.0.0.1:8000/api',
        headers: {
                'Content-Type': 'application/json',
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