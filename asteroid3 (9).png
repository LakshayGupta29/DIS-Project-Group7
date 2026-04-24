// ── Sticky nav on scroll ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Hamburger menu ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
// close on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Scroll reveal ──
const revealEls = document.querySelectorAll(
  '.card, .feature-item, .team-card, .section-title, .section-sub, .section-label, .video-wrapper'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings slightly
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

// ── Contact form ──
function handleSubmit(e) {
  e.preventDefault();
  const toast = document.getElementById('toast');
  toast.style.display = 'block';
  e.target.reset();
  setTimeout(() => { toast.style.display = 'none'; }, 4000);
}

// ── Active nav link highlight on scroll ──
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--text)' : '';
  });
}, { passive: true });
