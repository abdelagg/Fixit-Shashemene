import {
  ServiceCategory,
  User,
  WorkerProfile,
  ServiceRequest,
  Review,
  NotificationItem,
  ReportItem
} from '../types';

export const SHASHEMENE_NEIGHBORHOODS: {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
}[] = [
  {
    name: 'Arada',
    description: 'Central commercial district & main trade hub',
    latitude: 7.2014,
    longitude: 38.5976
  },
  {
    name: 'Awasho',
    description: 'Vibrant artisan & residential neighborhood',
    latitude: 7.2085,
    longitude: 38.5920
  },
  {
    name: 'Bole',
    description: 'Modern residential quarter and tech hubs',
    latitude: 7.1950,
    longitude: 38.6040
  },
  {
    name: 'Dida',
    description: 'Rapidly growing residential and school district',
    latitude: 7.2140,
    longitude: 38.5860
  },
  {
    name: 'Melka Oda',
    description: 'Transport corridor, logistics, and workshops',
    latitude: 7.1900,
    longitude: 38.5900
  },
  {
    name: 'Furi',
    description: 'Craftsmen quarter, metalwork & masonry',
    latitude: 7.2050,
    longitude: 38.6100
  },
  {
    name: 'Abosto',
    description: 'Historic cultural quarter and community centers',
    latitude: 7.2200,
    longitude: 38.6020
  },
  {
    name: 'Kuyera Road',
    description: 'Automotive workshops & machinery corridor',
    latitude: 7.1820,
    longitude: 38.5810
  }
];

