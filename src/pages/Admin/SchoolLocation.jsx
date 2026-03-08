import PageMeta from "../../components/common/PageMeta";
import { useSchoolLocation } from "../../hooks/useSchoolLocation";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix error icon default Leaflet di React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Komponen biar bisa dapet kordinat pas peta di-klik
const LocationPicker = ({ setForm }) => {
        useMapEvents({
                click(e) {
                        setForm(prev => ({
                                ...prev,
                                latitude: e.latlng.lat.toString(),
                                longitude: e.latlng.lng.toString()
                        }));
                },
        });
        return null;
};

export default function SchoolLocation() {
        const { state, actions } = useSchoolLocation();
        const { data, loading, modalOpen, isEditing, form } = state;

        // Kordinat aktif untuk nampilin Map
        const currentPosition = [parseFloat(form.latitude), parseFloat(form.longitude)];

        return (
                <div className="p-6">
                        <PageMeta title="Lokasi Kampus | Si-Hadir Admin" description="Pengaturan Radius & Lokasi Absensi" />

                        <div className="flex justify-between items-center mb-6">
                                <div>
                                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Lokasi Kampus (GPS)</h1>
                                        <p className="text-sm text-gray-500 mt-1">Atur titik kordinat dan radius maksimal untuk absensi manual.</p>
                                </div>
                                <button onClick={() => actions.openModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-md">
                                        + Tambah Lokasi
                                </button>
                        </div>

                        {/* TABEL DATA */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                                <div className="max-w-full overflow-x-auto">
                                        <Table>
                                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                                        <TableRow>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Nama Kampus</TableCell>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Titik Kordinat</TableCell>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Radius</TableCell>
                                                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-right text-theme-xs dark:text-gray-400">Aksi</TableCell>
                                                        </TableRow>
                                                </TableHeader>

                                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                                        {data.length === 0 ? (
                                                                <TableRow>
                                                                        <TableCell colSpan="4" className="text-center py-10 text-gray-500 text-theme-sm">Belum ada lokasi yang diatur.</TableCell>
                                                                </TableRow>
                                                        ) : (
                                                                data.map(item => (
                                                                        <TableRow key={item.id}>
                                                                                <TableCell className="px-5 py-4 font-bold text-blue-600 dark:text-blue-400">{item.name}</TableCell>
                                                                                <TableCell className="px-5 py-4 font-mono text-gray-500 dark:text-gray-400 text-xs">
                                                                                        {item.latitude},<br />{item.longitude}
                                                                                </TableCell>
                                                                                <TableCell className="px-5 py-4 font-medium text-gray-800 dark:text-white">
                                                                                        {item.radius} Meter
                                                                                </TableCell>
                                                                                <TableCell className="px-5 py-4 text-right space-x-3">
                                                                                        <button onClick={() => actions.openModal(item)} className="text-blue-600 font-medium text-theme-sm hover:underline">Edit Peta</button>
                                                                                        <button onClick={() => actions.handleDelete(item.id)} className="text-red-500 font-medium text-theme-sm hover:underline">Hapus</button>
                                                                                </TableCell>
                                                                        </TableRow>
                                                                ))
                                                        )}
                                                </TableBody>
                                        </Table>
                                </div>
                        </div>

                        {/* MODAL FORM & PETA */}
                        {modalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
                                        <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

                                                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                                        <h2 className="text-xl font-bold dark:text-white">{isEditing ? 'Edit Peta Lokasi' : 'Tambah Lokasi Baru'}</h2>
                                                        <button onClick={() => actions.setModalOpen(false)} className="text-gray-400 hover:text-red-500 text-2xl font-bold leading-none">&times;</button>
                                                </div>

                                                <div className="flex flex-col md:flex-row flex-1 overflow-y-auto">
                                                        {/* BAGIAN KIRI: Form Input */}
                                                        <form onSubmit={actions.handleSubmit} className="w-full md:w-1/3 p-6 border-r border-gray-100 dark:border-gray-700 space-y-4 flex flex-col">
                                                                <div>
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Nama Tempat (Cth: Kampus Utama)</label>
                                                                        <input type="text" name="name" value={form.name} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required />
                                                                </div>

                                                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50 space-y-3">
                                                                        <label className="block text-xs font-bold text-blue-800 dark:text-blue-300">Pengaturan Jangkauan</label>
                                                                        <div>
                                                                                <label className="block text-[10px] text-gray-500 mb-1">Radius Absen (Meter)</label>
                                                                                <input type="number" name="radius" min="10" value={form.radius} onChange={actions.handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required />
                                                                        </div>
                                                                        <p className="text-[10px] text-gray-400 italic">Tips: Klik area pada peta di sebelah untuk memindahkan titik secara otomatis.</p>
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-2 opacity-50 pointer-events-none">
                                                                        <div>
                                                                                <label className="block text-[10px] text-gray-500 mb-1">Latitude</label>
                                                                                <input type="text" value={form.latitude} readOnly className="w-full p-1.5 text-xs border rounded bg-gray-100 dark:bg-gray-900" />
                                                                        </div>
                                                                        <div>
                                                                                <label className="block text-[10px] text-gray-500 mb-1">Longitude</label>
                                                                                <input type="text" value={form.longitude} readOnly className="w-full p-1.5 text-xs border rounded bg-gray-100 dark:bg-gray-900" />
                                                                        </div>
                                                                </div>

                                                                <div className="mt-auto pt-6 flex flex-col gap-2">
                                                                        <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:opacity-50 transition shadow-md">
                                                                                {loading ? 'Menyimpan...' : 'Simpan Lokasi'}
                                                                        </button>
                                                                </div>
                                                        </form>

                                                        {/* BAGIAN KANAN: PETA (React Leaflet) */}
                                                        <div className="w-full md:w-2/3 h-64 md:h-auto relative z-0">
                                                                <MapContainer
                                                                        center={currentPosition}
                                                                        zoom={17}
                                                                        scrollWheelZoom={true}
                                                                        className="w-full h-full"
                                                                >
                                                                        <TileLayer
                                                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                                        />

                                                                        {/* Manggil Komponen Picker Kordinat */}
                                                                        <LocationPicker setForm={actions.setForm} />

                                                                        {/* Marker Titik Tengah */}
                                                                        <Marker position={currentPosition} />

                                                                        {/* Lingkaran Radius Merah */}
                                                                        <Circle
                                                                                center={currentPosition}
                                                                                pathOptions={{ fillColor: 'red', color: 'red' }}
                                                                                radius={parseInt(form.radius)}
                                                                        />
                                                                </MapContainer>
                                                        </div>
                                                </div>

                                        </div>
                                </div>
                        )}
                </div>
        );
}