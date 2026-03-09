import { useAttendanceReport } from '../../hooks/useAttendanceReport';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";

export default function AttendanceReport() {
    const { state, actions } = useAttendanceReport();
    const { data, loading, exporting, search, dateFilter, periodFilter, pagination } = state;

    return (
        <div className="min-h-[80vh] font-sans">
            {/* Header Page */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4 p-6 pb-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Laporan Log Absensi</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Rekap kehadiran & kepulangan guru terintegrasi</p>
                </div>

                {/* AREA FILTER & EXPORT */}
                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto relative z-10">

                    {/* Dropdown Filter Periode */}
                    <select
                        value={periodFilter}
                        onChange={(e) => { actions.setPeriodFilter(e.target.value); actions.setDateFilter(''); }}
                        className="p-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white cursor-pointer"
                    >
                        <option value="">-- Semua Periode --</option>
                        <option value="today">Hari Ini</option>
                        <option value="month">Bulan Ini</option>
                        <option value="year">Tahun Ini</option>
                    </select>

                    <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block mx-1"></div>

                    {/* Filter Tanggal (Disable kalau periodFilter aktif) */}
                    <div className="relative flex items-center">
                        <input
                            type="date"
                            value={dateFilter}
                            disabled={!!periodFilter}
                            onChange={(e) => actions.setDateFilter(e.target.value)}
                            onClick={(e) => !periodFilter && e.target.showPicker && e.target.showPicker()}
                            className="p-2 pl-3 pr-4 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white cursor-pointer w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {dateFilter && (
                            <button onClick={() => actions.setDateFilter('')} className="absolute -top-2 -right-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1 shadow-sm transition" title="Reset Tanggal">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        )}
                    </div>

                    {/* Filter Pencarian Guru */}
                    <div className="relative flex-grow sm:flex-grow-0">
                        <input
                            type="text"
                            placeholder="Cari nama/NIP..."
                            value={search}
                            onChange={(e) => actions.setSearch(e.target.value)}
                            className="pl-9 pr-8 py-2 w-full sm:w-48 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
                        />
                        <svg className="absolute left-3 top-2.5 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        {search && (
                            <button onClick={() => actions.setSearch('')} className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        )}
                    </div>

                    {/* Tombol Export */}
                    <div className="flex gap-2 ml-auto">
                        <button
                            onClick={() => actions.handleExport('excel')}
                            disabled={exporting}
                            className="flex items-center gap-1.5 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-500/10 dark:hover:bg-green-500/20 dark:text-green-500 border border-green-200 dark:border-green-500/20 rounded-lg text-sm font-bold transition shadow-sm disabled:opacity-50"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M8 13h2" /><path d="M8 17h2" /><path d="M14 13h2" /><path d="M14 17h2" /></svg>
                            Excel
                        </button>
                        <button
                            onClick={() => actions.handleExport('pdf')}
                            disabled={exporting}
                            className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-500 border border-red-200 dark:border-red-500/20 rounded-lg text-sm font-bold transition shadow-sm disabled:opacity-50"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M10 18v-6" /><path d="M10 12h4s2 0 2 3-2 3-2 3h-4" /></svg>
                            PDF
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Tabel Laporan Absensi */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm">
                    <div className="max-w-full overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full">
                        <Table>
                            <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                <TableRow>
                                    <TableCell isHeader className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider whitespace-nowrap">Tanggal</TableCell>
                                    <TableCell isHeader className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Guru</TableCell>
                                    <TableCell isHeader className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-center">Metode</TableCell>
                                    <TableCell isHeader className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-center whitespace-nowrap">Jam Masuk</TableCell>
                                    <TableCell isHeader className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-center whitespace-nowrap">Jam Pulang</TableCell>
                                    <TableCell isHeader className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-center">Status</TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan="6" className="text-center py-12 text-gray-500 text-theme-sm">Memuat data...</TableCell>
                                    </TableRow>
                                ) : data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan="6" className="text-center py-12 text-gray-500 text-theme-sm">Belum ada data absensi ditemukan.</TableCell>
                                    </TableRow>
                                ) : (
                                    data.map((log) => (
                                        <TableRow key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition">
                                            <TableCell className="px-6 py-4 text-start text-gray-800 dark:text-gray-200 text-sm whitespace-nowrap font-medium">
                                                {actions.formatDate(log.date)}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-start">
                                                <div>
                                                    <span className="block font-semibold text-gray-900 text-sm dark:text-white/90">{log.teacher?.name}</span>
                                                    <span className="block text-gray-500 text-xs dark:text-gray-400 font-mono mt-0.5">{log.teacher?.nip || '-'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-center">
                                                <Badge size="sm" color={log.method === 'rfid' ? 'primary' : log.method === 'manual' ? 'info' : 'warning'}>
                                                    {log.method ? log.method.toUpperCase() : 'N/A'}
                                                </Badge>
                                            </TableCell>

                                            {/* Kolom Jam Masuk */}
                                            <TableCell className="px-6 py-4 text-center font-mono text-gray-900 dark:text-gray-200 text-sm font-bold">
                                                {log.check_in || '-'}
                                            </TableCell>

                                            {/* Kolom Jam Pulang */}
                                            <TableCell className="px-6 py-4 text-center font-mono text-sm">
                                                {log.check_out ? (
                                                    <span className="text-gray-900 dark:text-gray-200 font-bold">{log.check_out}</span>
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-500 italic text-xs">Belum Pulang</span>
                                                )}
                                            </TableCell>

                                            <TableCell className="px-6 py-4 text-center">
                                                <Badge size="sm" color={log.status === 'hadir' ? 'success' : log.status === 'telat' ? 'error' : 'warning'}>
                                                    {log.status === 'telat' ? `Telat ${log.late_duration}m` : (log.status ? log.status.toUpperCase() : '-')}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Halaman <span className="font-semibold text-gray-900 dark:text-white">{pagination.current_page || 1}</span> dari <span className="font-semibold text-gray-900 dark:text-white">{pagination.last_page || 1}</span>
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={!pagination.prev_page_url || loading}
                                onClick={() => actions.fetchData(pagination.prev_page_url)}
                                className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed dark:text-white transition"
                            >
                                Sebelumnya
                            </button>
                            <button
                                disabled={!pagination.next_page_url || loading}
                                onClick={() => actions.fetchData(pagination.next_page_url)}
                                className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed dark:text-white transition"
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