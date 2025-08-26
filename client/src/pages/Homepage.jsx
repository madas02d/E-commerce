// Import React hooks for state management and side effects
import { useEffect, useState, useContext } from "react";
// Import hero image asset
import Hero from "../assets/Hero.jpeg"
// Import banner component for promotional content
import Banner from "../components/Banner";
// Import icons for wishlist and shopping functionality
import { CiHeart } from "react-icons/ci";
import { MdShoppingBag } from "react-icons/md";
import { AiFillHeart } from "react-icons/ai";
// Import context hooks for cart, authentication, and favorites management
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useFavorite } from "../context/FavoriteContext";
// Import axios instance for API calls
import axios from "../utils/axios";
// Import toast notification component
import Toast from "../components/Toast";
// Import Tidio analytics tracking utilities
import { trackTidioEvent, TIDIO_CONFIG } from "../config/tidio";
// Import image utilities
import { handleImageError, getCategoryFallbackImage } from "../utils/imageUtils";


/**
 * Homepage Component
 * Main landing page displaying featured products with cart and wishlist functionality
 */
function Homepage() {
    // Get cart functionality from context
    const { addToCart, getCartCount } = useCart();
    // Get current user from authentication context
    const { user } = useContext(AuthContext);
    // Get favorites functionality from context
    const { favorites, toggleFavorite, loading: wishlistLoading } = useFavorite();

    // State Variables
    const [dresses, setDresses] = useState([]); // Stores all fetched products
    const [addingToCart, setAddingToCart] = useState({}); // Tracks loading state for each product's add to cart button
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' }); // Toast notification state

    /**
     * Fetch all products from the backend API
     * Runs once when component mounts
     */
    useEffect(() => {
        const fetchDresses = async () => {
            try {
                const response = await axios.get("/products");
                const data = response.data.data;
    
                setDresses(data); // Store products from backend
    
                console.log("Fetched Clothing Products:", data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
    
        fetchDresses();
    }, []);

    /**
     * Handle wishlist toggle for a product
     * @param {Object} product - Product object to toggle in wishlist
     */
    const handleToggleWishlist = async (product) => {
        // Check if user is logged in
        if (!user) {
            setToast({ show: true, message: 'Please login to add items to wishlist', type: 'warning' });
            return;
        }

        try {
            await toggleFavorite(product._id);
            
            // Track Tidio analytics event based on action
            if (favorites.has(product._id)) {
                // Track wishlist removal
                trackTidioEvent(TIDIO_CONFIG.EVENTS.WISHLIST_REMOVE, {
                    productId: product._id,
                    productName: product.title,
                    productPrice: product.price,
                    category: product.category
                });
            } else {
                // Track wishlist addition
                trackTidioEvent(TIDIO_CONFIG.EVENTS.WISHLIST_ADD, {
                    productId: product._id,
                    productName: product.title,
                    productPrice: product.price,
                    category: product.category
                });
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            setToast({ show: true, message: 'Failed to update wishlist', type: 'error' });
        }
    };

    /**
     * Helper function to truncate product titles
     * @param {string} title - Product title to truncate
     * @param {number} wordLimit - Maximum number of words to show
     * @returns {string} Truncated title
     */
    const truncateTitle = (title, wordLimit = 3) => {
        const words = title.split(" ");
        return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : title;
    };

    /**
     * Helper function to truncate product descriptions
     * @param {string} description - Product description to truncate
     * @param {number} wordLimit - Maximum number of words to show
     * @returns {string} Truncated description
     */
    const truncateDescription = (description, wordLimit = 10) => {
        if (!description) return "";
        const words = description.split(" ");
        return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : description;
    };

    return (
        <div>
            {/* Promotional banner */}
            <Banner />
            
            {/* Hero Section with background image and overlay text */}
            <div className="relative">
                <img 
                    src={Hero} 
                    alt="Hero" 
                    className="w-full h-auto max-h-[675px] object-cover" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white font-merriweather tracking-tight leading-tight drop-shadow-lg">
                            Styled by You, <br className="hidden sm:block"/>
                            Defined by Fashion.
                        </h1>
                    </div>
                </div>
            </div>

            {/* Products Section - Featured Collection */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Section header */}
                <div className="mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-merriweather">
                        Featured Collection
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                        Discover our latest fashion pieces curated just for you
                    </p>
                </div>

                {/* Product grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
                >
                    {dresses.length > 0 ? (
                        dresses.map((dress) => (
                            <div
                                key={dress._id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-[420px] sm:h-[450px]"
                            >
                                {/* Product image with wishlist button overlay */}
                                <div className="relative group">
                                    <img
                                        src={dress.image}
                                        alt={dress.title}
                                        className="w-full h-48 sm:h-60 object-cover object-top rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => handleImageError(e, getCategoryFallbackImage(dress.category))}
                                    />

                                    {/* Wishlist heart icon (top right corner) */}
                                    <button
                                        className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition disabled:opacity-50"
                                        onClick={() => handleToggleWishlist(dress)}
                                        disabled={wishlistLoading}
                                    >
                                        {wishlistLoading ? (
                                            <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                                        ) : favorites.has(dress._id) ? (
                                            <AiFillHeart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                                        ) : (
                                            <CiHeart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                                        )}
                                    </button>
                                </div>

                                {/* Product information and add to cart button */}
                                <div className="p-4 sm:p-6 flex-1 flex flex-col">
                                    <div className="flex-1">
                                        {/* Product title */}
                                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 line-clamp-2">
                                            {truncateTitle(dress.title)}
                                        </h3>
                                        {/* Product description */}
                                        <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">
                                            {truncateDescription(dress.description)}
                                        </p>
                                        {/* Product category */}
                                        <p className="text-gray-500 text-xs sm:text-sm mb-3">
                                            {dress.category}
                                        </p>
                                        {/* Product price */}
                                        <p className="text-lg sm:text-xl font-bold text-gray-900">
                                            €{dress.price}
                                        </p>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <div className="mt-4 mb-4">
                                        {/* Login reminder for non-authenticated users */}
                                        {!user && (
                                            <p className="text-xs text-gray-500 mb-2 text-center">
                                                Login required for checkout
                                            </p>
                                        )}
                                        <button 
                                            className={`w-full py-2 sm:py-3 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base ${
                                                addingToCart[dress._id] 
                                                    ? 'bg-gray-400 cursor-not-allowed' 
                                                    : 'bg-orange-500 hover:bg-orange-600 hover:shadow-lg text-white'
                                            }`}
                                            onClick={async () => {
                                                if (!addingToCart[dress._id]) {
                                                    setAddingToCart(prev => ({ ...prev, [dress._id]: true }));
                                                    try {
                                                        await addToCart(dress);
                                                        
                                                        // Track Tidio analytics event
                                                        trackTidioEvent(TIDIO_CONFIG.EVENTS.ADD_TO_CART, {
                                                            productId: dress._id,
                                                            productName: dress.title,
                                                            productPrice: dress.price,
                                                            category: dress.category,
                                                            quantity: 1
                                                        });
                                                        
                                                        // Show success feedback
                                                        setToast({ show: true, message: 'Item added to cart successfully!', type: 'success' });
                                                    } catch (error) {
                                                        console.error('Error adding to cart:', error);
                                                        setToast({ show: true, message: 'Failed to add item to cart', type: 'error' });
                                                    } finally {
                                                        setAddingToCart(prev => ({ ...prev, [dress._id]: false }));
                                                    }
                                                }
                                            }}
                                            disabled={addingToCart[dress._id]}
                                        >
                                            {addingToCart[dress._id] ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Adding...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <MdShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    <span>Add to Cart</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        // Loading state when no products are available
                        <div className="col-span-full text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading products...</p>
                        </div>
                    )}
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
}

export default Homepage; 