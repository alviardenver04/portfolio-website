/* ============================
   LOADER
   ============================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1200);
});

/* ============================
   CUSTOM CURSOR
   ============================ */
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';

  // Smooth trail
  requestAnimationFrame(() => {
    trailX += (e.clientX - trailX) * 0.15;
    trailY += (e.clientY - trailY) * 0.15;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top = trailY + 'px';
  });
});

// Enlarge on interactive elements
document.querySelectorAll('a, button, input, textarea, .pill, .social-link').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '18px';
    cursor.style.height = '18px';
    cursorTrail.style.width = '50px';
    cursorTrail.style.height = '50px';
    cursorTrail.style.opacity = '0.2';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '';
    cursor.style.height = '';
    cursorTrail.style.width = '';
    cursorTrail.style.height = '';
    cursorTrail.style.opacity = '';
  });
});

// Trail animation loop
function animateTrail() {
  requestAnimationFrame(animateTrail);
}
animateTrail();

/* ============================
   SCROLL PROGRESS BAR
   ============================ */
const progressBar = document.getElementById('progressBar');

window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const pct = (scrollTop / docHeight) * 100;
  progressBar.style.width = pct + '%';
});

/* ============================
   BACK TO TOP
   ============================ */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

/* ============================
   SMOOTH SCROLL
   ============================ */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ============================
   DARK / LIGHT THEME
   ============================ */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

// Check saved preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeIcon.textContent = savedTheme === 'dark' ? '○' : '◐';
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeIcon.textContent = next === 'dark' ? '○' : '◐';
});

/* ============================
   ACTIVE NAV LINKS ON SCROLL
   ============================ */
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));

/* ============================
   REVEAL ON SCROLL
   ============================ */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children inside same parent
      const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
      let delay = 0;
      siblings.forEach(sib => {
        if (sib === entry.target || entry.target.contains(sib)) {
          setTimeout(() => sib.classList.add('visible'), delay);
          delay += 80;
        }
      });
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

/* ============================
   ANIMATED COUNTER (ABOUT STATS)
   ============================ */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1500;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + '+';
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

/* ============================
   SKILL BAR ANIMATION
   ============================ */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        const w = bar.getAttribute('data-width');
        bar.style.width = w + '%';
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(el => barObserver.observe(el));

/* ============================
   CONTACT FORM VALIDATION
   ============================ */
const contactForm = document.getElementById('contactForm');

function showError(fieldId, errorId, message) {
  document.getElementById(fieldId).style.borderColor = 'var(--accent)';
  document.getElementById(errorId).textContent = message;
}

function clearError(fieldId, errorId) {
  document.getElementById(fieldId).style.borderColor = '';
  document.getElementById(errorId).textContent = '';
}

// Live validation
document.getElementById('name').addEventListener('input', function () {
  if (this.value.trim().length > 1) clearError('name', 'nameError');
});

document.getElementById('email').addEventListener('input', function () {
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRe.test(this.value)) clearError('email', 'emailError');
});

document.getElementById('message').addEventListener('input', function () {
  if (this.value.trim().length > 10) clearError('message', 'messageError');
});

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let valid = true;

  if (name.length < 2) {
    showError('name', 'nameError', 'Please enter your name.');
    valid = false;
  } else clearError('name', 'nameError');

  if (!emailRe.test(email)) {
    showError('email', 'emailError', 'Please enter a valid email address.');
    valid = false;
  } else clearError('email', 'emailError');

  if (message.length < 10) {
    showError('message', 'messageError', 'Please write a bit more (at least 10 characters).');
    valid = false;
  } else clearError('message', 'messageError');

  if (!valid) return;

  // Simulate send
  const btn = document.getElementById('submitBtn');
  btn.querySelector('.btn-text').style.display = 'none';
  btn.querySelector('.btn-sending').style.display = 'inline';
  btn.disabled = true;

  setTimeout(() => {
    btn.querySelector('.btn-sending').style.display = 'none';
    btn.querySelector('.btn-sent').style.display = 'inline';
    btn.style.background = '#16a34a';
    contactForm.reset();

    setTimeout(() => {
      btn.querySelector('.btn-sent').style.display = 'none';
      btn.querySelector('.btn-text').style.display = 'inline';
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }, 1800);
});

/* ============================
   DOWNLOAD CV
   ============================ */
function downloadCV() {
  // If you have a CV PDF, replace '#' with its path e.g. 'assets/Denver_Alviar_CV.pdf'
  const link = document.createElement('a');
  link.href = '#';
  link.download = 'Denver_Alviar_CV.pdf';
  link.click();
  // Show a toast instead if no file
  showToast('CV download will be available soon!');
}

/* ============================
   TOAST NOTIFICATION
   ============================ */
function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '5rem',
    left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    background: 'var(--text)',
    color: 'var(--bg)',
    padding: '0.75rem 1.5rem',
    borderRadius: '100px',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-body)',
    zIndex: '9999',
    opacity: '0',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    whiteSpace: 'nowrap',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  });

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/* ============================
   CURSOR TRAIL SMOOTH LOOP
   ============================ */
let mouseX = 0, mouseY = 0;
let tX = 0, tY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function loopTrail() {
  tX += (mouseX - tX) * 0.12;
  tY += (mouseY - tY) * 0.12;
  cursorTrail.style.left = tX + 'px';
  cursorTrail.style.top = tY + 'px';
  requestAnimationFrame(loopTrail);
}
loopTrail();