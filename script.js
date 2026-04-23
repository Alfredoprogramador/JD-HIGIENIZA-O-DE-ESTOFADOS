/* ============================================
   JD HIGIENIZAÇÃO — SCRIPT.JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAVBAR SCROLL ---- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- MOBILE MENU ---- */
  const menuToggle = document.getElementById('menuToggle');
  menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('nav-open');
    document.body.style.overflow = navbar.classList.contains('nav-open') ? 'hidden' : '';
  });

  // Close menu on nav link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('nav-open');
      document.body.style.overflow = '';
    });
  });

  /* ---- SCROLL-TRIGGERED ANIMATIONS ---- */
  const aosElements = document.querySelectorAll('[data-aos]');
  const delays = { '0': 0, '100': 100, '200': 200, '300': 300, '400': 400 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.aosDelay || '0', 10);
        setTimeout(() => {
          el.classList.add('aos-animate');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  aosElements.forEach(el => observer.observe(el));

  /* ---- SMOOTH SCROLL FOR ANCHOR LINKS ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- COUNTER ANIMATION FOR STATS ---- */
  const statNums = document.querySelectorAll('.stat-num');

  const animateCounter = (el) => {
    const text = el.textContent.trim();
    const num = parseInt(text.replace(/\D/g, ''), 10);
    if (isNaN(num)) return;
    const suffix = text.replace(/[\d,]/g, '');
    const duration = 1800;
    const step = duration / num;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + Math.ceil(num / 60), num);
      el.textContent = current + suffix;
      if (current >= num) clearInterval(timer);
    }, step > 16 ? step : 16);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));

  /* ---- GALLERY LIGHTBOX (simple) ---- */
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;

      const overlay = document.createElement('div');
      overlay.classList.add('lightbox-overlay');

      const image = document.createElement('img');
      image.src = img.src;
      image.alt = img.alt;

      overlay.appendChild(image);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      overlay.addEventListener('click', () => {
        overlay.remove();
        document.body.style.overflow = '';
      });
    });
  });

  /* ---- PARALLAX HERO LEAVES ---- */
  const leaves = document.querySelectorAll('.hero-leaf');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    leaves.forEach((leaf, i) => {
      const speed = i === 0 ? 0.15 : 0.08;
      leaf.style.transform = `translateY(${scrolled * speed}px) rotate(${i === 0 ? 15 : -20}deg)`;
    });
  }, { passive: true });

});
