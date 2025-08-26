import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { FavoriteProvider } from "./context/FavoriteContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ErrorBoundary from "./components/ErrorBoundary";
// import TidioChat from "./components/TidioChat";

import Navbar from "./components/Navabar";
import Homepage from "./pages/Homepage";
import Searchpage from "./pages/Searchpage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

const App = () => {
  return (
    <React.Fragment>
      <ErrorBoundary>
        <AuthProvider>
          <CartProvider>
            <FavoriteProvider>
              <div className="min-h-screen flex flex-col">
                {/* <TidioChat /> */}
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/search" element={<Searchpage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } />
                    <Route path="/order-success" element={
                      <ProtectedRoute>
                        <OrderSuccess />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/wishlist" element={
                      <ProtectedRoute>
                        <Wishlist />
                      </ProtectedRoute>
                    } />
                    <Route path="/orders" element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    } />
                    {/* Redirect any unknown routes to /login */}
                    <Route path="*" element={<Navigate to="/login" />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </FavoriteProvider>
          </CartProvider>
        </AuthProvider>
      </ErrorBoundary>
    </React.Fragment>
  );
};

export default App;
