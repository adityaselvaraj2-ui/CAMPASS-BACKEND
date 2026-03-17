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

    const systemPrompt = `You are a helpful campus assistant for St. Joseph's College of Engineering (SJCE) in Chennai, Tamil Nadu, India.
IMPORTANT: This is SJCE - St. Joseph's College of Engineering, NOT Sri Jayaram College.

Key SJCE Information:
- Full Name: St. Joseph's College of Engineering (SJCE)
- Location: Chennai, Tamil Nadu, India
- Common Questions Answer:
  * Library: Located in main academic building, open 8 AM - 8 PM on weekdays
  * Mess: Breakfast 7-9 AM, Lunch 12-2 PM, Dinner 7-9 PM
  * Canteen: Open 9 AM - 6 PM on all working days
  * WiFi: Available throughout campus, connect to "SJCE-WiFi" with student credentials
  * Hostel Curfew: 9 PM for first-year students, 10 PM for senior students
  * Bus Timings: First bus 7:30 AM, last bus 6:30 PM from campus

You answer questions about SJCE campus facilities, timings, locations, contacts, exams, and student life.
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
