const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  companyName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  requiredSkills: { type: [String], required: false },
  applicationDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Applied", "Interview", "Rejected", "Offer", "Saved"],
    default: "Applied",
  },
  notes: { type: String },
  interviewDate: { type: Date }, // ✅ New field for storing interview date
});

module.exports = mongoose.model("Job", JobSchema);
