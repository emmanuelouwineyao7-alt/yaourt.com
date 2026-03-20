/* ══════════════════════════════════════════════
   YaourtMa — Scripts JavaScript
   Fichier : script.js
   Lié à   : index.html
══════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   1. SPLASH SCREEN — disparaît après 3.2s
───────────────────────────────────────────── */
setTimeout(function () {
  const splash = document.getElementById('splash');
  if (!splash) return;
  splash.classList.add('exit');
  setTimeout(function () {
    splash.style.display = 'none';
  }, 700);
}, 3200);

/* ─────────────────────────────────────────────
   2. NAVIGATION — classe "scrolled" au scroll
───────────────────────────────────────────── */
// window.addEventListener('scroll', function () {
//   const nav = document.getElementById('nav');
//   if (!nav) return;
//   if (window.scrollY > 60) {
//     nav.classList.add('scrolled');
//   } else {
//     nav.classList.remove('scrolled');
//   }
// });

/* ─────────────────────────────────────────────
   3. FADE-IN AU SCROLL — IntersectionObserver
───────────────────────────────────────────── */
const fadeObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade').forEach(function (el) {
  fadeObserver.observe(el);
});

/* ─────────────────────────────────────────────
   4. MENU MOBILE — hamburger toggle
───────────────────────────────────────────── */
var menuOpen = false;

document.getElementById('ham').addEventListener('click', function () {
  const links = document.querySelector('.nav-links');
  if (!links) return;

  if (menuOpen) {
    links.style.cssText = '';
    menuOpen = false;
  } else {
    links.style.cssText =
      'display:flex; flex-direction:column; position:absolute; ' +
      'top:68px; left:0; right:0; ' +
      'background:rgba(26,10,0,0.97); ' +
      'padding:24px; gap:18px; ' +
      'backdrop-filter:blur(10px);';
    menuOpen = true;
  }
});

// Fermer le menu si on clique sur un lien
document.querySelectorAll('.nav-links a').forEach(function (link) {
  link.addEventListener('click', function () {
    const links = document.querySelector('.nav-links');
    if (links) links.style.cssText = '';
    menuOpen = false;
  });
});

/* ─────────────────────────────────────────────
   5. FORMULAIRE CONTACT — envoi par mailto
───────────────────────────────────────────── */
function sendForm() {
  var prenom  = document.getElementById('fn').value.trim();
  var email   = document.getElementById('em').value.trim();
  var message = document.getElementById('ms').value.trim();

  // Validation simple
  if (!prenom || !email || !message) {
    alert('Merci de remplir au moins votre prénom, votre email et votre message.');
    return;
  }

  // Validation format email
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Veuillez entrer une adresse email valide.');
    return;
  }

  // Construction du lien mailto
  var sujet = document.getElementById('su').value || 'Message depuis le site YaourtMa';
  var subject = encodeURIComponent('YaourtMa : ' + sujet);
  var body = encodeURIComponent(
    'De : ' + prenom + '\n' +
    'Email : ' + email + '\n\n' +
    'Message :\n' + message
  );

  window.location.href = 'mailto:contact@yaourtma.tg?subject=' + subject + '&body=' + body;

  // Affichage du message de confirmation
  document.getElementById('cform').style.display = 'none';
  document.getElementById('form-ok').style.display = 'block';
}

/* ─────────────────────────────────────────────
   TÉMOIGNAGES — formulaire + localStorage
───────────────────────────────────────────── */
var TESTI_STORAGE_KEY = 'yaourtma_testimonials_v1';
var TESTI_MAX_ITEMS = 50;

