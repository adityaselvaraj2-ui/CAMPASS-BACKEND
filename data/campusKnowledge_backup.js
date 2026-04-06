// Comprehensive Campus Knowledge Base
const campusKnowledge = {
  SJCE: {
    fullName: "St. Joseph's College of Engineering",
    location: "Chennai, Tamil Nadu, India",
    established: "1994",
    affiliation: "Anna University",
    accreditation: "NBA Accredited, NAAC 'A+' Grade",
    
    // Academic Information
    academics: {
      departments: [
        "Computer Science and Engineering (CSE)",
        "Information Technology (IT)",
        "Electronics and Communication Engineering (ECE)",
        "Electrical and Electronics Engineering (EEE)",
        "Mechanical Engineering (MECH)",
        "Civil Engineering (CIVIL)",
        "Artificial Intelligence and Data Science (AI&DS)",
        "Biomedical Engineering (BME)"
      ],
      programs: ["B.E.", "B.Tech", "M.E.", "M.Tech", "Ph.D"],
      library: {
        name: "Central Library",
        location: "Main Academic Building, Ground Floor",
        timings: "Monday-Saturday: 8:00 AM - 8:00 PM",
        resources: "50,000+ books, digital resources, journals",
        contact: "044-2235-1234"
      }
    },
    
    // Campus Infrastructure
    infrastructure: {
      buildings: {
        mainBlock: {
          name: "Main Academic Block",
          floors: 4,
          departments: ["CSE", "IT", "ECE"],
          facilities: ["Classrooms", "Labs", "Faculty Rooms", "Seminar Halls"]
        },
        blockA: {
          name: "Block A",
          floors: 3,
          departments: ["MECH", "EEE"],
          facilities: ["Workshops", "Labs", "Classrooms"]
        },
        blockB: {
          name: "Block B",
          floors: 3,
          departments: ["CIVIL", "BME"],
          facilities: ["Labs", "Drawing Halls", "Classrooms"]
        },
        adminBlock: {
          name: "Administrative Block",
          floors: 2,
          facilities: ["Principal Office", "Admission Office", "Accounts", "Examination Cell"]
        }
      },
      
      facilities: {
        canteen: {
          location: "Near Main Entrance",
          timings: "9:00 AM - 6:00 PM (Mon-Fri), 9:00 AM - 4:00 PM (Sat)",
          menu: "South Indian, North Indian, Chinese, Snacks, Beverages",
          special: "Daily lunch special at 12:30 PM"
        },
        mess: {
          location: "Hostel Block Ground Floor",
          timings: {
            breakfast: "7:00 AM - 9:00 AM",
            lunch: "12:00 PM - 2:00 PM",
            dinner: "7:00 PM - 9:00 PM"
          },
          menu: "Nutritious vegetarian and non-vegetarian options"
        },
        hostel: {
          boysHostel: {
            name: "St. Joseph's Boys Hostel",
            capacity: 300,
            curfew: "9:30 PM (1st year), 10:30 PM (seniors)",
            facilities: ["WiFi", "Gym", "Study Hall", "Recreation Room"]
          },
          girlsHostel: {
            name: "St. Joseph's Girls Hostel",
            capacity: 250,
            curfew: "9:00 PM (all years)",
            facilities: ["WiFi", "Gym", "Study Hall", "Recreation Room"]
          }
        },
        transport: {
          buses: [
            "Route 1: Tambaram → College (7:30 AM, 8:00 AM, 8:30 AM)",
            "Route 2: Chennai Central → College (7:15 AM, 7:45 AM)",
            "Route 3: T. Nagar → College (7:20 AM, 7:50 AM)",
            "Return: College → All Routes (4:30 PM, 5:30 PM, 6:30 PM)"
          ],
          localAccess: "Near OMR Road, Bus stop: 'SJCE College'"
        },
        wifi: {
          network: "SJCE-WiFi",
          coverage: "Entire campus including classrooms, library, hostel",
          credentials: "Student ID and password (provided at admission)"
        },
        sports: {
          indoor: ["Basketball Court", "Badminton Court", "Table Tennis", "Chess Room"],
          outdoor: ["Football Ground", "Cricket Ground", "Volleyball Court", "Athletics Track"],
          gym: "Modern gym with cardio and weight training equipment"
        }
      },
      
      // Specific Locations Inside Campus
      locations: {
        mainEntrance: {
          description: "Main gate with security checkpoint",
          landmarks: ["College name board", "Security cabin", "Visitor parking"]
        },
        parking: {
          twoWheeler: "Near Main Entrance (left side)",
          fourWheeler: "Near Admin Block",
          staffParking: "Behind Main Block"
        },
        garden: {
          location: "Between Main Block and Canteen",
          features: ["Sitting area", "Walking path", "Flowering plants"]
        },
        auditorium: {
          name: "St. Joseph's Auditorium",
          capacity: 500,
          location: "Near Sports Complex",
          events: ["College functions", "Seminars", "Cultural events"]
        },
        medicalCenter: {
          name: "Campus Health Center",
          location: "Ground Floor, Admin Block",
          timings: "9:00 AM - 5:00 PM",
          emergency: "24/7 on-call doctor"
        }
      }
    },
    
    // Student Services
    services: {
      placement: {
        cell: "Training and Placement Cell",
        location: "2nd Floor, Admin Block",
        companies: ["TCS", "Infosys", "Wipro", "HCL", "Cognizant", "Amazon"],
        averagePackage: "4.5 LPA",
        highestPackage: "12 LPA"
      },
      counseling: {
        location: "1st Floor, Admin Block",
        services: ["Academic counseling", "Career guidance", "Personal counseling"]
      },
      labs: {
        computerLabs: "4 labs with 60 systems each",
        electronicsLabs: "3 labs with modern equipment",
        mechanicalLabs: "Workshop with CNC machines",
        civilLabs: "Surveying and material testing labs"
      }
    },
    
    // Important Contacts
    contacts: {
      office: "044-2235-1234",
      principal: "044-2235-1235",
      admission: "044-2235-1236",
      placement: "044-2235-1237",
      hostel: "044-2235-1238",
      emergency: "98765-43210"
    }
  },
  
  SJIT: {
    fullName: "Sri Jayaram Institute of Technology",
    location: "Chennai, Tamil Nadu, India",
    established: "2009",
    affiliation: "Anna University",
    
    academics: {
      departments: [
        "Computer Science and Engineering (CSE)",
        "Information Technology (IT)",
        "Electronics and Communication Engineering (ECE)",
        "Electrical and Electronics Engineering (EEE)",
        "Mechanical Engineering (MECH)",
        "Civil Engineering (CIVIL)"
      ],
      library: {
        name: "Central Library",
        location: "Academic Block, 2nd Floor",
        timings: "9:00 AM - 7:00 PM (Mon-Sat)",
        resources: "30,000+ books, digital library"
      }
    },
    
    infrastructure: {
      buildings: {
        mainBlock: {
          name: "Academic Block",
          floors: 3,
          departments: ["CSE", "IT", "ECE"]
        },
        workshopBlock: {
          name: "Workshop Block",
          departments: ["MECH", "EEE", "CIVIL"]
        }
      },
      
      facilities: {
        canteen: {
          location: "Near Main Gate",
          timings: "8:30 AM - 5:30 PM"
        },
        hostel: {
          capacity: 200,
          curfew: "9:00 PM"
        },
        transport: {
          buses: [
            "Route 1: Guindy → College (7:45 AM, 8:15 AM)",
            "Route 2: Koyambedu → College (7:30 AM, 8:00 AM)"
          ]
        }
      }
    }
  },
  
  CIT: {
    fullName: "Chennai Institute of Technology",
    location: "Chennai, Tamil Nadu, India",
    established: "2010",
    affiliation: "Anna University",
    
    academics: {
      departments: [
        "Computer Science and Engineering (CSE)",
        "Artificial Intelligence and Machine Learning (AIML)",
        "Information Technology (IT)",
        "Electronics and Communication Engineering (ECE)",
        "Mechanical Engineering (MECH)"
      ],
      library: {
        name: "Digital Library",
        location: "Main Building, 1st Floor",
        timings: "8:00 AM - 8:00 PM"
      }
    },
    
    infrastructure: {
      buildings: {
        mainBlock: {
          name: "Main Academic Building",
          floors: 4,
          departments: ["CSE", "AIML", "IT"]
        }
      },
      
      facilities: {
        canteen: {
          location: "Campus Center",
          timings: "9:00 AM - 6:00 PM"
        },
        hostel: {
          capacity: 150,
          curfew: "9:30 PM"
        }
      }
    }
  }
};

module.exports = campusKnowledge;
