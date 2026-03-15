const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST /api/chat  — send user message, get LLM reply
router.post('/', async (req, res) => {
  try {
    const { message, campus } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    const systemPrompt = `You are a helpful campus assistant for ${campus || 'a college campus'} in Chennai, India.
You answer questions about campus facilities, timings, locations, contacts, exams, and student life.
Be concise, friendly, and accurate. If you don't know something specific, say so and suggest where to find help.
Do not make up specific phone numbers or timings you are not sure about.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 300,
    });

    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Chat service failed' });
  }
});

module.exports = router;
