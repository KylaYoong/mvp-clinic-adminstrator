import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Admin from "./Admin";
import Doctor from "./Doctor";
import ClinicDisplay from "./displays/DisplayScreenTV";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/tv-display" element={<ClinicDisplay />} />
        <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirect invalid routes */}
      </Routes>
    </Router>
  );
};

export default App;
