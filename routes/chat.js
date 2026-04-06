const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const campusKnowledge = require('../data/campusKnowledge');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Enhanced campus assistant with comprehensive knowledge and location awareness
router.post('/', async (req, res) => {
  try {
    const { message, campus } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    // Get campus-specific knowledge
    const campusInfo = campusKnowledge[campus] || campusKnowledge.SJCE;
    
    // Create location-aware system prompt with detailed campus information
    const systemPrompt = `You are an expert campus assistant for ${campusInfo.fullName} (${campus}) in ${campusInfo.location}.

CRITICAL RULES:
1. You MUST only provide information about ${campusInfo.fullName}. Never mention other colleges.
2. Use the detailed campus information below to provide accurate, specific answers.
3. For location questions, use exact building names, coordinates, and landmarks.
4. Be precise about timings, contact numbers, and locations.

CAMPUS IDENTITY:
- Full Name: ${campusInfo.fullName}
- Short Name: ${campusInfo.shortName}
- Location: ${campusInfo.location}
- Established: ${campusInfo.established}
- Affiliation: ${campusInfo.affiliation}

ACADEMIC DEPARTMENTS:
${campusInfo.academics.departments.map(dept => `- ${dept}`).join('\n')}

LIBRARY INFORMATION:
- Name: ${campusInfo.academics.library.name}
- Location: ${campusInfo.academics.library.location}
- Coordinates: ${campusInfo.academics.library.coordinates || 'Available on campus map'}
- Timings: ${campusInfo.academics.library.timings}
- Contact: ${campusInfo.academics.library.contact || 'Available at library desk'}
- Description: ${campusInfo.academics.library.description}

KEY BUILDINGS AND LOCATIONS:
${campusInfo.infrastructure ? Object.entries(campusInfo.infrastructure.buildings || {}).map(([key, building]) => 
  `${building.name}:
  - Location: ${building.coordinates || 'Main campus area'}
  - Floors: ${building.floors}
  - Departments: ${building.departments?.join(', ') || 'Various departments'}
  - Description: ${building.description}
  ${building.landmarks ? '- Landmarks: ' + building.landmarks.join(', ') : ''}`
).join('\n\n') : ''}

FACILITIES AND SERVICES:
${campusInfo.infrastructure ? Object.entries(campusInfo.infrastructure.facilities || {}).map(([key, facility]) => {
  let details = `${facility.name}:\n`;
  if (facility.location) details += `- Location: ${facility.location}\n`;
  if (facility.coordinates) details += `- Coordinates: ${facility.coordinates}\n`;
  if (facility.timings) {
    if (typeof facility.timings === 'object') {
      details += `- Timings: ${Object.entries(facility.timings).map(([k, v]) => `${k}: ${v}`).join(', ')}\n`;
    } else {
      details += `- Timings: ${facility.timings}\n`;
    }
  }
  if (facility.contact) details += `- Contact: ${facility.contact}\n`;
  if (facility.description) details += `- Description: ${facility.description}\n`;
  if (facility.routes) details += `- Routes: ${facility.routes.join(', ')}\n`;
  return details;
}).join('\n') : ''}

IMPORTANT LOCATIONS:
${campusInfo.infrastructure && campusInfo.infrastructure.locations ? Object.entries(campusInfo.infrastructure.locations).map(([key, location]) => 
  `${location.name}:
  - Coordinates: ${location.coordinates || 'Main campus'}
  - Description: ${location.description}
  ${location.landmarks ? '- Landmarks: ' + location.landmarks.join(', ') : ''}`
).join('\n\n') : ''}

CONTACT INFORMATION:
${Object.entries(campusInfo.contacts || {}).map(([dept, contact]) => 
  `${dept}: ${contact}`
).join('\n')}

CAMPUS LIFE:
${campusInfo.campusLife ? `
- WiFi Network: ${campusInfo.campusLife.wifi?.network || 'Campus WiFi'}
- ${campusInfo.campusLife.wifi?.setup || 'Contact IT for WiFi access'}
- Hostel Curfew: ${campusInfo.campusLife.hostels?.boys || 'Contact hostel administration'}
- Labs: ${campusInfo.campusLife.labs?.description || 'Well-equipped labs available'}
` : ''}

ANSWERING GUIDELINES:
1. Always mention you are talking about ${campusInfo.fullName} specifically
2. For "where is" questions: Provide exact location, nearby landmarks, and coordinates if available
3. For "when" questions: Give specific timings and days
4. For "how to" questions: Provide step-by-step directions within campus
5. For contact questions: Provide exact phone numbers and office locations
6. Be friendly, professional, and helpful like a real campus guide
7. If you don't know something specific, admit it and suggest where to find help
8. Never give information about other colleges - you are the ${campusInfo.shortName} expert only

EXAMPLE RESPONSES:
Q: "Where is the library?"
A: "The ${campusInfo.academics.library.name} at ${campusInfo.shortName} is located at ${campusInfo.academics.library.location}. ${campusInfo.academics.library.description} It's open ${campusInfo.academics.library.timings}. You can contact them at ${campusInfo.academics.library.contact || 'the library desk'}."

Q: "What are the canteen timings?"
A: "At ${campusInfo.shortName}, the ${campusInfo.infrastructure.facilities.canteen?.name || 'canteen'} serves: ${Object.entries(campusInfo.infrastructure.facilities.canteen?.timings || {}).map(([k, v]) => `${k}: ${v}`).join(', ')}."

Now answer this question about ${campusInfo.fullName}: ${message}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 600,
      temperature: 0.3, // Lower temperature for more factual responses
    });

    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response. Please try again.";
    res.json({ reply });
  } catch (err) {
    console.error('Chat API Error:', err);
    res.status(500).json({ error: 'Chat service temporarily unavailable' });
  }
});

module.exports = router;
