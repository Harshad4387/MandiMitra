import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../lib/axios.js'

const ViewOrdersPanel = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get('/supplier/orders/pending')
      setOrders(res.data)
    } catch (err) {
      setError('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axiosInstance.patch(`/supplier/orders/${orderId}/status`, { status })
      fetchOrders()
    } catch (err) {
      alert('Failed to update status')
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
          <div className="text-red-500 text-2xl mb-2">⚠️</div>
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-8">
        <div className="mb-8 px-2">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h2>
          <p className="text-gray-600 text-base">Manage and track your pending orders</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 max-w-sm mx-auto sm:mx-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
              <p className="text-sm text-gray-600 font-medium">Pending Orders</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <span className="text-yellow-600 text-xl">📋</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-5xl w-full mx-auto hover:shadow-lg transition-all duration-300 hover:border-gray-300">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                
                  </h3>
                  <p className="text-gray-700 text-lg font-medium">{order.customerName}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold border border-yellow-200">
                    Pending
                  </span>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Items Ordered</h4>
                  <div className="flex flex-wrap gap-3">
                    {order.items.map((item, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100 hover:bg-blue-100 transition-colors duration-200">
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Delivery Address</h4>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-gray-900 text-sm leading-relaxed">
                      {order.deliveryAddress}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">
                <div className="flex-1 max-w-xs">
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps?q=${order.latitude},${order.longitude}`,
                        '_blank'
                      )
                    }
                  >
                    <span>📍</span>
                    View on Map
                  </button>
                </div>

                <div className="flex-1 max-w-xs">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Update Status
                  </label>
                  <select
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-gray-400"
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    value={order.status}
                  >
                    <option value="Pending">⏳ Pending</option>
                    <option value="Out for Delivery">🚚 Out for Delivery</option>
                    <option value="Delivered">✅ Delivered</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ViewOrdersPanel