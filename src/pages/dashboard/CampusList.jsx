import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

export default function CampusList() {
  const [campuses, setCampuses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: "", location: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const snapshot = await getDocs(collection(db, "campuses"));
        setCampuses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchCampuses();
  }, []);

  const startEdit = (campus) => {
    setEditId(campus.id);
    setEditData({ name: campus.name, location: campus.location });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({ name: "", location: "" });
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const saveEdit = async () => {
    try {
      await updateDoc(doc(db, "campuses", editId), editData);
      setCampuses(prev => prev.map(c => c.id === editId ? { ...c, ...editData } : c));
      setEditId(null);
      setEditData({ name: "", location: "" });
      alert("✅ Campus updated");
    } catch (err) {
      console.error(err);
      alert("❌ Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campus?")) return;
    try {
      await deleteDoc(doc(db, "campuses", id));
      setCampuses(prev => prev.filter(c => c.id !== id));
      alert("✅ Campus deleted");
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed");
    }
  };

  if (loading) return <p className="text-center p-4">Loading campuses...</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">Campus List</h2>
      <table className="min-w-full border text-sm text-left">
        <thead className="bg-indigo-100">
          <tr>
            <th className="px-3 py-2 border">Name</th>
            <th className="px-3 py-2 border">Location</th>
            <th className="px-3 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {campuses.map(c => (
            <tr key={c.id} className="hover:bg-indigo-50">
              <td className="px-3 py-2">
                {editId === c.id ? 
                  <input type="text" value={editData.name} onChange={(e)=>handleEditChange("name", e.target.value)} className="border p-1 rounded w-full"/>
                  : c.name
                }
              </td>
              <td className="px-3 py-2">
                {editId === c.id ? 
                  <input type="text" value={editData.location} onChange={(e)=>handleEditChange("location", e.target.value)} className="border p-1 rounded w-full"/>
                  : c.location
                }
              </td>
              <td className="px-3 py-2 flex gap-2">
                {editId === c.id ? (
                  <>
                    <button onClick={saveEdit} className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Save</button>
                    <button onClick={cancelEdit} className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={()=>startEdit(c)} className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">Edit</button>
                    <button onClick={()=>handleDelete(c.id)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
