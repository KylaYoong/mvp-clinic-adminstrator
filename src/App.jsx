import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Admin from "./Admin";
import Doctor from "./Doctor";
import Auth from "./Auth";
import TVQueueDisplay from "./displays/TVQueueDisplay";

const App = () => {
  const [role, setRole] = useState(null);

  return (
    <Routes>
      {!role ? (
        <Route path="/" element={<Auth setRole={setRole} />} />
      ) : role === "Admin" ? (
        <>
          <Route path="/admin" element={<Admin />} />
          <Route path="/tv-queue-display" element={<TVQueueDisplay />} />
        </>
      ) : (
        <Route path="/doctor" element={<Doctor />} />
      )}
    </Routes>
  );
};

export default App;
