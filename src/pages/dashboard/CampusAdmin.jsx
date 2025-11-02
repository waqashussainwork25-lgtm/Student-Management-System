import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function CampusAdmin() {
  const [admins, setAdmins] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ email: "", password: "", campusId: "" });
  const [loading, setLoading] = useState(false);

  // 🔹 Load campus admins and campuses
  useEffect(() => {
    const fetchData = async () => {
      const adminSnap = await getDocs(collection(db, "campusAdmins"));
      const campusSnap = await getDocs(collection(db, "campuses"));

      setAdmins(adminSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setCampuses(campusSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchData();
  }, []);

  const getCampusName = (campusId) => {
    const campus = campuses.find((c) => c.id === campusId);
    return campus ? campus.name : "Unknown";
  };

  const startEditing = (admin) => {
    setEditingId(admin.id);
    setEditData({
      email: admin.email,
      password: admin.password,
      campusId: admin.campusId,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({ email: "", password: "", campusId: "" });
  };

  const handleUpdate = async (id) => {
    if (!editData.email || !editData.password || !editData.campusId) {
      alert("⚠️ Please fill all fields!");
      return;
    }

    setLoading(true);
    try {
      const adminRef = doc(db, "campusAdmins", id);
      await updateDoc(adminRef, {
        email: editData.email,
        password: editData.password,
        campusId: editData.campusId,
      });

      alert("✅ Admin updated successfully!");
      setAdmins((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...editData } : a))
      );
      cancelEditing();
    } catch (error) {
      console.error("Error updating admin:", error);
      alert("❌ Failed to update admin!");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this admin?")) return;

    try {
      await deleteDoc(doc(db, "campusAdmins", id));
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      alert("🗑️ Admin deleted successfully!");
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("❌ Failed to delete admin!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6 mt-10">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">
        Manage Campus Admins
      </h2>

      {admins.length === 0 ? (
        <p className="text-center text-gray-500">No campus admins found.</p>
      ) : (
        <table className="w-full border-collapse text-sm sm:text-base">
          <thead>
            <tr className="bg-indigo-50 text-indigo-700">
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Password</th>
              <th className="p-3 border">Assigned Campus</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-b hover:bg-gray-50">
                {editingId === admin.id ? (
                  <>
                    <td className="p-3 border">
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="w-full border p-1 rounded-md"
                      />
                    </td>
                    <td className="p-3 border">
                      <input
                        type="text"
                        value={editData.password}
                        onChange={(e) =>
                          setEditData({ ...editData, password: e.target.value })
                        }
                        className="w-full border p-1 rounded-md"
                      />
                    </td>
                    <td className="p-3 border">
                      <select
                        value={editData.campusId}
                        onChange={(e) =>
                          setEditData({ ...editData, campusId: e.target.value })
                        }
                        className="w-full border p-1 rounded-md"
                      >
                        <option value="">Select Campus</option>
                        {campuses.map((campus) => (
                          <option key={campus.id} value={campus.id}>
                            {campus.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 border text-center">
                      <button
                        onClick={() => handleUpdate(admin.id)}
                        disabled={loading}
                        className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 mr-2"
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3 border">{admin.email}</td>
                    <td className="p-3 border">{admin.password}</td>
                    <td className="p-3 border">{getCampusName(admin.campusId)}</td>
                    <td className="p-3 border text-center space-x-2">
                      <button
                        onClick={() => startEditing(admin)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(admin.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
