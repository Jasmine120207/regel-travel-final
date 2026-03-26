// ============================================
// Details Page Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tripId = urlParams.get('id');
  
  const loader = document.getElementById('pageLoader');
  const contentContainer = document.getElementById('detailsContent');
  
  if (!tripId) {
    window.location.href = '/recommendations.html';
    return;
  }
  
  let tripData = null;
  let isSaved = false;
  
  init();
  
  async function init() {
    try {
      // Fetch trip details
      const tripRes = await api.fetchWithAuth(`/trips/${tripId}`);
      
      if (!tripRes.success) throw new Error('Trip not found');
      tripData = tripRes.trip;
      
      // Save to recently viewed (localStorage)
      saveToRecentlyViewed(tripData);
      
      // Check if saved
      if (api.isLoggedIn()) {
        try {
          const savedRes = await api.fetchWithAuth('/saved-trips');
          if (savedRes.success) {
            isSaved = savedRes.savedTrips.some(saved => 
              (saved.tripId._id || saved.tripId) === tripId
            );
          }
        } catch(e) { console.error('Error fetching saved status') }
      }
      
      // Render Content
      renderPage();
      
      // Fetch Weather asymptotically
      fetchWeather();
      
      // Hide loader
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
      }, 500);
      
      // Attach listeners
      attachActionListeners();
      
    } catch (err) {
      console.error(err);
      alert('Error loading trip details.');
      window.location.href = '/recommendations.html';
    }
  }
  
  function renderPage() {
    const { 
      name, state, image, description, estimatedCost, 
      numberOfDays, placesToVisit, itinerary, budgetBreakdown 
    } = tripData;
    
    // Calculate total for percentages
    const totalBudget = budgetBreakdown.stay + budgetBreakdown.food + 
                        budgetBreakdown.travel + budgetBreakdown.activities + 
                        budgetBreakdown.miscellaneous;
    
    const getPct = (val) => `${(val / totalBudget * 100).toFixed(1)}%`;
    
    const html = `
      <header class="details-hero">
        <img src="${image}" alt="${name}" class="hero-img">
        <div class="container" style="position: relative; z-index: 2;">
          <h1 class="trip-title">${name}</h1>
          <div class="trip-meta">
            <span><i class="fa-solid fa-location-dot"></i> ${state}</span>
            <span><i class="fa-regular fa-clock"></i> ${numberOfDays} Days</span>
            <span><i class="fa-solid fa-money-bill-wave"></i> ₹${estimatedCost.toLocaleString()} Estim.</span>
          </div>
        </div>
      </header>

      <div class="container">
        <div class="content-grid">
          
          <!-- LEFT COLUMN -->
          <div class="main-content">
            <div class="section-block fade-up">
              <h2 class="section-title-sm"><i class="fa-solid fa-book-open" style="color:var(--color-gold)"></i> About The Journey</h2>
              <p style="font-size: 1.1rem; line-height: 1.8; color: var(--color-text-secondary);">${description}</p>
            </div>
            
            <div class="section-block fade-up delay-1">
              <h2 class="section-title-sm"><i class="fa-solid fa-map-location-dot" style="color:var(--color-gold)"></i> Must-Visit Places</h2>
              <div class="places-grid">
                ${placesToVisit.map(place => `
                  <div class="place-card">
                    <h4>${place.name}</h4>
                    <p>${place.description}</p>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="section-block fade-up delay-2">
              <h2 class="section-title-sm"><i class="fa-solid fa-calendar-days" style="color:var(--color-gold)"></i> Suggested Itinerary</h2>
              <div class="timeline">
                ${itinerary.map(day => `
                  <div class="timeline-item">
                    <span class="day-badge">Day ${day.day}</span>
                    <h3 class="day-title">${day.title}</h3>
                    <ul class="activities-list">
                      ${day.activities.map(act => `<li>${act}</li>`).join('')}
                    </ul>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          
          <!-- RIGHT COLUMN -->
          <aside class="sidebar fade-up">
            
            <div class="sidebar-widget">
              <div class="price-lg">₹${estimatedCost.toLocaleString()} <span class="price-text">estimated total</span></div>
              
              <h3 style="font-family:var(--font-sans); margin-bottom: 20px; font-size: 1.1rem;">Budget Breakdown</h3>
              
              <div class="budget-item">
                <div class="budget-label"><span>Stay (Hotels)</span> <span>₹${budgetBreakdown.stay.toLocaleString()}</span></div>
                <div class="budget-bar-bg"><div class="budget-bar-fill fill-stay" style="width: ${getPct(budgetBreakdown.stay)}"></div></div>
              </div>
              
              <div class="budget-item">
                <div class="budget-label"><span>Travel (Transfers/Flights)</span> <span>₹${budgetBreakdown.travel.toLocaleString()}</span></div>
                <div class="budget-bar-bg"><div class="budget-bar-fill fill-travel" style="width: ${getPct(budgetBreakdown.travel)}"></div></div>
              </div>
              
              <div class="budget-item">
                <div class="budget-label"><span>Food & Dining</span> <span>₹${budgetBreakdown.food.toLocaleString()}</span></div>
                <div class="budget-bar-bg"><div class="budget-bar-fill fill-food" style="width: ${getPct(budgetBreakdown.food)}"></div></div>
              </div>
              
              <div class="budget-item">
                <div class="budget-label"><span>Activities & Tickets</span> <span>₹${budgetBreakdown.activities.toLocaleString()}</span></div>
                <div class="budget-bar-bg"><div class="budget-bar-fill fill-activities" style="width: ${getPct(budgetBreakdown.activities)}"></div></div>
              </div>
              
              <div class="budget-item">
                <div class="budget-label"><span>Miscellaneous</span> <span>₹${budgetBreakdown.miscellaneous.toLocaleString()}</span></div>
                <div class="budget-bar-bg"><div class="budget-bar-fill fill-misc" style="width: ${getPct(budgetBreakdown.miscellaneous)}"></div></div>
              </div>
              
              <div class="action-buttons">
                <button id="bookNowBtn" class="btn btn-primary" style="width: 100%; margin-bottom: 10px;">
                  <i class="fa-regular fa-calendar-check"></i> Book Now
                </button>
                <button id="saveTripBtn" class="btn ${isSaved ? 'btn-secondary' : 'btn-outline'}" style="width: 100%; background: transparent; border: 1px solid var(--color-border); color: var(--color-text-primary);">
                  <i class="fa-${isSaved ? 'solid' : 'regular'} fa-heart" style="color:var(--color-burgundy)"></i> 
                  ${isSaved ? 'Saved to Dashboard' : 'Save This Trip'}
                </button>
                <a href="/recommendations.html" class="btn btn-secondary" style="width: 100%;"><i class="fa-solid fa-arrow-left"></i> Back to Catalog</a>
              </div>
            </div>
            
            <!-- Weather Widget Container -->
            <div class="sidebar-widget" id="weatherWidgetContainer">
              <h3 style="font-family:var(--font-sans); font-size: 1.1rem; border-bottom: 1px solid var(--color-border); padding-bottom: 15px; margin-bottom: 15px;">Local Weather Forecast</h3>
              <div style="text-align:center; color: var(--color-text-secondary);"><i class="fa-solid fa-spinner fa-spin"></i> Fetching weather data...</div>
            </div>
            
          </aside>
          
        </div>
      </div>
    `;
    
    contentContainer.innerHTML = html;
  }
  
  async function fetchWeather() {
    try {
      const res = await api.fetchWithAuth(`/trips/${tripId}/weather`);
      const container = document.getElementById('weatherWidgetContainer');
      
      if (res.success && container) {
        const w = res.weather;
        // Map OpenWeather icon to FontAwesome (simplified mapping)
        let iconClass = 'fa-sun';
        if (w.icon.includes('02') || w.icon.includes('03') || w.icon.includes('04')) iconClass = 'fa-cloud';
        if (w.icon.includes('09') || w.icon.includes('10')) iconClass = 'fa-cloud-rain';
        if (w.icon.includes('11')) iconClass = 'fa-bolt';
        if (w.icon.includes('13')) iconClass = 'fa-snowflake';
        
        container.innerHTML = `
          <h3 style="font-family:var(--font-sans); font-size: 1.1rem; border-bottom: 1px solid var(--color-border); padding-bottom: 15px; margin-bottom: 15px;">Local Weather Forecast</h3>
          <div class="weather-widget">
            <i class="fa-solid ${iconClass}" style="font-size: 3.5rem; color: var(--color-gold); margin-bottom: 10px;"></i>
            <div class="weather-temp">${w.temp}°C</div>
            <div class="weather-desc">${w.description}</div>
            
            <div class="weather-details">
              <div><i class="fa-solid fa-droplet" style="color:var(--color-sage)"></i> ${w.humidity}%</div>
              <div><i class="fa-solid fa-wind" style="color:var(--color-sage)"></i> ${w.windSpeed}m/s</div>
            </div>
          </div>
        `;
      }
    } catch (err) {
      console.log('Weather fetch failed', err);
    }
  }
  
  function attachActionListeners() {
    const saveBtn = document.getElementById('saveTripBtn');
    const bookBtn = document.getElementById('bookNowBtn');
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const bookingForm = document.getElementById('bookingForm');
    const peopleInput = document.getElementById('bookPeople');
    const summaryPrice = document.getElementById('summaryPrice');
    const summaryTotal = document.getElementById('summaryTotal');
    const paymentTotal = document.getElementById('paymentTotal');
    
    // Payment UI Elements
    const step1 = document.getElementById('bookingStep1');
    const step2 = document.getElementById('bookingStep2');
    const proceedBtn = document.getElementById('proceedPaymentBtn');
    const backBtn = document.getElementById('backToDetailsBtn');
    const confirmBtn = document.getElementById('confirmBookingBtn');
    
    // Setup Modal Initial Values
    if (tripData) {
      summaryPrice.textContent = `₹${tripData.estimatedCost.toLocaleString()}`;
      summaryTotal.textContent = `₹${tripData.estimatedCost.toLocaleString()}`;
      if (paymentTotal) paymentTotal.textContent = `₹${tripData.estimatedCost.toLocaleString()}`;
    }

    // Book Now Button - Open Modal
    if (bookBtn) {
      bookBtn.addEventListener('click', () => {
        if (!api.isLoggedIn()) {
          window.location.href = `/auth.html?redirect=/details.html?id=${tripId}`;
          return;
        }
        
        // Pre-fill name if available
        try {
          const user = JSON.parse(localStorage.getItem('user'));
          if (user && user.name) {
            document.getElementById('bookName').value = user.name;
          }
        } catch(e) {}
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
      });
    }

    // Modal Close
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        // Reset to step 1
        setTimeout(() => {
          if (step1) step1.style.display = 'block';
          if (step2) step2.style.display = 'none';
        }, 300);
      });
    }
    
    // Close modal on outside click
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = 'auto';
          // Reset to step 1
          setTimeout(() => {
            if (step1) step1.style.display = 'block';
            if (step2) step2.style.display = 'none';
          }, 300);
        }
      });
    }

    // Live Price Calculation
    if (peopleInput) {
      peopleInput.addEventListener('input', () => {
        const count = parseInt(peopleInput.value) || 1;
        const total = tripData.estimatedCost * count;
        summaryTotal.textContent = `₹${total.toLocaleString()}`;
        if (paymentTotal) paymentTotal.textContent = `₹${total.toLocaleString()}`;
      });
    }

    // PROCEED TO PAYMENT
    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => {
        // Quick validation for step 1
        const name = document.getElementById('bookName');
        const date = document.getElementById('bookDate');
        if (!name.value || !date.value) {
          alert('Please fill out your Name and Travel Date first.');
          return;
        }
        // Switch view
        step1.style.display = 'none';
        step2.style.display = 'block';
      });
    }
    
    // BACK TO DETAILS
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        step2.style.display = 'none';
        step1.style.display = 'block';
      });
    }

    // Booking Form Submit
    if (bookingForm) {
      bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('bookName').value;
        const travelDate = document.getElementById('bookDate').value;
        const numberOfPeople = parseInt(peopleInput.value) || 1;
        const totalCost = tripData.estimatedCost * numberOfPeople;
        
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        
        try {
          const res = await api.fetchWithAuth('/bookings', {
            method: 'POST',
            body: JSON.stringify({
              tripId,
              name,
              travelDate,
              numberOfPeople,
              totalCost
            })
          });
          
          if (res.success) {
            // Give a fake processing delay for payment feel
            setTimeout(() => {
              alert('Payment Processed & Booking Successful! View it in your Dashboard.');
              modal.classList.remove('active');
              document.body.style.overflow = 'auto';
              
              // Reset views
              setTimeout(() => {
                step1.style.display = 'block';
                step2.style.display = 'none';
                bookingForm.reset();
                const total = tripData.estimatedCost;
                summaryTotal.textContent = `₹${total.toLocaleString()}`;
                if (paymentTotal) paymentTotal.textContent = `₹${total.toLocaleString()}`;
              }, 300);
            }, 800);
          } else {
            throw new Error(res.message);
          }
        } catch (err) {
          alert(err.message || 'Error processing booking');
        } finally {
          confirmBtn.disabled = false;
          confirmBtn.innerHTML = 'Confirm Booking';
        }
      });
    }

    if (!saveBtn) return;
    
    saveBtn.addEventListener('click', async () => {
      // (Saved trip logic remains exactly the same)
      if (!api.isLoggedIn()) {
        window.location.href = `/auth.html?redirect=/details.html?id=${tripId}`;
        return;
      }
      
      try {
        if (isSaved) {
          alert('This trip is already in your dashboard. You can remove it from there.');
          return;
        }
                
        // Save
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
        
        await api.fetchWithAuth('/saved-trips', {
          method: 'POST',
          body: JSON.stringify({ tripId })
        });
        
        isSaved = true;
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fa-solid fa-heart" style="color:var(--color-burgundy)"></i> Saved to Dashboard';
        
      } catch (err) {
        saveBtn.disabled = false;
        alert(err.message || 'Error saving trip');
      }
    });
  }
  
  function saveToRecentlyViewed(trip) {
    try {
      let recent = JSON.parse(localStorage.getItem('recentTrips') || '[]');
      // Remove if exists
      recent = recent.filter(t => t._id !== trip._id);
      // Add to front
      recent.unshift({
        _id: trip._id,
        name: trip.name,
        image: trip.image,
        state: trip.state,
        estimatedCost: trip.estimatedCost,
        budgetTier: trip.budgetTier
      });
      // Keep only 4
      if (recent.length > 4) recent = recent.slice(0, 4);
      localStorage.setItem('recentTrips', JSON.stringify(recent));
    } catch(e) {}
  }
});
