const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const { matchGrants } = require("../services/ai.service");

const router = express.Router();

router.post(
  "/match",
  authMiddleware,
  async (req, res) => {
    try {
      const { program } = req.body;

      if (!program || program.trim().length < 10) {
        return res.status(400).json({
          success: false,
          message:
            "Program description must be at least 10 characters long",
        });
      }

      const result = await matchGrants(program.trim());

      return res.status(200).json(result);
    } catch (error) {
      console.error("Grant matching error:", error);

      if (error.name === "AbortError") {
        return res.status(504).json({
          success: false,
          message: "AI service took too long to respond",
        });
      }

      return res.status(502).json({
        success: false,
        message: "Unable to get grant matches from AI service",
      });
    }
  }
);

module.exports = router;