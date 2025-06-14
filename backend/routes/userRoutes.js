import express from "express"
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserProfile,
  updateUser,
  deleteUser,
} from "../controllers/userController.js"
import { protect, restrictTo } from "../middleware/auth.js"
import { validateUserRegistration, validateUserLogin, validateUserUpdate } from "../middleware/validation.js"

const router = express.Router()

// Public routes
router.post("/register", validateUserRegistration, registerUser)
router.post("/login", validateUserLogin, loginUser)

// Protected routes
router.use(protect) // All routes after this middleware are protected

router.get("/profile", getUserProfile)

// Admin only routes
router.get("/", restrictTo("admin"), getAllUsers)
router.put("/:id", restrictTo("admin"), validateUserUpdate, updateUser)
router.delete("/:id", restrictTo("admin"), deleteUser)

export default router
