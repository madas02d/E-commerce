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
import { MdDelete, MdAdd, MdRemove, MdLock, MdShoppingCart } from 'react-icons/md';
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
    loading,
    getCartCount
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
      setToast({ show: true, message: 'Item removed from cart', type: 'info' });
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

  /**
   * Handle clear cart with confirmation
   */
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear all items from your cart?')) {
      clearCart();
      setToast({ show: true, message: 'Cart cleared successfully', type: 'info' });
    }
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
              <MdShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">Looks like you haven&apos;t added any items to your cart yet.</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/search')}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base font-medium mr-3"
              >
                Browse Products
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base font-medium"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
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
            <h1 className="text-xl sm:text-2xl font-bold">Shopping Cart ({getCartCount()} items)</h1>
          </div>
          <button
            onClick={handleClearCart}
            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
          >
            <MdDelete className="mr-1" />
            Clear Cart
          </button>
        </div>

        {/* Main cart layout with items and order summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">Cart Items</h2>
              </div>
              {cart.map((item) => (
                <div key={item._id || item.id} className="flex items-center p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                  {/* Product image */}
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.title || item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg mr-4 flex-shrink-0"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop'; // Fallback image
                      }}
                    />
                    {/* Stock indicator */}
                    {item.stock && item.quantity > item.stock && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                        Limited
                      </div>
                    )}
                  </div>
                  
                  {/* Product details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {item.title || item.name}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-1">
                      {item.description && item.description.length > 50 
                        ? `${item.description.substring(0, 50)}...` 
                        : item.description || 'No description available'
                      }
                    </p>
                    <p className="text-orange-600 font-semibold text-sm sm:text-base">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-gray-500 text-xs">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                  
                  {/* Quantity controls and remove button */}
                  <div className="flex flex-col items-center space-y-2">
                    {/* Quantity controls */}
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => handleQuantityChange(item._id || item.id, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <MdRemove className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id || item.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                        disabled={item.stock && item.quantity >= item.stock}
                      >
                        <MdAdd className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Remove item button */}
                    <button
                      onClick={() => {
                        removeFromCart(item._id || item.id);
                        setToast({ show: true, message: 'Item removed from cart', type: 'info' });
                      }}
                      className="p-1 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                      title="Remove item"
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
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Order Summary</h2>
              
              {/* Price breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${(getCartTotal() * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Login reminder for non-authenticated users */}
              {!user && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center text-yellow-800">
                    <MdLock className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium">Login required for checkout</span>
                  </div>
                  <p className="text-xs text-yellow-600 mt-1 mb-3">
                    Please log in or register to complete your purchase
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                  >
                    Login / Register
                  </button>
                </div>
              )}
              
              {/* Checkout button */}
              <button
                onClick={!user ? () => navigate('/login') : handleCheckout}
                className={`w-full py-3 px-4 rounded-lg font-medium text-base transition-colors ${
                  cart.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
                disabled={cart.length === 0}
              >
                {!user ? 'Login to Checkout' : 'Proceed to Checkout'}
              </button>
              
              {/* Continue shopping button */}
              <button
                onClick={() => navigate('/search')}
                className="w-full mt-3 py-2 px-4 rounded-lg font-medium text-sm text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
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
