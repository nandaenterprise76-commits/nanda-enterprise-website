import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--ne-bg)]">
        <div className="mono text-[color:var(--ne-accent)] tracking-widest">AUTHENTICATING…</div>
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}
