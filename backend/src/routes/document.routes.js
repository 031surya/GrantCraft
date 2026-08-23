const express = require("express");
const multer = require("multer");
const fs = require("fs");

const authMiddleware = require("../middleware/auth.middleware");
const { uploadDocument } = require("../services/ai.service");

const Document = require("../models/Document");
const Organization = require("../models/Organization");

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

router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const documents =
        await Document.find({
          owner: req.user.userId,
        })
          .sort({
            createdAt: -1,
          })
          .lean();

      return res.status(200).json({
        success: true,
        data: documents,
      });
    } catch (error) {
      console.error(
        "Document listing error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load documents",
      });
    }
  }
);

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

const aiData = result?.data || result;

let organizationId = null;

try {
  const organization =
    await Organization.findOne({
      owner: req.user.userId,
    });

  if (organization) {
    organizationId =
      organization._id;
  }
} catch (organizationError) {
  console.error(
    "Organization lookup failed:",
    organizationError
  );
}

const savedDocument =
  await Document.create({
    owner: req.user.userId,

    organization:
      organizationId,

    originalName:
      req.file.originalname,

    documentType,

    fileType:
      extension.replace(".", ""),

    fileSize:
      req.file.size,

    documentsLoaded:
      aiData.documents_loaded || 0,

    chunksCreated:
      aiData.chunks_created || 0,

    status:
      aiData.status === "indexed"
        ? "indexed"
        : "processing",

    source:
      aiData.source ||
      req.file.originalname,
  });

return res.status(200).json({
  success: true,

  data: {
    ...aiData,

    document_id:
      savedDocument._id,

    database_status:
      savedDocument.status,
  },
});

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