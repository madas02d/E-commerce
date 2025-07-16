import createError from "http-errors";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// Get order details
export const getOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        
        const order = await Order.findById(orderId)
            .populate({
                path: 'items.product',
                select: 'title price category image'
            })
            .populate('userId', 'fullName email');
        
        if (!order) {
            throw createError(404, "Order not found");
        }

        res.status(200).json({
            success: true,
            message: "Order retrieved successfully",
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// Create new order from request body items
export const createOrder = async (req, res, next) => {
    try {
        console.log('Order creation request body:', req.body);
        const { address, phone, items } = req.body;
        const userId = req.user._id;  // From checkToken middleware

        if (!items || items.length === 0) {
            throw createError(400, "No items provided for order");
        }

        // Calculate total amount from provided items
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            // You might want to validate the product exists and get its price
            // For now, we'll assume the price is provided in the item
            const itemTotal = (item.price || 0) * item.quantity;
            totalAmount += itemTotal;
            
            orderItems.push({
                product: item.productId,
                quantity: item.quantity
            });
        }

        // Create order from provided items
        const order = await Order.create({
            userId,
            items: orderItems,
            address,
            phone,
            totalAmount
        });

        // Populate order details
        const populatedOrder = await Order.findById(order._id)
            .populate({
                path: 'items.product',
                select: 'title price category image'
            })
            .populate('userId', 'fullName email');

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: populatedOrder
        });
    } catch (error) {
        next(error);
    }
};

// Get all orders for a user
export const getUserOrders = async (req, res, next) => {
    try {
        const userId = req.user._id;  // From checkToken middleware

        const orders = await Order.find({ userId })
            .populate({
                path: 'items.product',
                select: 'title price category image'
            })
            .sort({ createdAt: -1 });  // Most recent first

        console.log('User orders with populated data:', JSON.stringify(orders, null, 2));

        res.status(200).json({
            success: true,
            message: "User orders retrieved successfully",
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// Cancel order (if needed)
export const cancelOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        const order = await Order.findOneAndDelete({ 
            _id: orderId,
            userId  // Ensure user can only cancel their own orders
        });

        if (!order) {
            throw createError(404, "Order not found or unauthorized");
        }

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully"
        });
    } catch (error) {
        next(error);
    }
};
