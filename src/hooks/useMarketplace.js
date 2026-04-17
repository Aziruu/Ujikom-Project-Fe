import { useState, useEffect } from 'react';
import api from '../api';

export const useMarketplace = () => {
        const [data, setData] = useState([]);
        const [loading, setLoading] = useState(false);
        const [modalOpen, setModalOpen] = useState(false);
        const [isEditing, setIsEditing] = useState(false);

        const [form, setForm] = useState({
                id: null,
                item_name: '',
                description: '',
                point_cost: '',
                stock_limit: '',
                is_active: true
        });

        const fetchData = async () => {
                setLoading(true);
                try {
                        // Sesuai route admin yang kita buat di Laravel
                        const res = await api.get('/marketplace');
                        setData(res.data.data.data); // Asumsi pakai paginate, ambil array datanya
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
                setForm(item ? {
                        id: item.id,
                        item_name: item.item_name,
                        description: item.description || '',
                        point_cost: item.point_cost,
                        stock_limit: item.stock_limit || '',
                        is_active: item.is_active !== 0 // convert tinyint to boolean
                } : {
                        id: null, item_name: '', description: '', point_cost: '', stock_limit: '', is_active: true
                });
                setModalOpen(true);
        };

        const handleSubmit = async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                        isEditing
                                ? await api.put(`/marketplace/${form.id}`, form)
                                : await api.post('/marketplace', form);
                        fetchData();
                        setModalOpen(false);
                } catch (err) {
                        alert(err?.response?.data?.message || 'Gagal menyimpan item');
                } finally {
                        setLoading(false);
                }
        };

        const handleDelete = async (id) => {
                if (confirm('Tarik item ini dari peredaran? (Ubah status jadi non-aktif)')) {
                        try {
                                await api.delete(`/marketplace/${id}`);
                                fetchData();
                        } catch (err) {
                                alert(err?.response?.data?.message || 'Gagal menghapus');
                        }
                }
        };

        return {
                state: { data, loading, modalOpen, isEditing, form },
                actions: { handleChange, openModal, setModalOpen, handleSubmit, handleDelete }
        };
};