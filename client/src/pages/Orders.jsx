// Import React hooks for state management and side effects
import React, { useState, useEffect, useContext } from 'react';
// Import React Router hook for navigation
import { useNavigate } from 'react-router-dom';
// Import authentication context for user data
import { AuthContext } from '../context/AuthContext';
// Import axios instance for API calls
import axios from '../utils/axios';
// Import icons for UI elements
import { 
  MdArrowBack, 
  MdShoppingBag, 
  MdLocationOn, 
  MdPhone,
  MdCalendarToday,
  MdReceipt
} from 'react-icons/md';

/**
 * Orders Component
 * Displays user's order history with detailed order information
 */
const Orders = () => {
  // React Router hook for navigation
  const navigate = useNavigate();
  // Get current user from authentication context
  const { user } = useContext(AuthContext);
  // Orders data from backend
  const [orders, setOrders] = useState([]);
  // Loading state while fetching orders
  const [loading, setLoading] = useState(true);
  // Error state for displaying error messages
  const [error, setError] = useState('');

  /**
   * Fetch user orders on component mount
   */
  useEffect(() => {
    fetchOrders();
  }, []);

  /**
   * Fetch user's order history from backend API
   */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/orders/user');
      console.log('Orders response:', response.data);
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format date string to readable format with time
   * @param {string} dateString - Date string to format
   * @returns {string} Formatted date and time string
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Get color classes for order status badges
   * @param {string} status - Order status
   * @returns {string} Tailwind CSS color classes
   */
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  /**
   * Get emoji icon for order status
   * @param {string} status - Order status
   * @returns {string} Emoji icon for the status
   */
  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      processing: '⚙️',
      shipped: '📦',
      delivered: '✅',
      cancelled: '❌'
    };
    return icons[status] || '📋';
  };

  // Loading state while fetching orders
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900"
              >
                <MdArrowBack className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                <p className="text-gray-600">{orders.length} orders total</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error message display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Empty state - no orders */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <MdShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <button
              onClick={() => navigate('/search')}
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          /* Orders list */
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Order Header with order ID, date, status, and total */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <MdCalendarToday className="w-4 h-4 mr-1" />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      {/* Order status badge */}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <p className="text-lg font-bold text-gray-900 mt-2">
                        €{order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items Section */}
                <div className="p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Items ({order.items.length})</h4>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        {/* Product image or placeholder */}
                        {item.product && item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.title || 'Product'}
                            className="w-16 h-16 object-cover rounded-md"
                            onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loop
                                e.target.src = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop'; // Fallback image
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No Image</span>
                          </div>
                        )}
                        {/* Product details */}
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">
                            {item.product?.title || 'Product Unavailable'}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {item.product?.category || 'Category Unknown'}
                          </p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        {/* Item price */}
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            €{((item.product?.price || 0) * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            €{item.product?.price || 0} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details Section - Shipping and Contact Info */}
                <div className="bg-gray-50 p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Order Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Shipping address */}
                    <div>
                      <p className="text-sm text-gray-600 flex items-center mb-2">
                        <MdLocationOn className="w-4 h-4 mr-2" />
                        Shipping Address
                      </p>
                      <p className="text-gray-900">{order.address}</p>
                    </div>
                    {/* Contact phone (if available) */}
                    {order.phone && (
                      <div>
                        <p className="text-sm text-gray-600 flex items-center mb-2">
                          <MdPhone className="w-4 h-4 mr-2" />
                          Contact Phone
                        </p>
                        <p className="text-gray-900">{order.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Summary Section */}
                <div className="p-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <MdReceipt className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Order Total</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        €{order.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders; 