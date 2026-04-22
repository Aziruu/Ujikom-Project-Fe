import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTicket } from "../../hooks/useTicket"; // Pastikan path hook-mu benar

export default function TicketCreate() {
        const { state, actions } = useTicket();
        const navigate = useNavigate();
        const [reporterId] = useState(() => {
                const user = JSON.parse(localStorage.getItem("user"));
                return user?.id || null;
        });

        const handleSubmit = async (e) => {
                e.preventDefault();
                await actions.submitTicket(reporterId);
                navigate("/tickets"); // Kembali ke Quest Board setelah lapor
        };

        return (
                <div className="p-6 mx-auto max-w-4xl">
                        <div className="mb-8">
                                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-500">
                                        Buat Tiket Bantuan 🚀
                                </h1>
                                <p className="mt-2 text-gray-500 dark:text-gray-400">
                                        Laporkan kendala yang kamu alami. Sistem akan mengecek apakah masalah serupa sudah pernah dilaporkan.
                                </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                                {/* FORM KIRI */}
                                <div className="lg:col-span-2">
                                        <div className="p-6 bg-white border border-gray-100 shadow-xl dark:bg-gray-800 rounded-2xl dark:border-gray-700">
                                                <form onSubmit={handleSubmit} className="space-y-6">

                                                        <div>
                                                                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                        Kategori Masalah
                                                                </label>
                                                                <select
                                                                        name="category"
                                                                        value={state.formData.category}
                                                                        onChange={actions.handleFormChange}
                                                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                                                                >
                                                                        <option value="Jaringan">Jaringan & Internet</option>
                                                                        <option value="Akun">Akun & Password</option>
                                                                        <option value="Hardware">Kerusakan Hardware</option>
                                                                        <option value="Software">Software & Aplikasi</option>
                                                                        <option value="Lainnya">Lainnya</option>
                                                                </select>
                                                        </div>

                                                        <div>
                                                                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                        Subjek (Judul Kendala)
                                                                </label>
                                                                <input
                                                                        type="text"
                                                                        name="subject"
                                                                        value={state.formData.subject}
                                                                        onChange={actions.handleFormChange}
                                                                        placeholder="Contoh: WiFi di Kelas 10-A mati sejak pagi"
                                                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                                                                        required
                                                                />
                                                        </div>

                                                        <div>
                                                                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                        Prioritas (Level Bahaya)
                                                                </label>
                                                                <div className="flex gap-4">
                                                                        {['Low', 'Mid', 'High'].map(level => (
                                                                                <label key={level} className="flex-1 cursor-pointer">
                                                                                        <input
                                                                                                type="radio"
                                                                                                name="priority"
                                                                                                value={level}
                                                                                                checked={state.formData.priority === level}
                                                                                                onChange={actions.handleFormChange}
                                                                                                className="hidden"
                                                                                        />
                                                                                        <div className={`text-center py-2 rounded-xl border-2 transition-all ${state.formData.priority === level
                                                                                                ? (level === 'High' ? 'border-red-500 bg-red-50 text-red-600' : level === 'Mid' ? 'border-yellow-500 bg-yellow-50 text-yellow-600' : 'border-blue-500 bg-blue-50 text-blue-600')
                                                                                                : 'border-gray-200 text-gray-500 dark:border-gray-700'
                                                                                                }`}>
                                                                                                {level}
                                                                                        </div>
                                                                                </label>
                                                                        ))}
                                                                </div>
                                                        </div>

                                                        <div>
                                                                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                        Deskripsi Detail
                                                                </label>
                                                                <textarea
                                                                        name="description"
                                                                        value={state.formData.description}
                                                                        onChange={actions.handleFormChange}
                                                                        rows="4"
                                                                        placeholder="Ceritakan detail masalahnya di sini..."
                                                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                                                                        required
                                                                ></textarea>
                                                        </div>

                                                        <div className="flex justify-end gap-4">
                                                                <Link to="/tickets" className="px-6 py-3 font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
                                                                        Batal
                                                                </Link>
                                                                <button
                                                                        type="submit"
                                                                        disabled={state.loading}
                                                                        className="px-6 py-3 font-medium text-white shadow-lg bg-gradient-to-r from-brand-500 to-purple-600 rounded-xl hover:opacity-90 disabled:opacity-50"
                                                                >
                                                                        {state.loading ? 'Mengirim...' : 'Kirim Aduan'}
                                                                </button>
                                                        </div>
                                                </form>
                                        </div>
                                </div>

                                {/* SIDEBAR KANAN: ANTI DUPLIKASI (GAMIFICATION RADAR) */}
                                <div className="lg:col-span-1">
                                        <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 sticky top-6">
                                                <h3 className="flex items-center gap-2 mb-4 font-semibold text-indigo-800 dark:text-indigo-300">
                                                        <span className="text-xl">📡</span> Radar Duplikasi
                                                </h3>

                                                {state.isDuplicateChecking ? (
                                                        <div className="flex items-center justify-center p-8">
                                                                <div className="w-8 h-8 border-4 rounded-full border-brand-500 border-t-transparent animate-spin"></div>
                                                        </div>
                                                ) : state.similarTickets.length > 0 ? (
                                                        <div className="space-y-4">
                                                                <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                                                                        ⚠️ Tunggu! Ditemukan tiket serupa yang sedang dikerjakan:
                                                                </p>
                                                                {state.similarTickets.map(ticket => (
                                                                        <div key={ticket.id} className="p-3 bg-white border border-amber-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-amber-900/50">
                                                                                <p className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2">{ticket.subject}</p>
                                                                                <div className="flex items-center gap-2 mt-2 text-xs">
                                                                                        <span className="px-2 py-1 text-blue-700 bg-blue-100 rounded-md dark:bg-blue-900/30 dark:text-blue-300">{ticket.status}</span>
                                                                                        <span className="text-gray-500">{ticket.category}</span>
                                                                                </div>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                ) : (
                                                        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                                                <div className="text-4xl mb-2 opacity-50">✨</div>
                                                                <p className="text-sm">Aman! Belum ada tiket serupa yang dilaporkan. Lanjutkan pengisian form.</p>
                                                        </div>
                                                )}
                                        </div>
                                </div>
                        </div>
                </div>
        );
}