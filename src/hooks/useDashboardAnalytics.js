import { useState } from 'react';
import api from '../api';

export const useDashboardAnalytics = () => {
        // --- STATE DATA ---
        const [adminSummary, setAdminSummary] = useState(null);
        const [guruSummary, setGuruSummary] = useState(null);
        const [operatorPerformance, setOperatorPerformance] = useState([]);

        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');

        // ==========================================
        // FUNGSI FETCH DATA DASHBOARD
        // ==========================================

        // Panggil ini jika user yang login adalah Admin/Operator
        const fetchAdminDashboardData = async () => {
                setLoading(true);
                try {
                        // Kita bisa menjalankan dua API secara paralel menggunakan Promise.all
                        // agar loading di frontend terasa lebih cepat.
                        const [summaryRes, perfRes] = await Promise.all([
                                api.get('/dashboard/admin'),
                                api.get('/analytics/operator-performance')
                        ]);

                        setAdminSummary(summaryRes.data.data);
                        setOperatorPerformance(perfRes.data.data);
                        setError('');
                } catch (err) {
                        console.error("Gagal memuat data analitik:", err);
                        setError("Gagal memuat dashboard admin.");
                } finally {
                        setLoading(false);
                }
        };

        // Panggil ini jika user yang login adalah Guru
        const fetchGuruDashboardData = async () => {
                setLoading(true);
                try {
                        const response = await api.get('/dashboard/guru');
                        setGuruSummary(response.data.data);
                        setError('');
                } catch (err) {
                        console.error("Gagal memuat summary guru:", err);
                        setError("Gagal memuat dashboard guru.");
                } finally {
                        setLoading(false);
                }
        };

        return {
                state: { adminSummary, guruSummary, operatorPerformance, loading, error },
                actions: { fetchAdminDashboardData, fetchGuruDashboardData }
        };
};