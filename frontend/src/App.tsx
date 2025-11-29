import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import ReportIncident from "./components/ReportIncident";
import EmergencyAssistance from "./components/EmergencyAssistance";
import SupportServices from "./components/SupportServices";
import EvidenceVault from "./components/EvidenceVault";
import Settings from "./components/Settings";
import FakeCalculator from "./components/FakeCalculator";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (username: string, password: string) => {
    if (username === "admin" && password === "admin123") {
      setIsLoggedIn(true);
      return true;
    } else {
      alert("Invalid credentials");
      return false;
    }
  };

  return (
    <Routes>
      {/* Home page with login/sign-up cards */}
      <Route
        path="/"
        element={<Home isLoggedIn={isLoggedIn} onLogin={handleLogin} />}
      />

      {/* Protected Routes */}
      <Route
        path="/report"
        element={isLoggedIn ? <ReportIncident /> : <Navigate to="/" />}
      />
      <Route
        path="/emergency"
        element={isLoggedIn ? <EmergencyAssistance /> : <Navigate to="/" />}
      />
      <Route
        path="/support"
        element={isLoggedIn ? <SupportServices /> : <Navigate to="/" />}
      />
      <Route
        path="/vault"
        element={isLoggedIn ? <EvidenceVault /> : <Navigate to="/" />}
      />
      <Route
        path="/settings"
        element={isLoggedIn ? <Settings /> : <Navigate to="/" />}
      />
      <Route
        path="/calculator"
        element={isLoggedIn ? <FakeCalculator /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
