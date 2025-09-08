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
      // Update local state immediately
      setStores((prev) =>
        prev.map((s) =>
          s.id === storeId
            ? {
                ...s,
                userRating: score,
                // optionally update avgRating locally
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
    <div>
      <Navbar role="USER" />
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Stores List</h2>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name or address"
            className="border px-4 py-2 rounded w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border px-4 py-2 rounded"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
          >
            <option value={0}>All Ratings</option>
            <option value={1}>1 star & above</option>
            <option value={2}>2 stars & above</option>
            <option value={3}>3 stars & above</option>
            <option value={4}>4 stars & above</option>
            <option value={5}>5 stars</option>
          </select>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <div key={store.id} className="bg-white shadow p-4 rounded">
              <h3 className="font-semibold">{store.name}</h3>
              <p>{store.address}</p>
              <p>Average Rating: {store.avgRating.toFixed(1)}</p>
              <p>Your Rating:</p>
              <StarRating
                rating={store.userRating || 0}
                onRate={(score) => handleRating(store.id, score)}
              />
            </div>
          ))}
          {filteredStores.length === 0 && (
            <p className="text-center col-span-3 text-gray-500">No stores found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
