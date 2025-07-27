import React, { useState } from "react";
import { axiosInstance } from "../../lib/axios.js";
import toast from "react-hot-toast";

const CATEGORY_OPTIONS = [
  "Fresh Produce",
  "Grains and Flours",
  "Spices and Condiments",
  "Oils and Fats",
  "Packaging and Disposables",
];

const AddItemForm = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    unitType: "",
    category: "",
    delivery: false,
    image: null,
  });

  const [selectedFileName, setSelectedFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setForm({ ...form, image: file });
      setSelectedFileName(file?.name || "");
    } else {
      setForm({
        ...form,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.unitType || !form.category) {
      toast.error("Name, price, unit type, and category are required.");
      return;
    }

    if (!["kg", "litre", "piece"].includes(form.unitType)) {
      toast.error("Unit type must be 'kg', 'litre', or 'piece'");
      return;
    }

    if (!CATEGORY_OPTIONS.includes(form.category)) {
      toast.error("Please select a valid category.");
      return;
    }

    try {
      setLoading(true);

      let imageBase64 = "";
      if (form.image) {
        imageBase64 = await convertToBase64(form.image);
      }

      const payload = {
        name: form.name,
        pricePerUnit: form.price,
        stock: form.quantity || 0,
        unit: form.unitType,
        deliveryAvailable: form.delivery,
        category: form.category,
        imageBase64,
      };

      const res = await axiosInstance.post("/supplier/additem", payload);

      toast.success("Item added successfully!");
      console.log("Server response:", res.data);

      setForm({
        name: "",
        price: "",
        quantity: "",
        unitType: "",
        category: "",
        delivery: false,
        image: null,
      });
      setSelectedFileName("");
    } catch (err) {
      console.error("Error:", err?.response?.data || err.message);
      toast.error(err?.response?.data?.message || "Failed to add item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-3xl font-bold text-center mb-8">Add New Item</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium">Item Name</label>
            <input
              className="mt-1 w-full border px-3 py-2 rounded"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter item name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Price per Unit</label>
            <input
              className="mt-1 w-full border px-3 py-2 rounded"
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter price"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Quantity in Stock</label>
            <input
              className="mt-1 w-full border px-3 py-2 rounded"
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Unit Type (kg/litre/piece)</label>
            <input
              className="mt-1 w-full border px-3 py-2 rounded"
              type="text"
              name="unitType"
              value={form.unitType}
              onChange={handleChange}
              placeholder="e.g. kg"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded"
          >
            <option value="">Select Category</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Item Image</label>
          <div className="flex items-center border border-gray-400 rounded px-3 py-2">
            <label
              htmlFor="image"
              className="text-indigo-600 font-medium cursor-pointer hover:underline"
            >
              Select Image
            </label>
            <input
              id="image"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
            <span className="ml-4 text-sm text-gray-600 truncate">
              {selectedFileName || "No file chosen"}
            </span>
          </div>
        </div>

        {/* Delivery Option */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="delivery"
            checked={form.delivery}
            onChange={handleChange}
            className="h-4 w-4 accent-indigo-600"
          />
          <label className="text-gray-700 font-medium">Delivery Available</label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded"
        >
          {loading ? "Submitting..." : "Add Item"}
        </button>
      </form>
    </div>
  );
};

export default AddItemForm;