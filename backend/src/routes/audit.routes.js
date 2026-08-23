const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const { auditProposal } = require("../services/ai.service");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        program,
        grant,
        proposal,
      } = req.body;

      // ---------------------------------------------------
      // BASIC VALIDATION
      // ---------------------------------------------------

      if (
        !program ||
        !grant ||
        !proposal
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Program, grant, and proposal information are required",
        });
      }

      // ---------------------------------------------------
      // AUDIT PROPOSAL
      // ---------------------------------------------------

      const result = await auditProposal({
        program,
        grant,
        proposal,
      });

      return res.status(200).json(result);

    } catch (error) {
      console.error(
        "AI audit error:",
        error
      );

      if (error.name === "AbortError") {
        return res.status(504).json({
          success: false,
          message:
            "AI audit service took too long to respond",
        });
      }

      return res.status(502).json({
        success: false,
        message:
          error.message ||
          "Unable to audit proposal",
      });
    }
  }
);

module.exports = router;