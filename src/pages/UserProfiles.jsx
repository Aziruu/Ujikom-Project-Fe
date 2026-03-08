import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";

export default function UserProfiles() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Ambil data user yang sedang login
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Biasanya endpoint default sanctum/passport untuk user yang login
        const response = await api.get('/user');
        // Sesuaikan kalau response.data kamu dibungkus objek lagi (misal response.data.data)
        setUser(response.data);
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
        // Kalau error (token mati/expired), langsung tendang ke login
        localStorage.removeItem('token');
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // Fungsi Logout
  const handleLogout = async () => {
    if (!window.confirm("Apakah Anda yakin ingin keluar dari sistem?")) return;

    try {
      // Panggil endpoint logout backend (kalau ada)
      await api.post('/logout');
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Hapus token dari browser
      localStorage.removeItem('token');
      // Hapus header authorization dari axios
      delete api.defaults.headers.common['Authorization'];
      // Arahkan ke halaman login
      navigate('/signin');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <span className="text-gray-500 font-medium animate-pulse">Memuat Profil...</span>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Profil Pengguna | Si-Hadir Admin"
        description="Halaman profil untuk Admin dan Operator"
      />
      <PageBreadcrumb pageTitle="Profil Saya" />

      <div className="max-w-4xl mx-auto font-sans">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

          {/* Cover Background */}
          <div className="h-32 md:h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            <div className="absolute inset-0 bg-white/10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.2 }}></div>
          </div>

          {/* Profil Info Info */}
          <div className="relative px-6 pb-8 md:px-10 md:pb-12">

            {/* Avatar & Action Button */}
            <div className="flex flex-col md:flex-row md:items-end justify-between -mt-12 md:-mt-16 mb-6">

              {/* Foto Profil Dinamis dari inisial nama */}
              <div className="relative inline-block">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.name}&background=random&color=fff&size=128&bold=true`}
                  alt="Profile"
                  className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white dark:border-gray-900 object-cover shadow-md bg-white"
                />
                <span className="absolute bottom-2 right-2 h-4 w-4 md:h-5 md:w-5 rounded-full border-2 border-white bg-green-500 dark:border-gray-900" title="Online"></span>
              </div>

              {/* Tombol Logout */}
              <div className="mt-4 md:mt-0 flex gap-3">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-500 px-6 py-2.5 font-bold transition-colors shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                  Keluar Sistem
                </button>
              </div>
            </div>

            {/* Detail Data */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  {user?.name}
                  {/* Badge Role Admin / Operator */}
                  <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider translate-y-0.5
                    ${user?.role === 'admin'
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'}`}
                  >
                    {user?.role}
                  </span>
                </h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Mengelola sistem kehadiran sekolah</p>
              </div>

              {/* Kotak Informasi Personal */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/50">
                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Informasi Akun</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Nama Lengkap</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-lg">{user?.name}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Alamat Email</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-lg">{user?.email}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Hak Akses Sistem</p>
                    <p className="font-semibold text-gray-900 dark:text-white capitalize">{user?.role}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status Akun</p>
                    <p className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-1.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Aktif Terverifikasi
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}