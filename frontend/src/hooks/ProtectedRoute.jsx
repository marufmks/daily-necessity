import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Loader } from "../components/common/Loader";

export function ProtectedRoute({ adminOnly = false }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "ADMIN") return <Navigate to="/" replace />;
  return <Outlet />;
}
