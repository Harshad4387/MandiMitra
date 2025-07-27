import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../lib/axios.js';
import StatCard from '../../components/supplier/StatCard.jsx';
import RevenueChart from '../../components/supplier/RevenueChart.jsx';
import StatusPieChart from '../../components/supplier/StatusPieChart.jsx';
import ItemBarChart from '../../components/supplier/ItemBarChart.jsx';
import CategoryPieChart from '../../components/supplier/CategoryPieChart.jsx';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await axiosInstance.get('/supplier/analytics');
      setData(res.data);
    };
    fetchAnalytics();
  }, []);

  if (!data) return <div className="p-6 text-center">Loading analytics...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">📊 Supplier Analytics Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Orders" value={data.totalOrders} />
        <StatCard label="Total Revenue" value={`₹${data.totalRevenue}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RevenueChart revenueData={data.revenueByDate} />
        <StatusPieChart statusData={data.statusBreakdown} />
        <ItemBarChart items={data.mostOrderedItems} />
        <CategoryPieChart categories={data.categoryStats} />
      </div>
    </div>
  );
}
