const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const campusKnowledge = require('../data/campusKnowledge');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Enhanced campus assistant with comprehensive knowledge
router.post('/', async (req, res) => {
  try {
    const { message, campus } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    // Get campus-specific knowledge
    const campusInfo = campusKnowledge[campus] || campusKnowledge.SJCE;
    
    // Create comprehensive system prompt with detailed campus information
    const systemPrompt = `You are an expert campus assistant for ${campusInfo.fullName} (${campus}) in ${campusInfo.location}.

IMPORTANT: You have comprehensive knowledge about this campus. Use the following information to provide accurate, detailed answers:

CAMPUS OVERVIEW:
- Full Name: ${campusInfo.fullName}
- Established: ${campusInfo.established}
- Affiliation: ${campusInfo.affiliation}
- Location: ${campusInfo.location}

ACADEMIC INFORMATION:
Departments: ${campusInfo.academics.departments.join(', ')}
Library: ${campusInfo.academics.library.name} - ${campusInfo.academics.library.location}
Library Timings: ${campusInfo.academics.library.timings}

CAMPUS INFRASTRUCTURE:
${campusInfo.infrastructure ? Object.entries(campusInfo.infrastructure.buildings || {}).map(([key, building]) => 
  `${building.name}: ${building.floors} floors, houses ${building.departments?.join(', ') || 'various departments'}`
).join('\n') : ''}

KEY FACILITIES:
${campusInfo.infrastructure ? Object.entries(campusInfo.infrastructure.facilities || {}).map(([key, facility]) => {
  let details = `${key.charAt(0).toUpperCase() + key.slice(1)}: `;
  if (facility.location) details += `Location: ${facility.location}, `;
  if (facility.timings) details += `Timings: ${typeof facility.timings === 'object' ? Object.entries(facility.timings).map(([k, v]) => `${k}: ${v}`).join(', ') : facility.timings}`;
  return details;
}).join('\n') : ''}

SPECIFIC LOCATIONS:
${campusInfo.infrastructure && campusInfo.infrastructure.locations ? Object.entries(campusInfo.infrastructure.locations).map(([key, location]) => 
  `${location.name || key}: ${location.description || location.location || 'Located in campus'}${location.landmarks ? '. Landmarks: ' + location.landmarks.join(', ') : ''}`
).join('\n') : ''}

CONTACT INFORMATION:
${campusInfo.contacts ? Object.entries(campusInfo.contacts).map(([key, contact]) => 
  `${key}: ${contact}`
).join('\n') : ''}

ANSWERING GUIDELINES:
1. Be specific and detailed about locations inside campus
2. Provide exact timings, locations, and contact numbers when available
3. If asked about directions, describe the location relative to campus landmarks
4. Use the comprehensive information above to answer accurately
5. If information is not available, suggest where to find it (office, website, etc.)
6. Be friendly, professional, and helpful
7. For location questions, include building names, floor numbers, and nearby landmarks

EXAMPLE ANSWERS:
Q: "Where is the library?"
A: "The ${campusInfo.academics.library.name} is located at ${campusInfo.academics.library.location} and is open ${campusInfo.academics.library.timings}. It contains ${campusInfo.academics.library.resources || 'extensive resources'} for students."

Q: "What are the mess timings?"
A: "The mess operates at: ${campusInfo.infrastructure.facilities.mess?.timings ? Object.entries(campusInfo.infrastructure.facilities.mess.timings).map(([k, v]) => `${k}: ${v}`).join(', ') : 'Please check with the mess in-charge for current timings'}"

Now answer the user's question using this comprehensive campus knowledge.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Chat service failed' });
  }
});

module.exports = router;
