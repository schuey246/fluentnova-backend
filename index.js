import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userInput = req.body.userInput;

  try {
    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: "Correct the grammar and reply to: " + userInput,
            },
          ],
        }),
      },
    );

    const data = await openaiRes.json();

    // Extract and log reply for debugging
    const reply =
      data.choices?.[0]?.message?.content?.trim() || "⚠️ No reply received.";
    console.log("🧠 FluentNova replied:", reply);

    res.json({ reply });
  } catch (err) {
    console.error("❌ Error contacting OpenAI:", err.message);
    res
      .status(500)
      .json({ reply: "⚠️ Internal server error. Please try again later." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ FluentNova AI Proxy is running at http://localhost:${PORT}`);
});
