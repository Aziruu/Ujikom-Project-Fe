import { useAcademicYear } from '../hooks/useAcademicYear';

export default function AcademicYear() {
        const { state, actions } = useAcademicYear();
        const { data, loading, modalOpen, isEditing, form } = state;

        return (
                <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tahun Ajaran</h1>
                                <button
                                        onClick={() => actions.openModal()}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                >
                                        + Tambah Baru
                                </button>
                        </div>

                        {/* TABEL DATA */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
                                <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white font-semibold uppercase tracking-wider">
                                                <tr>
                                                        <th className="p-4">Nama / Kode</th>
                                                        <th className="p-4">Tahun</th>
                                                        <th className="p-4">Semester</th>
                                                        <th className="p-4 text-center">Status</th>
                                                        <th className="p-4 text-right">Aksi</th>
                                                </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                {loading ? (
                                                        <tr><td colSpan="5" className="p-8 text-center">Loading data...</td></tr>
                                                ) : data.length === 0 ? (
                                                        <tr><td colSpan="5" className="p-8 text-center">Belum ada data.</td></tr>
                                                ) : (
                                                        data.map((item) => (
                                                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                                                        <td className="p-4 font-medium text-gray-900 dark:text-white">{item.name}</td>
                                                                        <td className="p-4">{item.years}</td>
                                                                        <td className="p-4 capitalize">{item.semester}</td>
                                                                        <td className="p-4 text-center">
                                                                                {item.is_active ? (
                                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                                                                Aktif
                                                                                        </span>
                                                                                ) : (
                                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                                                                                Non-Aktif
                                                                                        </span>
                                                                                )}
                                                                        </td>
                                                                        <td className="p-4 text-right space-x-2">
                                                                                <button
                                                                                        onClick={() => actions.openModal(item)}
                                                                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                                                                >
                                                                                        Edit
                                                                                </button>
                                                                                <button
                                                                                        onClick={() => actions.handleDelete(item.id)}
                                                                                        className="text-red-500 hover:text-red-700 font-medium"
                                                                                >
                                                                                        Hapus
                                                                                </button>
                                                                        </td>
                                                                </tr>
                                                        ))
                                                )}
                                        </tbody>
                                </table>
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
                                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                                                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                                                required
                                                                        />
                                                                </div>
                                                                <div>
                                                                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Semester</label>
                                                                        <select
                                                                                name="semester"
                                                                                value={form.semester}
                                                                                onChange={actions.handleChange}
                                                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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