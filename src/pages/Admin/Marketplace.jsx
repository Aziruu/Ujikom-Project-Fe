import { useMarketplace } from '../../hooks/useMarketplace';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";

export default function Marketplace() {
        const { state, actions } = useMarketplace();
        const { data, loading, modalOpen, isEditing, form } = state;

        return (
                <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Katalog Reward</h1>
                                <button onClick={() => actions.openModal()} className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md">
                                        + Tambah Item
                                </button>
                        </div>

                        {/* Kontainer Tabel */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                                <div className="max-w-full overflow-x-auto">
                                        <Table>
                                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                                        <TableRow>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">Nama Item</TableCell>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs">Harga Poin</TableCell>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs">Status</TableCell>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-right text-theme-xs">Aksi</TableCell>
                                                        </TableRow>
                                                </TableHeader>

                                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                                        {loading ? (
                                                                <TableRow>
                                                                        <TableCell colSpan="4" className="text-center py-10 text-gray-500 text-theme-sm">Memuat data...</TableCell>
                                                                </TableRow>
                                                        ) : data?.length === 0 ? (
                                                                <TableRow>
                                                                        <TableCell colSpan="4" className="text-center py-10 text-gray-500 text-theme-sm">Belum ada item di toko.</TableCell>
                                                                </TableRow>
                                                        ) : (
                                                                data?.map((item) => (
                                                                        <TableRow key={item.id}>
                                                                                <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white text-theme-sm">
                                                                                        {item.item_name}
                                                                                        <span className="block text-xs text-gray-400 font-normal">{item.description}</span>
                                                                                </TableCell>
                                                                                <TableCell className="px-5 py-4 text-center text-orange-500 font-bold text-theme-sm">
                                                                                        🪙 {item.point_cost}
                                                                                </TableCell>
                                                                                <TableCell className="px-5 py-4 text-center">
                                                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                                                {item.is_active ? 'Aktif' : 'Non-Aktif'}
                                                                                        </span>
                                                                                </TableCell>
                                                                                <TableCell className="px-5 py-4 text-right space-x-3">
                                                                                        <button onClick={() => actions.openModal(item)} className="text-blue-600 font-medium text-theme-sm hover:underline">Edit</button>
                                                                                        <button onClick={() => actions.handleDelete(item.id)} className="text-red-500 font-medium text-theme-sm hover:underline">Tarik</button>
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
                                        <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl p-6 shadow-xl">
                                                <h2 className="text-xl font-bold mb-4 dark:text-white">{isEditing ? 'Edit Item' : 'Tambah Item'}</h2>
                                                <form onSubmit={actions.handleSubmit} className="space-y-4">
                                                        <input type="text" name="item_name" value={form.item_name} onChange={actions.handleChange} placeholder="Nama Item (Cth: Telat 15 Menit)" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required />
                                                        <textarea name="description" value={form.description} onChange={actions.handleChange} placeholder="Deskripsi Singkat" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />

                                                        <div className="flex gap-4">
                                                                <input type="number" name="point_cost" value={form.point_cost} onChange={actions.handleChange} placeholder="Harga Poin" className="w-1/2 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required min="1" />
                                                                <input type="number" name="stock_limit" value={form.stock_limit} onChange={actions.handleChange} placeholder="Limit (Opsional)" className="w-1/2 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                                                        </div>

                                                        <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                                                <input type="checkbox" name="is_active" checked={form.is_active} onChange={actions.handleChange} className="rounded" />
                                                                <span>Tampilkan di aplikasi guru (Aktif)</span>
                                                        </label>

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