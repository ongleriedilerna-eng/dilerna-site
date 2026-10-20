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

  /* ---------- Les publications Instagram défilent toutes seules (en boucle) ---------- */
  var postsTrack = $("#creations .posts__track");
  // sur ordinateur : les dernières publications en haute qualité (config → instaPostsOrdinateur)
  var hd = (window.DILERNA || {}).instaPostsOrdinateur;
  if (postsTrack && postsTrack.children.length && hd && hd.length) {
    var model = postsTrack.children[0];
    postsTrack.innerHTML = "";
    hd.forEach(function (p) {
      var q = model.cloneNode(true), im = $(".post__media img", q), media = $(".post__media", q), cap = $(".post__cap", q), like = $(".post__like", q);
      if (im) { im.src = p.src; im.alt = p.alt || ""; im.removeAttribute("srcset"); }
      if (media) media.style.setProperty("--bg-img", "url('" + p.src + "')");
      if (cap) cap.innerHTML = "<b>ongleriedilerna</b> " + (p.alt || "").split(" : ")[0].replace(/[<>&]/g, "");
      if (like) like.setAttribute("aria-pressed", "false");
      postsTrack.appendChild(q);
    });
  }
  if (postsTrack && postsTrack.children.length) {
    var orig = $$(".post", postsTrack);
    // assez de publications pour remplir l'écran et boucler sans trou
    var copies = Math.max(2, Math.ceil(2 * 1600 / (orig.length * 312)));
    for (var c = 1; c < copies; c++) orig.forEach(function (p) { var q = p.cloneNode(true); q.setAttribute("aria-hidden", "true"); postsTrack.appendChild(q); });
    postsTrack.style.setProperty("--n", copies);
    postsTrack.parentNode.classList.add("is-running");
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
    soc.appendChild(handles);
    if (book) book.classList.add("is-desktop-hidden");   // pas de bouton « Prendre rendez-vous » dans Mes réseaux
    // une petite icône devant chaque réseau
    var ICO = { instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>',
      tiktok: '<path d="M14 3.5v10.2a3.8 3.8 0 1 1-3.8-3.8"/><path d="M14 3.5c.6 2.6 2.4 4.2 5 4.4"/>',
      pinterest: '<circle cx="12" cy="12" r="8.5"/><path d="M10.6 20.2 12.4 12M12.4 12c-.5-1.8.4-3.6 2-3.6 1.4 0 2 1.1 1.7 2.6-.3 1.7-1.4 3.2-2.9 3.2-1.1 0-1.8-.8-1.6-1.9"/>',
      facebook: '<path d="M14.5 8.5H16V5.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.7 1.4-3.7 4v2.2H7.6v3.4H10V21h3.3v-6.1h2.5l.4-3.4h-2.9V9.6c0-.7.3-1.1 1.2-1.1Z"/>' };
    $$("a", handles).forEach(function (a) {
      var k = (a.querySelector("small") || {}).textContent || ""; k = k.trim().toLowerCase();
      if (ICO[k]) a.insertAdjacentHTML("afterbegin", '<svg class="handle-ico" viewBox="0 0 24 24" aria-hidden="true">' + ICO[k] + '</svg>');
    });
    chat.classList.add("end-sq", "end-sq--chat"); rules.classList.add("end-sq");
    // Bon à savoir à gauche, Mes réseaux au milieu, et « M'écrire » (la conversation) tout à droite, en grand
    erow.appendChild(rules); erow.appendChild(soc); erow.appendChild(chat);
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

  /* ---------- Louise passe la tête un peu partout (sur les côtés et par le bas de l'écran) ---------- */
  var tpl = $("[data-louise] svg");
  if (tpl && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var pop = document.createElement("div"); pop.className = "louise-pop"; pop.setAttribute("aria-hidden", "true");
    pop.appendChild(tpl.cloneNode(true)); document.body.appendChild(pop);
    var sides = ["left", "right", "bottom"];
    var show = function () {
      if (!document.hidden && !document.querySelector("dialog[open]")) {
        var side = sides[Math.floor(Math.random() * sides.length)];
        pop.className = "louise-pop is-" + side + (Math.random() < .4 ? " is-bum" : "");
        if (side === "bottom") pop.style.setProperty("--x", (12 + Math.random() * 70).toFixed(0) + "%");
        else pop.style.setProperty("--y", (18 + Math.random() * 62).toFixed(0) + "%");
        requestAnimationFrame(function () { requestAnimationFrame(function () { pop.classList.add("is-in"); }); });
        setTimeout(function () { pop.classList.remove("is-in"); }, 1500 + Math.random() * 900);
      }
      setTimeout(show, 7000 + Math.random() * 7000);
    };
    setTimeout(show, 4500);
  }
})();
