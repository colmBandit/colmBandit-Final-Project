const express = require("express");
const router = express.Router();
const Job = require("../models/Jobs");
const Resume = require("../models/Resume");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/recommend-jobs", authMiddleware, async (req, res) => {
  try {
    const latestResume = await Resume.findOne({ userId: req.user.id }).sort({ createdAt: -1 });

    if (!latestResume || !latestResume.skillsSection) {
      return res.status(400).json({ message: "No resume or skills found for recommendations." });
    }

    const skillsArray = latestResume.skillsSection
      .split(/,|\n|;/)
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 1);

    console.log("Skills extracted for recommendations:", skillsArray);

    const recommendedJobs = await Job.find({
      $or: skillsArray.map((skill) => ({
        requiredSkills: { $regex: skill, $options: "i" },
      })),
    });

    console.log("Recommended jobs:", recommendedJobs);

    // ✅ Send only the recommended jobs array
    return res.status(200).json(recommendedJobs);
  } catch (error) {
    console.error("Error recommending jobs:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
