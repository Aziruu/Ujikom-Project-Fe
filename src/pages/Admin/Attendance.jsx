import { useNavigate } from 'react-router-dom';
import { useAttendance } from '../../hooks/useAttendance';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";

export default function Attendance() {
    const navigate = useNavigate();
    const { state, inputRef, actions } = useAttendance();

    const {
        clock, activeTab, statusMessage, loading, rfidInput,
        teachers, search, page, totalPages
    } = state;

    return (
        // Wrapper Utama: Adaptif Light/Dark Mode
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 md:p-10 font-sans flex flex-col transition-colors duration-300">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative">
                {/* Kiri: Nama Sekolah & Tanggal */}
                <div>
                    <h1 className="text-3xl font-bold tracking-wider text-gray-900 dark:text-white">SMKN 1 CIANJUR</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium text-lg">
                        {clock.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>

                {/* Kanan: Kotak Jam Modern */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-8 py-4 shadow-sm mt-4 md:mt-0 flex flex-col items-center justify-center">
                    <h2 className="text-5xl font-bold font-mono tracking-tighter text-blue-600 dark:text-blue-400">
                        {clock.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </h2>
                </div>

                {/* Tombol Kembali ke Dashboard Admin */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="absolute -top-4 -right-4 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-lg text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition"
                >
                    Tutup Kiosk
                </button>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col max-w-6xl w-full mx-auto relative">

                {/* TABS (Desain menyatu dengan konten) */}
                <div className="flex gap-2 mb-0">
                    <button
                        onClick={() => { actions.setActiveTab('rfid'); actions.setStatusMessage(null); }}
                        className={`px-8 py-4 rounded-t-xl font-bold text-lg transition-all duration-200 ${activeTab === 'rfid'
                            ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-t-4 border-blue-600 dark:border-blue-500 border-x border-gray-200 dark:border-gray-700'
                            : 'bg-gray-200 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 border-t-4 border-transparent'
                            }`}
                        style={activeTab === 'rfid' ? { marginBottom: '-1px', zIndex: 10 } : {}}
                    >
                        Scan RFID
                    </button>
                    <button
                        onClick={() => { actions.setActiveTab('manual'); actions.setStatusMessage(null); }}
                        className={`px-8 py-4 rounded-t-xl font-bold text-lg transition-all duration-200 ${activeTab === 'manual'
                            ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-t-4 border-blue-600 dark:border-blue-500 border-x border-gray-200 dark:border-gray-700'
                            : 'bg-gray-200 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 border-t-4 border-transparent'
                            }`}
                        style={activeTab === 'manual' ? { marginBottom: '-1px', zIndex: 10 } : {}}
                    >
                        Absen Manual
                    </button>
                </div>

                {/* KOTAK KONTEN UTAMA */}
                <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-b-2xl rounded-tr-2xl shadow-xl relative flex flex-col z-0">

                    {/* ALERT MESSAGE */}
                    {statusMessage && (
                        <div className={`absolute top-6 left-1/2 -translate-x-1/2 px-8 py-3 rounded-xl text-center z-50 shadow-2xl animate-in slide-in-from-top-4 font-bold border ${statusMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' :
                            statusMessage.type === 'warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400' :
                                'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400'
                            }`}>
                            {statusMessage.text}
                        </div>
                    )}

                    {/* --- KONTEN RFID --- */}
                    {activeTab === 'rfid' && (
                        <div className="flex-1 flex flex-col items-center justify-center p-10 animate-in fade-in duration-500">
                            <div className="w-48 h-48 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-8 animate-pulse border-4 border-blue-100 dark:border-blue-900/50">
                                <svg className="w-24 h-24 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                                </svg>
                            </div>
                            <h3 className="text-3xl font-bold mb-3 text-gray-800 dark:text-white">Tempelkan Kartu ID</h3>
                            <p className="text-gray-500 text-lg mb-8 text-center px-4">Pastikan kursor berkedip pada kotak di bawah ini untuk memindai.</p>

                            <form onSubmit={actions.handleRfidSubmit} className="w-full max-w-md">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={rfidInput}
                                    onChange={(e) => actions.setRfidInput(e.target.value)}
                                    autoFocus
                                    disabled={loading}
                                    className="w-full px-6 py-4 text-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl focus:border-blue-500 outline-none dark:bg-gray-900 dark:border-gray-700 dark:text-white transition-colors disabled:opacity-50 text-xl font-mono tracking-widest shadow-inner"
                                    placeholder="Menunggu pemindaian..."
                                />
                            </form>
                        </div>
                    )}

                    {/* --- KONTEN MANUAL (TABLE GURU) --- */}
                    {activeTab === 'manual' && (
                        <div className="flex-1 flex flex-col p-8 animate-in fade-in duration-500">

                            {/* Search Bar di atas tabel */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Daftar Guru</h3>
                                    <p className="text-sm text-gray-500 mt-1">Cari nama Anda lalu klik "Absen". (Pastikan GPS aktif)</p>
                                </div>
                                <div className="relative w-full sm:w-auto">
                                    <input
                                        type="text"
                                        placeholder="🔍 Cari nama guru..."
                                        value={search}
                                        onChange={(e) => actions.setSearch(e.target.value)}
                                        className="w-full sm:w-72 p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Tabel Guru */}
                            <div className="flex-1 overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                                <div className="max-h-[50vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    <Table>
                                        <TableHeader className="sticky top-0 bg-gray-50 dark:bg-gray-900/80 backdrop-blur-sm z-10">
                                            <TableRow>
                                                <TableCell isHeader className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Nama Guru</TableCell>
                                                <TableCell isHeader className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">NIP</TableCell>
                                                <TableCell isHeader className="px-6 py-4 font-bold text-center text-gray-600 dark:text-gray-300 w-48">Aksi</TableCell>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {loading ? (
                                                <TableRow><TableCell colSpan="3" className="text-center py-16 text-gray-500">Mencari data...</TableCell></TableRow>
                                            ) : teachers.length === 0 ? (
                                                <TableRow><TableCell colSpan="3" className="text-center py-16 text-gray-500">Guru tidak ditemukan.</TableCell></TableRow>
                                            ) : (
                                                teachers.map(t => (
                                                    <TableRow key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                        <TableCell className="px-6 py-5 font-semibold text-lg text-gray-800 dark:text-white">
                                                            {t.name}
                                                        </TableCell>
                                                        <TableCell className="px-6 py-5 font-mono text-gray-500 dark:text-gray-400">
                                                            {t.nip || '-'}
                                                        </TableCell>
                                                        <TableCell className="px-6 py-5 text-center">
                                                            <button
                                                                onClick={() => actions.handleManualAbsen(t.id)}
                                                                disabled={loading}
                                                                className="px-6 py-2.5 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition disabled:opacity-50 disabled:shadow-none"
                                                            >
                                                                Absen
                                                            </button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Pagination Tabel Manual */}
                            <div className="flex justify-between items-center mt-6">
                                <span className="text-gray-500 text-sm font-medium">Halaman <span className="font-bold text-gray-800 dark:text-white">{page}</span> dari {totalPages}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => actions.setPage(prev => Math.max(prev - 1, 1))}
                                        disabled={page === 1 || loading}
                                        className="px-5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-bold disabled:opacity-50 transition"
                                    >
                                        Sebelumnya
                                    </button>
                                    <button
                                        onClick={() => actions.setPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={page === totalPages || loading}
                                        className="px-5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-bold disabled:opacity-50 transition"
                                    >
                                        Selanjutnya
                                    </button>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}