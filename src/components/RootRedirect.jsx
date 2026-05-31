import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RootRedirect() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="admin-root admin-loading">
        <div className="admin-spinner" />
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

export default RootRedirect;
