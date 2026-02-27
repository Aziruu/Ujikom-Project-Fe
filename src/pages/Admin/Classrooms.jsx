import { useClassroom } from '../../hooks/useClassroom';

export default function Classroom() {
        const { state, actions } = useClassroom();
        const { data, majors, academicYears, teachers, loading, modalOpen, isEditing, form } = state;

        return (
                <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Daftar Kelas</h1>
                                <button onClick={() => actions.openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                        + Tambah Kelas
                                </button>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white uppercase">
                                                <tr>
                                                        <th className="p-4">Nama Kelas</th>
                                                        <th className="p-4">Tingkat</th>
                                                        <th className="p-4">Jurusan</th>
                                                        <th className="p-4">Tahun Ajaran</th>
                                                        <th className="p-4">Wali Kelas</th>
                                                        <th className="p-4 text-right">Aksi</th>
                                                </tr>
                                        </thead>
                                        <tbody className="divide-y dark:divide-gray-700">
                                                {data.map(item => (
                                                        <tr key={item.id}>
                                                                <td className="p-4 font-bold text-blue-600 dark:text-blue-400">{item.name}</td>
                                                                <td className="p-4 font-medium dark:text-white">Kelas {item.grade_level}</td>
                                                                <td className="p-4 text-gray-600 dark:text-gray-300">{item.major?.name || '-'}</td>
                                                                <td className="p-4 text-gray-600 dark:text-gray-300">
                                                                        {item.academic_year?.name}
                                                                        {item.academic_year?.is_active && <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full">Aktif</span>}
                                                                </td>
                                                                <td className="p-4 text-gray-500 dark:text-gray-400">{item.homeroom_teacher?.name || '- Belum Ada -'}</td>
                                                                <td className="p-4 text-right space-x-2">
                                                                        <button onClick={() => actions.openModal(item)} className="text-blue-600 font-medium">Edit</button>
                                                                        <button onClick={() => actions.handleDelete(item.id)} className="text-red-500 font-medium">Hapus</button>
                                                                </td>
                                                        </tr>
                                                ))}
                                        </tbody>
                                </table>
                        </div>

                        {/* MODAL */}
                        {modalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
                                        <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl p-6">
                                                <h2 className="text-xl font-bold mb-4 dark:text-white">{isEditing ? 'Edit Kelas' : 'Tambah Kelas Baru'}</h2>
                                                <form onSubmit={actions.handleSubmit} className="space-y-4">

                                                        <div className="grid grid-cols-3 gap-4">
                                                                <div className="col-span-2">
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Nama Kelas</label>
                                                                        <input type="text" name="name" value={form.name} onChange={actions.handleChange} placeholder="Cth: X PPLG 1" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white" required />
                                                                </div>
                                                                <div className="col-span-1">
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Tingkat</label>
                                                                        <select name="grade_level" value={form.grade_level} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white" required>
                                                                                <option value="10">Kelas 10</option>
                                                                                <option value="11">Kelas 11</option>
                                                                                <option value="12">Kelas 12</option>
                                                                        </select>
                                                                </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Jurusan</label>
                                                                        <select name="major_id" value={form.major_id} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white" required>
                                                                                <option value="">-- Pilih Jurusan --</option>
                                                                                {Array.isArray(majors) && majors.map(m => (
                                                                                        <option key={m.id} value={m.id}>{m.code} - {m.name}</option>
                                                                                ))}
                                                                        </select>
                                                                </div>
                                                                <div>
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Tahun Ajaran</label>
                                                                        <select name="academic_year_id" value={form.academic_year_id} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white" required>
                                                                                <option value="">-- Pilih Tahun --</option>
                                                                                {Array.isArray(academicYears) && academicYears.map(y => (
                                                                                        <option key={y.id} value={y.id}>{y.name}</option>
                                                                                ))}
                                                                        </select>
                                                                </div>
                                                        </div>

                                                        <div>
                                                                <label className="block text-xs font-medium text-gray-500 mb-1">Wali Kelas (Opsional)</label>
                                                                <select name="homeroom_teacher_id" value={form.homeroom_teacher_id} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white">
                                                                        <option value="">-- Pilih Wali Kelas --</option>
                                                                        {Array.isArray(teachers) && teachers.map(t => (
                                                                                <option key={t.id} value={t.id}>{t.name}</option>
                                                                        ))}
                                                                </select>
                                                        </div>

                                                        <div className="flex justify-end gap-2 pt-4">
                                                                <button type="button" onClick={() => actions.setModalOpen(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400">Batal</button>
                                                                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50">
                                                                        {loading ? 'Menyimpan...' : 'Simpan Kelas'}
                                                                </button>
                                                        </div>
                                                </form>
                                        </div>
                                </div>
                        )}
                </div>
        );
}