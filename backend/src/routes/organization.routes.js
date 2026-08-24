const express = require("express");

const Organization = require("../models/Organization");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

/*
=========================================================
GET ORGANIZATION PROFILE
=========================================================
*/

router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const organization =
        await Organization.findOne({
          owner: req.user.id,
        });

      return res.json({
        success: true,
        data: organization,
      });
    } catch (error) {
      console.error(
        "Get organization error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load organization profile",
      });
    }
  }
);

/*
=========================================================
CREATE / UPDATE ORGANIZATION PROFILE
=========================================================
*/

router.put(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        organizationName,
        organizationType,
        location,
        mission,
        focusAreas,
        beneficiaries,
        fundingPreferences,
      } = req.body;

      const organization =
        await Organization.findOneAndUpdate(
          {
            owner: req.user.id,
          },
          {
            owner: req.user.id,
            organizationName,
            organizationType,
            location,
            mission,
            focusAreas,
            beneficiaries,
            fundingPreferences,
          },
          {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
          }
        );

      return res.json({
        success: true,
        message:
          "Organization profile saved successfully",
        data: organization,
      });
    } catch (error) {
      console.error(
        "Save organization error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to save organization profile",
      });
    }
  }
);

module.exports = router;