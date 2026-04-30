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

/* ═══════════════════════════════════════════════════════════
   READ PROGRESS BAR
   ═══════════════════════════════════════════════════════════ */
(function () {
  const bar = document.getElementById('readProgress');
  if (!bar) return;
  window.addEventListener('scroll', function () {
    const docH  = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    bar.style.width = pct.toFixed(1) + '%';
  }, { passive: true });
}());

/* ═══════════════════════════════════════════════════════════
   ACTIVE NAV SECTION (IntersectionObserver)
   ═══════════════════════════════════════════════════════════ */
(function () {
  const navLinkEls = document.querySelectorAll('.nav__links a[data-section]');
  if (!navLinkEls.length) return;

  const sectionIds = Array.from(navLinkEls).map(function (a) { return a.dataset.section; });
  const sections   = sectionIds.map(function (id) { return document.getElementById(id); }).filter(Boolean);

  if (!sections.length) return;

  let activeSectionId = '';

  const obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { activeSectionId = entry.target.id; }
    });
    navLinkEls.forEach(function (a) {
      a.classList.toggle('active', a.dataset.section === activeSectionId);
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(function (s) { obs.observe(s); });
}());

/* Close mobile menu when clicking outside */
document.addEventListener('click', function (e) {
  const navBurger = document.getElementById('navBurger');
  const navLinksEl = document.getElementById('navLinks');
  if (!navLinksEl || !navBurger) return;
  if (navLinksEl.classList.contains('open') &&
      !navLinksEl.contains(e.target) &&
      !navBurger.contains(e.target)) {
    navLinksEl.classList.remove('open');
    navBurger.setAttribute('aria-expanded', 'false');
  }
});

/* ═══════════════════════════════════════════════════════════
   HEMEROTECA FILTER
   ═══════════════════════════════════════════════════════════ */
(function () {
  var filtersEl = document.getElementById('hemerotecaFilters');
  if (!filtersEl) return;

  filtersEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.hfilt-btn');
    if (!btn) return;

    /* update button active state */
    filtersEl.querySelectorAll('.hfilt-btn').forEach(function (b) {
      b.classList.remove('hfilt-btn--active');
    });
    btn.classList.add('hfilt-btn--active');

    var filter = btn.dataset.filter;

    /* show/hide articles */
    var articles = document.querySelectorAll('.masonry-grid .clipping[data-party]');
    articles.forEach(function (art) {
      var party = art.dataset.party || '';
      var match = filter === 'all' || party === filter ||
                  (filter === 'pp'     && party.includes('pp'))   ||
                  (filter === 'vox'    && party.includes('vox'))  ||
                  (filter === 'pp-vox' && party === 'pp-vox');
      art.classList.toggle('clipping--hidden', !match);
    });

    /* hide carousels whose preceding article is hidden */
    var carousels = document.querySelectorAll('.masonry-grid .dana-carousel');
    carousels.forEach(function (carousel) {
      var prev = carousel.previousElementSibling;
      while (prev && !prev.matches('.clipping[data-party]')) {
        prev = prev.previousElementSibling;
      }
      var hide = prev && prev.classList.contains('clipping--hidden');
      carousel.classList.toggle('dana-carousel--hidden', !!hide);
    });
  });
}());

/* ═══════════════════════════════════════════════════════════
   TEXTAREA CHAR COUNTER
   ═══════════════════════════════════════════════════════════ */
(function () {
  var ta      = document.getElementById('descripcio');
  var counter = document.getElementById('descCounter');
  var wrapper = counter && counter.closest('.form-char-counter');
  if (!ta || !counter) return;

  var MAX = 1200;

  ta.addEventListener('input', function () {
    var len = ta.value.length;
    if (len > MAX) { ta.value = ta.value.slice(0, MAX); len = MAX; }
    counter.textContent = len;
    if (wrapper) {
      wrapper.classList.toggle('near-limit', len >= MAX * 0.85 && len < MAX);
      wrapper.classList.toggle('at-limit',   len >= MAX);
    }
  });
}());

/* ═══════════════════════════════════════════════════════════
   ENERGY CALCULATOR
   ═══════════════════════════════════════════════════════════ */
(function () {
  var slider   = document.getElementById('ceSlider');
  var membersEl = document.getElementById('ceMembers');
  var savingEl  = document.getElementById('ceSaving');
  if (!slider || !membersEl || !savingEl) return;

  var PER_MEMBER = 180; /* € per any */

  function update() {
    var n = parseInt(slider.value, 10);
    membersEl.textContent = n;
    savingEl.textContent  = (n * PER_MEMBER).toLocaleString('ca-ES') + '€';
  }

  slider.addEventListener('input', update);
  update();
}());

/* ═══════════════════════════════════════════════════════════
   LIGHTBOX
   ═══════════════════════════════════════════════════════════ */
