/* Hirecise — main.js */

// Scroll-triggered fade-up animations
const fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length) {
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => fadeObserver.observe(el));
}

// Nav shadow on scroll
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });
}

// Mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navMobile = document.querySelector('.nav-mobile');
if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => {
    const open = navMobile.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      navMobile.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Active nav link highlighting
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === page || (page === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.classList.contains('open');
    document.querySelectorAll('.faq-q').forEach(b => {
      b.classList.remove('open');
      b.nextElementSibling?.classList.remove('open');
    });
    if (!isOpen) {
      btn.classList.add('open');
      btn.nextElementSibling?.classList.add('open');
    }
  });
});

// Pricing toggle (monthly ↔ annual)
const toggleBtn    = document.querySelector('.toggle-btn');
const monthlyEls   = document.querySelectorAll('.price-monthly');
const annualEls    = document.querySelectorAll('.price-annual');
const periodLabels = document.querySelectorAll('.price-period-label');

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const annual = toggleBtn.classList.toggle('active');
    monthlyEls.forEach(el => el.style.display = annual ? 'none' : 'flex');
    annualEls.forEach(el  => el.style.display = annual ? 'flex' : 'none');
    periodLabels.forEach(el => {
      el.textContent = annual ? '/mo, billed annually' : '/mo';
    });
  });
}

// Contact form — simulated submit
const contactForm = document.getElementById('contactForm');
const formSuccess = document.querySelector('.form-success');
if (contactForm && formSuccess) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      contactForm.style.display = 'none';
      formSuccess.classList.add('show');
    }, 900);
  });
}

// Smooth count-up for stats (fires when section enters viewport)
const statEls = document.querySelectorAll('.stat-value[data-target]');
if (statEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dur    = 1200;
      const start  = performance.now();
      const isFloat = String(target).includes('.');
      const update = (now) => {
        const t = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        const val = target * ease;
        el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
        if (t < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: .4 });
  statEls.forEach(el => observer.observe(el));
}
