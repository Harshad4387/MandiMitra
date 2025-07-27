import React, { useEffect, useState } from "react";

const StatCard = ({ title, value, icon, bgColor = "bg-blue-500" }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
    <div className={`rounded-full p-3 ${bgColor} text-white`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);


const TopProductsChart = ({ products }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-lg font-bold text-gray-800 mb-4">
      Top Selling Products
    </h3>
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.name}>
          <div className="flex justify-between mb-1">
            <p className="text-sm font-medium text-gray-600">{product.name}</p>
            <p className="text-sm font-semibold text-gray-800">
              {product.sales} sales
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${product.percentage}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);


const LowStockProducts = ({ products }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-lg font-bold text-gray-800 mb-4">Low Stock Alerts</h3>
    <ul className="space-y-3">
      {products.map((product) => (
        <li
          key={product.id}
          className="flex justify-between items-center p-2 bg-red-50 rounded-lg"
        >
          <p className="font-medium text-gray-700">{product.name}</p>
          <p className="text-red-600 font-bold">{product.stock} left</p>
        </li>
      ))}
    </ul>
  </div>
);


const OrderStatusSummary = ({ summary }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-lg font-bold text-gray-800 mb-4">Order Status</h3>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="font-medium text-yellow-600">Pending</span>
        <span className="font-bold">{summary.pending}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium text-blue-600">Shipped</span>
        <span className="font-bold">{summary.shipped}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium text-green-600">Delivered</span>
        <span className="font-bold">{summary.delivered}</span>
      </div>
    </div>
  </div>
);

export default function AnalyticsDashboardPage() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchAnalytics = () => {
      const mockData = {
        salesPerformance: {
          totalRevenue: 45231.89,
          numberOfOrders: 580,
          averageOrderValue: 77.98,
        },
        productPerformance: {
          topSelling: [
            { name: "Organic Honey", sales: 120, percentage: 100 },
            { name: "Artisan Cheese", sales: 95, percentage: 79 },
            { name: "Fresh Sourdough", sales: 75, percentage: 62 },
            { name: "Cold-pressed Juice", sales: 50, percentage: 41 },
          ],
          lowStock: [
            { id: "p001", name: "Almond Butter", stock: 8 },
            { id: "p002", name: "Kombucha Starter Kit", stock: 5 },
          ],
        },
        orderStatus: {
          pending: 15,
          shipped: 35,
          delivered: 530,
        },
      };
      setAnalyticsData(mockData);
      setLoading(false);
    };

    setTimeout(fetchAnalytics, 1000); // Simulate network delay
  }, []);

  if (loading) {
    return <div className="text-center p-10">Loading analytics...</div>;
  }

  if (!analyticsData) {
    return (
      <div className="text-center p-10 text-red-500">
        Could not load analytics data.
      </div>
    );
  }

  const { salesPerformance, productPerformance, orderStatus } = analyticsData;

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Supplier Dashboard
        </h1>

        {/* Section 1: Key Performance Indicators (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <StatCard
            title="Total Revenue"
            value={`$${salesPerformance.totalRevenue.toLocaleString()}`}
            icon={"$"} // Placeholder for FiDollarSign
            bgColor="bg-green-500"
          />
          <StatCard
            title="Total Orders"
            value={salesPerformance.numberOfOrders}
            icon={"🛒"} // Placeholder for FiShoppingCart
            bgColor="bg-blue-500"
          />
          <StatCard
            title="Average Order Value"
            value={`$${salesPerformance.averageOrderValue.toFixed(2)}`}
            icon={"📦"} // Placeholder for FiPackage
            bgColor="bg-indigo-500"
          />
        </div>

        {/* Section 2: Product & Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TopProductsChart products={productPerformance.topSelling} />
          </div>
          <div className="space-y-6">
            <OrderStatusSummary summary={orderStatus} />
            <LowStockProducts products={productPerformance.lowStock} />
          </div>
        </div>
      </div>
    </div>
  );
}