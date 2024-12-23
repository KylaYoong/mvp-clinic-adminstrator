import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import "../styles/Doctor.css";
import SKPLogo from "../styles/SKP-logo.jpg";

function Doctor() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedNote, setSelectedNote] = useState(""); // Dropdown selection
  const [customNote, setCustomNote] = useState(""); // Custom note for "Others"

  useEffect(() => {
    const patientsRef = collection(db, "queue");
    const q = query(
      patientsRef,
      where("status", "in", ["waiting", "being attended"]),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPatients = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatients(fetchedPatients);
    });

    return () => unsubscribe();
  }, []);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setSelectedNote(""); // Reset dropdown
    setCustomNote(""); // Reset custom note
  };

  const handleSaveNotes = async () => {
    if (!selectedPatient) return;

    try {
      const notes =
        selectedNote === "Others" ? customNote : selectedNote || "No Notes";
      const patientRef = doc(db, "queue", selectedPatient.id);
      await updateDoc(patientRef, { notes });
      alert("Notes updated successfully!");
      setSelectedPatient(null); // Deselect patient
      setSelectedNote(""); // Reset dropdown
      setCustomNote(""); // Clear custom note
    } catch (error) {
      console.error("Error updating notes:", error);
      alert("Failed to update notes. Try again.");
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!selectedPatient) return;

    try {
      const patientRef = doc(db, "queue", selectedPatient.id);
      await updateDoc(patientRef, { status: "completed" });
      alert("Patient marked as completed!");
      setSelectedPatient(null);
      setSelectedNote("");
      setCustomNote("");
    } catch (error) {
      console.error("Error marking patient as completed:", error);
      alert("Failed to update status. Try again.");
    }
  };

  return (
    <div className="doctor-container">
      <div className="header">
        <img src={SKPLogo} alt="SKP Logo" className="logo" />
        <h2 className="header-title">Doctor Interface</h2>
      </div>

      <div className="patients-section">
        <h3>Current Patients</h3>
        {patients.length > 0 ? (
          <ul>
            {patients.map((patient) => (
              <li key={patient.id}>
                <strong>Employee ID:</strong> {patient.employeeID} <br />
                <strong>Name:</strong> {patient.name} <br />
                <strong>Status:</strong> {patient.status} <br />
                <button onClick={() => handleSelectPatient(patient)}>
                  Add/Edit Notes
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No patients found.</p>
        )}
      </div>

      {selectedPatient && (
        <div className="notes-section">
          <h3>Medical Notes for {selectedPatient.name}</h3>
          <label htmlFor="notes">Select Medical Notes:</label>
          <select
            id="notes"
            value={selectedNote}
            onChange={(e) => setSelectedNote(e.target.value)}
          >
            <option value="">Select a note</option>
            <option value="Flu">Flu</option>
            <option value="Cough">Cough</option>
            <option value="Headache">Headache</option>
            <option value="Others">Others</option>
          </select>
          <br />
          {selectedNote === "Others" && (
            <textarea
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              rows="5"
              cols="40"
              placeholder="Enter custom medical notes here..."
            ></textarea>
          )}
          <br />
          <button onClick={handleSaveNotes}>Save</button>
          <button onClick={handleMarkAsCompleted}>Mark as Completed</button>
          <button onClick={() => setSelectedPatient(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Doctor;
