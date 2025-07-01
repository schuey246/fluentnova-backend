import express from "express";
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
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
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
    });

    const data = await openaiRes.json();

    // Optional: Log full response for debugging
    console.log("🔎 OpenAI API response:", data);

    // Handle OpenAI errors
    if (data.error) {
      console.error("❌ OpenAI error:", data.error);
      return res.json({ reply: `⚠️ OpenAI error: ${data.error.message}` });
    }

    const reply =
      data.choices?.[0]?.message?.content?.trim() || "⚠️ No reply received.";

    console.log("🧠 FluentNova replied:", reply);
    res.json({ reply });

  } catch (err) {
    console.error("❌ Server error:", err.message);
    res
      .status(500)
      .json({ reply: "⚠️ Internal server error. Please try again later." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ FluentNova AI Proxy is running at http://localhost:${PORT}`);
});
