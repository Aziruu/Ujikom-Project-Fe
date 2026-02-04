import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
        const token = localStorage.getItem('token');

        // Kalau ga ada token, redirect ke login
        if (!token) {
                return <Navigate to="/" replace />;
        }

        return children;
}