const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const { campusNavigationData, findDestination } = require('../data/campusNavigationData');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Campus Navigation Assistant - Context-aware navigation helper
router.post('/', async (req, res) => {
  try {
    const { message, campus } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    if (!campus) {
      return res.status(400).json({ error: 'campus selection is required' });
    }

    // Get campus-specific navigation data
    const campusData = campusNavigationData[campus];
    if (!campusData) {
      return res.status(400).json({ error: 'invalid campus selected' });
    }

    // Check if user is asking for navigation/directions
    const navigationKeywords = [
      'take me to', 'show route to', 'navigate to', 'how to reach', 'directions to',
      'where is', 'location of', 'find', 'show me', 'go to', 'route to', 'path to'
    ];

    const isNavigationRequest = navigationKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    // Extract destination from message
    let destination = null;
    let destinationKey = null;

    // Try to find destination in campus data
    const possibleDestinations = Object.keys(campusData.places);
    for (const dest of possibleDestinations) {
      const place = campusData.places[dest];
      const query = message.toLowerCase();
      
      // Check direct name match
      if (query.includes(dest.toLowerCase()) || query.includes(place.name.toLowerCase())) {
        destination = place;
        destinationKey = dest;
        break;
      }
      
      // Check aliases
      if (place.aliases) {
        for (const alias of place.aliases) {
          if (query.includes(alias.toLowerCase()) || alias.toLowerCase().includes(query)) {
            destination = place;
            destinationKey = dest;
            break;
          }
        }
      }
      if (destination) break;
    }

    // If destination found and user wants navigation
    if (destination && isNavigationRequest) {
      const response = {
        reply: `Opening navigation to ${destination.name} at ${campusData.name}...`,
        destination: {
          name: destination.name,
          mapsQuery: destination.mapsQuery,
          coordinates: destination.coordinates,
          key: destinationKey
        },
        action: 'navigate'
      };
      return res.json(response);
    }

    // If destination found but no navigation intent, provide info
    if (destination) {
      let info = `${destination.name} at ${campusData.name}. `;
      if (destination.description) info += destination.description + ". ";
      if (destination.timings) {
        if (typeof destination.timings === 'object') {
          info += `Timings: ${Object.entries(destination.timings).map(([k, v]) => `${k}: ${v}`).join(', ')}. `;
        } else {
          info += `Timings: ${destination.timings}. `;
        }
      }
      if (destination.contact) info += `Contact: ${destination.contact}. `;
      info += `Would you like directions to ${destination.name}?`;

      return res.json({
        reply: info,
        destination: {
          name: destination.name,
          mapsQuery: destination.mapsQuery,
          coordinates: destination.coordinates,
          key: destinationKey
        },
        action: 'info'
      });
    }

    // Create campus-context aware system prompt
    const systemPrompt = `You are Campus Navigator AI for ${campusData.name} (${campus}) in ${campusData.city}.

Your role:
- Help users navigate inside ${campusData.name} campus.
- Answer questions about ${campusData.name} and its known destinations.
- Understand that the active college selected by the user is the only context to use.

Behavior rules:
- Use only the ${campusData.name} campus data provided below.
- Do not mix information from other colleges.
- Correct minor spelling mistakes and voice-input errors when intent is clear.
- If the user asks for directions, route, path, navigation, or how to reach a place, respond briefly and prefer the mapped destination workflow.
- If a destination exists in the selected campus data, provide a short helpful answer.
- If the destination is not found, say: "Sorry, this location is not available in the selected campus database."
- Keep the answer short, practical, and navigation-focused.

Available destinations at ${campusData.name}:
${Object.entries(campusData.places).map(([key, place]) => 
  `- ${place.name} (aliases: ${place.aliases.join(', ')})${place.description ? ': ' + place.description : ''}`
).join('\n')}

Campus information:
- Full Name: ${campusData.name}
- Location: ${campusData.address}
- City: ${campusData.city}

Now answer this question about ${campusData.name}: ${message}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 300,
      temperature: 0.2, // Very low temperature for factual responses
    });

    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't process your request. Please try again.";
    
    res.json({ reply, action: 'chat' });
  } catch (err) {
    console.error('Campus Navigation AI Error:', err);
    res.status(500).json({ error: 'Navigation service temporarily unavailable' });
  }
});

module.exports = router;