export const INITIAL_SERVICES: ServiceCategory[] = [
  // Home Services
  {
    id: 'plumbing',
    name: 'Plumbing',
    group: 'Home Services',
    description: 'Water pipes, leak repairs, bathroom fixtures, water tanks, and drainage solutions.',
    icon: 'Wrench',
    popular: true,
    active: true,
    subServices: ['Pipe leak repair', 'Water pump repair', 'Water tank installation', 'Toilet & sink fix', 'Drainage clearing']
  },
  {
    id: 'electrical',
    name: 'Electrical',
    group: 'Home Services',
    description: 'Residential wiring, breaker fixing, solar installation, light fixtures, and power safety.',
    icon: 'Zap',
    popular: true,
    active: true,
    subServices: ['House wiring', 'Circuit breaker trip fix', 'Solar panel setup', 'Generator wiring', 'Socket & switch replacement']
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    group: 'Home Services',
    description: 'Custom furniture, door & window repairs, cabinets, roofs, and wooden structures.',
    icon: 'Hammer',
    popular: true,
    active: true,
    subServices: ['Door & lock repair', 'Custom wardrobes', 'Roof framing', 'Dining chairs & tables', 'Kitchen cabinets']
  },
  {
    id: 'painting',
    name: 'Painting',
    group: 'Home Services',
    description: 'Interior and exterior wall painting, waterproof coatings, and decorative finishes.',
    icon: 'Paintbrush',
    popular: false,
    active: true,
    subServices: ['Interior room painting', 'Exterior weatherproofing', 'Gate and fence painting', 'Ceiling restoration']
  },
  {
    id: 'masonry',
    name: 'Masonry & Tiling',
    group: 'Home Services',
    description: 'Brickwork, cement plastering, floor ceramic tiling, and compound wall construction.',
    icon: 'Layers',
    popular: false,
    active: true,
    subServices: ['Ceramic tile laying', 'Wall plastering', 'Compound brickwork', 'Concrete floor leveling']
  },
  {
    id: 'cleaning',
    name: 'Cleaning Services',
    group: 'Home Services',
    description: 'Deep house cleaning, post-construction cleanup, sofa & carpet shampooing, and water tank hygiene.',
    icon: 'Sparkles',
    popular: true,
    active: true,
    subServices: ['Deep house cleaning', 'Carpet & sofa washing', 'Water tank sanitization', 'Move-in / Move-out cleaning']
  },

  // Vehicle Services
  {
    id: 'mechanic',
    name: 'Car Mechanic',
    group: 'Vehicle Services',
    description: 'Engine diagnostics, brake replacements, suspension fixes, Toyota & multi-brand maintenance.',
    icon: 'Car',
    popular: true,
    active: true,
    subServices: ['Engine troubleshooting', 'Brake pad replacement', 'Suspension & shocks', 'Oil & filter servicing', 'Clutch repair']
  },
  {
    id: 'motorcycle',
    name: 'Motorcycle & Bajaj Mechanic',
    group: 'Vehicle Services',
    description: 'Bajaj three-wheeler engine repair, motorbike tuning, tire repair, and electrical checks.',
    icon: 'Bike',
    popular: true,
    active: true,
    subServices: ['Bajaj engine overhaul', 'Carburetor tuning', 'Motorcycle chain & sprocket', 'Brake adjustment']
  },
  {
    id: 'auto_electrical',
    name: 'Auto Electrical & Battery',
    group: 'Vehicle Services',
    description: 'Car alternator, starter motor, dead battery jumpstart/replacement, and vehicle lighting.',
    icon: 'BatteryCharging',
    popular: false,
    active: true,
    subServices: ['Starter motor repair', 'Alternator charging fix', 'Battery replacement', 'Headlight & wiring fix']
  },

  // Technology
  {
    id: 'phone_repair',
    name: 'Phone & Tablet Repair',
    group: 'Technology',
    description: 'Screen replacement, battery swap, charging port repair, water damage recovery, and software flashing.',
    icon: 'Smartphone',
    popular: true,
    active: true,
    subServices: ['Broken screen replacement', 'Charging port repair', 'Battery replacement', 'Speaker/Mic repair', 'Software OS flashing']
  },
  {
    id: 'computer_repair',
    name: 'Computer & Laptop Repair',
    group: 'Technology',
    description: 'Laptop hardware troubleshooting, OS reinstallation, keyboard replacement, SSD upgrade, and malware removal.',
    icon: 'Laptop',
    popular: true,
    active: true,
    subServices: ['Windows/Mac OS install', 'SSD & RAM upgrade', 'Laptop screen & keyboard fix', 'Overheating fan cleanup', 'Motherboard diagnostics']
  },
  {
    id: 'network_technician',
    name: 'Internet & WiFi Setup',
    group: 'Technology',
    description: 'Ethio Telecom router configuration, WiFi range extension, LAN cabling, and satellite TV dish alignment.',
    icon: 'Wifi',
    popular: false,
    active: true,
    subServices: ['WiFi router configuration', 'Ethernet LAN cable crimping', 'Dish TV & receiver alignment', 'CCTV camera installation']
  },

  // Other
  {
    id: 'appliance_repair',
    name: 'Appliance Repair',
    group: 'Other',
    description: 'Refrigerator cooling fix, washing machine repair, microwave, electric stove, and water heater repair.',
    icon: 'Refrigerator',
    popular: true,
    active: true,
    subServices: ['Refrigerator gas recharge', 'Washing machine drainage fix', 'Electric oven & stove coil repair', 'Water heater (Geyser) repair']
  },
  {
    id: 'welding',
    name: 'Welding & Metalwork',
    group: 'Other',
    description: 'Metal doors, iron gates, window security grills, water tank stands, and structural metal fabrication.',
    icon: 'Shield',
    popular: false,
    active: true,
    subServices: ['Iron gate welding', 'Window grill fabrication', 'Metal water tank stand', 'Roof truss welding']
  },
  {
    id: 'general_maintenance',
    name: 'General Handyman',
    group: 'Other',
    description: 'Multi-skilled handyman for quick fixes, mounting TVs, hanging curtains, and minor household touch-ups.',
    icon: 'Tool',
    popular: false,
    active: true,
    subServices: ['TV wall mounting', 'Curtain rod installation', 'Door handle replacements', 'Minor paint & plaster fix']
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user_cust_1',
    name: 'Abebe Kebede',
    email: 'customer@test.com',
    phone: '+251 91 678 1234',
    role: 'customer',
    neighborhood: 'Arada',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'user_cust_2',
    name: 'Hiwot Tadesse',
    email: 'hiwot@gmail.com',
    phone: '+251 92 345 6789',
    role: 'customer',
    neighborhood: 'Bole',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-01T12:00:00Z'
  },
  {
    id: 'user_work_1',
    name: 'Ahmed Hassan',
    email: 'worker@test.com',
    phone: '+251 91 123 4567',
    role: 'worker',
    neighborhood: 'Arada',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-11-10T08:30:00Z'
  },
  {
    id: 'user_work_2',
    name: 'Bekele Tadesse',
    email: 'bekele@test.com',
    phone: '+251 91 234 5678',
    role: 'worker',
    neighborhood: 'Awasho',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-10-05T09:15:00Z'
  },
  {
    id: 'user_work_3',
    name: 'Dawit Alemayehu',
    email: 'dawit@test.com',
    phone: '+251 91 345 6789',
    role: 'worker',
    neighborhood: 'Kuyera Road',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-09-12T14:00:00Z'
  },
  {
    id: 'user_work_4',
    name: 'Yonas Worku',
    email: 'yonas@test.com',
    phone: '+251 92 111 2233',
    role: 'worker',
    neighborhood: 'Arada',
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-12-01T11:00:00Z'
  },
  {
    id: 'user_work_5',
    name: 'Elias Kebede',
    email: 'elias@test.com',
    phone: '+251 93 456 7890',
    role: 'worker',
    neighborhood: 'Bole',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-08-20T16:00:00Z'
  },
  {
    id: 'user_work_6',
    name: 'Tariku Desta',
    email: 'tariku@test.com',
    phone: '+251 91 555 6677',
    role: 'worker',
    neighborhood: 'Dida',
    profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-10-18T10:00:00Z'
  },
  {
    id: 'user_work_7',
    name: 'Solomon Girma',
    email: 'solomon@test.com',
    phone: '+251 94 678 9012',
    role: 'worker',
    neighborhood: 'Bole',
    profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-11-25T13:00:00Z'
  },
  {
    id: 'user_work_8',
    name: 'Henok Bekele',
    email: 'henok@test.com',
    phone: '+251 91 888 9900',
    role: 'worker',
    neighborhood: 'Dida',
    profileImage: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-15T09:00:00Z'
  },
  {
    id: 'user_admin_1',
    name: 'Aster Mengistu (FixIt Admin)',
    email: 'admin@test.com',
    phone: '+251 91 000 1122',
    role: 'admin',
    neighborhood: 'Arada',
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-01-01T00:00:00Z'
  }
];

