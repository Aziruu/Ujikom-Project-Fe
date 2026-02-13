import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import PageMeta from "../components/common/PageMeta";

export default function CreateLeave() {
        const navigate = useNavigate();
        const [teachers, setTeachers] = useState([]);
        const [loading, setLoading] = useState(false);

        // State Form
        const [formData, setFormData] = useState({
                teacher_id: '',
                start_date: '',
                end_date: '',
                type: 'sakit', // Default
                reason: ''
        });

        // State Khusus File
        const [file, setFile] = useState(null);

        // Load Data Guru
        useEffect(() => {
                const loadTeachers = async () => {
                        try {
                                const res = await api.get('/teachers?per_page=100');
                                setTeachers(res.data.data);
                        } catch (err) {
                                console.error("Gagal load guru", err);
                        }
                };
                loadTeachers();
        }, []);

        const handleChange = (e) => {
                setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const handleFileChange = (e) => {
                setFile(e.target.files[0]);
        };

const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validasi File Wajib
        if (!file) {
            alert("Wajib upload surat dokter / bukti izin!");
            return;
        }

        setLoading(true);

        const data = new FormData();
        data.append('teacher_id', formData.teacher_id);
        data.append('start_date', formData.start_date);
        data.append('end_date', formData.end_date);
        data.append('type', formData.type);
        data.append('reason', formData.reason);
        data.append('file', file); 

        try {
            // --- PERBAIKAN DISINI ---
            // Tambahkan config headers 'multipart/form-data'
            await api.post('/leaves', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            alert("Pengajuan berhasil dikirim!");
            navigate('/leaves'); 
        } catch (error) {
            console.error("Error submit:", error);
            // Tampilkan pesan error detail dari backend jika ada
            const msg = error.response?.data?.message || "Gagal membuat pengajuan.";
            
            // Debugging: Cek error validasi spesifik
            if (error.response?.data?.errors) {
                console.log("Validation Errors:", error.response.data.errors);
            }
            
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

        return (
                <>
                        <PageMeta title="Buat Pengajuan Izin" />

                        <div className="max-w-2xl mx-auto space-y-6">
                                <button
                                        onClick={() => navigate('/leaves')}
                                        className="text-gray-500 hover:text-blue-600 text-sm flex items-center gap-1 transition"
                                >
                                        ← Kembali ke Daftar
                                </button>

                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Form Pengajuan Izin/Sakit</h2>

                                        <form onSubmit={handleSubmit} className="space-y-5">

                                                {/* Pilih Guru */}
                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Guru</label>
                                                        <select
                                                                name="teacher_id"
                                                                value={formData.teacher_id}
                                                                onChange={handleChange}
                                                                required
                                                                className="w-full p-2.5 rounded-lg border dark:bg-gray-900 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                                <option value="">-- Pilih Guru --</option>
                                                                {teachers.map(t => (
                                                                        <option key={t.id} value={t.id}>{t.name} - {t.nip}</option>
                                                                ))}
                                                        </select>
                                                </div>

                                                {/* Tanggal (DENGAN FIX SHOWPICKER) */}
                                                <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dari Tanggal</label>
                                                                <input
                                                                        type="date"
                                                                        name="start_date"
                                                                        value={formData.start_date}
                                                                        onChange={handleChange}
                                                                        onClick={(e) => e.target.showPicker()} // <--- INI SOLUSINYA
                                                                        required
                                                                        className="w-full p-2.5 rounded-lg border dark:bg-gray-900 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                                                />
                                                        </div>
                                                        <div>
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sampai Tanggal</label>
                                                                <input
                                                                        type="date"
                                                                        name="end_date"
                                                                        value={formData.end_date}
                                                                        onChange={handleChange}
                                                                        onClick={(e) => e.target.showPicker()} // <--- INI SOLUSINYA
                                                                        required
                                                                        className="w-full p-2.5 rounded-lg border dark:bg-gray-900 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                                                />
                                                        </div>
                                                </div>

                                                {/* Jenis Izin (Cuti Tahunan SUDAH DIHAPUS) */}
                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jenis Izin</label>
                                                        <select
                                                                name="type"
                                                                value={formData.type}
                                                                onChange={handleChange}
                                                                className="w-full p-2.5 rounded-lg border dark:bg-gray-900 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                                <option value="sakit">Sakit</option>
                                                                <option value="izin">Izin</option>
                                                        </select>
                                                </div>

                                                {/* File Upload (WAJIB) */}
                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                Upload Surat Dokter / Bukti (PDF/JPG) <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                                type="file"
                                                                onChange={handleFileChange}
                                                                accept=".jpg,.jpeg,.png,.pdf"
                                                                required
                                                                className="w-full p-2 text-sm border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:bg-gray-900 dark:border-gray-600 cursor-pointer"
                                                        />
                                                        <p className="text-xs text-gray-500 mt-1">Maksimal 2MB. Wajib diisi.</p>
                                                </div>

                                                {/* Alasan */}
                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keterangan</label>
                                                        <textarea
                                                                name="reason"
                                                                value={formData.reason}
                                                                onChange={handleChange}
                                                                required
                                                                rows="3"
                                                                placeholder="Jelaskan alasan..."
                                                                className="w-full p-2.5 rounded-lg border dark:bg-gray-900 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500"
                                                        ></textarea>
                                                </div>

                                                {/* Submit */}
                                                <div className="pt-4">
                                                        <button
                                                                type="submit"
                                                                disabled={loading}
                                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                                                        >
                                                                {loading ? 'Mengirim...' : 'Kirim Pengajuan'}
                                                        </button>
                                                </div>

                                        </form>
                                </div>
                        </div>
                </>
        );
}