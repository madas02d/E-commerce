// Example structure for productController.js
import createError from "http-errors";
import Product from "../models/Product.js";



// Get all products
export const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        
        res.status(200).json({
            success: true,
            message: "Products retrieved successfully",
            data: products
        });
    } catch (error) {
        next(error);
    }
};

// Get single product
export const getProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        
        if (!product) {
            throw createError(404, "Product not found");
        }

        res.status(200).json({
            success: true,
            message: "Product retrieved successfully",
            data: product
        });
    } catch (error) {
        next(error);
    }
};
