import { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import api from '../api';

export default function EnrollFace({ teacherId, onClose, onSuccess }) {
    const videoRef = useRef();
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState("Memuat Model AI...");

    // 1. Definisikan startVideo DULUAN (supaya bisa dipanggil di useEffect)
    const startVideo = () => {
        setStatus("Mencari Wajah...");
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setStatus("Gagal akses kamera");
            });
    };

    // 2. Load Model & Panggil startVideo
    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models';
            try {
                console.log("🔍 Checking faceapi:", faceapi); // Debug: cek faceapi ke-load ga
                console.log("🔍 Checking nets:", faceapi.nets); // Debug: cek nets ada ga

                setStatus("Loading SSD MobileNet...");
                await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
                console.log("✅ SSD MobileNet loaded");

                setStatus("Loading Face Landmark...");
                await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
                console.log("✅ Face Landmark loaded");

                setStatus("Loading Face Recognition...");
                await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
                console.log("✅ Face Recognition loaded");

                startVideo();
            } catch (err) {
                console.error("❌ Error detail:", err);
                setStatus("Gagal memuat AI: " + err.message);
            }
        };
        loadModels();
    }, []);

    // 3. Scan Wajah & Simpan
// 3. Scan Wajah & Simpan
    const handleScan = async () => {
        if (!videoRef.current) return;
        setStatus("Menganalisa...");
        
        try {
            // A. Deteksi Wajah
            const detection = await faceapi.detectSingleFace(videoRef.current)
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (detection) {
                // B. Ambil Descriptor
                const descriptor = JSON.stringify(Object.values(detection.descriptor));
                
                // C. AMBIL FOTO (Screenshot dari Video) - INI TAMBAHANNYA
                const canvas = document.createElement('canvas');
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                const ctx = canvas.getContext('2d');
                
                // Gambar video ke canvas (bikin mirror/terbalik dulu biar sesuai preview)
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                
                // Dapatkan Base64 String
                const photoBase64 = canvas.toDataURL('image/jpeg');

                // D. Kirim ke Backend (Descriptor + Photo)
                await api.put(`/teachers/${teacherId}/face`, { 
                    face_descriptor: descriptor,
                    photo: photoBase64 
                });

                alert("Wajah & Foto Berhasil Disimpan!");
                if(onSuccess) onSuccess();
                if(onClose) onClose();
            } else {
                alert("Wajah tidak terdeteksi! Pastikan pencahayaan cukup.");
                setStatus("Coba Lagi");
            }
        } catch (err) {
            console.error(err);
            alert("Gagal menyimpan ke database.");
            setStatus("Error");
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-64 h-64 bg-black rounded-lg overflow-hidden border-2 border-blue-500">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]"
                />
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xs bg-black/50">
                        {status}
                    </div>
                )}
            </div>

            <p className="text-sm text-gray-500 text-center max-w-xs">
                Pastikan wajah terlihat jelas dan pencahayaan cukup terang.
            </p>

            <div className="flex gap-2 w-full justify-center">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-300 transition"
                >
                    Batal
                </button>
                <button
                    onClick={handleScan}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    Ambil Wajah
                </button>
            </div>
        </div>
    );
}