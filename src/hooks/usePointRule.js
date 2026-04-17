import { useState, useEffect } from 'react';
import api from '../api';

export const usePointRule = () => {
        const [data, setData] = useState([]);
        const [loading, setLoading] = useState(false);
        const [modalOpen, setModalOpen] = useState(false);
        const [isEditing, setIsEditing] = useState(false);

        const [form, setForm] = useState({
                id: null,
                rule_name: '',
                condition_operator: '<',
                condition_value: '',
                point_modifier: 0,
                is_active: true
        });

        const fetchData = async () => {
                setLoading(true);
                try {
                        const res = await api.get('/point-rules');
                        setData(res.data.data);
                } catch (err) {
                        console.error(err);
                } finally {
                        setLoading(false);
                }
        };

        useEffect(() => { fetchData(); }, []);

        const handleChange = (e) => {
                const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
                setForm({ ...form, [e.target.name]: value });
        };

        const openModal = (item = null) => {
                setIsEditing(!!item);
                setForm(item ? { ...item, is_active: item.is_active !== 0 } : {
                        id: null, rule_name: '', condition_operator: '<', condition_value: '', point_modifier: 0, is_active: true
                });
                setModalOpen(true);
        };

        const handleSubmit = async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                        isEditing ? await api.put(`/point-rules/${form.id}`, form) : await api.post('/point-rules', form);
                        fetchData();
                        setModalOpen(false);
                } catch (err) {
                        alert(err?.response?.data?.message || 'Gagal menyimpan aturan');
                } finally {
                        setLoading(false);
                }
        };

        const handleDelete = async (id) => {
                if (confirm('Nonaktifkan aturan ini?')) {
                        try {
                                await api.delete(`/point-rules/${id}`);
                                fetchData();
                        } catch (err) {
                                alert('Gagal menghapus aturan');
                        }
                }
        };

        return { state: { data, loading, modalOpen, isEditing, form }, actions: { handleChange, openModal, setModalOpen, handleSubmit, handleDelete } };
};