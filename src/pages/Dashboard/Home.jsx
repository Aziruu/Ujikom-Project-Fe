import PageMeta from "../../components/common/PageMeta";
import { useDashboard } from "../../hooks/useDashboard";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { state, actions } = useDashboard();
  const { loading, stats, recentAttendances, pendingLeaves, pembiasaan } = state;
  const navigate = useNavigate();

  return (
    <>
      <PageMeta title="Dashboard | Si-Hadir Admin" description="Ringkasan absensi harian" />

      <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">

        {/* HEADLINE */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Halo, Admin!</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Berikut adalah ringkasan absensi dan aktivitas sekolah hari ini.</p>
        </div>

        {/* ROW 1: STATISTIK & PEMBIASAAN */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Card 1: Total Guru */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-5 transition-colors">
            <div className="w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Total Guru</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
                {loading ? '...' : stats.totalGuru}
              </h3>
            </div>
          </div>

          {/* Card 2: Total Kelas */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-5 transition-colors">
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" /><path d="M18 14h-8" /><path d="M15 18h-5" /><path d="M10 6h8v4h-8V6Z" /></svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Total Kelas</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
                {loading ? '...' : stats.totalKelas}
              </h3>
            </div>
          </div>

          {/* Card 3: Absen Hari Ini */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-5 transition-colors">
            <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Hadir Hari Ini</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
                {loading ? '...' : stats.hadirHariIni}
              </h3>
            </div>
          </div>

          {/* Card 4: Pembiasaan Hari Ini */}
          <div className={`rounded-2xl p-5 border shadow-sm transition-colors flex flex-col justify-center ${pembiasaan.bg}`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Pembiasaan Hari Ini</p>
                <h3 className={`text-base font-bold leading-tight mb-1 ${pembiasaan.color}`}>
                  {pembiasaan.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {pembiasaan.desc}
                </p>
              </div>
              <div className={`p-2 rounded-lg bg-white/50 dark:bg-black/20 ${pembiasaan.color}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: TABEL ABSEN & QUICK ACTION CUTI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* KIRI (2/3): HISTORY ABSEN TERBARU */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden transition-colors">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-transparent">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Absensi Terbaru Hari Ini</h3>
              <button onClick={() => navigate('/report')} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">Lihat Semua</button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50">
                  <TableRow>
                    <TableCell isHeader className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Waktu</TableCell>
                    <TableCell isHeader className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama Guru</TableCell>
                    <TableCell isHeader className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Metode</TableCell>
                    <TableCell isHeader className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Status</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {loading ? (
                    <TableRow><TableCell colSpan="4" className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">Memuat data...</TableCell></TableRow>
                  ) : recentAttendances.length === 0 ? (
                    <TableRow><TableCell colSpan="4" className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">Belum ada absensi hari ini.</TableCell></TableRow>
                  ) : (
                    recentAttendances.map(log => (
                      <TableRow key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <TableCell className="px-6 py-4 font-mono text-sm font-medium text-gray-700 dark:text-gray-300">
                          {log.check_in.slice(0, 5)}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="block font-semibold text-sm text-gray-900 dark:text-white">{log.teacher?.name}</span>
                          <span className="block text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{log.teacher?.nip || '-'}</span>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center">
                          <Badge size="sm" color={log.method === 'rfid' ? 'primary' : 'info'}>{log.method.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center">
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
          </div>

          {/* KANAN (1/3): QUICK LEAVE REQUEST */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col h-[420px] transition-colors">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-transparent">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                Perlu Persetujuan
              </h3>
              {pendingLeaves.length > 0 && (
                <span className="bg-red-500 dark:bg-red-500/80 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold shadow-sm">
                  {pendingLeaves.length}
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full">
              {loading ? (
                <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400 text-sm">Memeriksa pengajuan...</div>
              ) : pendingLeaves.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 dark:text-gray-600 mb-3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Semua Beres!</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Tidak ada pengajuan cuti tertunda.</p>
                </div>
              ) : (
                pendingLeaves.map(leave => (
                  <div key={leave.id} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 transition-colors">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{leave.teacher?.name}</h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/10 px-2 py-0.5 rounded mt-1.5 inline-block">{leave.type}</span>
                      </div>
                      <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 whitespace-nowrap shadow-sm">
                        {leave.start_date.slice(5)} - {leave.end_date.slice(5)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 italic mb-4 line-clamp-2 bg-white dark:bg-gray-800/50 p-2 rounded border border-gray-100 dark:border-gray-700/50">"{leave.reason}"</p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => actions.handleQuickVerify(leave.id, 'approved', leave.teacher?.name)}
                        className="flex-1 bg-green-50 hover:bg-green-100 dark:bg-green-500/10 dark:hover:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 text-xs font-bold py-2 rounded-lg transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => actions.handleQuickVerify(leave.id, 'rejected', leave.teacher?.name)}
                        className="flex-1 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20 text-xs font-bold py-2 rounded-lg transition-colors"
                      >
                        Tolak
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {pendingLeaves.length > 0 && (
              <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 text-center bg-gray-50/50 dark:bg-gray-900/20">
                <button onClick={() => navigate('/leaves')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors">Kelola Semua Cuti &rarr;</button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}