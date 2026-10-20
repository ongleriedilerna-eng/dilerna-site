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
  if (cbBack) {
    cbBack.setAttribute("aria-hidden", "false");
    // sur ordinateur on ne peut pas faire glisser avec le doigt : deux petites flèches rondes
    var car = $(".cbc-car", cbBack);
    if (car && car.children.length > 1) {
      var mk = function (cls, label, d) {
        var b = document.createElement("button"); b.type = "button"; b.className = "cbc-arrow " + cls; b.setAttribute("aria-label", label);
        b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '"/></svg>';
        b.addEventListener("click", function () {
          var w = car.clientWidth, n = car.children.length, k = Math.round(car.scrollLeft / w) + (cls === "is-next" ? 1 : -1);
          if (k >= n) k = 0; if (k < 0) k = n - 1;
          car.scrollTo({ left: k * w, behavior: "smooth" });
          // si le navigateur ne fait pas le glissement doux, on y va directement
          setTimeout(function () { if (Math.abs(car.scrollLeft - k * w) > 4) car.scrollLeft = k * w; }, 650);
        });
        cbBack.appendChild(b);
      };
      mk("is-prev", "Carte blanche précédente", "M14.5 5.5 8 12l6.5 6.5");
      mk("is-next", "Carte blanche suivante", "M9.5 5.5 16 12l-6.5 6.5");
    }
  }

  /* ---------- Instagram : « Voir tout mon univers sur Instagram » à côté de la carte Suivre ---------- */
  var instaHead = $("#creations .insta-head"), instaCta = $("#creations .gallery__cta");
  if (instaHead && instaCta) {
    var row = document.createElement("div"); row.className = "insta-row";
    var follow = $(".follow", instaHead);
    if (follow) { instaHead.insertBefore(row, follow); row.appendChild(follow); }
    row.appendChild(instaCta);
  }

  /* ---------- Avis Google : juste un bouton « Laisser un avis Google », sous les avis ---------- */
  var rate = $(".rate--after-insta"), avis = $("#avis");
  if (rate && avis) {
    var go = document.createElement("p"); go.className = "avis-cta";
    go.innerHTML = '<a class="btn btn--choco" href="' + rate.getAttribute("href") + '" target="_blank" rel="noopener">Laisser un avis Google</a>';
    avis.appendChild(go);
    rate.classList.add("is-desktop-hidden");
  }

  /* ---------- Infos pratiques : deux carrés pareils, les horaires (jour par jour) et l'adresse ---------- */
  var infos = $("#infos"), hoursH = $(".infos__hours-h"), hoursCard = $(".info-card--hours"), addrH = $(".infos__addr"), map = $("#infos .map"), help = $("#infos .map__help");
  if (infos && hoursH && hoursCard && addrH && map) {
    var irow = document.createElement("div"); irow.className = "infos-row";
    var sqH = document.createElement("div"); sqH.className = "infos-sq infos-sq--hours";
    var sqA = document.createElement("div"); sqA.className = "infos-sq infos-sq--addr";
    var grid = $(".infos__grid", infos); grid.parentNode.insertBefore(irow, grid);
    sqH.appendChild(hoursH); sqH.appendChild(hoursCard);
    sqA.appendChild(addrH); sqA.appendChild(map); if (help) sqA.appendChild(help);
    irow.appendChild(sqH); irow.appendChild(sqA);
    grid.classList.add("is-desktop-hidden");
    // les jours écrits en entier (lundi → dimanche), aujourd'hui entouré
    var now; try { now = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" })); } catch (e) { now = new Date(); }
    var D = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"], today = (now.getDay() + 6) % 7;
    var ul = document.createElement("ul"); ul.className = "days";
    D.forEach(function (d, i) {
      var li = document.createElement("li"); if (i === today) li.className = "is-today"; if (i > 4) li.classList.add("is-shut");
      li.innerHTML = "<b>" + d + "</b><span>" + (i < 5 ? "9h – 17h" : "Fermé") + "</span>";
      ul.appendChild(li);
    });
    var week = $(".week", hoursCard); if (week) week.parentNode.insertBefore(ul, week);
  }

  /* ---------- En bas : On papote ?, Bon à savoir et les réseaux, trois carrés sur une ligne ---------- */
  var chat = $("#contact .chat"), rules = $("#bon-a-savoir .rules"), handles = $(".socials-end .handles"), book = $(".socials-end .contact__book"), cInner = $("#contact .contact__inner");
  if (chat && rules && handles && cInner) {
    var erow = document.createElement("div"); erow.className = "end-row";
    var soc = document.createElement("div"); soc.className = "end-sq end-sq--socials";
    soc.innerHTML = '<h3 class="t-soft">Mes réseaux</h3>';
    soc.appendChild(handles); if (book) soc.appendChild(book);
    chat.classList.add("end-sq"); rules.classList.add("end-sq");
    erow.appendChild(chat); erow.appendChild(rules); erow.appendChild(soc);
    cInner.appendChild(erow);
    $("#bon-a-savoir").classList.add("is-desktop-hidden"); $(".socials-end").classList.add("is-desktop-hidden");
  }

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
    // les photos du salon défilent toutes seules, comme les avis Google (et plus vite)
    var sScroll = $("[data-salon-scroll]", deck);
    if (sScroll) {
      var imgs = $$("img", sScroll);
      if (imgs.length) {
        var mq2 = document.createElement("div"); mq2.className = "salon-marquee";
        var tr = document.createElement("div"); tr.className = "salon-marquee__track";
        for (var rep = 0; rep < 2; rep++) imgs.forEach(function (im) { var c = im.cloneNode(true); c.removeAttribute("id"); if (rep) c.setAttribute("aria-hidden", "true"); c.loading = "eager"; tr.appendChild(c); });
        mq2.appendChild(tr); deck.insertBefore(mq2, deck.firstChild);
        deck.classList.add("has-marquee");
      }
    }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { comforts.classList.add("is-popped"); io.disconnect(); } });
      }, { threshold: 0.3 });
      io.observe(comforts);
    } else comforts.classList.add("is-popped");
  }
})();
