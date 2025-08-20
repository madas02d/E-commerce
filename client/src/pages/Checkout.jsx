// Import React hooks for state management and side effects
import React, { useState, useContext, useEffect } from 'react';
// Import React Router hook for navigation
import { useNavigate } from 'react-router-dom';
// Import cart context for cart management
import { useCart } from '../context/CartContext';
// Import authentication context to check user login status
import { AuthContext } from '../context/AuthContext';
// Import payment form component
import PaymentForm from '../components/PaymentForm';
// Import axios instance for API calls
import axios from '../utils/axios';
// Import icons for UI elements
import { 
  MdArrowBack, 
  MdLocationOn, 
  MdPayment, 
  MdShoppingCart,
  MdCreditCard,
  MdLocalShipping
} from 'react-icons/md';
import { AiOutlineLock } from 'react-icons/ai';

/**
 * Checkout Component
 * Multi-step checkout process with shipping and payment information
 */
const Checkout = () => {
  // React Router hook for navigation
  const navigate = useNavigate();
  // Get cart functionality from context
  const { cart, getCartTotal, clearCart } = useCart();
  // Get current user from authentication context
  const { user } = useContext(AuthContext);
  // Current step in checkout process (1: Shipping, 2: Payment)
  const [currentStep, setCurrentStep] = useState(1);
  // Loading state during order placement
  const [loading, setLoading] = useState(false);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Shipping information form state
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.fullName?.split(' ')[0] || '',
    lastName: user?.fullName?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Netherlands'
  });

  // Payment information form state
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  // Payment validation errors
  const [paymentErrors, setPaymentErrors] = useState({});

  // Order summary with calculated totals
  const [orderSummary] = useState({
    subtotal: getCartTotal(),
    shipping: 0,
    tax: getCartTotal() * 0.21, // 21% VAT
    total: getCartTotal() * 1.21
  });

  /**
   * Handle shipping information form changes
   * @param {Event} e - Input change event
   */
  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Validate shipping information form
   * @returns {boolean} True if all required fields are filled
   */
  const validateShipping = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
    return required.every(field => shippingInfo[field].trim() !== '');
  };

  /**
   * Validate payment information form
   * @returns {boolean} True if all payment fields are valid
   */
  const validatePayment = () => {
    const errors = {};
    const required = ['cardNumber', 'cardName', 'expiryDate', 'cvv'];
    
    // Check required fields
    required.forEach(field => {
      if (!paymentInfo[field].trim()) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Additional validation rules
    if (paymentInfo.cardNumber && paymentInfo.cardNumber.replace(/\s/g, '').length < 13) {
      errors.cardNumber = 'Please enter a valid card number';
    }

    if (paymentInfo.cvv && paymentInfo.cvv.length < 3) {
      errors.cvv = 'CVV must be at least 3 digits';
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle navigation between checkout steps
   */
  const handleNextStep = () => {
    if (currentStep === 1 && validateShipping()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validatePayment()) {
      handlePlaceOrder();
    }
  };

  /**
   * Handle order placement with backend API
   */
  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Check if user is authenticated
      if (!user) {
        navigate('/login');
        return;
      }

      // Check if cart is empty
      if (cart.length === 0) {
        alert('Your cart is empty. Please add items before placing an order.');
        return;
      }

      // Prepare order data for backend
      const orderData = {
        address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`,
        phone: shippingInfo.phone,
        items: cart.map(item => ({
          product: item.id,  // Changed from productId to product
          quantity: item.quantity,
          price: item.price,
          selectedSize: item.selectedSize || 'm'
        }))
      };

      // Send order creation request to backend
      const response = await axios.post('/orders/create', orderData);
      
      if (response.data.success) {
        // Clear cart after successful order
        await clearCart();
        
        // Navigate to success page
        navigate('/order-success');
      } else {
        throw new Error('Order creation failed');
      }
    } catch (error) {
      console.error('Order placement failed:', error);
      if (error.response?.status === 401) {
        // User is not authenticated, redirect to login
        alert('Please log in to complete your order.');
        navigate('/login');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MdShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Add some items to your cart before checkout</p>
          <button
            onClick={() => navigate('/search')}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <MdArrowBack className="mr-2" />
              Back to Cart
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              {/* Progress Steps Indicator */}
              <div className="flex items-center mb-6">
                <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}>
                    1
                  </div>
                  <span className="ml-2">Shipping</span>
                </div>
                <div className={`flex-1 h-1 mx-4 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}>
                    2
                  </div>
                  <span className="ml-2">Payment</span>
                </div>
              </div>

              {/* Step 1: Shipping Information Form */}
              {currentStep === 1 && (
                <div>
                  <div className="flex items-center mb-4">
                    <MdLocationOn className="w-5 h-5 text-blue-600 mr-2" />
                    <h2 className="text-lg font-semibold">Shipping Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={handleShippingChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    {/* Last Name field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={handleShippingChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    {/* Email field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    {/* Phone field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    {/* Address field (full width) */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    {/* City field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    {/* Postal Code field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleShippingChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Information Form */}
              {currentStep === 2 && (
                <div>
                  <div className="flex items-center mb-4">
                    <MdPayment className="w-5 h-5 text-blue-600 mr-2" />
                    <h2 className="text-lg font-semibold">Payment Information</h2>
                  </div>
                  <PaymentForm 
                    paymentInfo={paymentInfo}
                    setPaymentInfo={setPaymentInfo}
                    errors={paymentErrors}
                  />
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                {/* Back button (only show if not on first step) */}
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                )}
                {/* Continue/Place Order button */}
                <button
                  onClick={handleNextStep}
                  disabled={loading}
                  className={`ml-auto px-8 py-3 rounded-lg text-white font-medium transition-colors ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : currentStep === 1 ? 'Continue to Payment' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              {/* Cart Items List */}
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded mr-3"
                      onError={(e) => {
                          e.target.onerror = null; // Prevent infinite loop
                          e.target.src = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop'; // Fallback image
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">€{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Order Totals Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>€{orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (21% VAT)</span>
                  <span>€{orderSummary.tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>€{orderSummary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center text-green-800">
                  <AiOutlineLock className="w-4 h-4 mr-2" />
                  <span className="text-sm">Secure checkout powered by SSL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 