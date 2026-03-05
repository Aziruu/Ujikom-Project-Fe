import PageMeta from "../../components/common/PageMeta";
import { useMajor } from "../../hooks/useMajor";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";

export default function Major() {
        const { state, actions } = useMajor();
        const { data, loading, modalOpen, isEditing, form, currentPage, totalPages, totalData, searchTerm, teachers, teacherSearch } = state;

        return (
                <>
                        <PageMeta title="Data Jurusan | Si-Hadir Admin" description="Manajemen data jurusan sekolah" />

                        <div className="space-y-6 p-6">
                                {/* Bagian Header */}
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Data Jurusan</h1>
                                                <p className="text-sm text-gray-500 mt-1">Total {totalData} jurusan terdaftar.</p>
                                        </div>
                                        <div className="flex gap-2">
                                                <div className="relative">
                                                        <input
                                                                type="text"
                                                                placeholder="Pencarian kode/nama..."
                                                                value={searchTerm}
                                                                onChange={actions.handleSearchChange}
                                                                className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64 dark:text-white"
                                                        />
                                                        <svg className="absolute left-3 top-2.5 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                                </div>
                                                <button onClick={() => actions.openModal()} className="flex items-center gap-2 rounded-lg bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 transition shadow-sm font-medium text-sm">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                                        <span className="hidden sm:inline">Tambah Jurusan</span>
                                                </button>
                                        </div>
                                </div>

                                {/* Kontainer Tabel Menggunakan Komponen Template */}
                                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                                        <div className="max-w-full overflow-x-auto">
                                                <Table>
                                                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                                                <TableRow>
                                                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Kode Jurusan</TableCell>
                                                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Nama Jurusan</TableCell>
                                                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Kepala Jurusan</TableCell>
                                                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-right text-theme-xs dark:text-gray-400">Aksi</TableCell>
                                                                </TableRow>
                                                        </TableHeader>

                                                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                                                {loading && !modalOpen ? (
                                                                        <TableRow>
                                                                                <TableCell colSpan="4" className="text-center py-10 text-gray-500 text-theme-sm">Memuat data...</TableCell>
                                                                        </TableRow>
                                                                ) : data.length === 0 ? (
                                                                        <TableRow>
                                                                                <TableCell colSpan="4" className="text-center py-10 text-gray-500 text-theme-sm">Data tidak ditemukan.</TableCell>
                                                                        </TableRow>
                                                                ) : (
                                                                        data.map((item) => (
                                                                                <TableRow key={item.id}>
                                                                                        <TableCell className="px-5 py-4 text-start font-mono font-bold text-gray-800 dark:text-gray-200 text-theme-sm">
                                                                                                {item.code}
                                                                                        </TableCell>
                                                                                        <TableCell className="px-4 py-3 text-start font-medium text-gray-800 dark:text-white text-theme-sm">
                                                                                                {item.name}
                                                                                        </TableCell>
                                                                                        <TableCell className="px-4 py-3 text-start text-gray-500 dark:text-gray-400 text-theme-sm">
                                                                                                {item.head_of_program?.name || '-'}
                                                                                        </TableCell>
                                                                                        <TableCell className="px-4 py-3 text-right">
                                                                                                <button onClick={() => actions.openModal(item)} className="text-blue-600 font-medium text-theme-sm hover:underline">Edit</button>
                                                                                                <button onClick={() => actions.handleDelete(item.id)} className="text-red-500 font-medium text-theme-sm hover:underline ml-3">Hapus</button>
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

                                {/* Modal Formulir */}
                                {modalOpen && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                                                <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl p-6 shadow-xl">
                                                        <h2 className="text-xl font-bold mb-4 dark:text-white">
                                                                {isEditing ? 'Ubah Data Jurusan' : 'Tambah Jurusan Baru'}
                                                        </h2>
                                                        <form onSubmit={actions.handleSubmit} className="space-y-4">
                                                                <div>
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Kode Jurusan</label>
                                                                        <input type="text" name="code" value={form.code} onChange={actions.handleChange} placeholder="Contoh: RPL" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white uppercase" required />
                                                                </div>
                                                                <div>
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Nama Jurusan</label>
                                                                        <input type="text" name="name" value={form.name} onChange={actions.handleChange} placeholder="Contoh: Rekayasa Perangkat Lunak" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                                                                </div>

                                                                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                                                                        <label className="block text-xs font-medium text-gray-500 mb-2">Pilih Kepala Jurusan (Opsional)</label>
                                                                        <input
                                                                                type="text"
                                                                                placeholder="Pencarian nama guru..."
                                                                                value={teacherSearch}
                                                                                onChange={(e) => actions.setTeacherSearch(e.target.value)}
                                                                                className="w-full p-2 text-xs mb-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white outline-none"
                                                                        />
                                                                        <select name="head_of_program_id" value={form.head_of_program_id} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                                                <option value="">-- Kosongkan atau Pilih Kepala Jurusan --</option>
                                                                                {Array.isArray(teachers) && teachers.map(t => (
                                                                                        <option key={t.id} value={t.id}>{t.name} {t.nip ? `(${t.nip})` : ''}</option>
                                                                                ))}
                                                                        </select>
                                                                </div>

                                                                <div className="flex justify-end gap-3 pt-4">
                                                                        <button type="button" onClick={() => actions.setModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300">Batal</button>
                                                                        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                                                                {loading ? 'Menyimpan...' : 'Simpan Data'}
                                                                        </button>
                                                                </div>
                                                        </form>
                                                </div>
                                        </div>
                                )}
                        </div>
                </>
        );
}