import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import AnalyticsCharts from "../components/AnalyticsCharts";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const navigate = useNavigate();

  // Fetch user details on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
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

  // Fetch jobs after user is authenticated
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

  // Fetch recommendations once the user data is available
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return;
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

    fetchRecommendations();
  }, [user]);

  // Summary metrics
  const totalJobs = jobs.length;
  const interviewsScheduled = jobs.filter((job) => job.interviewDate).length;
  const archivedApplications = jobs.filter((job) => job.status === "Archived").length;
  const offers = jobs.filter((job) => job.status === "Offer").length;

  return (
    <Container className="dashboard-container">
      {/* Header */}
      <Row className="header-row">
        <Col md={6} className="logo">
          <h2>InApply</h2>
        </Col>
        <Col md={6} className="text-end">
          <Button
            variant="danger"
            className="logout-button"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </Col>
      </Row>

      {/* Welcome Message */}
      <div className="user-summary">
        <h3>Welcome, {user?.firstName || "User"}</h3>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <Button variant="success" className="dashboard-button" onClick={() => navigate("/jobs")}>
          Upload Resume
        </Button>
        <Button variant="success" className="dashboard-button" onClick={() => navigate("/jobs")}>
          View All Applications
        </Button>
      </div>

      {/* Summary Cards */}
      <Row className="summary-row">
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body>
              <h4>{totalJobs}</h4>
              <p>New Applications</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body>
              <h4>{interviewsScheduled}</h4>
              <p>Interviews Scheduled</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body>
              <h4>{archivedApplications}</h4>
              <p>Archived Applications</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body>
              <h4>{offers}</h4>
              <p>Total Offers</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Job Applications */}
      <div className="job-recommendations">
        <h3>Recent Job Applications</h3>
        <Row>
          {jobs.slice(0, 4).map((job) => (
            <Col md={3} key={job._id}>
              <Card className="recommendation-card">
                <Card.Body>
                  <Card.Title>{job.jobTitle}</Card.Title>
                  <Card.Text>{job.companyName}</Card.Text>
                  <Card.Text>{job.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Recommended Jobs Section */}
      <Card className="mt-4">
        <Card.Header>Recommended Jobs For You</Card.Header>
        <Card.Body>
          {recommendedJobs.length > 0 ? (
            recommendedJobs.slice(0, 3).map((job) => (
              <div key={job._id} className="mb-3">
                <strong>{job.jobTitle}</strong> at {job.companyName}
                <br />
                Skills: {job.requiredSkills?.join(", ")}
                <hr />
              </div>
            ))
          ) : (
            <p>No recommendations found yet. Upload a resume to get started!</p>
          )}
          <Link to="/jobs">
            <Button variant="primary">View All Recommendations</Button>
          </Link>
        </Card.Body>
      </Card>

      {/* Analytics Charts */}
      <AnalyticsCharts jobs={jobs} />
    </Container>
  );
};

export default Dashboard;
