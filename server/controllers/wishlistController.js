import createError from "http-errors";
import Wishlist from "../models/Wishlist.js";

// Get user's wishlist
export const getWishlist = async (req, res, next) => {
    try {
        const userId = req.user._id;

        let wishlist = await Wishlist.findOne({ userId })
            .populate({
                path: 'products.product',
                select: 'title price category image'
            });

        if (!wishlist) {
            // Create empty wishlist if it doesn't exist
            wishlist = await Wishlist.create({ userId, products: [] });
        }

        res.status(200).json({
            success: true,
            message: "Wishlist retrieved successfully",
            data: wishlist
        });
    } catch (error) {
        next(error);
    }
};

// Add product to wishlist
export const addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = await Wishlist.create({ userId, products: [] });
        }

        // Check if product is already in wishlist
        const existingProduct = wishlist.products.find(
            item => item.product.toString() === productId
        );

        if (existingProduct) {
            throw createError(400, "Product already in wishlist");
        }

        wishlist.products.push({ product: productId });
        await wishlist.save();

        const populatedWishlist = await Wishlist.findById(wishlist._id)
            .populate({
                path: 'products.product',
                select: 'title price category image'
            });

        res.status(200).json({
            success: true,
            message: "Product added to wishlist",
            data: populatedWishlist
        });
    } catch (error) {
        next(error);
    }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        const wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            throw createError(404, "Wishlist not found");
        }

        wishlist.products = wishlist.products.filter(
            item => item.product.toString() !== productId
        );

        await wishlist.save();

        const populatedWishlist = await Wishlist.findById(wishlist._id)
            .populate({
                path: 'products.product',
                select: 'title price category image'
            });

        res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
            data: populatedWishlist
        });
    } catch (error) {
        next(error);
    }
};

// Clear wishlist
export const clearWishlist = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            throw createError(404, "Wishlist not found");
        }

        wishlist.products = [];
        await wishlist.save();

        res.status(200).json({
            success: true,
            message: "Wishlist cleared successfully",
            data: wishlist
        });
    } catch (error) {
        next(error);
    }
}; 