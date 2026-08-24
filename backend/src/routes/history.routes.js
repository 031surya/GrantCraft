const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const ProposalHistory = require("../models/ProposalHistory");

const router = express.Router();


// =====================================================
// DASHBOARD INTELLIGENCE
// =====================================================

router.get(
  "/dashboard",
  authMiddleware,
  async (req, res) => {
    try {
      const history = await ProposalHistory.find({
        user: req.user.userId,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

      const totalProposals = history.length;

      const drafts = history.filter(
        (item) => item.status === "draft"
      ).length;

      const audited = history.filter(
        (item) => item.status === "audited"
      ).length;

      const submitted = history.filter(
        (item) => item.status === "submitted"
      ).length;

      const accepted = history.filter(
        (item) => item.status === "accepted"
      ).length;

      const rejected = history.filter(
        (item) => item.status === "rejected"
      ).length;

      // ---------------------------------------------------
// AUDIT INTELLIGENCE
// ---------------------------------------------------

const auditedRecords = history.filter(
  (item) =>
    item.audit?.status === "PASS" ||
    item.audit?.status === "FAIL"
);

const totalAudited = auditedRecords.length;

// Accuracy is optional because older history records
// may not contain an accuracyScore.
const accuracyRecords = history.filter(
  (item) =>
    typeof item.audit?.accuracyScore === "number"
);

const averageAccuracy =
  accuracyRecords.length > 0
    ? Math.round(
        accuracyRecords.reduce(
          (sum, item) =>
            sum + item.audit.accuracyScore,
          0
        ) / accuracyRecords.length
      )
    : 0;

const passedAudits = history.filter(
  (item) =>
    item.audit?.status === "PASS"
).length;

const failedAudits = history.filter(
  (item) =>
    item.audit?.status === "FAIL"
).length;

const completedAudits =
  passedAudits + failedAudits;

const auditPassRate =
  completedAudits > 0
    ? Math.round(
        (passedAudits / completedAudits) * 100
      )
    : 0;

      const recentProposals = history
        .slice(0, 5)
        .map((item) => ({
          id: item._id,
          grantId: item.grant?.grantId || "",
          grantTitle:
            item.grant?.grantTitle || "",
          funderName:
            item.grant?.funderName || "",
          status: item.status,
          auditStatus:
            item.audit?.status || null,
          accuracyScore:
            item.audit?.accuracyScore ?? null,
          wordCount: item.wordCount || 0,
          createdAt: item.createdAt,
        }));

      return res.status(200).json({
        success: true,
        data: {
          totalProposals,
          drafts,
          audited,
          submitted,
          accepted,
          rejected,
          totalAudited,
          averageAccuracy,
          passedAudits,
          failedAudits,
          auditPassRate,
          recentProposals,
        },
      });
    } catch (error) {
      console.error(
        "Dashboard intelligence error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load dashboard intelligence",
      });
    }
  }
);

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