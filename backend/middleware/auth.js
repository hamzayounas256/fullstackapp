import jwt from "jsonwebtoken"
import User from "../models/User.js"

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  try {
    let token

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret")

    // Check if user still exists
    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "The user belonging to this token no longer exists.",
      })
    }

    // Grant access to protected route
    req.user = decoded
    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      })
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired.",
      })
    }

    return res.status(500).json({
      success: false,
      message: "Token verification failed.",
    })
  }
}

// Restrict to specific roles
export const restrictTo = (...roles) => {
  return async (req, res, next) => {
    try {
      // Get user details to check role
      const user = await User.findById(req.user.userId)

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found.",
        })
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action.",
        })
      }

      next()
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Authorization check failed.",
      })
    }
  }
}
