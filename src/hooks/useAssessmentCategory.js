import { useState, useEffect } from 'react';
import api from '../api';

export const useAssessmentCategory = () => {
        const [categories, setCategories] = useState([]);
        const [isLoading, setIsLoading] = useState(false);

        // State untuk Modal
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [editingId, setEditingId] = useState(null);
        const [formData, setFormData] = useState({
                name: '',
                description: '',
                type: 'Teacher',
                is_active: true
        });

        const fetchCategories = async () => {
                setIsLoading(true);
                try {
                        const response = await api.get('/assessment-categories');
                        setCategories(response.data.data || []);
                } catch (error) {
                        console.error("Gagal mengambil data indikator:", error);
                } finally {
                        setIsLoading(false);
                }
        };

        useEffect(() => {
                fetchCategories();
        }, []);

        const openModal = (category = null) => {
                if (category) {
                        setEditingId(category.id);
                        setFormData({
                                name: category.name,
                                description: category.description || '',
                                type: category.type,
                                is_active: category.is_active
                        });
                } else {
                        setEditingId(null);
                        setFormData({ name: '', description: '', type: 'Teacher', is_active: true });
                }
                setIsModalOpen(true);
        };

        const closeModal = () => {
                setIsModalOpen(false);
                setEditingId(null);
        };

        const handleInputChange = (e) => {
                const { name, value, type, checked } = e.target;
                setFormData(prev => ({
                        ...prev,
                        [name]: type === 'checkbox' ? checked : value
                }));
        };

        const handleSubmit = async (e) => {
                e.preventDefault();
                setIsLoading(true);
                try {
                        if (editingId) {
                                await api.put(`/assessment-categories/${editingId}`, formData);
                        } else {
                                await api.post('/assessment-categories', formData);
                        }
                        closeModal();
                        fetchCategories(); // Refresh data setelah simpan
                } catch (error) {
                        console.error("Gagal menyimpan indikator:", error);
                } finally {
                        setIsLoading(false);
                }
        };

        // Fungsi cepat untuk tombol Nonaktifkan/Aktifkan (Minimum Clicks)
        const handleToggleActive = async (id, currentStatus) => {
                try {
                        await api.put(`/assessment-categories/${id}`, { is_active: !currentStatus });
                        fetchCategories();
                } catch (error) {
                        console.error("Gagal mengubah status indikator:", error);
                }
        };

        return {
                categories,
                isLoading,
                isModalOpen,
                formData,
                editingId,
                openModal,
                closeModal,
                handleInputChange,
                handleSubmit,
                handleToggleActive
        };
};