import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import Help from "./pages/Help";
import Registration from "./pages/Registration";
import Dashboard from "./pages/Dashboard";
import CampusDashboard from "./pages/dashboard/CampusDashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* ✅ */}
          <Route path="/campus-dashboard" element={<CampusDashboard />} />

        </Routes>
      </main>
    </div>
  );
}
