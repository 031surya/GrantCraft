const mongoose = require("mongoose");

const proposalHistorySchema = new mongoose.Schema(
  {
    // ---------------------------------------------------
    // OWNER / ORGANIZATION
    // ---------------------------------------------------

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
      index: true,
    },

    // ---------------------------------------------------
    // GRANT INFORMATION
    // ---------------------------------------------------

    grant: {
      grantId: {
        type: String,
        required: true,
      },

      funderName: {
        type: String,
        default: "",
      },

      grantTitle: {
        type: String,
        default: "",
      },

      funding: {
        min: {
          type: Number,
          default: null,
        },

        max: {
          type: Number,
          default: null,
        },

        currency: {
          type: String,
          default: "USD",
        },

        requestedAmount: {
          type: Number,
          default: null,
        },

        fitsRange: {
          type: Boolean,
          default: false,
        },
      },

      deadline: {
        type: String,
        default: null,
      },
    },

    // ---------------------------------------------------
    // PROPOSAL
    // ---------------------------------------------------

    proposal: {
      organizationBackground: {
        type: String,
        default: "",
      },

      programDescription: {
        type: String,
        default: "",
      },

      targetBeneficiaries: {
        type: String,
        default: "",
      },

      expectedOutcomes: {
        type: String,
        default: "",
      },

      implementationPlan: {
        type: String,
        default: "",
      },

      evaluationPlan: {
        type: String,
        default: "",
      },

      budgetSummary: {
        type: String,
        default: "",
      },
    },

    // ---------------------------------------------------
    // AUDIT INFORMATION
    // ---------------------------------------------------

    audit: {
      status: {
        type: String,
        enum: ["PASS", "FAIL", null],
        default: null,
      },

      accuracyScore: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },

      totalChecked: {
        type: Number,
        default: 0,
      },

      verified: {
        type: Number,
        default: 0,
      },

      mismatches: {
        type: Number,
        default: 0,
      },

      notFound: {
        type: Number,
        default: 0,
      },

      unsupportedClaimsCount: {
        type: Number,
        default: 0,
      },

      summary: {
        type: String,
        default: "",
      },
    },

    // ---------------------------------------------------
    // GENERATION INFORMATION
    // ---------------------------------------------------

    revisionCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    wordCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    wordLimit: {
      type: Number,
      default: 1500,
      min: 1,
    },

    // ---------------------------------------------------
    // HISTORY STATUS
    // ---------------------------------------------------

    status: {
      type: String,
      enum: [
        "draft",
        "audited",
        "submitted",
        "accepted",
        "rejected",
      ],
      default: "draft",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Useful for history queries such as:
// "show this user's newest proposals first"
proposalHistorySchema.index({
  user: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "ProposalHistory",
  proposalHistorySchema
);