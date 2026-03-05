import { useWorkSchedule } from '../../hooks/useWorkSchedule';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";

export default function WorkSchedule() {
    const { state, actions } = useWorkSchedule();
    const { data, loading, modalOpen, form } = state;

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Jadwal Kerja (Absensi)</h1>
                <p className="text-gray-500 text-sm mt-1">Atur jam masuk, jam pulang, dan batas toleransi telat (untuk absensi harian).</p>
            </div>

            {/* Kontainer Tabel */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Hari</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Jam Masuk</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Jam Pulang</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Toleransi Telat</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Status</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-right text-theme-xs dark:text-gray-400">Aksi</TableCell>
                            </TableRow>
                        </TableHeader>
                        
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan="6" className="text-center py-10 text-gray-500 text-theme-sm">Memuat data...</TableCell>
                                </TableRow>
                            ) : data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan="6" className="text-center py-10 text-gray-500 text-theme-sm">Tidak ada data jadwal kerja.</TableCell>
                                </TableRow>
                            ) : (
                                data.map((item) => (
                                    <TableRow key={item.id} className={item.is_holiday ? 'bg-red-50/30 dark:bg-red-900/10' : ''}>
                                        <TableCell className="px-5 py-4 text-start font-bold capitalize text-gray-800 dark:text-white text-theme-sm">
                                            {item.day_name}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-start font-mono text-gray-600 dark:text-gray-300 text-theme-sm">
                                            {item.start_time}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-start font-mono text-gray-600 dark:text-gray-300 text-theme-sm">
                                            {item.end_time}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-300 text-theme-sm">
                                            {item.late_tolerance} Menit
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-center">
                                            {item.is_holiday ? (
                                                <Badge size="sm" color="error">Libur</Badge>
                                            ) : (
                                                <Badge size="sm" color="success">Hari Kerja</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-right">
                                            <button onClick={() => actions.openModal(item)} className="text-blue-600 font-medium text-theme-sm hover:underline">
                                                Edit Waktu
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Modal Edit */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-xl p-6 shadow-xl">
                        <h2 className="text-xl font-bold mb-4 capitalize dark:text-white">Edit Hari {form.day_name}</h2>
                        <form onSubmit={actions.handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Jam Masuk</label>
                                    <input type="time" step="1" name="start_time" value={form.start_time} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Jam Pulang</label>
                                    <input type="time" step="1" name="end_time" value={form.end_time} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Toleransi Telat (Menit)</label>
                                <input type="number" name="late_tolerance" value={form.late_tolerance} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required />
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <input type="checkbox" id="is_holiday" name="is_holiday" checked={form.is_holiday} onChange={actions.handleChange} className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
                                <label htmlFor="is_holiday" className="text-sm font-medium dark:text-gray-300">
                                    Set sebagai Hari Libur
                                </label>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => actions.setModalOpen(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400">Batal</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50">
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