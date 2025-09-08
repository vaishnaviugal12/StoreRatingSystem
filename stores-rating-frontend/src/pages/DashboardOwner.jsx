import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
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
        setDashboard(res.data.dashboard); // only this owner's stores
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to fetch dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []); // runs only once

  if (loading) return <p className="p-8 text-center">Loading dashboard...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar role="OWNER" />

      <div className="p-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-gray-800">Owner Dashboard</h2>

        {dashboard.length === 0 ? (
          <p className="text-gray-500 text-center">No stores or ratings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboard.map((store) => (
              <div
                key={store.storeId}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-semibold text-gray-800">{store.storeName}</h3>
                  <p className="flex items-center text-yellow-500 font-bold">
                    {store.avgRating?.toFixed(1) || "0"} ★
                  </p>
                </div>
                <p className="text-gray-600 mb-4">{store.address}</p>

                <h4 className="font-semibold mb-2 text-gray-700">User Ratings:</h4>
                {store.userRatings.length === 0 ? (
                  <p className="text-gray-400">No ratings submitted yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-50 border rounded-lg">
                      <thead className="bg-gray-200 text-gray-700">
                        <tr>
                          <th className="py-2 px-3 border">User</th>
                          <th className="py-2 px-3 border">Email</th>
                          <th className="py-2 px-3 border">Rating</th>
                          <th className="py-2 px-3 border">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {store.userRatings.map((r) => (
                          <tr key={r.userId} className="hover:bg-gray-100 transition">
                            <td className="py-2 px-3 border">{r.user.name}</td>
                            <td className="py-2 px-3 border">{r.user.email}</td>
                            <td className="py-2 px-3 border">{r.score} ★</td>
                            <td className="py-2 px-3 border">{new Date(r.ratedAt).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
