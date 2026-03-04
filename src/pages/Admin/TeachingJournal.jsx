import { useTeachingJournal } from '../../hooks/useTeachingJournal';
import { BASE_URL } from '../../api';

export default function TeachingJournal() {
        const { state, actions } = useTeachingJournal();
        const { data, teachers, classrooms, schedules, loading, modalOpen, form, viewPhotos } = state;

        return (
                <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                                <div>
                                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Jurnal Mengajar</h1>
                                        <p className="text-sm text-gray-500 mt-1">Laporan harian KBM beserta bukti foto dan lokasi.</p>
                                </div>
                                <button onClick={() => actions.openModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-md">
                                        + Buat Jurnal
                                </button>
                        </div>

                        {/* TABEL DATA JURNAL */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white uppercase">
                                                <tr>
                                                        <th className="p-4">Tanggal</th>
                                                        <th className="p-4">Guru</th>
                                                        <th className="p-4">Kelas</th>
                                                        <th className="p-4">Topik Bahasan</th>
                                                        <th className="p-4 text-center">Bukti Foto</th>
                                                        <th className="p-4 text-center">Status</th>
                                                        <th className="p-4 text-right">Aksi Admin</th>
                                                </tr>
                                        </thead>
                                        <tbody className="divide-y dark:divide-gray-700">
                                                {data.length === 0 ? (
                                                        <tr><td colSpan="7" className="p-8 text-center text-gray-500">Belum ada jurnal yang masuk.</td></tr>
                                                ) : (
                                                        data.map((item) => {
                                                                // Parsing JSON string jadi array buat ngitung jumlah foto
                                                                const photoArray = item.photo_evidence ? JSON.parse(item.photo_evidence) : [];

                                                                return (
                                                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                                                                <td className="p-4 font-medium dark:text-white">{item.date}</td>
                                                                                <td className="p-4 text-gray-600 dark:text-gray-300">{item.teacher?.name || '-'}</td>
                                                                                <td className="p-4 font-bold text-blue-600 dark:text-blue-400">{item.classroom?.name || '-'}</td>
                                                                                <td className="p-4 text-gray-600 dark:text-gray-300 max-w-xs truncate">{item.topic}</td>

                                                                                {/* TOMBOL LIHAT FOTO */}
                                                                                <td className="p-4 text-center">
                                                                                        {photoArray.length > 0 ? (
                                                                                                <button
                                                                                                        onClick={() => actions.setViewPhotos(photoArray)}
                                                                                                        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 mx-auto"
                                                                                                >
                                                                                                        👁️ {photoArray.length} Foto
                                                                                                </button>
                                                                                        ) : (
                                                                                                <span className="text-gray-400 text-xs">-</span>
                                                                                        )}
                                                                                </td>

                                                                                <td className="p-4 text-center">
                                                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'valid' ? 'bg-green-100 text-green-700' :
                                                                                                item.status === 'ditolak' ? 'bg-red-100 text-red-700' :
                                                                                                        'bg-yellow-100 text-yellow-700'
                                                                                                }`}>
                                                                                                {item.status.toUpperCase()}
                                                                                        </span>
                                                                                </td>

                                                                                {/* AKSI ADMIN */}
                                                                                <td className="p-4 text-right space-x-2">
                                                                                        {item.status === 'menunggu' && (
                                                                                                <>
                                                                                                        <button onClick={() => actions.handleVerify(item.id, 'valid')} className="text-green-600 font-bold hover:underline" title="Setujui">✅ ACC</button>
                                                                                                        <button onClick={() => actions.handleVerify(item.id, 'ditolak')} className="text-red-500 font-bold hover:underline" title="Tolak">❌ Tolak</button>
                                                                                                </>
                                                                                        )}
                                                                                        <button onClick={() => actions.handleDelete(item.id)} className="text-gray-400 hover:text-red-500 font-bold transition ml-2">🗑️</button>
                                                                                </td>
                                                                        </tr>
                                                                );
                                                        })
                                                )}
                                        </tbody>
                                </table>
                        </div>

                        {/* MODAL FORM TAMBAH JURNAL */}
                        {modalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in overflow-y-auto">
                                        <div className="bg-white dark:bg-gray-800 w-full max-w-xl rounded-xl p-6 shadow-2xl my-8">
                                                <h2 className="text-xl font-bold mb-4 dark:text-white">Buat Laporan Mengajar</h2>
                                                <form onSubmit={actions.handleSubmit} className="space-y-4">

                                                        <div className="grid grid-cols-2 gap-4">
                                                                <div className="relative">
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Pilih Guru</label>

                                                                        {/* Input Search Bar Guru */}
                                                                        <input
                                                                                type="text"
                                                                                placeholder="🔍 Cari nama guru..."
                                                                                value={state.teacherSearch}
                                                                                onChange={(e) => actions.setTeacherSearch(e.target.value)}
                                                                                className="w-full p-2 text-xs mb-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                                                                        />

                                                                        {/* Dropdown Hasil Pencarian (Maksimal nampilin 10) */}
                                                                        <select name="teacher_id" value={form.teacher_id} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                                                                                <option value="">-- Hasil Pencarian ({teachers.length}) --</option>
                                                                                {Array.isArray(teachers) && teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                                                        </select>
                                                                </div>

                                                                <div>
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Tanggal</label>
                                                                        <input type="date" name="date" value={form.date} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                                                                </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Kelas</label>
                                                                        <select name="classroom_id" value={form.classroom_id} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                                                                                <option value="">Kelas</option>
                                                                                {Array.isArray(classrooms) && classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                                        </select>
                                                                </div>
                                                                <div>
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Jadwal Terkait (Opsional)</label>
                                                                        <select name="schedule_id" value={form.schedule_id} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                                                <option value="">Pilih Jadwal</option>
                                                                                {Array.isArray(schedules) && schedules.map(s => (
                                                                                        <option key={s.id} value={s.id}>{s.day} ({s.start_time.slice(0, 5)}) - {s.subject?.name}</option>
                                                                                ))}
                                                                        </select>
                                                                </div>
                                                        </div>

                                                        <div>
                                                                <label className="block text-xs font-medium text-gray-500 mb-1">Topik Bahasan / Materi</label>
                                                                <textarea name="topic" value={form.topic} onChange={actions.handleChange} rows="2" placeholder="Cth: Membahas relasi database dan ORM" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                                                        </div>

                                                        {/* BAGIAN LOKASI GPS */}
                                                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                                                                <label className="block text-xs font-medium text-gray-500 mb-2">Lokasi Mengajar (GPS)</label>
                                                                <div className="flex gap-2 items-center">
                                                                        <button type="button" onClick={actions.getLocation} className="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-bold rounded transition">
                                                                                Ambil Lokasi Saat Ini
                                                                        </button>
                                                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                                                                {form.latitude ? `${form.latitude}, ${form.longitude}` : 'Lokasi belum dikunci'}
                                                                        </span>
                                                                </div>
                                                        </div>

                                                        {/* BAGIAN UPLOAD FOTO */}
                                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                                                                <label className="block text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">
                                                                        Bukti Foto Mengajar (1 - 3 Foto)
                                                                </label>
                                                                <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        multiple
                                                                        onChange={actions.handleFileChange}
                                                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 dark:file:bg-blue-800 dark:file:text-blue-200"
                                                                />
                                                                <p className="text-[10px] text-gray-400 mt-1">Pilih beberapa foto sekaligus. Maksimal 3 foto.</p>
                                                        </div>

                                                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                                                                <button type="button" onClick={() => actions.setModalOpen(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400">Batal</button>
                                                                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition font-medium">
                                                                        {loading ? 'Mengirim...' : 'Kirim Jurnal'}
                                                                </button>
                                                        </div>
                                                </form>
                                        </div>
                                </div>
                        )}

                        {/* MODAL VIEW FOTO (Muncul kalau state viewPhotos ada isinya) */}
                        {viewPhotos && (
                                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 animate-in fade-in" onClick={() => actions.setViewPhotos(null)}>
                                        <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-xl p-4 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                                                <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                                                        <h2 className="text-lg font-bold dark:text-white">Bukti Foto Mengajar</h2>
                                                        <button onClick={() => actions.setViewPhotos(null)} className="text-gray-500 hover:text-red-500 font-bold text-2xl leading-none">&times;</button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[70vh] p-2">
                                                        {viewPhotos.map((photo, idx) => (
                                                                <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                                                                        <img
                                                                                src={`${BASE_URL}/storage/${photo}`}
                                                                                alt={`Bukti ${idx + 1}`}
                                                                                className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                                                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Foto+Tidak+Ditemukan' }}
                                                                        />
                                                                </div>
                                                        ))}
                                                </div>
                                        </div>
                                </div>
                        )}
                </div>
        );
}