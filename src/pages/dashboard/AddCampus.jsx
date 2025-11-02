import React, { useState } from "react";
import { db } from "../../firebase"; // ✅ Ensure this path is correct
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AddCampus() {
  const [campus, setCampus] = useState({
    name: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!campus.name || !campus.location) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);
    try {
      // Save data to Firestore (collection: "campuses")
      await addDoc(collection(db, "campuses"), {
        ...campus,
        createdAt: serverTimestamp(),
      });

      alert("🎉 Campus Added Successfully!");
      setCampus({ name: "", location: "" });
    } catch (error) {
      console.error("Error adding campus:", error);
      alert("Something went wrong. Please try again!");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-700 text-center">
        Add New Campus
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Campus Name"
          value={campus.name}
          onChange={(e) => setCampus({ ...campus, name: e.target.value })}
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-200"
          required
        />
        <input
          type="text"
          placeholder="Campus Location"
          value={campus.location}
          onChange={(e) => setCampus({ ...campus, location: e.target.value })}
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-200"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:brightness-105 transition font-medium"
        >
          {loading ? "Saving..." : "Save Campus"}
        </button>
      </form>
    </div>
  );
}
