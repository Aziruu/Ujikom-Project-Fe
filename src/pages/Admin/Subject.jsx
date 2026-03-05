import { useSubject } from '../../hooks/useSubject';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";

export default function Subject() {
        const { state, actions } = useSubject();
        const { data, loading, modalOpen, isEditing, form } = state;

        return (
                <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mata Pelajaran</h1>
                                <button onClick={() => actions.openModal()} className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md">
                                        + Tambah Baru
                                </button>
                        </div>

                        {/* Kontainer Tabel */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                                <div className="max-w-full overflow-x-auto">
                                        <Table>
                                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                                        <TableRow>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Nama Pelajaran</TableCell>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-right text-theme-xs dark:text-gray-400">Aksi</TableCell>
                                                        </TableRow>
                                                </TableHeader>

                                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                                        {loading ? (
                                                                <TableRow>
                                                                        <TableCell colSpan="2" className="text-center py-10 text-gray-500 text-theme-sm">Memuat data...</TableCell>
                                                                </TableRow>
                                                        ) : data.length === 0 ? (
                                                                <TableRow>
                                                                        <TableCell colSpan="2" className="text-center py-10 text-gray-500 text-theme-sm">Tidak ada data mata pelajaran.</TableCell>
                                                                </TableRow>
                                                        ) : (
                                                                data.map((item) => (
                                                                        <TableRow key={item.id}>
                                                                                <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white text-theme-sm">
                                                                                        {item.name}
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
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                                        <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-xl p-6 shadow-xl">
                                                <h2 className="text-xl font-bold mb-4 dark:text-white">{isEditing ? 'Edit Mapel' : 'Tambah Mapel'}</h2>
                                                <form onSubmit={actions.handleSubmit} className="space-y-4">
                                                        <input type="text" name="name" value={form.name} onChange={actions.handleChange} placeholder="Nama Pelajaran (Cth: Matematika)" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required />
                                                        <div className="flex justify-end gap-2 pt-4">
                                                                <button type="button" onClick={() => actions.setModalOpen(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400">Batal</button>
                                                                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50">
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