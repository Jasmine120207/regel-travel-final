// ============================================
// API Utility
// ============================================

const API_URL = '/api';

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
    window.location.href = '/';
  },
  
  // Check if logged in
  isLoggedIn() {
    return !!this.getToken();
  },
  
  // Custom fetch with auth header
  async fetchWithAuth(endpoint, options = {}) {
    const token = this.getToken();
    
    const defaultHeaders = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    };
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
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
