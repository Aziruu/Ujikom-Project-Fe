import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api';

export default function Attendance() {
    const [method, setMethod] = useState('rfid'); // Default RFID
    const [rfidInput, setRfidInput] = useState('');
    const [statusMessage, setStatusMessage] = useState(null); // Pesan sukses/gagal
    const [loading, setLoading] = useState(false);
    
    // Ref biar input selalu fokus (jadi gak perlu klik kolom input terus)
    const inputRef = useRef(null);

    // Fungsi biar kursor balik ke input terus kalau lepas
    const focusInput = () => {
        if(inputRef.current) inputRef.current.focus();
    };

    useEffect(() => {
        focusInput();
    }, [statusMessage]); // Setiap ada pesan baru, fokus lagi

    // Handle Scan
    const handleScan = async (e) => {
        e.preventDefault();
        if (!rfidInput) return;

        setLoading(true);
        setStatusMessage(null);

        try {
            const response = await api.post('/attendance', {
                rfid_uid: rfidInput,
                method: method // Kirim 'rfid' sesuai pilihan enum
            });

            // Tampilkan respon dari backend
            if (response.data.success) {
                setStatusMessage({ type: 'success', text: response.data.message });
            } else {
                // Ini kalau dia sudah absen sebelumnya (sesuai logic controller tadi)
                setStatusMessage({ type: 'warning', text: response.data.message });
            }

        } catch (error) {
            // Kalau kartu tidak terdaftar atau error lain
            const msg = error.response?.data?.message || "Terjadi kesalahan sistem.";
            setStatusMessage({ type: 'error', text: msg });
        } finally {
            setLoading(false);
            setRfidInput(''); // Kosongkan input biar siap scan orang berikutnya
            focusInput();
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <div className="ml-64 flex-1 p-8 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">⏰ Absensi Guru</h1>

                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg text-center">
                    
                    {/* 1. Pilih Metode (Enum) */}
                    <div className="mb-6">
                        <label className="block text-gray-600 font-semibold mb-2">Metode Absensi:</label>
                        <select 
                            value={method} 
                            onChange={(e) => setMethod(e.target.value)}
                            className="w-full p-2 border rounded-lg text-center font-bold bg-gray-50"
                        >
                            <option value="rfid">📡 Kartu RFID</option>
                            <option value="manual">⌨️ Manual Input</option>
                            <option value="qrcode" disabled>📷 QR Code (Coming Soon)</option>
                            <option value="face" disabled>👤 Face ID (Coming Soon)</option>
                        </select>
                    </div>

                    {/* 2. Visualisasi Input RFID */}
                    {method === 'rfid' && (
                        <div className="mb-6">
                            <div className={`p-6 border-4 border-dashed rounded-xl transition-colors ${loading ? 'border-yellow-400 bg-yellow-50' : 'border-blue-300 bg-blue-50'}`}>
                                <span className="text-6xl block mb-2">{loading ? '⏳' : '💳'}</span>
                                <p className="text-gray-600 font-medium">
                                    {loading ? 'Sedang Memproses...' : 'Tempelkan Kartu pada Reader'}
                                </p>
                            </div>
                            
                            {/* Input Tersembunyi tapi Fokus */}
                            <form onSubmit={handleScan} className="mt-4">
                                <input 
                                    ref={inputRef}
                                    type="text" 
                                    value={rfidInput}
                                    onChange={(e) => setRfidInput(e.target.value)}
                                    onBlur={focusInput} // Kalau klik luar, paksa fokus balik
                                    autoFocus
                                    placeholder="UID Kartu akan muncul di sini..."
                                    className="w-full text-center border p-2 rounded opacity-50 focus:opacity-100 transition"
                                />
                                <p className="text-xs text-gray-400 mt-2">*Pastikan kursor aktif di kolom ini</p>
                            </form>
                        </div>
                    )}

                    {/* 3. Pesan Status (Alert) */}
                    {statusMessage && (
                        <div className={`p-4 rounded-lg shadow-md animate-bounce ${
                            statusMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
                            statusMessage.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                            'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                            <h3 className="font-bold text-lg">
                                {statusMessage.type === 'success' ? 'Berhasil!' : 
                                 statusMessage.type === 'warning' ? 'Info' : 'Gagal!'}
                            </h3>
                            <p>{statusMessage.text}</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}