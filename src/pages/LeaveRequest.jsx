import { useState, useEffect } from 'react';
import api from '../api'; // Pastikan path api benar
import PageMeta from "../components/common/PageMeta";

export default function LeaveRequests() {
    // --- STATE ---
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('pending'); // default lihat yang pending dulu
    const [processingId, setProcessingId] = useState(null); // Untuk loading tombol aksi

    // --- FETCH DATA ---
    const fetchLeaves = async () => {
        setLoading(true);
        try {
            // Backend menerima parameter ?status=...
            const params = filterStatus === 'all' ? {} : { status: filterStatus };
            const response = await api.get('/leaves', { params });
            setLeaves(response.data.data); // Sesuaikan dengan pagination laravel (response.data.data)
        } catch (error) {
            console.error("Gagal ambil data cuti:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, [filterStatus]);

    // --- HANDLER VERIFIKASI (APPROVE/REJECT) ---
    const handleVerify = async (id, status, name) => {
        const action = status === 'approved' ? 'menyetujui' : 'menolak';
        if (!window.confirm(`Yakin ingin ${action} pengajuan cuti ${name}?`)) return;

        setProcessingId(id);
        try {
            await api.put(`/leaves/${id}/verify`, { 
                status: status,
                admin_note: status === 'rejected' ? 'Ditolak oleh admin' : 'Disetujui oleh admin' 
            });
            
            alert(`Berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}!`);
            fetchLeaves(); // Refresh data
        } catch (error) {
            alert("Gagal memproses data.");
            console.error(error);
        } finally {
            setProcessingId(null);
        }
    };

    // Helper warna badge status
    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
        }
    };

    // Helper translate status
    const getStatusLabel = (status) => {
        switch (status) {
            case 'approved': return 'Disetujui';
            case 'rejected': return 'Ditolak';
            default: return 'Menunggu';
        }
    };

    return (
        <>
            <PageMeta title="Pengajuan Cuti | Si-Hadir Admin" description="Verifikasi cuti guru" />

            <div className="space-y-6">
                
                {/* Header & Filter */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Pengajuan Cuti</h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola permohonan izin dan sakit guru</p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        {['all', 'pending', 'approved', 'rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                                    filterStatus === status 
                                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-sm' 
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                                }`}
                            >
                                {status === 'all' ? 'Semua' : 
                                 status === 'pending' ? 'Menunggu' : 
                                 status === 'approved' ? 'Disetujui' : 'Ditolak'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 shadow-sm">
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-left text-xs uppercase tracking-wider dark:text-gray-300">Guru</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-left text-xs uppercase tracking-wider dark:text-gray-300">Tanggal</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-left text-xs uppercase tracking-wider dark:text-gray-300">Tipe & Alasan</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-center text-xs uppercase tracking-wider dark:text-gray-300">Status</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-center text-xs uppercase tracking-wider dark:text-gray-300">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center py-10 text-gray-500">Memuat data...</td></tr>
                                ) : leaves.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center py-10 text-gray-500">Tidak ada pengajuan cuti {filterStatus !== 'all' ? `status ${filterStatus}` : ''}.</td></tr>
                                ) : (
                                    leaves.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-800 text-sm dark:text-white">
                                                    {item.teacher?.name || 'Guru Dihapus'}
                                                </div>
                                                <div className="text-xs text-gray-500">{item.teacher?.nip || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-medium">{item.start_date}</span>
                                                    <span className="text-xs text-gray-400">s/d</span>
                                                    <span className="font-medium">{item.end_date}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-blue-50 text-blue-600 mb-1 uppercase border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
                                                    {item.type.replace('_', ' ')}
                                                </span>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 italic">"{item.reason}"</p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                                    {getStatusLabel(item.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {item.status === 'pending' ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button 
                                                            onClick={() => handleVerify(item.id, 'approved', item.teacher?.name)}
                                                            disabled={processingId === item.id}
                                                            className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:scale-105 transition border border-green-200 disabled:opacity-50"
                                                            title="Setujui"
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleVerify(item.id, 'rejected', item.teacher?.name)}
                                                            disabled={processingId === item.id}
                                                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105 transition border border-red-200 disabled:opacity-50"
                                                            title="Tolak"
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400">- Selesai -</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}