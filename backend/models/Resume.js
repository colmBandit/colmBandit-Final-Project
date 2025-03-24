const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileUrl: { type: String, required: true },
  extractedText: { type: String },
  skillsSection: { type: String },
  experienceSection: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resume", resumeSchema);
