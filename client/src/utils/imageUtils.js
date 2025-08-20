/**
 * Utility functions for handling images in the application
 */

// Default fallback image URL
export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop';

/**
 * Handle image loading errors with fallback
 * @param {Event} e - The error event
 * @param {string} fallbackUrl - Optional custom fallback URL
 */
export const handleImageError = (e, fallbackUrl = FALLBACK_IMAGE) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = fallbackUrl;
};

/**
 * Preload an image to check if it's accessible
 * @param {string} imageUrl - The URL to check
 * @returns {Promise<boolean>} - True if image loads successfully, false otherwise
 */
export const preloadImage = (imageUrl) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = imageUrl;
    });
};

/**
 * Get a category-specific fallback image
 * @param {string} category - Product category
 * @returns {string} - Fallback image URL for the category
 */
export const getCategoryFallbackImage = (category) => {
    const categoryImages = {
        'Women': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop',
        'Men': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
        'Unisex': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
        'Kids': 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=500&fit=crop'
    };
    
    return categoryImages[category] || FALLBACK_IMAGE;
}; 