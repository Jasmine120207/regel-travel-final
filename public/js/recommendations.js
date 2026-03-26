// ============================================
// Recommendations Page Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // UI Elements
  const gridContainer = document.getElementById('destinationsGrid');
  const spinner = document.getElementById('loadingSpinner');
  const noResults = document.getElementById('noResults');
  const resultsCount = document.getElementById('resultsCount');
  
  // Filters
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  const activeBudgetBadge = document.getElementById('activeBudgetBadge');
  const budgetValueSpan = document.getElementById('budgetValue');
  const clearBudgetBtn = document.getElementById('clearBudgetBtn');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  
  // State
  let allTrips = [];
  let savedTripIds = new Set();
  
  // Initialize Page
  init();
  
  async function init() {
    // Check URL for budget parameter
    const urlParams = new URLSearchParams(window.location.search);
    const budgetParam = urlParams.get('budget');
    
    if (budgetParam) {
      budgetValueSpan.textContent = `₹${parseInt(budgetParam).toLocaleString()}`;
      activeBudgetBadge.classList.add('visible');
    }
    
    // Fetch user's saved trips first if logged in
    if (api.isLoggedIn()) {
      try {
        const savedRes = await api.fetchWithAuth('/saved-trips');
        if (savedRes.success) {
          savedRes.savedTrips.forEach(item => {
            savedTripIds.add(item.tripId._id);
          });
        }
      } catch (err) {
        console.error('Could not fetch saved trips', err);
      }
    }
    
    // Fetch trips
    await fetchTrips(budgetParam);
    
    // Event Listeners
    searchInput.addEventListener('input', debounce(applyFilters, 300));
    categoryFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);
    
    clearBudgetBtn.addEventListener('click', () => {
      // Remove query param and reload
      window.history.replaceState({}, document.title, window.location.pathname);
      activeBudgetBadge.classList.remove('visible');
      fetchTrips(null);
    });
    
    resetFiltersBtn.addEventListener('click', () => {
      searchInput.value = '';
      categoryFilter.value = 'all';
      sortFilter.value = 'price-asc';
      window.history.replaceState({}, document.title, window.location.pathname);
      activeBudgetBadge.classList.remove('visible');
      fetchTrips(null);
    });
  }
  
  async function fetchTrips(budgetParam) {
    showLoading(true);
    
    try {
      let url = '/trips/all';
      if (budgetParam) {
        url = `/trips?budget=${budgetParam}`;
      }
      
      const res = await api.fetchWithAuth(url);
      
      if (res.success) {
        allTrips = res.trips;
        applyFilters(); // Initial render with current filter states
      } else {
        showError();
      }
    } catch (err) {
      showError();
    } finally {
      showLoading(false);
    }
  }
  
  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const sort = sortFilter.value;
    
    // 1. Filter
    let filteredTrips = allTrips.filter(trip => {
      const matchSearch = trip.name.toLowerCase().includes(searchTerm) || 
                          trip.state.toLowerCase().includes(searchTerm);
      const matchCategory = category === 'all' || trip.category === category;
      return matchSearch && matchCategory;
    });
    
    // 2. Sort
    filteredTrips.sort((a, b) => {
      if (sort === 'price-asc') return a.estimatedCost - b.estimatedCost;
      if (sort === 'price-desc') return b.estimatedCost - a.estimatedCost;
      return 0;
    });
    
    // 3. Render
    renderTrips(filteredTrips);
  }
  
  function renderTrips(trips) {
    gridContainer.innerHTML = '';
    
    if (trips.length === 0) {
      noResults.style.display = 'block';
      resultsCount.textContent = '0 trips found';
      return;
    }
    
    noResults.style.display = 'none';
    resultsCount.textContent = `Showing ${trips.length} curated destination${trips.length > 1 ? 's' : ''}`;
    
    trips.forEach((trip, index) => {
      const isSaved = savedTripIds.has(trip._id);
      const heartClass = isSaved ? 'fa-solid active' : 'fa-regular';
      
      const card = document.createElement('div');
      card.className = 'trip-card';
      // Staggered animation delay
      card.style.transitionDelay = `${index * 0.05}s`;
      
      card.innerHTML = `
        <div class="card-img-wrapper">
          <img src="${trip.image}" alt="${trip.name}" class="card-img" loading="lazy">
          <span class="card-tier-badge">${trip.budgetTier}</span>
          <button class="card-fav-btn ${heartClass}" data-id="${trip._id}" title="${isSaved ? 'Saved' : 'Save trip'}">
            <i class="${heartClass} fa-heart"></i>
          </button>
        </div>
        <div class="card-content">
          <h3 class="card-title">${trip.name}</h3>
          <div class="card-location"><i class="fa-solid fa-location-dot"></i> ${trip.state}</div>
          <p class="card-desc">${trip.description.substring(0, 100)}...</p>
          <div class="card-footer">
            <div class="card-price">₹${trip.estimatedCost.toLocaleString()}</div>
            <div class="card-duration"><i class="fa-regular fa-clock"></i> ${trip.numberOfDays} Days</div>
          </div>
          <a href="/details.html?id=${trip._id}" class="btn btn-secondary" style="margin-top: 15px; width: 100%;">View Details</a>
        </div>
      `;
      
      gridContainer.appendChild(card);
      
      // Trigger entrance animation
      setTimeout(() => {
        card.classList.add('loaded');
      }, 50);
    });
    
    // Attach event listeners to favorite buttons
    attachFavoriteListeners();
  }
  
  function attachFavoriteListeners() {
    const favBtns = document.querySelectorAll('.card-fav-btn');
    
    favBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        if (!api.isLoggedIn()) {
          // Redirect to login if user clicks save
          window.location.href = `/auth.html?redirect=/recommendations.html${window.location.search}`;
          return;
        }
        
        const tripId = btn.getAttribute('data-id');
        const icon = btn.querySelector('i');
        const isCurrentlySaved = btn.classList.contains('active');
        
        try {
          // Optimistic UI update
          if (isCurrentlySaved) {
            btn.classList.remove('active');
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
            // Mock backend delete for now (wait for actual endpoint)
            savedTripIds.delete(tripId);
          } else {
            btn.classList.add('active');
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
            
            // Actual API Call to save
            await api.fetchWithAuth('/saved-trips', {
              method: 'POST',
              body: JSON.stringify({ tripId })
            });
            savedTripIds.add(tripId);
          }
        } catch (err) {
          // Revert UI on error
          console.error("Failed to toggle save", err);
          alert(err.message || 'Error saving trip');
          // Revert visual state...
        }
      });
    });
  }
  
  function showLoading(show) {
    spinner.style.display = show ? 'flex' : 'none';
    if (show) {
      gridContainer.innerHTML = '';
      noResults.style.display = 'none';
      resultsCount.textContent = 'Loading...';
    }
  }
  
  function showError() {
    gridContainer.innerHTML = '';
    noResults.style.display = 'block';
    noResults.querySelector('h2').textContent = 'Error Loading Trips';
    noResults.querySelector('p').textContent = 'Could not connect to the server. Please check your connection and try again.';
  }
  
  // Utility: Debounce function for search
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
});
