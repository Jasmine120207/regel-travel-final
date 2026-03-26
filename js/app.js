// ============================================
// Landing Page Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Redirect to login if user is not authenticated
  if (typeof api !== 'undefined' && !api.isLoggedIn()) {
    window.location.href="./auth.html';
    return;
  }
  
  const budgetForm = document.getElementById('budgetForm');
  const budgetInput = document.getElementById('budgetInput');
  
  if (budgetForm && budgetInput) {
    budgetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const budget = budgetInput.value.trim();
      
      if (budget && !isNaN(budget) && Number(budget) > 0) {
        // Redirect to recommendations page with budget query param
        window.location.href = `./recommendations.html?budget=${budget}`;
      }
    });
  }
  
  // Animation observer for fade-up elements
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Unobserve after animating once
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Only target elements outside hero (hero elements animate on load)
  document.querySelectorAll('.features .fade-up').forEach(el => {
    observer.observe(el);
  });
});
