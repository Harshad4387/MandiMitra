import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { Loader2, PackageCheck } from "lucide-react";

// Utility to format date
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  });
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("vendor/myorders");
      setOrders(res.data.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <PackageCheck className="text-green-600" /> My Orders
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
        </div>
      ) : error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600 text-center">You haven’t placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-xl p-5 border hover:shadow-lg transition duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Order #{order._id.slice(-6)}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {order.status || "Unknown"}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div>
                  <span className="font-medium">Total:</span> ₹{order.totalAmount}
                </div>
                <div>
                  <span className="font-medium">Payment:</span> {order.paymentMethod}
                </div>
                <div>
                  <span className="font-medium">Delivery:</span> {order.deliveryMethod || "—"}
                </div>
                <div className="col-span-full">
                  <span className="font-medium">Address:</span>{" "}
                  {order.deliveryAddress || (
                    <span className="text-gray-400 italic">Not Provided</span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t text-sm">
                <p className="font-semibold mb-2 text-gray-800">Items Ordered:</p>
                <ul className="space-y-1 pl-5 list-disc text-gray-700">
                  {order.items.map((item) => (
                    <li key={item.itemId?._id}>
                      {item.itemId?.name} × {item.quantity} — ₹
                      {item.quantity * item.itemId?.pricePerUnit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
