import { useAttendanceReport } from '../../hooks/useAttendanceReport';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";

export default function AttendanceReport() {
    const { state, actions } = useAttendanceReport();
    const { data, loading, search, dateFilter, pagination } = state;

    return (
        <div className="min-h-[80vh] font-sans">
            {/* Header Page */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 p-6 pb-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Laporan Log</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Rekap data kehadiran guru</p>
                </div>

                {/* Filter */}
                <div className="flex gap-3 w-full md:w-auto">
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => actions.setDateFilter(e.target.value)}
                        className="p-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                    />
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari guru..."
                            value={search}
                            onChange={(e) => actions.setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 w-full sm:w-48 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                        />
                        <svg className="absolute left-3 top-2.5 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Tabel Menggunakan Komponen Template */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tanggal</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Guru</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Metode</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Jam Masuk</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Status</TableCell>
                                </TableRow>
                            </TableHeader>
                            
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan="5" className="text-center py-10 text-gray-500 text-theme-sm">Memuat data...</TableCell>
                                    </TableRow>
                                ) : data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan="5" className="text-center py-10 text-gray-500 text-theme-sm">Belum ada data absensi.</TableCell>
                                    </TableRow>
                                ) : (
                                    data.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="px-5 py-4 text-start text-gray-800 dark:text-gray-200 text-theme-sm whitespace-nowrap">
                                                {actions.formatDate(log.date)}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-start">
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">{log.teacher?.name}</span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400 font-mono mt-0.5">{log.teacher?.nip || '-'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                <Badge size="sm" color={log.method === 'rfid' ? 'primary' : 'info'}>
                                                    {log.method.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center font-mono text-gray-600 dark:text-gray-300 text-theme-sm">
                                                {log.check_in}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                <Badge size="sm" color={log.status === 'hadir' ? 'success' : log.status === 'telat' ? 'error' : 'warning'}>
                                                    {log.status === 'telat' ? `Telat ${log.late_duration}m` : log.status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Halaman <span className="font-semibold">{pagination.current_page || 1}</span> dari <span className="font-semibold">{pagination.last_page || 1}</span>
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={!pagination.prev_page_url || loading}
                                onClick={() => actions.fetchData(pagination.prev_page_url)}
                                className="px-3 py-1 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 dark:text-white"
                            >
                                Sebelumnya
                            </button>
                            <button
                                disabled={!pagination.next_page_url || loading}
                                onClick={() => actions.fetchData(pagination.next_page_url)}
                                className="px-3 py-1 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 dark:text-white"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}