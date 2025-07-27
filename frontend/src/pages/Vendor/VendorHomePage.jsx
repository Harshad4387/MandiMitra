import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios.js";
import toast from "react-hot-toast";

const VendorHomePage = () => {
  const [data, setData] = useState({
    "Fresh Produce": [],
    "Grains and Flours": [],
    "Spices and Condiments": [],
    "Oils and Fats": [],
    "Packaging and Disposables": [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const freshProduce = await axiosInstance.get("/vendor/item/fresh-produce");
        const grains = await axiosInstance.get("/vendor/item/grains-and-flours");
        const spices = await axiosInstance.get("/vendor/item/spices-and-condiments");
        const oils = await axiosInstance.get("/vendor/item/oils-and-fats");
        const packaging = await axiosInstance.get("/vendor/item/packaging-and-disposables");

        setData({
          "Fresh Produce": freshProduce.data.items || [],
          "Grains and Flours": grains.data.items || [],
          "Spices and Condiments": spices.data.items || [],
          "Oils and Fats": oils.data.items || [],
          "Packaging and Disposables": packaging.data.items || [],
        });

        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching categories", err);
        toast.error("Failed to fetch items");
      }
    };

    fetchAllCategories();
  }, []);

  const handleAddToCart = async (itemId) => {
    try {
      const quantity = 1;
      const response = await axiosInstance.post("vendor/cart/add", {
        itemId,
        quantity,
      });
      toast.success(response.data.message || "Item added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return <div className="text-center mt-16 text-gray-500 text-lg">Loading items...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-600 tracking-wide drop-shadow-sm">
          Mandi Mitra
        </h1>
        <p className="mt-2 text-base md:text-lg text-gray-600 italic">
          Bazaar ka Asli Swaad, Ab Aapki Ungliyon Pe!
        </p>
      </div>


      {Object.entries(data).map(([category, items]) => (
        <div key={category} className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-l-4 border-green-500 pl-3">
            {category}
          </h2>

          {items.filter((item) => item.stock > 0).length === 0 ? (
            <p className="text-sm text-gray-400">No items available in this category.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {items.filter((item) => item.stock > 0).map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="mt-3">
                    <h3 className="text-md font-semibold text-gray-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      ₹{item.pricePerUnit} / {item.unit}
                    </p>
                    <p className="text-xs text-gray-400">Stock: {item.stock}</p>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item._id)}
                    className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg transition"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VendorHomePage;
