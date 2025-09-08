import { Outlet, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ Use named import

export default function ProtectedRoute({ role }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token); // ✅ Remove .default
    console.log("ProtectedRoute - User role:", decoded.role, "Required role:", role);
    
    if (decoded.role !== role) {
      console.log("Access denied: role mismatch");
      return <Navigate to="/login" />;
    }
  } catch (err) {
    console.error("Token decoding error:", err);
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}