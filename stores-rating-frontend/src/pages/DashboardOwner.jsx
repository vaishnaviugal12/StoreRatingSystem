import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";

import api, { setAuthToken } from "../api/axios";

export default function DashboardOwner() {
  const [dashboard, setDashboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    const fetchDashboard = async () => {
      try {
        const res = await api.get("/owner/dashboard");
        setDashboard(res.data.dashboard);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to fetch dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p className="p-8 text-center">Loading dashboard...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;

  return (
    <div>
      <Navbar role="OWNER" />
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6">Owner Dashboard</h2>

        

        {dashboard.length === 0 ? (
          <p className="text-gray-500">No stores or ratings found.</p>
        ) : (
          dashboard.map((store) => (
            <div
              key={store.storeId}
              className="bg-white shadow p-6 rounded mb-6"
            >
              <h3 className="font-semibold text-xl mb-1">{store.storeName}</h3>
              <p className="text-gray-600 mb-2">{store.address}</p>
              <p className="mb-4 font-semibold">
                Average Rating: {store.avgRating?.toFixed(1) || "0"}
              </p>

              <h4 className="font-semibold mb-2">User Ratings:</h4>
              {store.userRatings.length === 0 ? (
                <p className="text-gray-500">No ratings submitted yet.</p>
              ) : (
                <table className="min-w-full bg-gray-50 border rounded">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="py-2 px-4 border">User Name</th>
                      <th className="py-2 px-4 border">Email</th>
                      <th className="py-2 px-4 border">Rating</th>
                      <th className="py-2 px-4 border">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.userRatings.map((r) => (
                      <tr key={r.userId} className="border-b">
                        <td className="py-2 px-4 border">{r.user.name}</td>
                        <td className="py-2 px-4 border">{r.user.email}</td>
                        <td className="py-2 px-4 border">{r.score}</td>
                        <td className="py-2 px-4 border">
                          {new Date(r.ratedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
