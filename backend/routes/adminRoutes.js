const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Job = require("../models/Jobs");
const Resume = require("../models/Resume");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware"); // Ensure only admins access this

// Get all users
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});
// Get all job listings
router.get("/jobs", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const jobs = await Job.find();
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ error: "Error fetching jobs" });
    }
  });
// Get resume processing stats
router.get("/resume-stats", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const totalResumes = await Resume.countDocuments();
      const skillsStats = await Resume.aggregate([
        { $unwind: "$skillsSection" },
        { $group: { _id: "$skillsSection", count: { $sum: 1 } } },
        { $sort: { count: -1 } }, // Sort by most common skills
      ]);
  
      res.status(200).json({
        totalResumes,
        topSkills: skillsStats.slice(0, 10), // Get top 10 skills
      });
    } catch (error) {
      res.status(500).json({ error: "Error fetching resume stats" });
    }
  });
// Delete a user
router.delete("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });
  
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting user" });
    }
  });
  module.exports = router;
