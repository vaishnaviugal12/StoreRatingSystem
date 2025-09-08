import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { setAuthToken } from "../api/axios";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      if (!token || !user) {
        setError("Invalid login response");
        return;
      }

      localStorage.setItem("token", token);
      setAuthToken(token);

      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded);

      // ✅ Determine dashboard route based on user role
      let dashboardRoute;
      switch (decoded.role) {
        case "ADMIN":
          dashboardRoute = "/admin/dashboard";
          break;
        case "OWNER":
          dashboardRoute = "/owner/dashboard";
          break;
        case "USER":
          dashboardRoute = "/user/dashboard";
          break;
        default:
          dashboardRoute = "/user/dashboard"; // fallback
      }

      console.log("Navigating to:", dashboardRoute);
      navigate(dashboardRoute, { replace: true });
      
    } catch (err) {
      console.log("Login error:", err);
      console.log("Error response:", err.response?.data);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-8 rounded shadow-md w-96"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email" // ✅ Added autocomplete
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password" // ✅ Added autocomplete
        />

        <button 
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors mb-4"
        >
          Login
        </button>

        <div className="text-center">
          <p className="text-gray-600 text-sm">
            New user?{" "}
            <Link 
              to="/signup" 
              className="text-blue-500 hover:text-blue-700 font-medium underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}