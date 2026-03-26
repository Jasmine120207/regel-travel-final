// ============================================
// Dashboard Page Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Security Check
  if (!api.isLoggedIn()) {
    window.location.href = '/auth.html';
    return;
  }
  
  // Elements
  const savedGrid = document.getElementById('savedGrid');
  const recentList = document.getElementById('recentList');
  const savedCount = document.getElementById('savedCount');
  const bookingsList = document.getElementById('bookingsList');
  const bookingCount = document.getElementById('bookingCount');
  
  // Set User Data
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) {
      document.getElementById('userGreeting').textContent = `Hello, ${user.name.split(' ')[0]}`;
    }
  } catch(e) {}
  
  init();
  
  async function init() {
    loadRecentTrips();
    fetchBookings();
    await fetchSavedTrips();
  }

  async function fetchBookings() {
    try {
      const res = await api.fetchWithAuth('/bookings');
      
      if (res.success) {
        renderBookings(res.bookings);
        if (bookingCount) bookingCount.textContent = res.bookings.length;
      }
    } catch (err) {
      console.error(err);
      if (bookingsList) {
        bookingsList.innerHTML = `
          <div class="empty-state">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <h3>Error Loading Bookings</h3>
            <p>${err.message}</p>
          </div>
        `;
      }
    }
  }

  function renderBookings(bookings) {
    if (!bookingsList) return;
    
    if (!bookings || bookings.length === 0) {
      bookingsList.innerHTML = `
        <div class="empty-state">
          <i class="fa-regular fa-calendar-xmark"></i>
          <h3>No Bookings Yet</h3>
          <p>You haven't booked any trips. Explore our destinations and plan your next adventure!</p>
          <a href="/recommendations.html" class="btn btn-primary" style="margin-top: 15px;">Explore Destinations</a>
        </div>
      `;
      return;
    }
    
    let html = '';
    bookings.forEach(b => {
      const tripName = b.tripId ? b.tripId.name : 'Unknown Trip';
      const tripLocation = b.tripId ? b.tripId.state : '';
      const date = new Date(b.travelDate).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
      
      html += `
        <div class="booking-card fade-up">
          <div class="booking-info">
            <h3><i class="fa-solid fa-fighter-jet" style="color:var(--color-gold); font-size: 0.9em; transform: rotate(-45deg);"></i> ${tripName}</h3>
            <p><i class="fa-regular fa-calendar"></i> Travel Date: <strong style="color:var(--color-black)">${date}</strong></p>
            <p><i class="fa-solid fa-user-group"></i> Travelers: ${b.numberOfPeople} Person(s)</p>
            <span class="booking-status"><i class="fa-solid fa-circle-check"></i> Confirmed</span>
          </div>
          <div class="booking-price">
            <p style="color:var(--color-text-secondary); font-size: 0.85rem; margin-bottom: 2px;">Total Paid</p>
            <div class="amount">₹${b.totalCost.toLocaleString()}</div>
            ${b.tripId && b.tripId._id ? `<a href="/details.html?id=${b.tripId._id}" style="font-size: 0.85rem; color:var(--color-sage); font-weight: 500; display:block; margin-top:5px;">View Trip Details</a>` : ''}
          </div>
        </div>
      `;
    });
    
    bookingsList.innerHTML = html;
  }
  
  async function fetchSavedTrips() {
    try {
      const res = await api.fetchWithAuth('/saved-trips');
      
      if (res.success) {
        renderSavedTrips(res.savedTrips);
        savedCount.textContent = res.savedTrips.length;
      }
    } catch (err) {
      console.error(err);
      savedGrid.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <h3>Error Loading Trips</h3>
          <p>${err.message}</p>
        </div>
      `;
    }
  }
  
  function renderSavedTrips(savedTrips) {
    if (!savedTrips || savedTrips.length === 0) {
      savedGrid.innerHTML = `
        <div class="empty-state">
          <i class="fa-regular fa-compass"></i>
          <h3>No Saved Trips Yet</h3>
          <p>Explore our curated destinations and save your favorites to view them here.</p>
          <a href="/recommendations.html" class="btn btn-primary" style="margin-top: 15px;">Explore Destinations</a>
        </div>
      `;
      return;
    }
    
    savedGrid.innerHTML = '';
    
    savedTrips.forEach((item, index) => {
      const trip = item.tripId; // Populated from backend
      
      const card = document.createElement('div');
      card.className = 'trip-card';
      card.style.animation = `fadeUp 0.5s ease-out ${index * 0.1}s forwards`;
      card.style.opacity = '0';
      
      card.innerHTML = `
        <div class="card-img-wrapper">
          <img src="${trip.image}" alt="${trip.name}" class="card-img">
          <div class="dashboard-actions">
            <!--<button class="action-btn btn-fav ${item.isFavorite ? 'active' : ''}" data-id="${item._id}" title="Toggle Favorite">
              <i class="fa-solid fa-star"></i>
            </button>-->
            <button class="action-btn btn-delete" data-id="${item._id}" title="Remove Trip">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="card-content">
          <h3 class="card-title">${trip.name}</h3>
          <p style="color:var(--color-sage); font-size:0.85rem; margin-bottom: 10px;"><i class="fa-solid fa-location-dot"></i> ${trip.state} • ${trip.numberOfDays} Days</p>
          <div style="display:flex; justify-content:space-between; align-items:flex-end;">
            <div class="card-price">₹${trip.estimatedCost.toLocaleString()}</div>
            <a href="/details.html?id=${trip._id}" style="font-size:0.9rem; font-weight:600; color:var(--color-gold);">View Details <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
      `;
      
      savedGrid.appendChild(card);
    });
    
    // Attach delete listeners
    attachDeleteListeners();
  }
  
  function attachDeleteListeners() {
    const deleteBtns = document.querySelectorAll('.btn-delete');
    
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const savedTripId = btn.getAttribute('data-id');
        
        // Optimistic UI Removal
        const card = btn.closest('.trip-card');
        card.style.opacity = '0.5';
        card.style.transform = 'scale(0.95)';
        
        try {
          await api.fetchWithAuth(`/saved-trips/${savedTripId}`, {
            method: 'DELETE'
          });
          
          card.remove();
          
          // Update count visually
          const currentCount = parseInt(savedCount.textContent);
          savedCount.textContent = Math.max(0, currentCount - 1);
          
          if (savedGrid.children.length === 0) {
             renderSavedTrips([]);
          }
          
        } catch (err) {
          alert('Failed to delete trip.');
          card.style.opacity = '1';
          card.style.transform = 'none';
        }
      });
    });
  }
  
  function loadRecentTrips() {
    let recent = [];
    try {
      recent = JSON.parse(localStorage.getItem('recentTrips') || '[]');
    } catch(e) {}
    
    if (recent.length === 0) {
      recentList.innerHTML = `<p style="color:var(--color-text-secondary); width:100%; text-align:center; padding: 20px 0;">You haven't viewed any trips yet.</p>`;
      return;
    }
    
    let html = '';
    recent.forEach(trip => {
      html += `
        <a href="/details.html?id=${trip._id}" class="recent-item">
          <img src="${trip.image}" alt="${trip.name}" class="recent-img">
          <div class="recent-content">
            <h4 class="recent-title">${trip.name}</h4>
            <div style="font-size: 0.85rem; color: var(--color-sage);"><i class="fa-solid fa-location-dot"></i> ${trip.state}</div>
          </div>
        </a>
      `;
    });
    
    recentList.innerHTML = html;
  }
});
