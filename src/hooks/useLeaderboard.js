import { useState, useEffect, useCallback } from 'react';
import api from '../api';

export const useLeaderboard = () => {
        const [topTeachers, setTopTeachers] = useState([]);
        const [bottomTeachers, setBottomTeachers] = useState([]);
        const [loading, setLoading] = useState(false);
        const [page, setPage] = useState(1);

        // Untuk ngecek apakah masih ada data buat di-load
        const [hasMore, setHasMore] = useState({ top: true, bottom: true });

        const fetchLeaderboard = async (pageNumber) => {
                setLoading(true);
                try {
                        const res = await api.get(`/leaderboard?limit=10&page=${pageNumber}`);
                        const { top_disciplined, needs_improvement, has_more_top, has_more_bottom } = res.data.data;

                        // Gabungin data lama sama data baru (Infinite Scroll logic)
                        setTopTeachers(prev => pageNumber === 1 ? top_disciplined : [...prev, ...top_disciplined]);
                        setBottomTeachers(prev => pageNumber === 1 ? needs_improvement : [...prev, ...needs_improvement]);

                        setHasMore({ top: has_more_top, bottom: has_more_bottom });
                } catch (err) {
                        console.error('Yah, gagal memuat leaderboar...', err);
                } finally {
                        setLoading(false);
                }
        };

        useEffect(() => {
                fetchLeaderboard(page);
        }, [page]);

        // Fungsi buat dipanggil pas user nge-scroll sampai bawah
        const loadMore = useCallback(() => {
                if (!loading && (hasMore.top || hasMore.bottom)) {
                        setPage(prev => prev + 1);
                }
        }, [loading, hasMore]);

        return { state: { topTeachers, bottomTeachers, loading, hasMore }, loadMore };
};