import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api';

export default function Sidebar() {
        const navigate = useNavigate();
        const location = useLocation();

        const handleLogout = async () => {
                try {
                        await api.post('/logout'); // Hapus token di Backend
                } catch (error) {
                        console.error("Logout error", error);
                } finally {
                        // Tetap logout meski backend error
                        localStorage.removeItem('token'); // Hapus di Browser
                        localStorage.removeItem('user');
                        navigate('/'); // Tendang ke Login
                }
        };

        // Helper untuk check active link
        const isActive = (path) => location.pathname === path;

        return (
                <div className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0 flex flex-col">
                        <div className="p-6 text-center border-b border-gray-700">
                                <h1 className="text-2xl font-bold text-blue-400">Si-Hadir</h1>
                                <p className="text-xs text-gray-400">Admin Panel</p>
                        </div>

                        <nav className="flex-1 p-4 space-y-2">
                                <Link
                                        to="/dashboard"
                                        className={`block px-4 py-2 rounded transition ${isActive('/dashboard')
                                                        ? 'bg-blue-600 text-white'
                                                        : 'hover:bg-gray-800'
                                                }`}
                                >
                                        🏠 Dashboard
                                </Link>
                                <Link
                                        to="/teachers"
                                        className={`block px-4 py-2 rounded transition ${isActive('/teachers')
                                                        ? 'bg-blue-600 text-white'
                                                        : 'hover:bg-gray-800'
                                                }`}
                                >
                                        👨‍🏫 Data Guru
                                </Link>
                                <Link
                                        to="/attendance"
                                        className={`block px-4 py-2 rounded transition ${isActive('/attendance')
                                                        ? 'bg-blue-600 text-white'
                                                        : 'hover:bg-gray-800'
                                                }`}
                                >
                                        📅 Absensi Hari Ini
                                </Link>
                        </nav>

                        <div className="p-4 border-t border-gray-700">
                                <button
                                        onClick={handleLogout}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition font-semibold"
                                >
                                        🚪 Keluar (Logout)
                                </button>
                        </div>
                </div>
        );
}