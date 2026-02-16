import { useState, useEffect, useRef } from 'react';
import api from '../api';

export const useAttendance = () => {
        const [activeTab, setActiveTab] = useState('rfid');
        const [rfidInput, setRfidInput] = useState('');
        const [selectedTeacher, setSelectedTeacher] = useState('');
        const [teachersList, setTeachersList] = useState([]);
        const [statusMessage, setStatusMessage] = useState(null);
        const [loading, setLoading] = useState(false);
        const [clock, setClock] = useState(new Date());
        const inputRef = useRef(null);

        // Timer Jam
        useEffect(() => {
                const timer = setInterval(() => setClock(new Date()), 1000);
                return () => clearInterval(timer);
        }, []);

        // Load Data Guru
        useEffect(() => {
                const fetchTeachers = async () => {
                        try {
                                const res = await api.get('/teachers?per_page=100');
                                setTeachersList(res.data.data);
                        } catch (err) {
                                console.error("Gagal load data guru:", err);
                        }
                };
                fetchTeachers();
        }, []);

        // Auto Focus RFID
        useEffect(() => {
                if (activeTab === 'rfid' && !loading) {
                        const focusInterval = setInterval(() => inputRef.current?.focus(), 500);
                        return () => clearInterval(focusInterval);
                }
        }, [activeTab, loading]);

        const handleAttendanceSubmit = async (method, data) => {
                setLoading(true);
                setStatusMessage(null);
                try {
                        const response = await api.post('/attendance', { method, ...data });
                        setStatusMessage({
                                type: response.data.success ? 'success' : 'warning',
                                text: response.data.message
                        });
                } catch (error) {
                        const msg = error.response?.data?.message || "Gagal memproses absensi.";
                        setStatusMessage({ type: 'error', text: msg });
                } finally {
                        setLoading(false);
                        setRfidInput('');
                        setSelectedTeacher('');
                        setTimeout(() => setStatusMessage(null), 4000);
                }
        };

        const handleManualSubmit = (e) => {
                e.preventDefault();
                if (!selectedTeacher) return alert("Pilih guru dulu!");
                if (!navigator.geolocation) return alert("Browser tidak support GPS.");

                setLoading(true);
                navigator.geolocation.getCurrentPosition(
                        (pos) => handleAttendanceSubmit('manual', {
                                teacher_id: selectedTeacher,
                                latitude: pos.coords.latitude,
                                longitude: pos.coords.longitude
                        }),
                        () => { setLoading(false); alert("Gagal ambil lokasi GPS."); }
                );
        };

        const handleRfidSubmit = (e) => {
                e.preventDefault();
                if (rfidInput.trim()) handleAttendanceSubmit('rfid', { rfid_uid: rfidInput.trim() });
        };

        return {
                state: { activeTab, rfidInput, selectedTeacher, teachersList, statusMessage, loading, clock },
                refs: { inputRef },
                actions: { setActiveTab, setRfidInput, setSelectedTeacher, handleManualSubmit, handleRfidSubmit, setStatusMessage }
        };
};