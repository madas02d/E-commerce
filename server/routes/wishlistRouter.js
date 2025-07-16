import express from "express";
import { 
    getWishlist, 
    addToWishlist, 
    removeFromWishlist, 
    clearWishlist 
} from "../controllers/wishlistController.js";
import checkToken from "../middleware/checkToken.js";

const router = express.Router();

// All routes require authentication
router.use(checkToken);

// Get user's wishlist
router.get("/", getWishlist);

// Add product to wishlist
router.post("/add", addToWishlist);

// Remove product from wishlist
router.delete("/remove/:productId", removeFromWishlist);

// Clear wishlist
router.delete("/clear", clearWishlist);

export default router; 