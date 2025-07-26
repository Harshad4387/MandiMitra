import { useEffect, useState } from "react";
import { Loader2, Trash, X } from "lucide-react";
import { axiosInstance } from "../../lib/axios";

const ViewCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartError, setCartError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");

  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get("vendor/cart/getcart");
      setCartItems(res.data.items || []);
    } catch (err) {
      setCartError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    try {
      await axiosInstance.delete("vendor/cart/clear");
      setCartItems([]);
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`vendor/cart/remove/${id}`);
      setCartItems([]);
    } catch (err) {
      console.error("Failed to clear item:", err);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await axiosInstance.post("vendor/place-order", {
        deliveryMethod,
        deliveryAddress,
      });

      setShowModal(false);
      setCartItems([]);
      alert("Order placed successfully!");
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, [handleDelete]);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.quantity * item.itemId.pricePerUnit,
    0
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🛒 Your Cart</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={handleClearCart}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Clear Cart
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
        </div>
      ) : cartError ? (
        <p className="text-red-600 text-center">{cartError}</p>
      ) : cartItems.length === 0 ? (
        <p className="text-gray-600 text-center">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.itemId._id}
              className="flex items-center border rounded-xl shadow-sm p-4 bg-white"
            >
              <img
                src={item.itemId.imageUrl}
                alt={item.itemId.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="ml-4 flex-1">
                <h2 className="text-lg font-semibold capitalize">
                  {item.itemId.name}
                </h2>
                <p className="text-gray-600">
                  {item.quantity} x ₹{item.itemId.pricePerUnit} /{" "}
                  {item.itemId.unit}
                </p>
                <p className="font-medium text-green-700 mt-1">
                  ₹{item.quantity * item.itemId.pricePerUnit}
                </p>
              </div>
              <button onClick={() => handleDelete(item.itemId._id)}className="text-red-600 hover:text-red-800">
                <Trash />
              </button>
            </div>
          ))}

          <div className="mt-6 text-right">
            <span className="text-xl font-bold">Total: ₹{totalAmount}</span>
          </div>

          <div className="mt-4 text-right">
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Place Order
            </button>
          </div>
        </div>
      )}

      {/* Order Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold mb-4">🧾 Confirm Your Order</h2>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="Cash">Cash on Delivery</option>
                <option value="UPI">UPI</option>
                <option value="Card">Credit/Debit Card</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Delivery Method</label>
              <select
                value={deliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="delivery">Home Delivery</option>
                <option value="pickup">Self Pickup</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Delivery Address</label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows={3}
                placeholder="Enter your full address"
              ></textarea>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={!deliveryAddress}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              Confirm Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCart;
