import { body } from "express-validator"

// User registration validation
export const validateUserRegistration = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one lowercase letter, one uppercase letter, and one number"),

  body("role").optional().isIn(["user", "admin"]).withMessage("Role must be either user or admin"),
]

// User login validation
export const validateUserLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),

  body("password").notEmpty().withMessage("Password is required"),
]

// User update validation
export const validateUserUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  body("email").optional().isEmail().normalizeEmail().withMessage("Please provide a valid email"),

  body("role").optional().isIn(["user", "admin"]).withMessage("Role must be either user or admin"),
]

// Post validation
export const validatePost = [
  body("title").trim().isLength({ min: 3, max: 100 }).withMessage("Title must be between 3 and 100 characters"),

  body("content").trim().isLength({ min: 10, max: 5000 }).withMessage("Content must be between 10 and 5000 characters"),
]
