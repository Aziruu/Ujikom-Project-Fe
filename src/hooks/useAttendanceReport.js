import { useState, useEffect } from 'react';
import api from '../api';

export const useAttendanceReport = () => {
        const [data, setData] = useState([]);
        const [loading, setLoading] = useState(true);

        // State Filter & Pagination
        const [search, setSearch] = useState('');
        const [dateFilter, setDateFilter] = useState('');
        const [pagination, setPagination] = useState({});

        const fetchData = async (url = '/attendance/history') => {
                setLoading(true);
                try {
                        const params = {};
                        if (search) params.search = search;
                        if (dateFilter) params.date = dateFilter;

                        const response = await api.get(url, { params });
                        setData(response.data.data.data);
                        setPagination(response.data.data);
                } catch (error) {
                        console.error("Gagal ambil log:", error);
                } finally {
                        setLoading(false);
                }
        };

        useEffect(() => {
                const timer = setTimeout(() => { fetchData(); }, 500);
                return () => clearTimeout(timer);
        }, [search, dateFilter]);

        const formatDate = (dateString) => {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                return new Date(dateString).toLocaleDateString('id-ID', options);
        };

        return {
                state: { data, loading, search, dateFilter, pagination },
                actions: { setSearch, setDateFilter, fetchData, formatDate }
        };
};