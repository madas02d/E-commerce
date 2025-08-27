/* eslint-disable no-unused-vars */
// Import React and hooks
import React, { useState, useContext } from 'react';
// Import cart context for cart management functionality
import { useCart } from '../context/CartContext';
// Import authentication context to check user login status
import { AuthContext } from '../context/AuthContext';
// Import React Router hook for navigation
import { useNavigate } from 'react-router-dom';
// Import icons for cart actions (delete, add, remove, lock)
import { MdDelete, MdAdd, MdRemove, MdLock } from 'react-icons/md';
// Import back arrow icon for navigation
import { AiOutlineArrowLeft } from 'react-icons/ai';
// Import toast notification component
import Toast from '../components/Toast';

/**
 * Cart Component
 * Displays shopping cart items with quantity management and checkout functionality
 */
const Cart = () => {
  // Get cart functionality from context
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    clearCart,
    loading 
  } = useCart();
  // Get current user from authentication context
  const { user } = useContext(AuthContext);
  // React Router hook for navigation
  const navigate = useNavigate();
  // Toast notification state for user feedback
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  /**
   * Handle quantity changes for cart items
   * @param {string} productId - ID of the product to update
   * @param {number} newQuantity - New quantity value
   */
  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove item if quantity becomes 0 or negative
      await removeFromCart(productId);
    } else {
      // Update quantity if positive
      await updateQuantity(productId, newQuantity);
    }
  };

  /**
   * Handle checkout process with authentication check
   */
  const handleCheckout = () => {
    // Check if cart is empty
    if (cart.length === 0) {
      setToast({ show: true, message: 'Your cart is empty!', type: 'warning' });
      return;
    }
    
    // Check if user is authenticated
    if (!user) {
      setToast({ 
        show: true, 
        message: 'Please log in or register to proceed to checkout!', 
        type: 'warning' 
      });
      // Navigate to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }
    
    // Navigate to checkout page
    navigate('/checkout');
  };

  // Loading state while cart data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          {/* Header with back button */}
          <div className="flex items-center mb-4 sm:mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4 text-sm sm:text-base"
            >
              <AiOutlineArrowLeft className="mr-2" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold">Shopping Cart</h1>
          </div>
          
          {/* Empty cart message */}
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">Looks like you haven&apos;t added any items to your cart yet.</p>
            <button
              onClick={() => navigate('/search')}
              className="bg-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base font-medium"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header with back button and clear cart option */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4 text-sm sm:text-base"
            >
              <AiOutlineArrowLeft className="mr-2" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold">Shopping Cart</h1>
          </div>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Clear Cart
          </button>
        </div>

        {/* Main cart layout with items and order summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center p-3 sm:p-4 border-b last:border-b-0">
                  {/* Product image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg mr-3 sm:mr-4 flex-shrink-0"
                    onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop'; // Fallback image
                    }}
                  />
                  {/* Product details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.title}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">€{item.price}</p>
                  </div>
                  {/* Quantity controls and remove button */}
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    {/* Decrease quantity button */}
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <MdRemove className="w-4 h-4" />
                    </button>
                    {/* Quantity display */}
                    <span className="w-6 sm:w-8 text-center text-sm sm:text-base">{item.quantity}</span>
                    {/* Increase quantity button */}
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <MdAdd className="w-4 h-4" />
                    </button>
                    {/* Remove item button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 rounded-full hover:bg-red-100 text-red-500 ml-1 sm:ml-2"
                    >
                      <MdDelete className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-4">Order Summary</h2>
              {/* Price breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>€{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-sm sm:text-base">
                    <span>Total</span>
                    <span>€{getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Login reminder for non-authenticated users */}
              {!user && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center text-yellow-800">
                    <MdLock className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">Login required for checkout</span>
                  </div>
                  <p className="text-xs text-yellow-600 mt-1 mb-3">
                    Please log in or register to complete your purchase
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors text-xs sm:text-sm font-medium"
                  >
                    Login / Register
                  </button>
                </div>
              )}
              
              {/* Checkout button */}
              <button
                onClick={!user ? () => navigate('/login') : handleCheckout}
                className={`w-full py-2 sm:py-3 px-4 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                  cart.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
                disabled={cart.length === 0}
              >
                {!user ? 'Login to Checkout' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast notification for user feedback */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}
    </div>
  );
};

export default Cart; 