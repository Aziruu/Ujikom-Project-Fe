import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api';

export default function Teachers() {
        // --- STATE MANAGEMENT ---
        const [teachers, setTeachers] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');

        // State untuk Modal Tambah/Edit
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [isEdit, setIsEdit] = useState(false);
        const [currentId, setCurrentId] = useState(null);
        const [formData, setFormData] = useState({
                name: '',
                nip: '',
                email: '',
                jenis_kelamin: 'L'
        });

        // State untuk Modal RFID
        const [isRfidModalOpen, setIsRfidModalOpen] = useState(false);
        const [rfidData, setRfidData] = useState({ id: null, name: '', rfid_uid: '' });

        // --- FETCH DATA ---
        const fetchTeachers = async () => {
                try {
                        const response = await api.get('/teachers');
                        setTeachers(response.data.data);
                        setError('');
                } catch (error) {
                        console.error("Gagal ambil data:", error);
                        setError('Gagal memuat data guru.');
                } finally {
                        setLoading(false);
                }
        };

        useEffect(() => {
                fetchTeachers();
        }, []);

        // --- HANDLERS UTAMA ---
        const handleChange = (e) => {
                setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        // Buka Modal Tambah
        const openAddModal = () => {
                setIsEdit(false);
                setFormData({ name: '', nip: '', email: '', jenis_kelamin: 'L' });
                setIsModalOpen(true);
        };

        // Buka Modal Edit
        const openEditModal = (guru) => {
                setIsEdit(true);
                setCurrentId(guru.id);
                setFormData({
                        name: guru.name,
                        nip: guru.nip || '',
                        email: guru.email || '',
                        jenis_kelamin: guru.jenis_kelamin
                });
                setIsModalOpen(true);
        };

        // Submit Tambah/Edit
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
                        fetchTeachers();
                } catch (err) {
                        alert("Gagal menyimpan data. Cek inputan.");
                        console.error(err);
                } finally {
                        setLoading(false);
                }
        };

        // Handle Hapus
        const handleDelete = async (id) => {
                if (window.confirm("Yakin mau menghapus guru ini?")) {
                        try {
                                await api.delete(`/teachers/${id}`);
                                setTeachers(teachers.filter(t => t.id !== id));
                        } catch (err) {
                                alert("Gagal menghapus data.");
                        }
                }
        };

        // --- HANDLERS RFID ---
        const openRfidModal = (guru) => {
                setRfidData({
                        id: guru.id,
                        name: guru.name,
                        rfid_uid: guru.rfid_uid || '' // Ambil yang lama kalau ada
                });
                setIsRfidModalOpen(true);
        };

        const handleRfidSubmit = async (e) => {
                e.preventDefault();
                try {
                        await api.put(`/teachers/${rfidData.id}/rfid`, { rfid_uid: rfidData.rfid_uid });
                        alert(`RFID untuk ${rfidData.name} berhasil ditautkan!`);
                        setIsRfidModalOpen(false);
                        fetchTeachers(); // Refresh biar data di tabel update
                } catch (err) {
                        alert("Gagal mendaftarkan RFID. Pastikan kartu belum dipakai guru lain.");
                        console.error(err);
                }
        };

        // --- RENDER ---
        return (
                <div className="flex min-h-screen bg-gray-100">
                        <Sidebar />

                        <div className="ml-64 flex-1 p-8">
                                <div className="flex justify-between items-center mb-6">
                                        <h1 className="text-3xl font-bold text-gray-800">👨‍🏫 Data Guru</h1>
                                        <button
                                                onClick={openAddModal}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition duration-200"
                                        >
                                                ➕ Tambah Guru
                                        </button>
                                </div>

                                {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded border border-red-200">{error}</div>}

                                {/* TABEL GURU */}
                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                        <table className="min-w-full leading-normal">
                                                <thead>
                                                        <tr>
                                                                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama</th>
                                                                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">NIP</th>
                                                                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                                                <th className="px-5 py-3 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                                                        </tr>
                                                </thead>
                                                <tbody>
                                                        {loading && !isModalOpen && !isRfidModalOpen ? (
                                                                <tr><td colSpan="4" className="text-center py-10 text-gray-500">Sedang memuat data...</td></tr>
                                                        ) : teachers.length === 0 ? (
                                                                <tr><td colSpan="4" className="text-center py-10 text-gray-500">Belum ada data guru.</td></tr>
                                                        ) : (
                                                                teachers.map((guru) => (
                                                                        <tr key={guru.id} className="hover:bg-gray-50 border-b border-gray-200">
                                                                                <td className="px-5 py-5 text-sm">
                                                                                        <div className="flex items-center">
                                                                                                <div className="ml-3">
                                                                                                        <p className="text-gray-900 font-bold">{guru.name}</p>
                                                                                                        <p className="text-gray-500 text-xs">{guru.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                                                                                                </div>
                                                                                        </div>
                                                                                </td>
                                                                                <td className="px-5 py-5 text-sm text-gray-700">{guru.nip || '-'}</td>
                                                                                <td className="px-5 py-5 text-sm text-gray-700">{guru.email}</td>
                                                                                <td className="px-5 py-5 text-sm text-center">
                                                                                        <div className="flex justify-center space-x-3">
                                                                                                {/* Tombol RFID */}
                                                                                                <button
                                                                                                        onClick={() => openRfidModal(guru)}
                                                                                                        className="text-purple-600 hover:text-purple-900 flex items-center tooltip"
                                                                                                        title="Set RFID"
                                                                                                >
                                                                                                        🆔 <span className="ml-1 text-xs">RFID</span>
                                                                                                </button>
                                                                                                {/* Tombol Edit */}
                                                                                                <button
                                                                                                        onClick={() => openEditModal(guru)}
                                                                                                        className="text-blue-600 hover:text-blue-900"
                                                                                                        title="Edit Data"
                                                                                                >
                                                                                                        ✏️
                                                                                                </button>
                                                                                                {/* Tombol Hapus */}
                                                                                                <button
                                                                                                        onClick={() => handleDelete(guru.id)}
                                                                                                        className="text-red-600 hover:text-red-900"
                                                                                                        title="Hapus Data"
                                                                                                >
                                                                                                        🗑️
                                                                                                </button>
                                                                                        </div>
                                                                                </td>
                                                                        </tr>
                                                                ))
                                                        )}
                                                </tbody>
                                        </table>
                                </div>
                        </div>

                        {/* --- MODAL INPUT DATA GURU --- */}
                        {isModalOpen && (
                                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 transition-opacity">
                                        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all scale-100">
                                                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                                                        {isEdit ? '✏️ Edit Data Guru' : '➕ Tambah Guru Baru'}
                                                </h2>
                                                <form onSubmit={handleSubmit}>
                                                        <div className="mb-4">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2">Nama Lengkap</label>
                                                                <input
                                                                        type="text" name="name"
                                                                        value={formData.name} onChange={handleChange}
                                                                        required
                                                                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                                                                        placeholder="Contoh: Budi Santoso"
                                                                />
                                                        </div>
                                                        <div className="mb-4">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2">NIP (Opsional)</label>
                                                                <input
                                                                        type="text" name="nip"
                                                                        value={formData.nip} onChange={handleChange}
                                                                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                                                                />
                                                        </div>
                                                        <div className="mb-4">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                                                <input
                                                                        type="email" name="email"
                                                                        value={formData.email} onChange={handleChange}
                                                                        required
                                                                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                                                                />
                                                        </div>
                                                        <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2">Jenis Kelamin</label>
                                                                <select
                                                                        name="jenis_kelamin"
                                                                        value={formData.jenis_kelamin} onChange={handleChange}
                                                                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500 bg-white"
                                                                >
                                                                        <option value="L">Laki-laki</option>
                                                                        <option value="P">Perempuan</option>
                                                                </select>
                                                        </div>

                                                        <div className="flex justify-end space-x-3">
                                                                <button
                                                                        type="button"
                                                                        onClick={() => setIsModalOpen(false)}
                                                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                                                >
                                                                        Batal
                                                                </button>
                                                                <button
                                                                        type="submit"
                                                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold"
                                                                        disabled={loading}
                                                                >
                                                                        {loading ? 'Menyimpan...' : 'Simpan Data'}
                                                                </button>
                                                        </div>
                                                </form>
                                        </div>
                                </div>
                        )}

                        {/* --- MODAL SET RFID (YANG HILANG TADI) --- */}
                        {isRfidModalOpen && (
                                <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50">
                                        <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm text-center">
                                                <div className="mb-4">
                                                        <span className="text-4xl">📡</span>
                                                </div>
                                                <h2 className="text-xl font-bold mb-2 text-gray-800">Scan Kartu RFID</h2>
                                                <p className="text-sm text-gray-600 mb-4">
                                                        Tempelkan kartu pada reader untuk guru: <br />
                                                        <span className="font-bold text-blue-600 text-lg">{rfidData.name}</span>
                                                </p>

                                                <form onSubmit={handleRfidSubmit}>
                                                        <div className="mb-6">
                                                                <input
                                                                        type="text"
                                                                        autoFocus // Biar langsung siap scan
                                                                        value={rfidData.rfid_uid}
                                                                        onChange={(e) => setRfidData({ ...rfidData, rfid_uid: e.target.value })}
                                                                        placeholder="UID Kartu..."
                                                                        className="w-full text-center border-2 border-dashed border-blue-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-lg"
                                                                />
                                                                <p className="text-xs text-gray-400 mt-2">*Klik input box lalu tap kartu</p>
                                                        </div>

                                                        <div className="flex justify-center space-x-3">
                                                                <button
                                                                        type="button"
                                                                        onClick={() => setIsRfidModalOpen(false)}
                                                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                                                >
                                                                        Tutup
                                                                </button>
                                                                <button
                                                                        type="submit"
                                                                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-bold shadow-lg"
                                                                >
                                                                        Simpan RFID
                                                                </button>
                                                        </div>
                                                </form>
                                        </div>
                                </div>
                        )}
                </div>
        );
}