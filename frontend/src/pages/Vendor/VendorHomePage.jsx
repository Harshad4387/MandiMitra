import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";

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
      }
    };

    fetchAllCategories();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold text-red-500">Instamart</h1>
      <p className="text-sm text-gray-500 mb-4">4 MINS delivery</p>

      {Object.entries(data).map(([category, items]) => (
        <div key={category}>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{category}</h2>
          {items.length === 0 ? (
            <p className="text-sm text-gray-400">No items available.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded"
                  />
                  <h3 className="text-md font-bold mt-2">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    ₹{item.pricePerUnit} / {item.unit}
                  </p>
                  <p className="text-sm text-gray-400">Stock: {item.stock}</p>
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
