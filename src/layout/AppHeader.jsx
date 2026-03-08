import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom" // Pastikan import dari react-router-dom
import { useSidebar } from "../context/SidebarContext" // Sesuaikan path jika perlu
import { ThemeToggleButton } from "../components/common/ThemeToggleButton"
import UserDropdown from "../components/header/UserDropdown"

const AppHeader = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false)
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar()

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar()
    } else {
      toggleMobileSidebar()
    }
  }

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen)
  }

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-[9999] dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">

        {/* BAGIAN KIRI HEADER (Logo Mobile & Hamburger) */}
        <div className="flex items-center justify-between w-full gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">

          {/* Tombol Hamburger Sidebar */}
          <button
            className="flex items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg dark:border-gray-700 dark:text-gray-400 lg:h-11 lg:w-11 lg:border transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          {/* Logo untuk Mobile (Sembunyi di Desktop karena udah ada di Sidebar) */}
          <Link to="/" className="lg:hidden">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-wider">
              Si-Hadir <span className="text-blue-600">Admin</span>
            </h2>
          </Link>

          {/* Tombol Kebab (Titik 3) untuk menu kanan di Mobile */}
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 10.5C12.8284 10.5 13.5 11.1716 13.5 12C13.5 12.8284 12.8284 13.5 12 13.5C11.1716 13.5 10.5 12.8284 10.5 12C10.5 11.1716 11.1716 10.5 12 10.5ZM19 10.5C19.8284 10.5 20.5 11.1716 20.5 12C20.5 12.8284 19.8284 13.5 19 13.5C18.1716 13.5 17.5 12.8284 17.5 12C17.5 11.1716 18.1716 10.5 19 10.5ZM5 10.5C5.82843 10.5 6.5 11.1716 6.5 12C6.5 12.8284 5.82843 13.5 5 13.5C4.17157 13.5 3.5 12.8284 3.5 12C3.5 11.1716 4.17157 10.5 5 10.5Z" fill="currentColor" />
            </svg>
          </button>
        </div>

        {/* BAGIAN KANAN HEADER (Tema & Profil User) */}
        <div
          className={`${isApplicationMenuOpen ? "flex" : "hidden"
            } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-sm lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-2">
            {/* Tombol Ganti Tema (Terang/Gelap) */}
            <ThemeToggleButton />

            {/* Kalau mau pakai notifikasi dummy, uncomment baris bawah ini. Tapi Kakak saranin biarin mati dulu aja */}
            {/* <NotificationDropdown /> */}
          </div>

          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden lg:block mx-2"></div>

          {/* Dropdown Profil Admin */}
          <UserDropdown />
        </div>

      </div>
    </header>
  )
}

export default AppHeader