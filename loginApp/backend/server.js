import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ GitHub App credentials
const CLIENT_ID = "Ov23liKRI3UNokX0DcG0";
const CLIENT_SECRET = "04d790d56d53bd3d3057fc997b5d88bd5fe2cb30";

// ✅ Endpoint to exchange GitHub authorization code for access_token
app.post("/exchange_github_token", async (req, res) => {
  const { code } = req.body;
  console.log("📥 Received authorization code:", code);

  try {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      }),
    });

    const data = await response.json();
    console.log("🔑 GitHub token response:", data);
    res.json(data);
  } catch (error) {
    console.error("❌ Error exchanging GitHub token:", error);
    res.status(500).json({ error: "Failed to exchange GitHub code" });
  }
});

// ✅ Start server
app.listen(3000, () => console.log("✅ GitHub backend running on port 3000"));
