import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import AnalyticsCharts from "../components/AnalyticsCharts";
import "./Dashboard.css";
import { FaBriefcase, FaCalendarCheck, FaArchive, FaGift } from "react-icons/fa";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");
        const res = await axios.get("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/jobs/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    if (user) fetchJobs();
  }, [user]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/recommend-jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecommendedJobs(res.data);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    };
    if (user) fetchRecommendations();
  }, [user]);

  const totalJobs = jobs.length;
  const interviews = jobs.filter((job) => job.interviewDate).length;
  const archived = jobs.filter((job) => job.status === "Archived").length;
  const offers = jobs.filter((job) => job.status === "Offer").length;

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h2>Welcome, {user?.firstName || "User"}</h2>
        <button className="logout-btn" onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}>
          Logout
        </button>
      </div>

      {/* Actions */}
      <div className="dashboard-actions">
        <button className="btn blue" onClick={() => navigate("/jobs")}>Upload Resume</button>
        <button className="btn outline" onClick={() => navigate("/jobs")}>View All Applications</button>
      </div>

      <div className="summary-cards">
  <div className="card">
    <div className="card-header">
      <div className="card-title">New Applications</div>
      <FaBriefcase className="card-icon" />
    </div>
    <h3>{totalJobs}</h3>
  </div>
  <div className="card">
    <div className="card-header">
      <div className="card-title">Interviews Scheduled</div>
      <FaCalendarCheck className="card-icon" />
    </div>
    <h3>{interviews}</h3>
  </div>
  <div className="card">
    <div className="card-header">
      <div className="card-title">Archived Applications</div>
      <FaArchive className="card-icon" />
    </div>
    <h3>{archived}</h3>
  </div>
  <div className="card">
    <div className="card-header">
      <div className="card-title">Total Offers</div>
      <FaGift className="card-icon" />
    </div>
    <h3>{offers}</h3>
  </div>
</div>


      {/* Main Grid: Recent Jobs & Analytics */}
      <div className="main-grid">
        {/* Recent Applications */}
        <div className="recent-jobs">
          <h4>Recent Job Applications</h4>
          {jobs.slice(0, 4).map((job) => (
            <div key={job._id} className="recent-job">
              <p className="job-title">{job.jobTitle}</p>
              <p className="company">{job.companyName}</p>
            </div>
          ))}
        </div>

        {/* Analytics Overview */}
        <div className="analytics">
          <h4>Analytics Overview</h4>
          <AnalyticsCharts jobs={jobs} />
        </div>
      </div>

      {/* Recommended Jobs */}
      <div className="recommendations">
        <h4>Recommended Jobs For You</h4>
        {recommendedJobs.length > 0 ? (
          recommendedJobs.slice(0, 5).map((job) => (
            <div key={job._id} className="recommended-job">
              <strong>{job.jobTitle}</strong><br />
              <span>Skills: {job.requiredSkills?.join(", ")}</span>
              <hr />
            </div>
          ))
        ) : (
          <p>No recommendations yet. Upload a resume to get started!</p>
        )}
        <Link to="/jobs">
          <button className="btn blue">View All Recommendations</button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
