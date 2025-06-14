"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const isActive = (path) => location.pathname === path

  if (!isAuthenticated) {
    return (
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-xl font-bold text-blue-600">
              FullStack App
            </Link>
            <div className="space-x-4">
              <Link
                to="/login"
                className={`px-4 py-2 rounded-md transition-colors ${
                  isActive("/login") ? "bg-blue-600 text-white" : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`px-4 py-2 rounded-md transition-colors ${
                  isActive("/register") ? "bg-blue-600 text-white" : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/dashboard" className="text-xl font-bold text-blue-600">
            FullStack App
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md transition-colors ${
                isActive("/dashboard") ? "bg-blue-600 text-white" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className={`px-3 py-2 rounded-md transition-colors ${
                isActive("/profile") ? "bg-blue-600 text-white" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Profile
            </Link>
            {isAdmin() && (
              <Link
                to="/admin/users"
                className={`px-3 py-2 rounded-md transition-colors ${
                  isActive("/admin/users") ? "bg-blue-600 text-white" : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Manage Users
              </Link>
            )}
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link
                to="/dashboard"
                className="px-3 py-2 rounded-md text-gray-600 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="px-3 py-2 rounded-md text-gray-600 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              {isAdmin() && (
                <Link
                  to="/admin/users"
                  className="px-3 py-2 rounded-md text-gray-600 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Manage Users
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-left"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
