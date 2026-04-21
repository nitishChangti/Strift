import { useState, useEffect } from "react";
import adminUserService from "../../services/admin/users.js";
import UserDetailsModal from "./UserDetailsModal.jsx";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({});

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminUserService.getAllUsers(
        currentPage,
        limit,
        searchQuery
      );
      setUsers(response.data.users || []);
      setPagination(response.data.pagination || {});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await adminUserService.getUserStats();
      setStats(response.data || {});
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh stats every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleViewDetails = async (user) => {
    try {
      const response = await adminUserService.getUserDetails(user._id);
      setSelectedUser(response.data);
      setIsModalOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user details");
    }
  };

  const handleUserUpdate = () => {
    fetchUsers();
    fetchStats();
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Users Management</h1>
        <p className="text-gray-600">Manage and track all registered users</p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Active Users</p>
            <p className="text-3xl font-bold text-green-600">{stats.activeUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Purchasing Users</p>
            <p className="text-3xl font-bold text-blue-600">{stats.purchasingUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Avg Orders/User</p>
            <p className="text-3xl font-bold text-purple-600">{stats.avgOrdersPerUser}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search User
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by name, phone, or email..."
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={handleResetFilters}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="text-gray-600 mt-4">Loading users...</p>
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">User ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Joined</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`border-b hover:bg-gray-50 transition ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">
                      {user._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {user.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 break-all">
                      {user.email || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {user.isActive ? "✓ Active" : "✕ Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1 px-3 rounded transition text-xs"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No users found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-900 font-semibold py-2 px-4 rounded transition"
          >
            Previous
          </button>

          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`font-semibold py-2 px-4 rounded transition ${
                currentPage === page
                  ? "bg-purple-600 text-white"
                  : "bg-gray-300 hover:bg-gray-400 text-gray-900"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
            disabled={currentPage === pagination.pages}
            className="bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-900 font-semibold py-2 px-4 rounded transition"
          >
            Next
          </button>
        </div>
      )}

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserUpdate={handleUserUpdate}
      />
    </div>
  );
};

export default AdminUsers;
