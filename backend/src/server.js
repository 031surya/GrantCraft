const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const grantRoutes = require("./routes/grant.routes");
const proposalRoutes = require("./routes/proposal.routes");
const auditRoutes = require("./routes/audit.routes");
const documentRoutes = require("./routes/document.routes");
const organizationRoutes = require("./routes/organization.routes");
const historyRoutes = require("./routes/history.routes");

const app = express();

const PORT = process.env.PORT || 5000;

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:3000";

// Middleware

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(
  express.json({
    limit: "1mb",
  })
);

// Authentication routes
app.use("/api/auth", authRoutes);

// Grant matching routes
app.use("/api/grants", grantRoutes);

// Proposal generation routes
app.use("/api/proposals", proposalRoutes);

// AI audit routes
app.use("/api/audit", auditRoutes);

// Documents routes
app.use("/api/documents", documentRoutes);

// Organization routes
app.use(
  "/api/organization",
  organizationRoutes
);

// Proposal & Grant History routes
app.use(
  "/api/history",
  historyRoutes
);

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
    console.log(
      `GrantCraft backend running on http://localhost:${PORT}`
    );
  });
};


// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
  console.error("Unhandled server error:", error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

startServer();