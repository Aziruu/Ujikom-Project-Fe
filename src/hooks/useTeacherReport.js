import { useState, useEffect } from 'react';
import api from '../api';

export const useTeacherReport = (teacherId) => {
        const [radarData, setRadarData] = useState([]);
        const [historyData, setHistoryData] = useState([]);
        const [teachersList, setTeachersList] = useState([]); 
        const [isLoading, setIsLoading] = useState(false);

        // Effect untuk mengambil daftar guru (hanya dipanggil sekali saat komponen dimuat)
        useEffect(() => {
                fetchTeachersList();
        }, []);

        // Effect untuk mengambil rapor (dipanggil setiap kali teacherId di URL berubah)
        useEffect(() => {
                if (teacherId) {
                        fetchReportData(teacherId);
                } else {
                        setRadarData([]);
                        setHistoryData([]);
                }
        }, [teacherId]);

        const fetchTeachersList = async () => {
                try {
                        // Memanfaatkan endpoint yang sama dengan form penilaian
                        const response = await api.get('/assessments');
                        setTeachersList(response.data.data || []);
                } catch (error) {
                        console.error("Gagal memuat daftar guru:", error);
                }
        };

        const fetchReportData = async (id) => {
                setIsLoading(true);
                try {
                        const [radarRes, historyRes] = await Promise.all([
                                api.get(`/assessments/radar-chart/${id}`),
                                api.get(`/assessments/history/${id}`)
                        ]);

                        setRadarData(radarRes.data.data || []);
                        setHistoryData(historyRes.data.data || []);
                } catch (error) {
                        console.error("Gagal memuat data rapor:", error);
                } finally {
                        setIsLoading(false);
                }
        };

        return {
                radarData,
                historyData,
                teachersList,
                isLoading
        };
};