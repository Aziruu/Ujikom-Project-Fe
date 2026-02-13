import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 
import PageMeta from "../components/common/PageMeta";

export default function LeaveRequests() {
    const navigate = useNavigate();

    // STATE

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('pending');
    const [processingId, setProcessingId] = useState(null);
    const [filterDate, setFilterDate] = useState('');

    // FETCH DATA

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const params = {};

            // kirim status jika bukan 'all'
            if (filterStatus !== 'all') {
                params.status = filterStatus;
            }

            // kirim tanggal jika ada
            if (filterDate) {
                params.date = filterDate;
            }

            const response = await api.get('/leaves', { params });

            // amankan struktur response (hindari undefined error)
            const data = response?.data?.data?.data || response?.data?.data || [];
            setLeaves(data);

        } catch (error) {
            console.error("Gagal ambil data:", error);
            setLeaves([]);
        } finally {
            setLoading(false);
        }
    };

    // refresh saat filter berubah
    useEffect(() => {
        fetchLeaves();
    }, [filterStatus, filterDate]);

    // VERIFIKASI CUTI
    const handleVerify = async (id, status, name) => {
        const action = status === 'approved' ? 'menyetujui' : 'menolak';
        if (!window.confirm(`Yakin ingin ${action} pengajuan cuti ${name}?`)) return;

        setProcessingId(id);

        try {
            await api.put(`/leaves/${id}/verify`, { 
                status,
                admin_note: status === 'rejected'
                    ? 'Ditolak Admin'
                    : 'Disetujui Admin'
            });

            alert(`Berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}!`);
            fetchLeaves();

        } catch (error) {
            console.error(error);
            alert("Gagal memproses data.");
        } finally {
            setProcessingId(null);
        }
    };

    // BADGE COLOR STATUS
    const getStatusColor = (s) => {
        if(s === 'approved') return 'bg-green-100 text-green-700 border-green-200';
        if(s === 'rejected') return 'bg-red-100 text-red-700 border-red-200';
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    };

    // FILE URL GENERATOR
    // Pastikan storage:link sudah jalan
    const getFileUrl = (path) => {
        if (!path) return null;
        
        const cleanPath = path.replace(/^\//, ''); 
        
        return `http://127.0.0.1:8000/storage/${cleanPath}`;
    };
    return (
        <>
            <PageMeta title="Daftar Cuti | Admin" />

            <div className="space-y-6">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Pengajuan Cuti</h2>
                        <p className="text-sm text-gray-500">
                            Kelola izin dan sakit guru
                        </p>
                    </div>

                    <button 
                        onClick={() => navigate('/leaves/create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        Buat Pengajuan
                    </button>
                </div>

                {/* FILTER */}
                <div className="flex gap-4 items-center">

                    {/* Status */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border p-2 rounded text-sm"
                    >
                        <option value="all">Semua</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    {/* Tanggal */}
                    <input 
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="border p-2 rounded text-sm"
                    />

                    {filterDate && (
                        <button
                            onClick={() => setFilterDate('')}
                            className="text-red-500 text-xs"
                        >
                            Reset
                        </button>
                    )}
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto border rounded">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Guru</th>
                                <th className="p-3 text-left">Tanggal</th>
                                <th className="p-3 text-left">Tipe</th>
                                <th className="p-3 text-left">File</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3 text-center">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : leaves.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center">
                                        Tidak ada data.
                                    </td>
                                </tr>
                            ) : (
                                leaves.map(item => (
                                    <tr key={item.id} className="border-t">
                                        <td className="p-3">
                                            <div className="font-semibold">
                                                {item.teacher?.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {item.teacher?.nip}
                                            </div>
                                        </td>

                                        <td className="p-3">
                                            {item.start_date} <br />
                                            <span className="text-xs text-gray-400">
                                                s/d {item.end_date}
                                            </span>
                                        </td>

                                        <td className="p-3">
                                            <div className="uppercase text-xs font-bold">
                                                {item.type}
                                            </div>
                                            <div className="text-xs italic text-gray-500">
                                                "{item.reason}"
                                            </div>
                                        </td>

                                        <td className="p-3">
                                            {item.attachment ? (
                                                <a
                                                    href={getFileUrl(item.attachment)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 text-xs underline"
                                                >
                                                    Lihat File
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-xs">
                                                    Tidak ada file
                                                </span>
                                            )}
                                        </td>

                                        <td className="p-3 text-center">
                                            <span className={`px-2 py-1 text-xs rounded border ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>

                                        <td className="p-3 text-center">
                                            {item.status === 'pending' ? (
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleVerify(item.id, 'approved', item.teacher?.name)}
                                                        disabled={processingId === item.id}
                                                        className="text-green-600 text-xs"
                                                    >
                                                        Approve
                                                    </button>

                                                    <button
                                                        onClick={() => handleVerify(item.id, 'rejected', item.teacher?.name)}
                                                        disabled={processingId === item.id}
                                                        className="text-red-600 text-xs"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    );
}
