import { useState, useEffect } from 'react';
import api from '../api';
import { BASE_URL } from '../api';

export const useLeaveRequest = () => {
        const [data, setData] = useState([]);
        const [loading, setLoading] = useState(true);
        const [filterStatus, setFilterStatus] = useState('pending');
        const [filterDate, setFilterDate] = useState('');
        const [processingId, setProcessingId] = useState(null);

        const fetchData = async () => {
                setLoading(true);
                try {
                        const params = {};
                        if (filterStatus !== 'all') params.status = filterStatus;
                        if (filterDate) params.date = filterDate;

                        const response = await api.get('/leaves', { params });
                        const resData = response?.data?.data?.data || response?.data?.data || [];
                        setData(resData);
                } catch (error) {
                        console.error("Gagal ambil data cuti:", error);
                        setData([]);
                } finally {
                        setLoading(false);
                }
        };

        useEffect(() => {
                fetchData();
        }, [filterStatus, filterDate]);

        const handleVerify = async (id, status, name) => {
                const action = status === 'approved' ? 'menyetujui' : 'menolak';
                if (!window.confirm(`Yakin ingin ${action} pengajuan cuti ${name}?`)) return;

                setProcessingId(id);
                try {
                        await api.put(`/leaves/${id}/verify`, {
                                status,
                                admin_note: status === 'rejected' ? 'Ditolak Admin' : 'Disetujui Admin'
                        });
                        alert(`Berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}!`);
                        fetchData();
                } catch (error) {
                        console.error(error);
                        alert("Gagal memproses data.");
                } finally {
                        setProcessingId(null);
                }
        };

        const getFileUrl = (path) => {
                if (!path) return null;
                const cleanPath = path.replace(/^\//, '');
                return `${BASE_URL}/storage/${cleanPath}`;
        };

        return {
                state: { data, loading, filterStatus, filterDate, processingId },
                actions: { setFilterStatus, setFilterDate, fetchData, handleVerify, getFileUrl }
        };
};