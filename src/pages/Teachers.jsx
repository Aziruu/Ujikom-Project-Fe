import { useEffect, useState } from 'react';
import api from '../api';
import PageMeta from "../components/common/PageMeta";

export default function Teachers() {
    // --- STATE ---
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State Pagination & Search
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalData, setTotalData] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    // State Modal & Form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({ name: '', nip: '', email: '', jenis_kelamin: 'L' });

    // State RFID
    const [isRfidModalOpen, setIsRfidModalOpen] = useState(false);
    const [rfidData, setRfidData] = useState({ id: null, name: '', rfid_uid: '' });

    // --- FETCH DATA ---
    const fetchTeachers = async (page = 1, search = '') => {
        setLoading(true);
        try {
            const response = await api.get(`/teachers?page=${page}&search=${search}`);
            const result = response.data;

            setTeachers(result.data);
            setCurrentPage(result.current_page);
            setTotalPages(result.last_page);
            setTotalData(result.total);
            setError('');
        } catch (error) {
            console.error("Gagal ambil data:", error);
            setError('Gagal memuat data guru.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTeachers(currentPage, searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [currentPage, searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // --- HANDLERS ---
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const openAddModal = () => {
        setIsEdit(false);
        setFormData({ name: '', nip: '', email: '', jenis_kelamin: 'L' });
        setIsModalOpen(true);
    };

    const openEditModal = (guru) => {
        setIsEdit(true);
        setCurrentId(guru.id);
        setFormData({ name: guru.name, nip: guru.nip || '', email: guru.email || '', jenis_kelamin: guru.jenis_kelamin });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await api.put(`/teachers/${currentId}`, formData);
                alert("Data berhasil diupdate!");
            } else {
                await api.post('/teachers', formData);
                alert("Guru baru berhasil ditambahkan!");
            }
            setIsModalOpen(false);
            fetchTeachers(currentPage, searchTerm);
        } catch (err) {
            console.error(err);
            alert("Gagal menyimpan data.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin mau menghapus guru ini?")) {
            try {
                await api.delete(`/teachers/${id}`);
                fetchTeachers(currentPage, searchTerm);
            } catch (err) {
                console.error(err);
                alert("Gagal menghapus data.");
            }
        }
    };

    const openRfidModal = (guru) => {
        setRfidData({ id: guru.id, name: guru.name, rfid_uid: guru.rfid_uid || '' });
        setIsRfidModalOpen(true);
    };

    const handleRfidSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/teachers/${rfidData.id}/rfid`, { rfid_uid: rfidData.rfid_uid });
            alert(`RFID untuk ${rfidData.name} berhasil ditautkan!`);
            setIsRfidModalOpen(false);
            fetchTeachers(currentPage, searchTerm);
        } catch (err) {
            console.error(err);
            alert("Gagal mendaftarkan RFID.");
        }
    };

    return (
        <>
            <PageMeta title="Data Guru | Si-Hadir Admin" description="Manajemen data guru" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Data Guru</h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Total {totalData} guru terdaftar</p>
                    </div>

                    <div className="flex gap-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari nama/NIP..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
                            />
                            <svg className="absolute left-3 top-2.5 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>

                        <button onClick={openAddModal} className="flex items-center gap-2 rounded-lg bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 transition shadow-sm font-medium text-sm">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                            <span className="hidden sm:inline">Tambah</span>
                        </button>
                    </div>
                </div>

                {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500 border border-red-200 dark:bg-red-900/10 dark:border-red-500/20 dark:text-red-400">{error}</div>}

                {/* Table Container */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 shadow-sm">
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead className="border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-left text-xs uppercase tracking-wider dark:text-gray-300">Guru</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-left text-xs uppercase tracking-wider dark:text-gray-300">NIP</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-left text-xs uppercase tracking-wider dark:text-gray-300">Email</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-center text-xs uppercase tracking-wider dark:text-gray-300">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {loading && !isModalOpen && !isRfidModalOpen ? (
                                    <tr><td colSpan="4" className="text-center py-10 text-gray-500">Sedang memuat data...</td></tr>
                                ) : teachers.length === 0 ? (
                                    <tr><td colSpan="4" className="text-center py-10 text-gray-500">Tidak ada data ditemukan.</td></tr>
                                ) : (
                                    teachers.map((guru) => (
                                        <tr key={guru.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${guru.jenis_kelamin === 'L' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                                    </div>
                                                    <div>
                                                        <span className="block font-semibold text-gray-800 text-sm dark:text-white">{guru.name}</span>
                                                        <span className="block text-gray-500 text-xs dark:text-gray-400">{guru.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm dark:text-gray-300 font-mono">{guru.nip || '-'}</td>
                                            <td className="px-6 py-4 text-gray-600 text-sm dark:text-gray-300">{guru.email}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    {/* TOMBOL RFID */}
                                                    <button onClick={() => openRfidModal(guru)} className="p-2 rounded-lg hover:bg-purple-100 text-purple-600 dark:hover:bg-purple-900/30 transition" title="Set RFID">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><rect x="7" y="7" width="10" height="10" rx="1" /></svg>
                                                    </button>

                                                    {/* TOMBOL EDIT */}
                                                    <button onClick={() => openEditModal(guru)} className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 dark:hover:bg-blue-900/30 transition" title="Edit">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                                    </button>

                                                    {/* TOMBOL HAPUS */}
                                                    <button onClick={() => handleDelete(guru.id)} className="p-2 rounded-lg hover:bg-red-100 text-red-600 dark:hover:bg-red-900/30 transition" title="Hapus">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Halaman <span className="font-semibold">{currentPage}</span> dari <span className="font-semibold">{totalPages}</span>
                        </span>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1 || loading}
                                className="flex items-center gap-1 rounded-md px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg> Prev
                            </button>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages || loading}
                                className="flex items-center gap-1 rounded-md px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Next <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL FORM --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                            {isEdit ? 'Edit Data Guru' : 'Tambah Guru Baru'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Nama Lengkap" className="w-full rounded-lg border border-gray-300 bg-transparent py-2.5 px-4 text-sm outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
                                <input type="text" name="nip" value={formData.nip} onChange={handleChange} placeholder="NIP" className="w-full rounded-lg border border-gray-300 bg-transparent py-2.5 px-4 text-sm outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email" className="w-full rounded-lg border border-gray-300 bg-transparent py-2.5 px-4 text-sm outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
                                <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-transparent py-2.5 px-4 text-sm outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white">
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg bg-gray-100 py-2.5 px-5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300">Batal</button>
                                <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 py-2.5 px-5 text-sm font-medium text-white hover:bg-blue-700">{loading ? 'Simpan...' : 'Simpan Data'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL RFID --- */}
            {isRfidModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-sm rounded-xl bg-white p-8 text-center shadow-2xl dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <div className="mb-5 text-blue-500 bg-blue-50 dark:bg-blue-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2z" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Scan Kartu RFID</h3>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Tempelkan kartu untuk <br /><span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{rfidData.name}</span></p>
                        <form onSubmit={handleRfidSubmit}>
                            <input type="text" autoFocus value={rfidData.rfid_uid} onChange={(e) => setRfidData({ ...rfidData, rfid_uid: e.target.value })} placeholder="Menunggu tap kartu..." className="mb-6 w-full rounded-lg border-2 border-dashed border-blue-300 bg-gray-50 py-3 px-5 text-center font-mono text-lg outline-none focus:border-blue-500 focus:bg-blue-50 transition dark:bg-gray-900 dark:text-white dark:border-blue-800" />
                            <div className="flex justify-center gap-3">
                                <button type="button" onClick={() => setIsRfidModalOpen(false)} className="rounded-lg bg-gray-100 py-2.5 px-6 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300">Tutup</button>
                                <button type="submit" className="rounded-lg bg-purple-600 py-2.5 px-6 text-sm font-medium text-white hover:bg-purple-700">Simpan RFID</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}