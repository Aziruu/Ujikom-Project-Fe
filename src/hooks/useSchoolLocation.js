import { useState, useEffect } from 'react';
import api from '../api';

export const useSchoolLocation = () => {
        const [data, setData] = useState([]);
        const [loading, setLoading] = useState(false);
        const [modalOpen, setModalOpen] = useState(false);
        const [isEditing, setIsEditing] = useState(false);

        // Titik default awal (Cianjur)
        const [form, setForm] = useState({
                id: null,
                name: '',
                latitude: '-6.827185',
                longitude: '107.138055',
                radius: 150
        });

        const fetchData = async () => {
                setLoading(true);
                try {
                        const res = await api.get('/school-locations');
                        setData(res.data.data);
                } catch (err) {
                        console.error(err);
                } finally {
                        setLoading(false);
                }
        };

        useEffect(() => { fetchData(); }, []);

        const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

        const openModal = (item = null) => {
                setIsEditing(!!item);
                if (item) {
                        setForm(item);
                } else {
                        setForm({ id: null, name: '', latitude: '-6.827185', longitude: '107.138055', radius: 150 });
                }
                setModalOpen(true);
        };

        const handleSubmit = async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                        if (isEditing) {
                                await api.put(`/school-locations/${form.id}`, form);
                        } else {
                                await api.post('/school-locations', form);
                        }
                        fetchData();
                        setModalOpen(false);
                } catch (err) {
                        alert('Gagal menyimpan lokasi.' + err);
                } finally {
                        setLoading(false);
                }
        };

        const handleDelete = async (id) => {
                if (confirm('Yakin ingin menghapus lokasi kampus ini? Absensi di area ini akan berhenti berfungsi!')) {
                        try {
                                await api.delete(`/school-locations/${id}`);
                                fetchData();
                        } catch (err) {
                                alert('Gagal menghapus.' + err);
                        }
                }
        };

        return {
                state: { data, loading, modalOpen, isEditing, form },
                actions: { handleChange, openModal, setModalOpen, handleSubmit, handleDelete, setForm }
        };
};