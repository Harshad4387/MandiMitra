import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-hot-toast";

const SearchProduct = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("name") || "";
  const [searchInput, setSearchInput] = useState(query);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const url = query
          ? `/vendor/search?name=${encodeURIComponent(query)}`
          : "/vendor/item/all-categorized-items";
        const res = await axiosInstance.get(url);
        setItems(res.data || []);
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
    navigate(
      searchInput.trim()
        ? `/vendor/search?name=${encodeURIComponent(searchInput.trim())}`
        : "/vendor/search"
    );
  };

  const addToCart = async (itemId) => {
    try {
      const res = await axiosInstance.post("/vendor/cart/add", {
        itemId,
        quantity: 1,
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Added to cart");
      } else {
        toast.error("Failed to add item to cart");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding to cart");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      {/* Search bar */}
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

      <h1 className="text-2xl font-semibold mb-4">
        {query ? `Results for "${query}"` : "All Products"}
      </h1>

      {/* Item grid */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition"
            >
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

                <button
                  onClick={() => addToCart(item._id)}
                  className="mt-2 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                  disabled={item.stock <= 0}
                >
                  {item.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchProduct;
