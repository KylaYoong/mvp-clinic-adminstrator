import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./Doctor.css";
import SKPLogo from "./SKP-logo.jpg";

function Doctor() {
  const [patients, setPatients] = useState([]);

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

  return (
    <div className="doctor-container">
      <div className="header">
        <img src={SKPLogo} alt="SKP Logo" className="logo" />
        <h2 className="header-title">Doctor Interface</h2>
      </div>

      <div className="patients-section">
        <p>Manage Patients Here</p>
        <Link to="/tv-display">
          <button className="tv-display-button">View TV Display</button>
        </Link>
      </div>
    </div>
  );
}

export default Doctor;
