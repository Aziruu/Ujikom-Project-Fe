import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Attendance() {
    const navigate = useNavigate();

    // State
    const [activeTab, setActiveTab] = useState('rfid'); // 'rfid' atau 'manual'
    const [rfidInput, setRfidInput] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [teachersList, setTeachersList] = useState([]);
    
    // UI State
    const [statusMessage, setStatusMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [clock, setClock] = useState(new Date());

    const inputRef = useRef(null);

    // 1. Jam Digital Realtime
    useEffect(() => {
        const timer = setInterval(() => setClock(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // 2. Load Data Guru (Untuk Manual)
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const res = await api.get('/teachers');
                setTeachersList(res.data.data);
            } catch (err) {
                console.error("Gagal load guru", err);
            }
        };
        fetchTeachers();
    }, []);

    // 3. Auto Focus Input RFID
    useEffect(() => {
        if (activeTab === 'rfid' && !loading) {
            const focusInterval = setInterval(() => inputRef.current?.focus(), 500);
            return () => clearInterval(focusInterval);
        }
    }, [activeTab, loading]);

    // 4. Handle Submit
    const handleSubmit = async (e) => {
        if(e) e.preventDefault();
        
        // Validasi Frontend Sederhana
        if (activeTab === 'rfid' && !rfidInput) return;
        if (activeTab === 'manual' && !selectedTeacher) {
            setStatusMessage({ type: 'error', text: "Silakan pilih nama guru terlebih dahulu." });
            return;
        }

        setLoading(true);
        setStatusMessage(null);

        // Bikin Payload (Data yang dikirim ke backend)
        const payload = { method: activeTab };
        
        if (activeTab === 'rfid') {
            payload.rfid_uid = rfidInput;
        } else {
            payload.teacher_id = selectedTeacher; // Backend butuh ini kalau manual
        }

        try {
            const response = await api.post('/attendance', payload);
            
            if (response.data.success) {
                setStatusMessage({ type: 'success', text: response.data.message });
            } else {
                setStatusMessage({ type: 'warning', text: response.data.message });
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Gagal memproses absensi.";
            setStatusMessage({ type: 'error', text: msg });
        } finally {
            setLoading(false);
            setRfidInput(''); 
            setSelectedTeacher('');
            // Hilangkan pesan setelah 4 detik
            setTimeout(() => setStatusMessage(null), 4000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col items-center justify-center p-6 relative transition-colors duration-300">
            
            {/* Tombol Kembali ke Dashboard */}
            <button 
                onClick={() => navigate('/dashboard')}
                className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm font-medium"
            >
                {/* SVG Icon: Arrow Left */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
                </svg>
                Dashboard
            </button>

            {/* Jam Besar */}
            <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-3 mb-2">
                     {/* SVG Icon: Clock */}
                    <svg className="text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {clock.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </h1>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                    {clock.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
            </div>

            {/* Container Card */}
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                
                {/* Header Tab */}
                <div className="flex border-b border-gray-100 dark:border-gray-700">
                    <button 
                        onClick={() => { setActiveTab('rfid'); setStatusMessage(null); }}
                        className={`flex-1 py-4 flex items-center justify-center gap-2 font-semibold transition-all ${
                            activeTab === 'rfid' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-400'
                        }`}
                    >
                         {/* SVG Icon: Scan */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                            <rect x="7" y="7" width="10" height="10" rx="1"/>
                        </svg>
                        Scan Kartu
                    </button>
                    <button 
                        onClick={() => { setActiveTab('manual'); setStatusMessage(null); }}
                        className={`flex-1 py-4 flex items-center justify-center gap-2 font-semibold transition-all ${
                            activeTab === 'manual' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-400'
                        }`}
                    >
                        {/* SVG Icon: Keyboard */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="20" height="16" x="2" y="4" rx="2" ry="2"/><path d="M6 8h.001"/><path d="M10 8h.001"/><path d="M14 8h.001"/><path d="M18 8h.001"/><path d="M6 12h.001"/><path d="M10 12h.001"/><path d="M14 12h.001"/><path d="M18 12h.001"/><path d="M7 16h10"/>
                        </svg>
                        Manual
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-8 min-h-[320px] flex flex-col justify-center relative">
                    
                    {/* Pesan Alert (Toast) */}
                    {statusMessage && (
                        <div className={`absolute top-4 left-4 right-4 p-4 rounded-xl flex items-start gap-3 shadow-lg z-20 ${
                            statusMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800' :
                            statusMessage.type === 'warning' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800' :
                            'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800'
                        }`}>
                            <div>
                                <h4 className="font-bold text-sm">
                                    {statusMessage.type === 'success' ? 'Berhasil' : 
                                     statusMessage.type === 'warning' ? 'Informasi' : 'Gagal'}
                                </h4>
                                <p className="text-sm opacity-90 mt-1">{statusMessage.text}</p>
                            </div>
                        </div>
                    )}

                    {/* --- MODE 1: RFID --- */}
                    {activeTab === 'rfid' && (
                        <div className="flex flex-col items-center animate-in fade-in duration-300">
                            <div className={`w-40 h-40 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
                                loading 
                                ? 'bg-blue-50 dark:bg-blue-900/20 ring-4 ring-blue-100 dark:ring-blue-800' 
                                : 'bg-gray-50 dark:bg-gray-700/50'
                            }`}>
                                {/* Icon Kartu Besar */}
                                <svg className={`text-blue-600 dark:text-blue-400 ${loading ? 'animate-pulse' : ''}`} xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 10h2"/><path d="M16 14h2"/><path d="M6.17 15a3 3 0 0 1 5.66 0"/><circle cx="9" cy="9" r="2"/><rect x="2" y="5" width="20" height="14" rx="2"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2 dark:text-white">Tempelkan Kartu</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                                Dekatkan kartu pada reader untuk absen
                            </p>
                            
                            {/* Input Hidden buat nangkep RFID */}
                            <form onSubmit={handleSubmit}>
                                <input 
                                    ref={inputRef} 
                                    type="text" 
                                    value={rfidInput} 
                                    onChange={(e) => setRfidInput(e.target.value)} 
                                    autoFocus 
                                    autoComplete="off"
                                    className="opacity-0 w-0 h-0 absolute" 
                                />
                            </form>
                        </div>
                    )}

                    {/* --- MODE 2: MANUAL --- */}
                    {activeTab === 'manual' && (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 animate-in fade-in duration-300">
                            <div className="text-center mb-2">
                                <h3 className="text-lg font-bold dark:text-white">Absensi Manual</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Pilih nama guru dari daftar</p>
                            </div>

                            <div className="relative">
                                <select 
                                    value={selectedTeacher}
                                    onChange={(e) => setSelectedTeacher(e.target.value)}
                                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition"
                                >
                                    <option value="">-- Pilih Nama Guru --</option>
                                    {teachersList.map((guru) => (
                                        <option key={guru.id} value={guru.id}>
                                            {guru.name} {guru.nip ? `(${guru.nip})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading || !selectedTeacher}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                            >
                                {loading ? 'Memproses...' : 'Kirim Absensi'}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <div className="mt-8 text-xs text-gray-400 font-medium">
                Sistem Absensi v1.0
            </div>
        </div>
    );
}