import Post from "../models/Post.js"
import { validationResult } from "express-validator"

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const { title, content } = req.body

    const post = await Post.create({
      title,
      content,
      author: req.user.userId,
    })

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: { post },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getAllPosts = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const posts = await Post.find().skip(skip).limit(limit).sort({ createdAt: -1 })

    const total = await Post.countDocuments()

    res.status(200).json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
export const getPost = async (req, res, next) => {
  try {
    const { id } = req.params

    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    res.status(200).json({
      success: true,
      data: { post },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update post (Author only)
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const { id } = req.params
    const { title, content } = req.body

    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    // Check if user is the author
    if (post.author._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this post",
      })
    }

    const updatedPost = await Post.findByIdAndUpdate(id, { title, content }, { new: true, runValidators: true })

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: { post: updatedPost },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete post (Author only)
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params

    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    // Check if user is the author
    if (post.author._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post",
      })
    }

    await Post.findByIdAndDelete(id)

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user's posts
// @route   GET /api/posts/my-posts
// @access  Private
export const getUserPosts = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const posts = await Post.find({ author: req.user.userId }).skip(skip).limit(limit).sort({ createdAt: -1 })

    const total = await Post.countDocuments({ author: req.user.userId })

    res.status(200).json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    next(error)
  }
}
