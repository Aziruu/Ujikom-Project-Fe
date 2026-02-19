import { useState, useEffect } from 'react';
import api from '../api';

export const useSubject = () => {
        const [data, setData] = useState([]);
        const [loading, setLoading] = useState(false);
        const [modalOpen, setModalOpen] = useState(false);
        const [isEditing, setIsEditing] = useState(false);

        const [form, setForm] = useState({ id: null, name: '' });

        const fetchData = async () => {
                setLoading(true);
                try {
                        const res = await api.get('/subjects');
                        setData(res.data.data);
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
                setForm(item ? { id: item.id, name: item.name } : { id: null, name: '' });
                setModalOpen(true);
        };

        const handleSubmit = async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                        isEditing ? await api.put(`/subjects/${form.id}`, form) : await api.post('/subjects', form);
                        fetchData();
                        setModalOpen(false);
                } catch (err) {
                        alert(err || 'Gagal menyimpan mata pelajaran');
                } finally {
                        setLoading(false);
                }
        };

        const handleDelete = async (id) => {
                if (confirm('Hapus mata pelajaran ini?')) {
                        try {
                                await api.delete(`/subjects/${id}`);
                                fetchData();
                        } catch (err) {
                                alert(err || 'Gagal menghapus');
                        }
                }
        };

        return { state: { data, loading, modalOpen, isEditing, form }, actions: { handleChange, openModal, setModalOpen, handleSubmit, handleDelete } };
};