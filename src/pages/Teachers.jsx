import { useEffect, useState } from 'react';
import api from '../api';
import PageMeta from "../components/common/PageMeta";

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

        // --- HANDLERS ---
        const handleChange = (e) => {
                setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const openAddModal = () => {
                setIsEdit(false);
                setFormData({ name: '', nip: '', email: '', jenis_kelamin: 'L' });
                setIsModalOpen(true);
        };

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
                        console.error("Error saving teacher:", err);
                        alert("Gagal menyimpan data. Cek inputan.");
                } finally {
                        setLoading(false);
                }
        };

        const handleDelete = async (id) => {
                if (window.confirm("Yakin mau menghapus guru ini?")) {
                        try {
                                await api.delete(`/teachers/${id}`);
                                setTeachers(teachers.filter(t => t.id !== id));
                        } catch (err) {
                                console.error("Error deleting teacher:", err);
                                alert("Gagal menghapus data.");
                        }
                }
        };

        // Handler RFID
        const openRfidModal = (guru) => {
                setRfidData({
                        id: guru.id,
                        name: guru.name,
                        rfid_uid: guru.rfid_uid || ''
                });
                setIsRfidModalOpen(true);
        };

        const handleRfidSubmit = async (e) => {
                e.preventDefault();
                try {
                        await api.put(`/teachers/${rfidData.id}/rfid`, { rfid_uid: rfidData.rfid_uid });
                        alert(`RFID untuk ${rfidData.name} berhasil ditautkan!`);
                        setIsRfidModalOpen(false);
                        fetchTeachers();

                } catch (err) {
                        console.error("Error updating RFID:", err);
                        alert("Gagal mendaftarkan RFID.");
                }
        };

        return (
                <>
                        <PageMeta title="Data Guru | Si-Hadir Admin" description="Manajemen data guru" />

                        {/* Container Utama (Tanpa Sidebar & Margin aneh-aneh) */}
                        <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-gray-800 dark:bg-white/[0.03] sm:px-7.5 xl:pb-1">

                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                                                👨‍🏫 Data Guru
                                        </h4>
                                        <button
                                                onClick={openAddModal}
                                                className="flex items-center justify-center gap-2 rounded-lg bg-brand-500 py-2 px-4 text-white hover:bg-brand-600 transition"
                                        >
                                                ➕ Tambah Guru
                                        </button>
                                </div>

                                {error && (
                                        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-500 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                                                {error}
                                        </div>
                                )}

                                {/* Tabel */}
                                <div className="max-w-full overflow-x-auto">
                                        <table className="w-full table-auto">
                                                <thead>
                                                        <tr className="bg-gray-100 text-left dark:bg-gray-700/50">
                                                                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Nama</th>
                                                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">NIP</th>
                                                                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">Email</th>
                                                                <th className="py-4 px-4 font-medium text-black dark:text-white text-center">Aksi</th>
                                                        </tr>
                                                </thead>
                                                <tbody>
                                                        {loading && !isModalOpen && !isRfidModalOpen ? (
                                                                <tr><td colSpan="4" className="text-center py-10 text-gray-500">Sedang memuat data...</td></tr>
                                                        ) : teachers.length === 0 ? (
                                                                <tr><td colSpan="4" className="text-center py-10 text-gray-500">Belum ada data guru.</td></tr>
                                                        ) : (
                                                                teachers.map((guru) => (
                                                                        <tr key={guru.id}>
                                                                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-gray-700 xl:pl-11">
                                                                                        <h5 className="font-medium text-black dark:text-white">{guru.name}</h5>
                                                                                        <p className="text-sm text-gray-500">{guru.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                                                                                </td>
                                                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-gray-700">
                                                                                        <p className="text-black dark:text-white">{guru.nip || '-'}</p>
                                                                                </td>
                                                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-gray-700">
                                                                                        <p className="text-black dark:text-white">{guru.email}</p>
                                                                                </td>
                                                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-gray-700">
                                                                                        <div className="flex items-center justify-center space-x-3.5">
                                                                                                <button onClick={() => openRfidModal(guru)} className="hover:text-brand-500 text-gray-600 dark:text-gray-400" title="Set RFID">
                                                                                                        🆔
                                                                                                </button>
                                                                                                <button onClick={() => openEditModal(guru)} className="hover:text-brand-500 text-gray-600 dark:text-gray-400" title="Edit">
                                                                                                        ✏️
                                                                                                </button>
                                                                                                <button onClick={() => handleDelete(guru.id)} className="hover:text-red-500 text-gray-600 dark:text-gray-400" title="Hapus">
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

                        {/* --- MODAL INPUT DATA --- */}
                        {isModalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                        <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl dark:bg-gray-800">
                                                <h3 className="mb-6 text-xl font-bold text-black dark:text-white">
                                                        {isEdit ? '✏️ Edit Data Guru' : '➕ Tambah Guru Baru'}
                                                </h3>
                                                <form onSubmit={handleSubmit}>
                                                        <div className="mb-4">
                                                                <label className="mb-2.5 block text-black dark:text-white">Nama Lengkap</label>
                                                                <input
                                                                        type="text" name="name"
                                                                        value={formData.name} onChange={handleChange}
                                                                        required
                                                                        className="w-full rounded-lg border-[1.5px] border-gray-300 bg-transparent py-3 px-5 font-medium outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-500"
                                                                />
                                                        </div>
                                                        <div className="mb-4">
                                                                <label className="mb-2.5 block text-black dark:text-white">NIP</label>
                                                                <input type="text" name="nip" value={formData.nip} onChange={handleChange} className="w-full rounded-lg border-[1.5px] border-gray-300 bg-transparent py-3 px-5 font-medium outline-none transition focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900" />
                                                        </div>
                                                        <div className="mb-4">
                                                                <label className="mb-2.5 block text-black dark:text-white">Email</label>
                                                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full rounded-lg border-[1.5px] border-gray-300 bg-transparent py-3 px-5 font-medium outline-none transition focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900" />
                                                        </div>
                                                        <div className="mb-6">
                                                                <label className="mb-2.5 block text-black dark:text-white">Jenis Kelamin</label>
                                                                <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} className="w-full rounded-lg border-[1.5px] border-gray-300 bg-transparent py-3 px-5 font-medium outline-none transition focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                                                                        <option value="L">Laki-laki</option>
                                                                        <option value="P">Perempuan</option>
                                                                </select>
                                                        </div>
                                                        <div className="flex justify-end gap-3">
                                                                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded bg-gray-200 py-2 px-6 font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300">Batal</button>
                                                                <button type="submit" disabled={loading} className="rounded bg-brand-500 py-2 px-6 font-medium text-white hover:bg-brand-600">{loading ? 'Menyimpan...' : 'Simpan'}</button>
                                                        </div>
                                                </form>
                                        </div>
                                </div>
                        )}

                        {/* --- MODAL RFID --- */}
                        {isRfidModalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                                        <div className="w-full max-w-sm rounded-xl bg-white p-8 text-center shadow-2xl dark:bg-gray-800">
                                                <div className="mb-4 text-4xl">📡</div>
                                                <h3 className="mb-2 text-xl font-bold text-black dark:text-white">Scan Kartu RFID</h3>
                                                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Tempelkan kartu untuk <span className="font-bold text-brand-500">{rfidData.name}</span></p>
                                                <form onSubmit={handleRfidSubmit}>
                                                        <input
                                                                type="text" autoFocus
                                                                value={rfidData.rfid_uid}
                                                                onChange={(e) => setRfidData({ ...rfidData, rfid_uid: e.target.value })}
                                                                placeholder="Menunggu tap kartu..."
                                                                className="mb-6 w-full rounded-lg border-2 border-dashed border-brand-300 bg-gray-50 py-3 px-5 text-center font-mono text-lg outline-none focus:border-brand-500 dark:bg-gray-900 dark:text-white"
                                                        />
                                                        <div className="flex justify-center gap-3">
                                                                <button type="button" onClick={() => setIsRfidModalOpen(false)} className="rounded bg-gray-200 py-2 px-6 text-gray-700 dark:bg-gray-700 dark:text-gray-300">Tutup</button>
                                                                <button type="submit" className="rounded bg-brand-500 py-2 px-6 text-white hover:bg-brand-600">Simpan</button>
                                                        </div>
                                                </form>
                                        </div>
                                </div>
                        )}
                </>
        );
}