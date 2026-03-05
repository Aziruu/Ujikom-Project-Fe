import { useState, useEffect } from 'react';
import api from '../api';

export const useMajor = () => {
        // State Utama (Tabel Jurusan)
        const [data, setData] = useState([]);
        const [loading, setLoading] = useState(false);

        // State Pagination & Search
        const [currentPage, setCurrentPage] = useState(1);
        const [totalPages, setTotalPages] = useState(1);
        const [totalData, setTotalData] = useState(0);
        const [searchTerm, setSearchTerm] = useState('');

        // State Modal & Form
        const [modalOpen, setModalOpen] = useState(false);
        const [isEditing, setIsEditing] = useState(false);
        const [form, setForm] = useState({
                id: null,
                code: '',
                name: '',
                head_of_program_id: ''
        });

        // State Dropdown Guru (Kepala Jurusan)
        const [teachers, setTeachers] = useState([]);
        const [teacherSearch, setTeacherSearch] = useState('');

        // Pemanggilan Data Utama (Jurusan)
        const fetchMajors = async (page = 1, search = '') => {
                setLoading(true);
                try {
                        const response = await api.get(`/majors?page=${page}&search=${search}`);
                        const result = response.data;

                        setData(result.data);
                        setCurrentPage(result.meta ? result.meta.current_page : result.current_page);
                        setTotalPages(result.meta ? result.meta.last_page : result.last_page);
                        setTotalData(result.meta ? result.meta.total : result.total);
                } catch (error) {
                        console.error("Kesalahan saat memuat data jurusan:", error);
                } finally {
                        setLoading(false);
                }
        };

        useEffect(() => {
                const timer = setTimeout(() => {
                        fetchMajors(currentPage, searchTerm);
                }, 500);
                return () => clearTimeout(timer);
        }, [currentPage, searchTerm]);

        // Pemanggilan Data Guru untuk Dropdown
        useEffect(() => {
                const fetchTeachers = async () => {
                        try {
                                const response = await api.get(`/teachers?search=${teacherSearch}`);
                                setTeachers(response.data.data);
                        } catch (error) {
                                console.error("Kesalahan saat memuat data guru:", error);
                        }
                };

                const timer = setTimeout(() => fetchTeachers(), 500);
                return () => clearTimeout(timer);
        }, [teacherSearch]);

        // Pengendali Peristiwa (Handlers)
        const handleSearchChange = (e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
        };

        const handleChange = (e) => {
                setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        };

        const openModal = (item = null) => {
                setIsEditing(!!item);
                if (item) {
                        setForm({
                                id: item.id,
                                code: item.code,
                                name: item.name,
                                head_of_program_id: item.head_of_program_id || ''
                        });
                        setTeacherSearch('');
                } else {
                        setForm({ id: null, code: '', name: '', head_of_program_id: '' });
                        setTeacherSearch('');
                }
                setModalOpen(true);
        };

        const handleSubmit = async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                        if (isEditing) {
                                await api.put(`/majors/${form.id}`, form);
                        } else {
                                await api.post('/majors', form);
                        }
                        fetchMajors(currentPage, searchTerm);
                        setModalOpen(false);
                } catch (error) {
                        const errorMessage = error.response?.data?.message || error.message;
                        alert(`Gagal menyimpan data jurusan: ${errorMessage}`);
                } finally {
                        setLoading(false);
                }
        };

        const handleDelete = async (id) => {
                if (window.confirm('Apakah Anda yakin ingin menghapus data jurusan ini?')) {
                        try {
                                await api.delete(`/majors/${id}`);
                                fetchMajors(currentPage, searchTerm);
                        } catch (error) {
                                alert('Gagal menghapus data jurusan.' + error);
                        }
                }
        };

        return {
                state: { data, loading, modalOpen, isEditing, form, currentPage, totalPages, totalData, searchTerm, teachers, teacherSearch },
                actions: { handleSearchChange, handleChange, openModal, setModalOpen, handleSubmit, handleDelete, setCurrentPage, setTeacherSearch }
        };
};