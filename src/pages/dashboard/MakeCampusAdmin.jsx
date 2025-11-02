import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

export default function MakeCampusAdmin() {
  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState("");
  const [admin, setAdmin] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // 🔹 Load all campuses
  useEffect(() => {
    const fetchCampuses = async () => {
      const snapshot = await getDocs(collection(db, "campuses"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCampuses(data);
    };
    fetchCampuses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCampus || !admin.email || !admin.password) {
      alert("⚠️ Please fill all fields!");
      return;
    }

    setLoading(true);

    try {
      // 🔸 Check if this campus already has an admin
      const campusQuery = query(
        collection(db, "campusAdmins"),
        where("campusId", "==", selectedCampus)
      );
      const campusSnapshot = await getDocs(campusQuery);
      if (!campusSnapshot.empty) {
        alert("❌ This campus already has an admin assigned!");
        setLoading(false);
        return;
      }

      // 🔸 Check if this email is already used as an admin for another campus
      const emailQuery = query(
        collection(db, "campusAdmins"),
        where("email", "==", admin.email)
      );
      const emailSnapshot = await getDocs(emailQuery);
      if (!emailSnapshot.empty) {
        alert("❌ This user is already a campus admin for another campus!");
        setLoading(false);
        return;
      }

      // 🔹 Save new campus admin
      await addDoc(collection(db, "campusAdmins"), {
        email: admin.email,
        password: admin.password,
        campusId: selectedCampus,
        createdAt: serverTimestamp(),
      });

      alert("🎉 Campus Admin Assigned Successfully!");
      setAdmin({ email: "", password: "" });
      setSelectedCampus("");
    } catch (error) {
      console.error("Error assigning admin:", error);
      alert("❌ Something went wrong while saving admin!");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg p-6 rounded-2xl mt-10">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">
        Make Campus Admin
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select Campus */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Select Campus
          </label>
          <select
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-200"
            required
          >
            <option value="">-- Choose Campus --</option>
            {campuses.map((campus) => (
              <option key={campus.id} value={campus.id}>
                {campus.name} ({campus.location})
              </option>
            ))}
          </select>
        </div>

        {/* Admin Email */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Admin Email
          </label>
          <input
            type="email"
            value={admin.email}
            onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-200"
            placeholder="Enter admin email"
            required
          />
        </div>

        {/* Admin Password */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Admin Password
          </label>
          <input
            type="password"
            value={admin.password}
            onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-200"
            placeholder="Enter admin password"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-indigo-600 text-white rounded-md hover:brightness-105 transition font-medium"
        >
          {loading ? "Saving..." : "Assign Admin"}
        </button>
      </form>
    </div>
  );
}
