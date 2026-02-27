import { useState, useEffect } from 'react';
import api from '../api';

export const useClassroom = () => {
        const [data, setData] = useState([]);

        // State buat dropdown pilihan
        const [majors, setMajors] = useState([]);
        const [academicYears, setAcademicYears] = useState([]);
        const [teachers, setTeachers] = useState([]);

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
                        // Tarik 4 data sekaligus! Keren kan? 😎
                        const [resClass, resMajors, resYears, resTeachers] = await Promise.all([
                                api.get('/classrooms'),
                                api.get('/majors'),
                                api.get('/academic-years'),
                                api.get('/teachers?per_page=100')
                        ]);

                        setData(resClass.data.data);
                        setMajors(resMajors.data.data);
                        setAcademicYears(resYears.data.data);
                        setTeachers(resTeachers.data.data || resTeachers.data);
                } catch (err) {
                        console.error("Gagal tarik data kelas:", err);
                } finally {
                        setLoading(false);
                }
        };

        useEffect(() => { fetchData(); }, []);

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
                } else {
                        setForm({ id: null, name: '', grade_level: '10', major_id: '', academic_year_id: '', homeroom_teacher_id: '' });
                }
                setModalOpen(true);
        };

        const handleSubmit = async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                        // Pastikan data kosong jadi null biar backend nggak ngamuk
                        const payload = {
                                ...form,
                                homeroom_teacher_id: form.homeroom_teacher_id || null
                        };

                        isEditing ? await api.put(`/classrooms/${form.id}`, payload) : await api.post('/classrooms', payload);
                        fetchData();
                        setModalOpen(false);
                } catch (err) {
                        alert('Gagal menyimpan kelas. Cek semua inputannya ya!' + err.message);
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
                                alert('Gagal menghapus' + err.message);
                        }
                }
        };

        return {
                state: { data, majors, academicYears, teachers, loading, modalOpen, isEditing, form },
                actions: { handleChange, openModal, setModalOpen, handleSubmit, handleDelete }
        };
};