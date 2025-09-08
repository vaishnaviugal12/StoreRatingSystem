import { useState } from "react";
import api, { setAuthToken } from "../api/axios";

export default function AddUserForm({ onUserAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");
    setAuthToken(token);

    try {
      const res = await api.post("/admin/users", formData);
      setFormData({ name: "", email: "", address: "", password: "", role: "USER" });
      onUserAdded(res.data.user);
      alert("User added successfully!");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="bg-white p-6 shadow rounded space-y-4" onSubmit={handleSubmit}>
      <h3 className="text-lg font-bold">Add New User</h3>

      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        name="name"
        placeholder="Name"
        className="w-full border px-3 py-2 rounded"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full border px-3 py-2 rounded"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        type="text"
        name="address"
        placeholder="Address"
        className="w-full border px-3 py-2 rounded"
        value={formData.address}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full border px-3 py-2 rounded"
        value={formData.password}
        onChange={handleChange}
      />

      <select
        name="role"
        className="w-full border px-3 py-2 rounded"
        value={formData.role}
        onChange={handleChange}
      >
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="OWNER">Owner</option>
      </select>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add User"}
      </button>
    </form>
  );
}
