import { useState, useEffect } from 'react';
import api from '../api';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const useAttendanceReport = () => {
        const [data, setData] = useState([]);
        const [loading, setLoading] = useState(true);
        const [exporting, setExporting] = useState(false);

        // State Filter & Pagination
        const [search, setSearch] = useState('');
        const [dateFilter, setDateFilter] = useState('');
        const [periodFilter, setPeriodFilter] = useState('');
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
        }, [search, dateFilter, periodFilter]);

        const formatDate = (dateString) => {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                return new Date(dateString).toLocaleDateString('id-ID', options);
        };

        // LOGIKA EXPORT (EXCEL & PDF)
        const handleExport = async (format) => {
                setExporting(true);
                try {
                        // Ambil SEMUA data (export=true) sesuai filter yang aktif
                        const params = { export: true };
                        if (search) params.search = search;
                        if (dateFilter) params.date = dateFilter;
                        if (periodFilter) params.period = periodFilter;

                        const response = await api.get('/attendance/history', { params });
                        const exportData = response.data.data;

                        if (exportData.length === 0) {
                                alert("Tidak ada data untuk diekspor pada rentang ini.");
                                return;
                        }

                        // Rapikan data untuk format tabel
                        const formattedData = exportData.map((item, index) => ({
                                'No': index + 1,
                                'Tanggal': item.date,
                                'Nama Guru': item.teacher?.name || '-',
                                'NIP': item.teacher?.nip || '-',
                                'Metode': item.method ? item.method.toUpperCase() : '-',
                                'Jam Masuk': item.check_in || '-',
                                'Jam Pulang': item.check_out || 'Belum Pulang',
                                'Status': item.status ? item.status.toUpperCase() : '-',
                                'Keterlambatan (Menit)': item.late_duration || 0
                        }));

                        const fileName = `Laporan_Absensi_${periodFilter || dateFilter || 'Semua'}`;

                        if (format === 'excel') {
                                const worksheet = XLSX.utils.json_to_sheet(formattedData);
                                const workbook = XLSX.utils.book_new();
                                XLSX.utils.book_append_sheet(workbook, worksheet, "Absensi");
                                XLSX.writeFile(workbook, `${fileName}.xlsx`);
                        }
                        else if (format === 'pdf') {
                                const doc = new jsPDF('landscape');

                                doc.text("Laporan Absensi Guru SMKN 1 Cianjur", 14, 15);
                                doc.setFontSize(10);
                                doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 22);

                                const tableColumn = ["No", "Tanggal", "Nama Guru", "NIP", "Metode", "Masuk", "Pulang", "Status", "Telat (m)"];
                                const tableRows = formattedData.map(obj => [
                                        obj['No'],
                                        obj['Tanggal'],
                                        obj['Nama Guru'],
                                        obj['NIP'],
                                        obj['Metode'],
                                        obj['Jam Masuk'],
                                        obj['Jam Pulang'],
                                        obj['Status'],
                                        obj['Telat (Menit)']
                                ]);

                                // Panggil autoTable untuk PDF
                                autoTable(doc, {
                                        head: [tableColumn],
                                        body: tableRows,
                                        startY: 28,
                                        theme: 'grid',
                                        styles: { fontSize: 8, cellPadding: 2 },
                                        headStyles: { fillColor: [37, 99, 235], textColor: 255 },
                                        alternateRowStyles: { fillColor: [249, 250, 251] }
                                });
                                doc.save(`${fileName}.pdf`);
                        }
                } catch (error) {
                        console.error("Gagal Export:", error);
                        alert("Terjadi kesalahan saat mengekspor data.");
                } finally {
                        setExporting(false);
                }
        };

        return {
                state: { data, loading, exporting, search, dateFilter, periodFilter, pagination },
                actions: { setSearch, setDateFilter, setPeriodFilter, fetchData, formatDate, handleExport }
        };
};