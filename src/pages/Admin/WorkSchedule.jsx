import { useWorkSchedule } from '../../hooks/useWorkSchedule';

export default function WorkSchedule() {
        const { state, actions } = useWorkSchedule();
        const { data, loading, modalOpen, form } = state;

        return (
                <div className="p-6">
                        <div className="mb-6">
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Jadwal Kerja (Absensi)</h1>
                                <p className="text-gray-500 text-sm mt-1">Atur jam masuk, jam pulang, dan batas toleransi telat (untuk absensi harian).</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
                                <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white uppercase">
                                                <tr>
                                                        <th className="p-4">Hari</th>
                                                        <th className="p-4">Jam Masuk</th>
                                                        <th className="p-4">Jam Pulang</th>
                                                        <th className="p-4">Toleransi Telat</th>
                                                        <th className="p-4 text-center">Status</th>
                                                        <th className="p-4 text-right">Aksi</th>
                                                </tr>
                                        </thead>
                                        <tbody className="divide-y dark:divide-gray-700">
                                                {data.map(item => (
                                                        <tr key={item.id} className={item.is_holiday ? 'bg-red-50 dark:bg-red-900/10' : ''}>
                                                                <td className="p-4 font-bold capitalize dark:text-white">{item.day_name}</td>
                                                                <td className="p-4 font-mono text-gray-600 dark:text-gray-300">{item.start_time}</td>
                                                                <td className="p-4 font-mono text-gray-600 dark:text-gray-300">{item.end_time}</td>
                                                                <td className="p-4 text-gray-600 dark:text-gray-300">{item.late_tolerance} Menit</td>
                                                                <td className="p-4 text-center">
                                                                        {item.is_holiday ? (
                                                                                <span className="px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-700">Libur</span>
                                                                        ) : (
                                                                                <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700">Hari Kerja</span>
                                                                        )}
                                                                </td>
                                                                <td className="p-4 text-right">
                                                                        <button onClick={() => actions.openModal(item)} className="text-blue-600 font-medium hover:underline">
                                                                                Edit Waktu
                                                                        </button>
                                                                </td>
                                                        </tr>
                                                ))}
                                        </tbody>
                                </table>
                        </div>

                        {/* MODAL EDIT */}
                        {modalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
                                        <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-xl p-6">
                                                <h2 className="text-xl font-bold mb-4 capitalize dark:text-white">Edit Hari {form.day_name}</h2>
                                                <form onSubmit={actions.handleSubmit} className="space-y-4">

                                                        <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Jam Masuk</label>
                                                                        <input type="time" step="1" name="start_time" value={form.start_time} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white" required />
                                                                </div>
                                                                <div>
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Jam Pulang</label>
                                                                        <input type="time" step="1" name="end_time" value={form.end_time} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white" required />
                                                                </div>
                                                        </div>

                                                        <div>
                                                                <label className="block text-xs font-medium text-gray-500 mb-1">Toleransi Telat (Menit)</label>
                                                                <input type="number" name="late_tolerance" value={form.late_tolerance} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white" required />
                                                        </div>

                                                        <div className="flex items-center gap-2 pt-2">
                                                                <input type="checkbox" id="is_holiday" name="is_holiday" checked={form.is_holiday} onChange={actions.handleChange} className="w-5 h-5 text-red-600 rounded" />
                                                                <label htmlFor="is_holiday" className="text-sm font-medium dark:text-gray-300">
                                                                        Set sebagai Hari Libur
                                                                </label>
                                                        </div>

                                                        <div className="flex justify-end gap-2 pt-4">
                                                                <button type="button" onClick={() => actions.setModalOpen(false)} className="px-4 py-2 text-gray-500">Batal</button>
                                                                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                                                                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                                                </button>
                                                        </div>
                                                </form>
                                        </div>
                                </div>
                        )}
                </div>
        );
}