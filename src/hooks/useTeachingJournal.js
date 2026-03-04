import { useState, useEffect } from 'react';
import api from '../api';

export const useTeachingJournal = () => {
        const [data, setData] = useState([]);
        const [teachers, setTeachers] = useState([]);
        const [classrooms, setClassrooms] = useState([]);
        const [schedules, setSchedules] = useState([]);

        const [loading, setLoading] = useState(false);
        const [modalOpen, setModalOpen] = useState(false);

        // State modal foto
        const [viewPhotos, setViewPhotos] = useState(null);

        // State Cari Guru
        const [teacherSearch, setTeacherSearch] = useState('');

        // State nampung form dan file foto
        const [form, setForm] = useState({
                teacher_id: '',
                classroom_id: '',
                schedule_id: '',
                date: new Date().toISOString().split('T')[0],
                topic: '',
                latitude: '',
                longitude: ''
        });
        const [photos, setPhotos] = useState([]);

        const fetchData = async () => {
                setLoading(true);
                try {
                        const [resJournals, resClass, resSched] = await Promise.all([
                                api.get('/teaching-journals'),
                                api.get('/classrooms'),
                                api.get('/teaching-schedules')
                        ]);
                        setData(resJournals.data.data);
                        setClassrooms(resClass.data.data);
                        setSchedules(resSched.data.data);
                } catch (err) {
                        console.error(err);
                } finally {
                        setLoading(false);
                }
        };

        useEffect(() => { fetchData(); }, []);

        //  Use Effect Pencarian Guru
        useEffect(() => {
                const fetchTeachers = async () => {
                        try {
                                // Minta data 10 guru aja, ditambah filter pencarian kalau ada
                                const res = await api.get(`/teachers?search=${teacherSearch}`);
                                setTeachers(res.data.data);
                        } catch (err) {
                                console.error("Gagal cari guru:", err);
                        }
                };

                // Delay 500ms biar nggak ngirim request tiap ketik 1 huruf (Debounce)
                const timer = setTimeout(() => fetchTeachers(), 500);
                return () => clearTimeout(timer);
        }, [teacherSearch]);

        const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

        // Ambil file dari input
        const handleFileChange = (e) => {
                setPhotos(e.target.files);
        };

        // Ambil GPS Lokasi
        const getLocation = () => {
                if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                                (pos) => {
                                        setForm(prev => ({ ...prev, latitude: pos.coords.latitude.toString(), longitude: pos.coords.longitude.toString() }));
                                        alert("Lokasi berhasil dikunci! 📍");
                                },
                                () => alert("Gagal ambil lokasi GPS. Pastikan izin lokasi browser aktif ya!")
                        );
                } else {
                        alert("Browser kamu nggak support GPS.");
                }
        };

        const openModal = () => {
                setForm({ teacher_id: '', classroom_id: '', schedule_id: '', date: new Date().toISOString().split('T')[0], topic: '', latitude: '', longitude: '' });
                setPhotos([]);
                setModalOpen(true);
        };

        const handleSubmit = async (e) => {
                e.preventDefault();
                if (photos.length === 0) return alert("Upload minimal 1 foto!");
                if (photos.length > 3) return alert("Maksimal 3 foto!");

                setLoading(true);

                const formData = new FormData();
                Object.keys(form).forEach(key => {
                        if (form[key]) formData.append(key, form[key]);
                });

                // Masukin fotonya satu-satu ke array photos[]
                for (let i = 0; i < photos.length; i++) {
                        formData.append('photos[]', photos[i]);
                }

                try {
                        await api.post('/teaching-journals', formData, {
                                headers: { 'Content-Type': 'multipart/form-data' }
                        });
                        fetchData();
                        setModalOpen(false);
                        alert("Berhasil ngirim jurnal!");
                } catch (err) {
                        alert('Gagal nyimpen jurnal: ' + (err.response?.data?.message || err.message));
                } finally {
                        setLoading(false);
                }
        };

        // Verifikasi Jurnal (ACC / Tolak)
        const handleVerify = async (id, status) => {
                if (!confirm(`Yakin mau ubah status jurnal ini jadi ${status.toUpperCase()}?`)) return;
                setLoading(true);
                try {
                        await api.patch(`/teaching-journals/${id}/verify`, { status });
                        fetchData();
                } catch (err) {
                        alert('Gagal verifikasi: ' + (err.response?.data?.message || err.message));
                } finally {
                        setLoading(false);
                }
        };

        // Hapus Jurnal & Foto
        const handleDelete = async (id) => {
                if (!confirm('Yakin mau hapus jurnal ini? Fotonya juga bakal kehapus permanen lho!')) return;
                setLoading(true);
                try {
                        await api.delete(`/teaching-journals/${id}`);
                        fetchData();
                } catch (err) {
                        alert('Gagal hapus jurnal: ' + (err.response?.data?.message || err.message));
                } finally {
                        setLoading(false);
                }
        };

        return {
                state: { data, teachers, classrooms, schedules, loading, modalOpen, form, photos, viewPhotos, teacherSearch },
                actions: { handleChange, handleFileChange, getLocation, openModal, setModalOpen, handleSubmit, handleVerify, handleDelete, setViewPhotos, setTeacherSearch }
        };
};