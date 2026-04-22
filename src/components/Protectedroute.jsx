import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token) {
                return <Navigate to="/signin" replace />;
        }

        // Jika route ini memiliki batasan role, cek apakah role user termasuk di dalamnya
        if (allowedRoles && !allowedRoles.includes(role)) {
                // Jika dilarang, lempar kembali ke halaman Home
                alert("Akses Ditolak: Kamu tidak memiliki izin untuk melihat halaman ini.");
                return <Navigate to="/" replace />;
        }

        return <Outlet />;
}