const express = require("express");
const router = express.Router();
const Job = require("../models/Jobs");

const jobs = [
  {
    jobTitle: "Frontend Developer",
    requiredSkills: ["HTML", "CSS", "JavaScript", "React", "UI/UX"],
  },
  {
    jobTitle: "Backend Developer",
    requiredSkills: ["Node.js", "Express", "MongoDB", "REST API", "Docker"],
  },
  {
    jobTitle: "Full Stack Engineer",
    requiredSkills: ["React", "Node.js", "MongoDB", "Git", "CI/CD"],
  },
  {
    jobTitle: "DevOps Engineer",
    requiredSkills: ["AWS", "Terraform", "Docker", "Kubernetes", "CI/CD"],
  },
  {
    jobTitle: "Machine Learning Engineer",
    requiredSkills: ["Python", "TensorFlow", "PyTorch", "Data Analysis", "MLOps"],
  },
  {
    jobTitle: "Data Scientist",
    requiredSkills: ["Python", "Pandas", "Numpy", "SQL", "Machine Learning"],
  },
  {
    jobTitle: "Mobile App Developer",
    requiredSkills: ["React Native", "Flutter", "Dart", "JavaScript", "APIs"],
  },
  {
    jobTitle: "Cybersecurity Analyst",
    requiredSkills: ["Networking", "Python", "SIEM", "Linux", "Security Tools"],
  },
  {
    jobTitle: "UI/UX Designer",
    requiredSkills: ["Figma", "Adobe XD", "User Research", "Wireframing", "Prototyping"],
  },
  {
    jobTitle: "Cloud Solutions Architect",
    requiredSkills: ["AWS", "Azure", "CloudFormation", "DevOps", "Microservices"],
  },
  {
    jobTitle: "QA Engineer",
    requiredSkills: ["Selenium", "Cypress", "Test Automation", "Jest", "Bug Tracking"],
  },
  {
    jobTitle: "AI Research Assistant",
    requiredSkills: ["Natural Language Processing", "spaCy", "Machine Learning", "Python"],
  },
  {
    jobTitle: "Data Engineer",
    requiredSkills: ["ETL", "SQL", "Big Data", "Hadoop", "Kafka"],
  },
  {
    jobTitle: "Technical Writer",
    requiredSkills: ["Documentation", "Markdown", "API Docs", "Writing", "Git"],
  },
  {
    jobTitle: "Blockchain Developer",
    requiredSkills: ["Solidity", "Ethereum", "Smart Contracts", "Web3.js", "Node.js"],
  },
  {
    jobTitle: "AI Prompt Engineer",
    requiredSkills: ["Prompt Engineering", "ChatGPT", "Python", "AI APIs"],
  },
  {
    jobTitle: "Game Developer",
    requiredSkills: ["Unity", "C#", "Game Design", "Physics Engines", "3D Modeling"],
  },
  // New added jobs
  {
    jobTitle: "Software Architect",
    requiredSkills: ["System Design", "Microservices", "Cloud", "Java", "Agile"],
  },
  {
    jobTitle: "Business Intelligence Analyst",
    requiredSkills: ["SQL", "Power BI", "Data Analysis", "Reporting", "Tableau"],
  },
  {
    jobTitle: "Product Manager",
    requiredSkills: ["Product Strategy", "Market Research", "Agile", "Roadmap Planning", "Leadership"],
  },
  {
    jobTitle: "Salesforce Developer",
    requiredSkills: ["Salesforce", "Apex", "Visualforce", "Lightning", "SOQL"],
  },
  {
    jobTitle: "Network Engineer",
    requiredSkills: ["Cisco", "Networking", "TCP/IP", "DNS", "Firewall Management"],
  },
  {
    jobTitle: "AR/VR Developer",
    requiredSkills: ["Unity", "C#", "ARKit", "ARCore", "3D Modeling"],
  },
  {
    jobTitle: "Digital Marketing Specialist",
    requiredSkills: ["SEO", "SEM", "Google Ads", "Content Strategy", "Social Media Marketing"],
  },
  {
    jobTitle: "IT Support Specialist",
    requiredSkills: ["Troubleshooting", "Networking", "Hardware Support", "Windows", "Linux"],
  },
  {
    jobTitle: "Cloud Engineer",
    requiredSkills: ["AWS", "Google Cloud", "Azure", "Linux", "Cloud Security"],
  },
  {
    jobTitle: "Automation Engineer",
    requiredSkills: ["Automation Tools", "Scripting", "CI/CD", "Docker", "Jenkins"],
  },
  {
    jobTitle: "Product Designer",
    requiredSkills: ["Figma", "Sketch", "UI/UX", "Prototyping", "Wireframing"],
  },
  // Added Software Engineer role
  {
    jobTitle: "Software Engineer",
    requiredSkills: ["Java", "C#", "Python", "Data Structures", "Algorithms", "Git", "SQL"],
  }
];

router.post("/seed-jobs", async (req, res) => {
  try {
    const seededJobs = [];

    for (const job of jobs) {
      const existingJob = await Job.findOne({
        jobTitle: job.jobTitle,
        userId: null,
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
