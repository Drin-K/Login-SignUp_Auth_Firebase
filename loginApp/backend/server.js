import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// ✅ Zëvendëso me vlerat nga GitHub Developer Settings
const CLIENT_ID = "Ov23liKRI3UNokX0DcG0";
const CLIENT_SECRET = "04d790d56d53bd3d3057fc997b5d88bd5fe2cb30";

app.post("/exchange_github_token", async (req, res) => {
  const { code } = req.body;

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
    res.json(data);
  } catch (error) {
    console.error("❌ Gabim gjatë exchange:", error);
    res.status(500).json({ error: "Failed to exchange token" });
  }
});

app.listen(3000, () => console.log("✅ GitHub backend running on port 3000"));
