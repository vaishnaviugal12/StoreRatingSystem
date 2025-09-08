// src/components/UpdatePassword.jsx
import { useState } from "react";
import api, { setAuthToken } from "../api/axios.js";

export default function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setAuthToken(token);

    try {
      const res = await api.put("/user/password", { oldPassword, newPassword });
      setMessage(res.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <form className="max-w-md mx-auto mt-8 p-6 bg-white shadow rounded" onSubmit={handleUpdate}>
      <h2 className="text-xl font-bold mb-4">Update Password</h2>
      {message && <p className="mb-4 text-red-500">{message}</p>}
      <input
        type="password"
        placeholder="Old Password"
        className="w-full p-2 border mb-4 rounded"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="New Password"
        className="w-full p-2 border mb-4 rounded"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
        Update Password
      </button>
    </form>
  );
}
