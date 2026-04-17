import { usePointRule } from '../../hooks/usePointRule';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";

export default function PointRule() {
        const { state, actions } = usePointRule();
        const { data, loading, modalOpen, isEditing, form } = state;

        return (
                <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                                <div>
                                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Rule Engine Poin</h1>
                                        <p className="text-sm text-gray-500 mt-1">Atur logika penambahan & pengurangan poin absensi.</p>
                                </div>
                                <button onClick={() => actions.openModal()} className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md">
                                        + Tambah Rule
                                </button>
                        </div>

                        {/* Kontainer Tabel */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                                <div className="max-w-full overflow-x-auto">
                                        <Table>
                                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                                        <TableRow>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">Nama Aturan</TableCell>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs">Logika Waktu (Menit)</TableCell>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs">Efek Poin</TableCell>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs">Status</TableCell>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-right text-theme-xs">Aksi</TableCell>
                                                        </TableRow>
                                                </TableHeader>

                                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                                        {loading ? (
                                                                <TableRow>
                                                                        <TableCell colSpan="5" className="text-center py-10 text-gray-500 text-theme-sm">Memuat data...</TableCell>
                                                                </TableRow>
                                                        ) : data.length === 0 ? (
                                                                <TableRow>
                                                                        <TableCell colSpan="5" className="text-center py-10 text-gray-500 text-theme-sm">Tidak ada aturan yang aktif.</TableCell>
                                                                </TableRow>
                                                        ) : (
                                                                data.map((item) => (
                                                                        <TableRow key={item.id}>
                                                                                <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white text-theme-sm">
                                                                                        {item.rule_name}
                                                                                </TableCell>
                                                                                <TableCell className="px-5 py-4 text-center font-mono text-gray-600 dark:text-gray-300 text-theme-sm">
                                                                                        {item.condition_operator} {item.condition_value}
                                                                                </TableCell>
                                                                                <TableCell className="px-5 py-4 text-center text-theme-sm">
                                                                                        <span className={`font-bold ${item.point_modifier > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                                                                {item.point_modifier > 0 ? '+' : ''}{item.point_modifier}
                                                                                        </span>
                                                                                </TableCell>
                                                                                <TableCell className="px-5 py-4 text-center">
                                                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                                                {item.is_active ? 'Aktif' : 'Mati'}
                                                                                        </span>
                                                                                </TableCell>
                                                                                <TableCell className="px-5 py-4 text-right space-x-3">
                                                                                        <button onClick={() => actions.openModal(item)} className="text-blue-600 font-medium text-theme-sm hover:underline">Edit</button>
                                                                                        <button onClick={() => actions.handleDelete(item.id)} className="text-red-500 font-medium text-theme-sm hover:underline">Matikan</button>
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
                                        <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl p-6 shadow-xl">
                                                <h2 className="text-xl font-bold mb-4 dark:text-white">{isEditing ? 'Edit Aturan' : 'Tambah Aturan'}</h2>

                                                <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg mb-4 text-xs text-blue-800 dark:text-blue-200">
                                                        <strong>Panduan Waktu:</strong> Angka negatif (-) berarti datang lebih awal. Angka positif (+) berarti terlambat. <br />
                                                        Gunakan operator <strong>BETWEEN</strong> dengan nilai (Contoh: <code className="bg-white/50 px-1 rounded">-45,-30</code>) agar aturan spesifik.
                                                </div>

                                                <form onSubmit={actions.handleSubmit} className="space-y-4">
                                                        <div>
                                                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Nama Aturan</label>
                                                                <input type="text" name="rule_name" value={form.rule_name} onChange={actions.handleChange} placeholder="Cth: Datang 30 Menit Awal" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required />
                                                        </div>

                                                        <div className="flex gap-4">
                                                                <div className="w-1/3">
                                                                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Kondisi</label>
                                                                        <select name="condition_operator" value={form.condition_operator} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                                                                                <option value="<">Kurang dari {'(<)'}</option>
                                                                                <option value="<=">Kurang sama dengan {'(<=)'}</option>
                                                                                <option value=">">Lebih dari {'(>)'}</option>
                                                                                <option value=">=">Lebih sama dengan {'(>=)'}</option>
                                                                                <option value="=">Sama dengan {'(=)'}</option>
                                                                                <option value="BETWEEN">Di antara (BETWEEN)</option>
                                                                        </select>
                                                                </div>
                                                                <div className="w-2/3">
                                                                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Nilai Menit</label>
                                                                        <input type="text" name="condition_value" value={form.condition_value} onChange={actions.handleChange} placeholder="Cth: -30 atau -60,-30" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required />
                                                                </div>
                                                        </div>

                                                        <div>
                                                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Poin Didapat (Gunakan - untuk denda)</label>
                                                                <input type="number" name="point_modifier" value={form.point_modifier} onChange={actions.handleChange} placeholder="Cth: 5 atau -3" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required />
                                                        </div>

                                                        <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mt-2">
                                                                <input type="checkbox" name="is_active" checked={form.is_active} onChange={actions.handleChange} className="rounded" />
                                                                <span>Aktifkan Aturan Ini</span>
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