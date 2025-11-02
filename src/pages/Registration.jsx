import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";

export default function Registration() {
  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    address: "",
    mobile: "",
    course: "",
    campusId: "", // ✅ campusId save
    age: "",
    province: "",
    district: "",
    division: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [campuses, setCampuses] = useState([]);
  const [courses, setCourses] = useState([]);

  // Fetch campuses & courses from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const campusSnapshot = await getDocs(collection(db, "campuses"));
      setCampuses(campusSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const courseSnapshot = await getDocs(collection(db, "courses"));
      setCourses(courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const key in form) {
      if (!form[key]) {
        alert("Please fill all fields before submitting!");
        return;
      }
    }

    setLoading(true);
    try {
      // Get campus name & course name from selected ids
      const campus = campuses.find(c => c.id === form.campusId);
      const course = courses.find(c => c.id === form.course);

      await addDoc(collection(db, "registration"), {
        ...form,
        campus: campus?.name || "",
        course: course?.name || "",
        createdAt: serverTimestamp(),
      });

      alert("🎉 Registration Successful!");
      setForm({
        name: "",
        fatherName: "",
        address: "",
        mobile: "",
        course: "",
        campusId: "",
        age: "",
        province: "",
        district: "",
        division: "",
        gender: "",
      });
    } catch (error) {
      console.error("Error saving data: ", error);
      alert(" Something went wrong. Please try again!");
    }
    setLoading(false);
  };

  return (
    <section className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Student Registration Form</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <input type="text" placeholder="Full Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded-md" />

        <input type="text" placeholder="Father's Name" value={form.fatherName}
          onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
          className="w-full border p-2 rounded-md" />

        <textarea placeholder="Address" value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full border p-2 rounded-md" />

        <input type="text" placeholder="Mobile" value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          className="w-full border p-2 rounded-md" />

        {/* Course Dropdown */}
        <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}
          className="w-full border p-2 rounded-md">
          <option value="">Select Course</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        {/* Campus Dropdown */}
        <select value={form.campusId} onChange={(e) => setForm({ ...form, campusId: e.target.value })}
          className="w-full border p-2 rounded-md">
          <option value="">Select Campus</option>
          {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <input type="number" placeholder="Age" value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          className="w-full border p-2 rounded-md" />
        <input type="text" placeholder="Province" value={form.province}
          onChange={(e) => setForm({ ...form, province: e.target.value })}
          className="w-full border p-2 rounded-md" />
        <input type="text" placeholder="District" value={form.district}
          onChange={(e) => setForm({ ...form, district: e.target.value })}
          className="w-full border p-2 rounded-md" />
        <input type="text" placeholder="Division" value={form.division}
          onChange={(e) => setForm({ ...form, division: e.target.value })}
          className="w-full border p-2 rounded-md" />

        {/* Gender */}
        <div className="flex gap-4">
          <label><input type="radio" name="gender" value="Male"
            checked={form.gender === "Male"}
            onChange={(e) => setForm({ ...form, gender: e.target.value })} /> Male</label>
          <label><input type="radio" name="gender" value="Female"
            checked={form.gender === "Female"}
            onChange={(e) => setForm({ ...form, gender: e.target.value })} /> Female</label>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-md">
          {loading ? "Saving..." : "Submit Registration"}
        </button>
      </form>
    </section>
  );
}
