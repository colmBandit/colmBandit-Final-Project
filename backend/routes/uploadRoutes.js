const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { bucket } = require("../config/firebaseConfig");
const { v4: uuidv4 } = require("uuid");
const Resume = require("../models/Resume");
const authMiddleware = require("../middleware/authMiddleware");
const { spawn } = require("child_process");
const path = require("path");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Clean-up function for extracted text
const cleanText = (text) => {
  return text
    .replace(/\n+/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/•/g, "")
    .replace(/[^\x00-\x7F]/g, "")
    .trim();
};

// ✅ Dynamic tech skill list (expand later)
const techSkills = [
  "JavaScript", "TypeScript", "React", "Redux", "Vue.js", "Angular",
  "Node.js", "Express.js", "Python", "Django", "Flask", "MongoDB",
  "Firebase", "PostgreSQL", "MySQL", "AWS", "Azure", "Docker",
  "Kubernetes", "GraphQL", "HTML", "CSS", "SASS", "Tailwind",
  "Jest", "Mocha", "Next.js", "NestJS", "Git", "GitHub", "Figma"
];

// ✅ Function to detect skills in combined text
const fuzzyMatchSkills = (text, skillsList) => {
  return skillsList.filter(skill =>
    text.toLowerCase().includes(skill.toLowerCase())
  );
};

router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const uniqueFileName = `${Date.now()}-${uuidv4()}-${req.file.originalname}`;
    const file = bucket.file(uniqueFileName);

    // Upload to Firebase Storage
    await file.save(req.file.buffer, { metadata: { contentType: req.file.mimetype } });
    await file.makePublic();
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFileName}`;

    let extractedText = "";

    if (req.file.mimetype === "application/pdf") {
      const data = await pdfParse(req.file.buffer);
      extractedText = cleanText(data.text);
    } else if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const data = await mammoth.extractRawText({ buffer: req.file.buffer });
      extractedText = cleanText(data.value);
    } else {
      return res.status(400).json({ message: "Unsupported file format" });
    }

    console.log("Cleaned Text Sent to Python:", extractedText.slice(0, 500));

    // Spawn Python script
    const pythonCommand = process.platform === "win32" ? "python" : "python3";
    const scriptPath = path.join(__dirname, "../utils/nlpProcessor.py");
    const pythonProcess = spawn(pythonCommand, [scriptPath]);

    pythonProcess.stdin.write(extractedText);
    pythonProcess.stdin.end();

    let stdoutData = "";
    let stderrData = "";

    pythonProcess.stdout.on("data", (data) => {
      stdoutData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      stderrData += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (stderrData) {
        console.error("Python Script Error:", stderrData);
        return res.status(500).json({ message: "NLP processing failed", error: stderrData });
      }

      try {
        console.log("Raw NLP Output:", stdoutData.trim());
        const nlpData = JSON.parse(stdoutData.trim());
        console.log("Parsed NLP Data:", nlpData);

        // ✅ Post-process: detect missed tech skills in both text + experience
        const allTextCombined = `${extractedText} ${nlpData.experienceSection || ""}`;
        const detectedSkills = fuzzyMatchSkills(allTextCombined, techSkills);

        // ✅ Merge NLP-extracted skills with JS-detected skills (unique only)
        const uniqueSkills = Array.from(new Set([
          ...(nlpData.skills || []),
          ...detectedSkills
        ]));

        console.log("Post-processed Unique Skills:", uniqueSkills);

        const newResume = new Resume({
          userId: req.user.id,
          fileUrl,
          extractedText,
          skillsSection: uniqueSkills.join(", "),
          experienceSection: nlpData.experienceSection || "",
        });

        newResume.save()
          .then(() => res.status(200).json({
            message: "File uploaded and processed successfully",
            fileUrl,
            nlpData,
            finalSkills: uniqueSkills
          }))
          .catch(err => res.status(500).json({ message: "Database save failed", error: err }));

      } catch (jsonError) {
        console.error("JSON Parse Error:", jsonError);
        res.status(500).json({ message: "Invalid JSON response from NLP script", error: jsonError.message });
      }
    });

  } catch (error) {
    console.error("Upload and Extraction Error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

// Fetch uploaded files
router.get("/files", authMiddleware, async (req, res) => {
  try {
    const files = await Resume.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch files", error: err });
  }
});

// Fetch resumes
router.get("/resumes", authMiddleware, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(resumes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch resumes", error: err });
  }
});

module.exports = router;
