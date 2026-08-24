const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const ProposalHistory = require("../models/ProposalHistory");

const router = express.Router();


// =====================================================
// GET ALL HISTORY
// =====================================================

router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const history = await ProposalHistory.find({
        user: req.user.userId,
      })
        .populate(
          "organization",
          "organizationName organizationType location"
        )
        .sort({
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      console.error(
        "Get proposal history error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load proposal history",
      });
    }
  }
);


// =====================================================
// GET SINGLE HISTORY ITEM
// =====================================================

router.get(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const history =
        await ProposalHistory.findOne({
          _id: req.params.id,
          user: req.user.userId,
        }).populate(
          "organization",
          "organizationName organizationType location mission focusAreas beneficiaries"
        );

      if (!history) {
        return res.status(404).json({
          success: false,
          message:
            "Proposal history record not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      console.error(
        "Get proposal history item error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load proposal history record",
      });
    }
  }
);


// =====================================================
// CREATE HISTORY RECORD
// =====================================================

router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        organization,
        grant,
        proposal,
        audit,
        revisionCount,
        wordCount,
        wordLimit,
        status,
      } = req.body;

      // -------------------------------------------------
      // BASIC VALIDATION
      // -------------------------------------------------

      if (!grant || !grant.grantId) {
        return res.status(400).json({
          success: false,
          message:
            "Grant information is required",
        });
      }

      if (!proposal) {
        return res.status(400).json({
          success: false,
          message:
            "Proposal information is required",
        });
      }

      // -------------------------------------------------
      // CREATE HISTORY RECORD
      // -------------------------------------------------

      const history =
        await ProposalHistory.create({
          user: req.user.userId,

          organization:
            organization || null,

          grant,

          proposal,

          audit:
            audit || {},

          revisionCount:
            revisionCount || 0,

          wordCount:
            wordCount || 0,

          wordLimit:
            wordLimit || 1500,

          status:
            status || "draft",
        });

      return res.status(201).json({
        success: true,
        message:
          "Proposal history saved successfully",
        data: history,
      });
    } catch (error) {
      console.error(
        "Create proposal history error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to save proposal history",
      });
    }
  }
);


// =====================================================
// UPDATE STATUS
// =====================================================

router.patch(
  "/:id/status",
  authMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "draft",
        "audited",
        "submitted",
        "accepted",
        "rejected",
      ];

      if (
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid proposal status",
        });
      }

      const history =
        await ProposalHistory.findOneAndUpdate(
          {
            _id: req.params.id,
            user: req.user.userId,
          },
          {
            status,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!history) {
        return res.status(404).json({
          success: false,
          message:
            "Proposal history record not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Proposal status updated successfully",
        data: history,
      });
    } catch (error) {
      console.error(
        "Update proposal status error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update proposal status",
      });
    }
  }
);


// =====================================================
// DELETE HISTORY
// =====================================================

router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const history =
        await ProposalHistory.findOneAndDelete({
          _id: req.params.id,
          user: req.user.userId,
        });

      if (!history) {
        return res.status(404).json({
          success: false,
          message:
            "Proposal history record not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Proposal history deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete proposal history error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to delete proposal history",
      });
    }
  }
);


module.exports = router;