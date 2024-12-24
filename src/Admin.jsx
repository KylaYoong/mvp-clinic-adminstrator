import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  setDoc,
  onSnapshot,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import "./Admin.css";
import SKPLogo from "./SKP-logo.jpg";

function Admin() {
  const [empID, setEmpID] = useState("");
  const [empName, setEmpName] = useState("");
  const [empEmail, setEmpEmail] = useState(""); // New state for email
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const patientsRef = collection(db, "queue");
    const q = query(
      patientsRef,
      where("status", "in", ["waiting", "being attended"]),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const patientList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatients(patientList);
    });

    return () => unsubscribe();
  }, []);

  const handleInviteNextPatient = async () => {
    try {
      // Get current and next patient
      const currentPatient = patients.find((patient) => patient.status === "being attended");
      const nextPatient = patients.find((patient) => patient.status === "waiting");
  
      // Mark the current patient as "completed"
      if (currentPatient) {
        await updateDoc(doc(db, "queue", currentPatient.id), { status: "completed" });
        console.log(`Marked as completed: ${currentPatient.queueNumber}`);
      }
  
      // Mark the next patient as "being attended"
      if (nextPatient) {
        await updateDoc(doc(db, "queue", nextPatient.id), { status: "being attended" });
        console.log(`Marked as being attended: ${nextPatient.queueNumber}`);
        alert(`Invited: ${nextPatient.name}`);
      } else {
        alert("No more patients waiting!");
      }
    } catch (error) {
      console.error("Error inviting next patient:", error);
      alert(`Error: ${error.message}`);
    }
  };
  
  const handleRegisterPatient = async (e) => {
    e.preventDefault();
  
    if (!empID.match(/^\d{6}$/)) {
      alert("Employee ID must be exactly 6 digits!");
      return;
    }
  
    if (!empName.match(/^[a-zA-Z ]+$/)) {
      alert("Employee name must contain only letters and spaces!");
      return;
    }
  
    setLoading(true);
    try {
      const queueMetaRef = doc(collection(db, "queueMeta"), "queueInfo");
      const queueMetaSnapshot = await getDocs(collection(db, "queueMeta"));
  
      let queueNumber;
  
      if (!queueMetaSnapshot.empty) {
        const queueData = queueMetaSnapshot.docs[0].data();
        const lastQueueNumber = parseInt(queueData.queueNumber.replace("D", ""), 10);
        queueNumber = `D${String(lastQueueNumber + 1).padStart(4, "0")}`;
        await updateDoc(queueMetaRef, { queueNumber });
      } else {
        queueNumber = "D0001";
        await setDoc(queueMetaRef, {
          queueNumber,
          lastResetDate: Timestamp.fromDate(new Date()),
        });
      }
  
      // Save the patient document
      const patientRef = doc(collection(db, "queue"), empID);
      await setDoc(patientRef, {
        employeeID: empID,
        name: empName,
        email: empEmail || null,
        queueNumber,
        status: "waiting",
        timestamp: Timestamp.now(),
      });
  
      alert(`Patient registered successfully! Queue number: ${queueNumber}`);
      setEmpID("");
      setEmpName("");
      setEmpEmail("");
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  const handleNavigateToTVQueue = () => {
    navigate("/tv-queue-display"); // Redirect to the TV Queue Display page
  };

  return (
    <div className="admin-container">
      <div className="header">
        <img src={SKPLogo} alt="SKP Logo" className="logo" />
        <h2 className="header-title">Admin Interface</h2>
      </div>

      <div className="admin-interface">
        <button onClick={handleInviteNextPatient}>Invite Next Patient</button>

        <form onSubmit={handleRegisterPatient} className="register-form">
          <input
            type="text"
            placeholder="Enter Employee ID"
            value={empID}
            onChange={(e) => setEmpID(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter Employee Name"
            value={empName}
            onChange={(e) => setEmpName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Enter Employee Email"
            value={empEmail}
            onChange={(e) => setEmpEmail(e.target.value)} // Email field
          />
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register New Patient"}
          </button>
        </form>

        <br/>
        {/* Add the new button */}
        <button onClick={handleNavigateToTVQueue}>
          View Queue on TV
        </button>

      </div>
    </div>
  );
}

export default Admin;
