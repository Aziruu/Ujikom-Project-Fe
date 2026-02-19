import { useMajor } from '../hooks/useMajor';

export default function Major() {
        const { state, actions } = useMajor();
        const { data, teachers, loading, modalOpen, isEditing, form } = state;

        return (
                <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Jurusan (Major)</h1>
                                <button onClick={() => actions.openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                        + Tambah Baru
                                </button>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white uppercase">
                                                <tr>
                                                        <th className="p-4">Kode</th>
                                                        <th className="p-4">Nama Jurusan</th>
                                                        <th className="p-4">Kepala Program</th>
                                                        <th className="p-4 text-right">Aksi</th>
                                                </tr>
                                        </thead>
                                        <tbody className="divide-y dark:divide-gray-700">
                                                {data.map(item => (
                                                        <tr key={item.id}>
                                                                <td className="p-4 font-bold text-blue-600 dark:text-blue-400">{item.code}</td>
                                                                <td className="p-4 font-medium dark:text-white">{item.name}</td>
                                                                <td className="p-4 text-gray-500 dark:text-gray-400">
                                                                        {item.head_of_program?.name || '- Belum Ada -'}
                                                                </td>
                                                                <td className="p-4 text-right space-x-2">
                                                                        <button onClick={() => actions.openModal(item)} className="text-blue-600 font-medium">Edit</button>
                                                                        <button onClick={() => actions.handleDelete(item.id)} className="text-red-500 font-medium">Hapus</button>
                                                                </td>
                                                        </tr>
                                                ))}
                                        </tbody>
                                </table>
                        </div>

                        {modalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                                        <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl p-6">
                                                <h2 className="text-xl font-bold mb-4 dark:text-white">{isEditing ? 'Edit Jurusan' : 'Tambah Jurusan'}</h2>
                                                <form onSubmit={actions.handleSubmit} className="space-y-4">
                                                        <div className="grid grid-cols-3 gap-4">
                                                                <div className="col-span-1">
                                                                        <label className="block text-xs text-gray-500 mb-1">Kode</label>
                                                                        <input type="text" name="code" value={form.code} onChange={actions.handleChange} placeholder="RPL" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white" required />
                                                                </div>
                                                                <div className="col-span-2">
                                                                        <label className="block text-xs text-gray-500 mb-1">Nama Jurusan</label>
                                                                        <input type="text" name="name" value={form.name} onChange={actions.handleChange} placeholder="Rekayasa Perangkat Lunak" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white" required />
                                                                </div>
                                                        </div>

                                                        <div>
                                                                <label className="block text-xs text-gray-500 mb-1">Kepala Program (Opsional)</label>
                                                                <select name="head_of_program_id" value={form.head_of_program_id} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white">
                                                                        <option value="">-- Pilih Guru --</option>
                                                                        {Array.isArray(teachers) && teachers.map(t => (
                                                                                <option key={t.id} value={t.id}>{t.name}</option>
                                                                        ))}
                                                                </select>
                                                        </div>

                                                        <div className="flex justify-end gap-2 pt-4">
                                                                <button type="button" onClick={() => actions.setModalOpen(false)} className="px-4 py-2 text-gray-500">Batal</button>
                                                                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{loading ? 'Simpan...' : 'Simpan'}</button>
                                                        </div>
                                                </form>
                                        </div>
                                </div>
                        )}
                </div>
        );
}