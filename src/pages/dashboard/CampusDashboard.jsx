import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function CampusDashboard() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ name: "", mobile: "", course: "" });
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const admin = JSON.parse(localStorage.getItem("campusAdmin"));

  useEffect(() => {
    if (!admin?.campusId) return;

    const fetchStudents = async () => {
      try {
        const q = query(
          collection(db, "registration"),
          where("campusId", "==", admin.campusId)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setStudents(data);
        setFiltered(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
      setLoading(false);
    };

    fetchStudents();
  }, [admin?.campusId]);

  const handleFilter = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);

    const filteredData = students.filter((s) => {
      const matchName = newFilters.name
        ? s.name?.toLowerCase().includes(newFilters.name.toLowerCase())
        : true;
      const matchMobile = newFilters.mobile
        ? s.mobile?.includes(newFilters.mobile)
        : true;
      const matchCourse = newFilters.course
        ? s.course?.toLowerCase().includes(newFilters.course.toLowerCase())
        : true;
      return matchName && matchMobile && matchCourse;
    });

    setFiltered(filteredData);
  };

  const startEdit = (student) => {
    setEditId(student.id);
    setEditData({ ...student });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const saveEdit = async () => {
    try {
      const docRef = doc(db, "registration", editId);
      await updateDoc(docRef, editData);
      setStudents((prev) => prev.map((s) => (s.id === editId ? editData : s)));
      setFiltered((prev) => prev.map((s) => (s.id === editId ? editData : s)));
      setEditId(null);
      setEditData({});
      alert("✅ Student data updated successfully!");
    } catch (error) {
      console.error("Error updating student:", error);
      alert("❌ Failed to update student.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await deleteDoc(doc(db, "registration", id));
      setStudents((prev) => prev.filter((s) => s.id !== id));
      setFiltered((prev) => prev.filter((s) => s.id !== id));
      alert("✅ Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("❌ Could not delete student.");
    }
  };

  if (!admin)
    return (
      <div className="p-6 text-center text-gray-600">
        Please login as a Campus Admin.
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
        {admin.email} — Campus Dashboard
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <input
          placeholder="Filter by Name"
          value={filters.name}
          onChange={(e) => handleFilter("name", e.target.value)}
          className="border p-2 rounded-md w-64 focus:ring-2 focus:ring-indigo-300"
        />
        <input
          placeholder="Filter by Mobile"
          value={filters.mobile}
          onChange={(e) => handleFilter("mobile", e.target.value)}
          className="border p-2 rounded-md w-64 focus:ring-2 focus:ring-indigo-300"
        />
        <input
          placeholder="Filter by Course"
          value={filters.course}
          onChange={(e) => handleFilter("course", e.target.value)}
          className="border p-2 rounded-md w-64 focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      {/* Table */}
     {/* Table */}
<div className="bg-white shadow-xl rounded-2xl p-4 overflow-hidden">
  {loading ? (
    <p className="p-4 text-center text-gray-500">Loading...</p>
  ) : filtered.length === 0 ? (
    <p className="p-4 text-center text-gray-500">No students found.</p>
  ) : (
    <table className="w-full border-collapse border border-gray-300 text-sm">
      <thead className="bg-indigo-100">
        <tr>
          {[
            "Registration No",
            "Name",
            "Father Name",
            "CNIC",
            "Address",
            "Mobile",
            "Course",
    
            "Age",
            "Gender",
            "City",
            "Province",
            "Actions",
          ].map((col) => (
            <th
              key={col}
              className="px-2 py-2 text-left border border-gray-300 text-gray-700 font-medium"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filtered.map((s) => (
          <tr key={s.id} className="hover:bg-indigo-50 transition">
            {[
              "registrationNo",
              "name",
              "fatherName",
              "cnic",
              "address",
              "mobile",
              "course",
   
              "age",
              "gender",
              "city",
              "province",
            ].map((field) => (
              <td key={field} className="px-2 py-1 border border-gray-300">
                {editId === s.id ? (
                  <input
                    type="text"
                    value={editData[field] || ""}
                    onChange={(e) => handleEditChange(field, e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  s[field] || "-"
                )}
              </td>
            ))}
            <td className="px-2 py-1 border border-gray-300 text-center">
              {editId === s.id ? (
                <>
                  <button
                    onClick={saveEdit}
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 mr-1"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(s)}
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 mr-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
    </div>
  );
}
