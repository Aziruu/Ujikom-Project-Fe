import React from 'react';
import { useAssessment } from '../../hooks/useAssessment';

const AssessmentDashboard = () => {
        const {
                teachers,
                categories,
                isLoading,
                selectedTeacher,
                ratings,
                generalNotes,
                setGeneralNotes,
                openAssessmentModal,
                closeAssessmentModal,
                handleRating,
                handleSubmit
        } = useAssessment();

        // Kalkulasi Progress Bar
        const totalTeachers = teachers.length;
        const assessedTeachers = teachers.filter(t => t.is_assessed).length;
        const progressPercent = totalTeachers === 0 ? 0 : Math.round((assessedTeachers / totalTeachers) * 100);

        return (
                <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans transition-colors duration-300">
                        <div className="max-w-7xl mx-auto">
                                {/* Header & Progress Gamifikasi */}
                                <div className="mb-10 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard Evaluasi</h1>
                                        <p className="text-gray-500 dark:text-gray-400 mt-2">Pilih staf pendidik di bawah ini untuk memberikan evaluasi kinerja.</p>

                                        <div className="mt-6">
                                                <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                        <span>Progress Penilaian Periode Ini</span>
                                                        <span>{assessedTeachers} dari {totalTeachers} Selesai ({progressPercent}%)</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                                        <div
                                                                className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                                                                style={{ width: `${progressPercent}%` }}
                                                        ></div>
                                                </div>
                                        </div>
                                </div>

                                {/* Grid Daftar Guru */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {teachers.map((teacher) => (
                                                <div
                                                        key={teacher.id}
                                                        onClick={() => !teacher.is_assessed && openAssessmentModal(teacher)}
                                                        className={`relative rounded-2xl p-6 border transition-all duration-300 ${teacher.is_assessed
                                                                        ? 'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 opacity-60 cursor-not-allowed'
                                                                        : 'bg-white border-transparent shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer dark:bg-gray-800 dark:hover:border-blue-500'
                                                                }`}
                                                >
                                                        {teacher.is_assessed && (
                                                                <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">Selesai</span>
                                                        )}
                                                        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400 font-bold text-xl">
                                                                {teacher.name.charAt(0)}
                                                        </div>
                                                        <h3 className="text-center font-bold text-gray-800 dark:text-white truncate">{teacher.name}</h3>
                                                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1">NIP: {teacher.nip || '-'}</p>
                                                </div>
                                        ))}
                                </div>
                        </div>

                        {/* Modal Form Penilaian (Gamified) */}
                        {selectedTeacher && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4">
                                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
                                                {/* Header Modal */}
                                                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                                                        <div className="flex items-center space-x-4">
                                                                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 font-bold text-lg">
                                                                        {selectedTeacher.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Evaluasi: {selectedTeacher.name}</h2>
                                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Periode Saat Ini</p>
                                                                </div>
                                                        </div>
                                                        <button onClick={closeAssessmentModal} className="text-gray-400 hover:text-red-500 text-3xl font-light">&times;</button>
                                                </div>

                                                {/* Body Modal - Scrollable */}
                                                <div className="p-6 overflow-y-auto space-y-8">
                                                        {/* Looping Indikator Bintang */}
                                                        {categories.map(cat => (
                                                                <div key={cat.id} className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                                        <div>
                                                                                <h4 className="font-semibold text-gray-800 dark:text-white">{cat.name}</h4>
                                                                                <p className="text-sm text-gray-500 dark:text-gray-400">{cat.description}</p>
                                                                        </div>
                                                                        <div className="flex space-x-2">
                                                                                {[1, 2, 3, 4, 5].map(star => (
                                                                                        <svg
                                                                                                key={star}
                                                                                                onClick={() => handleRating(cat.id, star)}
                                                                                                className={`w-10 h-10 cursor-pointer transition-all hover:scale-110 active:scale-90 ${(ratings[cat.id] >= star) ? 'text-yellow-400 drop-shadow-md' : 'text-gray-300 dark:text-gray-600'
                                                                                                        }`}
                                                                                                fill="currentColor"
                                                                                                viewBox="0 0 20 20"
                                                                                        >
                                                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                                        </svg>
                                                                                ))}
                                                                        </div>
                                                                </div>
                                                        ))}

                                                        {/* Catatan Feedback */}
                                                        <div>
                                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Catatan Konstruktif (Opsional)</label>
                                                                <textarea
                                                                        value={generalNotes}
                                                                        onChange={(e) => setGeneralNotes(e.target.value)}
                                                                        rows="4"
                                                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                                        placeholder="Berikan apresiasi atau masukan untuk pengembangan..."
                                                                />
                                                        </div>
                                                </div>

                                                {/* Footer Modal */}
                                                <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                                                        <button
                                                                onClick={handleSubmit}
                                                                disabled={isLoading}
                                                                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
                                                        >
                                                                {isLoading ? 'Menyimpan...' : 'Simpan Penilaian'}
                                                        </button>
                                                </div>
                                        </div>
                                </div>
                        )}
                </div>
        );
};

export default AssessmentDashboard;