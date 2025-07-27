import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Package,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Mock API call - replace with your actual API endpoint
  const fetchAnalytics = async () => {
    setRefreshing(true);
    try {
      // Replace with your actual API call
      const response = await fetch('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Mock data for demonstration
      setAnalyticsData({
        totalOrders: 847,
        totalRevenue: 45230.50,
        statusBreakdown: {
          pending: 25,
          confirmed: 120,
          delivered: 680,
          cancelled: 22
        },
        revenueByDate: {
          '2025-07-20': 2340,
          '2025-07-21': 1890,
          '2025-07-22': 3200,
          '2025-07-23': 2750,
          '2025-07-24': 4100,
          '2025-07-25': 3680,
          '2025-07-26': 2890,
          '2025-07-27': 1580
        },
        mostOrderedItems: [
          { name: 'Premium Coffee Beans', quantity: 234 },
          { name: 'Organic Tea Leaves', quantity: 189 },
          { name: 'Fresh Pasta', quantity: 156 },
          { name: 'Artisan Bread', quantity: 134 },
          { name: 'Local Honey', quantity: 98 }
        ],
        categoryStats: [
          { category: 'Beverages', quantity: 423 },
          { category: 'Bakery', quantity: 290 },
          { category: 'Dairy', quantity: 234 },
          { category: 'Snacks', quantity: 189 },
          { category: 'Organic', quantity: 156 }
        ]
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Chart configurations
  const revenueChartData = {
    labels: analyticsData ? Object.keys(analyticsData.revenueByDate).map(date => 
      new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ) : [],
    datasets: [
      {
        label: 'Daily Revenue',
        data: analyticsData ? Object.values(analyticsData.revenueByDate) : [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  };

  const statusChartData = {
    labels: analyticsData ? Object.keys(analyticsData.statusBreakdown).map(status => 
      status.charAt(0).toUpperCase() + status.slice(1)
    ) : [],
    datasets: [
      {
        data: analyticsData ? Object.values(analyticsData.statusBreakdown) : [],
        backgroundColor: [
          '#fbbf24', // pending - yellow
          '#10b981', // confirmed - green
          '#3b82f6', // delivered - blue
          '#ef4444', // cancelled - red
        ],
        borderColor: '#fff',
        borderWidth: 2,
        hoverBorderWidth: 3,
      }
    ]
  };

  const itemsChartData = {
    labels: analyticsData ? analyticsData.mostOrderedItems.map(item => item.name) : [],
    datasets: [
      {
        label: 'Quantity Ordered',
        data: analyticsData ? analyticsData.mostOrderedItems.map(item => item.quantity) : [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(251, 191, 36)',
          'rgb(139, 92, 246)',
          'rgb(236, 72, 153)',
        ],
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  const categoryChartData = {
    labels: analyticsData ? analyticsData.categoryStats.map(cat => cat.category) : [],
    datasets: [
      {
        data: analyticsData ? analyticsData.categoryStats.map(cat => cat.quantity) : [],
        backgroundColor: [
          '#8b5cf6',
          '#06b6d4',
          '#84cc16',
          '#f59e0b',
          '#ef4444',
        ],
        borderColor: '#fff',
        borderWidth: 2,
        hoverBorderWidth: 3,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className="text-sm text-green-600 mt-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  const ChartCard = ({ title, children, className = '' }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your business performance and insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <button
                onClick={fetchAnalytics}
                disabled={refreshing}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={analyticsData?.totalOrders?.toLocaleString() || '0'}
            icon={ShoppingCart}
            trend="+12% from last month"
            color="blue"
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(analyticsData?.totalRevenue || 0)}
            icon={DollarSign}
            trend="+8% from last month"
            color="green"
          />
          <StatCard
            title="Avg Order Value"
            value={formatCurrency((analyticsData?.totalRevenue || 0) / (analyticsData?.totalOrders || 1))}
            icon={TrendingUp}
            trend="+5% from last month"
            color="yellow"
          />
          <StatCard
            title="Active Items"
            value={analyticsData?.mostOrderedItems?.length || '0'}
            icon={Package}
            trend="+3% from last month"
            color="purple"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <ChartCard title="Revenue Trend" className="lg:col-span-2">
            <div className="h-80">
              <Line data={revenueChartData} options={chartOptions} />
            </div>
          </ChartCard>

          {/* Order Status */}
          <ChartCard title="Order Status Breakdown">
            <div className="h-80">
              <Doughnut data={statusChartData} options={pieChartOptions} />
            </div>
          </ChartCard>

          {/* Category Performance */}
          <ChartCard title="Category Performance">
            <div className="h-80">
              <Pie data={categoryChartData} options={pieChartOptions} />
            </div>
          </ChartCard>
        </div>

        {/* Most Ordered Items */}
        <ChartCard title="Most Ordered Items" className="mb-8">
          <div className="h-80">
            <Bar data={itemsChartData} options={chartOptions} />
          </div>
        </ChartCard>

        {/* Quick Stats Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Items List */}
          <ChartCard title="Top Performing Items">
            <div className="space-y-4">
              {analyticsData?.mostOrderedItems?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{item.quantity} orders</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Category Stats */}
          <ChartCard title="Category Statistics">
            <div className="space-y-4">
              {analyticsData?.categoryStats?.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{category.category}</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{
                          width: `${(category.quantity / Math.max(...analyticsData.categoryStats.map(c => c.quantity))) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{category.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
