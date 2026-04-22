/* ============================================================
   JD Higienização de Estofados – Main JavaScript
   ============================================================ */

'use strict';

// ── Utilities ──────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ── Sticky Header ──────────────────────────────────────────
(function initHeader() {
  const header = $('#header');
  if (!header) return;

  const toggle = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', toggle, { passive: true });
  toggle(); // run on load
})();

// ── Mobile Navigation ──────────────────────────────────────
(function initMobileNav() {
  const toggle   = $('#navToggle');
  const navLinks = $('#navLinks');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on link click
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      toggle.classList.remove('open');
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

// ── Active Nav Link on Scroll ──────────────────────────────
(function initActiveLinks() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(sec => observer.observe(sec));
})();

// ── Gallery Filter Tabs ────────────────────────────────────
(function initGalleryFilter() {
  const tabBtns   = $$('.tab-btn');
  const galleryItems = $$('.gallery-item');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active tab
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.style.display = match ? '' : 'none';
        // Reset wide layout when filtering
        if (match && filter !== 'all') {
          item.classList.remove('gallery-item--wide');
        } else if (filter === 'all') {
          // Restore original wide state (first sofa item)
          const idx = galleryItems.indexOf(item);
          if (idx === 1) item.classList.add('gallery-item--wide');
        }
      });
    });
  });
})();

// ── Gallery Lightbox ──────────────────────────────────────
(function initLightbox() {
  const lightbox  = $('#lightbox');
  const lbImg     = $('#lightboxImg');
  const lbCaption = $('#lightboxCaption');
  const lbClose   = $('#lightboxClose');
  if (!lightbox) return;

  function openLightbox(img, caption) {
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = caption;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    // Delay clearing src so fade-out looks clean
    setTimeout(() => { lbImg.src = ''; }, 350);
  }

  $$('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img   = item.querySelector('img');
      const title = item.querySelector('.gallery-overlay span')?.textContent || '';
      const desc  = item.querySelector('.gallery-overlay p')?.textContent || '';
      openLightbox(img, `${title} — ${desc}`);
    });
  });

  lbClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
})();

// ── Schedule Form ─────────────────────────────────────────
(function initScheduleForm() {
  const form       = $('#scheduleForm');
  const successMsg = $('#formSuccess');
  if (!form) return;

  const COMPANY_EMAIL = 'contato@jdhigienizacao.com.br';

  // Set minimum date for calendar to today
  const dateInput = $('#preferredDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Validators
  const validators = {
    name:    v => v.trim().length >= 2        ? '' : 'Por favor, informe seu nome completo.',
    phone:   v => /^[\d\s()+-]{8,}$/.test(v.trim()) ? '' : 'Informe um telefone válido.',
    email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Informe um e-mail válido.',
    service: v => v !== ''                    ? '' : 'Selecione o serviço desejado.',
    address: v => v.trim().length >= 5        ? '' : 'Por favor, informe o endereço/bairro.',
  };

  function validateField(id) {
    const input = $(`#${id}`);
    const error = $(`#${id}Error`);
    if (!input || !validators[id]) return true;

    const msg = validators[id](input.value);
    if (error) error.textContent = msg;
    input.classList.toggle('error', !!msg);
    return msg === '';
  }

  // Live validation
  Object.keys(validators).forEach(id => {
    const el = $(`#${id}`);
    if (el) el.addEventListener('blur', () => validateField(id));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Validate all fields
    const valid = Object.keys(validators).every(id => validateField(id));
    if (!valid) return;

    const name    = $('#name').value.trim();
    const phone   = $('#phone').value.trim();
    const email   = $('#email').value.trim();
    const service = $('#service').value;
    const date    = $('#preferredDate').value;
    const address = $('#address').value.trim();
    const message = $('#message').value.trim();

    const dateStr = date
      ? new Date(date + 'T12:00:00').toLocaleDateString('pt-BR')
      : 'A combinar';

    const body = [
      'Olá! Gostaria de agendar um serviço de higienização.',
      '',
      `Nome: ${name}`,
      `Telefone/WhatsApp: ${phone}`,
      `E-mail do cliente: ${email}`,
      `Serviço solicitado: ${service}`,
      `Data preferida: ${dateStr}`,
      `Endereço/Bairro: ${address}`,
      message ? `Observações: ${message}` : '',
    ].filter(l => l !== '').join('\n');

    const subject = encodeURIComponent(`Solicitação de Agendamento – ${service} – ${name}`);
    const bodyEnc = encodeURIComponent(body);
    const mailto  = `mailto:${COMPANY_EMAIL}?subject=${subject}&body=${bodyEnc}`;

    // Open email client
    window.location.href = mailto;

    // Show success state after short delay
    setTimeout(() => {
      form.style.display = 'none';
      successMsg.style.display = 'block';
    }, 400);
  });
  // Wire up reset button via event listener (no inline onclick)
  const resetBtn = $('#resetFormBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = '';
      successMsg.style.display = 'none';
      $$('.field-error').forEach(el => { el.textContent = ''; });
      $$('.error').forEach(el => el.classList.remove('error'));
    });
  }
})();

// ── Footer Year ───────────────────────────────────────────
(function initFooterYear() {
  const el = $('#footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();

// ── Smooth scroll for anchor links (fallback) ─────────────
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = $(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 70; // header height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ── Scroll-reveal (lightweight AOS-like) ─────────────────
(function initScrollReveal() {
  const cards = $$('[data-aos]');
  if (!cards.length) return;

  // Add base styles
  cards.forEach(card => {
    card.style.opacity  = '0';
    card.style.transform = 'translateY(28px)';
    card.style.transition = 'opacity .55s ease, transform .55s ease';
    const delay = card.dataset.aosDelay;
    if (delay) card.style.transitionDelay = `${delay}ms`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'none';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  cards.forEach(card => observer.observe(card));
})();
