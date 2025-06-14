"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

const initialState = {
	user: null,
	token: localStorage.getItem("token"),
	isAuthenticated: false,
	loading: true,
};

const authReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN_SUCCESS":
			localStorage.setItem("token", action.payload.token);
			return {
				...state,
				user: action.payload.user,
				token: action.payload.token,
				isAuthenticated: true,
				loading: false,
			};
		case "LOGOUT":
			localStorage.removeItem("token");
			return {
				...state,
				user: null,
				token: null,
				isAuthenticated: false,
				loading: false,
			};
		case "LOAD_USER":
			return {
				...state,
				user: action.payload,
				isAuthenticated: true,
				loading: false,
			};
		case "AUTH_ERROR":
			localStorage.removeItem("token");
			return {
				...state,
				user: null,
				token: null,
				isAuthenticated: false,
				loading: false,
			};
		case "UPDATE_USER":
			return {
				...state,
				user: action.payload,
			};
		default:
			return state;
	}
};

export const AuthProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, initialState);

	// Load user on app start
	useEffect(() => {
		if (state.token) {
			loadUser();
		} else {
			dispatch({ type: "AUTH_ERROR" });
		}
	}, []);

	const loadUser = async () => {
		try {
			const response = await api.get("/users/profile");
			dispatch({
				type: "LOAD_USER",
				payload: response.data.data.user,
			});
		} catch (error) {
			dispatch({ type: "AUTH_ERROR" });
		}
	};

	const login = async (email, password) => {
		try {
			const response = await api.post("/users/login", { email, password });
			dispatch({
				type: "LOGIN_SUCCESS",
				payload: response.data.data,
			});
			return { success: true };
		} catch (error) {
			dispatch({ type: "AUTH_ERROR" });
			return {
				success: false,
				message: error.response?.data?.message || "Login failed",
			};
		}
	};

	const register = async (userData) => {
		try {
			const response = await api.post("/users/register", userData);
			dispatch({
				type: "LOGIN_SUCCESS",
				payload: response.data.data,
			});
			return { success: true };
		} catch (error) {
			return {
				success: false,
				message: error.response?.data?.message || "Registration failed",
				errors: error.response?.data?.errors || [],
			};
		}
	};

	const logout = () => {
		dispatch({ type: "LOGOUT" });
	};

	const updateUser = (userData) => {
		dispatch({
			type: "UPDATE_USER",
			payload: userData,
		});
	};

	const isAdmin = () => {
		return state.user?.role === "admin";
	};

	const value = {
		...state,
		login,
		register,
		logout,
		updateUser,
		isAdmin,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
