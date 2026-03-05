import { useState, useEffect } from 'react';
import api from '../api';

export const useTeachingSchedule = () => {
        // --- STATE UTAMA (Tabel Jadwal) ---
        const [data, setData] = useState([]);
        const [loading, setLoading] = useState(false);

        // --- STATE DROPDOWN ---
        const [teachers, setTeachers] = useState([]);
        const [classrooms, setClassrooms] = useState([]);
        const [subjects, setSubjects] = useState([]);

        // --- STATE PENCARIAN GURU DI DALAM MODAL ---
        const [teacherSearch, setTeacherSearch] = useState('');

        // --- STATE MODAL & FORM ---
        const [modalOpen, setModalOpen] = useState(false);
        const [isEditing, setIsEditing] = useState(false);
        const [form, setForm] = useState({
                id: null,
                teacher_id: '',
                classroom_id: '',
                subject_id: '',
                day: 'senin',
                start_time: '07:00',
                end_time: '08:30'
        });

        // --- STATE PAGINATION & SEARCH (Tabel Utama) ---
        const [currentPage, setCurrentPage] = useState(1);
        const [totalPages, setTotalPages] = useState(1);
        const [totalData, setTotalData] = useState(0);
        const [searchTerm, setSearchTerm] = useState('');

        // 1. Fetch data Kelas & Mapel (Hanya jalan sekali saat halaman dibuka)
        useEffect(() => {
                const fetchStaticDropdowns = async () => {
                        try {
                                const [resClassrooms, resSubjects] = await Promise.all([
                                        api.get('/classrooms'),
                                        api.get('/subjects')
                                ]);
                                setClassrooms(resClassrooms.data.data);
                                setSubjects(resSubjects.data.data);
                        } catch (err) {
                                console.error("Gagal tarik data dropdown kelas/mapel:", err);
                        }
                };
                fetchStaticDropdowns();
        }, []);

        // 2. Fetch data GURU khusus buat dropdown (Jalan tiap kali ngetik di search bar modal)
        useEffect(() => {
                const fetchTeachersForDropdown = async () => {
                        try {
                                // Cuma narik 10 data, ditambah filter nama kalau teacherSearch ada isinya
                                const res = await api.get(`/teachers?search=${teacherSearch}`);
                                setTeachers(res.data.data);
                        } catch (err) {
                                console.error("Gagal cari guru:", err);
                        }
                };

                const timer = setTimeout(() => fetchTeachersForDropdown(), 500);
                return () => clearTimeout(timer);
        }, [teacherSearch]);

        // 3. Fetch data Tabel Utama Jadwal
        const fetchSchedules = async (page = 1, search = '') => {
                setLoading(true);
                try {
                        const res = await api.get(`/teaching-schedules?page=${page}&search=${search}`);
                        const result = res.data;

                        setData(result.data);
                        setCurrentPage(result.meta ? result.meta.current_page : result.current_page);
                        setTotalPages(result.meta ? result.meta.last_page : result.last_page);
                        setTotalData(result.meta ? result.meta.total : result.total);
                } catch (err) {
                        console.error("Gagal tarik data jadwal:", err);
                } finally {
                        setLoading(false);
                }
        };

        useEffect(() => {
                const timer = setTimeout(() => {
                        fetchSchedules(currentPage, searchTerm);
                }, 500);
                return () => clearTimeout(timer);
        }, [currentPage, searchTerm]);

        // --- HANDLERS ---
        const handleSearchChange = (e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
        };

        const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

        const openModal = (item = null) => {
                setIsEditing(!!item);
                if (item) {
                        setForm({
                                id: item.id,
                                teacher_id: item.teacher_id,
                                classroom_id: item.classroom_id,
                                subject_id: item.subject_id,
                                day: item.day,
                                start_time: item.start_time ? item.start_time.slice(0, 5) : '07:00',
                                end_time: item.end_time ? item.end_time.slice(0, 5) : '08:30'
                        });
                        // Reset pencarian guru kalau lagi edit
                        setTeacherSearch('');
                } else {
                        setForm({ id: null, teacher_id: '', classroom_id: '', subject_id: '', day: 'senin', start_time: '07:00', end_time: '08:30' });
                        setTeacherSearch('');
                }
                setModalOpen(true);
        };

        const handleSubmit = async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                        if (isEditing) {
                                await api.put(`/teaching-schedules/${form.id}`, form);
                        } else {
                                await api.post('/teaching-schedules', form);
                        }
                        fetchSchedules(currentPage, searchTerm);
                        setModalOpen(false);
                } catch (err) {
                        alert('Gagal menyimpan jadwal. ' + (err.response?.data?.message || err.message));
                } finally {
                        setLoading(false);
                }
        };

        const handleDelete = async (id) => {
                if (confirm('Yakin mau hapus jadwal ini?')) {
                        try {
                                await api.delete(`/teaching-schedules/${id}`);
                                fetchSchedules(currentPage, searchTerm);
                        } catch (err) {
                                alert('Gagal menghapus: ' + err.message);
                        }
                }
        };

        return {
                state: { data, teachers, classrooms, subjects, loading, modalOpen, isEditing, form, currentPage, totalPages, totalData, searchTerm, teacherSearch },
                actions: { handleChange, handleSearchChange, openModal, setModalOpen, handleSubmit, handleDelete, setCurrentPage, setTeacherSearch }
        };
};