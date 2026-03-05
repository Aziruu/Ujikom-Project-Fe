import { useTeachingSchedule } from '../../hooks/useTeachingSchedule';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";

export default function TeachingSchedule() {
        const { state, actions } = useTeachingSchedule();
        const { data, teachers, classrooms, subjects, loading, modalOpen, isEditing, form, currentPage, totalPages } = state;

        return (
                <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                                <div>
                                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Jadwal Mengajar (KBM)</h1>
                                        <p className="text-sm text-gray-500 mt-1">Atur jadwal guru mengajar per kelas dan mata pelajaran.</p>
                                </div>
                                <button onClick={() => actions.openModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-md">
                                        + Tambah Jadwal
                                </button>
                        </div>

                        {/* TABEL DATA */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                                <div className="max-w-full overflow-x-auto">
                                        <Table>
                                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                                        <TableRow>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Hari & Jam</TableCell>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Guru</TableCell>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Mata Pelajaran</TableCell>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Kelas</TableCell>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-right text-theme-xs dark:text-gray-400">Aksi</TableCell>
                                                        </TableRow>
                                                </TableHeader>
                                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                                        {loading && !modalOpen ? (
                                                                <TableRow>
                                                                        <TableCell colSpan="5" className="text-center py-10 text-gray-500 text-theme-sm">Sedang memuat data...</TableCell>
                                                                </TableRow>
                                                        ) : data.length === 0 ? (
                                                                <TableRow>
                                                                        <TableCell colSpan="5" className="text-center py-10 text-gray-500 text-theme-sm">Belum ada jadwal KBM.</TableCell>
                                                                </TableRow>
                                                        ) : (
                                                                data.map(item => (
                                                                        <TableRow key={item.id}>
                                                                                <TableCell className="px-5 py-4 text-start">
                                                                                        <div className="font-bold capitalize text-blue-600 dark:text-blue-400 text-theme-sm">{item.day}</div>
                                                                                        <div className="font-mono text-gray-500 text-theme-xs mt-0.5">{item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}</div>
                                                                                </TableCell>
                                                                                <TableCell className="px-4 py-3 text-start font-medium text-gray-800 dark:text-white text-theme-sm">
                                                                                        {item.teacher?.name || 'Guru Dihapus'}
                                                                                </TableCell>
                                                                                <TableCell className="px-4 py-3 text-start">
                                                                                        <Badge size="sm" color="info">{item.subject?.name || '-'}</Badge>
                                                                                </TableCell>
                                                                                <TableCell className="px-4 py-3 text-start text-gray-600 dark:text-gray-300 font-medium text-theme-sm">
                                                                                        {item.classroom?.name || '-'}
                                                                                </TableCell>
                                                                                <TableCell className="px-4 py-3 text-right space-x-3">
                                                                                        <button onClick={() => actions.openModal(item)} className="text-blue-600 font-medium text-theme-sm hover:underline">Edit</button>
                                                                                        <button onClick={() => actions.handleDelete(item.id)} className="text-red-500 font-medium text-theme-sm hover:underline">Hapus</button>
                                                                                </TableCell>
                                                                        </TableRow>
                                                                ))
                                                        )}
                                                </TableBody>
                                        </Table>
                                </div>

                                {/* Navigasi Pagination */}
                                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                                Halaman <span className="font-semibold">{currentPage}</span> dari <span className="font-semibold">{totalPages}</span>
                                        </span>
                                        <div className="flex gap-2">
                                                <button
                                                        onClick={() => actions.setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                        disabled={currentPage === 1 || loading}
                                                        className="px-3 py-1 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 dark:text-white"
                                                >
                                                        Sebelumnya
                                                </button>
                                                <button
                                                        onClick={() => actions.setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                        disabled={currentPage === totalPages || loading}
                                                        className="px-3 py-1 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 dark:text-white"
                                                >
                                                        Selanjutnya
                                                </button>
                                        </div>
                                </div>
                        </div>

                        {/* MODAL FORM */}
                        {modalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
                                        <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl p-6 shadow-2xl">
                                                <h2 className="text-xl font-bold mb-4 dark:text-white">{isEditing ? 'Edit Jadwal KBM' : 'Tambah Jadwal KBM'}</h2>
                                                <form onSubmit={actions.handleSubmit} className="space-y-4">
                                                        <div className="mb-4">
                                                                <label className="block text-xs font-medium text-gray-500 mb-1">Pilih Guru</label>
                                                                <input
                                                                        type="text"
                                                                        placeholder="🔍 Cari nama guru..."
                                                                        value={state.teacherSearch || ''}
                                                                        onChange={(e) => actions.setTeacherSearch(e.target.value)}
                                                                        className="w-full p-2 text-xs mb-2 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                                                />
                                                                <select name="teacher_id" value={form.teacher_id} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required>
                                                                        <option value="">-- Hasil Pencarian ({Array.isArray(teachers) ? teachers.length : 0}) --</option>
                                                                        {Array.isArray(teachers) && teachers.map(t => (
                                                                                <option key={t.id} value={t.id}>{t.name} {t.nip ? `(${t.nip})` : ''}</option>
                                                                        ))}
                                                                </select>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Mata Pelajaran</label>
                                                                        <select name="subject_id" value={form.subject_id} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required>
                                                                                <option value="">-- Pilih Mapel --</option>
                                                                                {Array.isArray(subjects) && subjects.map(s => (
                                                                                        <option key={s.id} value={s.id}>{s.name}</option>
                                                                                ))}
                                                                        </select>
                                                                </div>
                                                                <div>
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Kelas</label>
                                                                        <select name="classroom_id" value={form.classroom_id} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required>
                                                                                <option value="">-- Pilih Kelas --</option>
                                                                                {Array.isArray(classrooms) && classrooms.map(c => (
                                                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                                                ))}
                                                                        </select>
                                                                </div>
                                                        </div>

                                                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
                                                                <label className="block text-xs font-medium text-gray-500 mb-2">Waktu Mengajar</label>
                                                                <div className="grid grid-cols-3 gap-4">
                                                                        <div>
                                                                                <label className="block text-[10px] text-gray-400 mb-1">Hari</label>
                                                                                <select name="day" value={form.day} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required>
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
                                                                                <label className="block text-[10px] text-gray-400 mb-1">Jam Mulai</label>
                                                                                <input type="time" step="60" name="start_time" value={form.start_time} onChange={actions.handleChange} onClick={(e) => e.target.showPicker && e.target.showPicker()} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required />
                                                                        </div>
                                                                        <div>
                                                                                <label className="block text-[10px] text-gray-400 mb-1">Jam Selesai</label>
                                                                                <input type="time" step="60" name="end_time" value={form.end_time} onChange={actions.handleChange} onClick={(e) => e.target.showPicker && e.target.showPicker()} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required />
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        <div className="flex justify-end gap-3 pt-5">
                                                                <button type="button" onClick={() => actions.setModalOpen(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400">Batal</button>
                                                                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition shadow-sm font-medium">
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