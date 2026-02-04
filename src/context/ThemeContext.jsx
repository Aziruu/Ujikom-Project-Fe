/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from "react"

const ThemeContext = createContext(undefined)

export const ThemeProvider = ({ children }) => {
  // FIX: Ambil localStorage langsung di sini, jangan di useEffect
  const [theme, setTheme] = useState(() => {
    // Cek apakah ada di local storage, kalau ga ada default "light"
    return localStorage.getItem("theme") || "light"
  })

  // Hapus state isInitialized karena sudah tidak perlu render 2 kali

  useEffect(() => {
    localStorage.setItem("theme", theme)
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}