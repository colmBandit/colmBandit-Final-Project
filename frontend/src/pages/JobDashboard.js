import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, Table, Container, Modal } from "react-bootstrap";
import "./JobDashboard.css"; // Import the CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faUpload, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const JobDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [editJob, setEditJob] = useState(null);
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    status: "Applied",
    notes: "",
    interviewDate: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
    fetchResumes();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/jobs/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs", error);
    }
  };

  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/upload/resumes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setResumes(data);
    } catch (err) {
      console.error("Error fetching resumes:", err);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication token missing. Please log in again.");
        setUploading(false);
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/upload/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFileUrl(res.data.fileUrl);
      alert("File uploaded successfully!");
      fetchResumes(); // Refresh the resumes list
    } catch (error) {
      console.error("Upload error:", error);
      alert("File upload failed! Please check your authentication.");
    } finally {
      setUploading(false);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/jobs/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Job added successfully!");
      setShowAddModal(false);
      setFormData({
        jobTitle: "",
        companyName: "",
        status: "Applied",
        notes: "",
        interviewDate: "",
      });
      fetchJobs();
    } catch (error) {
      console.error("Error adding job", error);
    }
  };

  const handleEditClick = (job) => {
    setEditJob(job._id);
    setFormData({
      jobTitle: job.jobTitle,
      companyName: job.companyName,
      status: job.status,
      notes: job.notes,
      interviewDate: job.interviewDate ? job.interviewDate.split("T")[0] : "",
    });
    setShowModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/jobs/${editJob}`,
        {
          jobTitle: formData.jobTitle,
          companyName: formData.companyName,
          status: formData.status,
          notes: formData.notes,
          interviewDate: formData.interviewDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Job updated successfully!");
      setShowModal(false);
      fetchJobs();
    } catch (error) {
      console.error("Error updating job", error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Job deleted successfully!");
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job", error);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Job Application Tracker</h2>
        <Button variant="success" onClick={() => setShowAddModal(true)}>
          <FontAwesomeIcon icon={faFile} className="icon" />
          + Add Job
        </Button>
      </div>

      <div className="search-filter-wrapper">
        <Form.Control
          type="text"
          placeholder="Search by job title or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-50 me-2"
        />
        <Form.Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Rejected">Rejected</option>
          <option value="Offer">Offer</option>
          <option value="Saved">Saved</option>
        </Form.Select>
      </div>

      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <h5>Upload your resume</h5>
        <p>Drag and drop your resume here</p>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <div className="button-group">
          <label htmlFor="fileInput" className="custom-upload-button">
            <FontAwesomeIcon icon={faFile} className="icon" />
            Browse files
          </label>
          <Button
            variant="primary"
            className="ms-2"
            onClick={handleUpload}
            disabled={uploading}
          >
            <FontAwesomeIcon icon={faUpload} className="icon" />
            {uploading ? "Uploading..." : "Upload File"}
          </Button>
        </div>
        {file && <p>Selected file: {file.name}</p>}
        {fileUrl && (
          <div className="mt-2">
            <p>File uploaded successfully!</p>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              View File
            </a>
          </div>
        )}
      </div>

      <h3>Uploaded Resumes</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>View</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {resumes.map((resume) => (
            <tr key={resume._id}>
              <td>{new Date(resume.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setSelectedResume(resume);
                    setShowResumeModal(true);
                  }}
                >
                  View
                </button>
              </td>
              <td>
                <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer">
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Table striped bordered hover className="job-table">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Company</th>
            <th>Status</th>
            <th>Interview Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <tr key={job._id}>
                <td>{job.jobTitle}</td>
                <td>{job.companyName}</td>
                <td>{job.status}</td>
                <td>
                  {job.interviewDate
                    ? new Date(job.interviewDate).toDateString()
                    : "N/A"}
                </td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleEditClick(job)}
                  >
                    <FontAwesomeIcon icon={faPen} className="icon" />
                    Edit
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteJob(job._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="icon" />
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No job applications yet.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Job Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleAddJob}>
            <Form.Group className="mb-3">
              <Form.Label>Job Title</Form.Label>
              <Form.Control
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData({ ...formData, jobTitle: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="b-3">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Rejected">Rejected</option>
                <option value="Offer">Offer</option>
                <option value="Saved">Saved</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Interview Date</Form.Label>
              <Form.Control
                type="date"
                name="interviewDate"
                value={formData.interviewDate}
                onChange={(e) =>
                  setFormData({ ...formData, interviewDate: e.target.value })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Job
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Job Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Job Title</Form.Label>
              <Form.Control
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData({ ...formData, jobTitle: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Rejected">Rejected</option>
                <option value="Offer">Offer</option>
                <option value="Saved">Saved</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Interview Date</Form.Label>
              <Form.Control
                type="date"
                name="interviewDate"
                value="formData.interviewDate"
                onChange={(e) =>
                  setFormData({ ...formData, interviewDate: e.target.value })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showResumeModal}
        onHide={() => setShowResumeModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Resume Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedResume && (
            <iframe
              src={selectedResume.fileUrl}
              title="Resume Preview"
              width="100%"
              height="500px"
              style={{ border: "none" }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResumeModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Floating Back to Dashboard Button */}
      <div className="floating-button">
      <Button variant="dark" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </Button>
      </div>
    </Container>
  );
};
export default JobDashboard;
