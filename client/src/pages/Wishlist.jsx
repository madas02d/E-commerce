import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorite } from '../context/FavoriteContext';
import axios from '../utils/axios';
import { 
  MdArrowBack, 
  MdShoppingCart, 
  MdDelete, 
  MdFavorite 
} from 'react-icons/md';
import { AiOutlineHeart } from 'react-icons/ai';

/**
 * Wishlist Component - Displays and manages user's saved products
 * 
 * Features:
 * - View all saved products
 * - Remove items from wishlist
 * - Add items to cart from wishlist
 * - Clear entire wishlist
 * - Responsive grid layout
 */
const Wishlist = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useCart();
  const { refreshWishlist } = useFavorite();
  
  // Local state for wishlist items (separate from context for UI management)
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Fetch user's wishlist from backend on component mount
   */
  useEffect(() => {
    fetchWishlist();
  }, []);

  /**
   * Fetch wishlist data from backend API
   * Handles loading states and error handling
   */
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/wishlist');
      setWishlist(response.data.data.products || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setError('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove a product from user's wishlist
   * Updates local state and refreshes context
   * 
   * @param {string} productId - ID of product to remove
   */
  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`/wishlist/remove/${productId}`);
      // Update local state by filtering out removed item
      setWishlist(prev => prev.filter(item => item.product._id !== productId));
      // Refresh the navbar wishlist count (if it exists)
      refreshWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      setError('Failed to remove item from wishlist');
    }
  };

  /**
   * Add a product from wishlist to cart
   * Optionally removes it from wishlist after adding to cart
   * 
   * @param {Object} product - Product object to add to cart
   */
  const addToCartFromWishlist = async (product) => {
    try {
      await addToCart(product.product, 1);
      // Optionally remove from wishlist after adding to cart
      await removeFromWishlist(product.product._id);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add item to cart');
    }
  };

  /**
   * Clear entire wishlist
   * Removes all items from user's wishlist
   */
  const clearWishlist = async () => {
    try {
      await axios.delete('/wishlist/clear');
      setWishlist([]);
      // Refresh the navbar wishlist count
      refreshWishlist();
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      setError('Failed to clear wishlist');
    }
  };

  // Loading state - show spinner while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {/* Back button */}
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900"
              >
                <MdArrowBack className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
                <p className="text-gray-600">{wishlist.length} items saved</p>
              </div>
            </div>
            {/* Clear all button - only show if wishlist has items */}
            {wishlist.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error message display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Empty state - show when no items in wishlist */}
        {wishlist.length === 0 ? (
          <div className="text-center py-12">
            <AiOutlineHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Start shopping to add items to your wishlist</p>
            <button
              onClick={() => navigate('/search')}
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          /* Product Grid - display wishlist items */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist
              .filter(item => item.product && item.product._id) // Safety check for null products
              .map((item) => (
                <div key={item.product._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Product Image with Remove Button */}
                  <div className="relative">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-full h-48 object-cover"
                    />
                    {/* Remove from wishlist button */}
                    <button
                      onClick={() => removeFromWishlist(item.product._id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                    >
                      <MdDelete className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                  
                  {/* Product Information */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.product.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {item.product.category}
                    </p>
                    <p className="text-lg font-bold text-gray-900 mb-4">
                      €{item.product.price}
                    </p>
                    
                    {/* Add to Cart Button */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => addToCartFromWishlist(item)}
                        className="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center"
                      >
                        <MdShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </button>
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

export default Wishlist; 