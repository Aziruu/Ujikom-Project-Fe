import { useEffect } from "react";
import { useDashboardAnalytics } from "../../hooks/useDashboardAnalytics";

export default function OperatorPerformance() {
        const { state, actions } = useDashboardAnalytics();

        useEffect(() => {
                // Memanggil data summary admin dan performa operator
                actions.fetchAdminDashboardData();
        }, []);

        // Gamifikasi Warna Rating Bintang
        const getRatingColor = (rating) => {
                if (rating >= 4.5) return "text-amber-500 font-bold drop-shadow-md"; // Gold
                if (rating >= 3.0) return "text-gray-400 font-semibold"; // Silver
                return "text-rose-500 font-medium"; // Need Improvement
        };

        // Gamifikasi Status Kecepatan Respons (SLA)
        const getSpeedBadge = (timeString) => {
                // Asumsi timeString formatnya "X Menit" (e.g., "15 Menit", "120 Menit")
                const minutes = parseInt(timeString) || 0;

                if (minutes === 0) return <span className="text-gray-400">Belum ada data</span>;
                if (minutes <= 15) return <span className="px-2 py-1 text-xs font-bold text-white rounded-md shadow-sm bg-gradient-to-r from-emerald-400 to-emerald-500">⚡ Kilat ({timeString})</span>;
                if (minutes <= 60) return <span className="px-2 py-1 text-xs font-bold text-white rounded-md shadow-sm bg-gradient-to-r from-blue-400 to-blue-500">🏃 Normal ({timeString})</span>;
                return <span className="px-2 py-1 text-xs font-bold text-white rounded-md shadow-sm bg-gradient-to-r from-rose-400 to-rose-500">🐢 Lambat ({timeString})</span>;
        };

        if (state.loading) {
                return <div className="py-20 text-center animate-pulse text-brand-500">Menganalisis performa Operator... 📊</div>;
        }

        return (
                <div className="p-6 mx-auto max-w-7xl">
                        <div className="mb-8">
                                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400">
                                        Leaderboard Performa Operator 🏆
                                </h1>
                                <p className="mt-2 text-gray-500 dark:text-gray-400">
                                        Pantau kecepatan penanganan masalah (SLA) dan tingkat kepuasan pelapor secara real-time.
                                </p>
                        </div>

                        {/* SUMMARY WIDGETS (Ringkasan Sistem) */}
                        {state.adminSummary && (
                                <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
                                        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl dark:bg-gray-800 dark:border-gray-700">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tiket Sistem</p>
                                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{state.adminSummary.total_tickets}</p>
                                        </div>
                                        <div className="p-6 bg-rose-50 border border-rose-100 shadow-sm rounded-2xl dark:bg-gray-800 dark:border-rose-900/30">
                                                <p className="text-sm font-medium text-rose-600 dark:text-rose-400">Menunggu (Open)</p>
                                                <p className="text-3xl font-bold text-rose-700 dark:text-rose-300">{state.adminSummary.open_tickets}</p>
                                        </div>
                                        <div className="p-6 bg-sky-50 border border-sky-100 shadow-sm rounded-2xl dark:bg-gray-800 dark:border-sky-900/30">
                                                <p className="text-sm font-medium text-sky-600 dark:text-sky-400">Dikerjakan (In-Progress)</p>
                                                <p className="text-3xl font-bold text-sky-700 dark:text-sky-300">{state.adminSummary.in_progress_tickets}</p>
                                        </div>
                                        <div className="p-6 bg-emerald-50 border border-emerald-100 shadow-sm rounded-2xl dark:bg-gray-800 dark:border-emerald-900/30">
                                                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Selesai (Closed)</p>
                                                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{state.adminSummary.closed_tickets}</p>
                                        </div>
                                </div>
                        )}

                        {/* TABEL LEADERBOARD PERFORMA */}
                        <div className="overflow-hidden bg-white border border-gray-100 shadow-xl rounded-2xl dark:bg-gray-800 dark:border-gray-700">
                                <div className="p-6 border-b border-gray-100 bg-gray-50/50 dark:bg-gray-900/50 dark:border-gray-700">
                                        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Analisis SLA & Kinerja Staf</h2>
                                </div>

                                <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                                <thead>
                                                        <tr className="text-sm font-semibold text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/80 dark:text-gray-400">
                                                                <th className="px-6 py-4">Peringkat & Nama</th>
                                                                <th className="px-6 py-4 text-center">Misi Diselesaikan</th>
                                                                <th className="px-6 py-4 text-center">Rating Kepuasan</th>
                                                                <th className="px-6 py-4">Waktu Respon (Pertama)</th>
                                                                <th className="px-6 py-4">Waktu Resolusi (Selesai)</th>
                                                        </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                        {state.operatorPerformance.length === 0 ? (
                                                                <tr>
                                                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Belum ada data performa operator.</td>
                                                                </tr>
                                                        ) : (
                                                                // Mengurutkan berdasarkan rating tertinggi, lalu tiket terbanyak
                                                                [...state.operatorPerformance]
                                                                        .sort((a, b) => b.average_rating - a.average_rating || b.total_tickets_handled - a.total_tickets_handled)
                                                                        .map((operator, index) => (
                                                                                <tr key={operator.operator_id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                                                        <td className="px-6 py-4">
                                                                                                <div className="flex items-center gap-3">
                                                                                                        {/* Gamifikasi Medali Top 3 */}
                                                                                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold shadow-sm ${index === 0 ? 'bg-yellow-100 text-yellow-600 ring-2 ring-yellow-400' :
                                                                                                                        index === 1 ? 'bg-gray-200 text-gray-600 ring-2 ring-gray-400' :
                                                                                                                                index === 2 ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-500' :
                                                                                                                                        'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                                                                                                }`}>
                                                                                                                {index + 1}
                                                                                                        </div>
                                                                                                        <span className="font-semibold text-gray-800 dark:text-white">{operator.operator_name}</span>
                                                                                                </div>
                                                                                        </td>
                                                                                        <td className="px-6 py-4 text-center">
                                                                                                <span className="px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full dark:bg-indigo-900/30 dark:text-indigo-300">
                                                                                                        {operator.total_tickets_handled} Tiket
                                                                                                </span>
                                                                                        </td>
                                                                                        <td className="px-6 py-4 text-center">
                                                                                                <div className="flex flex-col items-center justify-center">
                                                                                                        <span className={`text-lg ${getRatingColor(operator.average_rating)}`}>
                                                                                                                ★ {operator.average_rating.toFixed(1)}
                                                                                                        </span>
                                                                                                </div>
                                                                                        </td>
                                                                                        <td className="px-6 py-4">
                                                                                                {getSpeedBadge(operator.avg_response_time)}
                                                                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Target SLA: {'<'} 15 Menit</p>
                                                                                        </td>
                                                                                        <td className="px-6 py-4">
                                                                                                {getSpeedBadge(operator.avg_resolution_time)}
                                                                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Target SLA: {'<'} 60 Menit</p>
                                                                                        </td>
                                                                                </tr>
                                                                        ))
                                                        )}
                                                </tbody>
                                        </table>
                                </div>
                        </div>
                </div>
        );
}