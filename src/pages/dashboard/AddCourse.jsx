import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AddCourse() {
  const [course, setCourse] = useState({
    name: "",
    duration: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!course.name || !course.duration || !course.description) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "courses"), {
        ...course,
        createdAt: serverTimestamp(),
      });
      alert("🎉 Course Added Successfully!");
      setCourse({ name: "", duration: "", description: "" });
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Something went wrong. Please try again!");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-700 text-center">
        Add New Course
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Course Name"
          value={course.name}
          onChange={(e) => setCourse({ ...course, name: e.target.value })}
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-200"
          required
        />
        <input
          type="text"
          placeholder="Course Duration (e.g. 3 Months)"
          value={course.duration}
          onChange={(e) => setCourse({ ...course, duration: e.target.value })}
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-200"
          required
        />
        <textarea
          placeholder="Course Description"
          value={course.description}
          onChange={(e) =>
            setCourse({ ...course, description: e.target.value })
          }
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-200"
          rows="3"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:brightness-105 transition font-medium"
        >
          {loading ? "Saving..." : "Save Course"}
        </button>
      </form>
    </div>
  );
}