(function () {
  var overlay = null;

  function openLightbox(src, caption) {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', caption || 'Imatge ampliada');

    var closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-overlay__close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Tancar');

    var img = document.createElement('img');
    img.src = src;
    img.alt = caption || '';

    overlay.appendChild(closeBtn);
    overlay.appendChild(img);

    if (caption) {
      var cap = document.createElement('div');
      cap.className = 'lightbox-overlay__caption';
      cap.textContent = caption;
      overlay.appendChild(cap);
    }

    function close() {
      if (overlay) {
        overlay.remove();
        overlay = null;
        document.removeEventListener('keydown', onKey);
      }
    }

    function onKey(e) {
      if (e.key === 'Escape') close();
    }

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target === closeBtn) close();
    });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', onKey);

    document.body.appendChild(overlay);
    closeBtn.focus();
  }

  document.addEventListener('click', function (e) {
    var img = e.target.closest('img[data-lightbox]');
    if (!img) return;
    e.preventDefault();
    openLightbox(img.src, img.dataset.caption || img.alt);
  });
}());

/* ═══════════════════════════════════════════════════════════
   LANGUAGE SWITCHER (VA / ES)
   ═══════════════════════════════════════════════════════════ */
(function () {
  var I18N = {
    ca: {
      nav_hemeroteca: 'Què han fet',
      nav_pla:        'Què farem',
      nav_ce:         'Energia',
      nav_placa:      'Plaça Major',
      nav_cta:        'Participa',
      form_nom_label:   'Nom o empresa (opcional)',
      form_email_label: 'Correu electrònic (opcional)',
      form_tipus_label: 'Tipus de cas',
      form_desc_label:  'Descriu el cas',
      form_attach_label:'Adjunta una foto o document (opcional)',
      form_submit:      'Enviar la denúncia',
      hero_cta_primary: "Descobreix tots els casos",
      hero_cta_sec:     "El nostre pla",
      pla_label:        '📋 EL NOSTRE PLA',
      pla_title:        'Algemesí mereix solucions reals',
      cta_bar:          'Participa i construeix el canvi',
      futur_cta_text:   'Vols el programa complet? El posem a la teua disposició, sense lletra menuda.',
      footer_credit:    'Grup Municipal PSOE · Algemesí 2027'
    },
    es: {
      nav_hemeroteca: '¿Qué han hecho?',
      nav_pla:        '¿Qué haremos?',
      nav_ce:         'Energía',
      nav_placa:      'Plaza Mayor',
      nav_cta:        'Participa',
      form_nom_label:   'Nombre o empresa (opcional)',
      form_email_label: 'Correo electrónico (opcional)',
      form_tipus_label: 'Tipo de caso',
      form_desc_label:  'Describe el caso',
      form_attach_label:'Adjunta una foto o documento (opcional)',
      form_submit:      'Enviar la denuncia',
      hero_cta_primary: "Descubre todos los casos",
      hero_cta_sec:     "Nuestro plan",
      pla_label:        '📋 NUESTRO PLAN',
      pla_title:        'Algemesí merece soluciones reales',
      cta_bar:          'Participa y construye el cambio',
      futur_cta_text:   '¿Quieres el programa completo? Lo ponemos a tu disposición, sin letra pequeña.',
      footer_credit:    'Grupo Municipal PSOE · Algemesí 2027'
    }
  };

  /* Extra selectors for non-data-i18n elements (form submit button, section labels) */
  var SELECTORS = {
    form_submit:    'button[type="submit"]',
    pla_label:      '.section-header__label--red',
    pla_title:      '.section-header__title',
    cta_bar:        '.btn--red.btn--large',
    futur_cta_text: '.futur__cta-text',
    footer_credit:  '.footer__credit'
  };

  var btn      = document.getElementById('langToggle');
  var flagEl   = btn && btn.querySelector('.nav__lang-flag');
  var labelEl  = document.getElementById('langLabel');
  var htmlEl   = document.documentElement;

  function detectLang() {
    var saved = localStorage.getItem('lang');
    if (saved === 'ca' || saved === 'es') return saved;
    var nav = (navigator.language || '').toLowerCase();
    /* Default to Valencian; only switch to Spanish if clearly Spanish and not Catalan/Valencian */
    if (nav.startsWith('es') && !nav.includes('ca') && !nav.includes('val')) return 'es';
    return 'ca';
  }

  function applyLang(lang) {
    var t = I18N[lang];
    if (!t) return;

    /* data-i18n elements */
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.dataset.i18n;
      if (t[key] !== undefined) el.textContent = t[key];
    });

    /* Extra selectors — only update textContent of first matching element */
    Object.keys(SELECTORS).forEach(function (key) {
      if (t[key] === undefined) return;
      var el = document.querySelector(SELECTORS[key]);
      if (!el) return;
      /* For label elements keep the required asterisk span */
      var reqSpan = el.querySelector('.form-required');
      if (reqSpan) {
        el.childNodes[0].textContent = t[key] + ' ';
      } else {
        el.textContent = t[key];
      }
    });

    /* Update html lang attribute and button indicator */
    if (lang === 'ca') {
      htmlEl.setAttribute('lang', 'ca-ES-valencia');
      if (flagEl) flagEl.textContent = '🇻🇦';
      if (labelEl) labelEl.textContent = 'VAL';
    } else {
      htmlEl.setAttribute('lang', 'es');
      if (flagEl) flagEl.textContent = '🇪🇸';
      if (labelEl) labelEl.textContent = 'CAS';
    }

    localStorage.setItem('lang', lang);
  }

  if (btn) {
    btn.addEventListener('click', function () {
      var current = localStorage.getItem('lang') || detectLang();
      applyLang(current === 'ca' ? 'es' : 'ca');
    });
  }

  /* Apply on page load */
  applyLang(detectLang());
}());
