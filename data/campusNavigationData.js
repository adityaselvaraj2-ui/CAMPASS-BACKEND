// Campus Navigation Data - Structured for Navigation AI
const campusNavigationData = {
  SJCE: {
    name: "St. Joseph's College of Engineering",
    shortName: "SJCE",
    city: "Chennai",
    address: "Old Mahabalipuram Road, Chennai, Tamil Nadu",
    places: {
      library: {
        name: "Central Library",
        aliases: ["central library", "lib", "library"],
        mapsQuery: "St. Joseph's College of Engineering Library, Chennai",
        description: "Three-story library with 50,000+ volumes, digital access, and reading halls",
        coordinates: "12.8697990, 80.2149357",
        timings: "Monday-Saturday: 8:00 AM - 8:00 PM, Sunday: Closed"
      },
      cse_block: {
        name: "CSE Block (Block 1)",
        aliases: ["cse", "computer science", "cs block", "block 1"],
        mapsQuery: "St. Joseph's College of Engineering CSE Block, Chennai",
        description: "Computer Science & Engineering department with AI, ML, and programming labs",
        coordinates: "12.8689675, 80.2163948",
        floors: 4
      },
      it_block: {
        name: "IT Block (Block 2)",
        aliases: ["it", "information technology", "it block", "block 2"],
        mapsQuery: "St. Joseph's College of Engineering IT Block, Chennai",
        description: "Information Technology department with networking and cybersecurity labs",
        coordinates: "12.8689466, 80.2160568",
        floors: 4
      },
      admin_block: {
        name: "Admin & Library Hub",
        aliases: ["admin", "administration", "office", "admin office", "principal office"],
        mapsQuery: "St. Joseph's College of Engineering Administrative Block, Chennai",
        description: "Admin offices, principal office, and student services",
        coordinates: "12.8693150, 80.2169603",
        timings: "Weekdays: 9:00 AM - 5:00 PM, Saturday: 9:00 AM - 1:00 PM"
      },
      canteen: {
        name: "Main Canteen",
        aliases: ["canteen", "food court", "cafeteria", "mess"],
        mapsQuery: "St. Joseph's College of Engineering Canteen, Chennai",
        description: "Multi-cuisine canteen serving breakfast, lunch, snacks, and dinner",
        coordinates: "12.8690303, 80.2157832",
        timings: { breakfast: "7:30 AM - 9:30 AM", lunch: "11:30 AM - 2:30 PM", snacks: "4:00 PM - 5:30 PM", dinner: "7:00 PM - 9:00 PM" }
      },
      medical_centre: {
        name: "Medical Centre",
        aliases: ["medical", "hospital", "health centre", "doctor"],
        mapsQuery: "St. Joseph's College of Engineering Medical Centre, Chennai",
        description: "Campus medical facility with doctor and basic emergency care",
        coordinates: "12.8693150, 80.2169603",
        timings: "Monday-Friday: 8:30 AM - 5:30 PM",
        contact: "044-2450-0900"
      },
      placement_cell: {
        name: "Placement Cell",
        aliases: ["placement", "placements", "career", "training"],
        mapsQuery: "St. Joseph's College of Engineering Placement Cell, Chennai",
        description: "Career services and placement assistance for students",
        coordinates: "12.8693150, 80.2169603",
        timings: "Monday-Friday: 9:00 AM - 5:00 PM",
        contact: "044-2450-0902"
      },
      sports_ground: {
        name: "Sports Ground",
        aliases: ["sports", "ground", "playground", "cricket ground"],
        mapsQuery: "St. Joseph's College of Engineering Sports Ground, Chennai",
        description: "Large sports field for cricket, football, and other outdoor sports",
        facilities: ["Cricket Pitch", "Football Goal", "Running Track"],
        timings: "6:00 AM - 7:00 PM daily"
      },
      main_entrance: {
        name: "Main Entrance",
        aliases: ["entrance", "gate", "main gate"],
        mapsQuery: "St. Joseph's College of Engineering Main Entrance, Chennai",
        description: "Primary entrance gate to SJCE off OMR Road",
        coordinates: "12.8702216, 80.2263868",
        landmarks: ["OMR Road", "Security Office", "Visitor Parking"]
      },
      parking: {
        name: "Parking Areas",
        aliases: ["parking", "car parking", "bike parking"],
        mapsQuery: "St. Joseph's College of Engineering Parking, Chennai",
        description: "Two-wheeler parking near Main Gate, four-wheeler parking behind Admin Block"
      }
    }
  },

  CIT: {
    name: "Chennai Institute of Technology",
    shortName: "CIT",
    city: "Chennai",
    address: "Thirumudivakkam, Chennai, Tamil Nadu",
    places: {
      library: {
        name: "Digital Library",
        aliases: ["central library", "lib", "library", "digital library"],
        mapsQuery: "Chennai Institute of Technology Library, Chennai",
        description: "Modern digital library with extensive e-resources and study spaces",
        coordinates: "13.126263, 80.208433",
        timings: "8:00 AM - 8:00 PM (Monday-Saturday), Sunday: Closed"
      },
      academic_block: {
        name: "Academic Block",
        aliases: ["academic", "main block", "classes"],
        mapsQuery: "Chennai Institute of Technology Academic Block, Chennai",
        description: "Main academic building housing CSE, AIML, and IT departments",
        coordinates: "13.126263, 80.208433",
        floors: 5
      },
      admin_block: {
        name: "Administrative Block",
        aliases: ["admin", "administration", "office", "admin office"],
        mapsQuery: "Chennai Institute of Technology Administrative Block, Chennai",
        description: "Admin offices and principal office",
        timings: "Monday-Friday: 9:00 AM - 5:00 PM"
      },
      canteen: {
        name: "CIT Food Court",
        aliases: ["canteen", "food court", "cafeteria", "mess"],
        mapsQuery: "Chennai Institute of Technology Canteen, Chennai",
        description: "Multi-cuisine food court with variety of options",
        timings: { breakfast: "8:00 AM - 9:00 AM", lunch: "12:00 PM - 2:00 PM", snacks: "4:00 PM - 5:00 PM" }
      },
      health_centre: {
        name: "Health Centre",
        aliases: ["medical", "hospital", "health centre", "doctor"],
        mapsQuery: "Chennai Institute of Technology Health Centre, Chennai",
        description: "Campus health facility with basic medical care",
        timings: "Monday-Friday: 9:00 AM - 4:30 PM",
        contact: "044-2680-5900"
      },
      placement_cell: {
        name: "Placement Cell",
        aliases: ["placement", "placements", "career", "training"],
        mapsQuery: "Chennai Institute of Technology Placement Cell, Chennai",
        description: "Career services and placement assistance",
        timings: "Monday-Friday: 9:00 AM - 5:00 PM"
      },
      main_entrance: {
        name: "Main Entrance",
        aliases: ["entrance", "gate", "main gate"],
        mapsQuery: "Chennai Institute of Technology Main Entrance, Chennai",
        description: "Primary entrance to CIT campus"
      }
    }
  },

  SJIT: {
    name: "St. Joseph's Institute of Technology",
    shortName: "SJIT",
    city: "Chennai",
    address: "Chennai, Tamil Nadu",
    places: {
      library: {
        name: "Central Library",
        aliases: ["central library", "lib", "library"],
        mapsQuery: "St. Joseph's Institute of Technology Library, Chennai",
        description: "Well-equipped library with books, journals, and digital resources",
        timings: "8:30 AM - 7:30 PM (Monday-Friday), 9:00 AM - 4:00 PM (Saturday)"
      },
      main_block: {
        name: "Main Block",
        aliases: ["main block", "academic block", "classes"],
        mapsQuery: "St. Joseph's Institute of Technology Main Block, Chennai",
        description: "Main academic building with classrooms and faculty offices"
      },
      admin_block: {
        name: "Administrative Block",
        aliases: ["admin", "administration", "office", "admin office"],
        mapsQuery: "St. Joseph's Institute of Technology Administrative Block, Chennai",
        description: "Admin offices and principal office",
        timings: "Monday-Friday: 9:00 AM - 5:00 PM"
      },
      canteen: {
        name: "SJIT Canteen",
        aliases: ["canteen", "food court", "cafeteria", "mess"],
        mapsQuery: "St. Joseph's Institute of Technology Canteen, Chennai",
        description: "Multi-cuisine canteen serving meals and snacks",
        timings: { breakfast: "8:00 AM - 9:00 AM", lunch: "12:00 PM - 2:00 PM", snacks: "4:30 PM - 5:30 PM", dinner: "7:30 PM - 9:00 PM" }
      },
      medical_centre: {
        name: "Medical Centre",
        aliases: ["medical", "hospital", "health centre", "doctor"],
        mapsQuery: "St. Joseph's Institute of Technology Medical Centre, Chennai",
        description: "Campus medical facility with basic healthcare",
        timings: "Monday-Friday: 9:00 AM - 5:00 PM",
        contact: "044-2250-1900"
      },
      placement_cell: {
        name: "Placement Cell",
        aliases: ["placement", "placements", "career", "training"],
        mapsQuery: "St. Joseph's Institute of Technology Placement Cell, Chennai",
        description: "Career services and placement assistance",
        timings: "Monday-Friday: 9:00 AM - 5:00 PM"
      }
    }
  },

  KPR: {
    name: "KPR Institute of Engineering and Technology",
    shortName: "KPR",
    city: "Coimbatore",
    address: "Arasur, Coimbatore, Tamil Nadu",
    places: {
      library: {
        name: "Central Library",
        aliases: ["central library", "lib", "library"],
        mapsQuery: "KPR Institute of Engineering and Technology Library, Coimbatore",
        description: "Extensive library with digital resources and research journals",
        timings: "8:00 AM - 8:00 PM (Monday-Friday), 9:00 AM - 5:00 PM (Saturday)"
      },
      academic_block: {
        name: "Academic Block",
        aliases: ["academic", "main block", "classes"],
        mapsQuery: "KPR Institute of Engineering and Technology Academic Block, Coimbatore",
        description: "Main academic building with modern classrooms and labs",
        floors: 5
      },
      admin_block: {
        name: "Administrative Block",
        aliases: ["admin", "administration", "office", "admin office"],
        mapsQuery: "KPR Institute of Engineering and Technology Administrative Block, Coimbatore",
        description: "Admin offices and principal office",
        timings: "Monday-Friday: 9:00 AM - 5:00 PM"
      },
      canteen: {
        name: "KPR Food Court",
        aliases: ["canteen", "food court", "cafeteria", "mess"],
        mapsQuery: "KPR Institute of Engineering and Technology Canteen, Coimbatore",
        description: "Multi-cuisine food court with Garden Cafe also available",
        timings: { breakfast: "7:30 AM - 9:00 AM", lunch: "12:00 PM - 2:30 PM", snacks: "4:00 PM - 5:30 PM", dinner: "7:00 PM - 9:30 PM" }
      },
      medical_centre: {
        name: "Medical Centre",
        aliases: ["medical", "hospital", "health centre", "doctor"],
        mapsQuery: "KPR Institute of Engineering and Technology Medical Centre, Coimbatore",
        description: "Campus medical facility with doctor and basic healthcare",
        timings: "Monday-Friday: 9:00 AM - 5:00 PM",
        contact: "0422-265-6900"
      },
      placement_cell: {
        name: "T&P Block",
        aliases: ["placement", "placements", "career", "training", "tnp"],
        mapsQuery: "KPR Institute of Engineering and Technology Placement Block, Coimbatore",
        description: "Training and Placement block with career services",
        timings: "Monday-Friday: 9:00 AM - 5:00 PM"
      },
      imperial_hall: {
        name: "Imperial Hall",
        aliases: ["auditorium", "hall", "seminar hall"],
        mapsQuery: "KPR Institute of Engineering and Technology Imperial Hall, Coimbatore",
        description: "Large auditorium with capacity of 1200 for events and seminars"
      },
      sports_ground: {
        name: "Sports Ground",
        aliases: ["sports", "ground", "playground", "cricket ground"],
        mapsQuery: "KPR Institute of Engineering and Technology Sports Ground, Coimbatore",
        description: "Comprehensive sports facilities for cricket, football, basketball, tennis, and badminton",
        facilities: ["Cricket", "Football", "Basketball", "Tennis", "Indoor Badminton"],
        timings: "6:00 AM - 7:00 PM daily"
      },
      main_entrance: {
        name: "Security Gate",
        aliases: ["entrance", "gate", "main gate", "security gate"],
        mapsQuery: "KPR Institute of Engineering and Technology Main Entrance, Coimbatore",
        description: "Main entrance with security office"
      }
    }
  }
};

// Helper function to find destination in campus data
function findDestination(campusCode, query) {
  const campus = campusNavigationData[campusCode];
  if (!campus) return null;

  const normalizedQuery = query.toLowerCase().trim();
  
  // Direct match
  if (campus.places[normalizedQuery]) {
    return {
      ...campus.places[normalizedQuery],
      key: normalizedQuery
    };
  }

  // Search through aliases
  for (const [key, place] of Object.entries(campus.places)) {
    if (place.aliases && place.aliases.some(alias => alias.toLowerCase().includes(normalizedQuery) || normalizedQuery.includes(alias.toLowerCase()))) {
      return {
        ...place,
        key: key
      };
    }
  }

  return null;
}

module.exports = {
  campusNavigationData,
  findDestination
};
