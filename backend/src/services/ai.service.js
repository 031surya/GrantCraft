const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://localhost:8000";

const matchGrants = async (program) => {
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
        body: JSON.stringify({
          program,
        }),
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

module.exports = {
  matchGrants,
};