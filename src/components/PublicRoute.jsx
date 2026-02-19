import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : <Outlet />;
}