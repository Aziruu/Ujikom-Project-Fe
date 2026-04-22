import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon, EnvelopeIcon, LockIcon } from "../../icons";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import api from "../../api";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState(""); // Mengganti 'email' jadi 'identifier' agar lebih fleksibel (bisa email/NIP)
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("admin"); // 'admin' atau 'guru'
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let response;

      // Percabangan Endpoint berdasarkan tipe user
      if (loginType === "admin") {
        response = await api.post("/login/admin", {
          email: identifier,
          password
        });
      } else {
        response = await api.post("/login/guru", {
          login: identifier, // Sesuai dengan backend kita yang meminta parameter 'login'
          password
        });
      }

      const token = response.data.token || response.data.access_token || response.data.data?.token;
      const user = response.data.user || response.data.data?.user;
      const role = response.data.role; // Mengambil role dari standarisasi AuthController kita

      if (!token) {
        throw new Error("Token tidak ditemukan dari server");
      }

      // Simpan sesi ke localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role); // Sangat penting untuk routing!

      // Arahkan ke Dashboard sesuai Role
      if (role === 'guru') {
        navigate("/guru/dashboard");
      } else {
        navigate("/admin/dashboard"); // Berlaku untuk admin & operator
      }

    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Login gagal. Coba cek lagi kredensial kamu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Welcome back! Please select your role and sign in.
            </p>
          </div>

          {/* Alert Error */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-500 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="space-y-6">

              {/* Tipe Login Selector */}
              <div className="flex gap-4 p-1 bg-gray-100 rounded-lg dark:bg-gray-800">
                <button
                  type="button"
                  onClick={() => setLoginType("admin")}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${loginType === "admin"
                      ? "bg-white text-brand-500 shadow-sm dark:bg-gray-700 dark:text-brand-400"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                >
                  Staff / Admin
                </button>
                <button
                  type="button"
                  onClick={() => setLoginType("guru")}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${loginType === "guru"
                      ? "bg-white text-brand-500 shadow-sm dark:bg-gray-700 dark:text-brand-400"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                >
                  Guru (Pelapor)
                </button>
              </div>

              {/* Input Email / NIP */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  {loginType === "admin" ? "Email" : "Email / NIP"} <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={loginType === "admin" ? "email" : "text"}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={loginType === "admin" ? "admin@sekolah.com" : "Masukkan Email atau NIP"}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pl-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    required
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2">
                    <EnvelopeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  </span>
                </div>
              </div>

              {/* Input Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Password <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pl-11 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    required
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2">
                    <LockIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  </span>
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              {/* Checkbox & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Keep me logged in
                  </span>
                </div>
                <Link
                  to="/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Tombol Submit */}
              <div>
                <Button className="w-full" size="sm" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}