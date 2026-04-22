import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTicket } from "../../hooks/useTicket";

export default function TicketDetail() {
        const { id } = useParams();
        const { state, actions } = useTicket();
        const role = localStorage.getItem("role");
        const user = JSON.parse(localStorage.getItem("user"));

        // State khusus untuk Rating Guru
        const [ratingScore, setRatingScore] = useState(0);
        const [ratingFeedback, setRatingFeedback] = useState("");

        useEffect(() => {
                actions.fetchDetail(id);
                if (role !== 'guru') {
                        actions.fetchSuggestions(id); // Ambil saran balasan jika dia operator
                }
        }, [id]);

        if (state.loading && !state.ticketDetail) {
                return <div className="py-20 text-center animate-pulse text-brand-500">Membuka detail misi... ⏳</div>;
        }

        if (!state.ticketDetail) {
                return <div className="py-20 text-center text-red-500">Misi tidak ditemukan! ❌</div>;
        }

        const ticket = state.ticketDetail;
        const isClosed = ticket.status === 'Closed';
        const hasRated = ticket.rating !== null;

        // Handler Kirim Balasan
        const handleSendReply = (statusUpdate = null) => {
                const responderType = role === 'guru' ? 'App\\Models\\Teacher' : 'App\\Models\\User';
                actions.sendReply(ticket.id, user.id, responderType, statusUpdate);
        };

        // Handler Kirim Penilaian (Khusus Guru)
        const handleRatingSubmit = () => {
                if (ratingScore === 0) return alert("Pilih bintangnya dulu ya!");
                actions.submitRating(ticket.id, ratingScore, ratingFeedback);
        };

        return (
                <div className="p-6 mx-auto max-w-5xl">
                        <Link to="/tickets" className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-gray-500 hover:text-brand-500 transition-colors">
                                <span>←</span> Kembali ke Quest Board
                        </Link>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                {/* KOLOM KIRI: INFO TIKET & RATING */}
                                <div className="space-y-6 lg:col-span-1">
                                        {/* Kartu Status Misi */}
                                        <div className="p-6 bg-white border border-gray-100 shadow-xl rounded-2xl dark:bg-gray-800 dark:border-gray-700">
                                                <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase">Status Misi</h2>
                                                <div className="mt-4">
                                                        <span className={`inline-block px-4 py-2 text-sm font-bold rounded-xl ${ticket.status === 'Open' ? 'bg-rose-100 text-rose-600' :
                                                                        ticket.status === 'In-Progress' ? 'bg-sky-100 text-sky-600' :
                                                                                'bg-emerald-100 text-emerald-600'
                                                                }`}>
                                                                {ticket.status}
                                                        </span>
                                                </div>

                                                <div className="mt-6 space-y-4 text-sm">
                                                        <div>
                                                                <p className="text-gray-500 dark:text-gray-400">Kategori</p>
                                                                <p className="font-semibold text-gray-800 dark:text-white">{ticket.category}</p>
                                                        </div>
                                                        <div>
                                                                <p className="text-gray-500 dark:text-gray-400">Prioritas</p>
                                                                <p className="font-semibold text-gray-800 dark:text-white">{ticket.priority}</p>
                                                        </div>
                                                        <div>
                                                                <p className="text-gray-500 dark:text-gray-400">Pelapor</p>
                                                                <p className="font-semibold text-gray-800 dark:text-white">{ticket.reporter?.name}</p>
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Kartu Gamifikasi Rating (Muncul jika tiket Closed) */}
                                        {isClosed && role === 'guru' && !hasRated && (
                                                <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-lg rounded-2xl dark:from-gray-800 dark:to-gray-900 dark:border-amber-900/50">
                                                        <h3 className="mb-2 font-bold text-amber-800 dark:text-amber-400">Misi Selesai! 🎉</h3>
                                                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Bagaimana performa Operator kami?</p>

                                                        <div className="flex gap-2 mb-4">
                                                                {[1, 2, 3, 4, 5].map(star => (
                                                                        <button
                                                                                key={star}
                                                                                onClick={() => setRatingScore(star)}
                                                                                className={`text-3xl transition-transform hover:scale-110 ${ratingScore >= star ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                                                                        >
                                                                                ★
                                                                        </button>
                                                                ))}
                                                        </div>
                                                        <textarea
                                                                value={ratingFeedback}
                                                                onChange={(e) => setRatingFeedback(e.target.value)}
                                                                placeholder="Berikan ulasan singkat..."
                                                                className="w-full p-3 mb-4 text-sm bg-white border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                                                                rows="2"
                                                        ></textarea>
                                                        <button
                                                                onClick={handleRatingSubmit}
                                                                className="w-full px-4 py-2 font-bold text-white bg-amber-500 rounded-xl hover:bg-amber-600"
                                                        >
                                                                Kirim Penilaian
                                                        </button>
                                                </div>
                                        )}

                                        {/* Jika Sudah Dinilai */}
                                        {hasRated && (
                                                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl dark:bg-gray-800 dark:border-emerald-900/50">
                                                        <h3 className="font-bold text-emerald-800 dark:text-emerald-400">Penilaian Diberikan ⭐ {ticket.rating.score}/5</h3>
                                                        <p className="mt-2 text-sm italic text-gray-600 dark:text-gray-400">"{ticket.rating.feedback}"</p>
                                                </div>
                                        )}
                                </div>

                                {/* KOLOM KANAN: CHAT & DISKUSI */}
                                <div className="flex flex-col lg:col-span-2 bg-white border border-gray-100 shadow-xl rounded-2xl dark:bg-gray-800 dark:border-gray-700 h-[600px]">

                                        {/* Header Chat */}
                                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                                <h1 className="text-xl font-bold text-gray-800 dark:text-white">{ticket.subject}</h1>
                                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{ticket.description}</p>
                                        </div>

                                        {/* Area Chat / Response */}
                                        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-50/50 dark:bg-gray-900/50">
                                                {ticket.responses.length === 0 ? (
                                                        <div className="text-center text-gray-400 dark:text-gray-500 mt-10">Belum ada diskusi.</div>
                                                ) : (
                                                        ticket.responses.map((res) => {
                                                                const isMe = (role === 'guru' && res.responder_type.includes('Teacher')) ||
                                                                        (role !== 'guru' && res.responder_type.includes('User'));
                                                                return (
                                                                        <div key={res.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                                                <span className="mb-1 text-xs text-gray-400">{res.responder?.name || 'Sistem'}</span>
                                                                                <div className={`px-5 py-3 max-w-[80%] rounded-2xl shadow-sm ${isMe
                                                                                                ? 'bg-brand-500 text-white rounded-tr-none'
                                                                                                : 'bg-white border border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white rounded-tl-none'
                                                                                        }`}>
                                                                                        {res.message}
                                                                                </div>
                                                                        </div>
                                                                );
                                                        })
                                                )}
                                        </div>

                                        {/* Area Input Balasan */}
                                        {!isClosed && (
                                                <div className="p-4 bg-white border-t border-gray-100 rounded-b-2xl dark:bg-gray-800 dark:border-gray-700">

                                                        {/* Auto-Reply Suggestion Khusus Operator */}
                                                        {role !== 'guru' && state.suggestions.length > 0 && (
                                                                <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                                                                        {state.suggestions.map((sug, idx) => (
                                                                                <button
                                                                                        key={idx}
                                                                                        onClick={() => actions.setReplyMessage(sug)}
                                                                                        className="whitespace-nowrap px-3 py-1.5 text-xs font-medium text-brand-600 bg-brand-50 border border-brand-200 rounded-full hover:bg-brand-100 transition-colors"
                                                                                >
                                                                                        ✨ {sug.substring(0, 30)}...
                                                                                </button>
                                                                        ))}
                                                                </div>
                                                        )}

                                                        <div className="flex gap-2">
                                                                <input
                                                                        type="text"
                                                                        value={state.replyMessage}
                                                                        onChange={(e) => actions.setReplyMessage(e.target.value)}
                                                                        placeholder="Ketik balasanmu di sini..."
                                                                        className="flex-1 px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                                                                        onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                                                                />
                                                                <button
                                                                        onClick={() => handleSendReply()}
                                                                        className="px-6 py-3 font-bold text-white shadow-md bg-brand-500 rounded-xl hover:bg-brand-600"
                                                                >
                                                                        Kirim
                                                                </button>
                                                        </div>

                                                        {/* Tombol Aksi Operator */}
                                                        {role !== 'guru' && (
                                                                <div className="flex justify-end gap-3 mt-4">
                                                                        {ticket.status === 'Open' && (
                                                                                <button
                                                                                        onClick={() => handleSendReply('In-Progress')}
                                                                                        className="px-4 py-2 text-xs font-bold text-white shadow-sm bg-sky-500 rounded-lg hover:bg-sky-600"
                                                                                >
                                                                                        ▶️ Mulai Kerjakan (In-Progress)
                                                                                </button>
                                                                        )}
                                                                        {ticket.status === 'In-Progress' && (
                                                                                <button
                                                                                        onClick={() => handleSendReply('Closed')}
                                                                                        className="px-4 py-2 text-xs font-bold text-white shadow-sm bg-emerald-500 rounded-lg hover:bg-emerald-600"
                                                                                >
                                                                                        ✅ Tandai Selesai (Closed)
                                                                                </button>
                                                                        )}
                                                                </div>
                                                        )}
                                                </div>
                                        )}

                                </div>
                        </div>
                </div>
        );
}