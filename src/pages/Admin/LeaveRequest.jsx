import { useNavigate } from 'react-router-dom';
import PageMeta from "../../components/common/PageMeta";
import { useLeaveRequest } from '../../hooks/useLeaveRequest';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";

export default function LeaveRequests() {
    const navigate = useNavigate();
    const { state, actions } = useLeaveRequest();
    const { data, loading, filterStatus, filterDate, processingId } = state;

    return (
        <>
            <PageMeta title="Daftar Cuti | Admin" />

            <div className="space-y-6 p-6">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Pengajuan Cuti</h2>
                        <p className="text-sm text-gray-500 mt-1">Kelola izin dan sakit guru</p>
                    </div>
                    <button
                        onClick={() => navigate('/leaves/create')}
                        className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md"
                    >
                        Buat Pengajuan
                    </button>
                </div>

                {/* FILTER */}
                <div className="flex gap-3 items-center">
                    <select
                        value={filterStatus}
                        onChange={(e) => actions.setFilterStatus(e.target.value)}
                        className="border border-gray-300 dark:border-gray-700 p-2 rounded-lg text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    >
                        <option value="all">Semua Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => actions.setFilterDate(e.target.value)}
                        className="border border-gray-300 dark:border-gray-700 p-2 rounded-lg text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />

                    {filterDate && (
                        <button onClick={() => actions.setFilterDate('')} className="text-red-500 text-xs font-medium hover:underline">
                            Reset Tanggal
                        </button>
                    )}
                </div>

                {/* TABEL */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Guru</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tanggal</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tipe & Alasan</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">File Bukti</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Status</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Aksi</TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan="6" className="text-center py-10 text-gray-500 text-theme-sm">Memuat data...</TableCell>
                                    </TableRow>
                                ) : data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan="6" className="text-center py-10 text-gray-500 text-theme-sm">Tidak ada data cuti.</TableCell>
                                    </TableRow>
                                ) : (
                                    data.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="px-5 py-4 text-start">
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">{item.teacher?.name}</span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400 font-mono mt-0.5">{item.teacher?.nip || '-'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-start text-gray-800 dark:text-gray-200 text-theme-sm">
                                                {item.start_date} <br />
                                                <span className="text-gray-400 text-theme-xs">s/d {item.end_date}</span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-start">
                                                <span className="uppercase text-theme-xs font-bold text-gray-700 dark:text-gray-300">{item.type}</span>
                                                <div className="text-theme-xs italic text-gray-500 mt-1 max-w-[200px] truncate" title={item.reason}>
                                                    "{item.reason}"
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-start">
                                                {item.attachment ? (
                                                    <a href={actions.getFileUrl(item.attachment)} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 text-theme-sm hover:underline font-medium">
                                                        Lihat File
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400 text-theme-xs">Tidak ada file</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                <Badge size="sm" color={item.status === 'approved' ? 'success' : item.status === 'rejected' ? 'error' : 'warning'}>
                                                    {item.status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                {item.status === 'pending' ? (
                                                    <div className="flex justify-center gap-3">
                                                        <button
                                                            onClick={() => actions.handleVerify(item.id, 'approved', item.teacher?.name)}
                                                            disabled={processingId === item.id}
                                                            className="text-green-600 hover:text-green-700 font-medium text-theme-sm transition disabled:opacity-50"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => actions.handleVerify(item.id, 'rejected', item.teacher?.name)}
                                                            disabled={processingId === item.id}
                                                            className="text-red-600 hover:text-red-700 font-medium text-theme-sm transition disabled:opacity-50"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : <span className="text-gray-400">-</span>}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    );
}