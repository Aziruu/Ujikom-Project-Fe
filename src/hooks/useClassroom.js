import { useState, useEffect } from 'react';
import api from '../api';

export const useClassroom = () => {
        const [data, setData] = useState([]);

        // State buat dropdown pilihan statis
        const [majors, setMajors] = useState([]);
        const [academicYears, setAcademicYears] = useState([]);

        // --- STATE KHUSUS CUSTOM DROPDOWN GURU ---
        const [teachers, setTeachers] = useState([]);
        const [teacherSearch, setTeacherSearch] = useState('');
        const [isDropdownOpen, setIsDropdownOpen] = useState(false);
        const [loadingTeachers, setLoadingTeachers] = useState(false);
        const [teacherPage, setTeacherPage] = useState(1);
        const [teacherTotalPages, setTeacherTotalPages] = useState(1);

        const [loading, setLoading] = useState(false);
        const [modalOpen, setModalOpen] = useState(false);
        const [isEditing, setIsEditing] = useState(false);

        const [form, setForm] = useState({
                id: null,
                name: '',
                grade_level: '10', // Default kelas 10
                major_id: '',
                academic_year_id: '',
                homeroom_teacher_id: ''
        });

        const fetchData = async () => {
                setLoading(true);
                try {
                        // Tarik 3 data statis sekaligus (Teachers udah dipisah)
                        const [resClass, resMajors, resYears] = await Promise.all([
                                api.get('/classrooms'),
                                api.get('/majors'),
                                api.get('/academic-years')
                        ]);

                        setData(resClass.data.data);
                        setMajors(resMajors.data.data);
                        setAcademicYears(resYears.data.data);
                } catch (err) {
                        console.error("Gagal tarik data kelas:", err);
                } finally {
                        setLoading(false);
                }
        };

        useEffect(() => { fetchData(); }, []);

        // FETCH GURU UNTUK DROPDOWN (Bisa di-scroll)
        useEffect(() => {
                const fetchTeachersDropdown = async () => {
                        setLoadingTeachers(true);
                        try {
                                const res = await api.get(`/teachers?search=${teacherSearch}&page=${teacherPage}`);
                                if (teacherPage === 1) {
                                        setTeachers(res.data.data);
                                } else {
                                        setTeachers(prev => [...prev, ...res.data.data]);
                                }
                                setTeacherTotalPages(res.data.meta ? res.data.meta.last_page : res.data.last_page);
                        } catch (err) {
                                console.error("Gagal cari guru:", err);
                        } finally {
                                setLoadingTeachers(false);
                        }
                };

                const timer = setTimeout(() => fetchTeachersDropdown(), 500);
                return () => clearTimeout(timer);
        }, [teacherSearch, teacherPage]);

        const handleTeacherScroll = (e) => {
                const { scrollTop, clientHeight, scrollHeight } = e.target;
                const isBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 50;

                if (isBottom && !loadingTeachers) {
                        if (teacherPage < teacherTotalPages) {
                                setLoadingTeachers(true); // Kunci loading
                                setTeacherPage(prev => prev + 1);
                        }
                }
        };

        const handleSearchTeacherInput = (val) => {
                setLoadingTeachers(true);
                setTeacherSearch(val);
                setTeacherPage(1);
                setIsDropdownOpen(true);
        };

        const selectTeacher = (id, name) => {
                setForm(prev => ({ ...prev, homeroom_teacher_id: id }));
                setTeacherSearch(name);
                setIsDropdownOpen(false);
        };

        const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

        const openModal = (item = null) => {
                setIsEditing(!!item);
                if (item) {
                        setForm({
                                id: item.id,
                                name: item.name,
                                grade_level: item.grade_level,
                                major_id: item.major_id || '',
                                academic_year_id: item.academic_year_id || '',
                                homeroom_teacher_id: item.homeroom_teacher_id || ''
                        });
                        // Set nama wali kelas di kotak pencarian kalau udah ada datanya
                        setTeacherSearch(item.homeroom_teacher?.name || '');
                } else {
                        setForm({ id: null, name: '', grade_level: '10', major_id: '', academic_year_id: '', homeroom_teacher_id: '' });
                        setTeacherSearch('');
                }
                setTeacherPage(1);
                setIsDropdownOpen(false);
                setModalOpen(true);
        };

        const handleSubmit = async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                        const payload = {
                                ...form,
                                homeroom_teacher_id: form.homeroom_teacher_id || null
                        };

                        isEditing ? await api.put(`/classrooms/${form.id}`, payload) : await api.post('/classrooms', payload);
                        fetchData();
                        setModalOpen(false);
                } catch (err) {
                        alert('Gagal menyimpan kelas. Cek semua inputannya ya! ' + err.message);
                } finally {
                        setLoading(false);
                }
        };

        const handleDelete = async (id) => {
                if (confirm('Yakin mau hapus kelas ini? Data jadwal yang pakai kelas ini bisa error lho!')) {
                        try {
                                await api.delete(`/classrooms/${id}`);
                                fetchData();
                        } catch (err) {
                                alert('Gagal menghapus ' + err.message);
                        }
                }
        };

        return {
                state: { data, majors, academicYears, teachers, loading, modalOpen, isEditing, form, teacherSearch, isDropdownOpen, loadingTeachers },
                actions: { handleChange, openModal, setModalOpen, handleSubmit, handleDelete, handleSearchTeacherInput, handleTeacherScroll, selectTeacher, setIsDropdownOpen }
        };
};