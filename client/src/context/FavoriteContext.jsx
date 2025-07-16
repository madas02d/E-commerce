import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../utils/axios';
import { AuthContext } from './AuthContext';

/**
 * FavoriteContext - Manages user's wishlist/favorites functionality
 * 
 * This context provides:
 * - State management for user's favorite products
 * - API integration with backend wishlist endpoints
 * - Real-time synchronization between frontend and backend
 * - Error handling and loading states
 */
export const FavoriteContext = createContext();

/**
 * FavoriteProvider - Context provider for wishlist functionality
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 */
export const FavoriteProvider = ({ children }) => {
    // State to store favorite product IDs as a Set for O(1) lookup
    const [favorites, setFavorites] = useState(new Set());
    // Loading state for API operations
    const [loading, setLoading] = useState(false);
    // Get current user from AuthContext
    const { user } = useContext(AuthContext);

    /**
     * Fetch user's wishlist from backend when user changes
     * Clears favorites when user logs out
     */
    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            // Clear favorites when user logs out
            setFavorites(new Set());
        }
    }, [user]);

    /**
     * Fetch user's wishlist from backend API
     * Filters out any products that might be null/deleted
     */
    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/wishlist');
            const wishlistItems = response.data.data.products || [];
            
            // Filter out null products and extract product IDs
            const favoriteIds = new Set(
                wishlistItems
                    .filter(item => item.product && item.product._id) // Safety check for null products
                    .map(item => item.product._id)
            );
            setFavorites(favoriteIds);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Toggle favorite status for a product
     * Adds to wishlist if not favorited, removes if already favorited
     * 
     * @param {string} productId - The product ID to toggle
     * @throws {Error} If user is not logged in
     */
    const toggleFavorite = async (productId) => {
        if (!user) {
            throw new Error('Please login to add items to wishlist');
        }

        try {
            console.log('🔄 Toggling favorite for product:', productId);
            console.log('📊 Current favorites:', Array.from(favorites));
            setLoading(true);
            
            if (favorites.has(productId)) {
                // Remove from wishlist
                console.log('🗑️ Removing from wishlist:', productId);
                await axios.delete(`/wishlist/remove/${productId}`);
                setFavorites(prev => {
                    const newFavorites = new Set(prev);
                    newFavorites.delete(productId);
                    console.log('✅ Updated favorites after removal:', Array.from(newFavorites));
                    return newFavorites;
                });
            } else {
                // Add to wishlist
                console.log('➕ Adding to wishlist:', productId);
                await axios.post('/wishlist/add', { productId });
                setFavorites(prev => {
                    const newFavorites = new Set(prev);
                    newFavorites.add(productId);
                    console.log('✅ Updated favorites after addition:', Array.from(newFavorites));
                    return newFavorites;
                });
            }
            
            // Small delay to ensure state update is processed
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            console.error('❌ Error toggling wishlist:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Check if a product is in user's favorites
     * 
     * @param {string} productId - The product ID to check
     * @returns {boolean} True if product is favorited
     */
    const isFavorite = (productId) => {
        return favorites.has(productId);
    };

    /**
     * Get all favorite product IDs as an array
     * 
     * @returns {string[]} Array of favorite product IDs
     */
    const getFavorites = () => {
        return [...favorites];
    };

    /**
     * Clear all favorites from user's wishlist
     * Only works if user is logged in
     */
    const clearFavorites = async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            await axios.delete('/wishlist/clear');
            setFavorites(new Set());
        } catch (error) {
            console.error('Error clearing wishlist:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Refresh wishlist from backend
     * Useful for syncing after external changes
     */
    const refreshWishlist = () => {
        if (user) {
            fetchWishlist();
        }
    };

    // Context value object - all functions and state to expose
    const value = {
        favorites,           // Set of favorite product IDs
        toggleFavorite,      // Function to add/remove from favorites
        isFavorite,         // Function to check if product is favorited
        getFavorites,       // Function to get all favorite IDs
        clearFavorites,     // Function to clear all favorites
        refreshWishlist,    // Function to refresh from backend
        loading            // Loading state for UI feedback
    };

    return (
        <FavoriteContext.Provider value={value}>
            {children}
        </FavoriteContext.Provider>
    );
};

/**
 * Custom hook to use the FavoriteContext
 * Provides type safety and error handling
 * 
 * @returns {Object} FavoriteContext value
 * @throws {Error} If used outside of FavoriteProvider
 */
export const useFavorite = () => {
    const context = useContext(FavoriteContext);
    if (context === undefined) {
        throw new Error('useFavorite must be used within a FavoriteProvider');
    }
    return context;
};