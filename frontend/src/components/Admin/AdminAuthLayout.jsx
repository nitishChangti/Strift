import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminAuthLayout = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Not logged in → go to admin login
  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Logged in but not admin → block access
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin authenticated → allow access
  return children ? children : <Outlet />;
};

export default AdminAuthLayout;
