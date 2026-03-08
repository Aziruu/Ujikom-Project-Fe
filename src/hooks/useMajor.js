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

        // --- STATE KHUSUS CUSTOM DROPDOWN GURU ---
        const [teachers, setTeachers] = useState([]);
        const [teacherSearch, setTeacherSearch] = useState('');
        const [isDropdownOpen, setIsDropdownOpen] = useState(false);
        const [loadingTeachers, setLoadingTeachers] = useState(false);
        const [teacherPage, setTeacherPage] = useState(1);
        const [teacherTotalPages, setTeacherTotalPages] = useState(1);

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

        // FETCH GURU UNTUK DROPDOWN (Bisa di-scroll)
        useEffect(() => {
                const fetchTeachersDropdown = async () => {
                        setLoadingTeachers(true);
                        try {
                                const res = await api.get(`/teachers?search=${teacherSearch}&page=${teacherPage}`);
                                if (teacherPage === 1) {
                                        setTeachers(res.data.data);
                                } else {
                                        setTeachers(prev => [...prev, ...res.data.data]);
                                }
                                setTeacherTotalPages(res.data.meta ? res.data.meta.last_page : res.data.last_page);
                        } catch (err) {
                                console.error("Gagal cari guru:", err);
                        } finally {
                                setLoadingTeachers(false);
                        }
                };

                const timer = setTimeout(() => fetchTeachersDropdown(), 500);
                return () => clearTimeout(timer);
        }, [teacherSearch, teacherPage]);

        const handleTeacherScroll = (e) => {
                const { scrollTop, clientHeight, scrollHeight } = e.target;
                const isBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 50;

                if (isBottom && !loadingTeachers) {
                        if (teacherPage < teacherTotalPages) {
                                setLoadingTeachers(true);
                                setTeacherPage(prev => prev + 1);
                        }
                }
        };

        const handleSearchTeacherInput = (val) => {
                setLoadingTeachers(true);
                setTeacherSearch(val);
                setTeacherPage(1);
                setIsDropdownOpen(true);
        };

        const selectTeacher = (id, name) => {
                setForm(prev => ({ ...prev, head_of_program_id: id }));
                setTeacherSearch(name);
                setIsDropdownOpen(false);
        };

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
                        setTeacherSearch(item.head_of_program?.name || '');
                } else {
                        setForm({ id: null, code: '', name: '', head_of_program_id: '' });
                        setTeacherSearch('');
                }
                setTeacherPage(1);
                setIsDropdownOpen(false);
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
                state: { data, loading, modalOpen, isEditing, form, currentPage, totalPages, totalData, searchTerm, teachers, teacherSearch, isDropdownOpen, loadingTeachers },
                actions: { handleSearchChange, handleChange, openModal, setModalOpen, handleSubmit, handleDelete, setCurrentPage, handleSearchTeacherInput, handleTeacherScroll, selectTeacher, setIsDropdownOpen }
        };
};