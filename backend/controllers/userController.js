import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

// Generate JWT token
const generateToken = (userId) => {
	return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback-secret", {
		expiresIn: process.env.JWT_EXPIRES_IN || "7d",
	});
};

// register user api/users/register
export const registerUser = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				message: "Validation failed",
				errors: errors.array(),
			});
		}

		const { name, email, password, role } = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists with this email",
			});
		}

		// Create user
		const user = await User.create({
			name,
			email,
			password,
			role: role || "user",
		});

		// Generate token
		const token = generateToken(user._id);

		res.status(201).json({
			success: true,
			message: "User registered successfully",
			data: {
				user,
				token,
			},
		});
	} catch (error) {
		next(error);
	}
};

// login user /api/users/login
export const loginUser = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				message: "Validation failed",
				errors: errors.array(),
			});
		}

		const { email, password } = req.body;

		// Find user and include password for comparison
		const user = await User.findOne({ email }).select("+password");
		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// Check password
		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// Generate token
		const token = generateToken(user._id);

		res.status(200).json({
			success: true,
			message: "Login successful",
			data: {
				user: user.toJSON(),
				token,
			},
		});
	} catch (error) {
		next(error);
	}
};

// get all users /api/users
export const getAllUsers = async (req, res, next) => {
	try {
		const page = Number.parseInt(req.query.page) || 1;
		const limit = Number.parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const users = await User.find()
			.skip(skip)
			.limit(limit)
			.sort({ createdAt: -1 });

		const total = await User.countDocuments();

		res.status(200).json({
			success: true,
			data: {
				users,
				pagination: {
					page,
					limit,
					total,
					pages: Math.ceil(total / limit),
				},
			},
		});
	} catch (error) {
		next(error);
	}
};

// get user profile /api/users/profile
export const getUserProfile = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		res.status(200).json({
			success: true,
			data: { user },
		});
	} catch (error) {
		next(error);
	}
};

// update user /api/users/:id
export const updateUser = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				message: "Validation failed",
				errors: errors.array(),
			});
		}

		const { id } = req.params;
		const { name, email, role } = req.body;

		const user = await User.findByIdAndUpdate(
			id,
			{ name, email, role },
			{ new: true, runValidators: true }
		);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "User updated successfully",
			data: { user },
		});
	} catch (error) {
		next(error);
	}
};

// DELETE users /api/users/:id
export const deleteUser = async (req, res, next) => {
	try {
		const { id } = req.params;

		const user = await User.findByIdAndDelete(id);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (error) {
		next(error);
	}
};
