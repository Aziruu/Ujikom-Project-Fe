import { useState, useEffect } from 'react';
import api from '../api';

export const useMajor = () => {
        const [data, setData] = useState([]);
        const [teachers, setTeachers] = useState([]);
        const [loading, setLoading] = useState(false);
        const [modalOpen, setModalOpen] = useState(false);
        const [isEditing, setIsEditing] = useState(false);

        const [form, setForm] = useState({ id: null, code: '', name: '', head_of_program_id: '' });

        const fetchData = async () => {
                setLoading(true);
                try {
                        const [resMajors, resTeachers] = await Promise.all([
                                api.get('/majors'),
                                api.get('/teachers?per_page=100')
                        ]);
                        setData(resMajors.data.data);
                        setTeachers(resTeachers.data.data || resTeachers.data);
                } catch (err) {
                        console.error(err);
                } finally {
                        setLoading(false);
                }
        };

        useEffect(() => { fetchData(); }, []);

        const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

        const openModal = (item = null) => {
                setIsEditing(!!item);
                setForm(item ? {
                        id: item.id,
                        code: item.code,
                        name: item.name,
                        head_of_program_id: item.head_of_program_id || ''
                } : { id: null, code: '', name: '', head_of_program_id: '' });
                setModalOpen(true);
        };

        const handleSubmit = async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                        // head_of_program_id  jadi null biar nggak error
                        const payload = { ...form, head_of_program_id: form.head_of_program_id || null };
                        isEditing ? await api.put(`/majors/${form.id}`, payload) : await api.post('/majors', payload);
                        fetchData();
                        setModalOpen(false);
                } catch (err) {
                        alert(err || 'Gagal menyimpan jurusan');
                } finally {
                        setLoading(false);
                }
        };

        const handleDelete = async (id) => {
                if (confirm('Hapus jurusan ini?')) {
                        try {
                                await api.delete(`/majors/${id}`);
                                fetchData();
                        } catch (err) {
                                alert(err || 'Gagal menghapus');
                        }
                }
        };

        return { state: { data, teachers, loading, modalOpen, isEditing, form }, actions: { handleChange, openModal, setModalOpen, handleSubmit, handleDelete } };
};