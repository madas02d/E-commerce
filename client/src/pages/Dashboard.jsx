
// Import React hooks for state management and side effects
import React, { useContext, useState, useEffect } from 'react';
// Import authentication context for user data and logout functionality
import { AuthContext } from '../context/AuthContext';
// Import cart context for cart statistics
import { useCart } from '../context/CartContext';
// Import React Router hook for navigation
import { useNavigate } from 'react-router-dom';
// Import axios instance for API calls
import axios from '../utils/axios';
// Import icons for UI elements
import { 
  MdShoppingBag, 
  MdFavorite, 
  MdPerson, 
  MdSettings, 
  MdLogout,
  MdShoppingCart,
  MdHistory,
  MdLocationOn,
  MdPayment,
  MdStar,
  MdTrendingUp
} from 'react-icons/md';
import { AiOutlineHeart } from 'react-icons/ai';

/**
 * Dashboard Component
 * Main user dashboard with statistics, quick actions, and recent orders
 */
const Dashboard = () => {
  // Get user data and logout function from authentication context
  const { user, logoutUser } = useContext(AuthContext);
  // Get cart statistics from cart context
  const { getCartCount, getCartTotal } = useCart();
  // React Router hook for navigation
  const navigate = useNavigate();
  // Active tab state for dashboard sections
  const [activeTab, setActiveTab] = useState('overview');
  // User statistics and data from backend
  const [userStats, setUserStats] = useState({
    totalSpent: 0,
    wishlistCount: 0,
    cartCount: 0,
    orderCount: 0,
    recentOrders: []
  });
  // Loading state while fetching dashboard data
  const [loading, setLoading] = useState(true);
  // Error state for displaying error messages
  const [error, setError] = useState('');

  /**
   * Fetch user statistics on component mount
   */
  useEffect(() => {
    fetchUserStats();
  }, []);

  /**
   * Fetch user statistics and recent orders from backend
   */
  const fetchUserStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/users/stats');
      console.log('Dashboard data:', response.data.data);
      setUserStats(response.data.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle user logout and redirect to login page
   */
  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  /**
   * Format date string to readable format
   * @param {string} dateString - Date string to format
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  // Dashboard statistics cards configuration
  const dashboardStats = [
    {
      title: 'Cart Items',
      value: userStats.cartCount,
      icon: <MdShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'bg-blue-500',
      action: () => navigate('/cart')
    },
    {
      title: 'Total Spent',
      value: `€${userStats.totalSpent.toFixed(2)}`,
      icon: <MdPayment className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'bg-green-500',
      action: () => navigate('/orders')
    },
    {
      title: 'Wishlist',
      value: userStats.wishlistCount,
      icon: <AiOutlineHeart className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'bg-red-500',
      action: () => navigate('/wishlist')
    },
    {
      title: 'Orders',
      value: userStats.orderCount,
      icon: <MdHistory className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'bg-purple-500',
      action: () => navigate('/orders')
    }
  ];

  // Quick action buttons configuration
  const quickActions = [
    {
      title: 'Continue Shopping',
      description: 'Browse our latest collection',
      icon: <MdShoppingBag className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => navigate('/search')
    },
    {
      title: 'View Cart',
      description: `${userStats.cartCount} items in your cart`,
      icon: <MdShoppingCart className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => navigate('/cart')
    },
    {
      title: 'Profile Settings',
      description: 'Update your information',
      icon: <MdSettings className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: 'bg-gray-500 hover:bg-gray-600',
      action: () => navigate('/profile')
    }
  ];

  // Loading state while fetching dashboard data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with user info and navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600">Welcome back, {user?.fullName || 'User'}!</p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Refresh dashboard button */}
              <button
                onClick={fetchUserStats}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Refresh dashboard"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              {/* Cart button with item count badge */}
              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 text-gray-600 hover:text-gray-900"
              >
                <MdShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                {userStats.cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {userStats.cartCount}
                  </span>
                )}
              </button>
              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors text-sm sm:text-base"
              >
                <MdLogout className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error message display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {dashboardStats.map((stat, index) => (
            <div
              key={index}
              onClick={stat.action}
              className="bg-white rounded-lg shadow-sm p-4 sm:p-6 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className={`${stat.color} text-white p-2 sm:p-3 rounded-lg`}>
                  {stat.icon}
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={action.action}
                className="bg-white rounded-lg shadow-sm p-4 sm:p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className={`${action.color} text-white p-2 sm:p-3 rounded-lg w-fit mb-3 sm:mb-4`}>
                  {action.icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">{action.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{action.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-0">Recent Orders</h2>
            {userStats.recentOrders.length > 0 && (
              <button
                onClick={() => navigate('/orders')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All Orders
              </button>
            )}
          </div>
          
          {userStats.recentOrders.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {userStats.recentOrders.map((order, index) => (
                <div key={order._id} className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  {/* Order icon */}
                  <div className="bg-blue-100 p-2 rounded-lg mr-3 sm:mr-4">
                    <MdShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  {/* Order details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {order.items.length} items • €{order.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      {/* Order status badge */}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium mt-2 sm:mt-0 ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty state for no orders */
            <div className="text-center py-8">
              <MdShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No orders yet</p>
              <p className="text-sm text-gray-500">Start shopping to see your orders here</p>
            </div>
          )}
        </div>

        {/* Shopping Insights Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Shopping Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Total spent insight */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 sm:p-6 rounded-lg">
              <div className="flex items-center mb-3 sm:mb-4">
                <MdTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Total Spent</h3>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">€{userStats.totalSpent.toFixed(2)}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">Lifetime spending with DressMe</p>
            </div>
            
            {/* Wishlist items insight */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 sm:p-6 rounded-lg">
              <div className="flex items-center mb-3 sm:mb-4">
                <MdStar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-2" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Wishlist Items</h3>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{userStats.wishlistCount}</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">Items saved for later</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