function getSafeStorageArray(key) {
  try {
    var raw = localStorage.getItem(key);
    if (!raw) return [];
    var parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function setSafeStorageArray(key, arr) {
  try {
    localStorage.setItem(key, JSON.stringify(arr));
  } catch (e) {
    // Si localStorage est bloqué, on évite juste de planter la page.
  }
}

function starsFromRating(rating) {
  var r = Number(rating);
  if (!Number.isFinite(r)) r = 5;
  r = Math.max(1, Math.min(5, r));
  return '★'.repeat(r) + '☆'.repeat(5 - r);
}

function themeFromRating(rating) {
  var r = Number(rating);
  if (!Number.isFinite(r)) r = 5;
  if (r >= 5) return 'tc-1';
  if (r >= 4) return 'tc-2';
  return 'tc-3';
}

function createTestimonialCard(t) {
  var card = document.createElement('div');
  card.className = 'testi-card ' + themeFromRating(t.rating);

  var quote = document.createElement('div');
  quote.className = 'testi-quote';
  quote.textContent = '"';

  var stars = document.createElement('div');
  stars.className = 'testi-stars';
  stars.textContent = starsFromRating(t.rating);

  var text = document.createElement('p');
  text.className = 'testi-text';
  text.textContent = t.message;

  var author = document.createElement('div');
  author.className = 'testi-author';

  var avatar = document.createElement('div');
  avatar.className = 't-avatar';
  var nameTrim = (t.name || '').trim();
  avatar.textContent = nameTrim ? nameTrim.charAt(0).toUpperCase() : '👤';

  var info = document.createElement('div');

  var nameEl = document.createElement('div');
  nameEl.className = 't-name';
  nameEl.textContent = nameTrim || 'Client';

  var locEl = document.createElement('div');
  locEl.className = 't-loc';
  locEl.textContent = (t.location || '').trim();

  if (!locEl.textContent) {
    locEl.style.display = 'none';
  }

  info.appendChild(nameEl);
  info.appendChild(locEl);
  author.appendChild(avatar);
  author.appendChild(info);

  card.appendChild(quote);
  card.appendChild(stars);
  card.appendChild(text);
  card.appendChild(author);

  return card;
}

(function initTestimonials() {
  var grid = document.querySelector('#temoignages .testi-grid');
  var form = document.getElementById('tform');
  if (!grid || !form) return;

  var okEl = document.getElementById('tform-ok');
  var nameEl = document.getElementById('tname');
  var locEl = document.getElementById('tloc');
  var ratingEl = document.getElementById('trating');
  var msgEl = document.getElementById('tmessage');

  function sanitizeField(str, maxLen) {
    return String(str || '').trim().slice(0, maxLen);
  }

  function renderStoredTestimonials() {
    var arr = getSafeStorageArray(TESTI_STORAGE_KEY);
    arr.forEach(function (t) {
      if (!t || !t.message || !t.name) return;
      grid.appendChild(createTestimonialCard(t));
    });
  }

  renderStoredTestimonials();

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!nameEl || !ratingEl || !msgEl) return;

    var name = sanitizeField(nameEl.value, 40);
    var location = sanitizeField(locEl ? locEl.value : '', 60);
    var rating = sanitizeField(ratingEl.value, 2);
    var message = sanitizeField(msgEl.value, 600);

    if (!name || !message) {
      alert('Merci de remplir au minimum votre nom et votre avis.');
      return;
    }

    var stored = getSafeStorageArray(TESTI_STORAGE_KEY);

    var testimonial = {
      id: String(Date.now()) + '-' + String(Math.random()).slice(2),
      name: name,
      location: location,
      rating: Number(rating),
      message: message,
      createdAt: new Date().toISOString()
    };

    stored.push(testimonial);
    if (stored.length > TESTI_MAX_ITEMS) {
      stored = stored.slice(stored.length - TESTI_MAX_ITEMS);
    }

    setSafeStorageArray(TESTI_STORAGE_KEY, stored);

    grid.appendChild(createTestimonialCard(testimonial));

    if (okEl) okEl.style.display = 'block';
    form.reset();

    // Cache le message après quelques secondes.
    window.setTimeout(function () {
      if (okEl) okEl.style.display = 'none';
    }, 5000);
  });
})();
