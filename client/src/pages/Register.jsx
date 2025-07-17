// Import React hooks and context for state management
import React, { useState, useContext } from "react";
// Import React Router hooks for navigation
import { useNavigate, Link } from "react-router-dom";
// Import axios instance for API calls
import axios from "../utils/axios";
// Import authentication context for user registration
import { AuthContext } from "../context/AuthContext";
// Import social media icons for registration options
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
// Import company logo
import dmlogo from "../assets/dmlogo.png";
// Import validation utilities for form validation and input sanitization
import { validateRegistrationForm, sanitizeInput } from "../utils/validation";

/**
 * Register Component
 * Handles new user registration with form validation and social registration options
 */
const Register = () => {
  // React Router hook for programmatic navigation
  const navigate = useNavigate();
  // Get login function from authentication context to auto-login after registration
  const { loginUser } = useContext(AuthContext);
  
  // Form state management with all registration fields
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  // Validation errors state
  const [errors, setErrors] = useState({});
  // General error message state
  const [errorMsg, setErrorMsg] = useState("");

  /**
   * Handle input field changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Handle form submission for user registration
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setErrors({});

    // Sanitize all input data to prevent XSS attacks
    const sanitizedData = {
      fullName: sanitizeInput(formData.fullName),
      email: sanitizeInput(formData.email),
      password: formData.password,
      confirmPassword: formData.confirmPassword
    };

    // Validate form data using validation utility
    const validation = validateRegistrationForm(sanitizedData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      // Extract registration data (excluding confirmPassword)
      const { fullName, email, password } = sanitizedData;
      
      // Send registration request to backend API
      const response = await axios.post("/users/register", { fullName, email, password });
      const { data: userData } = response.data;
      
      // Auto-login user after successful registration
      loginUser(userData);
      
      // Redirect to homepage
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMsg(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    // Main container with responsive padding
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      {/* Registration form container */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          {/* Header section with logo and title */}
          <div className="text-center mb-6">
            <img src={dmlogo} alt="Logo" className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Create an Account</h2>
            <p className="text-sm text-gray-600">Join DressMe and start your fashion journey</p>
          </div>
          
          {/* Error message display */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{errorMsg}</p>
            </div>
          )}

          {/* Registration form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name input field */}
            <div>
              <label htmlFor="fullName" className="sr-only">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full px-3 py-2 border rounded-lg text-sm sm:text-base transition-colors ${
                  errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email input field */}
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full px-3 py-2 border rounded-lg text-sm sm:text-base transition-colors ${
                  errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password input field */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className={`w-full px-3 py-2 border rounded-lg text-sm sm:text-base transition-colors ${
                  errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password input field */}
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`w-full px-3 py-2 border rounded-lg text-sm sm:text-base transition-colors ${
                  errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              Create Account
            </button>
          </form>

          {/* Login link for existing users */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Social registration section */}
          <div className="mt-6">
            {/* Divider with "Or continue with" text */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social registration buttons */}
            <div className="mt-6 space-y-3">
              {/* Google registration button */}
              <button 
                onClick={() => alert('Google registration functionality coming soon!')}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <FaGoogle className="text-red-500 mr-3 text-lg" />
                <span>Continue with Google</span>
              </button>

              {/* Apple registration button */}
              <button 
                onClick={() => alert('Apple registration functionality coming soon!')}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <FaApple className="text-black mr-3 text-lg" />
                <span>Continue with Apple</span>
              </button>

              {/* Facebook registration button */}
              <button 
                onClick={() => alert('Facebook registration functionality coming soon!')}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <FaFacebook className="text-blue-600 mr-3 text-lg" />
                <span>Continue with Facebook</span>
              </button>
            </div>
          </div>

          {/* Terms and Privacy Policy links */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              By creating an account, you agree to our{" "}
              <Link to="/terms" className="text-blue-600 hover:text-blue-800 underline">
                Terms of Use
              </Link>
              . Learn how we handle your data in our{" "}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                Privacy Notice
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 