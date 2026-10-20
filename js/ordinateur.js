/* Dilerna — version ordinateur (écrans de 1024 px et plus).
   RÈGLE DE MARIE : la version téléphone ne doit jamais changer.
   Ce script ne fait rien sur un téléphone ; sur ordinateur, il ajoute la bande du haut et range quelques blocs.
   Si la fenêtre change de taille et passe d'un côté à l'autre, la page se recharge pour repartir proprement. */
(function () {
  "use strict";
  var mq = window.matchMedia("(min-width: 1024px)");
  var wide = mq.matches;
  var onChange = function (e) { if (e.matches !== wide) location.reload(); };
  if (mq.addEventListener) mq.addEventListener("change", onChange); else if (mq.addListener) mq.addListener(onChange);
  if (!wide) return;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  document.documentElement.classList.add("is-desktop");

  /* ---------- La longue bande du haut ---------- */
  var bar = document.createElement("header");
  bar.className = "topbar";
  bar.innerHTML =
    '<a class="topbar__logo" href="#accueil" aria-label="Dilerna, retour à l\'accueil"><img src="assets/logo/dilerna-logo.webp" alt="Dilerna – Nail artist" width="600" height="233"></a>' +
    '<nav class="topbar__nav" aria-label="Navigation">' +
      '<a href="#accueil">Accueil</a>' +
      '<a href="#prestations">Prestations</a>' +
      '<a href="#nail-art">Inspo</a>' +
      '<button class="topbar__club" type="button"><i aria-hidden="true">✦</i>Club Dilerna<i aria-hidden="true">✦</i></button>' +
      '<a href="#infos">Infos</a>' +
      '<a href="#a-propos">À propos</a>' +
      '<a href="#contact">Contact</a>' +
    '</nav>' +
    '<button class="topbar__rdv" type="button">Prendre rendez-vous</button>';
  document.body.insertBefore(bar, document.body.firstChild);
  // les boutons de la bande ouvrent les mêmes fenêtres que ceux du site
  $(".topbar__club", bar).addEventListener("click", function () { var b = $(".tab-rdv[data-club-open]"); if (b) b.click(); });
  $(".topbar__rdv", bar).addEventListener("click", function () { var b = $("#prestations [data-rdv]"); if (b) b.click(); });
  var onScroll = function () { bar.classList.toggle("is-scrolled", window.scrollY > 10); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- Prestations : les 4 en carrés sur une ligne (Nail art rejoint les 3 poses) ---------- */
  var stack = $(".presta-stack"), devis = $(".devis-note");
  if (stack && devis) { devis.classList.add("presta-card", "presta-card--devis"); stack.appendChild(devis); }

  /* ---------- Carte blanche : la carte et, à côté, les vraies Cartes blanches à faire glisser ---------- */
  var cbBack = $(".cb-flip__back");
  if (cbBack) cbBack.setAttribute("aria-hidden", "false");

  /* ---------- Instagram : « Voir tout mon univers sur Instagram » à côté de la carte Suivre ---------- */
  var instaHead = $("#creations .insta-head"), instaCta = $("#creations .gallery__cta");
  if (instaHead && instaCta) {
    var row = document.createElement("div"); row.className = "insta-row";
    var follow = $(".follow", instaHead);
    if (follow) { instaHead.insertBefore(row, follow); row.appendChild(follow); }
    row.appendChild(instaCta);
  }

  /* ---------- « Tu as aimé ta pose ? » descend avec les avis Google ---------- */
  var rate = $(".rate--after-insta"), avis = $("#avis");
  if (rate && avis) avis.appendChild(rate);

  /* ---------- Mon salon et, à côté, ce que tu retrouves gratuitement au salon ---------- */
  var salonTitle = $(".about__salon"), deck = $(".salon-deck"), cTitle = $(".comforts__title"), comforts = $(".comforts");
  if (salonTitle && deck && cTitle && comforts) {
    var wrap = document.createElement("div"); wrap.className = "salon-row";
    var left = document.createElement("div"); left.className = "salon-row__photos";
    var right = document.createElement("div"); right.className = "salon-row__free";
    salonTitle.parentNode.insertBefore(wrap, salonTitle);
    left.appendChild(salonTitle); left.appendChild(deck);
    right.appendChild(cTitle); right.appendChild(comforts);
    wrap.appendChild(left); wrap.appendChild(right);
    // chaque petite bulle apparaît en « pop », un peu partout, puis flotte doucement
    var seen = {};
    $$(".comfort-track li", comforts).forEach(function (li) {
      var t = li.textContent.trim();
      if (li.getAttribute("aria-hidden") === "true" || seen[t]) { li.classList.add("is-copy"); return; }
      seen[t] = 1;
    });
    $$(".comfort-track li:not(.is-copy)", comforts).forEach(function (li, i) {
      li.style.setProperty("--d", (i * 0.14).toFixed(2) + "s");
      li.style.setProperty("--f", (3.2 + (i % 5) * 0.45).toFixed(2) + "s");
      li.style.setProperty("--r", ((i % 2 ? 1 : -1) * (2 + (i % 3))) + "deg");
    });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { comforts.classList.add("is-popped"); io.disconnect(); } });
      }, { threshold: 0.3 });
      io.observe(comforts);
    } else comforts.classList.add("is-popped");
  }
})();
