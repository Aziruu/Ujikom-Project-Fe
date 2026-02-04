import axios from 'axios';

const api = axios.create({
        baseURL: 'http://127.0.0.1:8000/api',
        headers: {
                'Content-Type': 'application/json',
        },
});

// Interceptor untuk otomatis nambah token ke setiap request
api.interceptors.request.use(
        (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                        console.log('🔑 Token dikirim:', token.substring(0, 20) + '...'); // DEBUG
                } else {
                        console.warn('⚠️ Tidak ada token di localStorage!'); // DEBUG
                }
                return config;
        },
        (error) => {
                return Promise.reject(error);
        }
);

// Interceptor untuk handle 401 (token expired/invalid)
api.interceptors.response.use(
        (response) => {
                console.log('✅ Response berhasil dari:', response.config.url); // DEBUG
                return response;
        },
        (error) => {
                console.error('❌ Error response:', error.response?.status, error.response?.data); // DEBUG

                if (error.response?.status === 401) {
                        console.warn('🚫 401 Unauthorized - Redirect ke login'); // DEBUG
                        // Token invalid/expired, redirect ke login
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/';
                }
                return Promise.reject(error);
        }
);

export default api;