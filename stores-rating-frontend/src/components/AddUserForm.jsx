import { useState } from "react";
import api, { setAuthToken } from "../api/axios";
import toast from "react-hot-toast";

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
      toast.success("✅ User added successfully!");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Server error");
      toast.error("❌ Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="bg-white p-6 shadow rounded space-y-4" onSubmit={handleSubmit}>
      <h3 className="text-lg font-bold">Add New User</h3>
      {error && <p className="text-red-500">{error}</p>}

      {/* Floating Label Inputs */}
      {["name", "email", "address", "password"].map((field, i) => (
        <div className="relative" key={i}>
          <input
            type={field === "password" ? "password" : "text"}
            name={field}
            id={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder=" "
            className="peer w-full border rounded px-3 pt-5 pb-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <label
            htmlFor={field}
            className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
        </div>
      ))}

      {/* Role Select */}
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
