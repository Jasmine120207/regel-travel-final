// Fixed high-quality destination images from Unsplash
const mockTrips = [
  // BUDGET
  {
    _id: '1',
    name: 'Pondicherry',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=85&fit=crop',
    estimatedCost: 3500,
    description: 'A charming French colonial town on the southeastern coast of India, known for its colorful streets, serene beaches, and vibrant cafes.',
    budgetTier: 'budget',
    category: 'beach',
    state: 'Puducherry',
    numberOfDays: 2,
    latitude: 11.9416,
    longitude: 79.8083,
    placesToVisit: [
      { name: 'Promenade Beach', description: 'A 1.2 km stretch along the Bay of Bengal' },
      { name: 'Auroville', description: 'An experimental township dedicated to human unity' }
    ],
    itinerary: [
      { day: 1, title: 'Explore the French Quarter', activities: ['Walk along Promenade Beach', 'Breakfast at a French cafe'] },
      { day: 2, title: 'Auroville & Beach Day', activities: ['Visit Auroville', 'Boat ride to Paradise Beach'] }
    ],
    budgetBreakdown: { food: 1000, travel: 800, stay: 1200, activities: 300, miscellaneous: 200 }
  },
  {
    _id: '2',
    name: 'Gokarna',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb01cc978?w=1200&q=85&fit=crop',
    estimatedCost: 4000,
    description: 'A quiet alternative to Goa, Gokarna offers pristine beaches, dramatic cliffs, and a laid-back backpacker vibe along the Arabian Sea.',
    budgetTier: 'budget',
    category: 'beach',
    state: 'Karnataka',
    numberOfDays: 3,
    latitude: 14.5398,
    longitude: 74.3168,
    placesToVisit: [
      { name: 'Om Beach', description: 'Beach naturally shaped like the auspicious Om symbol' },
      { name: 'Kudle Beach', description: 'A long stretch of white sand perfect for sunset watching' }
    ],
    itinerary: [
      { day: 1, title: 'Beach Trekking', activities: ['Trek from Kudle to Om Beach', 'Sunset dinner at beach shack'] },
      { day: 2, title: 'Half Moon & Paradise', activities: ['Boat ride to Half Moon beach', 'Campfire on the beach'] },
      { day: 3, title: 'Temple Town', activities: ['Visit Mahabaleshwar Temple', 'Departure'] }
    ],
    budgetBreakdown: { food: 1200, travel: 1000, stay: 1500, activities: 300, miscellaneous: 0 }
  },
  {
    _id: '3',
    name: 'Rishikesh',
    image: 'https://images.unsplash.com/photo-1583309219338-a582f1f9ca6b?w=1200&q=85&fit=crop',
    estimatedCost: 4500,
    description: 'The "Yoga Capital of the World" nestled in the Himalayan foothills.',
    budgetTier: 'budget',
    category: 'adventure',
    state: 'Uttarakhand',
    numberOfDays: 3,
    latitude: 30.0869,
    longitude: 78.2676,
    placesToVisit: [
      { name: 'Laxman Jhula', description: 'Iconic suspension bridge' }
    ],
    itinerary: [
      { day: 1, title: 'Rishikesh Town', activities: ['Walk across Laxman Jhula', 'Ganga Aarti'] }
    ],
    budgetBreakdown: { food: 1200, travel: 1000, stay: 1500, activities: 500, miscellaneous: 300 }
  },
  {
    _id: '10',
    name: 'Hampi',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb01cc978?w=1200&q=85&fit=crop',
    estimatedCost: 3800,
    description: 'A UNESCO World Heritage site known for majestic ruins, boulders, and ancient temples from the Vijayanagara Empire.',
    budgetTier: 'budget',
    category: 'heritage',
    state: 'Karnataka',
    numberOfDays: 2,
    latitude: 15.3350,
    longitude: 76.4600,
    placesToVisit: [
      { name: 'Virupaksha Temple', description: '7th-century Hindu temple' },
      { name: 'Matanga Hill', description: 'Perfect spot for a stunning panoramic sunset' }
    ],
    itinerary: [
      { day: 1, title: 'Ancient Ruins', activities: ['Visit Virupaksha Temple', 'Sunset at Matanga Hill'] },
      { day: 2, title: 'Hippie Island', activities: ['Cross the river', 'Explore cafes and boulders'] }
    ],
    budgetBreakdown: { food: 900, travel: 1200, stay: 1200, activities: 300, miscellaneous: 200 }
  },
  {
    _id: '11',
    name: 'Varanasi',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&q=85&fit=crop',
    estimatedCost: 4800,
    description: 'India\'s spiritual capital. Experience the magic of the Ganges, ancient ghats, and vibrant evening rituals.',
    budgetTier: 'budget',
    category: 'heritage',
    state: 'Uttar Pradesh',
    numberOfDays: 3,
    latitude: 25.3176,
    longitude: 82.9739,
    placesToVisit: [
      { name: 'Dashashwamedh Ghat', description: 'Main ghat known for its spectacular evening Aarti' },
      { name: 'Kashi Vishwanath', description: 'One of the most famous Hindu temples' }
    ],
    itinerary: [
      { day: 1, title: 'The Ghats', activities: ['Evening Ganga Aarti', 'Walk along the ghats'] },
      { day: 2, title: 'Spiritual Morning', activities: ['Sunrise boat ride on the Ganges', 'Temple visits'] },
      { day: 3, title: 'Sarnath', activities: ['Visit nearby Buddhist ruins in Sarnath', 'Departure'] }
    ],
    budgetBreakdown: { food: 1400, travel: 1000, stay: 1800, activities: 400, miscellaneous: 200 }
  },

  // MID-TIER
  {
    _id: '4',
    name: 'Goa',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=85&fit=crop',
    estimatedCost: 8000,
    description: 'India\'s ultimate beach paradise, offering golden sands, water sports, and a laid-back tropical lifestyle under the sun.',
    budgetTier: 'mid',
    category: 'beach',
    state: 'Goa',
    numberOfDays: 4,
    latitude: 15.2993,
    longitude: 74.1240,
    placesToVisit: [
      { name: 'Baga & Calangute Beaches', description: 'Lively beaches famous for nightlife and surfing' },
      { name: 'Palolem Beach', description: 'A beautiful crescent-shaped beach in South Goa' }
    ],
    itinerary: [
      { day: 1, title: 'North Goa Beaches', activities: ['Relax at Calangute Beach', 'Sunset at Anjuna Beach'] },
      { day: 2, title: 'Water Sports', activities: ['Parasailing and jet skiing', 'Dinner at beach shack'] },
      { day: 3, title: 'South Goa Serenity', activities: ['Drive to Palolem', 'Dolphin watching'] },
      { day: 4, title: 'Heritage & Departure', activities: ['Visit Old Goa Churches', 'Departure'] }
    ],
    budgetBreakdown: { food: 2500, travel: 1500, stay: 2500, activities: 1000, miscellaneous: 500 }
  },
  {
    _id: '5',
    name: 'Udaipur',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e13?w=1200&q=85&fit=crop',
    estimatedCost: 10000,
    description: 'The "City of Lakes" — a romantic Rajasthani city with stunning palaces, shimmering lakes, and a regal heritage.',
    budgetTier: 'mid',
    category: 'heritage',
    state: 'Rajasthan',
    numberOfDays: 3,
    latitude: 24.5854,
    longitude: 73.7125,
    placesToVisit: [
      { name: 'City Palace', description: 'Massive complex overlooking Lake Pichola' }
    ],
    itinerary: [
      { day: 1, title: 'Palace & Lake', activities: ['Visit City Palace', 'Boat ride on Lake Pichola'] }
    ],
    budgetBreakdown: { food: 3000, travel: 2000, stay: 3000, activities: 1500, miscellaneous: 500 }
  },
  {
    _id: '6',
    name: 'Munnar',
    image: 'https://images.unsplash.com/photo-1611832474885-b56a522ee4b6?w=1200&q=85&fit=crop',
    estimatedCost: 9000,
    description: 'A breathtaking hill station wrapped in endless emerald green tea plantations and misty mountains.',
    budgetTier: 'mid',
    category: 'hill-station',
    state: 'Kerala',
    numberOfDays: 3,
    latitude: 10.0889,
    longitude: 77.0595,
    placesToVisit: [
      { name: 'Tea Gardens', description: 'Vast rolling carpets of tea plantations' }
    ],
    itinerary: [
      { day: 1, title: 'Tea Country', activities: ['Walk through plantations', 'Tea tasting'] }
    ],
    budgetBreakdown: { food: 2500, travel: 2000, stay: 2800, activities: 1200, miscellaneous: 500 }
  },
  {
    _id: '12',
    name: 'Jaipur',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=85&fit=crop',
    estimatedCost: 9500,
    description: 'The "Pink City" of India, filled with magnificent forts, bustling bazars, and opulent royal palaces.',
    budgetTier: 'mid',
    category: 'heritage',
    state: 'Rajasthan',
    numberOfDays: 3,
    latitude: 26.9124,
    longitude: 75.7873,
    placesToVisit: [
      { name: 'Amer Fort', description: 'A massive hilltop fort with beautiful architecture' },
      { name: 'Hawa Mahal', description: 'The famous Palace of Winds' }
    ],
    itinerary: [
      { day: 1, title: 'City Exploration', activities: ['Visit Hawa Mahal', 'Explore City Palace and Jantar Mantar'] },
      { day: 2, title: 'Forts & History', activities: ['Elephant ride at Amer Fort', 'Visit Nahargarh Fort at sunset'] },
      { day: 3, title: 'Shopping', activities: ['Shop for jewelry and textiles in Johari Bazaar', 'Departure'] }
    ],
    budgetBreakdown: { food: 2800, travel: 1800, stay: 3200, activities: 1200, miscellaneous: 500 }
  },
  {
    _id: '13',
    name: 'Alleppey (Alappuzha)',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&q=85&fit=crop',
    estimatedCost: 11000,
    description: 'Famous for its serene backwaters, Alleppey offers unforgettable houseboat cruises through emerald palm-fringed canals.',
    budgetTier: 'mid',
    category: 'nature',
    state: 'Kerala',
    numberOfDays: 2,
    latitude: 9.4981,
    longitude: 76.3388,
    placesToVisit: [
      { name: 'Kerala Backwaters', description: 'A vast network of interconnected canals and lakes' },
      { name: 'Alappuzha Beach', description: 'A beautiful beach with an old pier' }
    ],
    itinerary: [
      { day: 1, title: 'Houseboat Cruise', activities: ['Board traditional houseboat', 'Cruise the backwaters', 'On-board Kerala style dinner'] },
      { day: 2, title: 'Beach & Local Life', activities: ['Visit Alappuzha Beach', 'Explore local village markets'] }
    ],
    budgetBreakdown: { food: 2000, travel: 1500, stay: 6000, activities: 1000, miscellaneous: 500 }
  },

  // PREMIUM
  {
    _id: '7',
    name: 'Andaman Islands',
    image: 'https://images.unsplash.com/photo-1589979481223-deb893043163?w=1200&q=85&fit=crop',
    estimatedCost: 30000,
    description: 'A spectacular tropical island archipelago offering crystal-clear turquoise waters, vibrant coral reefs, and white-sand beaches.',
    budgetTier: 'premium',
    category: 'beach',
    state: 'Andaman & Nicobar',
    numberOfDays: 5,
    latitude: 11.7401,
    longitude: 92.6586,
    placesToVisit: [
      { name: 'Radhanagar Beach', description: 'Rated Asia\'s best beach — stunning white sand and turquoise water' },
      { name: 'Havelock Island', description: 'The premier destination for world-class scuba diving' }
    ],
    itinerary: [
      { day: 1, title: 'Arrive at Port Blair', activities: ['Visit Cellular Jail', 'Light and Sound Show'] },
      { day: 2, title: 'Havelock Island', activities: ['Ferry to Havelock', 'Relax at Radhanagar Beach'] },
      { day: 3, title: 'Underwater Discovery', activities: ['Scuba diving at Elephant Beach', 'Sunset views'] },
      { day: 4, title: 'Neil Island Serenity', activities: ['Glass-bottom boat ride', 'Explore natural coral bridge'] },
      { day: 5, title: 'Departure', activities: ['Return to Port Blair and fly out'] }
    ],
    budgetBreakdown: { food: 7000, travel: 8000, stay: 9000, activities: 4500, miscellaneous: 1500 }
  },
  {
    _id: '8',
    name: 'Kashmir',
    image: 'https://images.unsplash.com/photo-1597074866923-dc0589150bd6?w=1200&q=85&fit=crop',
    estimatedCost: 25000,
    description: 'Heaven on Earth — Kashmir stuns with its snow-draped valleys, pristine Dal Lake, and towering Himalayan peaks.',
    budgetTier: 'premium',
    category: 'hill-station',
    state: 'Jammu & Kashmir',
    numberOfDays: 6,
    latitude: 34.0837,
    longitude: 74.7973,
    placesToVisit: [
      { name: 'Dal Lake', description: 'Iconic lake with houseboats and shikaras' }
    ],
    itinerary: [
      { day: 1, title: 'Srinagar', activities: ['Shikara ride on Dal Lake', 'Houseboat stay'] }
    ],
    budgetBreakdown: { food: 6000, travel: 6000, stay: 8000, activities: 3500, miscellaneous: 1500 }
  },
  {
    _id: '9',
    name: 'Leh-Ladakh',
    image: 'https://images.unsplash.com/photo-1626015365107-af325066d40d?w=1200&q=85&fit=crop',
    estimatedCost: 28000,
    description: 'The "Land of High Passes" — an otherworldly mountain desert with turquoise lakes and ancient monasteries.',
    budgetTier: 'premium',
    category: 'adventure',
    state: 'Ladakh',
    numberOfDays: 6,
    latitude: 34.1526,
    longitude: 77.5771,
    placesToVisit: [
      { name: 'Pangong Lake', description: 'Mesmerizing high-altitude lake that changes colors' }
    ],
    itinerary: [
      { day: 1, title: 'Acclimatization', activities: ['Rest and acclimatize to altitude'] }
    ],
    budgetBreakdown: { food: 6000, travel: 8000, stay: 8000, activities: 4000, miscellaneous: 2000 }
  },
  {
    _id: '14',
    name: 'Manali & Rohtang',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=85&fit=crop',
    estimatedCost: 18000,
    description: 'A magical high-altitude resort town surrounded by towering snow-capped peaks and deep alpine valleys.',
    budgetTier: 'premium',
    category: 'hill-station',
    state: 'Himachal Pradesh',
    numberOfDays: 5,
    latitude: 32.2396,
    longitude: 77.1887,
    placesToVisit: [
      { name: 'Rohtang Pass', description: 'Stunning high mountain pass with snow all year round' },
      { name: 'Solang Valley', description: 'Hub for adventure sports like paragliding' }
    ],
    itinerary: [
      { day: 1, title: 'Arrival & Old Manali', activities: ['Explore cafes in Old Manali', 'Visit Hadimba Temple'] },
      { day: 2, title: 'Solang Valley Adventure', activities: ['Paragliding', 'Zorbing and Ropeway ride'] },
      { day: 3, title: 'Snow Point', activities: ['Day trip to Rohtang Pass or Atal Tunnel', 'Play in the snow'] },
      { day: 4, title: 'Hot Springs', activities: ['Visit Vashisht hot water springs', 'Evening mall road shopping'] },
      { day: 5, title: 'Departure', activities: ['Travel back'] }
    ],
    budgetBreakdown: { food: 4500, travel: 5000, stay: 6000, activities: 2000, miscellaneous: 500 }
  },
  {
    _id: '15',
    name: 'Agra',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=85&fit=crop',
    estimatedCost: 16000,
    description: 'Home to the iconic Taj Mahal, Agra offers an unforgettable journey into the grandeur of the Mughal Empire.',
    budgetTier: 'premium',
    category: 'heritage',
    state: 'Uttar Pradesh',
    numberOfDays: 2,
    latitude: 27.1767,
    longitude: 78.0081,
    placesToVisit: [
      { name: 'Taj Mahal', description: 'One of the New Seven Wonders of the World' },
      { name: 'Agra Fort', description: 'A massive 16th-century Mughal fortress' }
    ],
    itinerary: [
      { day: 1, title: 'The Taj', activities: ['Sunrise visit to the Taj Mahal', 'Explore Agra Fort'] },
      { day: 2, title: 'Fatehpur Sikri', activities: ['Day trip to the abandoned Mughal capital', 'Departure'] }
    ],
    budgetBreakdown: { food: 3000, travel: 4000, stay: 7000, activities: 1500, miscellaneous: 500 }
  }
];

module.exports = mockTrips;
