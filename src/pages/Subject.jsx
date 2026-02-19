import { useSubject } from '../hooks/useSubject';

export default function Subject() {
        const { state, actions } = useSubject();
        const { data, loading, modalOpen, isEditing, form } = state;

        return (
                <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mata Pelajaran</h1>
                                <button onClick={() => actions.openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                        + Tambah Baru
                                </button>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
                                <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white uppercase">
                                                <tr>
                                                        <th className="p-4">Nama Pelajaran</th>
                                                        <th className="p-4 text-right">Aksi</th>
                                                </tr>
                                        </thead>
                                        <tbody className="divide-y dark:divide-gray-700">
                                                {data.map(item => (
                                                        <tr key={item.id}>
                                                                <td className="p-4 font-medium dark:text-white">{item.name}</td>
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
                                        <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-xl p-6">
                                                <h2 className="text-xl font-bold mb-4 dark:text-white">{isEditing ? 'Edit Mapel' : 'Tambah Mapel'}</h2>
                                                <form onSubmit={actions.handleSubmit} className="space-y-4">
                                                        <input type="text" name="name" value={form.name} onChange={actions.handleChange} placeholder="Nama Pelajaran (Cth: Matematika)" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white" required />
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