import createError from "http-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Wishlist from "../models/Wishlist.js";

const tokenizeCookie = async (user, res) => {
    const { JWT_SECRET, JWT_EXP } = process.env;
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXP,
    });
    res.cookie("jwtToken", token, { 
      maxAge: 10 * 60 * 1000,  // 10 minutes
      httpOnly: true,
      // Add these options for development
      sameSite: 'lax',
      secure: false  // set to true in production
    }); 
};
  
export const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(400, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const cart = await Cart.create({});

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      cartId: cart._id,
    });

    await tokenizeCookie(user, res);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    // Check for duplicate key error
    if (error.code === 11000) {
      next(createError(400, "Email already registered"));
    } else {
      next(error);
    }
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError(400, "Please provide email and password");
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw createError(401, "Incorrect email or password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXP,
    });

    await tokenizeCookie(user, res);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: user,
    
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("jwtToken", { 
      httpOnly: true,
      sameSite: 'lax',
      secure: false,  // set to true in production
      path: '/'  // Important! Make sure path matches cookie setting
    });
    
    res.status(200).json({
      success: true,
      message: "User was successfully logged out",
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, email, currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }

    // Check if email is being changed and if it's already taken
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw createError(400, "Email already registered");
      }
    }

    // Update basic info
    user.fullName = fullName;
    user.email = email;

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        throw createError(400, "Current password is required to change password");
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw createError(400, "Current password is incorrect");
      }

      user.password = await bcrypt.hash(newPassword, 12);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Get user dashboard statistics
export const verifyToken = async (req, res, next) => {
  try {
    // If we reach here, the token is valid (checkToken middleware passed)
    const user = req.user;
    
    res.status(200).json({
      success: true,
      message: "Token is valid",
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get user's orders for recent display
    const recentOrders = await Order.find({ userId })
      .populate({
        path: 'items.product',
        select: 'title price category image'
      })
      .sort({ createdAt: -1 })
      .limit(5); // Get last 5 orders

    // Calculate total spent from ALL orders using stored totalAmount
    const allOrders = await Order.find({ userId });
    console.log('All orders for user:', allOrders.length);
    console.log('Orders with totalAmount:', allOrders.map(order => ({
      id: order._id,
      totalAmount: order.totalAmount,
      items: order.items.length
    })));
    
    const totalSpent = allOrders.reduce((total, order) => {
      return total + (order.totalAmount || 0);
    }, 0);
    
    console.log('Calculated total spent:', totalSpent);

    // Get wishlist count
    const wishlist = await Wishlist.findOne({ userId });
    const wishlistCount = wishlist ? wishlist.products.length : 0;

    // Get cart count
    const cart = await Cart.findById(req.user.cartId);
    const cartCount = cart ? cart.items.length : 0;

    // Get order count
    const orderCount = await Order.countDocuments({ userId });

    res.status(200).json({
      success: true,
      message: "User statistics retrieved successfully",
      data: {
        totalSpent,
        wishlistCount,
        cartCount,
        orderCount,
        recentOrders: recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};