const express = require("express");
const multer = require("multer");
const fs = require("fs");

const authMiddleware = require("../middleware/auth.middleware");
const { uploadDocument } = require("../services/ai.service");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const SUPPORTED_EXTENSIONS = [
  ".pdf",
  ".txt",
  ".json",
];

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    let uploadedPath = null;

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "A document file is required",
        });
      }

      uploadedPath = req.file.path;

      const extension =
        require("path")
          .extname(req.file.originalname)
          .toLowerCase();

      if (!SUPPORTED_EXTENSIONS.includes(extension)) {
        return res.status(400).json({
          success: false,
          message:
            "Unsupported file type. Supported types: PDF, TXT, JSON",
        });
      }

      const documentType =
        req.body.document_type || "uploaded";

      const result = await uploadDocument(
        uploadedPath,
        req.file.originalname,
        documentType
      );

      return res.status(200).json(result);

    } catch (error) {
      console.error(
        "Document upload error:",
        error
      );

      if (error.name === "AbortError") {
        return res.status(504).json({
          success: false,
          message:
            "AI document processing took too long",
        });
      }

      return res.status(502).json({
        success: false,
        message:
          "Unable to process document through AI service",
      });

    } finally {
      if (
        uploadedPath &&
        fs.existsSync(uploadedPath)
      ) {
        fs.unlinkSync(uploadedPath);
      }
    }
  }
);

module.exports = router;