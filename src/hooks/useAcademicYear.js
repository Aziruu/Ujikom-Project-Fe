import { useState, useEffect } from "react";
import api from "../api";

export const useAcademicYear = () => {
        const [data, setData] = useState([]);
        const [loading, setLoading] = useState([false]);
        const [modalOpen, setModalOpen] = useState([false]);
        const [isEditing, setIsEditing] = useState([false]);

        // State Form
        const [form, setForm] = useState({
                id: null,
                name: '',
                years: '',
                semester: 'ganjil',
                is_active: false
        });

        // Load Data
        const fetchData = async () => {
                setLoading(true);
                try {
                        const res = await api.get('/academic-years');
                        setData(res.data.data);
                } catch (err) {
                        console.error(err);
                        alert('Gagal ambil data tahun ajaran');
                } finally {
                        setLoading(false);
                }
        };

        useEffect(() => {
                fetchData();
        }, []);

        // Handle input form
        const handleChange = (e) => {
                const { name, value, type, checked } = e.target;
                setForm(prev => ({
                        ...prev,
                        [name]: type === 'checkbox' ? checked : value
                }));
        }

        // Buka Modal Tambah/Edit
        const openModal = (item = null) => {
                if (item) {
                        setIsEditing(true);
                        setForm({
                                id: item.id,
                                name: item.name,
                                years: item.years,
                                semester: item.semester,
                                is_active: Boolean(item.is_active)
                        });
                } else {
                        setIsEditing(false);
                        setForm({
                                id: null,
                                name: '',
                                years: '',
                                semester: 'ganjil',
                                is_active: false
                        });
                }
                setModalOpen(true);
        };

        // Submit Data
        const handleSubmit = async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                        if (isEditing) {
                                await api.put(`/academic-years/${form.id}`, form);
                        } else {
                                await api.post('/academic-years', form);
                        }
                        fetchData();
                        setModalOpen(false);
                } catch (err) {
                        console.error(err);
                        alert('Gagal menyimpan data');
                } finally {
                        setLoading(false);
                }
        };

        // Hapus Data
        const handleDelete = async (id) => {
                if (confirm('Yakin mau hapus tahun ajaran ini?')) {
                        try {
                                await api.delete(`/academic-years/${id}`);
                                fetchData();
                        } catch (err) {
                                console.error(err);
                                alert('Gagal menghapus');
                        }
                }
        };

        return {
        state: { data, loading, modalOpen, isEditing, form },
        actions: { handleChange, openModal, setModalOpen, handleSubmit, handleDelete }
    };
}