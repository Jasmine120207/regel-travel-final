// ============================================
// Animated Travel Sky Background
// Shared across all pages for consistent look
// ============================================

(function() {
  // Don't add if already present (e.g. auth page has its own)
  if (document.querySelector('.sky-bg')) return;

  // Create the sky background container
  const skyHTML = `
    <div class="sky-bg">
      <div class="stars" id="starsContainer"></div>
      <div class="cloud cloud-1"><div class="cloud-body"></div></div>
      <div class="cloud cloud-2"><div class="cloud-body"></div></div>
      <div class="cloud cloud-3"><div class="cloud-body"></div></div>
      <div class="airplane airplane-1"><i class="fa-solid fa-plane"></i></div>
      <div class="airplane airplane-2"><i class="fa-solid fa-plane"></i></div>
      <div class="balloon balloon-1"><div class="balloon-body"><div class="balloon-strings"></div></div></div>
      <div class="balloon balloon-2"><div class="balloon-body"><div class="balloon-strings"></div></div></div>
      <div class="balloon balloon-3"><div class="balloon-body"><div class="balloon-strings"></div></div></div>
      <div class="compass"></div>
      <div class="pin pin-1"><i class="fa-solid fa-location-dot"></i></div>
      <div class="pin pin-2"><i class="fa-solid fa-location-dot"></i></div>
      <div class="pin pin-3"><i class="fa-solid fa-location-dot"></i></div>
      <div class="pin pin-4"><i class="fa-solid fa-location-dot"></i></div>
      <div class="world-path">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path class="path-line" d="M0 80 Q150 20 300 60 T600 40 T900 70 T1200 30" />
          <circle class="path-dot" cx="300" cy="60" r="5" />
          <circle class="path-dot" cx="600" cy="40" r="5" style="animation-delay: -0.5s;" />
          <circle class="path-dot" cx="900" cy="70" r="5" style="animation-delay: -1s;" />
        </svg>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('afterbegin', skyHTML);

  // Generate stars
  const container = document.getElementById('starsContainer');
  if (container) {
    for (let i = 0; i < 80; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = (Math.random() * 3) + 's';
      star.style.animationDuration = (1.5 + Math.random() * 2) + 's';
      star.style.width = star.style.height = (2 + Math.random() * 2) + 'px';
      container.appendChild(star);
    }
  }
})();
