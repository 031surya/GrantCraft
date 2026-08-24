const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    organizationName: {
      type: String,
      trim: true,
      default: "",
    },

    organizationType: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    mission: {
      type: String,
      trim: true,
      default: "",
    },

    focusAreas: {
      type: [String],
      default: [],
    },

    beneficiaries: {
      type: String,
      trim: true,
      default: "",
    },

    fundingPreferences: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Organization",
  organizationSchema
);