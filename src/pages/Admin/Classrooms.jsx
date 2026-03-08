import { useClassroom } from '../../hooks/useClassroom';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";

export default function Classroom() {
    const { state, actions } = useClassroom();
    const { data, majors, academicYears, teachers, loading, modalOpen, isEditing, form, teacherSearch, isDropdownOpen, loadingTeachers } = state;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Daftar Kelas</h1>
                <button onClick={() => actions.openModal()} className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md">
                    + Tambah Kelas
                </button>
            </div>

            {/* Kontainer Tabel Utama (Ditambah custom scrollbar tipis nan elegan) */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Nama Kelas</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tingkat</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Jurusan</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tahun Ajaran</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Wali Kelas</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-right text-theme-xs dark:text-gray-400">Aksi</TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {loading && !modalOpen ? (
                                <TableRow>
                                    <TableCell colSpan="6" className="text-center py-10 text-gray-500 text-theme-sm">Memuat data...</TableCell>
                                </TableRow>
                            ) : data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan="6" className="text-center py-10 text-gray-500 text-theme-sm">Tidak ada data kelas.</TableCell>
                                </TableRow>
                            ) : (
                                data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="px-5 py-4 text-start font-bold text-blue-600 dark:text-blue-400 text-theme-sm">
                                            {item.name}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white text-theme-sm">
                                            Kelas {item.grade_level}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-300 text-theme-sm">
                                            {item.major?.name || '-'}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-300 text-theme-sm">
                                            {item.academic_year?.name}
                                            {item.academic_year?.is_active && (
                                                <span className="ml-2 inline-block"><Badge size="sm" color="success">Aktif</Badge></span>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400 text-theme-sm">
                                            {item.homeroom_teacher?.name || '- Belum Ada -'}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-right space-x-3">
                                            <button onClick={() => actions.openModal(item)} className="text-blue-600 font-medium text-theme-sm hover:underline">Edit</button>
                                            <button onClick={() => actions.handleDelete(item.id)} className="text-red-500 font-medium text-theme-sm hover:underline">Hapus</button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Modal Form */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl p-6 shadow-xl">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">{isEditing ? 'Edit Kelas' : 'Tambah Kelas Baru'}</h2>
                        <form onSubmit={actions.handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Nama Kelas</label>
                                    <input type="text" name="name" value={form.name} onChange={actions.handleChange} placeholder="Cth: X PPLG 1" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Tingkat</label>
                                    <select name="grade_level" value={form.grade_level} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required>
                                        <option value="10">Kelas 10</option>
                                        <option value="11">Kelas 11</option>
                                        <option value="12">Kelas 12</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Jurusan</label>
                                    <select name="major_id" value={form.major_id} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required>
                                        <option value="">-- Pilih Jurusan --</option>
                                        {Array.isArray(majors) && majors.map(m => (
                                            <option key={m.id} value={m.id}>{m.code} - {m.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Tahun Ajaran</label>
                                    <select name="academic_year_id" value={form.academic_year_id} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required>
                                        <option value="">-- Pilih Tahun --</option>
                                        {Array.isArray(academicYears) && academicYears.map(y => (
                                            <option key={y.id} value={y.id}>{y.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* CUSTOM DROPDOWN GURU UNTUK WALI KELAS */}
                            <div className="relative">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Wali Kelas (Opsional)</label>
                                <input
                                    type="text"
                                    placeholder="🔍 Cari nama wali kelas..."
                                    value={teacherSearch}
                                    onChange={(e) => actions.handleSearchTeacherInput(e.target.value)}
                                    onFocus={() => actions.setIsDropdownOpen(true)}
                                    className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                {isDropdownOpen && (
                                    <div
                                        className="absolute z-[60] w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-48 overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full"
                                        onScroll={actions.handleTeacherScroll}
                                    >
                                        {teachers.length === 0 && !loadingTeachers ? (
                                            <div className="p-3 text-sm text-gray-500 text-center">Tidak ada guru ditemukan</div>
                                        ) : (
                                            teachers.map(t => (
                                                <div
                                                    key={t.id}
                                                    onClick={() => actions.selectTeacher(t.id, t.name)}
                                                    className={`p-3 text-sm cursor-pointer border-b border-gray-50 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition ${form.homeroom_teacher_id === t.id ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold' : 'dark:text-gray-200'}`}
                                                >
                                                    {t.name} <span className="text-xs text-gray-400 block">{t.nip || 'Belum ada NIP'}</span>
                                                </div>
                                            ))
                                        )}

                                        {loadingTeachers && (
                                            <div className="p-2 text-center text-xs font-medium text-blue-500 animate-pulse bg-gray-50 dark:bg-gray-800">
                                                Memuat data lagi... ⏳
                                            </div>
                                        )}
                                    </div>
                                )}

                                {isDropdownOpen && (
                                    <div className="fixed inset-0 z-40" onClick={() => actions.setIsDropdownOpen(false)}></div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => actions.setModalOpen(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400">Batal</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50">
                                    {loading ? 'Menyimpan...' : 'Simpan Kelas'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}