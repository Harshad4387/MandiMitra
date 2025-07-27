import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../lib/axios.js'

const CustomersPage = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  
  const fetchCustomers = async () => {
    try {
      const res = await axiosInstance.get('/supplier/customers')
      setCustomers(res.data || [])
    } catch (err) {
      setError('Failed to fetch customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])
  
  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  )
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading customers...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
          <div className="text-red-500 text-2xl mb-2">⚠</div>
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Customer Management</h2>
          <p className="text-gray-600 text-base">View and manage your customer information</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1 max-w-sm mx-auto lg:mx-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
                <p className="text-sm text-gray-600 font-medium">Total Customers</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-sm">🔍</span>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Search customers by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 max-w-5xl mx-auto text-center">
            <div className="text-gray-400 text-6xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'No customers found' : 'No customers yet'}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Your customers will appear here once they place orders'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCustomers.map((customer) => (
              <div key={customer._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <span className="text-blue-600 text-lg">👤</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {customer.name || 'Unknown Customer'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Customer ID: #{customer._id?.slice(-6)?.toUpperCase() || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold border border-green-200">
                      Active
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <span>📧</span>
                      Contact Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">✉</span>
                        <p className="text-sm text-gray-800">{customer.email || 'No email provided'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">📱</span>
                        <p className="text-sm text-gray-800">{customer.phone || 'No phone provided'}</p>
                      </div>
                    </div>
                  </div>

                  {customer.address && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-2">
                        <span>📍</span>
                        Address
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-sm text-gray-800 leading-relaxed">
                          {typeof customer.address === 'object'
                            ? `Lat: ${customer.address.latitude}, Lng: ${customer.address.longitude}`
                            : customer.address}
                        </p>
                      </div>
                    </div>
                  )}


                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Total Orders</p>
                      <p className="text-lg font-bold text-gray-900">{customer.orderCount || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Spent</p>
                      <p className="text-lg font-bold text-green-600">
                        ₹ {(customer.totalSpent || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {customer.lastOrder?.placedAt && (
                    <div className="pt-2">
                      <p className="text-xs text-gray-500">Last Order</p>
                      <p className="text-sm text-gray-800">
                        {new Date(customer.lastOrder.placedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                    onClick={() => {
                      // console.log('Customer object:', customer);

                      const phone = customer.phone?.replace(/[^0-9]/g, '') // Clean the number
                      if (!phone) {
                        alert('Phone number not available for this customer.')
                        return
                      }
                      const message = `Hello ${customer.name || ''}, I would like to connect with you regarding your recent orders.`
                      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
                      window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
                    }}

                  >
                    <span>📋</span>
                    Chat with customer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomersPage
