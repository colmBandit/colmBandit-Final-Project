const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const uploadRoutes = require("./routes/uploadRoutes");
const seedJobsRoute = require("./routes/seedJobsRoute");
const recommendationsRoute = require("./routes/recommendationsRoute");


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes")); // ✅ Ensure jobs route is registered
app.use("/api/upload", uploadRoutes);
app.use("/api", seedJobsRoute);
app.use("/api", recommendationsRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
