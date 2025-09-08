import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import api, { setAuthToken } from "../api/axios";
import AddUserForm from "../components/AddUserForm.jsx";
import AddStoreForm from "../components/AddStoreForm.jsx";

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

  // --- Fetch data on mount ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    const fetchData = async () => {
      try {
        // Dashboard summary
        const dashRes = await api.get("/admin/dashboard");
        setDashboard(dashRes.data);

        // Users
        const userRes = await api.get("/admin/users");
        setUsers(userRes.data);
        setFilteredUsers(userRes.data);

        // Stores
        const storeRes = await api.get("/admin/stores");
        setStores(storeRes.data);
        setFilteredStores(storeRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // --- Users filter/search ---
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

  // --- Stores filter/search ---
  useEffect(() => {
    let filtered = stores;
    if (storeOwnerFilter) filtered = filtered.filter(
      (s) => s.owner?.name === storeOwnerFilter
    );
    if (searchStore) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchStore.toLowerCase()) ||
          s.address.toLowerCase().includes(searchStore.toLowerCase())
      );
    }
    setFilteredStores(filtered);
  }, [searchStore, storeOwnerFilter, stores]);

  // --- Handlers for Add forms ---
  const handleUserAdded = (user) => setUsers((prev) => [...prev, user]);
  const handleStoreAdded = (store) => setStores((prev) => [...prev, store]);

  return (
    <div>
      <Navbar role="ADMIN" />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Dashboard summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-100 p-4 rounded shadow">
            <p className="text-gray-600">Total Users</p>
            <p className="text-2xl font-bold">{dashboard.totalUsers}</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow">
            <p className="text-gray-600">Total Stores</p>
            <p className="text-2xl font-bold">{dashboard.totalStores}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded shadow">
            <p className="text-gray-600">Total Ratings</p>
            <p className="text-2xl font-bold">{dashboard.totalRatings}</p>
          </div>
        </div>

        {/* Add User / Add Store */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <AddUserForm onUserAdded={handleUserAdded} />
          <AddStoreForm onStoreAdded={handleStoreAdded} />
        </div>

        {/* Users Section */}
        <h2 className="text-2xl font-bold mb-4">Users</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name/email/address"
            className="border px-4 py-2 rounded w-1/2"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <select
            className="border px-4 py-2 rounded"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="OWNER">Owner</option>
          </select>
        </div>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Address</th>
                <th className="py-2 px-4">Role</th>
                <th className="py-2 px-4">Owner Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="py-2 px-4">{u.name}</td>
                  <td className="py-2 px-4">{u.email}</td>
                  <td className="py-2 px-4">{u.address}</td>
                  <td className="py-2 px-4">{u.role}</td>
                  <td className="py-2 px-4">{u.role === "OWNER" ? u.rating || "N/A" : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && <p className="mt-4 text-center text-gray-500">No users found.</p>}
        </div>

        {/* Stores Section */}
        <h2 className="text-2xl font-bold mb-4">Stores</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by store name/address"
            className="border px-4 py-2 rounded w-1/2"
            value={searchStore}
            onChange={(e) => setSearchStore(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by owner name"
            className="border px-4 py-2 rounded"
            value={storeOwnerFilter}
            onChange={(e) => setStoreOwnerFilter(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Address</th>
                <th className="py-2 px-4">Owner</th>
                <th className="py-2 px-4">Average Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="py-2 px-4">{s.name}</td>
                  <td className="py-2 px-4">{s.address}</td>
                  <td className="py-2 px-4">{s.owner?.name || "N/A"}</td>
                  <td className="py-2 px-4">{s.avgRating?.toFixed(1) || "0"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStores.length === 0 && <p className="mt-4 text-center text-gray-500">No stores found.</p>}
        </div>
      </div>
    </div>
  );
}
