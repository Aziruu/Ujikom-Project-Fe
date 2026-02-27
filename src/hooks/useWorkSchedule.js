import { useState, useEffect } from 'react';
import api from '../api';

export const useWorkSchedule = () => {
        const [data, setData] = useState([]);
        const [loading, setLoading] = useState(false);
        const [modalOpen, setModalOpen] = useState(false);

        const [form, setForm] = useState({
                id: null,
                day_name: '',
                start_time: '',
                end_time: '',
                late_tolerance: 15,
                is_holiday: false
        });

        const fetchData = async () => {
                setLoading(true);
                try {
                        const res = await api.get('/work-schedules');
                        setData(res.data.data);
                } catch (err) {
                        console.error("Gagal tarik jadwal kerja:", err);
                } finally {
                        setLoading(false);
                }
        };

        useEffect(() => { fetchData(); }, []);

        const handleChange = (e) => {
                const { name, value, type, checked } = e.target;
                setForm(prev => ({
                        ...prev,
                        [name]: type === 'checkbox' ? checked : value
                }));
        };

        const openModal = (item) => {
                setForm({
                        id: item.id,
                        day_name: item.day_name,
                        start_time: item.start_time,
                        end_time: item.end_time,
                        late_tolerance: item.late_tolerance,
                        is_holiday: Boolean(item.is_holiday)
                });
                setModalOpen(true);
        };

        const handleSubmit = async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                        await api.put(`/work-schedules/${form.id}`, form);
                        fetchData();
                        setModalOpen(false);
                } catch (err) {
                        alert('Gagal update jadwal. ' + err.message);
                } finally {
                        setLoading(false);
                }
        };

        return {
                state: { data, loading, modalOpen, form },
                actions: { handleChange, openModal, setModalOpen, handleSubmit }
        };
};