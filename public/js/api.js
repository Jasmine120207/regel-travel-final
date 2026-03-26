// ============================================
// Virtual API Utility for Static Deployment
// ============================================

const api = {
  // Get token from localStorage
  getToken() {
    return localStorage.getItem('token');
  },
  
  // Set auth data
  setAuth(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = './'; // use relative path
  },
  
  // Check if logged in
  isLoggedIn() {
    return !!this.getToken();
  },
  
  // Custom fetch with auth header (Mocked for static app)
  async fetchWithAuth(endpoint, options = {}) {
    console.log(`[Virtual API] Intercepted request to: ${endpoint}`);
    
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body) : null;
    
    // 1. Auth: Login
    if (endpoint === '/auth/login' && method === 'POST') {
      const users = JSON.parse(localStorage.getItem('vt_users')) || [];
      const user = users.find(u => u.email === body.email && u.password === body.password);
      if (user) {
        return { success: true, token: 'fake-jwt-token-123', user };
      }
      throw new Error('Invalid credentials');
    }
    
    // 2. Auth: Register
    if (endpoint === '/auth/register' && method === 'POST') {
      const users = JSON.parse(localStorage.getItem('vt_users')) || [];
      if (users.find(u => u.email === body.email)) {
        throw new Error('Email already registered');
      }
      const newUser = { id: Date.now().toString(), name: body.name, email: body.email, password: body.password };
      users.push(newUser);
      localStorage.setItem('vt_users', JSON.stringify(users));
      return { success: true, token: 'fake-jwt-token-123', user: newUser };
    }
    
    // 3. Trips: All
    if (endpoint === '/trips/all' && method === 'GET') {
      return { success: true, count: window.mockTrips.length, trips: window.mockTrips };
    }
    
    // 4. Trips: Filter by budget
    if (endpoint.startsWith('/trips?budget=')) {
      const budgetMatch = endpoint.match(/budget=([0-9]*)/);
      const budget = budgetMatch && budgetMatch[1] ? parseInt(budgetMatch[1]) : null;
      
      let trips = window.mockTrips;
      if (budget) {
        trips = trips.filter(t => t.estimatedCost <= budget + 2000);
      }
      return { success: true, count: trips.length, tier: budget <= 5000 ? 'budget' : budget <= 15000 ? 'mid' : 'premium', trips };
    }
    
    // 5. Trips: Single
    if (endpoint.match(/^\/trips\/[a-zA-Z0-9]+$/) && method === 'GET') {
      const id = endpoint.split('/')[2];
      const trip = window.mockTrips.find(t => t._id === id);
      if (trip) return { success: true, trip };
      throw new Error('Trip not found');
    }
    
    // 6. Trips: Weather
    if (endpoint.match(/^\/trips\/[a-zA-Z0-9]+\/weather$/) && method === 'GET') {
      return {
        success: true,
        weather: {
          temp: Math.floor(Math.random() * 15) + 20,
          description: 'Sunny',
          humidity: 50,
          icon: '01d',
          city: 'Destination',
          feelsLike: 25,
          windSpeed: 4.5
        }
      };
    }
    
    // 7. Saved Trips
    if (endpoint.startsWith('/saved-trips')) {
      const savedTrips = JSON.parse(localStorage.getItem('vt_saved_trips')) || [];
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('Not authenticated');
      // GET
      if (method === 'GET') {
        const enriched = savedTrips.map(st => {
          const tripDetails = window.mockTrips.find(t => t._id === st.tripId);
          return { ...st, trip: tripDetails || {} };
        });
        return { success: true, count: enriched.length, savedTrips: enriched };
      }
      // POST
      if (method === 'POST') {
        const existing = savedTrips.find(st => st.tripId === body.tripId);
        if (existing) throw new Error('Trip already saved');
        const newSaved = { _id: Date.now().toString(), tripId: body.tripId, notes: body.notes || '' };
        savedTrips.push(newSaved);
        localStorage.setItem('vt_saved_trips', JSON.stringify(savedTrips));
        return { success: true, savedTrip: newSaved };
      }
      // DELETE
      if (method === 'DELETE') {
        const id = endpoint.split('/')[2];
        const index = savedTrips.findIndex(st => st._id === id);
        if (index > -1) {
          savedTrips.splice(index, 1);
          localStorage.setItem('vt_saved_trips', JSON.stringify(savedTrips));
          return { success: true };
        }
        throw new Error('Saved trip not found');
      }
    }
    
    // 8. Bookings
    if (endpoint.startsWith('/bookings')) {
      const bookings = JSON.parse(localStorage.getItem('vt_bookings')) || [];
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('Not authenticated');
      
      if (method === 'GET') {
        const enriched = bookings.map(b => {
          const tripDetails = window.mockTrips.find(t => t._id === b.tripId);
          return { ...b, trip: tripDetails || {} };
        });
        return { success: true, count: enriched.length, bookings: enriched };
      }
      if (method === 'POST') {
        const newBooking = {
          _id: Date.now().toString(),
          tripId: body.tripId,
          travelers: body.travelers,
          travelDate: body.travelDate,
          totalAmount: body.totalAmount,
          status: 'confirmed',
          createdAt: new Date().toISOString()
        };
        bookings.push(newBooking);
        localStorage.setItem('vt_bookings', JSON.stringify(bookings));
        return { success: true, booking: newBooking };
      }
    }

    throw new Error(`Endpoint not mocked for static deployment: ${endpoint}`);
  }
};

// Global UI Initialization
document.addEventListener('DOMContentLoaded', () => {
  // 1. Update Navigation based on Auth State
  const isLoggedIn = api.isLoggedIn();
  
  const loginBtn = document.getElementById('navLoginBtn');
  const signupBtn = document.getElementById('navSignupBtn');
  const dashboardBtn = document.getElementById('navDashboardBtn');
  const logoutBtn = document.getElementById('navLogoutBtn');
  
  if (isLoggedIn) {
    if(loginBtn) loginBtn.classList.add('auth-hidden');
    if(signupBtn) signupBtn.classList.add('auth-hidden');
    if(dashboardBtn) dashboardBtn.classList.remove('auth-hidden');
    if(logoutBtn) {
      logoutBtn.classList.remove('auth-hidden');
      logoutBtn.addEventListener('click', () => {
        api.logout();
      });
    }
  }
  
  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
  
  // 3. Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
});
