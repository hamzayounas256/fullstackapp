"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const Profile = () => {
	const { user, updateUser } = useAuth();
	const { showError, showSuccess } = useToast();

	const [profileData, setProfileData] = useState({
		name: user?.name || "",
		email: user?.email || "",
	});
	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("profile");

	const handleProfileChange = (e) => {
		const { name, value } = e.target;
		setProfileData((prev) => ({
			...prev,
			[name]: value,
		}));
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const handlePasswordChange = (e) => {
		const { name, value } = e.target;
		setPasswordData((prev) => ({
			...prev,
			[name]: value,
		}));
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const handleProfileSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await api.put("/users/profile", profileData);
			updateUser(response.data.data.user);
			showSuccess("Profile updated successfully");
		} catch (error) {
			showError(error.response?.data?.message || "Failed to update profile");
		} finally {
			setIsLoading(false);
		}
	};

	const handlePasswordSubmit = async (e) => {
		e.preventDefault();

		// Validate passwords
		const newErrors = {};
		if (!passwordData.currentPassword) {
			newErrors.currentPassword = "Current password is required";
		}
		if (!passwordData.newPassword) {
			newErrors.newPassword = "New password is required";
		} else if (passwordData.newPassword.length < 6) {
			newErrors.newPassword = "Password must be at least 6 characters";
		}
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		setIsLoading(true);

		try {
			await api.put("/users/change-password", {
				currentPassword: passwordData.currentPassword,
				newPassword: passwordData.newPassword,
			});
			showSuccess("Password changed successfully");
			setPasswordData({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
		} catch (error) {
			showError(error.response?.data?.message || "Failed to change password");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Profile Settings
				</h1>
				<p className="text-gray-600">
					Manage your account settings and preferences.
				</p>
			</div>

			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				{/* Tab Navigation */}
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						<button
							onClick={() => setActiveTab("profile")}
							className={`py-4 px-1 border-b-2 font-medium text-sm ${
								activeTab === "profile"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}
						>
							Profile Information
						</button>
						<button
							onClick={() => setActiveTab("password")}
							className={`py-4 px-1 border-b-2 font-medium text-sm ${
								activeTab === "password"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}
						>
							Change Password
						</button>
					</nav>
				</div>

				<div className="p-6">
					{activeTab === "profile" && (
						<form onSubmit={handleProfileSubmit} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label
										htmlFor="name"
										className="block text-sm font-medium text-gray-700"
									>
										Full Name
									</label>
									<input
										type="text"
										id="name"
										name="name"
										value={profileData.name}
										onChange={handleProfileChange}
										className={`mt-1 block w-full px-3 py-2 border ${
											errors.name ? "border-red-300" : "border-gray-300"
										} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
										required
									/>
									{errors.name && (
										<p className="mt-1 text-sm text-red-600">{errors.name}</p>
									)}
								</div>
								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium text-gray-700"
									>
										Email Address
									</label>
									<input
										type="email"
										id="email"
										name="email"
										value={profileData.email}
										onChange={handleProfileChange}
										className={`mt-1 block w-full px-3 py-2 border ${
											errors.email ? "border-red-300" : "border-gray-300"
										} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
										required
									/>
									{errors.email && (
										<p className="mt-1 text-sm text-red-600">{errors.email}</p>
									)}
								</div>
							</div>
							<div className="flex justify-end">
								<button
									type="submit"
									disabled={isLoading}
									className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isLoading ? (
										<LoadingSpinner size="small" />
									) : (
										"Update Profile"
									)}
								</button>
							</div>
						</form>
					)}

					{activeTab === "password" && (
						<form onSubmit={handlePasswordSubmit} className="space-y-6">
							<div className="space-y-4">
								<div>
									<label
										htmlFor="currentPassword"
										className="block text-sm font-medium text-gray-700"
									>
										Current Password
									</label>
									<input
										type="password"
										id="currentPassword"
										name="currentPassword"
										value={passwordData.currentPassword}
										onChange={handlePasswordChange}
										className={`mt-1 block w-full px-3 py-2 border ${
											errors.currentPassword
												? "border-red-300"
												: "border-gray-300"
										} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
										required
									/>
									{errors.currentPassword && (
										<p className="mt-1 text-sm text-red-600">
											{errors.currentPassword}
										</p>
									)}
								</div>
								<div>
									<label
										htmlFor="newPassword"
										className="block text-sm font-medium text-gray-700"
									>
										New Password
									</label>
									<input
										type="password"
										id="newPassword"
										name="newPassword"
										value={passwordData.newPassword}
										onChange={handlePasswordChange}
										className={`mt-1 block w-full px-3 py-2 border ${
											errors.newPassword ? "border-red-300" : "border-gray-300"
										} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
										required
									/>
									{errors.newPassword && (
										<p className="mt-1 text-sm text-red-600">
											{errors.newPassword}
										</p>
									)}
								</div>
								<div>
									<label
										htmlFor="confirmPassword"
										className="block text-sm font-medium text-gray-700"
									>
										Confirm New Password
									</label>
									<input
										type="password"
										id="confirmPassword"
										name="confirmPassword"
										value={passwordData.confirmPassword}
										onChange={handlePasswordChange}
										className={`mt-1 block w-full px-3 py-2 border ${
											errors.confirmPassword
												? "border-red-300"
												: "border-gray-300"
										} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
										required
									/>
									{errors.confirmPassword && (
										<p className="mt-1 text-sm text-red-600">
											{errors.confirmPassword}
										</p>
									)}
								</div>
							</div>
							<div className="flex justify-end">
								<button
									type="submit"
									disabled={isLoading}
									className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isLoading ? (
										<LoadingSpinner size="small" />
									) : (
										"Change Password"
									)}
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
};

export default Profile;
