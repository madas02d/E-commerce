import React, { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navabar";
import Banner from "../components/Banner";
import { useLocation } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { MdShoppingBag } from "react-icons/md";
import { AiFillHeart, AiOutlineSearch } from "react-icons/ai";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useFavorite } from "../context/FavoriteContext";
import axios from "../utils/axios";
import Toast from "../components/Toast";
import { trackTidioEvent, TIDIO_CONFIG } from "../config/tidio"; 

/**
 * SearchPage Component - Product search and filtering interface
 * 
 * Features:
 * - Search products by title/description
 * - Filter by category (men/women/kids)
 * - Sort by price (low-high, high-low)
 * - Add items to wishlist
 * - Add items to cart
 * - Responsive grid layout
 * - Real-time search filtering
 */
function SearchPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get("category") || "all"; 
    const searchQuery = queryParams.get("query") || ""; // Get search query from URL
    const { addToCart, getCartCount } = useCart();
    const { user } = useContext(AuthContext);
    const { favorites, toggleFavorite, loading: wishlistLoading } = useFavorite();

    // State Variables
    const [dresses, setDresses] = useState([]); // Stores all fetched products
    const [filteredDresses, setFilteredDresses] = useState([]); // Shows results based on filters
    const [category, setCategory] = useState(initialCategory);
    const [priceSort, setPriceSort] = useState("default");
    const [searchTerm, setSearchTerm] = useState(searchQuery); // Add search term state
    const [addingToCart, setAddingToCart] = useState({});
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' }); 

    /**
     * Fetch all products from backend on component mount
     * Sets both dresses and filteredDresses initially
     */
    useEffect(() => {
        const fetchDresses = async () => {
            try {
                const response = await axios.get("/products");
                const data = response.data.data;
    
                setDresses(data); // Store products from backend
                setFilteredDresses(data); // Show products initially
    
                console.log("Fetched Products from Backend:", data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
    
        fetchDresses();
    }, []);

    /**
     * Apply filters and sorting dynamically
     * Runs whenever dresses, category, searchTerm, or priceSort changes
     */
    useEffect(() => {
        let filtered = [...dresses];

        // Category Filter - filter by product category
        if (category !== "all") {
            filtered = filtered.filter(dress => 
                dress.category.toLowerCase() === category.toLowerCase()
            );
        }

        // Search Filter - search in title and description
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(dress =>
                (dress.title && dress.title.toLowerCase().includes(searchLower)) ||
                (dress.description && dress.description.toLowerCase().includes(searchLower))
            );
        }

        // Price Sort - sort by price ascending or descending
        if (priceSort === "low-to-high") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (priceSort === "high-to-low") {
            filtered.sort((a, b) => b.price - a.price);
        }

        setFilteredDresses(filtered);
    }, [dresses, category, searchTerm, priceSort]);

    /**
     * Handle category filter change
     * Updates category state which triggers re-filtering
     */
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    /**
     * Handle price sort change
     * Updates priceSort state which triggers re-sorting
     */
    const handlePriceSort = (e) => {
        setPriceSort(e.target.value);
    };

    /**
     * Handle search input changes
     * Updates searchTerm and tracks search events for analytics
     */
    const handleSearchChange = (e) => {
        const value = e.target.value;
        console.log("🔍 Search Input Changed:", value);
        setSearchTerm(value);
        
        // Track search queries in Tidio for analytics
        if (value.trim()) {
            trackTidioEvent(TIDIO_CONFIG.EVENTS.SEARCH, {
                query: value,
                resultsCount: 0 // Will be updated when results are filtered
            });
        }
    };

    /**
     * Toggle product in/out of wishlist
     * Requires user to be logged in
     * 
     * @param {Object} product - Product object to toggle
     */
    const handleToggleWishlist = async (product) => {
        if (!user) {
            setToast({ show: true, message: 'Please login to add items to wishlist', type: 'warning' });
            return;
        }

        try {
            await toggleFavorite(product._id);
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            setToast({ show: true, message: 'Failed to update wishlist', type: 'error' });
        }
    };

    /**
     * Truncate product title to specified word limit
     * Adds "..." if title is longer than limit
     * 
     * @param {string} title - Product title to truncate
     * @param {number} wordLimit - Maximum number of words to show
     * @returns {string} Truncated title
     */
    const truncateTitle = (title, wordLimit = 3) => {
        const words = title.split(" ");
        return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : title;
    };

    /**
     * Truncate product description to specified word limit
     * Adds "..." if description is longer than limit
     * 
     * @param {string} description - Product description to truncate
     * @param {number} wordLimit - Maximum number of words to show
     * @returns {string} Truncated description or empty string if no description
     */
    const truncateDescription = (description, wordLimit = 10) => {
        if (!description) return "";
        const words = description.split(" ");
        return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : description;
    };

    return (
        <div>
            <Banner />
            
            {/* Search and Filter Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        {/* Search Input */}
                        <div className="flex-1">
                            <div className="relative">
                                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search for products..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        {/* Category Filter Dropdown */}
                        <div className="sm:w-48">
                            <select
                                value={category}
                                onChange={handleCategoryChange}
                                className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                            >
                                <option value="all">All Categories</option>
                                <option value="men">Men</option>
                                <option value="women">Women</option>
                                <option value="kids">Kids</option>
                            </select>
                        </div>

                        {/* Price Sort Dropdown */}
                        <div className="sm:w-48">
                            <select
                                value={priceSort}
                                onChange={handlePriceSort}
                                className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                            >
                                <option value="default">Sort by Price</option>
                                <option value="low-to-high">Price: Low to High</option>
                                <option value="high-to-low">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Results Header */}
                <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        Search Results
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                        {filteredDresses.length} products found
                    </p>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {filteredDresses.length > 0 ? (
                        filteredDresses.map((dress) => (
                            <div
                                key={dress._id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-[420px]"
                            >
                                {/* Product Image with Wishlist Button */}
                                <div className="relative group">
                                    <img
                                        src={dress.image}
                                        alt={dress.title}
                                        className="w-full h-60 object-cover object-top rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                                    />

                                    {/* Wishlist Heart Icon */}
                                    <button
                                        className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition disabled:opacity-50"
                                        onClick={() => handleToggleWishlist(dress)}
                                        disabled={wishlistLoading}
                                    >
                                        {wishlistLoading ? (
                                            <div className="w-6 h-6 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                                        ) : favorites.has(dress._id) ? (
                                            <AiFillHeart className="w-6 h-6 text-red-500" /> // Filled heart
                                        ) : (
                                            <CiHeart className="w-6 h-6 text-gray-600" /> // Outline heart
                                        )}
                                    </button>
                                </div>

                                {/* Product Information */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 line-clamp-2">
                                            {truncateTitle(dress.title)}
                                        </h3>
                                        <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">
                                            {truncateDescription(dress.description)}
                                        </p>
                                        <p className="text-gray-500 text-xs sm:text-sm mb-3">
                                            {dress.category}
                                        </p>
                                        <p className="text-lg sm:text-xl font-bold text-gray-900">
                                            €{dress.price}
                                        </p>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <div className="mt-4">
                                        <button 
                                            className={`w-full py-3 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center space-x-2 ${
                                                addingToCart[dress._id] 
                                                    ? 'bg-gray-400 cursor-not-allowed' 
                                                    : 'bg-orange-500 hover:bg-orange-600 hover:shadow-lg text-white'
                                            }`}
                                            onClick={async () => {
                                                if (!addingToCart[dress._id]) {
                                                    setAddingToCart(prev => ({ ...prev, [dress._id]: true }));
                                                    try {
                                                        await addToCart(dress);
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
                        /* Empty State - No products found */
                        <div className="col-span-full text-center py-12">
                            <AiOutlineSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-600">Try adjusting your search criteria or browse all categories</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Toast Notification */}
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

export default SearchPage;
