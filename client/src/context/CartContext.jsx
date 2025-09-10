import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../utils/axios';
import { AuthContext } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (product) => {
    try {
      setLoading(true);
      
      // Normalize product ID - use _id if available, otherwise use id
      const productId = product._id || product.id;
      
      // Use local storage for cart management (simpler and more reliable)
      const existingItem = cart.find(item => {
        const itemId = item._id || item.id;
        return itemId === productId;
      });
      
      if (existingItem) {
        setCart(cart.map(item => {
          const itemId = item._id || item.id;
          return itemId === productId 
            ? { ...item, quantity: item.quantity + 1 }
            : item;
        }));
      } else {
        // Ensure the product has both _id and id for compatibility
        const normalizedProduct = {
          ...product,
          _id: productId,
          id: productId,
          // Ensure we have the required fields for display
          title: product.name || product.title,
          image: product.image,
          price: product.price
        };
        setCart([...cart, { ...normalizedProduct, quantity: 1 }]);
      }
      
      return { success: true, message: 'Product added to cart' };
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      setCart(cart.filter(item => {
        const itemId = item._id || item.id;
        return itemId !== productId;
      }));
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      setCart(cart.map(item => {
        const itemId = item._id || item.id;
        return itemId === productId 
          ? { ...item, quantity: Math.max(0, quantity) }
          : item;
      }));
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setCart([]);
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Still clear local cart even if there's an error
      setCart([]);
      localStorage.removeItem('cart');
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartItems = () => {
    return cart;
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    getCartItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
