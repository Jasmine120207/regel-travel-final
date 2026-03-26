// ============================================
// Seed Script — Populate MongoDB with Indian
// travel destinations across 3 budget tiers
// ============================================
const mongoose = require('mongoose');
require('dotenv').config();
const Trip = require('./models/Trip');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-travel';

const destinations = [
  // ==========================================
  // BUDGET TIER (₹0 – ₹5,000)
  // ==========================================
  {
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
      { name: 'Promenade Beach', description: 'A 1.2 km stretch along the Bay of Bengal, perfect for sunrise walks' },
      { name: 'Auroville', description: 'An experimental township dedicated to human unity' },
      { name: 'French Quarter', description: 'Colorful colonial-era streets with charming cafes and boutiques' },
      { name: 'Paradise Beach', description: 'A secluded beach accessible only by boat' }
    ],
    itinerary: [
      { day: 1, title: 'Explore the French Quarter', activities: ['Walk along Promenade Beach at sunrise', 'Breakfast at a French cafe', 'Visit Basilica of the Sacred Heart of Jesus', 'Explore French Quarter streets', 'Evening at Rock Beach'] },
      { day: 2, title: 'Auroville & Beach Day', activities: ['Visit Auroville and Matrimandir', 'Lunch at Auroville bakery', 'Boat ride to Paradise Beach', 'Shopping at local markets', 'Sunset at Serenity Beach'] }
    ],
    budgetBreakdown: { food: 1000, travel: 800, stay: 1200, activities: 300, miscellaneous: 200 }
  },
  {
    name: 'Varanasi',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&q=85&fit=crop',
    estimatedCost: 4000,
    description: 'One of the oldest living cities in the world, Varanasi is the spiritual capital of India, filled with ancient temples and mesmerizing ghats.',
    budgetTier: 'budget',
    category: 'pilgrimage',
    state: 'Uttar Pradesh',
    numberOfDays: 3,
    latitude: 25.3176,
    longitude: 83.0126,
    placesToVisit: [
      { name: 'Dashashwamedh Ghat', description: 'The main ghat famous for its spectacular evening Ganga Aarti' },
      { name: 'Kashi Vishwanath Temple', description: 'One of the most famous Hindu temples dedicated to Lord Shiva' },
      { name: 'Sarnath', description: 'Where Buddha gave his first sermon after enlightenment' },
      { name: 'Assi Ghat', description: 'A peaceful ghat popular for morning yoga and music' }
    ],
    itinerary: [
      { day: 1, title: 'Ghats & Temples', activities: ['Early morning boat ride on the Ganges', 'Visit Kashi Vishwanath Temple', 'Walk through the narrow lanes of old Varanasi', 'Evening Ganga Aarti at Dashashwamedh Ghat'] },
      { day: 2, title: 'Spiritual Exploration', activities: ['Sunrise at Assi Ghat', 'Visit Tulsi Manas Temple', 'Explore Banaras Hindu University', 'Visit local silk weavers', 'Street food tour'] },
      { day: 3, title: 'Sarnath Day Trip', activities: ['Visit Sarnath archaeological site', 'Dhamek Stupa', 'Sarnath Museum', 'Return and visit Manikarnika Ghat', 'Final evening at the ghats'] }
    ],
    budgetBreakdown: { food: 1200, travel: 800, stay: 1500, activities: 300, miscellaneous: 200 }
  },
  {
    name: 'Hampi',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb01cc978?w=1200&q=85&fit=crop',
    estimatedCost: 3000,
    description: 'A UNESCO World Heritage Site featuring surreal boulder landscapes dotted with ancient Vijayanagara Empire ruins from the 14th century.',
    budgetTier: 'budget',
    category: 'heritage',
    state: 'Karnataka',
    numberOfDays: 2,
    latitude: 15.3350,
    longitude: 76.4600,
    placesToVisit: [
      { name: 'Virupaksha Temple', description: 'A functioning temple dating back to the 7th century' },
      { name: 'Vittala Temple', description: 'Home to the iconic stone chariot and musical pillars' },
      { name: 'Matanga Hill', description: 'Best sunrise/sunset point with panoramic views of Hampi' },
      { name: 'Hippie Island', description: 'A relaxed area across the river with cafes and bouldering' }
    ],
    itinerary: [
      { day: 1, title: 'Royal Centre Exploration', activities: ['Visit Virupaksha Temple', 'Explore the ancient bazaar', 'Visit Queens Bath and Lotus Mahal', 'Sunset at Hemakuta Hill'] },
      { day: 2, title: 'Sacred Centre & Beyond', activities: ['Sunrise at Matanga Hill', 'Visit Vittala Temple Complex', 'Coracle ride on Tungabhadra River', 'Cross to Hippie Island', 'Explore boulder landscapes'] }
    ],
    budgetBreakdown: { food: 800, travel: 700, stay: 1000, activities: 300, miscellaneous: 200 }
  },
  {
    name: 'Rishikesh',
    image: 'https://images.unsplash.com/photo-1583309219338-a582f1f9ca6b?w=1200&q=85&fit=crop',
    estimatedCost: 4500,
    description: 'The "Yoga Capital of the World" nestled in the Himalayan foothills beside the holy Ganges, offering adventure sports and spiritual retreats.',
    budgetTier: 'budget',
    category: 'adventure',
    state: 'Uttarakhand',
    numberOfDays: 3,
    latitude: 30.0869,
    longitude: 78.2676,
    placesToVisit: [
      { name: 'Laxman Jhula', description: 'An iconic suspension bridge over the Ganges' },
      { name: 'Triveni Ghat', description: 'Sacred confluence point with evening aarti' },
      { name: 'Beatles Ashram', description: 'The abandoned ashram where the Beatles stayed in 1968' },
      { name: 'Neer Garh Waterfall', description: 'A beautiful two-tier waterfall surrounded by forest' }
    ],
    itinerary: [
      { day: 1, title: 'Explore Rishikesh Town', activities: ['Walk across Laxman Jhula', 'Visit temples near Ram Jhula', 'Explore Beatles Ashram', 'Evening Ganga Aarti at Triveni Ghat'] },
      { day: 2, title: 'Adventure Day', activities: ['White water rafting on the Ganges', 'Cliff jumping at designated spots', 'Lunch at a riverside cafe', 'Visit Neer Garh Waterfall', 'Yoga session at sunset'] },
      { day: 3, title: 'Peace & Nature', activities: ['Sunrise yoga session', 'Trek to Patna Waterfall', 'Meditation at Parmarth Niketan', 'Local market shopping', 'Departure'] }
    ],
    budgetBreakdown: { food: 1200, travel: 1000, stay: 1500, activities: 500, miscellaneous: 300 }
  },
  {
    name: 'Pushkar',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=85&fit=crop',
    estimatedCost: 2500,
    description: 'A tiny sacred town wrapped around a holy lake in the heart of Rajasthan, known for its vibrant culture, temples, and the famous camel fair.',
    budgetTier: 'budget',
    category: 'pilgrimage',
    state: 'Rajasthan',
    numberOfDays: 2,
    latitude: 26.4900,
    longitude: 74.5513,
    placesToVisit: [
      { name: 'Pushkar Lake', description: 'A sacred lake surrounded by 52 bathing ghats' },
      { name: 'Brahma Temple', description: 'One of very few temples in the world dedicated to Lord Brahma' },
      { name: 'Savitri Temple', description: 'A hilltop temple with panoramic desert views' },
      { name: 'Main Bazaar', description: 'A vibrant street lined with colorful shops and cafes' }
    ],
    itinerary: [
      { day: 1, title: 'Lake & Temples', activities: ['Morning walk around Pushkar Lake', 'Visit Brahma Temple', 'Explore Main Bazaar', 'Lunch at a rooftop cafe', 'Sunset at Pushkar Lake ghats'] },
      { day: 2, title: 'Hills & Culture', activities: ['Sunrise trek to Savitri Temple', 'Visit Rangji Temple', 'Camel ride in the desert', 'Shopping for souvenirs', 'Evening puja at the lake'] }
    ],
    budgetBreakdown: { food: 600, travel: 500, stay: 900, activities: 300, miscellaneous: 200 }
  },
  {
    name: 'Alleppey',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&q=85&fit=crop',
    estimatedCost: 4800,
    description: 'Known as the "Venice of the East," Alleppey enchants visitors with its serene backwaters, lush paddy fields, and traditional houseboats.',
    budgetTier: 'budget',
    category: 'beach',
    state: 'Kerala',
    numberOfDays: 2,
    latitude: 9.4981,
    longitude: 76.3388,
    placesToVisit: [
      { name: 'Alleppey Backwaters', description: 'A network of canals, lagoons, and lakes stretching across Kerala' },
      { name: 'Alleppey Beach', description: 'A quiet beach with a historic pier and lighthouse' },
      { name: 'Kumarakom Bird Sanctuary', description: 'Home to migratory birds from Siberia and the Himalayas' },
      { name: 'Marari Beach', description: 'A pristine, less crowded beach perfect for relaxation' }
    ],
    itinerary: [
      { day: 1, title: 'Backwater Cruise', activities: ['Board a houseboat for backwater cruise', 'Enjoy Kerala cuisine on board', 'Watch toddy tappers and coir making', 'Sunset over the backwaters', 'Overnight stay on houseboat'] },
      { day: 2, title: 'Beach & Birds', activities: ['Morning at Alleppey Beach', 'Visit the lighthouse', 'Trip to Kumarakom Bird Sanctuary', 'Visit local coir factory', 'Evening at Marari Beach'] }
    ],
    budgetBreakdown: { food: 1200, travel: 800, stay: 2000, activities: 500, miscellaneous: 300 }
  },

  // ==========================================
  // MID TIER (₹5,001 – ₹15,000)
  // ==========================================
  {
    name: 'Goa',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=85&fit=crop',
    estimatedCost: 8000,
    description: 'India\'s beach paradise, Goa offers golden sands, vibrant nightlife, Portuguese heritage architecture, and a laid-back tropical lifestyle.',
    budgetTier: 'mid',
    category: 'beach',
    state: 'Goa',
    numberOfDays: 4,
    latitude: 15.2993,
    longitude: 74.1240,
    placesToVisit: [
      { name: 'Baga Beach', description: 'A lively beach famous for nightlife, water sports, and shacks' },
      { name: 'Old Goa Churches', description: 'UNESCO World Heritage basilicas and cathedrals from the Portuguese era' },
      { name: 'Dudhsagar Falls', description: 'A spectacular four-tiered waterfall on the Mandovi River' },
      { name: 'Fort Aguada', description: 'A well-preserved 17th-century Portuguese fort with lighthouse' },
      { name: 'Palolem Beach', description: 'A crescent-shaped beach in South Goa, perfect for relaxation' }
    ],
    itinerary: [
      { day: 1, title: 'North Goa Beaches', activities: ['Arrive and check in at hotel', 'Relax at Calangute Beach', 'Water sports at Baga Beach', 'Sunset at Anjuna Beach', 'Dinner at a beach shack'] },
      { day: 2, title: 'Heritage & Culture', activities: ['Visit Old Goa Churches', 'Explore Fontainhas (Latin Quarter)', 'Lunch at a Goan restaurant', 'Visit Fort Aguada', 'Evening at Candolim Beach'] },
      { day: 3, title: 'Adventure Day', activities: ['Dudhsagar Falls trip', 'Spice plantation visit with lunch', 'Return to hotel', 'Night market visit'] },
      { day: 4, title: 'South Goa', activities: ['Drive to Palolem Beach', 'Kayaking and dolphin spotting', 'Visit Cabo de Rama Fort', 'Lunch at a beach cafe', 'Departure'] }
    ],
    budgetBreakdown: { food: 2500, travel: 1500, stay: 2500, activities: 1000, miscellaneous: 500 }
  },
  {
    name: 'Udaipur',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e13?w=1200&q=85&fit=crop',
    estimatedCost: 10000,
    description: 'The "City of Lakes" — a romantic Rajasthani city with stunning palaces, shimmering lakes, and a regal heritage that takes your breath away.',
    budgetTier: 'mid',
    category: 'heritage',
    state: 'Rajasthan',
    numberOfDays: 3,
    latitude: 24.5854,
    longitude: 73.7125,
    placesToVisit: [
      { name: 'City Palace', description: 'A massive palace complex overlooking Lake Pichola with 11 mahals' },
      { name: 'Lake Pichola', description: 'A stunning artificial lake with the Jag Mandir and Taj Lake Palace' },
      { name: 'Jagdish Temple', description: 'An Indo-Aryan temple with intricate carvings dedicated to Lord Vishnu' },
      { name: 'Sajjangarh Palace', description: 'A hilltop monsoon palace with panoramic city views' }
    ],
    itinerary: [
      { day: 1, title: 'Palace & Lake', activities: ['Visit City Palace and museum', 'Lunch with lake view', 'Boat ride on Lake Pichola', 'Visit Jagdish Temple', 'Sunset at Ambrai Ghat'] },
      { day: 2, title: 'Art & Culture', activities: ['Visit Saheliyon-ki-Bari garden', 'Explore Shilpgram craft village', 'Lunch at a heritage restaurant', 'Visit Bagore Ki Haveli', 'Evening folk dance show'] },
      { day: 3, title: 'Hills & Markets', activities: ['Visit Sajjangarh Palace at sunrise', 'Explore Hathi Pol Bazaar', 'Traditional Rajasthani thali lunch', 'Visit Fateh Sagar Lake', 'Departure'] }
    ],
    budgetBreakdown: { food: 3000, travel: 2000, stay: 3000, activities: 1500, miscellaneous: 500 }
  },
  {
    name: 'Manali',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=85&fit=crop',
    estimatedCost: 12000,
    description: 'A breathtaking hill station in the mountains of Himachal Pradesh, offering snow-capped peaks, alpine meadows, and thrilling adventure activities.',
    budgetTier: 'mid',
    category: 'hill-station',
    state: 'Himachal Pradesh',
    numberOfDays: 4,
    latitude: 32.2396,
    longitude: 77.1887,
    placesToVisit: [
      { name: 'Rohtang Pass', description: 'A high mountain pass at 3,978 m with stunning snow views' },
      { name: 'Solang Valley', description: 'A valley famous for skiing, paragliding, and zorbing' },
      { name: 'Old Manali', description: 'A bohemian village with cafes, temples, and apple orchards' },
      { name: 'Hadimba Temple', description: 'A unique pagoda-like temple set in a cedar forest' }
    ],
    itinerary: [
      { day: 1, title: 'Arrive & Explore', activities: ['Arrive in Manali and check in', 'Walk through Old Manali', 'Visit Hadimba Temple', 'Explore Mall Road', 'Hot chocolate at a hillside cafe'] },
      { day: 2, title: 'Adventure Day', activities: ['Drive to Solang Valley', 'Paragliding over the valley', 'Zorbing and zip-lining', 'Lunch at valley cafe', 'Return and relax'] },
      { day: 3, title: 'Rohtang Pass', activities: ['Early departure to Rohtang Pass', 'Snow activities', 'Photography at the pass', 'Return via Gulaba viewpoint', 'Evening at Vashisht hot springs'] },
      { day: 4, title: 'Nature & Departure', activities: ['Visit Jogini Waterfall via trek', 'Explore local markets', 'Traditional Himachali lunch', 'Visit Manu Temple', 'Departure'] }
    ],
    budgetBreakdown: { food: 3500, travel: 3000, stay: 3500, activities: 1500, miscellaneous: 500 }
  },
  {
    name: 'Jaipur',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=85&fit=crop',
    estimatedCost: 7000,
    description: 'The "Pink City" of Rajasthan, Jaipur dazzles with majestic forts, ornate palaces, vibrant bazaars, and a rich royal heritage.',
    budgetTier: 'mid',
    category: 'heritage',
    state: 'Rajasthan',
    numberOfDays: 3,
    latitude: 26.9124,
    longitude: 75.7873,
    placesToVisit: [
      { name: 'Amber Fort', description: 'A magnificent fort-palace made of red sandstone and white marble' },
      { name: 'Hawa Mahal', description: 'The iconic "Palace of Winds" with 953 small windows' },
      { name: 'City Palace', description: 'A blend of Mughal and Rajasthani architecture in the heart of city' },
      { name: 'Nahargarh Fort', description: 'A hilltop fort offering sweeping views of Jaipur city' }
    ],
    itinerary: [
      { day: 1, title: 'Forts & Palaces', activities: ['Visit Amber Fort with elephant ride', 'Explore Jaigarh Fort', 'Lunch at 1135 AD restaurant', 'Visit Jal Mahal (Water Palace)', 'Sunset at Nahargarh Fort'] },
      { day: 2, title: 'City Exploration', activities: ['Visit Hawa Mahal', 'Explore City Palace and museum', 'Jantar Mantar observatory', 'Shopping at Johari Bazaar', 'Evening puppet show'] },
      { day: 3, title: 'Culture & Shopping', activities: ['Visit Albert Hall Museum', 'Explore Birla Mandir', 'Traditional Rajasthani thali', 'Shopping at Bapu Bazaar', 'Departure'] }
    ],
    budgetBreakdown: { food: 2000, travel: 1500, stay: 2000, activities: 1000, miscellaneous: 500 }
  },
  {
    name: 'Munnar',
    image: 'https://images.unsplash.com/photo-1611832474885-b56a522ee4b6?w=1200&q=85&fit=crop',
    estimatedCost: 9000,
    description: 'A dreamlike hill station in Kerala draped in emerald tea gardens, misty mountains, and cascading waterfalls — a paradise for nature lovers.',
    budgetTier: 'mid',
    category: 'hill-station',
    state: 'Kerala',
    numberOfDays: 3,
    latitude: 10.0889,
    longitude: 77.0595,
    placesToVisit: [
      { name: 'Tea Gardens', description: 'Vast rolling carpets of tea plantations as far as the eye can see' },
      { name: 'Eravikulam National Park', description: 'Home to the endangered Nilgiri Tahr mountain goat' },
      { name: 'Mattupetty Dam', description: 'A scenic dam surrounded by lush green hills' },
      { name: 'Attukal Waterfalls', description: 'A beautiful cascading waterfall set among rocks and flora' }
    ],
    itinerary: [
      { day: 1, title: 'Tea Country', activities: ['Visit Tata Tea Museum', 'Walk through tea plantations', 'Tea tasting experience', 'Visit Photo Point', 'Sunset at Top Station'] },
      { day: 2, title: 'Wildlife & Nature', activities: ['Visit Eravikulam National Park', 'Spot Nilgiri Tahr', 'Mattupetty Dam boating', 'Echo Point visit', 'Evening at leisure'] },
      { day: 3, title: 'Waterfalls & Departure', activities: ['Visit Attukal Waterfalls', 'Explore Chinnakanal Falls', 'Spice garden visit', 'Local market shopping', 'Departure'] }
    ],
    budgetBreakdown: { food: 2500, travel: 2000, stay: 2800, activities: 1200, miscellaneous: 500 }
  },
  {
    name: 'Ooty',
    image: 'https://images.unsplash.com/photo-1622308644420-b20142dc993c?w=1200&q=85&fit=crop',
    estimatedCost: 7500,
    description: 'The "Queen of Hill Stations" in Tamil Nadu\'s Nilgiri Hills, offering colonial-era charm, botanical gardens, and a famous toy train ride.',
    budgetTier: 'mid',
    category: 'hill-station',
    state: 'Tamil Nadu',
    numberOfDays: 3,
    latitude: 11.4102,
    longitude: 76.6950,
    placesToVisit: [
      { name: 'Ooty Botanical Gardens', description: 'Founded in 1848, spanning 55 acres with over 1000 plant species' },
      { name: 'Nilgiri Mountain Railway', description: 'A UNESCO World Heritage toy train through stunning blue mountains' },
      { name: 'Ooty Lake', description: 'An artificial lake with boating and surrounded by eucalyptus trees' },
      { name: 'Doddabetta Peak', description: 'The highest peak in the Nilgiris at 2,637 meters' }
    ],
    itinerary: [
      { day: 1, title: 'Gardens & Lake', activities: ['Visit Ooty Botanical Gardens', 'Rose Garden exploration', 'Boating at Ooty Lake', 'Visit Thread Garden', 'Evening stroll at Charring Cross'] },
      { day: 2, title: 'Train & Peak', activities: ['Toy train ride (Ooty to Coonoor)', 'Visit Sim\'s Park in Coonoor', 'Lunch at a tea estate', 'Doddabetta Peak viewpoint', 'Tea factory visit'] },
      { day: 3, title: 'Nature & Departure', activities: ['Visit Pykara Falls', 'Pine Forest walk', 'Avalanche Lake', 'Shopping for homemade chocolates', 'Departure'] }
    ],
    budgetBreakdown: { food: 2000, travel: 2000, stay: 2200, activities: 800, miscellaneous: 500 }
  },

  // ==========================================
  // PREMIUM TIER (₹15,001+)
  // ==========================================
  {
    name: 'Kashmir',
    image: 'https://images.unsplash.com/photo-1597074866923-dc0589150bd6?w=1200&q=85&fit=crop',
    estimatedCost: 25000,
    description: 'Heaven on Earth — Kashmir stuns with its snow-draped valleys, pristine Dal Lake, lush Mughal gardens, and unparalleled natural beauty.',
    budgetTier: 'premium',
    category: 'hill-station',
    state: 'Jammu & Kashmir',
    numberOfDays: 6,
    latitude: 34.0837,
    longitude: 74.7973,
    placesToVisit: [
      { name: 'Dal Lake', description: 'An iconic lake with houseboats, shikaras, and floating gardens' },
      { name: 'Gulmarg', description: 'A ski resort town with the world\'s second highest cable car' },
      { name: 'Pahalgam', description: 'A valley surrounded by pine forests, ideal for trekking' },
      { name: 'Mughal Gardens', description: 'Nishat, Shalimar, and Chashme Shahi — terraced gardens of the Mughal era' },
      { name: 'Sonmarg', description: 'The "Meadow of Gold" with glaciers and pristine alpine scenery' }
    ],
    itinerary: [
      { day: 1, title: 'Welcome to Srinagar', activities: ['Arrive at Srinagar Airport', 'Check in at Dal Lake houseboat', 'Shikara ride on Dal Lake', 'Visit floating vegetable market', 'Kashmiri dinner on houseboat'] },
      { day: 2, title: 'Mughal Gardens', activities: ['Visit Nishat Bagh', 'Explore Shalimar Bagh', 'Visit Chashme Shahi', 'Hazratbal Shrine', 'Evening shikara ride'] },
      { day: 3, title: 'Gulmarg Day', activities: ['Drive to Gulmarg (56 km)', 'Gondola ride to Kongdoori', 'Snow activities', 'Visit Gulmarg Golf Course', 'Return to Srinagar'] },
      { day: 4, title: 'Pahalgam Excursion', activities: ['Drive to Pahalgam', 'Visit Betaab Valley', 'Aru Valley exploration', 'Pony ride along Lidder River', 'Overnight stay in Pahalgam'] },
      { day: 5, title: 'Sonmarg Adventure', activities: ['Drive to Sonmarg', 'Thajiwas Glacier trek', 'Pony ride to Zero Point', 'Photography at frozen streams', 'Return to Srinagar'] },
      { day: 6, title: 'Departure', activities: ['Morning walk along Boulevard Road', 'Visit local craft markets', 'Buy saffron and pashmina', 'Departure from Srinagar'] }
    ],
    budgetBreakdown: { food: 6000, travel: 6000, stay: 8000, activities: 3500, miscellaneous: 1500 }
  },
  {
    name: 'Andaman Islands',
    image: 'https://images.unsplash.com/photo-1589979481223-deb893043163?w=1200&q=85&fit=crop',
    estimatedCost: 30000,
    description: 'A tropical paradise in the Bay of Bengal with crystal-clear turquoise waters, pristine white-sand beaches, coral reefs, and dense mangrove forests.',
    budgetTier: 'premium',
    category: 'beach',
    state: 'Andaman & Nicobar',
    numberOfDays: 5,
    latitude: 11.7401,
    longitude: 92.6586,
    placesToVisit: [
      { name: 'Radhanagar Beach', description: 'Rated Asia\'s best beach — stunning white sand and turquoise water' },
      { name: 'Cellular Jail', description: 'A historic colonial-era prison turned national memorial' },
      { name: 'Havelock Island', description: 'The most popular island with world-class diving and snorkeling' },
      { name: 'Neil Island', description: 'A serene island known for natural coral bridge and lush greenery' },
      { name: 'North Bay Island', description: 'Perfect for snorkeling and glass-bottom boat rides' }
    ],
    itinerary: [
      { day: 1, title: 'Arrive at Port Blair', activities: ['Arrive at Veer Savarkar Airport', 'Visit Cellular Jail', 'Sound and Light show at Cellular Jail', 'Dinner at waterfront restaurant'] },
      { day: 2, title: 'Island Hopping', activities: ['Ferry to North Bay Island', 'Snorkeling and coral viewing', 'Glass-bottom boat ride', 'Ross Island tour', 'Return to Port Blair'] },
      { day: 3, title: 'Havelock Island', activities: ['Ferry to Havelock Island', 'Visit Radhanagar Beach', 'Scuba diving at the Wall', 'Beach sunset', 'Seafood dinner'] },
      { day: 4, title: 'Diving & Beaches', activities: ['Elephant Beach snorkeling', 'Kayaking through mangroves', 'Kalapathar Beach', 'Underwater sea walk experience'] },
      { day: 5, title: 'Neil Island & Return', activities: ['Ferry to Neil Island', 'Natural Bridge (Howrah Bridge)', 'Lakshmanpur Beach', 'Return to Port Blair', 'Departure'] }
    ],
    budgetBreakdown: { food: 7000, travel: 8000, stay: 9000, activities: 4500, miscellaneous: 1500 }
  },
  {
    name: 'Leh-Ladakh',
    image: 'https://images.unsplash.com/photo-1626015365107-af325066d40d?w=1200&q=85&fit=crop',
    estimatedCost: 28000,
    description: 'The "Land of High Passes" — an otherworldly mountain desert with turquoise lakes, ancient monasteries, and the highest motorable roads in the world.',
    budgetTier: 'premium',
    category: 'adventure',
    state: 'Ladakh',
    numberOfDays: 6,
    latitude: 34.1526,
    longitude: 77.5771,
    placesToVisit: [
      { name: 'Pangong Lake', description: 'A mesmerizing 134 km long lake that changes colors through the day' },
      { name: 'Nubra Valley', description: 'A high-altitude cold desert with sand dunes and Bactrian camels' },
      { name: 'Khardung La', description: 'One of the world\'s highest motorable passes at 5,359 m' },
      { name: 'Leh Palace', description: 'A 17th-century former royal palace overlooking Leh town' },
      { name: 'Thiksey Monastery', description: 'A stunning 12-story monastery resembling the Potala Palace' }
    ],
    itinerary: [
      { day: 1, title: 'Acclimatization', activities: ['Arrive in Leh', 'Rest and acclimatize to altitude', 'Light walk around Leh Market', 'Visit Shanti Stupa at sunset', 'Early dinner and rest'] },
      { day: 2, title: 'Leh Exploration', activities: ['Visit Leh Palace', 'Hall of Fame museum', 'Thiksey Monastery', 'Hemis Monastery', 'Rancho\'s School (3 Idiots fame)'] },
      { day: 3, title: 'Nubra Valley', activities: ['Drive over Khardung La Pass', 'Reach Diskit', 'Giant Maitreya Buddha statue', 'Camel ride at Hunder Sand Dunes', 'Overnight in Nubra Valley'] },
      { day: 4, title: 'To Pangong Lake', activities: ['Drive from Nubra to Pangong via Shyok route', 'Arrive at Pangong Lake', 'Photography at the ever-changing colors', 'Camp beside the lake', 'Stargazing'] },
      { day: 5, title: 'Pangong & Return', activities: ['Sunrise at Pangong Lake', 'Drive back to Leh via Chang La', 'Visit Chemrey Monastery', 'Arrival in Leh', 'Shopping at Main Bazaar'] },
      { day: 6, title: 'Departure', activities: ['Visit Magnetic Hill', 'Sangam (Indus-Zanskar confluence)', 'Pathar Sahib Gurudwara', 'Final shopping', 'Departure from Leh'] }
    ],
    budgetBreakdown: { food: 6000, travel: 8000, stay: 8000, activities: 4000, miscellaneous: 2000 }
  },
  {
    name: 'Kerala Backwaters Tour',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=85&fit=crop',
    estimatedCost: 20000,
    description: 'A luxurious journey through "God\'s Own Country" — from misty hills and spice plantations to tranquil backwaters and golden beaches.',
    budgetTier: 'premium',
    category: 'beach',
    state: 'Kerala',
    numberOfDays: 5,
    latitude: 9.9312,
    longitude: 76.2673,
    placesToVisit: [
      { name: 'Kochi Fort', description: 'A historic area with Chinese fishing nets, churches, and spice markets' },
      { name: 'Alleppey Houseboats', description: 'Luxury houseboats cruising through the Kerala backwaters' },
      { name: 'Periyar Wildlife Sanctuary', description: 'A tiger reserve with boat safaris on Periyar Lake' },
      { name: 'Kovalam Beach', description: 'A famous crescent-shaped beach with a lighthouse' }
    ],
    itinerary: [
      { day: 1, title: 'Arrive at Kochi', activities: ['Arrive in Kochi', 'Visit Chinese Fishing Nets', 'St. Francis Church', 'Jewish Synagogue area', 'Kathakali dance show'] },
      { day: 2, title: 'Spice Route', activities: ['Drive to Thekkady', 'Periyar spice plantation tour', 'Periyar Lake boat safari', 'Watch elephants and wildlife', 'Overnight in Thekkady'] },
      { day: 3, title: 'Backwater Bliss', activities: ['Drive to Alleppey', 'Board luxury houseboat', 'Cruise through backwater canals', 'Kerala Sadhya on houseboat', 'Overnight on houseboat'] },
      { day: 4, title: 'Kovalam Beach', activities: ['Drive to Kovalam', 'Lighthouse Beach visit', 'Ayurvedic spa treatment', 'Hawa Beach', 'Seafood dinner at beach restaurant'] },
      { day: 5, title: 'Trivandrum & Departure', activities: ['Visit Padmanabhaswamy Temple', 'Napier Museum', 'Shopping for Kerala sarees', 'Departure'] }
    ],
    budgetBreakdown: { food: 5000, travel: 4000, stay: 6500, activities: 3000, miscellaneous: 1500 }
  },
  {
    name: 'Rajasthan Royal Circuit',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&q=85&fit=crop',
    estimatedCost: 22000,
    description: 'A grand royal tour through Rajasthan\'s golden desert cities — experience majestic forts, opulent palaces, colorful markets, and desert safaris.',
    budgetTier: 'premium',
    category: 'heritage',
    state: 'Rajasthan',
    numberOfDays: 6,
    latitude: 26.2389,
    longitude: 73.0243,
    placesToVisit: [
      { name: 'Mehrangarh Fort', description: 'One of India\'s largest forts, towering 400 feet above Jodhpur' },
      { name: 'Jaisalmer Fort', description: 'A living fort rising from the Thar Desert like a golden mirage' },
      { name: 'Thar Desert Safari', description: 'Camel safari through sand dunes with desert camping' },
      { name: 'Lake Pichola', description: 'A romantic lake in Udaipur with floating palace hotels' }
    ],
    itinerary: [
      { day: 1, title: 'Jodhpur: Blue City', activities: ['Arrive in Jodhpur', 'Visit Mehrangarh Fort', 'Explore the Blue City lanes', 'Clock Tower market', 'Rajasthani dinner'] },
      { day: 2, title: 'To Jaisalmer', activities: ['Drive to Jaisalmer', 'Visit Jaisalmer Fort', 'Patwon Ki Haveli', 'Gadsisar Lake', 'Shopping at Manak Chowk'] },
      { day: 3, title: 'Desert Experience', activities: ['Sam Sand Dunes excursion', 'Camel safari', 'Desert sunset photography', 'Traditional Rajasthani dinner under stars', 'Overnight desert camping'] },
      { day: 4, title: 'To Udaipur', activities: ['Drive to Udaipur via Ranakpur', 'Visit Ranakpur Jain Temple', 'Arrive in Udaipur', 'Evening at Ambrai Ghat', 'Lake Pichola views'] },
      { day: 5, title: 'Udaipur Grandeur', activities: ['City Palace tour', 'Boat ride to Jag Mandir', 'Saheliyon-ki-Bari garden', 'Vintage car museum', 'Rooftop dinner with palace view'] },
      { day: 6, title: 'Departure', activities: ['Morning at Fateh Sagar Lake', 'Visit Shilpgram', 'Buy Rajasthani handicrafts', 'Departure'] }
    ],
    budgetBreakdown: { food: 5500, travel: 5000, stay: 7000, activities: 3000, miscellaneous: 1500 }
  },
  {
    name: 'Darjeeling & Sikkim',
    image: 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=1200&q=85&fit=crop',
    estimatedCost: 18000,
    description: 'A magical journey through the mist-covered hills of the Eastern Himalayas — tea gardens, monastery trails, and stunning views of Kanchenjunga.',
    budgetTier: 'premium',
    category: 'hill-station',
    state: 'West Bengal & Sikkim',
    numberOfDays: 5,
    latitude: 27.0410,
    longitude: 88.2663,
    placesToVisit: [
      { name: 'Tiger Hill', description: 'Famous sunrise point with views of Kanchenjunga and Everest' },
      { name: 'Darjeeling Tea Gardens', description: 'World-renowned tea estates producing the finest Darjeeling tea' },
      { name: 'Tsomgo Lake', description: 'A sacred glacial lake at 12,310 feet in Sikkim' },
      { name: 'Rumtek Monastery', description: 'The largest monastery in Sikkim with stunning Buddhist architecture' }
    ],
    itinerary: [
      { day: 1, title: 'Arrive in Darjeeling', activities: ['Arrive via New Jalpaiguri', 'Check in at hotel', 'Visit Chowrasta Mall', 'Visit Peace Pagoda', 'Evening at leisure'] },
      { day: 2, title: 'Darjeeling Sights', activities: ['Sunrise at Tiger Hill', 'Batasia Loop and War Memorial', 'Toy Train ride', 'Visit Tea Garden and factory', 'Sunset from observatory'] },
      { day: 3, title: 'To Gangtok', activities: ['Drive to Gangtok', 'Visit Enchey Monastery', 'MG Marg evening walk', 'Gangtok Ropeway', 'Dinner at MG Marg'] },
      { day: 4, title: 'Sikkim Exploration', activities: ['Excursion to Tsomgo Lake', 'Baba Mandir visit', 'Yak ride at Tsomgo', 'Return to Gangtok', 'Rumtek Monastery'] },
      { day: 5, title: 'Departure', activities: ['Visit Flower Exhibition', 'Do Drul Chorten stupa', 'Local market shopping', 'Departure'] }
    ],
    budgetBreakdown: { food: 4000, travel: 5000, stay: 5500, activities: 2500, miscellaneous: 1000 }
  }
];

// Run seed
async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing trips
    await Trip.deleteMany({});
    console.log('🗑️  Cleared existing trips');

    // Insert all destinations
    const inserted = await Trip.insertMany(destinations);
    console.log(`✅ Successfully seeded ${inserted.length} destinations:`);

    // Log summary by tier
    const budget = inserted.filter(t => t.budgetTier === 'budget');
    const mid = inserted.filter(t => t.budgetTier === 'mid');
    const premium = inserted.filter(t => t.budgetTier === 'premium');

    console.log(`   📍 Budget tier (₹0-5000):  ${budget.length} destinations`);
    console.log(`   📍 Mid tier (₹5001-15000): ${mid.length} destinations`);
    console.log(`   📍 Premium tier (₹15000+): ${premium.length} destinations`);

    mongoose.connection.close();
    console.log('\n✅ Seeding complete! Database connection closed.');
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
}

seedDatabase();
