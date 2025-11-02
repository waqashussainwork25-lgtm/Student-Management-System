import React from "react";

export default function About() {
  return (
    <section className="mt-8 bg-white rounded-2xl shadow p-8">
      <h2 className="text-2xl font-bold mb-2">About This Project</h2>
      <p className="text-gray-600">
        This Student Management System is built with React, Vite, Tailwind CSS, and React Router.
        It includes roles like Super Admin, Campus Admin, and Student.
      </p>
    </section>
  );
}
