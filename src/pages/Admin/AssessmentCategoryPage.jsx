import React from 'react';
import { useAssessmentCategory } from '../../hooks/useAssessmentCategory';

const AssessmentCategoryPage = () => {
        // Destructuring semua logika dari Custom Hook
        const {
                categories,
                isLoading,
                isModalOpen,
                formData,
                editingId,
                openModal,
                closeModal,
                handleInputChange,
                handleSubmit,
                handleToggleActive
        } = useAssessmentCategory();

        return (
                <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans transition-colors duration-300">
                        <div className="max-w-6xl mx-auto">
                                {/* Header Section */}
                                <div className="flex justify-between items-center mb-8">
                                        <div>
                                                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Indikator Penilaian</h1>
                                                <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola parameter evaluasi kinerja pendidik secara dinamis.</p>
                                        </div>
                                        <button
                                                onClick={() => openModal()}
                                                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md transition-all active:scale-95"
                                        >
                                                + Tambah Indikator Baru
                                        </button>
                                </div>

                                {/* Table Section (Modern Card Look) */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                                        {isLoading && categories.length === 0 ? (
                                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">Memuat data indikator...</div>
                                        ) : (
                                                <table className="w-full text-left border-collapse">
                                                        <thead>
                                                                <tr className="bg-gray-50/50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-300 text-sm uppercase tracking-wider">
                                                                        <th className="p-4 font-medium">Nama Indikator</th>
                                                                        <th className="p-4 font-medium">Deskripsi</th>
                                                                        <th className="p-4 font-medium text-center">Status</th>
                                                                        <th className="p-4 font-medium text-right">Aksi</th>
                                                                </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                                                {categories.map((cat) => (
                                                                        <tr key={cat.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                                                                <td className="p-4 font-semibold text-gray-800 dark:text-gray-100">{cat.name}</td>
                                                                                <td className="p-4 text-gray-600 dark:text-gray-400 text-sm max-w-xs truncate">{cat.description || '-'}</td>
                                                                                <td className="p-4 text-center">
                                                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cat.is_active
                                                                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                                                                }`}>
                                                                                                {cat.is_active ? 'Aktif' : 'Nonaktif'}
                                                                                        </span>
                                                                                </td>
                                                                                <td className="p-4 text-right space-x-3">
                                                                                        <button
                                                                                                onClick={() => openModal(cat)}
                                                                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors"
                                                                                        >
                                                                                                Edit
                                                                                        </button>
                                                                                        <button
                                                                                                onClick={() => handleToggleActive(cat.id, cat.is_active)}
                                                                                                className={`${cat.is_active
                                                                                                        ? 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                                                                                                        : 'text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
                                                                                                        } font-medium text-sm transition-colors`}
                                                                                        >
                                                                                                {cat.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                                                        </button>
                                                                                </td>
                                                                        </tr>
                                                                ))}
                                                        </tbody>
                                                </table>
                                        )}
                                </div>
                        </div>

                        {/* Modal Form Pop-up */}
                        {isModalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm">
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all border border-transparent dark:border-gray-700">
                                                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/30 dark:bg-gray-800/50">
                                                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                                                {editingId ? 'Edit Indikator' : 'Tambah Indikator Baru'}
                                                        </h2>
                                                        <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl font-light">&times;</button>
                                                </div>

                                                <form onSubmit={handleSubmit} className="p-6">
                                                        <div className="space-y-4">
                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Indikator</label>
                                                                        <input
                                                                                type="text"
                                                                                name="name"
                                                                                value={formData.name}
                                                                                onChange={handleInputChange}
                                                                                required
                                                                                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                                                                                placeholder="Contoh: Kedisiplinan"
                                                                        />
                                                                </div>
                                                                <div>
                                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi Ringkas</label>
                                                                        <textarea
                                                                                name="description"
                                                                                value={formData.description}
                                                                                onChange={handleInputChange}
                                                                                rows="3"
                                                                                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                                                                                placeholder="Jelaskan kriteria indikator ini..."
                                                                        />
                                                                </div>
                                                        </div>

                                                        <div className="mt-8 flex justify-end space-x-3">
                                                                <button
                                                                        type="button"
                                                                        onClick={closeModal}
                                                                        className="px-5 py-2 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                                                                >
                                                                        Batal
                                                                </button>
                                                                <button
                                                                        type="submit"
                                                                        disabled={isLoading}
                                                                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-xl shadow-md transition-colors disabled:opacity-50"
                                                                >
                                                                        {isLoading ? 'Menyimpan...' : 'Simpan Indikator'}
                                                                </button>
                                                        </div>
                                                </form>
                                        </div>
                                </div>
                        )}
                </div>
        );
};

export default AssessmentCategoryPage;