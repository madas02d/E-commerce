import jwt from "jsonwebtoken";
import User from "../models/User.js";
import createError from "http-errors";

const checkToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwtToken;
    
    if (!token) {
      throw createError(401, "No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      throw createError(401, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(createError(401, "Invalid token"));
    } else {
      next(error);
    }
  }
};

export default checkToken;
