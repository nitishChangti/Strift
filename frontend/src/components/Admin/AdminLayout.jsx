import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminAuthLayout = ({ children }) => {
  const isAuthenticated = useSelector(
    (state) => state.auth.status
  );

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default AdminAuthLayout;
