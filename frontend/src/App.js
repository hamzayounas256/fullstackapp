import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminUsers from "./pages/AdminUsers";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Toast from "./components/Toast";

function App() {
	return (
		<AuthProvider>
			<ToastProvider>
				<Router>
					<div className="min-h-screen bg-gray-50">
						<Navbar />
						<main className="container mx-auto px-4 py-8">
							<Routes>
								{/* Public Routes */}
								<Route path="/login" element={<Login />} />
								<Route path="/register" element={<Register />} />

								{/* Protected Routes */}
								<Route
									path="/dashboard"
									element={
										<ProtectedRoute>
											<Dashboard />
										</ProtectedRoute>
									}
								/>

								<Route
									path="/profile"
									element={
										<ProtectedRoute>
											<Profile />
										</ProtectedRoute>
									}
								/>

								<Route
									path="/posts/create"
									element={
										<ProtectedRoute>
											<CreatePost />
										</ProtectedRoute>
									}
								/>

								<Route
									path="/posts/edit/:id"
									element={
										<ProtectedRoute>
											<EditPost />
										</ProtectedRoute>
									}
								/>

								{/* Admin Routes */}
								<Route
									path="/admin/users"
									element={
										<AdminRoute>
											<AdminUsers />
										</AdminRoute>
									}
								/>

								{/* Default Route */}
								<Route
									path="/"
									element={<Navigate to="/dashboard" replace />}
								/>
								<Route
									path="*"
									element={<Navigate to="/dashboard" replace />}
								/>
							</Routes>
						</main>
						<Toast />
					</div>
				</Router>
			</ToastProvider>
		</AuthProvider>
	);
}

export default App;
