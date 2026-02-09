import { useState, useEffect } from 'react';
import api from '../api';

export default function AttendanceReport() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter State
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [pagination, setPagination] = useState({});

    const fetchLogs = async (url = '/attendance/history') => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (dateFilter) params.date = dateFilter;

            const response = await api.get(url, { params });
            setLogs(response.data.data.data);
            setPagination(response.data.data);
        } catch (error) {
            console.error("Gagal ambil log:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => { fetchLogs(); }, 500);
        return () => clearTimeout(timer);
    }, [search, dateFilter]);

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };


    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-[80vh] font-sans text-gray-800 dark:text-gray-100">
            
            {/* Header Page */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold dark:text-white">Laporan Log</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Rekap data kehadiran guru</p>
                </div>

                {/* Filter */}
                <div className="flex gap-3 w-full md:w-auto">
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="p-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 p-2 w-48 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                        <svg className="absolute left-2.5 top-2.5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </div>
                </div>
            </div>

            {/* Tabel */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider font-semibold">
                                <th className="p-4">Tanggal</th>
                                <th className="p-4">Guru</th>
                                <th className="p-4 text-center">Metode</th>
                                <th className="p-4 text-center">Jam Masuk</th>
                                <th className="p-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                            {loading ? (
                                <tr><td colSpan="5" className="p-6 text-center text-gray-500">Memuat data...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan="5" className="p-6 text-center text-gray-500">Belum ada data absensi.</td></tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                                        <td className="p-4 whitespace-nowrap">{formatDate(log.date)}</td>
                                        <td className="p-4">
                                            <div>
                                                <span className="font-bold block text-gray-900 dark:text-white">{log.teacher?.name}</span>
                                                <span className="text-xs text-gray-500">{log.teacher?.nip}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                                log.method === 'rfid' 
                                                ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300' 
                                                : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300'
                                            }`}>
                                                {log.method}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center font-mono">{log.check_in}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                                log.status === 'hadir' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                log.status === 'telat' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {log.status === 'telat' ? `Telat ${log.late_duration}m` : log.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm">
                    <span className="text-gray-500">Hal {pagination.current_page || 1} dari {pagination.last_page || 1}</span>
                    <div className="flex gap-2">
                        <button 
                            disabled={!pagination.prev_page_url} 
                            onClick={() => fetchLogs(pagination.prev_page_url)}
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded disabled:opacity-50"
                        >Prev</button>
                        <button 
                            disabled={!pagination.next_page_url} 
                            onClick={() => fetchLogs(pagination.next_page_url)}
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded disabled:opacity-50"
                        >Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}