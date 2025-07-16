import createError from "http-errors";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Get cart details with product information
export const getCart = async (req, res, next) => {
    try {
        const { cartId } = req.params;
        
        const cart = await Cart.findById(cartId)
            .populate({
                path: 'items.product',
                select: 'title price category image' // Removed size from selection
            });
        
        if (!cart) {
            throw createError(404, "Cart not found");
        }

        res.status(200).json({
            success: true,
            message: "Cart retrieved successfully",
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

// Add product to cart with size
export const addToCart = async (req, res, next) => {
    try {
        const { cartId } = req.params;
        const { productId, selectedSize, quantity = 1 } = req.body;

        // Check if product exists and has the requested size
        const product = await Product.findById(productId);
        if (!product) {
            throw createError(404, "Product not found");
        }

        // Check if size is available and has stock
        if (!product.size[selectedSize] || product.size[selectedSize].quantity < quantity) {
            throw createError(400, "Selected size is not available or insufficient stock");
        }

        const cart = await Cart.findByIdAndUpdate(
            cartId,
            { 
                $push: { 
                    items: {
                        product: productId,
                        selectedSize,
                        quantity
                    }
                } 
            },
            { new: true }
        ).populate({
            path: 'items.product',
            select: 'title price category image' // Removed size from selection
        });

        if (!cart) {
            throw createError(404, "Cart not found");
        }

        res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

// Update quantity in cart

export const updateQuantityInCart = async (req, res, next) => {
    try {
        const { cartId } = req.params;
        const { productId, selectedSize, quantity } = req.body;
        if (quantity < 1) {
            throw createError(400, "Quantity must be at least 1");
        }
        // Find the product
        const product = await Product.findById(productId);
        if (!product || !product.size[selectedSize]) {
            throw createError(404, "Product or selected size not found");
        }
        // Get the cart
        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw createError(404, "Cart not found");
        }
        // Find the item in the cart
        const cartItem = cart.items.find(
            (item) => item.product.toString() === productId && item.selectedSize === selectedSize
        );
        if (!cartItem) {
            throw createError(404, "Product not found in cart");
        }
        // Check if requested quantity is available
        const availableStock = product.size[selectedSize].quantity;
        if (quantity > availableStock) {
            throw createError(400, "Insufficient stock available");
        }
        // Update the quantity in cart
        cartItem.quantity = quantity;
        await cart.save();
        // Respond with updated cart
        await cart.populate({
            path: 'items.product',
            select: 'title price category image' // Removed size from selection
        });
        res.status(200).json({
            success: true,
            message: "Cart item updated successfully",
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};
// Remove product from cart
export const removeCartItem = async (req, res, next) => {
    try {
        const { cartId } = req.params;
        const { productId } = req.body;

        const cart = await Cart.findByIdAndUpdate(
            cartId,
            { 
                $pull: { 
                    items: { 
                        product: productId 
                    } 
                } 
            },
            { new: true }
        ).populate({
            path: 'items.product',
            select: 'title price category image' // Removed size from selection
        });

        if (!cart) {
            throw createError(404, "Cart not found");
        }

        res.status(200).json({
            success: true,
            message: "Product removed from cart successfully",
            data: cart
        });
    } catch (error) {
        next(error);
    }
}; 