// ============================================
// Auth Page Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, redirect to dashboard or intended page
  if (api.isLoggedIn()) {
    redirectUser();
    return;
  }
  
  // Tab Switching
  const tabLogin = document.getElementById('tabLogin');
  const tabSignup = document.getElementById('tabSignup');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  
  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
  });
  
  tabSignup.addEventListener('click', () => {
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
  });
  
  // Submit Handlers
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    const btn = document.getElementById('loginSubmitBtn');
    
    errorEl.style.display = 'none';
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing In...';
    
    try {
      const data = await api.fetchWithAuth('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      // Save token and user
      api.setAuth(data.token, data.user);
      
      // Redirect
      redirectUser();
      
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.style.display = 'block';
      btn.disabled = false;
      btn.innerHTML = 'Sign In';
    }
  });
  
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const errorEl = document.getElementById('signupError');
    const btn = document.getElementById('signupSubmitBtn');
    
    errorEl.style.display = 'none';
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...';
    
    try {
      const data = await api.fetchWithAuth('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      // Save token and user
      api.setAuth(data.token, data.user);
      
      // Redirect
      redirectUser();
      
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.style.display = 'block';
      btn.disabled = false;
      btn.innerHTML = 'Create Account';
    }
  });
  
  function redirectUser() {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect');
    window.location.href = redirectUrl ? redirectUrl : './dashboard.html';
  }
});
