import { useLeaderboard } from '../../hooks/useLeaderboard';

export default function Leaderboard() {
        const { state, loadMore } = useLeaderboard();
        const { topTeachers, loading } = state;

        // Deteksi scroll buat Infinite Loading pada list bawah
        const handleScroll = (e) => {
                const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
                if (scrollHeight - scrollTop <= clientHeight + 50) {
                        loadMore();
                }
        };

        // Helper buat nyusun podium: Kiri (Rank 2), Tengah (Rank 1), Kanan (Rank 3)
        // Warna Tante bikin netral menyesuaikan Light/Dark mode bawaan template kamu
        const podiumData = [
                { rank: 2, data: topTeachers[1], height: 'h-28 md:h-36', bg: 'bg-gradient-to-t from-gray-200 to-gray-50 dark:from-gray-800 dark:to-gray-800/50', medal: '🥈', ring: 'ring-gray-300 dark:ring-gray-600' },
                { rank: 1, data: topTeachers[0], height: 'h-36 md:h-48', bg: 'bg-gradient-to-t from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-gray-800/80', medal: '🏆', ring: 'ring-yellow-400 dark:ring-yellow-600' },
                { rank: 3, data: topTeachers[2], height: 'h-24 md:h-28', bg: 'bg-gradient-to-t from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-gray-800/40', medal: '🥉', ring: 'ring-orange-300 dark:ring-orange-700' }
        ];

        // Data untuk list ke bawah (Rank 4 dst)
        const listData = topTeachers.slice(3);

        return (
                <div className="p-6">

                        {/* --- HEADER --- */}
                        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
                                <div>
                                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                                                Leaderboard Integritas
                                        </h1>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                Pantau poin kedisiplinan guru. Jadilah yang terbaik bulan ini!
                                        </p>
                                </div>
                        </div>

                        {/* --- PODIUM TOP 3 --- */}
                        {topTeachers.length >= 3 && (
                                <div className="flex items-end justify-center gap-2 md:gap-6 w-full max-w-4xl mx-auto mb-10 mt-6">
                                        {podiumData.map((item, index) => {
                                                if (!item.data) return null;
                                                return (
                                                        <div key={`podium-${index}`} className="flex flex-col items-center w-1/3 max-w-[160px] transition-transform duration-300 hover:-translate-y-1">
                                                                {/* Info Guru (Tanpa Foto) */}
                                                                <div className="flex flex-col items-center mb-4 relative z-10 w-full px-2">
                                                                        <div className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm ring-4 ${item.ring} mb-3 text-2xl md:text-3xl`}>
                                                                                {item.medal}
                                                                        </div>
                                                                        {/* Nama dibikin break-words biar kalau panjang dia turun ke bawah, nggak kepotong */}
                                                                        <h3 className="font-bold text-xs md:text-sm text-gray-800 dark:text-white text-center break-words w-full line-clamp-2">
                                                                                {item.data.name}
                                                                        </h3>
                                                                        <p className="text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                                                                                {item.data.point_balance} <span className="text-gray-500 dark:text-gray-400">🪙</span>
                                                                        </p>
                                                                </div>

                                                                {/* Balok Podium */}
                                                                <div className={`w-full ${item.height} ${item.bg} rounded-t-xl md:rounded-t-2xl border-t border-x border-gray-200 dark:border-white/[0.05] shadow-md flex flex-col items-center justify-start pt-4`}>
                                                                        <span className="text-gray-400 dark:text-gray-500 font-black text-2xl md:text-4xl opacity-40">
                                                                                {item.rank}
                                                                        </span>
                                                                </div>
                                                        </div>
                                                );
                                        })}
                                </div>
                        )}

                        {/* --- LIST RANK 4 KE BAWAH --- */}
                        <div className="max-w-4xl mx-auto overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                                {/* Tabel Header (Mirip kayak di Classroom.jsx) */}
                                <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 dark:border-white/[0.05] text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        <div className="col-span-2 md:col-span-1 text-center">Rank</div>
                                        <div className="col-span-7 md:col-span-6">Nama Guru</div>
                                        <div className="col-span-3 md:col-span-2 text-right">Poin</div>
                                </div>

                                {/* Wrapper Scrollable List dengan Scrollbar tipis */}
                                <div
                                        className="flex-1 overflow-y-auto max-h-[500px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full"
                                        onScroll={handleScroll}
                                >
                                        {listData.map((teacher, index) => {
                                                const currentRank = index + 4; // Lanjut dari rank 3
                                                return (
                                                        <div
                                                                key={`list-${teacher.id}`}
                                                                className="grid grid-cols-12 gap-4 items-center p-4 border-b border-gray-50 dark:border-white/[0.02] hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                                                        >
                                                                {/* Rank */}
                                                                <div className="col-span-2 md:col-span-1 flex justify-center text-gray-500 font-bold text-sm">
                                                                        {currentRank}
                                                                </div>

                                                                {/* Nama */}
                                                                <div className="col-span-7 md:col-span-6 flex flex-col">
                                                                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                                                                {teacher.name}
                                                                        </span>
                                                                </div>

                                                                {/* Points */}
                                                                <div className="col-span-3 md:col-span-2 flex justify-end items-center gap-1 font-bold text-sm text-gray-800 dark:text-white">
                                                                        {teacher.point_balance} <span className="text-base drop-shadow-sm">💎</span>
                                                                </div>
                                                        </div>
                                                );
                                        })}

                                        {loading && (
                                                <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                                                        Memuat data guru... ⏳
                                                </div>
                                        )}

                                        {!loading && listData.length === 0 && topTeachers.length < 4 && (
                                                <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                                        Belum ada data guru lainnya.
                                                </div>
                                        )}
                                </div>
                        </div>

                </div>
        );
}