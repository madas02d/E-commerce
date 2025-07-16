import express from "express";
import { 
    getOrder, 
    createOrder, 
    getUserOrders, 
    cancelOrder 
} from "../controllers/orderController.js";
import checkToken from "../middleware/checkToken.js";

const router = express.Router();

router
    .get("/user", checkToken, getUserOrders)        // Get all orders for user
    .get("/:orderId", checkToken, getOrder)         // Get specific order
    .post("/create", checkToken, createOrder)       // Create new order
    .delete("/:orderId", checkToken, cancelOrder);  // Cancel order

export default router;