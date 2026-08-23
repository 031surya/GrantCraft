const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://localhost:8000";

const matchGrants = async (grantRequest) => {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 120000);

  try {
    const response = await fetch(
      `${AI_SERVICE_URL}/grants/match`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(grantRequest),
        signal: controller.signal,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "AI service request failed"
      );
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
};


const generateProposal = async (proposalRequest) => {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 180000);

  try {
    const response = await fetch(
      `${AI_SERVICE_URL}/proposals/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proposalRequest),
        signal: controller.signal,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "AI proposal generation failed"
      );
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
};


const auditProposal = async (auditRequest) => {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 180000);

  try {
    const response = await fetch(
      `${AI_SERVICE_URL}/audit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auditRequest),
        signal: controller.signal,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "AI audit service request failed"
      );
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
};

const uploadDocument = async (
  filePath,
  originalName,
  documentType = "uploaded"
) => {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 180000);

  try {
    const formData = new FormData();

    const fileBuffer = await require("fs").promises.readFile(
      filePath
    );

    const blob = new Blob(
      [fileBuffer],
      {
        type: "application/octet-stream",
      }
    );

    formData.append(
      "file",
      blob,
      originalName
    );

    formData.append(
      "document_type",
      documentType
    );

    const response = await fetch(
      `${AI_SERVICE_URL}/documents/upload`,
      {
        method: "POST",
        body: formData,
        signal: controller.signal,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail ||
          "AI document upload failed"
      );
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
};


module.exports = {
  matchGrants,
  generateProposal,
  auditProposal,
  uploadDocument,
};