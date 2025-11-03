import React, { useState, useEffect } from "react";
import { db } from "../firebase";
  import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ correct import
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  getDocs as getDocsQuery,
  serverTimestamp,
} from "firebase/firestore";

export default function Registration() {
  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    cnic: "",
    address: "",
    mobile: "",
    course: "",
    campusId: "",
    age: "",
    gender: "",
    city: "",
    province: "",
    registrationNo: "",
  });


  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [searchRegNo, setSearchRegNo] = useState("");
  const [campuses, setCampuses] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const campusSnapshot = await getDocs(collection(db, "campuses"));
      setCampuses(
        campusSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );

      const courseSnapshot = await getDocs(collection(db, "courses"));
      setCourses(
        courseSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchData();
  }, []);

  const handleCampusSelect = (campusId) => {
    const selectedCampus = campuses.find((c) => c.id === campusId);
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.floor(100 + Math.random() * 900);
    const regNo = selectedCampus
      ? `${selectedCampus.name.toUpperCase()}-${datePart}-${randomPart}`
      : "";
    setForm({ ...form, campusId, registrationNo: regNo });
  };

  const handleViewRegistration = async () => {
    if (!searchRegNo.trim()) {
      alert("Please enter a registration number.");
      return;
    }

    setLoading(true);
    try {
      const regRef = collection(db, "registration");
      const q = query(regRef, where("registrationNo", "==", searchRegNo.trim()));
      const snap = await getDocsQuery(q);

      if (snap.empty) {
        alert("No record found with this registration number!");
        setViewMode(false);
      } else {
        const data = snap.docs[0].data();
        setForm(data);
        setViewMode(true);
        alert("Registration record loaded successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching registration data!");
    }
    setLoading(false);
  };

  const handleBackToRegistration = () => {
    setForm({
      name: "",
      fatherName: "",
      cnic: "",
      address: "",
      mobile: "",
      course: "",
      campusId: "",
      age: "",
      gender: "",
      city: "",
      province: "",
      registrationNo: "",
    });
    setSearchRegNo("");
    setViewMode(false);
  };

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
      const campus = campuses.find((c) => c.id === form.campusId);
      const course = courses.find((c) => c.id === form.course);

      await addDoc(collection(db, "registration"), {
        ...form,
        campus: campus?.name || "",
        course: course?.name || "",
        createdAt: serverTimestamp(),
      });

      alert("🎉 Registration Successful!");
      handleBackToRegistration();
    } catch (error) {
      console.error("Error saving data: ", error);
      alert("Something went wrong. Please try again!");
    }
    setLoading(false);
  };
const handleDownloadPDF = (studentData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Student Registration Form", pageWidth / 2, 25, { align: "center" });

  doc.setFont("helvetica", "italic");
  doc.setFontSize(13);
  doc.text("Al-Furqan Institute of Technology", pageWidth / 2, 33, { align: "center" });

  doc.setLineWidth(0.5);
  doc.line(20, 36, pageWidth - 20, 36);

  const excludeFields = ["CAMPUSID", "CREATEDAT"];
  const fieldOrder = [
  "course", "city", "address", "mobile", "cnic",
  "campus", "registrationNo", "age", "province",
  "name", "fatherName", "gender",
];

const tableData = fieldOrder
  .filter((field) => studentData[field] && !excludeFields.includes(field))
  .map((field) => [field.toUpperCase(), studentData[field]]);
  // ✅ Correct usage
  autoTable(doc, {
    startY: 45,
    head: [["Field", "Value"]],
    body: tableData,
    theme: "grid",
    styles: { halign: "left", fontSize: 11 },
    headStyles: {
      fillColor: [63, 81, 181],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  const fileName = `${studentData.NAME || "Student"}_Form.pdf`;
  doc.save(fileName);
};
return (
    <section className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">
        Student Registration Form
      </h2>

      {/* 🔍 Search Section */}
      <div className="mb-8 border-b pb-4">
        <h3 className="text-lg font-semibold mb-2">View Existing Registration</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Registration Number"
            value={searchRegNo}
            onChange={(e) => setSearchRegNo(e.target.value)}
            className="flex-1 border p-2 rounded-md"
          />
          <button
            type="button"
            onClick={handleViewRegistration}
            className="bg-blue-600 text-white px-4 rounded-md"
          >
            {loading ? "Loading..." : "View Form"}
          </button>
        </div>
      </div>

      {/* 🔙 Back Button + PDF */}
      {viewMode && (
        <div className="mb-6 flex justify-between">
          <button
            type="button"
            onClick={handleBackToRegistration}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md"
          >
            🔙 Back to Registration
          </button>

     <button
  type="button"
  onClick={() => handleDownloadPDF(form)}   // ✅ fix
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
>
  📄 Download PDF
</button>
        </div>
      )}

      {/* 🧾 Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          { name: "name", placeholder: "Full Name" },
          { name: "fatherName", placeholder: "Father Name" },
          { name: "cnic", placeholder: "CNIC" },
          { name: "address", placeholder: "Address" },
          { name: "mobile", placeholder: "Mobile" },
          { name: "age", placeholder: "Age" },
          { name: "city", placeholder: "City" },
          { name: "province", placeholder: "Province" },
        ].map((f) => (
          <input
            key={f.name}
            type="text"
            placeholder={f.placeholder}
            value={form[f.name]}
            readOnly={viewMode}
            onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
            className="w-full border p-2 rounded-md"
          />
        ))}

        {!viewMode && (
          <>
            <select
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              className="w-full border p-2 rounded-md"
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={form.campusId}
              onChange={(e) => handleCampusSelect(e.target.value)}
              className="w-full border p-2 rounded-md"
            >
              <option value="">Select Campus</option>
              {campuses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </>
        )}

        {form.registrationNo && (
          <input
            type="text"
            value={form.registrationNo}
            readOnly
            className="w-full border p-2 rounded-md bg-gray-100 text-gray-700 font-semibold"
          />
        )}

        {!viewMode && (
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-md"
          >
            {loading ? "Saving..." : "Submit Registration"}
          </button>
        )}
      </form>
    </section>
  );
}
