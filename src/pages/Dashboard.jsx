import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api';

export default function Dashboard() {
        // FIX AMAN: Pakai try-catch biar kalau datanya rusak, web tidak error/putih
        const [user, setUser] = useState(() => {
                try {
                        const storedUser = localStorage.getItem('user');
                        // Cek kalau ada data, kita parse. Kalau error, lari ke catch.
                        return storedUser ? JSON.parse(storedUser) : null;
                } catch (error) {
                        console.error("Data user korup, mereset data...", error);
                        // Opsional: Hapus data yang rusak biar next time bersih
                        localStorage.removeItem('user');
                        return null;
                }
        });

        const [stats, setStats] = useState({
                totalGuru: 0,
                totalSiswa: 0,
                totalKelas: 0
        });
        const [loading, setLoading] = useState(true);

        useEffect(() => {
                const fetchStats = async () => {
                        try {
                                // Ambil data guru untuk hitung total
                                const guruResponse = await api.get('/teachers');
                                setStats(prev => ({
                                        ...prev,
                                        totalGuru: guruResponse.data.data?.length || 0
                                }));
                        } catch (error) {
                                console.error("Gagal ambil statistik:", error);
                        } finally {
                                setLoading(false);
                        }
                };

                fetchStats();
        }, []);

        return (
                <div className="flex min-h-screen bg-gray-100">
                        {/* Panggil Sidebar */}
                        <Sidebar />

                        {/* Konten Utama */}
                        <div className="ml-64 flex-1 p-8">
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                                {/* Pakai 'user?.name' supaya kalau user null, dia tetep aman */}
                                                Selamat Datang, {user?.name || 'Admin'}! 👋
                                        </h2>
                                        <p className="text-gray-600">
                                                Ini adalah halaman admin. Di sini kamu bisa ngatur data guru, jadwal, dan liat absensi.
                                        </p>

                                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="bg-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
                                                        <h3 className="font-bold text-blue-700">Total Guru</h3>
                                                        <p className="text-2xl font-bold">
                                                                {loading ? 'Loading...' : stats.totalGuru}
                                                        </p>
                                                </div>

                                                <div className="bg-green-100 p-4 rounded-lg border-l-4 border-green-500">
                                                        <h3 className="font-bold text-green-700">Total Siswa</h3>
                                                        <p className="text-2xl font-bold">
                                                                {loading ? 'Loading...' : stats.totalSiswa}
                                                        </p>
                                                </div>

                                                <div className="bg-purple-100 p-4 rounded-lg border-l-4 border-purple-500">
                                                        <h3 className="font-bold text-purple-700">Total Kelas</h3>
                                                        <p className="text-2xl font-bold">
                                                                {loading ? 'Loading...' : stats.totalKelas}
                                                        </p>
                                                </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="mt-8">
                                                <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
                                                                📝 Tambah Guru Baru
                                                        </button>
                                                        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
                                                                👥 Tambah Siswa Baru
                                                        </button>
                                                        <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
                                                                📅 Atur Jadwal
                                                        </button>
                                                        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
                                                                📊 Lihat Laporan
                                                        </button>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
        );
}