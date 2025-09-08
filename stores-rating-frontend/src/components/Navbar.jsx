// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../api/axios";

export default function Navbar({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    navigate("/login");
  };

  // Compute update-password route dynamically
  const passwordRoute = `/${role.toLowerCase()}/update-password`;

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-xl">Stores Rating App - {role}</h1>
      <div className="flex gap-4">
        <button
          onClick={() => navigate(passwordRoute)}
          className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
        >
          Update Password
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
