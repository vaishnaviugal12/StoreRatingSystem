import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import StarRating from "../components/StarRating.jsx";
import api, { setAuthToken } from "../api/axios";

export default function DashboardUser() {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState(0);

  // --- Fetch stores on mount ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    const fetchStores = async () => {
      try {
        const res = await api.get("/user/stores");
        setStores(res.data);
        setFilteredStores(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStores();
  }, []);

  // --- Filter & Search ---
  useEffect(() => {
    let filtered = stores;

    if (search) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.address.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (minRating > 0) {
      filtered = filtered.filter((s) => s.avgRating >= minRating);
    }

    setFilteredStores(filtered);
  }, [search, minRating, stores]);

  // --- Handle rating submit/update ---
  const handleRating = async (storeId, score) => {
    try {
      await api.post("/user/ratings", { storeId, score });
      setStores((prev) =>
        prev.map((s) =>
          s.id === storeId
            ? {
                ...s,
                userRating: score,
                avgRating: s.ratings
                  ? (s.ratings.reduce((acc, r) => acc + r.score, 0) + score) /
                    (s.ratings.length + 1)
                  : score,
              }
            : s
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="USER" />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-10 px-8 shadow-md">
        <h2 className="text-3xl font-bold">Explore Stores</h2>
        <p className="text-sm opacity-90">Search, filter, and rate your favorite stores</p>
      </div>

      {/* Search and Filter */}
      <div className="p-6 flex flex-col md:flex-row gap-4 justify-center items-center bg-white shadow rounded -mt-6 mx-8">
        <input
          type="text"
          placeholder="🔍 Search by name or address"
          className="border px-4 py-2 rounded w-full md:w-1/2 focus:ring-2 focus:ring-green-500 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-4 py-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
        >
          <option value={0}>All Ratings</option>
          <option value={1}>⭐ 1 & above</option>
          <option value={2}>⭐ 2 & above</option>
          <option value={3}>⭐ 3 & above</option>
          <option value={4}>⭐ 4 & above</option>
          <option value={5}>⭐ 5 only</option>
        </select>
      </div>

      {/* Stores Grid */}
      <div className="p-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredStores.map((store) => (
          <div
            key={store.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 p-6 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-semibold text-lg text-gray-800">{store.name}</h3>
              <p className="text-gray-600 text-sm">{store.address}</p>

              <div className="mt-3">
                <p className="text-gray-700 font-medium">
                  ⭐ Average Rating:{" "}
                  <span className="text-green-600">{store.avgRating.toFixed(1)}</span>
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-1">Your Rating:</p>
              <StarRating
                rating={store.userRating || 0}
                onRate={(score) => handleRating(store.id, score)}
              />
            </div>
          </div>
        ))}

        {filteredStores.length === 0 && (
          <p className="text-center col-span-3 text-gray-500 italic">
            No stores found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}
