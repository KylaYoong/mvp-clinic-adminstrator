import React, { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase"; // Adjust path if necessary
import "./DisplayScreenTV.css";

const ClinicDisplay = () => {
  const [currentServing, setCurrentServing] = useState(null);
  const [upcomingPatients, setUpcomingPatients] = useState([]);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) +
        " " +
        now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Get today's start and end timestamps
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Firestore query for today's queue
    const queueRef = collection(db, "queue");
    const q = query(
      queueRef,
      where("timestamp", ">=", today),
      where("timestamp", "<", tomorrow),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const patients = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCurrentServing(
        patients.find((patient) => patient.status === "being attended") || null
      );
      setUpcomingPatients(
        patients.filter((patient) => patient.status === "waiting")
      );
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="tv-display">
      <div className="header">
        <h1>{currentTime}</h1>
      </div>
      <div className="main-container">
        <div className="current-serving">
          <h2>Current Serving</h2>
          <div className="queue-number">
            {currentServing ? currentServing.queueNumber : "None"}
          </div>
        </div>
        <div className="upcoming">
          {upcomingPatients.map((patient) => (
            <div className="upcoming-patient" key={patient.id}>
              <div className="queue">{patient.queueNumber}</div>
              <div className="name">{patient.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="footer">
        <img src="/SKP-logo.jpg" alt="Logo" className="logo" />
      </div>
    </div>
  );
};

export default ClinicDisplay;
