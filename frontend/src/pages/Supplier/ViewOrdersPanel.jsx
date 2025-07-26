import React from 'react';

const dummyOrders = [
  { id: 1, item: 'Product A', customer: 'John Doe', status: 'Pending' },
  { id: 2, item: 'Product B', customer: 'Jane Smith', status: 'Pending' },
];

const ViewOrdersPanel = () => {
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h2 className="text-2xl font-bold mb-6">Pending Orders</h2>

      <div className="space-y-4">
        {dummyOrders.map((order) => (
          <div key={order.id} className="bg-gray-800 p-4 rounded flex justify-between items-center">
            <div>
              <p><strong>Item:</strong> {order.item}</p>
              <p><strong>Customer:</strong> {order.customer}</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-green-600 px-3 py-1 rounded">Accept</button>
              <button className="bg-red-600 px-3 py-1 rounded">Reject</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold">Update Status</h3>
        <select className="bg-gray-800 p-2 mt-2 rounded">
          <option>Out for Delivery</option>
          <option>Delivered</option>
        </select>
      </div>
    </div>
  );
};

export default ViewOrdersPanel;
