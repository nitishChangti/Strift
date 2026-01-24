import { NavLink, useNavigate } from "react-router-dom";

const SidebarItem = ({ to, label, end = false, indent = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `
      mx-3 my-1 px-4 py-2 rounded-lg font-medium transition-all duration-200
      ${indent ? "ml-6 text-sm" : ""}
      ${
        isActive
          ? "bg-gray-200 border-l-4 border-black text-black"
          : "text-gray-600 hover:bg-gray-100 hover:translate-x-1"
      }
    `
    }
  >
    {label}
  </NavLink>
);

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    navigate("/admin/login", { replace: true });
  };

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col">
      <nav className="mt-6 flex flex-col">
        <SidebarItem to="/admin" label="Home" end />
        <SidebarItem to="/admin/products" label="Products" />
        <SidebarItem to="/admin/products/create" label="Create Product" indent />
        <SidebarItem to="/admin/category" label="Category" />
        <SidebarItem to="/admin/orders" label="Orders" />
        <SidebarItem to="/admin/users" label="User" />
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto mb-4 mx-6 text-red-500 hover:bg-red-50 py-2 rounded-lg transition"
      >
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
