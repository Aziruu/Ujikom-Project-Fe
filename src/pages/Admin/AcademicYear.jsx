import { useAcademicYear } from '../../hooks/useAcademicYear';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";

export default function AcademicYear() {
        const { state, actions } = useAcademicYear();
        const { data, loading, modalOpen, isEditing, form } = state;

        return (
                <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tahun Ajaran</h1>
                                <button
                                        onClick={() => actions.openModal()}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-md"
                                >
                                        + Tambah Baru
                                </button>
                        </div>

                        {/* TABEL DATA MENGGUNAKAN KOMPONEN TEMPLAT */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                                <div className="max-w-full overflow-x-auto">
                                        <Table>
                                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                                        <TableRow>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Nama / Kode</TableCell>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tahun</TableCell>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Semester</TableCell>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Status</TableCell>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-right text-theme-xs dark:text-gray-400">Aksi</TableCell>
                                                        </TableRow>
                                                </TableHeader>

                                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                                        {loading && !modalOpen ? (
                                                                <TableRow>
                                                                        <TableCell colSpan="5" className="text-center py-10 text-gray-500 text-theme-sm">Memuat data...</TableCell>
                                                                </TableRow>
                                                        ) : data.length === 0 ? (
                                                                <TableRow>
                                                                        <TableCell colSpan="5" className="text-center py-10 text-gray-500 text-theme-sm">Belum ada data.</TableCell>
                                                                </TableRow>
                                                        ) : (
                                                                data.map((item) => (
                                                                        <TableRow key={item.id}>
                                                                                <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white text-theme-sm">
                                                                                        {item.name}
                                                                                </TableCell>
                                                                                <TableCell className="px-4 py-3 text-start text-gray-600 dark:text-gray-300 text-theme-sm">
                                                                                        {item.years}
                                                                                </TableCell>
                                                                                <TableCell className="px-4 py-3 text-start text-gray-600 dark:text-gray-300 text-theme-sm capitalize">
                                                                                        {item.semester}
                                                                                </TableCell>
                                                                                <TableCell className="px-4 py-3 text-center">
                                                                                        <Badge size="sm" color={item.is_active ? 'success' : 'light'}>
                                                                                                {item.is_active ? 'Aktif' : 'Non-Aktif'}
                                                                                        </Badge>
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
                        </div>

                        {/* MODAL FORM */}
                        {modalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                                        <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
                                                <h2 className="text-xl font-bold mb-4 dark:text-white">
                                                        {isEditing ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'}
                                                </h2>

                                                <form onSubmit={actions.handleSubmit} className="space-y-4">
                                                        <div>
                                                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Nama (Contoh: 2025/2026 Ganjil)</label>
                                                                <input
                                                                        type="text"
                                                                        name="name"
                                                                        value={form.name}
                                                                        onChange={actions.handleChange}
                                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
                                                                        required
                                                                />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Tahun</label>
                                                                        <input
                                                                                type="text"
                                                                                name="years"
                                                                                value={form.years}
                                                                                onChange={actions.handleChange}
                                                                                placeholder="2025/2026"
                                                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
                                                                                required
                                                                        />
                                                                </div>
                                                                <div>
                                                                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Semester</label>
                                                                        <select
                                                                                name="semester"
                                                                                value={form.semester}
                                                                                onChange={actions.handleChange}
                                                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
                                                                        >
                                                                                <option value="ganjil">Ganjil</option>
                                                                                <option value="genap">Genap</option>
                                                                        </select>
                                                                </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 pt-2">
                                                                <input
                                                                        type="checkbox"
                                                                        id="is_active"
                                                                        name="is_active"
                                                                        checked={form.is_active}
                                                                        onChange={actions.handleChange}
                                                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                                                />
                                                                <label htmlFor="is_active" className="text-sm font-medium dark:text-gray-300">
                                                                        Set sebagai Tahun Ajaran Aktif
                                                                </label>
                                                        </div>

                                                        <div className="flex justify-end gap-3 pt-4">
                                                                <button
                                                                        type="button"
                                                                        onClick={() => actions.setModalOpen(false)}
                                                                        className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                                >
                                                                        Batal
                                                                </button>
                                                                <button
                                                                        type="submit"
                                                                        disabled={loading}
                                                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
                                                                >
                                                                        {loading ? 'Menyimpan...' : 'Simpan'}
                                                                </button>
                                                        </div>
                                                </form>
                                        </div>
                                </div>
                        )}
                </div>
        );
}