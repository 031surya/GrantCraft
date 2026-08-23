const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const grantRoutes = require("./routes/grant.routes");
const proposalRoutes = require("./routes/proposal.routes");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Grant matching routes
app.use("/api/grants", grantRoutes);

// Proposal generation routes
app.use("/api/proposals", proposalRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "GrantCraft backend is running",
  });
});

// Connect MongoDB and start server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`GrantCraft backend running on http://localhost:${PORT}`);
  });
};

startServer();