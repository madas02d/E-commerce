// Import required middleware and utilities
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./utils/database.js";

// Import route handlers for different API endpoints
import usersRouter from "./routes/usersRouter.js";
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import ordersRouter from "./routes/ordersRouter.js";
import wishlistRouter from "./routes/wishlistRouter.js";

// Import error handling middleware
import {
  globalErrorHandler,
  routeNotFound,
} from "./middleware/errorHandlers.js";
import user from "./models/User.js"

// Initialize database connection
await connectDB();

// Create Express application instance
const app = express();

// Set server port from environment variables or default to 5002
const PORT = process.env.PORT || 5002;

// Configure CORS (Cross-Origin Resource Sharing) middleware
// Allows requests from specified origins (frontend development servers and production)
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "http://localhost:5174",
      "https://your-app.vercel.app", // Replace with your actual Vercel domain
      "https://your-app-git-main-your-username.vercel.app" // Replace with your actual Vercel preview domain
    ], 
    credentials: true, // Allow cookies and authentication headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed request headers
  })
);

// Parse JSON request bodies
app.use(express.json());

// Parse cookies from incoming requests
app.use(cookieParser());

// Register API routes with their respective base paths
app.use('/users', usersRouter);        // User authentication and management
app.use("/products", productsRouter);   // Product catalog and details
app.use("/carts", cartsRouter);        // Shopping cart operations
app.use("/orders", ordersRouter);      // Order processing and management
app.use("/wishlist", wishlistRouter);  // User wishlist functionality

// Error handling middleware (must be registered after routes)
app.use(routeNotFound);        // Handle 404 errors for undefined routes
app.use(globalErrorHandler);   // Global error handler for all other errors

// Start the server and listen on specified port
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));