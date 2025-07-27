const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const groqChecker = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Missing 'text' in request body." });
    }

    const response = await openai.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Always respond in no more than two short sentences.",
        },
        {
          role: "user",
          content: text,
        },
      ],
      max_tokens: 60, // limits the reply length
      temperature: 0.5, // keeps the answer focused
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("Groq error:", err.message);
    res.status(500).json({ error: "Groq API failed" });
  }
};

module.exports = { groqChecker };
