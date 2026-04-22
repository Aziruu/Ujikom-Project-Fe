import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTicket } from "../../hooks/useTicket";

export default function TicketList() {
        const { state, actions } = useTicket();
        const role = localStorage.getItem("role"); // 'guru', 'operator', atau 'admin'

        useEffect(() => {
                // Memanggil tiket saat komponen dimuat
                actions.setCurrentPage(1);
        }, []);

        // Gamifikasi UI Status
        const getStatusStyle = (status) => {
                switch (status) {
                        case 'Open': return 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 ring-1 ring-rose-500/20';
                        case 'In-Progress': return 'bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 ring-1 ring-sky-500/20';
                        case 'Closed': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 ring-1 ring-emerald-500/20';
                        default: return 'bg-gray-100 text-gray-600';
                }
        };

        return (
                <div className="p-6 mx-auto max-w-7xl">
                        <div className="flex flex-col items-start justify-between mb-8 md:flex-row md:items-center">
                                <div>
                                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                                                {role === 'guru' ? 'Tiket Aduan Saya 📝' : 'Quest Board Operator 🛡️'}
                                        </h1>
                                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                                                {role === 'guru' ? 'Pantau status kendala yang sudah kamu laporkan.' : 'Daftar aduan yang membutuhkan bantuanmu.'}
                                        </p>
                                </div>

                                {/* Tombol Buat Tiket Khusus Guru */}
                                {role === 'guru' && (
                                        <Link
                                                to="/tickets/create"
                                                className="px-6 py-3 mt-4 font-medium text-white shadow-lg md:mt-0 bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                        >
                                                + Buat Aduan Baru
                                        </Link>
                                )}
                        </div>

                        {/* Pencarian Khusus Operator */}
                        <div className="mb-6">
                                <input
                                        type="text"
                                        placeholder="Cari berdasarkan subjek atau kategori..."
                                        value={state.searchTerm}
                                        onChange={(e) => actions.setSearchTerm(e.target.value)}
                                        className="w-full max-w-md px-4 py-3 bg-white border border-gray-200 shadow-sm rounded-xl focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                />
                        </div>

                        {/* Tampilan Quest Cards */}
                        {state.loading ? (
                                <div className="py-20 text-center animate-pulse text-brand-500">Memuat Data Tiket...</div>
                        ) : state.tickets.length === 0 ? (
                                <div className="py-20 text-center text-gray-500 bg-white border border-dashed shadow-sm rounded-2xl dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                                        <div className="text-6xl mb-4">📭</div>
                                        <p className="text-lg font-medium">Belum ada tiket aduan di sini.</p>
                                </div>
                        ) : (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {state.tickets.map((ticket) => (
                                                <Link
                                                        key={ticket.id}
                                                        to={`/tickets/${ticket.id}`}
                                                        className="relative p-6 transition-all bg-white border border-gray-100 shadow-sm group rounded-2xl hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700"
                                                >
                                                        <div className="flex items-center justify-between mb-4">
                                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(ticket.status)}`}>
                                                                        {ticket.status}
                                                                </span>
                                                                {ticket.priority === 'High' && (
                                                                        <span className="flex items-center gap-1 text-xs font-bold text-rose-500 animate-pulse">
                                                                                🔥 HIGH
                                                                        </span>
                                                                )}
                                                        </div>

                                                        <h3 className="text-lg font-bold text-gray-800 line-clamp-2 dark:text-white group-hover:text-brand-500 transition-colors">
                                                                {ticket.subject}
                                                        </h3>
                                                        <p className="mt-2 text-sm text-gray-500 line-clamp-2 dark:text-gray-400">
                                                                {ticket.description}
                                                        </p>

                                                        <div className="flex items-center gap-4 mt-6 text-xs text-gray-400 dark:text-gray-500">
                                                                <div className="flex items-center gap-1">
                                                                        <span>📂</span> {ticket.category}
                                                                </div>
                                                                {role !== 'guru' && (
                                                                        <div className="flex items-center gap-1">
                                                                                <span>👤</span> {ticket.reporter?.name || 'Anonim'}
                                                                        </div>
                                                                )}
                                                        </div>
                                                </Link>
                                        ))}
                                </div>
                        )}
                </div>
        );
}