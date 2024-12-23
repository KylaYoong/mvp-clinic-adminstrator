import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase"; // Ensure this path is correct
import "./TVQueueDisplay.css";

const TVQueueDisplay = () => {
  const [currentServing, setCurrentServing] = useState(null);
  const [upcomingPatients, setUpcomingPatients] = useState([]);
  const [currentTime, setCurrentTime] = useState("");

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        `${now.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })} ${now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch real-time data from Firestore
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of the day
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of the next day
  
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
  
      console.log("Fetched Patients from Firestore:", patients); // Debugging output
  
      // Ensure "Current Serving" logic handles cases where no patient is "being attended"
      const nextServing = patients.find((patient) => patient.status === "being attended");
      if (!nextServing) {
        console.warn("No patient marked as 'being attended'!");
      }
  
      // Update the state
      setCurrentServing(nextServing || null);
      setUpcomingPatients(patients.filter((patient) => patient.status === "waiting"));
    });
  
    return () => unsubscribe();
  }, []);
  

  return (
    <div className="tv-display">
      <div className="header">
        <h1>{currentTime}</h1>
      </div>
      <div className="main-container">
        {/* Current Serving */}
        <div className="current-serving">
          <h2>Current Serving</h2>
          <div className="queue-number">
            {currentServing ? currentServing.queueNumber : "None"}
          </div>
        </div>
        {/* Upcoming Patients */}
        <div className="upcoming">
          <h2>Upcoming Patients</h2>
          {upcomingPatients.length > 0 ? (
            upcomingPatients.map((patient) => (
              <div key={patient.id} className="upcoming-patient">
                <div className="queue">{patient.queueNumber}</div>
                <div className="name">{patient.name}</div>
              </div>
            ))
          ) : (
            <p>No upcoming patients</p>
          )}
        </div>
      </div>
      <div className="footer">
        <img src="/assets/SKP-logo.jpg" alt="Logo" className="logo" />
      </div>
    </div>
  );
};

export default TVQueueDisplay;
