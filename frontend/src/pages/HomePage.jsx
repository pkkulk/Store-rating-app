import { useContext, useEffect, useState } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

export default function HomePage() {
  const { user } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        // Pass the search query to the backend
        const res = await api.get(`/stores/get?search=${searchQuery}`);
        setStores(res.data);
      } catch (err) {
        console.error("Error fetching stores:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, [searchQuery]); // Re-run effect when search query changes

  const handleRate = async (storeId, rating) => {
    if (!user) {
      alert("Please login to rate stores!");
      return;
    }

    try {
      await api.post("/ratings", {
        store_id: storeId,
        user_id: user.id,
        rating,
      });
      setRatings({ ...ratings, [storeId]: rating });
      alert("Rating submitted successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to submit rating");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="w-full bg-white shadow-xl rounded-lg px-8 py-8">
        <div className="text-center mb-8 border-b pb-4">
          <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight mb-2">
            Welcome to Store Rating App 🏪
          </h2>
          <p className="text-lg text-gray-600">
            Browse stores, see ratings, and share your feedback.
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search for a store by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-10">
            <p>Loading stores...</p>
          </div>
        ) : stores.length > 0 ? (
          <div className="space-y-6">
            {stores.map((store) => (
              <div
                key={store.id}
                className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold text-gray-800">{store.name}</h3>
                  <div className="text-right">
                    <p className="text-sm font-medium text-yellow-600">Overall Rating</p>
                    <p className="mt-1 text-2xl font-extrabold text-yellow-800">
                      {parseFloat(store.avg_rating) ? parseFloat(store.avg_rating).toFixed(1) : "N/A"}{" "}
                      <span className="text-3xl">⭐</span>
                    </p>
                  </div>
                </div>
                <p className="text-gray-500 mb-4">{store.address}</p>

                {user ? (
                  <div className="flex items-center space-x-2">
                    <label className="text-gray-700 font-medium">Your Rating:</label>
                    <select
                      value={ratings[store.id] || ""}
                      onChange={(e) => handleRate(store.id, Number(e.target.value))}
                      className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    >
                      <option value="">Select</option>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <button
                    onClick={() => (window.location.href = `/login?redirect=/`)}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
                  >
                    Login to rate
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p>No stores found matching your search. Try a different name!</p>
          </div>
        )}
      </div>
    </div>
  );
}