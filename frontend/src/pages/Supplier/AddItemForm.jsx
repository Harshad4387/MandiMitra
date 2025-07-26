import React, { useState } from "react";
import { axiosInstance } from "../../lib/axios.js"; // adjust the path as needed
import toast from "react-hot-toast";

const AddItemForm = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    unitType: "",
    delivery: false,
    image: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]
          : value,
    });
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

    if (!form.name || !form.price || !form.unitType) {
      toast.error("Name, price, and unit type are required.");
      return;
    }

    if (!["kg", "litre", "piece"].includes(form.unitType)) {
      toast.error("Unit type must be 'kg', 'litre', or 'piece'");
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
        delivery: false,
        image: null,
      });

    } catch (err) {
      console.error("Error:", err?.response?.data || err.message);
      toast.error(err?.response?.data?.message || "Failed to add item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-lg w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Add Item</h2>

        <input
          className="w-full p-2 rounded bg-gray-800"
          type="text"
          name="name"
          placeholder="Item Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 rounded bg-gray-800"
          type="number"
          name="price"
          placeholder="Price per Unit"
          value={form.price}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 rounded bg-gray-800"
          type="number"
          name="quantity"
          placeholder="Quantity in Stock"
          value={form.quantity}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 rounded bg-gray-800"
          type="text"
          name="unitType"
          placeholder="Unit Type (kg/litre/piece)"
          value={form.unitType}
          onChange={handleChange}
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="delivery"
            checked={form.delivery}
            onChange={handleChange}
          />
          <span>Delivery Available</span>
        </label>

        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="text-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 p-2 rounded"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddItemForm;
