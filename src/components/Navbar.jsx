import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo + Title */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
              SMS
            </div>
            <div>
              <h1 className="text-lg font-semibold">Student Management</h1>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-gray-700 hover:text-indigo-600">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600">About</Link>
            <Link to="/help" className="text-gray-700 hover:text-indigo-600">Help</Link>

            {/* Login Button */}
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white font-medium shadow hover:brightness-105 transition"
            >
              Login
            </Link>

            {/* Admin Dashboard Button */}
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 text-white font-medium shadow hover:brightness-105 transition"
            >
              Admin
            </Link>

            {/* Registration Button */}
            <Link
              to="/registration"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white font-medium shadow hover:brightness-105 transition"
            >
              Registration
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setOpen(!open)} className="p-2 rounded-md hover:bg-gray-100">
              {open ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100">
          <div className="px-4 py-3 flex flex-col gap-2">
            <Link to="/" onClick={() => setOpen(false)} className="py-2">Home</Link>
            <Link to="/about" onClick={() => setOpen(false)} className="py-2">About</Link>
            <Link to="/help" onClick={() => setOpen(false)} className="py-2">Help</Link>
            <Link to="/login" onClick={() => setOpen(false)} className="mt-2 px-4 py-2 rounded-md bg-indigo-600 text-white text-center">Login</Link>
            <Link to="/dashboard" onClick={() => setOpen(false)} className="px-4 py-2 rounded-md bg-purple-600 text-white text-center">Admin</Link>
            <Link to="/registration" onClick={() => setOpen(false)} className="px-4 py-2 rounded-md bg-green-600 text-white text-center">Registration</Link>
          </div>
        </div>
      )}
    </header>
  );
}

