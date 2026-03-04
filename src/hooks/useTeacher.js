import { useState, useEffect } from 'react';
import api from '../api';

export const useTeacher = () => {
        // --- STATE DATA ---
        const [data, setData] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');

        // --- STATE PAGINATION & SEARCH ---
        const [currentPage, setCurrentPage] = useState(1);
        const [totalPages, setTotalPages] = useState(1);
        const [totalData, setTotalData] = useState(0);
        const [searchTerm, setSearchTerm] = useState('');

        // --- STATE MODAL FORM ---
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [isEdit, setIsEdit] = useState(false);
        const [currentId, setCurrentId] = useState(null);
        const [formData, setFormData] = useState({ name: '', nip: '', email: '', jenis_kelamin: 'L' });

        // --- STATE MODAL RFID ---
        const [isRfidModalOpen, setIsRfidModalOpen] = useState(false);
        const [rfidData, setRfidData] = useState({ id: null, name: '', rfid_uid: '' });

        // --- FUNGSI FETCH DATA ---
        const fetchData = async (page = 1, search = '') => {
                setLoading(true);
                try {
                        const response = await api.get(`/teachers?page=${page}&search=${search}`);
                        const result = response.data;

                        setData(result.data);
                        // Laravel mereturn metadata pagination di dalam objek 'meta'
                        setCurrentPage(result.meta ? result.meta.current_page : result.current_page);
                        setTotalPages(result.meta ? result.meta.last_page : result.last_page);
                        setTotalData(result.meta ? result.meta.total : result.total);
                        setError('');
                } catch (err) {
                        console.error("Gagal ambil data:", err);
                        setError('Gagal memuat data guru.');
                } finally {
                        setLoading(false);
                }
        };

        // Auto-fetch dengan Debounce (nunggu 500ms setelah ngetik biar nggak spam API)
        useEffect(() => {
                const timer = setTimeout(() => {
                        fetchData(currentPage, searchTerm);
                }, 500);
                return () => clearTimeout(timer);
        }, [currentPage, searchTerm]);

        // --- HANDLERS ---
        const handleSearchChange = (e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
        };

        const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

        const openAddModal = () => {
                setIsEdit(false);
                setFormData({ name: '', nip: '', email: '', jenis_kelamin: 'L' });
                setIsModalOpen(true);
        };

        const openEditModal = (guru) => {
                setIsEdit(true);
                setCurrentId(guru.id);
                setFormData({ name: guru.name, nip: guru.nip || '', email: guru.email || '', jenis_kelamin: guru.jenis_kelamin });
                setIsModalOpen(true);
        };

        const handleSubmit = async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                        if (isEdit) {
                                await api.put(`/teachers/${currentId}`, formData);
                                alert("Data berhasil diupdate!");
                        } else {
                                await api.post('/teachers', formData);
                                alert("Guru baru berhasil ditambahkan!");
                        }
                        setIsModalOpen(false);
                        fetchData(currentPage, searchTerm);
                } catch (err) {
                        console.error(err);
                        alert("Gagal menyimpan data.");
                } finally {
                        setLoading(false);
                }
        };

        const handleDelete = async (id) => {
                if (window.confirm("Yakin mau menghapus guru ini?")) {
                        try {
                                await api.delete(`/teachers/${id}`);
                                fetchData(currentPage, searchTerm);
                        } catch (err) {
                                console.error(err);
                                alert("Gagal menghapus data.");
                        }
                }
        };

        const openRfidModal = (guru) => {
                setRfidData({ id: guru.id, name: guru.name, rfid_uid: guru.rfid_uid || '' });
                setIsRfidModalOpen(true);
        };

        const handleRfidSubmit = async (e) => {
                e.preventDefault();
                try {
                        await api.put(`/teachers/${rfidData.id}/rfid`, { rfid_uid: rfidData.rfid_uid });
                        alert(`RFID untuk ${rfidData.name} berhasil ditautkan!`);
                        setIsRfidModalOpen(false);
                        fetchData(currentPage, searchTerm);
                } catch (err) {
                        console.error(err);
                        alert("Gagal mendaftarkan RFID.");
                }
        };

        return {
                state: { data, loading, error, currentPage, totalPages, totalData, searchTerm, isModalOpen, isEdit, formData, isRfidModalOpen, rfidData },
                actions: { handleSearchChange, handleChange, openAddModal, openEditModal, handleSubmit, handleDelete, openRfidModal, handleRfidSubmit, setCurrentPage, setIsModalOpen, setIsRfidModalOpen, setRfidData }
        };
};