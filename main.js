/* ════════════════════════════════════════════════════════════
   PSOE ALGEMESÍ 2027 · main.js
   ════════════════════════════════════════════════════════════ */

'use strict';

/* ── Form Reference Number ──────────────────────────────── */
(function generateRef() {
  const el = document.getElementById('formRef');
  if (!el) return;
  const n = Math.floor(1000 + Math.random() * 9000);
  el.textContent = n;
})();

/* ── Scroll reveal ──────────────────────────────────────── */
const revealEls = document.querySelectorAll(
  '.clipping, .pilar, .dana-carousel, .denuncia__left, .form-dossier, .hemeroteca__cta-bar, .ce-phase, .placa-split__side, .projecte-estrella__header, .projecte-estrella__hero-img'
);
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('visible');
      revealObserver.unobserve(en.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── Back to top button ─────────────────────────────────── */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (backToTop) {
    backToTop.classList.toggle('visible', window.scrollY > 480);
  }
}, { passive: true });

/* ── Mobile burger menu ─────────────────────────────────── */
const burger = document.getElementById('navBurger');
const navLinks = document.querySelector('.nav__links');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

/* ── Sticky nav shadow on scroll ───────────────────────── */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('nav--scrolled', window.scrollY > 10);
}, { passive: true });

/* ── File upload drag-and-drop visual ──────────────────── */
const uploadZone = document.getElementById('uploadZone');
const uploadLabel = document.getElementById('uploadLabel');
const fotoInput = document.getElementById('foto');

if (uploadZone && fotoInput) {
  ['dragenter', 'dragover'].forEach(ev =>
    uploadZone.addEventListener(ev, (e) => {
      e.preventDefault();
      uploadZone.classList.add('drag-over');
    })
  );

  ['dragleave', 'drop'].forEach(ev =>
    uploadZone.addEventListener(ev, () => uploadZone.classList.remove('drag-over'))
  );

  fotoInput.addEventListener('change', () => {
    const file = fotoInput.files[0];
    if (file && uploadLabel) {
      uploadLabel.innerHTML = `
        <span class="form-upload__icon">ARXIU</span>
        <span class="form-upload__text"><strong>${file.name}</strong></span>
        <span class="form-upload__sub">${(file.size / 1024).toFixed(0)} KB · seleccionat</span>
      `;
    }
  });
}

/* ── Form validation & submission ───────────────────────── */
const form = document.getElementById('formDenuncia');
const success = document.getElementById('formSuccess');

function showError(id, show = true) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('visible', show);
}

function validateInput(input, errorId) {
  const valid = input.value.trim() !== '';
  showError(errorId, !valid);
  input.classList.toggle('is-invalid', !valid);
  return valid;
}

if (form) {
  const tipus = document.getElementById('tipus');
  const carrer = document.getElementById('carrer');
  const descripcio = document.getElementById('descripcio');
  const rgpd = document.getElementById('rgpd');

  // Live validation on blur
  tipus?.addEventListener('change', () => validateInput(tipus, 'tipus-error'));
  carrer?.addEventListener('blur', () => validateInput(carrer, 'carrer-error'));
  descripcio?.addEventListener('blur', () => validateInput(descripcio, 'descripcio-error'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const validTipus = validateInput(tipus, 'tipus-error');
    const validCarrer = validateInput(carrer, 'carrer-error');
    const validDesc = validateInput(descripcio, 'descripcio-error');

    let validRgpd = true;
    if (!rgpd.checked) {
      showError('rgpd-error', true);
      validRgpd = false;
    } else {
      showError('rgpd-error', false);
    }

    if (!validTipus || !validCarrer || !validDesc || !validRgpd) return;

    // Simulate submission
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.textContent = 'Enviant expedient...';

    setTimeout(() => {
      form.querySelectorAll('.form-input, .form-check').forEach(el => {
        el.value = '';
        el.checked = false;
        el.classList.remove('is-invalid');
      });
      // Reset upload label
      if (uploadLabel) {
        uploadLabel.innerHTML = `
          <span class="form-upload__icon">ARXIU</span>
          <span class="form-upload__text">Arrossega la foto, retall de premsa o document ací<br />o <u>fes clic per triar</u></span>
          <span class="form-upload__sub">JPG, PNG, PDF · Màx. 15 MB</span>
        `;
      }
      // Generate new ref
      const refEl = document.getElementById('formRef');
      if (refEl) refEl.textContent = Math.floor(1000 + Math.random() * 9000);

      btn.disabled = false;
      btn.textContent = 'Enviar cas confidencial';

      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => { success.hidden = true; }, 6000);
      }
    }, 1200);
  });
}

/* ── Smooth scroll for anchor CTAs ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

console.log('%cDOSSIER ALGEMESI 2027 · Proves i control public.', 'color: #cc1f26; font-weight: bold; font-size: 14px;');

/* ── Carousels ──────────────────────────────────────────── */
function initCarousel(trackId, dotsId, prevId, nextId) {
  const track = document.getElementById(trackId);
  const dotsContainer = document.getElementById(dotsId);
  const btnPrev = document.getElementById(prevId);
  const btnNext = document.getElementById(nextId);
  if (!track) return;

  const slides = track.querySelectorAll('.dana-carousel__slide');
  const total = slides.length;
  let current = 0;
  let autoTimer;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dana-carousel__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Foto ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.dana-carousel__dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 4500);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  btnPrev.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  btnNext.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  const stage = track.closest('.dana-carousel__stage');
  if (stage) {
    stage.addEventListener('mouseenter', stopAuto);
    stage.addEventListener('mouseleave', startAuto);
    let touchStartX = 0;
    stage.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { stopAuto(); goTo(current + (dx < 0 ? 1 : -1)); startAuto(); }
    }, { passive: true });
  }

  // Only start auto-play when carousel is visible
  const carouselEl = track.closest('.dana-carousel');
  const carouselObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startAuto();
      } else {
        stopAuto();
      }
    });
  }, { threshold: 0.3 });

  if (carouselEl) carouselObserver.observe(carouselEl);
}

initCarousel('danaCarouselTrack', 'danaCarouselDots', 'danaCarouselPrev', 'danaCarouselNext');
initCarousel('ravalCarouselTrack', 'ravalCarouselDots', 'ravalCarouselPrev', 'ravalCarouselNext');
