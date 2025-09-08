import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import DashboardAdmin from "./pages/DashboardAdmin.jsx";
import DashboardUser from "./pages/DashboardUser.jsx";
import DashboardOwner from "./pages/DashboardOwner.jsx";
import UpdatePassword from "./components/UpdatePassword.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Admin */}
      <Route element={<ProtectedRoute role="ADMIN" />}>
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
      </Route>

      {/* User */}
      <Route element={<ProtectedRoute role="USER" />}>
        <Route path="/user/dashboard" element={<DashboardUser />} />
        <Route path="/user/password" element={<UpdatePassword />} />
      </Route>

      {/* Owner */}
      <Route element={<ProtectedRoute role="OWNER" />}>
        <Route path="/owner/dashboard" element={<DashboardOwner />} />
      </Route>

      {/* Catch all */}
      <Route
        path="*"
        element={<h1 className="text-center mt-20 text-2xl">Page Not Found</h1>}
      />
    </Routes>
  );
}

export default App;
