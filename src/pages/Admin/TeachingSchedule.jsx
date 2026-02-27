import { useTeachingSchedule } from '../../hooks/useTeachingSchedule';

export default function TeachingSchedule() {
        const { state, actions } = useTeachingSchedule();
        const { data, teachers, classrooms, subjects, loading, modalOpen, isEditing, form } = state;

        return (
                <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                                <div>
                                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Jadwal Mengajar (KBM)</h1>
                                        <p className="text-sm text-gray-500 mt-1">Atur jadwal guru mengajar per kelas dan mata pelajaran.</p>
                                </div>
                                <button onClick={() => actions.openModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                                        + Tambah Jadwal
                                </button>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white uppercase">
                                                <tr>
                                                        <th className="p-4">Hari & Jam</th>
                                                        <th className="p-4">Guru</th>
                                                        <th className="p-4">Mata Pelajaran</th>
                                                        <th className="p-4">Kelas</th>
                                                        <th className="p-4 text-right">Aksi</th>
                                                </tr>
                                        </thead>
                                        <tbody className="divide-y dark:divide-gray-700">
                                                {data.length === 0 ? (
                                                        <tr><td colSpan="5" className="p-8 text-center text-gray-500">Belum ada jadwal KBM.</td></tr>
                                                ) : (
                                                        data.map(item => (
                                                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                                                        <td className="p-4">
                                                                                <div className="font-bold capitalize text-blue-600 dark:text-blue-400">{item.day}</div>
                                                                                <div className="font-mono text-xs text-gray-500">{item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}</div>
                                                                        </td>
                                                                        <td className="p-4 font-medium dark:text-white">{item.teacher?.name || 'Guru Dihapus'}</td>
                                                                        <td className="p-4 text-gray-600 dark:text-gray-300">
                                                                                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-semibold">{item.subject?.name || '-'}</span>
                                                                        </td>
                                                                        <td className="p-4 text-gray-600 dark:text-gray-300 font-medium">{item.classroom?.name || '-'}</td>
                                                                        <td className="p-4 text-right space-x-2">
                                                                                <button onClick={() => actions.openModal(item)} className="text-blue-600 font-medium hover:underline">Edit</button>
                                                                                <button onClick={() => actions.handleDelete(item.id)} className="text-red-500 font-medium hover:underline">Hapus</button>
                                                                        </td>
                                                                </tr>
                                                        ))
                                                )}
                                        </tbody>
                                </table>
                        </div>

                        {/* MODAL FORM */}
                        {modalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
                                        <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl p-6 shadow-2xl">
                                                <h2 className="text-xl font-bold mb-4 dark:text-white">{isEditing ? 'Edit Jadwal KBM' : 'Tambah Jadwal KBM'}</h2>
                                                <form onSubmit={actions.handleSubmit} className="space-y-4">

                                                        <div>
                                                                <label className="block text-xs font-medium text-gray-500 mb-1">Pilih Guru</label>
                                                                <select name="teacher_id" value={form.teacher_id} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                                                                        <option value="">-- Silahkan Pilih Guru --</option>
                                                                        {Array.isArray(teachers) && teachers.map(t => (
                                                                                <option key={t.id} value={t.id}>{t.name} {t.nip ? `(${t.nip})` : ''}</option>
                                                                        ))}
                                                                </select>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Mata Pelajaran</label>
                                                                        <select name="subject_id" value={form.subject_id} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                                                                                <option value="">-- Pilih Mapel --</option>
                                                                                {Array.isArray(subjects) && subjects.map(s => (
                                                                                        <option key={s.id} value={s.id}>{s.name}</option>
                                                                                ))}
                                                                        </select>
                                                                </div>
                                                                <div>
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Kelas</label>
                                                                        <select name="classroom_id" value={form.classroom_id} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                                                                                <option value="">-- Pilih Kelas --</option>
                                                                                {Array.isArray(classrooms) && classrooms.map(c => (
                                                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                                                ))}
                                                                        </select>
                                                                </div>
                                                        </div>

                                                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
                                                                <label className="block text-xs font-medium text-gray-500 mb-1">Waktu Mengajar</label>
                                                                <div className="grid grid-cols-3 gap-4">
                                                                        <div>
                                                                                <label className="block text-[10px] text-gray-400">Hari</label>
                                                                                <select name="day" value={form.day} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                                                                                        <option value="senin">Senin</option>
                                                                                        <option value="selasa">Selasa</option>
                                                                                        <option value="rabu">Rabu</option>
                                                                                        <option value="kamis">Kamis</option>
                                                                                        <option value="jumat">Jumat</option>
                                                                                        <option value="sabtu">Sabtu</option>
                                                                                        <option value="minggu">Minggu</option>
                                                                                </select>
                                                                        </div>
                                                                        <div>
                                                                                <label className="block text-[10px] text-gray-400">Jam Mulai</label>
                                                                                <input type="time" step="60" name="start_time" value={form.start_time} onChange={actions.handleChange} onClick={(e) => e.target.showPicker && e.target.showPicker()} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                                                                        </div>
                                                                        <div>
                                                                                <label className="block text-[10px] text-gray-400">Jam Selesai</label>
                                                                                <input type="time" step="60" name="end_time" value={form.end_time} onChange={actions.handleChange} onClick={(e) => e.target.showPicker && e.target.showPicker()} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        <div className="flex justify-end gap-3 pt-4">
                                                                <button type="button" onClick={() => actions.setModalOpen(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400">Batal</button>
                                                                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition">
                                                                        {loading ? 'Menyimpan...' : 'Simpan Jadwal'}
                                                                </button>
                                                        </div>
                                                </form>
                                        </div>
                                </div>
                        )}
                </div>
        );
}