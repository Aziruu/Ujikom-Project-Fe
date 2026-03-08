import { useState, useEffect, useRef } from 'react';
import api from '../api';

export const useAttendance = () => {
        const [clock, setClock] = useState(new Date());
        const [activeTab, setActiveTab] = useState('rfid'); // 'rfid' atau 'manual'
        const [statusMessage, setStatusMessage] = useState(null);
        const [loading, setLoading] = useState(false);

        const [rfidInput, setRfidInput] = useState('');
        const inputRef = useRef(null);

        // --- STATE UNTUK TABEL GURU (MANUAL) ---
        const [teachers, setTeachers] = useState([]);
        const [search, setSearch] = useState('');
        const [page, setPage] = useState(1);
        const [totalPages, setTotalPages] = useState(1);

        // Update Jam Realtime
        useEffect(() => {
                const timer = setInterval(() => setClock(new Date()), 1000);
                return () => clearInterval(timer);
        }, []);

        // Fokus input RFID kalau di tab RFID
        useEffect(() => {
                if (activeTab === 'rfid' && inputRef.current) {
                        inputRef.current.focus();
                }
        }, [activeTab]);

        // Fetch Data Guru untuk Tabel Manual (dengan Debounce)
        useEffect(() => {
                const fetchTeachers = async () => {
                        setLoading(true);
                        try {
                                // Ambil 5 atau 10 data per halaman biar rapi di layar Kiosk
                                const res = await api.get(`/teachers?search=${search}&page=${page}&per_page=5`);
                                setTeachers(res.data.data);
                                setTotalPages(res.data.meta ? res.data.meta.last_page : res.data.last_page);
                        } catch (err) {
                                console.error("Gagal load guru:", err);
                        } finally {
                                setLoading(false);
                        }
                };

                const timer = setTimeout(() => fetchTeachers(), 500);
                return () => clearTimeout(timer);
        }, [search, page]);

        // Fungsi Submit RFID
        const handleRfidSubmit = async (e) => {
                e.preventDefault();
                if (!rfidInput) return;

                setLoading(true);
                setStatusMessage(null);
                try {
                        const res = await api.post('/attendance', {
                                method: 'rfid',
                                rfid_uid: rfidInput
                        });
                        setStatusMessage({ type: 'success', text: res.data.message });
                } catch (err) {
                        setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Gagal absen RFID' });
                } finally {
                        setRfidInput('');
                        setLoading(false);
                        setTimeout(() => setStatusMessage(null), 5000);
                        if (inputRef.current) inputRef.current.focus();
                }
        };

        // Fungsi Submit Manual (Langsung klik tombol dari tabel)
        const handleManualAbsen = async (teacherId) => {
                if (!confirm('Yakin ingin melakukan absensi?')) return;

                setLoading(true);
                setStatusMessage(null);

                // Ambil GPS
                if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                                async (pos) => {
                                        try {
                                                const res = await api.post('/attendance', {
                                                        method: 'manual',
                                                        teacher_id: teacherId,
                                                        latitude: pos.coords.latitude.toString(),
                                                        longitude: pos.coords.longitude.toString()
                                                });
                                                setStatusMessage({ type: 'success', text: res.data.message });
                                        } catch (err) {
                                                setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Gagal absen manual' });
                                        } finally {
                                                setLoading(false);
                                                setTimeout(() => setStatusMessage(null), 5000);
                                        }
                                },
                                (err) => {
                                        setStatusMessage({ type: 'error', text: 'Akses Lokasi (GPS) wajib diizinkan di browser ini!' + err });
                                        setLoading(false);
                                        setTimeout(() => setStatusMessage(null), 5000);
                                }
                        );
                } else {
                        setStatusMessage({ type: 'error', text: 'Browser tidak support GPS.' });
                        setLoading(false);
                }
        };

        return {
                state: { clock, activeTab, statusMessage, loading, rfidInput, teachers, search, page, totalPages },
                inputRef,
                actions: { setActiveTab, setStatusMessage, setRfidInput, handleRfidSubmit, handleManualAbsen, setSearch, setPage }
        };
};