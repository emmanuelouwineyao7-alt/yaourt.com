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