export const INITIAL_WORKER_PROFILES: WorkerProfile[] = [
  {
    id: 'wp_1',
    userId: 'user_work_1',
    name: 'Ahmed Hassan',
    email: 'worker@test.com',
    phone: '+251 91 123 4567',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    serviceCategory: 'Plumbing',
    services: ['Pipe leak repair', 'Water pump repair', 'Water tank installation', 'Toilet & sink fix', 'Drainage clearing'],
    description: 'Certified master plumber in Shashemene with 7+ years solving high-pressure leaks, water tank piping, and bathroom fixtures across Arada, Awasho, and Bole.',
    experienceYears: 7,
    neighborhood: 'Arada',
    location: { latitude: 7.2014, longitude: 38.5976 },
    availability: {
      isAvailable: true,
      startTime: '08:00 AM',
      endTime: '06:30 PM',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    verificationStatus: 'approved',
    ratingAverage: 4.88,
    reviewCount: 43,
    completedJobs: 98,
    hourlyRateBirr: 350,
    skills: ['Copper & PVC Welding', 'Submersible Pump Wiring', 'Leak Acoustic Detection', 'Emergency Flooding Response'],
    createdAt: '2025-11-10T08:30:00Z'
  },
  {
    id: 'wp_2',
    userId: 'user_work_2',
    name: 'Bekele Tadesse',
    email: 'bekele@test.com',
    phone: '+251 91 234 5678',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    serviceCategory: 'Electrical',
    services: ['House wiring', 'Circuit breaker trip fix', 'Solar panel setup', 'Generator wiring', 'Socket & switch replacement'],
    description: 'Senior electrical technician specialized in safe residential circuitry, solar inverter backup systems, and commercial building load balancing in Awasho & Shashemene.',
    experienceYears: 10,
    neighborhood: 'Awasho',
    location: { latitude: 7.2085, longitude: 38.5920 },
    availability: {
      isAvailable: true,
      startTime: '07:30 AM',
      endTime: '07:00 PM',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    verificationStatus: 'approved',
    ratingAverage: 4.82,
    reviewCount: 36,
    completedJobs: 84,
    hourlyRateBirr: 400,
    skills: ['3-Phase Wiring', 'Solar Battery Inverters', 'Circuit Breaker Troubleshooting', 'Surge Protection'],
    createdAt: '2025-10-05T09:15:00Z'
  },
  {
    id: 'wp_3',
    userId: 'user_work_3',
    name: 'Dawit Alemayehu',
    email: 'dawit@test.com',
    phone: '+251 91 345 6789',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    serviceCategory: 'Car Mechanic',
    services: ['Engine troubleshooting', 'Brake pad replacement', 'Suspension & shocks', 'Oil & filter servicing', 'Clutch repair'],
    description: 'Expert automotive mechanic specializing in Toyota, Isuzu, and Hyundai vehicles. On-site breakdown assistance and garage diagnostics near Kuyera Road.',
    experienceYears: 8,
    neighborhood: 'Kuyera Road',
    location: { latitude: 7.1820, longitude: 38.5810 },
    availability: {
      isAvailable: true,
      startTime: '08:00 AM',
      endTime: '06:00 PM',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    verificationStatus: 'approved',
    ratingAverage: 4.92,
    reviewCount: 52,
    completedJobs: 115,
    hourlyRateBirr: 500,
    skills: ['OBD2 Computer Diagnostics', 'Brake Caliper Servicing', 'Manual & Auto Transmission', 'Suspension Bushings'],
    createdAt: '2025-09-12T14:00:00Z'
  },
  {
    id: 'wp_4',
    userId: 'user_work_4',
    name: 'Yonas Worku',
    email: 'yonas@test.com',
    phone: '+251 92 111 2233',
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    serviceCategory: 'Phone & Tablet Repair',
    services: ['Broken screen replacement', 'Charging port repair', 'Battery replacement', 'Speaker/Mic repair', 'Software OS flashing'],
    description: 'Fast and reliable mobile technician in central Arada market. Genuine AMOLED screens, micro-soldering, and fast battery replacements for iPhone, Samsung, Tecno & Infinix.',
    experienceYears: 5,
    neighborhood: 'Arada',
    location: { latitude: 7.2014, longitude: 38.5976 },
    availability: {
      isAvailable: true,
      startTime: '09:00 AM',
      endTime: '08:00 PM',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    verificationStatus: 'approved',
    ratingAverage: 4.85,
    reviewCount: 63,
    completedJobs: 142,
    hourlyRateBirr: 300,
    skills: ['Micro-soldering', 'OLED Screen Bonding', 'Short Circuit Detection', 'FRP & Firmware Flashing'],
    createdAt: '2025-12-01T11:00:00Z'
  },
  {
    id: 'wp_5',
    userId: 'user_work_5',
    name: 'Elias Kebede',
    email: 'elias@test.com',
    phone: '+251 93 456 7890',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    serviceCategory: 'Computer & Laptop Repair',
    services: ['Windows/Mac OS install', 'SSD & RAM upgrade', 'Laptop screen & keyboard fix', 'Overheating fan cleanup', 'Motherboard diagnostics'],
    description: 'Certified IT technician providing home and office computer repair in Bole and throughout Shashemene. Quick data recovery, SSD speed boosts, and board repairs.',
    experienceYears: 6,
    neighborhood: 'Bole',
    location: { latitude: 7.1950, longitude: 38.6040 },
    availability: {
      isAvailable: true,
      startTime: '08:30 AM',
      endTime: '07:00 PM',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    verificationStatus: 'approved',
    ratingAverage: 4.90,
    reviewCount: 38,
    completedJobs: 79,
    hourlyRateBirr: 350,
    skills: ['Hardware Micro-Soldering', 'Data Recovery', 'Thermal Paste Replacement', 'Ethio Telecom LAN setup'],
    createdAt: '2025-08-20T16:00:00Z'
  },
  {
    id: 'wp_6',
    userId: 'user_work_6',
    name: 'Tariku Desta',
    email: 'tariku@test.com',
    phone: '+251 91 555 6677',
    profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    serviceCategory: 'Appliance Repair',
    services: ['Refrigerator gas recharge', 'Washing machine drainage fix', 'Electric oven & stove coil repair', 'Water heater (Geyser) repair'],
    description: 'Expert major home appliances repairman. Refrigerator compressors, washing machine drainage pumps, and electric stoves repaired directly at your home in Dida & surrounding areas.',
    experienceYears: 9,
    neighborhood: 'Dida',
    location: { latitude: 7.2140, longitude: 38.5860 },
    availability: {
      isAvailable: false, // Currently busy on job
      startTime: '08:00 AM',
      endTime: '05:30 PM',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    verificationStatus: 'approved',
    ratingAverage: 4.79,
    reviewCount: 31,
    completedJobs: 65,
    hourlyRateBirr: 400,
    skills: ['R134a/R600a Gas Charging', 'Washing Machine Drive Belts', 'Thermostat Calibration', 'Leak Sealing'],
    createdAt: '2025-10-18T10:00:00Z'
  },
  {
    id: 'wp_7',
    userId: 'user_work_7',
    name: 'Solomon Girma',
    email: 'solomon@test.com',
    phone: '+251 94 678 9012',
    profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    serviceCategory: 'Carpentry',
    services: ['Door & lock repair', 'Custom wardrobes', 'Roof framing', 'Dining chairs & tables', 'Kitchen cabinets'],
    description: 'Master woodworker in Bole with 6 years experience crafting hardwood furniture, fixing sticky doors, modern kitchen cupboards, and sturdy roof trusses.',
    experienceYears: 6,
    neighborhood: 'Bole',
    location: { latitude: 7.1950, longitude: 38.6040 },
    availability: {
      isAvailable: true,
      startTime: '08:00 AM',
      endTime: '06:00 PM',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    verificationStatus: 'approved',
    ratingAverage: 4.75,
    reviewCount: 29,
    completedJobs: 54,
    hourlyRateBirr: 350,
    skills: ['Hardwood Joinery', 'Cylinder Lock Repair', 'Waterproof Wood Varnishing', 'Custom Kitchen Fitting'],
    createdAt: '2025-11-25T13:00:00Z'
  },
  {
    id: 'wp_8',
    userId: 'user_work_8',
    name: 'Henok Bekele',
    email: 'henok@test.com',
    phone: '+251 91 888 9900',
    profileImage: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    serviceCategory: 'Welding & Metalwork',
    services: ['Iron gate welding', 'Window grill fabrication', 'Metal water tank stand', 'Roof truss welding'],
    description: 'Skilled welder based in Dida offering iron compound gates, window security grills, water tank towers, and onsite arc welding repairs.',
    experienceYears: 4,
    neighborhood: 'Dida',
    location: { latitude: 7.2140, longitude: 38.5860 },
    availability: {
      isAvailable: true,
      startTime: '08:00 AM',
      endTime: '05:00 PM',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    verificationStatus: 'pending', // Pending admin approval to demonstrate admin workflow!
    ratingAverage: 0,
    reviewCount: 0,
    completedJobs: 0,
    hourlyRateBirr: 320,
    skills: ['Electric Arc Welding', 'Steel Profile Cutting', 'Heavy Tank Stand Fabrication'],
    createdAt: '2026-02-15T09:00:00Z'
  }
];

export const INITIAL_REQUESTS: ServiceRequest[] = [
  {
    id: 'req_101',
    customerId: 'user_cust_1',
    customerName: 'Abebe Kebede',
    customerPhone: '+251 91 678 1234',
    customerImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    workerId: 'wp_1',
    workerName: 'Ahmed Hassan',
    workerPhone: '+251 91 123 4567',
    workerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    serviceCategory: 'Plumbing',
    title: 'Water pipe leaking under kitchen sink',
    description: 'Water is dripping continuously from the cold water valve under our kitchen sink, flooding the cabinet floor. Need urgent pipe sealing.',
    images: ['https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80'],
    location: {
      neighborhood: 'Arada',
      addressDetails: 'Behind Commercial Bank of Ethiopia Arada Branch, House #342',
      latitude: 7.2014,
      longitude: 38.5976
    },
    urgency: 'high',
    preferredTime: 'As soon as possible',
    status: 'in_progress',
    aiAnalysis: {
      category: 'Plumbing',
      problem: 'Under-sink compression valve washer failure or loose fitting leak',
      suggestedWorkerType: 'Plumber',
      urgency: 'high',
      confidence: 0.96,
      possibleCauses: ['Worn rubber seal', 'Loose coupling nut', 'Hairline crack in PVC elbow'],
      recommendedPreparation: ['Turn off main stopcock under the sink', 'Place a bucket underneath to catch runoff']
    },
    priceEstimateBirr: 450,
    createdAt: '2026-02-28T08:30:00Z',
    updatedAt: '2026-02-28T09:15:00Z'
  },
  {
    id: 'req_102',
    customerId: 'user_cust_1',
    customerName: 'Abebe Kebede',
    customerPhone: '+251 91 678 1234',
    customerImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    workerId: 'wp_4',
    workerName: 'Yonas Worku',
    workerPhone: '+251 92 111 2233',
    workerImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    serviceCategory: 'Phone & Tablet Repair',
    title: 'Samsung Galaxy A53 screen replacement',
    description: 'Dropped on pavement in Bole, glass is shattered and black ink blotches appearing on display. Touch is still partially working.',
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80'],
    location: {
      neighborhood: 'Arada',
      addressDetails: 'Arada Market square, near Post Office',
      latitude: 7.2014,
      longitude: 38.5976
    },
    urgency: 'medium',
    preferredTime: 'Today afternoon',
    status: 'accepted',
    aiAnalysis: {
      category: 'Phone & Tablet Repair',
      problem: 'Cracked outer digitizer and broken AMOLED display panel',
      suggestedWorkerType: 'Phone Technician',
      urgency: 'medium',
      confidence: 0.94,
      possibleCauses: ['Direct impact damage', 'Internal LCD bleed'],
      recommendedPreparation: ['Backup personal data if touch allows', 'Do not press hard on shattered glass']
    },
    priceEstimateBirr: 1800,
    createdAt: '2026-02-28T10:00:00Z',
    updatedAt: '2026-02-28T10:20:00Z'
  },
  {
    id: 'req_103',
    customerId: 'user_cust_2',
    customerName: 'Hiwot Tadesse',
    customerPhone: '+251 92 345 6789',
    customerImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    workerId: 'wp_2',
    workerName: 'Bekele Tadesse',
    workerPhone: '+251 91 234 5678',
    workerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    serviceCategory: 'Electrical',
    title: 'Main breaker keeps tripping when water heater turns on',
    description: 'Whenever we switch on the bathroom geyser, the entire living room and kitchen power cuts out. Might be a short circuit or overloaded breaker.',
    images: [],
    location: {
      neighborhood: 'Bole',
      addressDetails: 'Near Bole Secondary School, Villa #12',
      latitude: 7.1950,
      longitude: 38.6040
    },
    urgency: 'high',
    preferredTime: 'Tomorrow morning',
    status: 'completed',
    aiAnalysis: {
      category: 'Electrical',
      problem: 'Circuit breaker overload or heating element earth leakage',
      suggestedWorkerType: 'Electrician',
      urgency: 'high',
      confidence: 0.92
    },
    priceEstimateBirr: 600,
    createdAt: '2026-02-24T14:00:00Z',
    updatedAt: '2026-02-25T16:00:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    customerId: 'user_cust_1',
    customerName: 'Abebe Kebede',
    customerImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    workerId: 'wp_1',
    requestId: 'req_prev_1',
    serviceCategory: 'Plumbing',
    rating: 5,
    comment: 'Ahmed arrived within 25 minutes in Arada and replaced our cracked pipe effortlessly. Very clean work and honest pricing in Birr. Highly recommended!',
    createdAt: '2026-02-20T16:30:00Z'
  },
  {
    id: 'rev_2',
    customerId: 'user_cust_2',
    customerName: 'Hiwot Tadesse',
    customerImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    workerId: 'wp_2',
    requestId: 'req_103',
    serviceCategory: 'Electrical',
    rating: 5,
    comment: 'Bekele identified our geyser earth leakage immediately and upgraded our safety breaker. Very professional technician in Shashemene.',
    createdAt: '2026-02-25T16:30:00Z'
  },
  {
    id: 'rev_3',
    customerId: 'user_cust_1',
    customerName: 'Abebe Kebede',
    customerImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    workerId: 'wp_3',
    requestId: 'req_prev_2',
    serviceCategory: 'Car Mechanic',
    rating: 5,
    comment: 'My Toyota Corolla stalled near Kuyera road. Dawit diagnosed the fuel pump fault and got me back on the road in less than 2 hours.',
    createdAt: '2026-02-18T18:00:00Z'
  },
  {
    id: 'rev_4',
    customerId: 'user_cust_2',
    customerName: 'Hiwot Tadesse',
    customerImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    workerId: 'wp_5',
    requestId: 'req_prev_3',
    serviceCategory: 'Computer & Laptop Repair',
    rating: 5,
    comment: 'Elias installed a new NVMe SSD and cloned my Windows installation without losing any files. Laptop is super fast now.',
    createdAt: '2026-02-14T11:20:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'user_cust_1',
    title: 'Worker Accepted Request',
    message: 'Yonas Worku accepted your request for "Samsung Galaxy A53 screen replacement".',
    type: 'status',
    isRead: false,
    requestId: 'req_102',
    createdAt: '2026-02-28T10:20:00Z'
  },
  {
    id: 'notif_2',
    userId: 'user_work_1',
    title: 'Active Job in Progress',
    message: 'You are currently working on "Water pipe leaking under kitchen sink" in Arada.',
    type: 'status',
    isRead: true,
    requestId: 'req_101',
    createdAt: '2026-02-28T09:15:00Z'
  }
];

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep_1',
    reporterId: 'user_cust_2',
    reporterName: 'Hiwot Tadesse',
    reportedUserId: 'user_work_8',
    reportedUserName: 'Henok Bekele',
    reason: 'Unverified profile check',
    description: 'Please verify the business location and past workshop certifications before activating public listing.',
    status: 'pending',
    createdAt: '2026-02-26T14:15:00Z'
  }
];
