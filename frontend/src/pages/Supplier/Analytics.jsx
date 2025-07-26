import React from 'react';

const data = {
  monthlyOrders: 120,
  bestSellers: ['Product A', 'Product C'],
  topRated: ['Product B', 'Product D'],
};

const Analytics = () => {
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h2 className="text-2xl font-bold mb-6">Analytics</h2>

      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold">Monthly Order Count</h3>
          <p>{data.monthlyOrders}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold">Best-Selling Items</h3>
          <ul className="list-disc ml-5">
            {data.bestSellers.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold">Highest Rated Products</h3>
          <ul className="list-disc ml-5">
            {data.topRated.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
