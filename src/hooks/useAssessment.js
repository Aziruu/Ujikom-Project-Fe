import { useState, useEffect } from 'react';
import api from '../api';

export const useAssessment = () => {
        const [teachers, setTeachers] = useState([]);
        const [categories, setCategories] = useState([]);
        const [isLoading, setIsLoading] = useState(false);

        // State untuk Modal Penilaian
        const [selectedTeacher, setSelectedTeacher] = useState(null);
         // Format: { category_id: score }
        const [ratings, setRatings] = useState({});
        const [generalNotes, setGeneralNotes] = useState('');

        useEffect(() => {
                fetchInitialData();
        }, []);

        const fetchInitialData = async () => {
                setIsLoading(true);
                try {
                        // Mengambil daftar guru dan kategori aktif secara bersamaan
                        const [teachersRes, categoriesRes] = await Promise.all([
                                api.get('/assessments'),
                                api.get('/assessment-categories')
                        ]);
                        setTeachers(teachersRes.data.data || []);
                        setCategories(categoriesRes.data.data || []);
                } catch (error) {
                        console.error("Gagal memuat data:", error);
                } finally {
                        setIsLoading(false);
                }
        };

        const openAssessmentModal = (teacher) => {
                setSelectedTeacher(teacher);
                setRatings({});
                setGeneralNotes('');
        };

        const closeAssessmentModal = () => {
                setSelectedTeacher(null);
        };

        // Logika Gamifikasi: Klik Bintang
        const handleRating = (categoryId, score) => {
                setRatings(prev => ({
                        ...prev,
                        [categoryId]: score
                }));
        };

        const handleSubmit = async (e) => {
                e.preventDefault();

                // Validasi minimum klik (apakah semua kategori sudah dinilai?)
                if (Object.keys(ratings).length < categories.length) {
                        alert("Mohon berikan penilaian (bintang) untuk seluruh indikator.");
                        return;
                }

                setIsLoading(true);
                try {
                        // Asumsi user penilai diambil dari localStorage
                        const user = JSON.parse(localStorage.getItem('user'));

                        const payload = {
                                evaluator_id: user.id,
                                evaluatee_id: selectedTeacher.id,
                                assessment_date: new Date().toISOString().split('T')[0],
                                period: "Bulan Ini", // Bisa disesuaikan dinamis
                                general_notes: generalNotes,
                                details: Object.keys(ratings).map(catId => ({
                                        category_id: parseInt(catId),
                                        score: ratings[catId]
                                }))
                        };

                        await api.post('/assessments', payload);

                        // Tandai guru sebagai sudah dinilai (manipulasi state lokal agar cepat)
                        setTeachers(prev => prev.map(t =>
                                t.id === selectedTeacher.id ? { ...t, is_assessed: true } : t
                        ));

                        closeAssessmentModal();
                } catch (error) {
                        console.error("Gagal menyimpan penilaian:", error);
                } finally {
                        setIsLoading(false);
                }
        };

        return {
                teachers,
                categories,
                isLoading,
                selectedTeacher,
                ratings,
                generalNotes,
                setGeneralNotes,
                openAssessmentModal,
                closeAssessmentModal,
                handleRating,
                handleSubmit
        };
};