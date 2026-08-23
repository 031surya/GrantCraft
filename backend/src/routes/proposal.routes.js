const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const { generateProposal } = require("../services/ai.service");

const router = express.Router();

router.post(
  "/generate",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        program,
        grant,
        word_limit,
        max_revisions,
      } = req.body;

      // ---------------------------------------------------
      // BASIC VALIDATION
      // ---------------------------------------------------

      if (!program || !grant) {
        return res.status(400).json({
          success: false,
          message:
            "Program and grant information are required",
        });
      }

      if (
        !program.organization_name ||
        !program.project_description
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Organization name and project description are required",
        });
      }

      if (
        program.project_description.trim().length < 20
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Project description must be at least 20 characters long",
        });
      }

      if (
        !program.requested_amount ||
        Number(program.requested_amount) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "A valid requested funding amount is required",
        });
      }

      // ---------------------------------------------------
      // PROPOSAL GENERATION
      // ---------------------------------------------------

      const result = await generateProposal({
        program,
        grant,
        word_limit:
          Number(word_limit) || 1500,
        max_revisions:
          Number.isInteger(Number(max_revisions))
            ? Number(max_revisions)
            : 2,
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error(
        "Proposal generation error:",
        error
      );

      if (error.name === "AbortError") {
        return res.status(504).json({
          success: false,
          message:
            "Proposal generation service took too long to respond",
        });
      }

      return res.status(502).json({
        success: false,
        message:
          error.message ||
          "Unable to generate proposal from AI service",
      });
    }
  }
);

module.exports = router;