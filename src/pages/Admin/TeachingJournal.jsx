import { useTeachingJournal } from '../../hooks/useTeachingJournal';
import { BASE_URL } from '../../api';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";

export default function TeachingJournal() {
        const { state, actions } = useTeachingJournal();
        const { data, teachers, classrooms, schedules, loading, modalOpen, form, viewPhotos } = state;

        return (
                <div className="p-6 font-sans">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                <div>
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Jurnal Mengajar</h1>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Laporan harian KBM beserta bukti foto dan lokasi.</p>
                                </div>
                                <button onClick={() => actions.openModal()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-sm">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                        Buat Jurnal
                                </button>
                        </div>

                        {/* TABEL DATA JURNAL */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm">
                                <div className="max-w-full overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                                        <Table>
                                                <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                                        <TableRow>
                                                                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-start">Tanggal</TableCell>
                                                                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-start">Guru</TableCell>
                                                                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-start">Kelas</TableCell>
                                                                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-start">Topik Bahasan</TableCell>
                                                                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-center">Bukti Foto</TableCell>
                                                                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-center">Status</TableCell>
                                                                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-right">Aksi Admin</TableCell>
                                                        </TableRow>
                                                </TableHeader>
                                                <TableBody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                                                        {loading && !modalOpen ? (
                                                                <TableRow>
                                                                        <TableCell colSpan="7" className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">Sedang memuat data...</TableCell>
                                                                </TableRow>
                                                        ) : data.length === 0 ? (
                                                                <TableRow>
                                                                        <TableCell colSpan="7" className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">Belum ada jurnal yang masuk.</TableCell>
                                                                </TableRow>
                                                        ) : (
                                                                data.map((item) => {
                                                                        const photoArray = item.photo_evidence ? JSON.parse(item.photo_evidence) : [];

                                                                        return (
                                                                                <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                                                                        <TableCell className="px-6 py-4 text-start font-mono font-medium text-gray-700 dark:text-gray-300 text-sm">
                                                                                                {item.date}
                                                                                        </TableCell>
                                                                                        <TableCell className="px-6 py-4 text-start text-gray-800 dark:text-gray-200 font-medium text-sm">
                                                                                                {item.teacher?.name || '-'}
                                                                                        </TableCell>
                                                                                        <TableCell className="px-6 py-4 text-start font-bold text-blue-600 dark:text-blue-400 text-sm">
                                                                                                {item.classroom?.name || '-'}
                                                                                        </TableCell>
                                                                                        <TableCell className="px-6 py-4 text-start text-gray-600 dark:text-gray-400 text-sm max-w-[200px] truncate" title={item.topic}>
                                                                                                {item.topic}
                                                                                        </TableCell>
                                                                                        <TableCell className="px-6 py-4 text-center">
                                                                                                {photoArray.length > 0 ? (
                                                                                                        <button
                                                                                                                onClick={() => actions.setViewPhotos(photoArray)}
                                                                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 transition-colors mx-auto"
                                                                                                        >
                                                                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                                                                                                {photoArray.length} Foto
                                                                                                        </button>
                                                                                                ) : (
                                                                                                        <span className="text-gray-400 dark:text-gray-600 text-xs italic">Kosong</span>
                                                                                                )}
                                                                                        </TableCell>
                                                                                        <TableCell className="px-6 py-4 text-center">
                                                                                                <Badge size="sm" color={item.status === 'valid' ? 'success' : item.status === 'ditolak' ? 'error' : 'warning'}>
                                                                                                        {item.status.toUpperCase()}
                                                                                                </Badge>
                                                                                        </TableCell>
                                                                                        <TableCell className="px-6 py-4">
                                                                                                <div className="flex items-center justify-end gap-2">
                                                                                                        {item.status === 'menunggu' && (
                                                                                                                <>
                                                                                                                        <button
                                                                                                                                onClick={() => actions.handleVerify(item.id, 'valid')}
                                                                                                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-md bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20 transition-colors"
                                                                                                                                title="Setujui Jurnal"
                                                                                                                        >
                                                                                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                                                                                                ACC
                                                                                                                        </button>
                                                                                                                        <button
                                                                                                                                onClick={() => actions.handleVerify(item.id, 'ditolak')}
                                                                                                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-md bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-colors"
                                                                                                                                title="Tolak Jurnal"
                                                                                                                        >
                                                                                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                                                                                                                Tolak
                                                                                                                        </button>
                                                                                                                </>
                                                                                                        )}
                                                                                                        <button
                                                                                                                onClick={() => actions.handleDelete(item.id)}
                                                                                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 rounded-lg transition-colors ml-1"
                                                                                                                title="Hapus Jurnal"
                                                                                                        >
                                                                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                                                                                        </button>
                                                                                                </div>
                                                                                        </TableCell>
                                                                                </TableRow>
                                                                        );
                                                                })
                                                        )}
                                                </TableBody>
                                        </Table>
                                </div>
                        </div>

                        {/* MODAL FORM TAMBAH JURNAL */}
                        {modalOpen && (
                                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto">
                                        <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-2xl p-6 shadow-2xl my-8 border border-gray-100 dark:border-gray-800">
                                                <div className="flex justify-between items-center mb-5">
                                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Buat Laporan Mengajar</h2>
                                                        <button onClick={() => actions.setModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                                        </button>
                                                </div>

                                                <form onSubmit={actions.handleSubmit} className="space-y-5">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="relative">
                                                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Pilih Guru</label>
                                                                        <div className="relative">
                                                                                <input
                                                                                        type="text"
                                                                                        placeholder="Cari nama guru..."
                                                                                        value={state.teacherSearch}
                                                                                        onChange={(e) => actions.handleSearchTeacherInput(e.target.value)}
                                                                                        onFocus={() => actions.setIsDropdownOpen(true)}
                                                                                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                                                />
                                                                                <svg className="absolute left-3 top-3 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                                                        </div>

                                                                        {state.isDropdownOpen && (
                                                                                <div
                                                                                        className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-48 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full"
                                                                                        onScroll={actions.handleTeacherScroll}
                                                                                >
                                                                                        {teachers.length === 0 && !state.loadingTeachers ? (
                                                                                                <div className="p-4 text-sm text-gray-500 text-center">Tidak ada guru ditemukan</div>
                                                                                        ) : (
                                                                                                teachers.map(t => (
                                                                                                        <div
                                                                                                                key={t.id}
                                                                                                                onClick={() => actions.selectTeacher(t.id, t.name)}
                                                                                                                className={`p-3 text-sm cursor-pointer border-b border-gray-50 dark:border-gray-700/50 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors ${form.teacher_id === t.id ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                                                                                                        >
                                                                                                                {t.name} <span className="text-xs text-gray-400 dark:text-gray-500 block font-mono mt-0.5">{t.nip || 'Belum ada NIP'}</span>
                                                                                                        </div>
                                                                                                ))
                                                                                        )}
                                                                                        {state.loadingTeachers && (
                                                                                                <div className="p-3 text-center text-xs font-semibold text-blue-500 animate-pulse bg-gray-50 dark:bg-gray-800/80">
                                                                                                        Memuat data lagi...
                                                                                                </div>
                                                                                        )}
                                                                                </div>
                                                                        )}
                                                                        {state.isDropdownOpen && (
                                                                                <div className="fixed inset-0 z-40" onClick={() => actions.setIsDropdownOpen(false)}></div>
                                                                        )}
                                                                </div>

                                                                <div>
                                                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Tanggal</label>
                                                                        <input
                                                                                type="date"
                                                                                name="date"
                                                                                value={form.date}
                                                                                onChange={actions.handleChange}
                                                                                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                                                                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
                                                                                required
                                                                        />
                                                                </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Kelas</label>
                                                                        <select name="classroom_id" value={form.classroom_id} onChange={actions.handleChange} className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" required>
                                                                                <option value="">-- Pilih Kelas --</option>
                                                                                {Array.isArray(classrooms) && classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                                        </select>
                                                                </div>
                                                                <div>
                                                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Jadwal Terkait (Opsional)</label>
                                                                        <select name="schedule_id" value={form.schedule_id} onChange={actions.handleChange} className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                                                                                <option value="">-- Pilih Jadwal --</option>
                                                                                {Array.isArray(schedules) && schedules.map(s => (
                                                                                        <option key={s.id} value={s.id}>{s.day} ({s.start_time.slice(0, 5)}) - {s.subject?.name}</option>
                                                                                ))}
                                                                        </select>
                                                                </div>
                                                        </div>

                                                        <div>
                                                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Topik Bahasan / Materi</label>
                                                                <textarea name="topic" value={form.topic} onChange={actions.handleChange} rows="2" placeholder="Cth: Membahas relasi database dan ORM" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
                                                        </div>

                                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
                                                                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                                                        <svg className="text-blue-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                                                        Lokasi Mengajar (GPS)
                                                                </label>
                                                                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                                                        <button type="button" onClick={actions.getLocation} className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-lg transition-colors shadow-sm">
                                                                                Ambil Lokasi Saat Ini
                                                                        </button>
                                                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-white dark:bg-gray-900 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 w-full sm:w-auto">
                                                                                {form.latitude ? `${form.latitude}, ${form.longitude}` : 'Lokasi belum dikunci'}
                                                                        </span>
                                                                </div>
                                                        </div>

                                                        <div className="bg-blue-50 dark:bg-blue-500/5 p-4 rounded-xl border border-blue-100 dark:border-blue-500/20 transition-colors">
                                                                <label className="flex items-center gap-2 text-xs font-semibold text-blue-800 dark:text-blue-400 mb-2">
                                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                                                                        Bukti Foto Mengajar (1 - 3 Foto)
                                                                </label>
                                                                <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        multiple
                                                                        onChange={actions.handleFileChange}
                                                                        className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                                                                />
                                                                <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-2">Pilih beberapa foto sekaligus. Maksimal 3 foto.</p>
                                                        </div>

                                                        <div className="flex justify-end gap-3 pt-2">
                                                                <button type="button" onClick={() => actions.setModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Batal</button>
                                                                <button type="submit" disabled={loading} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold disabled:opacity-50 transition-colors shadow-sm">
                                                                        {loading ? 'Mengirim...' : 'Kirim Jurnal'}
                                                                </button>
                                                        </div>
                                                </form>
                                        </div>
                                </div>
                        )}

                        {/* MODAL VIEW FOTO */}
                        {viewPhotos && (
                                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => actions.setViewPhotos(null)}>
                                        <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-2xl p-5 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                                                <div className="flex justify-between items-center mb-5 border-b border-gray-100 dark:border-gray-800 pb-3">
                                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bukti Foto Mengajar</h2>
                                                        <button onClick={() => actions.setViewPhotos(null)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                                        </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[70vh] p-1 custom-scrollbar">
                                                        {viewPhotos.map((photo, idx) => (
                                                                <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 shadow-sm">
                                                                        <img
                                                                                src={`${BASE_URL}/storage/${photo}`}
                                                                                alt={`Bukti ${idx + 1}`}
                                                                                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                                                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Foto+Tidak+Ditemukan' }}
                                                                        />
                                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                                                                <a href={`${BASE_URL}/storage/${photo}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-white bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg hover:bg-white/40 transition-colors w-full text-center">
                                                                                        Lihat Layar Penuh
                                                                                </a>
                                                                        </div>
                                                                </div>
                                                        ))}
                                                </div>
                                        </div>
                                </div>
                        )}
                </div>
        );
}