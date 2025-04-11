import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [resumeStats, setResumeStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token");

      try {
        const [usersRes, jobsRes, statsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/jobs", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/resume-stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUsers(usersRes.data);
        setJobs(jobsRes.data);
        setResumeStats(statsRes.data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      }
    };

    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col><h2>Admin Dashboard</h2></Col>
        <Col className="text-end">
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            Back to User Dashboard
          </Button>
        </Col>
      </Row>

      {/* Resume Stats */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Total Resumes</Card.Title>
              <h4>{resumeStats?.totalResumes || 0}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Top Extracted Skills</Card.Title>
              <ul>
                {resumeStats?.topSkills?.map((item, index) => (
                  <li key={index}>
                    {item._id}: {item.count}
                  </li>
                )) || <li>No data</li>}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* User Management */}
      <h4>All Users</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Is Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? "✅" : "❌"}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4">No users found.</td></tr>
          )}
        </tbody>
      </Table>

      {/* Job Listings */}
      <h4>All Job Listings</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Company</th>
            <th>Skills</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.jobTitle}</td>
                <td>{job.companyName}</td>
                <td>{job.requiredSkills?.join(", ")}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="3">No jobs found.</td></tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminDashboard;
