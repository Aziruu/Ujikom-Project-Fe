import { useState, useEffect } from 'react';
import api from '../api';

export const useTeachingSchedule = () => {
        const [data, setData] = useState([]);

        // State buat nampung pilihan dropdown
        const [teachers, setTeachers] = useState([]);
        const [classrooms, setClassrooms] = useState([]);
        const [subjects, setSubjects] = useState([]);

        const [loading, setLoading] = useState(false);
        const [modalOpen, setModalOpen] = useState(false);
        const [isEditing, setIsEditing] = useState(false);

        const [form, setForm] = useState({
                id: null,
                teacher_id: '',
                classroom_id: '',
                subject_id: '',
                day: 'senin',
                start_time: '',
                end_time: ''
        });

        const fetchData = async () => {
                setLoading(true);
                try {
                        const [resSchedules, resTeachers, resClassrooms, resSubjects] = await Promise.all([
                                api.get('/teaching-schedules'),
                                api.get('/teachers?per_page=100'),
                                api.get('/classrooms'),
                                api.get('/subjects')
                        ]);

                        setData(resSchedules.data.data);
                        setTeachers(resTeachers.data.data || resTeachers.data);
                        setClassrooms(resClassrooms.data.data);
                        setSubjects(resSubjects.data.data);
                } catch (err) {
                        console.error("Gagal tarik data jadwal:", err);
                        alert("Oops! Gagal ambil data. Cek koneksi atau servernya ya.");
                } finally {
                        setLoading(false);
                }
        };

        useEffect(() => { fetchData(); }, []);

        const handleChange = (e) => {
                const { name, value } = e.target;
                setForm(prev => ({ ...prev, [name]: value }));
        };

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
                                end_time: item.end_time ? item.end_time.slice(0, 5) : '07:30',
                        });
                } else {
                        setForm({ id: null, teacher_id: '', classroom_id: '', subject_id: '', day: 'senin', start_time: '07:00', end_time: '08:30' });
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
                        fetchData();
                        setModalOpen(false);
                } catch (err) {
                        alert('Gagal menyimpan jadwal. Cek lagi ya jamnya! Error: ' + (err.response?.data?.message || err.message));
                } finally {
                        setLoading(false);
                }
        };

        const handleDelete = async (id) => {
                if (confirm('Yakin mau hapus jadwal ini? Nanti jurnal gurunya bisa hilang lho!')) {
                        try {
                                await api.delete(`/teaching-schedules/${id}`);
                                fetchData();
                        } catch (err) {
                                alert('Gagal menghapus: ' + err.message);
                        }
                }
        };

        return {
                state: { data, teachers, classrooms, subjects, loading, modalOpen, isEditing, form },
                actions: { handleChange, openModal, setModalOpen, handleSubmit, handleDelete }
        };
};