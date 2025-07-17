// Import React hooks and context for state management
import React, { useState, useContext } from "react";
// Import authentication context for user login functionality
import { AuthContext } from "../context/AuthContext";
// Import React Router hooks for navigation
import { useNavigate, Link } from "react-router-dom";
// Import axios instance for API calls
import axios from "../utils/axios";
// Import social media icons for login options
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
// Import company logo
import dmlogo from "../assets/dmlogo.png";

/**
 * Login Component
 * Handles user authentication with email/password and social login options
 */
const Login = () => {
  // React Router hook for programmatic navigation
  const navigate = useNavigate();
  // Get login function from authentication context
  const { loginUser } = useContext(AuthContext);

  // Form state management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  /**
   * Handle form submission for user login
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validate that both email and password are provided
    if (!email || !password) {
      setErrorMsg("Both email and password are required.");
      return;
    }

    try {
      // Send login request to backend API
      const response = await axios.post("/users/login", { email, password });
      // Backend returns { success, message, data }
      const { data: userData } = response.data;
      
      // Update authentication context with user data
      loginUser(userData);
      
      // Redirect to homepage after successful login
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      // Display error message from backend or generic error
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("An error occurred during login.");
      }
    }
  };

  return (
    // Main container with centered layout
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Login form container */}
      <div className=" p-8 rounded  w-full max-w-md shadow-md">
        {/* Company logo */}
        <img src={dmlogo} alt="" className="w-16 " />

        {/* Page title */}
        <h2 className="text-xl font-bold mb-1 ">Sign in to register</h2>
        
        {/* Error message display */}
        {errorMsg && (
          <div className="mb-4 text-red-500 text-center">{errorMsg}</div>
        )}
        
        {/* Login form */}
        <form onSubmit={handleSubmit}>
          {/* Email input field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700"></label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email.."
              className="mt-1 w-full p-2 border text-xs"
            />
          </div>
          
          {/* Password input field */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700"></label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password.."
              className="mt-1 w-full p-2 border text-xs"
            />
          </div>
          
          {/* Registration link for new users */}
          <p className="mt-4 text-center text-xs mb-5">
            If you don't have an account.Please register{" "}
            <Link to="/register" className="text-blue-500">
              here
            </Link>
          </p>
          
          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-black text-xs text-white p-2  hover:bg-gray-600 transition-colors mb-5"
          >
            Continue
          </button>
        </form>

        {/* Terms and Privacy Policy links */}
        <p className="text-xs text-justify mb-5 ">
          When you create an account, you agree to our
          <Link to="./login " className="text-black underline hover:underline">
            {" "}
            Terms of Use
          </Link>
          ,
          <br />
          Learn how we handle your data in our
          <Link to="./login" className="text-black underline">
            {" "}
            Privacy Notice
          </Link>
          .
        </p>

        {/* Social Login Options */}
        <div className="space-y-4">
          {/* Google login button */}
          <button 
            onClick={() => alert('Google login functionality coming soon!')}
            className="flex items-center justify-center border p-2 w-full text-xs font-bold hover:bg-gray-100 transition-colors"
          >
            <FaGoogle className="text-red-500 mr-2 text-xl" />
            <span>Continue with Google</span>
          </button>

          {/* Apple login button */}
          <button 
            onClick={() => alert('Apple login functionality coming soon!')}
            className="flex items-center justify-center border p-2 w-full text-xs font-bold hover:bg-gray-100 transition-colors"
          >
            <FaApple className="text-black mr-2 text-xl" />
            <span>Continue with Apple</span>
          </button>

          {/* Facebook login button */}
          <button 
            onClick={() => alert('Facebook login functionality coming soon!')}
            className="flex items-center justify-center border p-2 w-full text-xs font-bold hover:bg-gray-100 transition-colors"
          >
            <FaFacebook className="text-blue-600 mr-2 text-xl" />
            <span>Continue with Facebook</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
