import { useState, useEffect } from "react";
import api, { setAuthToken } from "../api/axios";
import toast from "react-hot-toast";

export default function AddStoreForm({ onStoreAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    ownerId: "",
  });

  const [owners, setOwners] = useState([]); // store owners for dropdown
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOwners = async () => {
      const token = localStorage.getItem("token");
      setAuthToken(token);

      try {
        const res = await api.get("/admin/users");
        const ownerUsers = res.data.filter((u) => u.role === "OWNER");
        setOwners(ownerUsers);
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to fetch owners");
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
      toast.success("✅ Store added successfully!");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Server error");
      toast.error("❌ Failed to add store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="bg-white p-6 shadow rounded space-y-4"
      onSubmit={handleSubmit}
    >
      <h3 className="text-lg font-bold">Add New Store</h3>
      {error && <p className="text-red-500">{error}</p>}

      {/* Floating Label Inputs */}
      {["name", "address"].map((field, i) => (
        <div className="relative" key={i}>
          <input
            type="text"
            name={field}
            id={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder=" "
            className="peer w-full border rounded px-3 pt-5 pb-2 focus:ring-2 focus:ring-green-500 outline-none"
          />
          <label
            htmlFor={field}
            className="absolute left-3 top-2 text-gray-500 text-sm transition-all 
              peer-placeholder-shown:top-5 peer-placeholder-shown:text-base 
              peer-placeholder-shown:text-gray-400 peer-focus:top-2 
              peer-focus:text-sm peer-focus:text-green-600"
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
        </div>
      ))}

      {/* Owner Dropdown */}
      <div className="relative">
        <select
          name="ownerId"
          id="ownerId"
          value={formData.ownerId}
          onChange={handleChange}
          className="peer w-full border rounded px-3 pt-5 pb-2 focus:ring-2 focus:ring-green-500 outline-none bg-white"
        >
          <option value="">Select Owner</option>
          {owners.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.name} ({owner.email})
            </option>
          ))}
        </select>
        <label
          htmlFor="ownerId"
          className="absolute left-3 top-2 text-gray-500 text-sm transition-all 
            peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-600"
        >
          Owner
        </label>
      </div>

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
