import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
        Radar,
        RadarChart,
        PolarGrid,
        PolarAngleAxis,
        PolarRadiusAxis,
        ResponsiveContainer,
        Tooltip
} from 'recharts';
import { User, MessageSquare, BarChart3, ChevronDown } from 'lucide-react';
import { useTeacherReport } from '../../hooks/useTeacherReport';

// Custom Tooltip untuk Radar Chart agar lebih informatif
const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
                return (
                        <div className="bg-white dark:bg-gray-800 p-3 shadow-xl rounded-lg border border-gray-100 dark:border-gray-700">
                                <p className="text-sm font-bold text-gray-800 dark:text-white">
                                        {payload[0].payload.category}
                                </p>
                                <p className="text-sm text-blue-600 font-semibold">
                                        Skor: {payload[0].value} / 5
                                </p>
                        </div>
                );
        }
        return null;
};

const TeacherReportPage = () => {
        const { teacherId } = useParams();
        const navigate = useNavigate();
        const { radarData, historyData, teachersList, isLoading } = useTeacherReport(teacherId);

        const handleTeacherChange = (e) => {
                const selectedId = e.target.value;
                if (selectedId) {
                        navigate(`/assessments/history/${selectedId}`);
                }
        };

        return (
                <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen font-sans transition-colors duration-300">
                        <div className="max-w-6xl mx-auto">
                                {/* Header Section */}
                                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                                        <div>
                                                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                                        Rapor Kinerja & Sikap
                                                </h1>
                                                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                                                        Analisis kompetensi pendidik berbasis data evaluasi.
                                                </p>
                                        </div>

                                        {/* Selector Dropdown */}
                                        <div className="relative w-full md:w-80">
                                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                                                        Pilih Staf Pendidik
                                                </label>
                                                <div className="relative">
                                                        <select
                                                                value={teacherId || ""}
                                                                onChange={handleTeacherChange}
                                                                className="w-full pl-4 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-800 dark:text-white font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                                                        >
                                                                <option value="" disabled>-- Cari Nama Guru --</option>
                                                                {teachersList.map(teacher => (
                                                                        <option key={teacher.id} value={teacher.id}>
                                                                                {teacher.name} {teacher.nip ? `(${teacher.nip})` : ''}
                                                                        </option>
                                                                ))}
                                                        </select>
                                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                                </div>
                                        </div>
                                </div>

                                {!teacherId ? (
                                        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-20 shadow-xl shadow-blue-500/5 border border-gray-100 dark:border-gray-700 text-center">
                                                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                                                        <User className="w-10 h-10 text-blue-500" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Siap Memulai Analisis?</h3>
                                                <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-sm mx-auto">
                                                        Pilih salah satu staf pengajar di atas untuk melihat grafik radar kinerja mereka.
                                                </p>
                                        </div>
                                ) : isLoading ? (
                                        <div className="h-96 flex flex-col items-center justify-center">
                                                <div className="relative">
                                                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                                </div>
                                                <p className="mt-4 text-gray-500 animate-pulse font-medium">Mengalkulasi data pedagogik...</p>
                                        </div>
                                ) : (
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                                {/* Spider Chart Card */}
                                                <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                                                        <div className="flex items-center gap-3 mb-8">
                                                                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                                                                        <BarChart3 size={20} />
                                                                </div>
                                                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Peta Kekuatan Kompetensi</h2>
                                                        </div>

                                                        <div className="w-full h-[400px]">
                                                                {radarData && radarData.length > 0 ? (
                                                                        <ResponsiveContainer width="100%" height="100%">
                                                                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                                                                        <PolarGrid stroke="#e5e7eb" className="dark:stroke-gray-700" />
                                                                                        <PolarAngleAxis
                                                                                                dataKey="category"
                                                                                                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                                                                                        />
                                                                                        <PolarRadiusAxis
                                                                                                angle={90}
                                                                                                domain={[0, 5]}
                                                                                                tick={{ fill: '#9ca3af', fontSize: 10 }}
                                                                                                axisLine={false}
                                                                                        />
                                                                                        <Tooltip content={<CustomTooltip />} />
                                                                                        <Radar
                                                                                                name="Skor Kinerja"
                                                                                                dataKey="average_score"
                                                                                                stroke="#2563eb"
                                                                                                strokeWidth={3}
                                                                                                fill="#3b82f6"
                                                                                                fillOpacity={0.3}
                                                                                                animationBegin={200}
                                                                                                animationDuration={1200}
                                                                                        />
                                                                                </RadarChart>
                                                                        </ResponsiveContainer>
                                                                ) : (
                                                                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                                                                <p>Data radar tidak tersedia</p>
                                                                        </div>
                                                                )}
                                                        </div>
                                                        <div className="mt-4 flex justify-center gap-6">
                                                                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                                                        <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                                                                        Skor Aktual
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                                                        <span className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></span>
                                                                        Target (5.0)
                                                                </div>
                                                        </div>
                                                </div>

                                                {/* History Timeline Card */}
                                                <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                                                        <div className="flex items-center gap-3 mb-8">
                                                                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600">
                                                                        {/* 2. TYPO MessageqSuare DIPERBAIKI MENJADI MessageSquare */}
                                                                        <MessageSquare size={20} />
                                                                </div>
                                                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Riwayat Feedback</h2>
                                                        </div>

                                                        <div className="space-y-6 overflow-y-auto max-h-[420px] pr-4 custom-scrollbar">
                                                                {historyData.length > 0 ? (
                                                                        historyData.map((history) => (
                                                                                <div key={history.id} className="relative pl-8 border-l-2 border-blue-50 dark:border-gray-700 pb-4">
                                                                                        <div className="absolute w-4 h-4 bg-blue-600 rounded-full -left-[9px] top-1 ring-4 ring-white dark:ring-gray-800 shadow-sm"></div>
                                                                                        <div className="flex flex-col gap-1">
                                                                                                <div className="flex justify-between items-start">
                                                                                                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{history.period}</span>
                                                                                                        <span className="text-[10px] font-medium text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                                                                                                                {history.assessment_date}
                                                                                                        </span>
                                                                                                </div>
                                                                                                <div className="bg-gray-50 dark:bg-gray-700/40 p-4 rounded-2xl mt-2 border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 transition-all cursor-default group">
                                                                                                        <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
                                                                                                                {history.general_notes ? `"${history.general_notes}"` : "Tidak ada catatan."}
                                                                                                        </p>
                                                                                                        <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-600/50 flex items-center gap-2">
                                                                                                                <div className="w-5 h-5 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-300">
                                                                                                                        {history.evaluator?.name?.charAt(0) || 'S'}
                                                                                                                </div>
                                                                                                                <span className="text-[11px] text-gray-500 font-medium">
                                                                                                                        Oleh: {history.evaluator?.name || 'Sistem'}
                                                                                                                </span>
                                                                                                        </div>
                                                                                                </div>
                                                                                        </div>
                                                                                </div>
                                                                        ))
                                                                ) : (
                                                                        <div className="py-20 text-center">
                                                                                <p className="text-gray-400">Belum ada riwayat feedback.</p>
                                                                        </div>
                                                                )}
                                                        </div>
                                                </div>
                                        </div>
                                )}
                        </div>
                </div>
        );
};

export default TeacherReportPage;