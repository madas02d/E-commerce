import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { MdShoppingCart, MdDelete } from 'react-icons/md';

/**
 * CartPreview Component
 * Shows a quick preview of cart items in a dropdown or modal
 */
const CartPreview = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, getCartTotal, getCartCount } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Cart ({getCartCount()})</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <MdShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-2" />
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item._id || item.id} className="flex items-center p-3 border-b hover:bg-gray-50">
                <img
                  src={item.image}
                  alt={item.title || item.name}
                  className="w-12 h-12 object-cover rounded mr-3"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title || item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-sm text-orange-600 font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item._id || item.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <MdDelete className="w-4 h-4" />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
      
      {cart.length > 0 && (
        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold">Total:</span>
            <span className="text-lg font-bold text-orange-600">
              ${getCartTotal().toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => {
              navigate('/cart');
              onClose();
            }}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
          >
            View Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPreview;
