import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      {/* Project Name */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-6 text-center drop-shadow-lg">
        Student Management System
      </h1>

      {/* Welcome Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-3xl w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Welcome!
        </h2>
        <p className="text-gray-600 mb-6 text-lg">
          This is a modern, clean Tailwind layout with routing. Click{" "}
          <Link to="/login" className="text-indigo-600 font-semibold underline hover:text-indigo-800">
            Login
          </Link>{" "}
          to access the dashboard.
        </p>

        {/* Cards for roles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-2xl shadow hover:shadow-lg transition duration-300 bg-indigo-50">
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">Super Admin</h3>
            <p className="text-gray-600 text-sm">
              Manage campuses, users, and global settings across the system.
            </p>
          </div>
          <div className="p-6 border rounded-2xl shadow hover:shadow-lg transition duration-300 bg-green-50">
            <h3 className="text-xl font-semibold text-green-700 mb-2">Campus Admin</h3>
            <p className="text-gray-600 text-sm">
              Manage students, courses, and campus-specific data efficiently.
            </p>
          </div>
        </div>
      </div>

      {/* Footer / Credit */}
      <footer className="mt-8 text-center text-gray-500 text-sm">
        &copy; 2025 Student Management System — Program developed by <span className="font-semibold">Waqas Hussain <br/>Contact# 03153048734</span>
        
      </footer>
    </section>
  );
}
