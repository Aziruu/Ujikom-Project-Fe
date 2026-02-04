import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [error, setError] = useState('');
        const [loading, setLoading] = useState(false);
        const navigate = useNavigate();

        const handleLogin = async (e) => {
                e.preventDefault();
                setError('');
                setLoading(true);

                try {
                        const response = await api.post('/login/admin', { email, password });

                        console.log('Response dari backend:', response.data); // DEBUG

                        // Coba berbagai kemungkinan struktur response
                        const token = response.data.token ||
                                response.data.access_token ||
                                response.data.data?.token ||
                                response.data.data?.access_token;

                        const user = response.data.user ||
                                response.data.data?.user ||
                                response.data.data;

                        if (!token) {
                                console.error('Token tidak ditemukan dalam response:', response.data);
                                setError('Login gagal: Token tidak ditemukan dari server');
                                return;
                        }

                        // Simpan token dan data user
                        localStorage.setItem('token', token);
                        localStorage.setItem('user', JSON.stringify(user));

                        console.log('Token tersimpan:', token); // DEBUG
                        console.log('User tersimpan:', user); // DEBUG

                        // Redirect ke dashboard
                        navigate('/dashboard');
                } catch (err) {
                        console.error('Login error:', err); // DEBUG
                        setError(err.response?.data?.message || 'Login gagal. Cek email dan password.');
                } finally {
                        setLoading(false);
                }
        };

        return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                        <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
                                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                                        🎓 Login Admin
                                </h2>

                                {error && (
                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                                {error}
                                        </div>
                                )}

                                <form onSubmit={handleLogin}>
                                        <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                        Email
                                                </label>
                                                <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="admin@sekolah.com"
                                                        required
                                                />
                                        </div>

                                        <div className="mb-6">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                        Password
                                                </label>
                                                <input
                                                        type="password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="••••••••"
                                                        required
                                                />
                                        </div>

                                        <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                                        >
                                                {loading ? 'Memproses...' : 'Login'}
                                        </button>
                                </form>

                                <div className="mt-4 text-center text-xs text-gray-500">
                                        Buka Console (F12) untuk lihat debug info
                                </div>
                        </div>
                </div>
        );
}