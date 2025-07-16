import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { VscAccount } from "react-icons/vsc";
import { MdShoppingBag } from "react-icons/md";
import { HiMenu, HiX } from "react-icons/hi";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { user } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="text-2xl font-bold cursor-pointer text-gray-900 hover:text-gray-700 transition-colors"
            onClick={() => navigate("/")}
          >
            DressMe
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {["men", "women", "kids"].map((category) => (
              <button
                key={category}
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                onClick={() => {
                  navigate(`/search?category=${category}`);
                  closeMenu();
                }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Shopping Bag Icon with Cart Count */}
            <button 
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => navigate("/cart")}
            >
              <MdShoppingBag className="w-6 h-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* Account Icon */}
            <button
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => user ? navigate("/dashboard") : navigate("/login")}
            >
              <VscAccount className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isMenuOpen ? (
                <HiX className="w-6 h-6" />
              ) : (
                <HiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {["men", "women", "kids"].map((category) => (
                  <button
                    key={category}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => {
                      navigate(`/search?category=${category}`);
                      closeMenu();
                    }}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              {/* Mobile Icons */}
              <div className="flex items-center justify-around pt-4 border-t border-gray-200">
                <button 
                  className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => {
                    navigate("/cart");
                    closeMenu();
                  }}
                >
                  <MdShoppingBag className="w-6 h-6" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </button>

                <button
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => {
                    user ? navigate("/dashboard") : navigate("/login");
                    closeMenu();
                  }}
                >
                  <VscAccount className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
