import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-3">DressMe</h3>
            <p className="text-sm text-gray-400">
              Your one-stop shop for the latest fashion for men, women, and kids.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/search?category=men" className="hover:text-white transition-colors">Men</a></li>
              <li><a href="/search?category=women" className="hover:text-white transition-colors">Women</a></li>
              <li><a href="/search?category=kids" className="hover:text-white transition-colors">Kids</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="/wishlist" className="hover:text-white transition-colors">Wishlist</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Get in touch</h4>
            <p className="text-sm text-gray-400 mb-3">Have questions? We'd love to hear from you.</p>
            <a href="mailto:support@dressme.shop" className="inline-block bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">Contact Support</a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-sm flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400">© {currentYear} DressMe. All rights reserved.</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 