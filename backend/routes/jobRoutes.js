const express = require("express");
const Job = require("../models/Jobs");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add a New Job Application
router.post("/add", authMiddleware, async (req, res) => {
  const { companyName, jobTitle, applicationDate, status, notes, interviewDate } = req.body;

  try {
    const newJob = new Job({
      userId: req.user.id,
      companyName,
      jobTitle,
      applicationDate,
      status,
      notes,
      interviewDate, // ✅ Add interview date
    });

    await newJob.save();
    res.status(201).json({ message: "Job added successfully", job: newJob });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// Get All Job Applications for Logged-in User
router.get("/", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user.id }).sort({ applicationDate: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update Job Status
// ✅ Update Job Details (Title, Status, Notes, Interview Date)
router.put("/:id", authMiddleware, async (req, res) => {
  const { jobTitle, companyName, status, notes, interviewDate } = req.body;

  try {
    let job = await Job.findOne({ _id: req.params.id, userId: req.user.id });
    if (!job) return res.status(404).json({ message: "Job not found" });

    // ✅ Allow updating all fields (even empty ones)
    if (jobTitle !== undefined) job.jobTitle = jobTitle;
    if (companyName !== undefined) job.companyName = companyName;
    if (status !== undefined) job.status = status;
    if (notes !== undefined) job.notes = notes;
    if (interviewDate !== undefined) job.interviewDate = interviewDate;

    await job.save();
    res.status(200).json({ message: "Job updated successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a Job Application
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
