import { useState, useEffect } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { Link, useNavigate } from "react-router-dom"; // Pastikan dari react-router-dom
import api from "../../api"; // Sesuaikan path ke konfigurasi axios kamu

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({ name: 'Memuat...', email: '...' });
  const navigate = useNavigate();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  // Tarik data user yang lagi login
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/user');
        setUser(res.data);
      } catch (err) {
        console.error("Gagal load user info", err);
      }
    };
    fetchUser();
  }, []);

  // Fungsi Logout yang beneran jalan
  const handleLogout = async (e) => {
    e.preventDefault(); // Cegah Link biar ga langsung pindah
    if (!window.confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
        closeDropdown();
        return;
    }

    try {
      // Tembak API Logout (Kalau backend kamu butuh request logout)
      await api.post('/logout');
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Bersihin semua token dan memori
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      closeDropdown();
      // Lempar ke halaman Sign In
      navigate('/signin');
    }
  };

  // Generate Avatar otomatis dari nama
  const avatarUrl = user?.name !== 'Memuat...' 
    ? `https://ui-avatars.com/api/?name=${user?.name}&background=random&color=fff&size=128&bold=true`
    : '/images/user/owner.jpg'; // Gambar fallback pas loading

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11 border-2 border-white shadow-sm dark:border-gray-800">
          <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
        </span>

        {/* Nampilin Nama Panggilan (Kata pertama aja biar ga kepanjangan) */}
        <span className="block mr-1 font-medium text-theme-sm">
            {user.name.split(' ')[0]}
        </span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="px-2 pt-2 pb-4">
          <span className="block font-bold text-gray-900 text-theme-sm dark:text-white line-clamp-1">
            {user.name}
          </span>
          <span className="mt-1 block text-theme-xs text-gray-500 dark:text-gray-400 line-clamp-1">
            {user.email}
          </span>
          {/* Badge Role */}
          {user.role && (
            <span className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                {user.role}
            </span>
          )}
        </div>

        <ul className="flex flex-col gap-1 pt-3 pb-3 border-y border-gray-100 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-blue-50 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-colors"
            >
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6171 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z"
                  fill=""
                />
              </svg>
              Profil Saya
            </DropdownItem>
          </li>
          {/* Menu "Support" dari template dibuang karena nggak nyambung */}
        </ul>

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center w-full gap-3 px-3 py-2.5 mt-2 font-semibold text-red-600 rounded-lg group text-theme-sm hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-500/10 transition-colors"
        >
          <svg
            className="fill-current"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
            />
          </svg>
          Keluar Sistem
        </button>
      </Dropdown>
    </div>
  );
}