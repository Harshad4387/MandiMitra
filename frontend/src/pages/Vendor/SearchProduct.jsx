import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";

const SearchProduct = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("name") || "";
  const [searchInput, setSearchInput] = useState(query);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      if (!query) return;

      setLoading(true);
      try {
        const res = await axiosInstance.get(`/vendor/search?name=${query}`);
        setItems(res.data.items || []);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/vendor/search?name=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <form onSubmit={handleSearch} className="mb-6 flex gap-3 items-center">
        <input
          type="text"
          placeholder="Search for a product..."
          className="w-full sm:max-w-md border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      <h1 className="text-2xl font-semibold mb-4">Results for "{query}"</h1>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold capitalize">{item.name}</h2>
                <p className="text-gray-600">Category: {item.category}</p>
                <p className="text-gray-800 font-medium">
                  ₹{item.pricePerUnit} / {item.unit}
                </p>
                <p className={`text-sm ${item.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                  Stock: {item.stock}
                </p>
                <p className="text-sm text-gray-500">
                  Delivery: {item.deliveryAvailable ? "Available" : "Not Available"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchProduct;
