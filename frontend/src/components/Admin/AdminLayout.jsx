// components/Admin/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.jsx";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* LEFT SIDEBAR - ALWAYS VISIBLE */}
      <AdminSidebar />

      {/* RIGHT CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
