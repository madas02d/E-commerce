// Import React for component functionality
import React from 'react';
// Import React Router hook for navigation
import { useNavigate } from 'react-router-dom';
// Import icons for UI elements
import { MdCheckCircle, MdShoppingBag, MdEmail } from 'react-icons/md';

/**
 * OrderSuccess Component
 * Confirmation page displayed after successful order placement
 * Provides user feedback and navigation options
 */
const OrderSuccess = () => {
  // React Router hook for navigation
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon - Visual confirmation */}
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <MdCheckCircle className="w-8 h-8 text-green-600" />
        </div>

        {/* Success Message - Main confirmation text */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. We've sent a confirmation email with your order details.
        </p>

        {/* Order Details - Email confirmation info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <MdEmail className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Order Confirmation Sent</span>
          </div>
          <p className="text-xs text-gray-600">
            Check your email for order details and tracking information
          </p>
        </div>

        {/* Action Buttons - Navigation options for user */}
        <div className="space-y-3">
          {/* View Dashboard button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View Dashboard
          </button>
          
          {/* Continue Shopping button */}
          <button
            onClick={() => navigate('/search')}
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center"
          >
            <MdShoppingBag className="w-5 h-5 mr-2" />
            Continue Shopping
          </button>
        </div>

        {/* Additional Info - Support contact information */}
        <div className="mt-6 text-xs text-gray-500">
          <p>Need help? Contact our support team</p>
          <p className="mt-1">support@dressme.com</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess; 