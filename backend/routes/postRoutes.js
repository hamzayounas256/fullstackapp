import express from "express"
import {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  getUserPosts,
} from "../controllers/postController.js"
import { protect } from "../middleware/auth.js"
import { validatePost } from "../middleware/validation.js"

const router = express.Router()

// Public routes
router.get("/", getAllPosts)
router.get("/:id", getPost)

// Protected routes
router.use(protect)

router.post("/", validatePost, createPost)
router.get("/user/my-posts", getUserPosts)
router.put("/:id", validatePost, updatePost)
router.delete("/:id", deletePost)

export default router
