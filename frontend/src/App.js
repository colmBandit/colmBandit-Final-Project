import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import JobDashboard from "./pages/JobDashboard";  // 👈 Import Job Dashboard
import LandingPage from "./pages/LandingPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* 👈 Set Landing Page as Home */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<JobDashboard />} />  {/* 👈 Add Job Dashboard Route */}
      </Routes>
    </Router>
  );
}

export default App;
