import { useState, useEffect } from 'react';
import api from '../api';
import { BASE_URL } from '../api';

export const useDashboard = () => {
        const [loading, setLoading] = useState(true);
        const [stats, setStats] = useState({ totalGuru: 0, totalKelas: 0, hadirHariIni: 0 });
        const [recentAttendances, setRecentAttendances] = useState([]);
        const [pendingLeaves, setPendingLeaves] = useState([]);

        const fetchDashboardData = async () => {
                setLoading(true);
                try {
                        const dateToday = new Date().toISOString().split('T')[0];

                        const [resTeachers, resClassrooms, resAttendance, resLeaves] = await Promise.all([
                                api.get('/teachers?per_page=1'),
                                api.get('/classrooms'),
                                api.get(`/attendance/history?date=${dateToday}&per_page=5`),
                                api.get('/leaves?status=pending')
                        ]);

                        setStats({
                                totalGuru: resTeachers.data.meta ? resTeachers.data.meta.total : 0,
                                totalKelas: resClassrooms.data.data.length || 0,
                                hadirHariIni: resAttendance.data.data.total || 0,
                        });

                        setRecentAttendances(resAttendance.data.data.data || []);
                        setPendingLeaves(resLeaves.data.data?.data || resLeaves.data.data || []);
                } catch (error) {
                        console.error("Gagal memuat data dashboard:", error);
                } finally {
                        setLoading(false);
                }
        };

        useEffect(() => {
                fetchDashboardData();
        }, []);

        // Logika Pembiasaan Harian (Tanpa Emoji, Full Tailwind Colors)
        const getPembiasaan = () => {
                const day = new Date().getDay();
                const map = {
                        1: { title: 'Upacara Bendera', desc: 'Meningkatkan kedisiplinan dan nasionalisme.', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20' },
                        2: { title: 'Senam Pagi', desc: 'Menjaga kebugaran jasmani warga sekolah.', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20' },
                        3: { title: 'Literasi', desc: 'Membaca buku 15 menit sebelum KBM.', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-100 dark:border-yellow-500/20' },
                        4: { title: 'Ekologi / Lingkungan', desc: 'Pembersihan area kelas dan taman sekolah.', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20' },
                        5: { title: 'Sholat Dhuha & Kultum', desc: 'Pembinaan kerohanian di lapangan.', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-500/10 border-teal-100 dark:border-teal-500/20' },
                };

                if (day === 0 || day === 6) {
                        return { title: 'Hari Libur', desc: 'Tidak ada pembiasaan, selamat beristirahat!', color: 'text-gray-500 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700' };
                }
                return map[day];
        };

        const handleQuickVerify = async (id, status, name) => {
                const actionText = status === 'approved' ? 'menyetujui' : 'menolak';
                if (!confirm(`Yakin ingin ${actionText} pengajuan cuti ${name}?`)) return;

                try {
                        await api.put(`/leaves/${id}/verify`, {
                                status,
                                admin_note: status === 'rejected' ? 'Ditolak cepat via Dashboard' : 'Disetujui cepat via Dashboard'
                        });
                        fetchDashboardData();
                } catch (err) {
                        alert('Gagal memproses cuti.' + err);
                }
        };

        const getFileUrl = (path) => {
                if (!path) return null;
                return `${BASE_URL}/storage/${path.replace(/^\//, '')}`;
        };

        return {
                state: { loading, stats, recentAttendances, pendingLeaves, pembiasaan: getPembiasaan() },
                actions: { handleQuickVerify, getFileUrl }
        };
};