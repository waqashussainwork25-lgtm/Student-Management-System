import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function StudentManagement() {
  const [campuses, setCampuses] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ name: "", mobile: "", course: "", campus: "" });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const campusSnap = await getDocs(collection(db, "campuses"));
        setCampuses(campusSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const adminSnap = await getDocs(collection(db, "campusAdmins"));
        setAdmins(adminSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const studentSnap = await getDocs(collection(db, "registration"));
        setStudents(studentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Handle edit
  const startEdit = (student) => {
    setEditId(student.id);
    setEditData({ ...student });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const saveEdit = async () => {
    try {
      await updateDoc(doc(db, "registration", editId), editData);
      setStudents(prev => prev.map(s => (s.id === editId ? editData : s)));
      setEditId(null);
      setEditData({});
      alert("✅ Student updated");
    } catch (err) {
      console.error(err);
      alert("❌ Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteDoc(doc(db, "registration", id));
      setStudents(prev => prev.filter(s => s.id !== id));
      alert("✅ Student deleted");
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed");
    }
  };

  // Filter students
  const filteredStudents = students.filter(s => {
    return (
      (!filters.name || s.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.mobile || s.mobile.includes(filters.mobile)) &&
      (!filters.course || s.course.toLowerCase().includes(filters.course.toLowerCase())) &&
      (!filters.campus || s.campusId === filters.campus)
    );
  });

  // Group students by campus for cards
  const campusCards = campuses.map(campus => {
    const campusAdmin = admins.find(a => a.campusId === campus.id);
    const campusStudents = students.filter(s => s.campusId === campus.id);
    const courseCount = {};
    campusStudents.forEach(s => {
      if (!courseCount[s.course]) courseCount[s.course] = 0;
      courseCount[s.course]++;
    });
    return { ...campus, admin: campusAdmin, total: campusStudents.length, courseCount, campusStudents };
  });

  if (loading) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">Student Management</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <input
          type="text"
          placeholder="Filter by Name"
          value={filters.name}
          onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
          className="border p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Filter by Mobile"
          value={filters.mobile}
          onChange={(e) => setFilters(prev => ({ ...prev, mobile: e.target.value }))}
          className="border p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Filter by Course"
          value={filters.course}
          onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
          className="border p-2 rounded-md"
        />
        <select
          value={filters.campus}
          onChange={(e) => setFilters(prev => ({ ...prev, campus: e.target.value }))}
          className="border p-2 rounded-md"
        >
          <option value="">-- Select Campus --</option>
          {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Campus Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {campusCards.map(card => {
          if (filters.campus && filters.campus !== card.id) return null;
          return (
            <div key={card.id} className="bg-white rounded-2xl shadow-lg p-4">
              <h3 className="text-xl font-bold text-indigo-700">{card.name}</h3>
              <p className="text-gray-600">Admin: {card.admin?.email || "N/A"}</p>
              <p className="font-medium mb-2">Total Students: {card.total}</p>
              <ul className="mb-2">
                {Object.entries(card.courseCount).map(([course, count]) => (
                  <li key={course} className="flex justify-between border-b py-1">
                    <span>{course}</span>
                    <span>{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Student Table */}
     {/* Student Table */}
<div className="overflow-x-auto bg-white shadow-lg rounded-2xl">
  <table className="min-w-full border text-sm text-left">
    <thead className="bg-indigo-100">
      <tr>
        {[
          "Reg. No",
          "Name",
          "Father Name",
          "CNIC",
          "Address",
          "Mobile",
          "Course",
          "Campus",
          "Age",
          "Gender",
          "City",
          "Province",
          "Actions",
        ].map((col) => (
          <th key={col} className="px-3 py-2">
            {col}
          </th>
        ))}
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-100">
      {filteredStudents.map((student) => (
        <tr key={student.id} className="hover:bg-indigo-50">
          <td className="px-3 py-1">{student.registrationNo}</td>

          <td className="px-3 py-1">
            {editId === student.id ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
                className="border p-1 rounded w-full"
              />
            ) : (
              student.name
            )}
          </td>

          <td className="px-3 py-1">
            {editId === student.id ? (
              <input
                type="text"
                value={editData.fatherName}
                onChange={(e) =>
                  handleEditChange("fatherName", e.target.value)
                }
                className="border p-1 rounded w-full"
              />
            ) : (
              student.fatherName
            )}
          </td>

          <td className="px-3 py-1">
            {editId === student.id ? (
              <input
                type="text"
                value={editData.cnic}
                onChange={(e) => handleEditChange("cnic", e.target.value)}
                className="border p-1 rounded w-full"
              />
            ) : (
              student.cnic
            )}
          </td>

          <td className="px-3 py-1">
            {editId === student.id ? (
              <input
                type="text"
                value={editData.address}
                onChange={(e) => handleEditChange("address", e.target.value)}
                className="border p-1 rounded w-full"
              />
            ) : (
              student.address
            )}
          </td>

          <td className="px-3 py-1">
            {editId === student.id ? (
              <input
                type="text"
                value={editData.mobile}
                onChange={(e) => handleEditChange("mobile", e.target.value)}
                className="border p-1 rounded w-full"
              />
            ) : (
              student.mobile
            )}
          </td>

          <td className="px-3 py-1">
            {editId === student.id ? (
              <input
                type="text"
                value={editData.course}
                onChange={(e) => handleEditChange("course", e.target.value)}
                className="border p-1 rounded w-full"
              />
            ) : (
              student.course
            )}
          </td>

          <td className="px-3 py-1">
            {editId === student.id ? (
              <input
                type="text"
                value={editData.campusId}
                onChange={(e) => handleEditChange("campusId", e.target.value)}
                className="border p-1 rounded w-full"
              />
            ) : (
              campuses.find((c) => c.id === student.campusId)?.name || "—"
            )}
          </td>

          <td className="px-3 py-1">
            {editId === student.id ? (
              <input
                type="number"
                value={editData.age}
                onChange={(e) => handleEditChange("age", e.target.value)}
                className="border p-1 rounded w-full"
              />
            ) : (
              student.age
            )}
          </td>

          <td className="px-3 py-1">
            {editId === student.id ? (
              <select
                value={editData.gender}
                onChange={(e) => handleEditChange("gender", e.target.value)}
                className="border p-1 rounded w-full"
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            ) : (
              student.gender
            )}
          </td>

          <td className="px-3 py-1">
            {editId === student.id ? (
              <input
                type="text"
                value={editData.city}
                onChange={(e) => handleEditChange("city", e.target.value)}
                className="border p-1 rounded w-full"
              />
            ) : (
              student.city
            )}
          </td>

          <td className="px-3 py-1">
            {editId === student.id ? (
              <input
                type="text"
                value={editData.province}
                onChange={(e) => handleEditChange("province", e.target.value)}
                className="border p-1 rounded w-full"
              />
            ) : (
              student.province
            )}
          </td>

          <td className="px-3 py-1 flex gap-2">
            {editId === student.id ? (
              <>
                <button
                  onClick={saveEdit}
                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
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
                  onClick={() => startEdit(student)}
                  className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(student.id)}
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
</div>
    </div>
  );
}
