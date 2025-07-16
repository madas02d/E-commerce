import React, { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navabar"
import Hero from "../assets/Hero.jpeg"
import Banner from "../components/Banner";
import { CiHeart } from "react-icons/ci";
import { MdShoppingBag } from "react-icons/md";
import { AiFillHeart } from "react-icons/ai";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useFavorite } from "../context/FavoriteContext";
import axios from "../utils/axios";
import Toast from "../components/Toast";
import { trackTidioEvent, TIDIO_CONFIG } from "../config/tidio";

function Homepage() {
    const { addToCart, getCartCount } = useCart();
    const { user } = useContext(AuthContext);
    const { favorites, toggleFavorite, loading: wishlistLoading } = useFavorite();

    // State Variables
    const [dresses, setDresses] = useState([]); // Stores all fetched products
    const [addingToCart, setAddingToCart] = useState({});
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Fetch All Products 
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

    // Wishlist Toggle
    const handleToggleWishlist = async (product) => {
        if (!user) {
            setToast({ show: true, message: 'Please login to add items to wishlist', type: 'warning' });
            return;
        }

        try {
            await toggleFavorite(product._id);
            
            // Track Tidio event
            if (favorites.has(product._id)) {
                trackTidioEvent(TIDIO_CONFIG.EVENTS.WISHLIST_REMOVE, {
                    productId: product._id,
                    productName: product.title,
                    productPrice: product.price,
                    category: product.category
                });
            } else {
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

    // Helper Functions
    const truncateTitle = (title, wordLimit = 3) => {
        const words = title.split(" ");
        return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : title;
    };

    const truncateDescription = (description, wordLimit = 10) => {
        if (!description) return "";
        const words = description.split(" ");
        return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : description;
    };

    return (
        <div>
            <Banner />
            
            {/* Hero Section */}
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

            {/* Products Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-merriweather">
                        Featured Collection
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                        Discover our latest fashion pieces curated just for you
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {dresses.length > 0 ? (
                        dresses.map((dress) => (
                            <div
                                key={dress._id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-[420px] sm:h-[450px]"
                            >
                                {/* Image + Heart Icon */}
                                <div className="relative group">
                                    <img
                                        src={dress.image}
                                        alt={dress.title}
                                        className="w-full h-48 sm:h-60 object-cover object-top rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                                    />

                                    {/* Heart Icon (Top Right) */}
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

                                {/* Product Info */}
                                <div className="p-4 sm:p-6 flex-1 flex flex-col">
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
                                                        
                                                        // Track Tidio event
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
                        <div className="col-span-full text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading products...</p>
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

export default Homepage; 