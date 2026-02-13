import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Attendance() {
    const navigate = useNavigate();

    // --- STATE ---
    // Default langsung ke RFID
    const [activeTab, setActiveTab] = useState('rfid'); 
    const [rfidInput, setRfidInput] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [teachersList, setTeachersList] = useState([]);
    
    // UI State
    const [statusMessage, setStatusMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [clock, setClock] = useState(new Date());

    // Refs
    const inputRef = useRef(null);

    // 1. JAM DIGITAL
    useEffect(() => {
        const timer = setInterval(() => setClock(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // 2. LOAD DATA GURU (Untuk mode Manual)
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

    // 3. SUBMIT ATTENDANCE (RFID & Manual)
    const handleAttendanceSubmit = async (method, data) => {
        setLoading(true);
        setStatusMessage(null);

        // Payload hanya method dan data identifikasi (tanpa foto)
        const payload = {
            method: method,
            ...data
        };

        try {
            const response = await api.post('/attendance', payload);
            
            setStatusMessage({ 
                type: response.data.success ? 'success' : 'warning', 
                text: response.data.message 
            });

        } catch (error) {
            console.error("Attendance error:", error);
            const msg = error.response?.data?.message || "Gagal memproses absensi.";
            setStatusMessage({ type: 'error', text: msg });
        } finally {
            setLoading(false);
            setRfidInput('');
            setSelectedTeacher('');
            
            // Clear pesan setelah 4 detik
            setTimeout(() => {
                setStatusMessage(null);
            }, 4000);
        }
    };

    // Handler Manual Submit
    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (!selectedTeacher) return alert("Pilih guru dulu!");
        
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    handleAttendanceSubmit('manual', { 
                        teacher_id: selectedTeacher,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    setLoading(false);
                    alert("Gagal ambil lokasi GPS. Pastikan izin lokasi aktif.");
                }
            );
        } else {
            alert("Browser tidak support GPS.");
        }
    };

    // Handler RFID Submit
    const handleRfidSubmit = (e) => {
        e.preventDefault();
        if (!rfidInput.trim()) return;
        handleAttendanceSubmit('rfid', { rfid_uid: rfidInput.trim() });
    };

    // Auto Focus RFID (Hanya jalan kalau di tab RFID)
    useEffect(() => {
        if (activeTab === 'rfid' && !loading) {
            const focusInterval = setInterval(() => inputRef.current?.focus(), 500);
            return () => clearInterval(focusInterval);
        }
    }, [activeTab, loading]);


    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
            
            {/* KIRI: Info Panel */}
            <div className="w-full lg:w-5/12 bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex flex-col items-center justify-center p-10 relative">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                <div className="relative z-10 text-center space-y-6">
                    <h2 className="text-3xl font-bold tracking-widest uppercase opacity-90">SMKN 1 Cianjur</h2>
                    
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                        <h1 className="text-7xl font-bold font-mono">
                            {clock.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </h1>
                        <p className="text-xl text-blue-100 mt-2 font-medium">
                            {clock.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>

                    <p className="opacity-70 text-sm">Sistem Absensi Terintegrasi v2.0</p>
                </div>
            </div>

            {/* KANAN: Interaksi */}
            <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-6 relative bg-white dark:bg-gray-900">
                
                <button onClick={() => navigate('/dashboard')} className="absolute top-6 right-6 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                    ← Dashboard
                </button>

                <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    
                    {/* Tabs (Hanya RFID dan Manual) */}
                    <div className="flex border-b border-gray-100 dark:border-gray-700">
                        {['rfid', 'manual'].map((tab) => (
                            <button 
                                key={tab}
                                onClick={() => { setActiveTab(tab); setStatusMessage(null); }}
                                className={`flex-1 py-4 font-semibold text-sm uppercase tracking-wide transition-colors ${
                                    activeTab === tab 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                {tab === 'rfid' ? 'Kartu RFID' : 'Absen Manual'}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="p-6 min-h-[400px] flex flex-col items-center justify-center relative">
                        
                        {/* Alert Message */}
                        {statusMessage && (
                            <div className={`absolute top-4 left-4 right-4 p-3 rounded-lg text-center z-50 shadow-lg animate-in slide-in-from-top-2 ${
                                statusMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 
                                statusMessage.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                                <p className="font-bold text-sm">{statusMessage.text}</p>
                            </div>
                        )}

                        {/* --- MODE RFID --- */}
                        {activeTab === 'rfid' && (
                            <div className="flex flex-col items-center w-full animate-in fade-in">
                                <div className="w-40 h-40 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                    <svg className="w-20 h-20 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2 dark:text-white">Tempelkan Kartu</h3>
                                <p className="text-gray-500 text-sm mb-6">Pastikan kursor aktif di input</p>
                                
                                <form onSubmit={handleRfidSubmit} className="w-full">
                                    <input 
                                        ref={inputRef}
                                        type="text" 
                                        value={rfidInput}
                                        onChange={(e) => setRfidInput(e.target.value)}
                                        autoFocus
                                        disabled={loading}
                                        className="w-full px-4 py-3 text-center border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white disabled:opacity-50"
                                        placeholder="Scan disini..."
                                    />
                                </form>
                            </div>
                        )}

                        {/* --- MODE MANUAL --- */}
                        {activeTab === 'manual' && (
                            <div className="w-full animate-in fade-in">
                                <div className="text-center mb-6">
                                    <h3 className="text-lg font-bold dark:text-white">Absensi Manual</h3>
                                    <p className="text-sm text-gray-500">Pilih nama & pastikan GPS aktif</p>
                                </div>
                                <form onSubmit={handleManualSubmit} className="flex flex-col gap-4">
                                    <select 
                                        value={selectedTeacher}
                                        onChange={(e) => setSelectedTeacher(e.target.value)}
                                        disabled={loading}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                                    >
                                        <option value="">-- Cari Nama Guru --</option>
                                        {teachersList.map(t => (
                                            <option key={t.id} value={t.id}>{t.name} {t.nip ? `(${t.nip})` : ''}</option>
                                        ))}
                                    </select>
                                    <button 
                                        type="submit" 
                                        disabled={loading || !selectedTeacher}
                                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Mengirim...' : 'Kirim Absensi'}
                                    </button>
                                </form>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}