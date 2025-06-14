"use client";

import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminUsers = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [editingUser, setEditingUser] = useState(null);

	const { showError, showSuccess } = useToast();

	useEffect(() => {
		fetchUsers();
	}, [currentPage]);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const response = await api.get(`/users?page=${currentPage}&limit=10`);
			setUsers(response.data.data.users);
			setPagination(response.data.data.pagination);
		} catch (error) {
			showError("Failed to fetch users");
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteUser = async (userId) => {
		if (window.confirm("Are you sure you want to delete this user?")) {
			try {
				await api.delete(`/users/${userId}`);
				showSuccess("User deleted successfully");
				fetchUsers();
			} catch (error) {
				showError("Failed to delete user");
			}
		}
	};

	const handleToggleUserStatus = async (userId, currentStatus) => {
		try {
			await api.put(`/users/${userId}`, { isActive: !currentStatus });
			showSuccess(
				`User ${!currentStatus ? "activated" : "deactivated"} successfully`
			);
			fetchUsers();
		} catch (error) {
			showError("Failed to update user status");
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<div className="max-w-6xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					User Management
				</h1>
				<p className="text-gray-600">Manage all users in the system.</p>
			</div>

			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-200">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold text-gray-900">All Users</h2>
						<button
							onClick={() => setShowCreateModal(true)}
							className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
						>
							Create New User
						</button>
					</div>
				</div>

				{users.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-gray-600">No users found.</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										User
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Role
									</th>

									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Joined
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{users.map((user) => (
									<tr key={user._id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap">
											<div>
												<div className="text-sm font-medium text-gray-900">
													{user.name}
												</div>
												<div className="text-sm text-gray-500">
													{user.email}
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
													user.role === "admin"
														? "bg-purple-100 text-purple-800"
														: "bg-green-100 text-green-800"
												}`}
											>
												{user.role}
											</span>
										</td>

										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{formatDate(user.createdAt)}
										</td>

										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<div className="flex justify-end space-x-2">
												<button
													onClick={() => setEditingUser(user)}
													className="text-blue-600 hover:text-blue-900"
												>
													Edit
												</button>

												<button
													onClick={() => handleDeleteUser(user._id)}
													className="text-red-600 hover:text-red-900"
												>
													Delete
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{/* Pagination */}
				{pagination.pages > 1 && (
					<div className="px-6 py-4 border-t border-gray-200">
						<div className="flex justify-center">
							<nav className="flex space-x-2">
								<button
									onClick={() =>
										setCurrentPage((prev) => Math.max(prev - 1, 1))
									}
									disabled={currentPage === 1}
									className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Previous
								</button>
								{Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
									(page) => (
										<button
											key={page}
											onClick={() => setCurrentPage(page)}
											className={`px-3 py-2 text-sm font-medium rounded-md ${
												currentPage === page
													? "bg-blue-600 text-white"
													: "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
											}`}
										>
											{page}
										</button>
									)
								)}
								<button
									onClick={() =>
										setCurrentPage((prev) =>
											Math.min(prev + 1, pagination.pages)
										)
									}
									disabled={currentPage === pagination.pages}
									className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Next
								</button>
							</nav>
						</div>
					</div>
				)}
			</div>

			{/* Create/Edit User Modal would go here */}
			{(showCreateModal || editingUser) && (
				<UserModal
					user={editingUser}
					onClose={() => {
						setShowCreateModal(false);
						setEditingUser(null);
					}}
					onSuccess={() => {
						fetchUsers();
						setShowCreateModal(false);
						setEditingUser(null);
					}}
				/>
			)}
		</div>
	);
};

// User Modal Component
const UserModal = ({ user, onClose, onSuccess }) => {
	const [formData, setFormData] = useState({
		name: user?.name || "",
		email: user?.email || "",
		role: user?.role || "user",
		password: "",
	});
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	const { showError, showSuccess } = useToast();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (user) {
				// Update user
				await api.put(`/users/${user._id}`, {
					name: formData.name,
					email: formData.email,
					role: formData.role,
				});
				showSuccess("User updated successfully");
			} else {
				// Create user
				await api.post("/users", formData);
				showSuccess("User created successfully");
			}
			onSuccess();
		} catch (error) {
			showError(error.response?.data?.message || "Operation failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
			<div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
				<div className="mt-3">
					<h3 className="text-lg font-medium text-gray-900 mb-4">
						{user ? "Edit User" : "Create New User"}
					</h3>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Name
							</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Email
							</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Role
							</label>
							<select
								name="role"
								value={formData.role}
								onChange={handleChange}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="user">User</option>
								<option value="admin">Admin</option>
							</select>
						</div>
						{!user && (
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Password
								</label>
								<input
									type="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									required
								/>
							</div>
						)}
						<div className="flex justify-end space-x-3 pt-4">
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isLoading}
								className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
							>
								{isLoading ? (
									<LoadingSpinner size="small" />
								) : user ? (
									"Update"
								) : (
									"Create"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AdminUsers;
