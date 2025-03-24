const express = require("express");
const router = express.Router();
const Job = require("../models/Jobs"); // make sure the path is correct
const jobs = [
  {
    companyName: "Google",
    jobTitle: "Software Engineer",
    requiredSkills: ["JavaScript", "React", "Node.js", "MongoDB", "APIs"],
  },
  {
    companyName: "Amazon",
    jobTitle: "Cloud Solutions Architect",
    requiredSkills: ["AWS", "Terraform", "Kubernetes", "DevOps", "Python"],
  },
  {
    companyName: "Microsoft",
    jobTitle: "Data Scientist",
    requiredSkills: ["Python", "Machine Learning", "SQL", "Pandas", "Data Visualization"],
  },
  {
    companyName: "Tesla",
    jobTitle: "Full Stack Developer",
    requiredSkills: ["JavaScript", "React", "Express", "Docker", "GraphQL"],
  },
  {
    companyName: "Netflix",
    jobTitle: "Backend Engineer",
    requiredSkills: ["Node.js", "Microservices", "PostgreSQL", "Redis", "API Design"],
  },
  {
    companyName: "IBM",
    jobTitle: "AI Research Intern",
    requiredSkills: ["Python", "Natural Language Processing", "TensorFlow", "spaCy", "Data Analysis"],
  },
  {
    companyName: "Airbnb",
    jobTitle: "Frontend Developer",
    requiredSkills: ["React", "TypeScript", "Next.js", "Styled Components", "UI/UX"],
  },
  {
    companyName: "Meta",
    jobTitle: "Machine Learning Engineer",
    requiredSkills: ["Python", "PyTorch", "Deep Learning", "Big Data", "MLOps"],
  },
];

router.post("/seed-jobs", async (req, res) => {
    try {
      const seededJobs = [];
  
      for (const job of jobs) {
        // Check if this seed job already exists by matching companyName & jobTitle
        const existingJob = await Job.findOne({
          companyName: job.companyName,
          jobTitle: job.jobTitle,
          userId: null, // This ensures you're only checking seeded jobs, not user entries
        });
  
        if (!existingJob) {
          const newJob = await Job.create({ ...job, userId: null });
          seededJobs.push(newJob);
        }
      }
  
      res.status(200).json({
        message: "Jobs seeded successfully (duplicates ignored)!",
        jobs: seededJobs,
      });
    } catch (error) {
      res.status(500).json({
        error: "Error seeding jobs",
        details: error.message,
      });
    }
  });
  
router.get("/test-seed", (req, res) => {
    res.send("Seed route is working");
  });
  
module.exports = router;
