import React, { useState } from "react";
import CampusAdmin from "./dashboard/CampusAdmin";
import MakeCampusAdmin from "./dashboard/MakeCampusAdmin";
import Student from "./dashboard/Student";
import AddCourse from "./dashboard/AddCourse";
import AddCampus from "./dashboard/AddCampus";
import CampusList from "./dashboard/CampusList"; // ✅ Import

export default function Dashboard() {
  const [active, setActive] = useState("campusAdmin");

  const renderPage = () => {
    switch (active) {
      case "campusAdmin":
        return <CampusAdmin />;
      case "makeCampusAdmin":
        return <MakeCampusAdmin />;
      case "student":
        return <Student />;
      case "addCourse":
        return <AddCourse />;
      case "addCampus":
        return <AddCampus />;
      case "campusList": // ✅ New case
        return <CampusList />;
      default:
        return <CampusAdmin />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center border-b border-indigo-500 pb-2">
          Dashboard
        </h2>

        <nav className="flex flex-col gap-3">
          <button
            onClick={() => setActive("campusAdmin")}
            className={`text-left px-3 py-2 rounded-md transition ${
              active === "campusAdmin" ? "bg-indigo-500" : "hover:bg-indigo-600"
            }`}
          >
            Campus Admin
          </button>
          <button
            onClick={() => setActive("makeCampusAdmin")}
            className={`text-left px-3 py-2 rounded-md transition ${
              active === "makeCampusAdmin" ? "bg-indigo-500" : "hover:bg-indigo-600"
            }`}
          >
            Make Campus Admin
          </button>
          <button
            onClick={() => setActive("student")}
            className={`text-left px-3 py-2 rounded-md transition ${
              active === "student" ? "bg-indigo-500" : "hover:bg-indigo-600"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setActive("addCourse")}
            className={`text-left px-3 py-2 rounded-md transition ${
              active === "addCourse" ? "bg-indigo-500" : "hover:bg-indigo-600"
            }`}
          >
            Add Course
          </button>
          <button
            onClick={() => setActive("addCampus")}
            className={`text-left px-3 py-2 rounded-md transition ${
              active === "addCampus" ? "bg-indigo-500" : "hover:bg-indigo-600"
            }`}
          >
            Add Campus
          </button>

          {/* ✅ New Campus List button */}
          <button
            onClick={() => setActive("campusList")}
            className={`text-left px-3 py-2 rounded-md transition ${
              active === "campusList" ? "bg-indigo-500" : "hover:bg-indigo-600"
            }`}
          >
            Campus
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{renderPage()}</main>
    </div>
  );
}
