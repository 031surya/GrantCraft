const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const { matchGrants } = require("../services/ai.service");

const router = express.Router();

router.post(
  "/match",
  authMiddleware,
  async (req, res) => {
    try {
      const { ngo, project, funding } = req.body;

      if (!ngo || !project || !funding) {
        return res.status(400).json({
          success: false,
          message:
            "NGO, project, and funding information are required",
        });
      }

      if (
        !project.description ||
        project.description.trim().length < 20
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Project description must be at least 20 characters long",
        });
      }

      if (
        !funding.amount ||
        funding.amount <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "A valid funding amount is required",
        });
      }

      const result = await matchGrants({
        ngo,
        project,
        funding,
      });

      return res.status(200).json(result);

    } catch (error) {
      console.error(
        "Grant matching error:",
        error
      );

      if (error.name === "AbortError") {
        return res.status(504).json({
          success: false,
          message:
            "AI service took too long to respond",
        });
      }

      return res.status(502).json({
        success: false,
        message:
          "Unable to get grant matches from AI service",
      });
    }
  }
);

module.exports = router;