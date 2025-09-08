import { useState, useEffect } from "react";
import api, { setAuthToken } from "../api/axios";

export default function AddStoreForm({ onStoreAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    ownerId: "",
  });
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    const fetchOwners = async () => {
      try {
        const res = await api.get("/admin/users?role=OWNER");
        setOwners(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOwners();
  }, []);

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
      const res = await api.post("/admin/stores", formData);
      setFormData({ name: "", address: "", ownerId: "" });
      onStoreAdded(res.data.store);
      alert("Store added successfully!");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="bg-white p-6 shadow rounded space-y-4" onSubmit={handleSubmit}>
      <h3 className="text-lg font-bold">Add New Store</h3>

      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        name="name"
        placeholder="Store Name"
        className="w-full border px-3 py-2 rounded"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        type="text"
        name="address"
        placeholder="Store Address"
        className="w-full border px-3 py-2 rounded"
        value={formData.address}
        onChange={handleChange}
      />

      <select
        name="ownerId"
        className="w-full border px-3 py-2 rounded"
        value={formData.ownerId}
        onChange={handleChange}
      >
        <option value="">Select Owner (Optional)</option>
        {owners.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name} ({o.email})
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Store"}
      </button>
    </form>
  );
}
