import { useState, useEffect, useRef } from 'react';
import api from '../api';
import PageMeta from "../components/common/PageMeta";

export default function Attendance() {
    const [method, setMethod] = useState('rfid');
    const [rfidInput, setRfidInput] = useState('');
    const [statusMessage, setStatusMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const inputRef = useRef(null);

    const focusInput = () => {
        if (inputRef.current) inputRef.current.focus();
    };

    useEffect(() => {
        focusInput();
    }, [statusMessage]);

    const handleScan = async (e) => {
        e.preventDefault();
        if (!rfidInput) return;

        setLoading(true);
        setStatusMessage(null);

        try {
            const response = await api.post('/attendance', {
                rfid_uid: rfidInput,
                method: method
            });

            if (response.data.success) {
                setStatusMessage({ type: 'success', text: response.data.message });
            } else {
                setStatusMessage({ type: 'warning', text: response.data.message });
            }

        } catch (error) {
            const msg = error.response?.data?.message || "Terjadi kesalahan sistem.";
            setStatusMessage({ type: 'error', text: msg });
        } finally {
            setLoading(false);
            setRfidInput('');
            focusInput();
        }
    };

    return (
        <>
            <PageMeta title="Absensi | Si-Hadir Admin" />

            {/* Wrapper Tengah */}
            <div className="flex flex-col items-center justify-center p-4 min-h-[500px]">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">⏰ Absensi Guru</h1>

                <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-white/[0.03]">

                    {/* 1. Pilih Metode */}
                    <div className="mb-6">
                        <label className="block text-gray-600 dark:text-gray-400 font-semibold mb-2">Metode Absensi:</label>
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-transparent py-3 px-5 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        >
                            <option value="rfid">📡 Kartu RFID</option>
                            <option value="manual">⌨️ Manual Input</option>
                        </select>
                    </div>

                    {/* 2. Visualisasi Input RFID */}
                    {method === 'rfid' && (
                        <div className="mb-6">
                            <div className={`p-8 border-4 border-dashed rounded-xl transition-colors flex flex-col items-center justify-center ${loading
                                    ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10'
                                    : 'border-brand-300 bg-brand-50 dark:bg-brand-500/5 dark:border-brand-500/30'
                                }`}>
                                <span className="text-6xl block mb-4">{loading ? '⏳' : '💳'}</span>
                                <p className="text-gray-600 dark:text-gray-300 font-medium text-center">
                                    {loading ? 'Sedang Memproses...' : 'Tempelkan Kartu pada Reader'}
                                </p>
                            </div>

                            {/* Input Tersembunyi */}
                            <form onSubmit={handleScan} className="mt-4 relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={rfidInput}
                                    onChange={(e) => setRfidInput(e.target.value)}
                                    onBlur={focusInput}
                                    autoFocus
                                    placeholder="UID Kartu..."
                                    className="w-full text-center border border-gray-300 p-2 rounded opacity-50 focus:opacity-100 transition focus:border-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                                />
                                <p className="text-xs text-center text-gray-400 mt-2">*Pastikan kursor aktif di sini</p>
                            </form>
                        </div>
                    )}

                    {/* 3. Pesan Status (Alert) */}
                    {statusMessage && (
                        <div className={`p-4 rounded-lg shadow-md animate-bounce border ${statusMessage.type === 'success' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' :
                                statusMessage.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20' :
                                    'bg-red-100 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                            }`}>
                            <h3 className="font-bold text-lg mb-1">
                                {statusMessage.type === 'success' ? 'Berhasil!' :
                                    statusMessage.type === 'warning' ? 'Info' : 'Gagal!'}
                            </h3>
                            <p>{statusMessage.text}</p>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}