import express from "express";
import {
    register,
    login,
    logout,
    updateProfile,
    getUserStats,
    verifyToken
} from "../controllers/userController.js";
import checkToken from "../middleware/checkToken.js";

const router = express.Router();

router
.post("/register", register)
.post("/login", login)
.post("/logout", checkToken, logout)
.get("/verify", checkToken, verifyToken)
.put("/profile", checkToken, updateProfile)
.get("/stats", checkToken, getUserStats)

export default router;