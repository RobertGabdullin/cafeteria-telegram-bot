import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontFamily: "var(--font-family)",
        color: "var(--color-gray-500)",
      }}>
        Загрузка...
      </div>
    );
  }

  if (!user) {
    // Сохраним, куда хотел попасть — чтобы редиректнуть после логина
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}