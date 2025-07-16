import express from "express";
import { getCart, addToCart, updateQuantityInCart, removeCartItem } from "../controllers/cartController.js";

const router = express.Router();


router
.get("/:cartId", getCart)
.post("/:cartId/add", addToCart)
.patch("/:cartId/update", updateQuantityInCart)
.delete("/:cartId/remove", removeCartItem);

export default router;
