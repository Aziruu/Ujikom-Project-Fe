import { useState, useEffect } from 'react';
import api from '../api';

export const useTicket = () => {
        // --- STATE DATA TIKET ---
        const [tickets, setTickets] = useState([]);
        const [ticketDetail, setTicketDetail] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');

        // --- STATE PAGINATION & SEARCH ---
        const [currentPage, setCurrentPage] = useState(1);
        const [totalPages, setTotalPages] = useState(1);
        const [searchTerm, setSearchTerm] = useState('');

        // --- STATE FORM TIKET & ANTI-DUPLIKASI ---
        const [formData, setFormData] = useState({ subject: '', description: '', category: 'Jaringan', priority: 'Low' });
        const [similarTickets, setSimilarTickets] = useState([]); // Untuk menyimpan hasil pencarian duplikat
        const [isDuplicateChecking, setIsDuplicateChecking] = useState(false);

        // --- STATE BALASAN & RATING ---
        const [replyMessage, setReplyMessage] = useState('');
        const [suggestions, setSuggestions] = useState([]);

        // ==========================================
        // 1. FUNGSI FETCH DAFTAR TIKET
        // ==========================================
        const fetchTickets = async (page = 1, search = '') => {
                setLoading(true);
                try {
                        const response = await api.get(`/tickets?page=${page}&search=${search}`);
                        const result = response.data.data; // Menyesuaikan response Laravel pagination

                        setTickets(result.data);
                        setCurrentPage(result.current_page);
                        setTotalPages(result.last_page);
                        setError('');
                } catch (err) {
                        console.error("Gagal ambil tiket:", err);
                        setError('Gagal memuat daftar tiket.');
                } finally {
                        setLoading(false);
                }
        };

        // Auto-fetch dengan Debounce untuk List Tiket
        useEffect(() => {
                const timer = setTimeout(() => {
                        fetchTickets(currentPage, searchTerm);
                }, 500);
                return () => clearTimeout(timer);
        }, [currentPage, searchTerm]);


        // ==========================================
        // 2. FUNGSI ANTI-DUPLIKASI (DOUBLE SOLVING PREVENTION)
        // ==========================================
        // Panggil fungsi ini saat user mengetik di input 'subject' atau 'description'
        const checkDuplicate = async (keyword) => {
                if (keyword.length < 3) {
                        setSimilarTickets([]);
                        return;
                }
                setIsDuplicateChecking(true);
                try {
                        const response = await api.get(`/tickets/check-duplicate?keyword=${keyword}`);
                        setSimilarTickets(response.data.data);
                } catch (err) {
                        console.error("Gagal cek duplikasi", err);
                } finally {
                        setIsDuplicateChecking(false);
                }
        };


        // ==========================================
        // 3. FUNGSI OPERASIONAL TIKET (CRUD & ACTIONS)
        // ==========================================
        const handleFormChange = (e) => {
                const { name, value } = e.target;
                setFormData({ ...formData, [name]: value });

                // Memicu pengecekan duplikat jika mengetik di subject/description
                if (name === 'subject' || name === 'description') {
                        checkDuplicate(value);
                }
        };

        const submitTicket = async (reporterId) => {
                setLoading(true);
                try {
                        await api.post('/tickets', { ...formData, reporter_id: reporterId });
                        alert("Tiket berhasil dibuat!");
                        setFormData({ subject: '', description: '', category: 'Jaringan', priority: 'Low' });
                        fetchTickets(1, '');
                } catch (err) {
                        console.error(err);
                        alert("Gagal membuat tiket.");
                } finally {
                        setLoading(false);
                }
        };

        const fetchDetail = async (id) => {
                setLoading(true);
                try {
                        const response = await api.get(`/tickets/${id}`);
                        setTicketDetail(response.data.data);
                } catch (err) {
                        console.error(err);
                        setError('Gagal memuat detail tiket.');
                } finally {
                        setLoading(false);
                }
        };

        const fetchSuggestions = async (id) => {
                try {
                        const response = await api.get(`/tickets/${id}/suggestions`);
                        setSuggestions(response.data.data);
                } catch (err) {
                        console.error("Gagal memuat saran jawaban", err);
                }
        };

        const sendReply = async (ticketId, responderId, responderType, statusUpdate = null) => {
                // Cegah pengiriman jika pesan dan status sama-sama kosong
                if (!replyMessage && !statusUpdate) return;

                try {
                        // Buat payload dasar untuk balasan chat
                        const payload = {
                                responder_id: responderId,
                                responder_type: responderType,
                                message: replyMessage,
                        };

                        // Hanya masukkan status_update ke payload jika nilainya bukan null
                        if (statusUpdate) {
                                payload.status_update = statusUpdate;
                        }

                        await api.post(`/tickets/${ticketId}/responses`, payload);

                        setReplyMessage(''); // Kosongkan input form
                        fetchDetail(ticketId); // Refresh halaman detail
                } catch (err) {
                        console.error("Error Detail:", err.response?.data || err.message);
                        alert("Gagal mengirim balasan.");
                }
        };

        const submitRating = async (ticketId, score, feedback) => {
                try {
                        await api.post(`/tickets/${ticketId}/ratings`, { score, feedback });
                        alert("Terima kasih atas penilaian Anda!");
                        fetchDetail(ticketId); // Refresh detail untuk memunculkan rating
                } catch (err) {
                        console.error(err);
                        alert("Gagal mengirim penilaian.");
                }
        };

        return {
                state: {
                        tickets, ticketDetail, loading, error, currentPage, totalPages, searchTerm,
                        formData, similarTickets, isDuplicateChecking, replyMessage, suggestions
                },
                actions: {
                        setSearchTerm, setCurrentPage, handleFormChange, submitTicket, fetchDetail,
                        setReplyMessage, sendReply, fetchSuggestions, submitRating, setFormData
                }
        };
};