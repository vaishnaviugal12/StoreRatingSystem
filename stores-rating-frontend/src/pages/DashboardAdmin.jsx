import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import api, { setAuthToken } from "../api/axios";
import AddUserForm from "../components/AddUserForm.jsx";
import AddStoreForm from "../components/AddStoreForm.jsx";
import { Users, Store, Star, Edit3, Trash2 } from "lucide-react"; // added icons
import toast from "react-hot-toast";

export default function DashboardAdmin() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);

  const [searchUser, setSearchUser] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [searchStore, setSearchStore] = useState("");
  const [storeOwnerFilter, setStoreOwnerFilter] = useState("");

  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    const fetchData = async () => {
      try {
        const dashRes = await api.get("/admin/dashboard");
        setDashboard(dashRes.data);

        const userRes = await api.get("/admin/users");
        setUsers(userRes.data);
        setFilteredUsers(userRes.data);

        const storeRes = await api.get("/admin/stores");
        setStores(storeRes.data);
        setFilteredStores(storeRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // User filters
  useEffect(() => {
    let filtered = users;
    if (roleFilter) filtered = filtered.filter((u) => u.role === roleFilter);
    if (searchUser) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
          u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
          u.address.toLowerCase().includes(searchUser.toLowerCase())
      );
    }
    setFilteredUsers(filtered);
  }, [searchUser, roleFilter, users]);

  // Store filters
  useEffect(() => {
    let filtered = stores;
    if (storeOwnerFilter)
      filtered = filtered.filter((s) => s.owner?.name === storeOwnerFilter);
    if (searchStore) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchStore.toLowerCase()) ||
          s.address.toLowerCase().includes(searchStore.toLowerCase())
      );
    }
    setFilteredStores(filtered);
  }, [searchStore, storeOwnerFilter, stores]);

  const handleUserAdded = (user) => setUsers((prev) => [...prev, user]);
  const handleStoreAdded = (store) => setStores((prev) => [...prev, store]);

  // delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success("User deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  // delete store
  const handleDeleteStore = async (storeId) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;

    try {
      await api.delete(`/admin/stores/${storeId}`);
      setStores((prev) => prev.filter((s) => s.id !== storeId));
      toast.success("Store deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete store");
    }
  };

  // edit handlers (for now just show toast — later we’ll add a modal form)
  const handleEditUser = (user) => {
    toast(`Edit user: ${user.name}`);
  };

  const handleEditStore = (store) => {
    toast(`Edit store: ${store.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="ADMIN" />
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Admin Dashboard
        </h1>

        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-2xl shadow-lg flex items-center gap-4">
            <Users size={40} />
            <div>
              <p className="text-lg">Total Users</p>
              <p className="text-3xl font-bold">{dashboard.totalUsers}</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl shadow-lg flex items-center gap-4">
            <Store size={40} />
            <div>
              <p className="text-lg">Total Stores</p>
              <p className="text-3xl font-bold">{dashboard.totalStores}</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-2xl shadow-lg flex items-center gap-4">
            <Star size={40} />
            <div>
              <p className="text-lg">Total Ratings</p>
              <p className="text-3xl font-bold">{dashboard.totalRatings}</p>
            </div>
          </div>
        </div>

        {/* Add Forms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">Add User</h2>
            <AddUserForm onUserAdded={handleUserAdded} />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">Add Store</h2>
            <AddStoreForm onStoreAdded={handleStoreAdded} />
          </div>
        </div>

        {/* Users Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Users</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name/email/address"
              className="border px-4 py-2 rounded-lg w-1/2"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
            <select
              className="border px-4 py-2 rounded-lg"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>
          <div className="overflow-x-auto bg-white rounded-2xl shadow">
            <table className="min-w-full text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Owner Rating</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => (
                  <tr
                    key={u.id}
                    className={`${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="py-2 px-4">{u.name}</td>
                    <td className="py-2 px-4">{u.email}</td>
                    <td className="py-2 px-4">{u.address}</td>
                    <td className="py-2 px-4">{u.role}</td>
                    <td className="py-2 px-4">
                      {u.role === "OWNER" ? u.rating || "N/A" : "-"}
                    </td>
                    <td className="py-2 px-4 flex gap-2">
                      <button
                        onClick={() => handleEditUser(u)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <p className="p-4 text-center text-gray-500">No users found.</p>
            )}
          </div>
        </div>

        {/* Stores Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Stores</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by store name/address"
              className="border px-4 py-2 rounded-lg w-1/2"
              value={searchStore}
              onChange={(e) => setSearchStore(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by owner name"
              className="border px-4 py-2 rounded-lg"
              value={storeOwnerFilter}
              onChange={(e) => setStoreOwnerFilter(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto bg-white rounded-2xl shadow">
            <table className="min-w-full text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4">Average Rating</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStores.map((s, i) => (
                  <tr
                    key={s.id}
                    className={`${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="py-2 px-4">{s.name}</td>
                    <td className="py-2 px-4">{s.address}</td>
                    <td className="py-2 px-4">{s.owner?.name || "N/A"}</td>
                    <td className="py-2 px-4">
                      {s.avgRating?.toFixed(1) || "0"}
                    </td>
                    <td className="py-2 px-4 flex gap-2">
                      <button
                        onClick={() => handleEditStore(s)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteStore(s.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStores.length === 0 && (
              <p className="p-4 text-center text-gray-500">No stores found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
