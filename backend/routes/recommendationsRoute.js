const express = require("express");
const router = express.Router();
const Job = require("../models/Jobs");

router.post("/recommend-jobs", async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ message: "No skills provided" });
    }

    console.log("Request body:", req.body);

    const recommendedJobs = await Job.find({
      $or: skills.map((skill) => ({
        requiredSkills: { $regex: skill, $options: "i" },
      })),
    });

    if (recommendedJobs.length === 0) {
      return res.status(200).json({ message: "No matching jobs found." });
    }

    res.status(200).json({
      message: "Job recommendations based on your skills:",
      recommendations: recommendedJobs,
    });
  } catch (error) {
    console.error("Error recommending jobs:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
