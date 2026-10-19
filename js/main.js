/* =========================================================================
   DILERNA · Interactions
   Sommaire : thème · logo · header/menu · RDV · orbite · galerie ·
   bandeau Instagram · vidéos · couleur du mois · horaires · apparitions
   ========================================================================= */
(function () {
  "use strict";

  var C = window.DILERNA || {};
  var doc = document.documentElement;
  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia("(pointer: coarse)").matches || /iPhone|iPad|Android/i.test(navigator.userAgent);

  // Motifs utilisés pour les visuels provisoires (tant qu'il n'y a pas de photos)
  var ORBIT_ARTS = ["papaya", "hibiscus", "jack", "stripes", "scream", "polka", "leo-pink", "starfish"];
  var ARTS = ["tropical", "tortoise", "french", "fruits", "halloween", "shell", "chrome", "cherry", "bordeaux", "nude"];
  var TILES = ["cream", "rose", "lagon", "taupe", "pomme", "choco"];

  if (C.showPlaceholderLabels === false) doc.classList.add("hide-ph");

  /* ---------- Toujours repartir du haut de la page ----------
     Au rechargement, le navigateur ne remet plus la page là où on était,
     et un ancien lien de section (#prestations…) est retiré de l'adresse. */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  var hashId = location.hash.slice(1);
  if (hashId && document.getElementById(hashId)) history.replaceState(null, "", location.pathname + location.search);
  // (seulement tant que la personne n'a pas commencé à faire défiler elle-même)
  var userMoved = false;
  ["touchstart", "wheel", "keydown", "mousedown"].forEach(function (ev) {
    window.addEventListener(ev, function () { userMoved = true; }, { passive: true, once: true });
  });
  function toTop() { if (!userMoved) window.scrollTo({ top: 0, left: 0, behavior: "instant" }); }
  toTop();
  window.addEventListener("load", toTop);
  window.addEventListener("pageshow", function (e) { if (e.persisted) { userMoved = false; toTop(); } });

  /* ---------- Thème clair / sombre ---------- */
  var themeBtn = $("[data-theme-toggle]");
  function currentTheme() {
    var t = doc.dataset.theme;
    if (t === "light" || t === "dark") return t;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function syncTheme() {
    var label = $("[data-theme-label]");
    if (label) label.textContent = currentTheme() === "dark" ? "Mode clair" : "Mode sombre";
    // Informe le mockup iPhone (couleur de la barre d'état)
    if (window.parent !== window) window.parent.postMessage({ dilernaTheme: currentTheme() }, "*");
    if (typeof syncLogo === "function") syncLogo();
  }
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    doc.dataset.theme = next;
    try { localStorage.setItem("dilerna-theme", next); } catch (e) {}
    syncTheme();
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", syncTheme);
  syncTheme();

  /* ---------- Logo : version claire sur fond sombre (mode sombre, menu ouvert) ---------- */
  function syncLogo() {
    var light = currentTheme() === "dark" && !document.body.classList.contains("menu-open");
    $$("[data-logo]").forEach(function (img) {
      img.src = light ? "assets/logo/dilerna-logo-clair.webp" : "assets/logo/dilerna-logo.webp";
    });
  }
  syncLogo();

  /* ---------- Logo : emplacement neutre si le fichier manque ---------- */
  $$("[data-logo]").forEach(function (img) {
    function fallback() {
      var slot = document.createElement("span");
      slot.className = "logo-slot";
      slot.textContent = "Logo";
      slot.setAttribute("role", "img");
      slot.setAttribute("aria-label", img.alt);
      img.replaceWith(slot);
    }
    if (img.complete && img.naturalWidth === 0) fallback();
    else img.addEventListener("error", fallback);
  });

  /* ---------- Header + menu ---------- */
  var header = $(".header");
  var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 10); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var burger = $("[data-burger]");
  var menu = $("#menu");
  function setMenu(open) {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    if (open) menu.hidden = false;
    requestAnimationFrame(function () { menu.classList.toggle("is-open", open); });
    document.body.classList.toggle("no-scroll", open);
    document.body.classList.toggle("menu-open", open);
    syncLogo();
    if (!open) setTimeout(function () { if (!menu.classList.contains("is-open")) menu.hidden = true; }, 700);
  }
  burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  $$("[data-tab]").forEach(function (t) { t.addEventListener("click", function () { if (menu.classList.contains("is-open")) setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("is-open")) setMenu(false); });

  /* ---------- Barre du bas : onglet actif selon la section affichée ---------- */
  var tabs = $$("[data-tab]");
  if (tabs.length && "IntersectionObserver" in window) {
    var tabObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        tabs.forEach(function (t) { t.classList.toggle("is-active", t.dataset.tab === e.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    tabs.forEach(function (t) { var sec = document.getElementById(t.dataset.tab); if (sec) tabObs.observe(sec); });
  }

  /* ---------- Prendre RDV ----------
     Fenêtre avec Instagram / Appeler / SMS (Instagram seul sur ordinateur).
     Chaque bouton a son message déjà écrit : il s'écrit tout seul dans le SMS ;
     pour Instagram, il est passé dans le lien (?text=, non officiel : reconnu par
     certaines versions de l'appli) et copié en secours si l'appli l'ignore. */
  var RDV_MSG = "Bonjour Marie, je souhaiterais prendre rendez-vous pour une pose. Quelles sont tes disponibilités ?";
  function igLink(msg) { return "https://ig.me/m/ongleriedilerna?text=" + encodeURIComponent(msg); }
  var sheet = $("[data-sheet]");
  var sheetMsg = RDV_MSG;

  // petit message en bas de l'écran
  var toastEl = null, toastT = 0;
  function toast(text) {
    if (!toastEl) { toastEl = document.createElement("p"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = text;
    toastEl.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("is-on"); }, 4200);
  }
  function copyForInsta(msg) {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(msg).then(function () {
      toast("Ton message est prêt ! S'il n'apparaît pas dans Instagram, appuie dans la zone de texte puis « Coller ».");
    }).catch(function () {});
  }

  function openRdv(msg) {
    sheetMsg = msg || RDV_MSG;
    var box = $("[data-sheet-msg]");
    box.hidden = false;
    box.textContent = "« " + sheetMsg + " »";
    $("[data-sheet-sms]").href = "sms:+33745073235?&body=" + encodeURIComponent(sheetMsg);
    $("[data-sheet-ig]").href = igLink(sheetMsg);
    $("[data-sheet-tel]").hidden = !isTouch;
    $("[data-sheet-sms]").hidden = !isTouch;
    if (sheet.showModal) sheet.showModal(); else { copyForInsta(sheetMsg); window.open(igLink(sheetMsg), "_blank", "noopener"); }
  }
  $$("[data-rdv]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      if (menu.classList.contains("is-open")) setMenu(false);
      openRdv(el.getAttribute("data-rdv-msg"));
    });
  });
  if (sheet) {
    $("[data-sheet-close]", sheet).addEventListener("click", function () { sheet.close(); });
    sheet.addEventListener("click", function (e) { if (e.target === sheet) sheet.close(); });
    $("[data-sheet-ig]").addEventListener("click", function () { copyForInsta(sheetMsg); });
  }
  // bulle « Écrire sur Instagram » de la partie contact
  $$("[data-ig-copy]").forEach(function (el) {
    el.href = igLink(RDV_MSG);
    el.addEventListener("click", function () { copyForInsta(RDV_MSG); });
  });

  /* ---------- Sticker « A propos » ----------
     Le bout du scotch de droite se soulève quand on fait défiler la page,
     et se recolle quand le sticker est au milieu de l'écran. */
  var tease = $("[data-tease]");
  if (tease && !reduceMotion) {
    var teaseRaf = 0;
    var teasePeel = function () {
      teaseRaf = 0;
      var r = tease.getBoundingClientRect(), mid = r.top + r.height / 2;
      if (r.bottom < -200 || r.top > innerHeight + 200) return;
      var d = Math.abs(mid - innerHeight / 2) / (innerHeight / 2);
      tease.style.setProperty("--p", Math.min(1, Math.max(0, (d - .15) * 1.3)).toFixed(3));
    };
    window.addEventListener("scroll", function () { if (!teaseRaf) teaseRaf = requestAnimationFrame(teasePeel); }, { passive: true });
    teasePeel();
  }

  /* ---------- Fabrique d'ongles / tuiles ---------- */
  function nail(art) {
    var n = document.createElement("span");
    n.className = "nail art-" + art;
    return n;
  }
  function artTile(i) {
    var t = document.createElement("div");
    t.className = "art-tile tile-" + TILES[i % TILES.length];
    var fan = document.createElement("div");
    fan.className = "fan";
    for (var k = 0; k < 4; k++) fan.appendChild(nail(ARTS[(i * 3 + k) % ARTS.length]));
    t.appendChild(fan);
    return t;
  }
  function phTag(text) {
    var s = document.createElement("span");
    s.className = "ph-tag";
    s.textContent = text;
    return s;
  }
  function img(src, alt) {
    var i = new Image();
    i.src = src; i.alt = alt || ""; i.loading = "lazy"; i.decoding = "async";
    return i;
  }

  /* ---------- Photos du salon (hero + à propos) ---------- */
  function setPhoto(frame, src, alt) {
    if (!frame || !src) return;
    var i = img(src, alt);
    i.loading = "eager";
    i.addEventListener("load", function () {
      frame.classList.add("has-photo");
      var tag = $(".ph-tag", frame); if (tag) tag.remove();
    });
    frame.prepend(i);
  }
  setPhoto($("[data-hero-frame]"), C.heroPhoto, "Le salon Dilerna à Porto-Vecchio et son néon « All I need is Dilerna and some tequila »");
  setPhoto($("[data-about-frame]"), C.aboutPhoto, "Marie, nail artist de Dilerna à Porto-Vecchio");

  /* ---------- Orbite : ongles qui gravitent autour du néon ---------- */
  var orbit = $("[data-orbit]");
  if (orbit) {
    var photos = C.orbitNails || [];
    var count = photos.length ? Math.min(photos.length, 10) : 8;
    var items = [];
    for (var i = 0; i < count; i++) {
      var n;
      if (photos.length) {
        n = document.createElement("span");
        n.className = "nail is-photo";
        n.appendChild(img(photos[i], ""));
      } else {
        n = nail(ORBIT_ARTS[i % ORBIT_ARTS.length]);
      }
      orbit.appendChild(n);
      items.push({ el: n, phase: (i / count) * Math.PI * 2, spin: (i % 2 ? 1 : -1) * (14 + i * 3), tilt: (i * 37) % 60 - 30 });
    }
    var start = performance.now();
    var visible = true;
    // Pause quand la scène n'est pas à l'écran (économie de batterie)
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(orbit);
    }
    function frame(now) {
      if (visible) {
        var t = reduceMotion ? 0 : (now - start) / 1000;
        var w = orbit.clientWidth, h = orbit.clientHeight;
        var rx = w * 0.5, ry = h * 0.2;
        items.forEach(function (it) {
          var a = it.phase + t * 0.45;
          var depth = Math.sin(a);                 // -1 derrière, +1 devant
          var x = Math.cos(a) * rx;
          var y = depth * ry + Math.sin(a * 2 + it.phase) * 8 + h * 0.06;
          var s = 0.72 + (depth + 1) * 0.22;
          var r = it.tilt + t * it.spin;
          it.el.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0) rotate(" + r.toFixed(1) + "deg) scale(" + s.toFixed(3) + ")";
          it.el.style.zIndex = depth > 0 ? 3 : 1;
          it.el.style.opacity = (0.55 + (depth + 1) * 0.225).toFixed(2);
        });
      }
      if (!reduceMotion) requestAnimationFrame(frame);
    }
    // Les ongles « derrière » doivent passer sous le cadre : on joue sur le z-index du conteneur
    orbit.style.zIndex = "auto";
    requestAnimationFrame(frame);
  }

  /* ---------- Vrais ongles flottants (Créations récentes) ---------- */
  var floatStage = $("[data-float-stage]");
  var floats = C.floatNails || [];
  if (floatStage && floats.length) {
    // x, y (px depuis le centre), rotation, durée : placés tout autour du macaron
    var SPOTS = [[-138, -62, -18, 6.2], [132, -74, 16, 5.6], [-150, 52, 12, 6.8], [146, 50, -14, 5.9], [-62, -92, 8, 7.2], [70, 88, -10, 6.4], [-70, 84, 22, 5.4]];
    floats.slice(0, SPOTS.length).forEach(function (src, k) {
      var f = document.createElement("span");
      var sp = SPOTS[k];
      f.className = "float-nail";
      f.style.cssText = "--x:" + sp[0] + "px;--y:" + sp[1] + "px;--r:" + sp[2] + "deg;--dur:" + sp[3] + "s;--delay:-" + (k * 0.9) + "s;--dx:" + (k % 2 ? -8 : 8) + "px";
      f.appendChild(img(src, ""));
      floatStage.appendChild(f);
    });
  } else if (floatStage) {
    floatStage.remove();
  }

  /* ---------- Vidéos (autoplay, muet, boucle) ---------- */
  function videoEl(v) {
    var el = document.createElement("video");
    el.muted = true; el.loop = true; el.autoplay = true; el.playsInline = true;
    el.setAttribute("muted", ""); el.setAttribute("playsinline", ""); el.preload = "metadata";
    if (v.poster) el.poster = v.poster;
    el.src = v.src;
    return el;
  }
  function videoSlot() {
    var d = document.createElement("div");
    d.className = "video-slot";
    d.innerHTML = '<div><span class="video-slot__icon" aria-hidden="true"></span><p>Vidéo à venir</p></div>';
    return d;
  }

  /* ---------- Dernières publications Instagram (à faire glisser) ---------- */
  var postsBox = $("[data-posts]");
  if (postsBox) {
    var track = document.createElement("div");
    track.className = "posts__track";
    (C.instaPosts || []).forEach(function (p) {
      var a = document.createElement("a");
      a.className = "post";
      a.href = p.url || "https://www.instagram.com/ongleriedilerna/";
      a.target = "_blank"; a.rel = "noopener";
      a.setAttribute("aria-label", "Voir la publication sur Instagram : " + p.alt);
      a.innerHTML = '<span class="post__head"><b>ongleriedilerna</b><small>Porto-Vecchio</small></span>';
      var im = img(p.src, p.alt); im.draggable = false;
      var media = document.createElement("span");
      media.className = "post__media";
      media.style.setProperty("--bg-img", "url('" + p.src + "')");
      media.appendChild(im);
      a.appendChild(media);
      track.appendChild(a);
    });
    postsBox.appendChild(track);
    // Un clic après un glissement à la souris ne doit pas ouvrir le lien
    var moved = 0;
    postsBox.addEventListener("pointerdown", function (e) { moved = e.clientX; });
    postsBox.addEventListener("click", function (e) { if (Math.abs(e.clientX - moved) > 8) e.preventDefault(); }, true);
  }

  /* ---------- Galerie « Créations récentes » ---------- */
  var gallery = $("[data-gallery]");
  if (gallery) {
    var list = C.creations || [];
    var vc = C.videos && C.videos.creations;
    // 1re case : vidéo, si elle est fournie (sinon, emplacement seulement sans photos)
    if ((vc && vc.src) || !list.length) {
      var vfig = document.createElement("figure");
      vfig.className = "gallery__item reveal";
      vfig.appendChild(vc && vc.src ? videoEl(vc) : videoSlot());
      gallery.appendChild(vfig);
    }

    var n = list.length || 9;
    for (var g = 0; g < n; g++) {
      var fig = document.createElement("figure");
      fig.className = "gallery__item reveal";
      if (list.length) {
        fig.appendChild(img(list[g].src, list[g].alt || "Nail art fait main par Dilerna, Porto-Vecchio"));
      } else {
        fig.appendChild(artTile(g));
        fig.appendChild(phTag("Photo à venir"));
        fig.setAttribute("aria-hidden", "true");
      }
      gallery.appendChild(fig);
    }
  }

  /* ---------- Bandeau Pinterest (défile de gauche à droite) ---------- */
  var pinStrip = $("[data-pin-strip]");
  if (pinStrip) {
    var pins = C.pinterest || [];
    var n = pins.length || 8;
    var tiles = [];
    for (var k = 0; k < n; k++) {
      var tile = document.createElement("a");
      tile.className = "pin-tile";
      tile.href = "https://pin.it/Riu6KKmqk";
      tile.target = "_blank"; tile.rel = "noopener";
      if (pins.length) {
        tile.appendChild(img(pins[k], "Inspiration nail art du Pinterest de Dilerna"));
        tile.setAttribute("aria-label", "Voir cette inspiration sur Pinterest");
      } else {
        tile.classList.add("pin-tile--empty");
        tile.innerHTML = '<span>Inspi Pinterest</span>';
        tile.setAttribute("aria-label", "Voir mon tableau Pinterest");
      }
      tiles.push(tile);
    }
    // Doublé pour une boucle sans couture ; la copie est ignorée par les lecteurs d'écran
    tiles.forEach(function (t) { pinStrip.appendChild(t); });
    tiles.forEach(function (t) { var c = t.cloneNode(true); c.setAttribute("aria-hidden", "true"); c.tabIndex = -1; pinStrip.appendChild(c); });
  }

  /* ---------- Photos du salon : on fait glisser, la photo part sur le côté et la suivante apparaît ---------- */
  /* Photos du salon : galerie qu'on fait défiler, avec des points */
  var sScroll = $("[data-salon-scroll]");
  if (sScroll && (C.salonPhotos || []).length) {
    var dotsBox = $("[data-salon-dots]");
    C.salonPhotos.forEach(function (p, k) {
      var im = img(p.src, p.alt); im.draggable = false; sScroll.appendChild(im);
      var d = document.createElement("button"); d.type = "button"; d.tabIndex = -1;
      if (!k) d.className = "is-on";
      d.addEventListener("click", function () { sScroll.scrollTo({ left: im.offsetLeft - sScroll.offsetLeft - 20, behavior: "smooth" }); });
      dotsBox.appendChild(d);
    });
    sScroll.addEventListener("scroll", function () {
      var ims = $$("img", sScroll), w = ims[0].offsetWidth + 12, k = Math.round(sScroll.scrollLeft / w);
      $$("button", dotsBox).forEach(function (d, i) { d.classList.toggle("is-on", i === Math.min(k, ims.length - 1)); });
    }, { passive: true });
  }
  var deck = $("[data-salon-deck]");
  var salon = C.salonPhotos || [];
  if (deck && salon.length) {
    salon.slice().reverse().forEach(function (p) {
      var card = document.createElement("figure");
      card.className = "deck__card";
      card.appendChild(img(p.src, p.alt));
      deck.appendChild(card);
    });
    var layout = function () {
      var cards = $$(".deck__card", deck);
      cards.forEach(function (c, k) {
        var depth = cards.length - 1 - k;            // 0 = photo du dessus
        c.style.zIndex = k + 1;
        var d = Math.min(depth, 3);
        c.style.transform = depth ? "translateX(" + d * 14 + "px) rotate(" + d * 3 + "deg) scale(" + (1 - d * .04) + ")" : "";
        c.setAttribute("aria-hidden", depth ? "true" : "false");
      });
      var counter = $("[data-deck-count]");
      if (counter) counter.textContent = (seen % salon.length + 1) + " / " + salon.length;
    };
    var seen = 0;
    layout();
    // Tant qu'on n'a pas touché au paquet, la photo du dessus « se pousse » un peu pour montrer qu'il y en a d'autres
    var nudge = setInterval(function () {
      if (busy || dragging) return;
      deck.classList.remove("is-nudging"); void deck.offsetWidth; deck.classList.add("is-nudging");
    }, 3200);
    var topCard = function () { var c = $$(".deck__card", deck); return c[c.length - 1]; };
    var busy = false;
    var next = function (dir) {
      if (busy) return;
      busy = true; seen++;
      clearInterval(nudge); deck.classList.remove("is-nudging");
      var c = topCard();
      c.style.transition = "transform .45s cubic-bezier(.3,.7,.3,1), opacity .45s";
      c.style.transform = "translateX(" + (dir * 130) + "%) rotate(" + (dir * 18) + "deg)";
      c.style.opacity = "0";
      setTimeout(function () {
        c.style.transition = "none"; c.style.opacity = "";
        deck.insertBefore(c, deck.firstChild);
        layout();
        requestAnimationFrame(function () { c.style.transition = ""; busy = false; });
      }, 450);
    };
    var sx = 0, dx = 0, dragging = false;
    deck.addEventListener("pointerdown", function (e) {
      if (busy) return;
      dragging = true; sx = e.clientX; dx = 0;
      topCard().style.transition = "none";
      try { deck.setPointerCapture(e.pointerId); } catch (err) {}
    });
    deck.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      dx = e.clientX - sx;
      topCard().style.transform = "translateX(" + dx + "px) rotate(" + dx / 18 + "deg)";
    });
    var release = function () {
      if (!dragging) return;
      dragging = false;
      topCard().style.transition = "";
      // Glisser (ou toucher) : la photo s'en va, à droite par défaut
      if (Math.abs(dx) > 50 || Math.abs(dx) < 6) next(dx < -50 ? -1 : 1);
      else layout();
    };
    deck.addEventListener("pointerup", release);
    deck.addEventListener("pointercancel", release);
    deck.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") { e.preventDefault(); next(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); next(-1); }
    });
  } else if (deck) {
    deck.parentNode.remove();
  }

  /* ---------- Tableau Pinterest officiel : remplace le bandeau provisoire une fois chargé ---------- */
  var pinBoard = $("[data-pin-board]");
  if (pinBoard) {
    var tries = 0;
    var watch = setInterval(function () {
      tries++;
      var rendered = pinBoard.querySelector("span, iframe");
      if (rendered && pinStrip && !(C.pinterest || []).length) pinStrip.remove();
      if (rendered || tries > 20) clearInterval(watch);
      if (!rendered && tries > 20) pinBoard.remove();
    }, 500);
  }

  /* ---------- Louise passe la tête (ou les fesses) par le bord de l'écran ----------
     Côté gauche ou droit au hasard. « Tête » : on voit sa tête qui renifle.
     « Fesses » : on ne voit que l'arrière et la queue qui remue. */
  var louise = $("[data-louise]");
  if (louise && !reduceMotion) {
    var peek = function (twice) {
      if (document.hidden || menu.classList.contains("is-open")) return later();
      // Pas d'apparition là où Louise est déjà à l'écran (accueil, Pinterest, couleur du mois, avis)
      var mid = innerHeight / 2, busyZone = ["accueil", "nail-art", "couleur-du-mois", "avis"].some(function (id) {
        var el = document.getElementById(id); if (!el) return false;
        var r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0;
      });
      if (busyZone) return later();
      var left = Math.random() < 0.5;
      var bum = Math.random() < 0.4;
      // Dessin de base : tête à droite, queue à gauche. On le retourne selon le côté et le mode.
      var flip = left ? bum : !bum;
      louise.className = "louise-peek " + (left ? "is-left" : "is-right") + (flip ? " is-flip" : "");
      louise.style.setProperty("--y", (Math.random() < .5 ? 12 + Math.random() * 6 : 72 + Math.random() * 4).toFixed(0) + "%");
      requestAnimationFrame(function () { requestAnimationFrame(function () { louise.classList.add("is-in"); }); });
      setTimeout(function () {
        louise.classList.remove("is-in");
        // Petite chipie : parfois elle revient tout de suite
        if (!twice && Math.random() < 0.35) setTimeout(function () { peek(true); }, 700);
        else later();
      }, 1300 + Math.random() * 900);
    };
    var later = function () { setTimeout(function () { peek(false); }, 16000 + Math.random() * 22000); };
    setTimeout(function () { peek(false); }, 6000);
  }

  /* ---------- Avis : on les fait glisser (doigt sur mobile, souris sur ordinateur) ---------- */
  $$("[data-drag]").forEach(function (box) {
    var down = false, startX = 0, startScroll = 0;
    box.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return;
      down = true; startX = e.clientX; startScroll = box.scrollLeft;
      box.classList.add("is-dragging");
    });
    window.addEventListener("pointermove", function (e) { if (down) box.scrollLeft = startScroll - (e.clientX - startX); });
    window.addEventListener("pointerup", function () { down = false; box.classList.remove("is-dragging"); });
  });

  /* ---------- Louise croque « Google » bouchée par bouchée, puis s'enfuit ---------- */
  var munch = $("[data-munch]");
  if (munch && "IntersectionObserver" in window && !reduceMotion) {
    var goo = $(".goo", munch), cover = $(".goo__cover", munch), dog = $(".munch-dog", munch);
    var burpEl = document.createElement("span"); burpEl.className = "munch-burp"; burpEl.setAttribute("aria-hidden", "true"); munch.appendChild(burpEl);
    var WORDS = ["miam", "crunch"], wi = 0;
    var burp = function () {
      burpEl.textContent = WORDS[wi++ % WORDS.length];
      burpEl.style.right = (parseFloat(dog.style.right) + 30) + "px";
      burpEl.classList.remove("show"); void burpEl.offsetWidth; burpEl.classList.add("show");
    };
    var eat = function () {
      var W = goo.offsetWidth + 6, BITES = 7, gap = 1300;
      var place = function (w) { cover.style.width = w + "px"; dog.style.right = (w - 40) + "px"; };
      dog.style.transition = "none"; dog.style.opacity = "1"; dog.style.transform = "scaleX(-1)"; dog.style.right = "-90px";
      requestAnimationFrame(function () {
        dog.style.transition = "right 1s ease-out";
        dog.style.right = "-46px";
      });
      setTimeout(function () { dog.style.transition = ""; munch.classList.add("is-munching"); }, 1100);
      for (var k = 1; k <= BITES; k++) (function (k) {
        setTimeout(function () {
          dog.classList.remove("is-bite"); void dog.offsetWidth; dog.classList.add("is-bite");
          setTimeout(function () { place(Math.round(W * k / BITES)); burp(); }, 160);
        }, 1100 + k * gap);
      })(k);
      setTimeout(function () {
        munch.classList.remove("is-munching"); dog.classList.remove("is-bite");
        dog.style.transition = "right 1s ease-in, transform .2s";
        dog.style.transform = "scaleX(1)";
        dog.style.right = "-460px";
      }, 1100 + BITES * gap + 900);
      // … puis elle revient doucement et rapporte le mot, intact (un peu à l'écart du « e »)
      setTimeout(function () {
        dog.style.transition = "right 3.2s ease-out, transform .2s";
        dog.style.transform = "scaleX(-1)";
        cover.style.transition = "width 3.2s ease-out";
        dog.style.right = "-84px";
        cover.style.width = "0px";
      }, 1100 + BITES * gap + 3200);
      // et quelques secondes plus tard… elle recommence
      setTimeout(function () { cover.style.transition = ""; again(); }, 1100 + BITES * gap + 3200 + 3200 + 3500);
    };
    var inView = false, waiting = false;
    var again = function () { if (inView) eat(); else waiting = true; };
    var mObs = new IntersectionObserver(function (en) {
      inView = en[0].isIntersecting;
      if (inView && (waiting || !munch.dataset.started)) { waiting = false; munch.dataset.started = "1"; eat(); }
    }, { threshold: 1 });
    mObs.observe(munch);
  }

  // Tête de Louise derrière le bouton Pinterest : apparaît quand on arrive
  var pinCta = $(".pin__cta");
  if (pinCta && "IntersectionObserver" in window) {
    var pObs = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { pinCta.classList.add("in"); pObs.disconnect(); } }, { threshold: .9 });
    pObs.observe(pinCta);
  }

  /* ---------- Plan : ouvre l'appli de cartes du téléphone ---------- */
  (function () {
    var lat = 41.6176338, lng = 9.300044, label = encodeURIComponent("DILERNA, Rte de Pezza Carda Cardo, 20137 Porto-Vecchio");
    var ua = navigator.userAgent, url;
    if (/iPhone|iPad|iPod|Macintosh/.test(ua) && "ontouchend" in document) url = "https://maps.apple.com/?daddr=" + lat + "," + lng + "&q=" + label;
    else if (/Android/.test(ua)) url = "geo:" + lat + "," + lng + "?q=" + lat + "," + lng + "(" + label + ")";
    if (url) $$("[data-maps]").forEach(function (a) { a.href = url; a.removeAttribute("target"); });
  })();

  /* ---------- Accueil : 5 modèles au choix (#hero1 à #hero5 dans le lien) ---------- */
  var HERO_DEFAULT = "14";
  var heroV = (location.hash.match(/hero(\d+)/) || [])[1] || HERO_DEFAULT;
  var heroSec = $(".hero--motion");
  var heroPics = (C.heroWall || []).filter(function (m) { return typeof m === "string"; });
  var mkImg = function (src) { var im = new Image(); im.src = src; im.alt = ""; im.decoding = "async"; return im; };
  if (heroSec) {
    heroSec.setAttribute("data-variant", heroV);
    var fx = document.createElement("div"); fx.className = "hero__fx"; fx.setAttribute("aria-hidden", "true");
    heroSec.insertBefore(fx, heroSec.firstChild);
    var centerSlot = $("[data-fan]");
    if (+heroV >= 11) {
      // Accueils en 3D : on charge Three.js puis la scène
      centerSlot.remove();
      var monthHex = ((C.colors || [])[new Date().getMonth()] || {}).hex;
      var go3d = function () {
        var s2 = document.createElement("script"); s2.src = "js/hero3d.js";
        s2.onload = function () { window.DilernaHero3D(fx, heroV, heroPics, monthHex); };
        document.head.appendChild(s2);
      };
      if (window.THREE) go3d(); else {
        var s1 = document.createElement("script");
        s1.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
        s1.onload = go3d; document.head.appendChild(s1);
      }
    } else if (heroV === "2") {
      // Mur qui défile en 3 colonnes
      var wallEl = document.createElement("div"); wallEl.className = "wall";
      [0, 1, 2].forEach(function (ci) {
        var col = document.createElement("div"); col.className = "wall__col" + (ci === 1 ? " wall__col--down" : "");
        for (var rep = 0; rep < 2; rep++) {
          var tr = document.createElement("div"); tr.className = "wall__track";
          heroPics.filter(function (_, k) { return k % 3 === ci; }).forEach(function (src) { var t = document.createElement("div"); t.className = "wall__tile"; t.appendChild(mkImg(src)); tr.appendChild(t); });
          col.appendChild(tr);
        }
        wallEl.appendChild(col);
      });
      fx.appendChild(wallEl);
      centerSlot.remove();
    } else if (heroV === "3") {
      // Carrousel 3D qui tourne
      var ring = document.createElement("div"); ring.className = "ring";
      var n = Math.min(8, heroPics.length);
      heroPics.slice(0, n).forEach(function (src, k) {
        var c = document.createElement("div"); c.className = "ring__card"; c.style.setProperty("--a", (360 / n * k) + "deg"); c.appendChild(mkImg(src)); ring.appendChild(c);
      });
      var stageR = document.createElement("div"); stageR.className = "ring-stage"; stageR.appendChild(ring);
      centerSlot.replaceWith(stageR);
    } else if (heroV === "4") {
      // Polaroïds qui tombent et s'empilent
      var pile = document.createElement("div"); pile.className = "pile";
      centerSlot.replaceWith(pile);
      var pi = 0;
      var drop = function () {
        if (pile.children.length >= 6) { pile.classList.add("is-clear"); setTimeout(function () { pile.innerHTML = ""; pile.classList.remove("is-clear"); }, 600); }
        var c = document.createElement("div"); c.className = "pile__card";
        c.style.setProperty("--r", (Math.random() * 30 - 15).toFixed(1) + "deg");
        c.style.setProperty("--x", (Math.random() * 90 - 45).toFixed(0) + "px");
        c.appendChild(mkImg(heroPics[pi++ % heroPics.length])); pile.appendChild(c);
      };
      setTimeout(function () { drop(); setInterval(drop, 1600); }, 1800);
    } else if (heroV === "6") {
      // Mosaïque : la grille remplit l'écran et les cases changent de photo en se retournant
      var grid = document.createElement("div"); grid.className = "mosaic";
      var tiles = [];
      for (var g = 0; g < 12; g++) {
        var t = document.createElement("div"); t.className = "mosaic__tile";
        t.appendChild(mkImg(heroPics[g % heroPics.length])); grid.appendChild(t); tiles.push(t);
      }
      fx.appendChild(grid);
      var gp = 12;
      setInterval(function () {
        var t = tiles[Math.floor(Math.random() * tiles.length)];
        t.classList.add("is-flip");
        setTimeout(function () { t.firstChild.src = heroPics[gp++ % heroPics.length]; t.classList.remove("is-flip"); }, 350);
      }, 900);
      centerSlot.remove();
    } else if (heroV === "7") {
      // Plein écran : une grande photo qui zoome doucement, puis fondu vers la suivante
      var kb = document.createElement("div"); kb.className = "kb";
      heroPics.slice(0, 6).forEach(function (src, k) { var d = document.createElement("div"); d.className = "kb__slide"; d.style.animationDelay = (k * 4) + "s"; d.appendChild(mkImg(src)); kb.appendChild(d); });
      fx.appendChild(kb); centerSlot.remove();
    } else if (heroV === "8") {
      // Rangées en diagonale qui glissent en sens alternés
      var diag = document.createElement("div"); diag.className = "diag";
      for (var r = 0; r < 5; r++) {
        var row = document.createElement("div"); row.className = "diag__row" + (r % 2 ? " diag__row--rev" : "");
        var tr2 = document.createElement("div"); tr2.className = "diag__track";
        var lst = heroPics.slice(r * 3).concat(heroPics.slice(0, r * 3));
        lst.concat(lst).forEach(function (src) { var t = document.createElement("div"); t.className = "diag__tile"; t.appendChild(mkImg(src)); tr2.appendChild(t); });
        row.appendChild(tr2); diag.appendChild(row);
      }
      fx.appendChild(diag); centerSlot.remove();
    } else if (heroV === "9") {
      // Grille qui « respire » : les photos grossissent en vague
      var br = document.createElement("div"); br.className = "breathe";
      for (var q = 0; q < 15; q++) {
        var t = document.createElement("div"); t.className = "breathe__tile";
        t.style.animationDelay = ((q % 3) * .35 + Math.floor(q / 3) * .35) + "s";
        t.appendChild(mkImg(heroPics[q % heroPics.length])); br.appendChild(t);
      }
      fx.appendChild(br); centerSlot.remove();
    } else if (heroV === "10") {
      // Deux grandes colonnes qui coulissent en sens inverse, logo dans un bandeau crème
      var duo = document.createElement("div"); duo.className = "duo";
      [0, 1].forEach(function (ci) {
        var col = document.createElement("div"); col.className = "duo__col" + (ci ? " duo__col--down" : "");
        for (var rep2 = 0; rep2 < 2; rep2++) {
          var tr3 = document.createElement("div"); tr3.className = "duo__track";
          heroPics.filter(function (_, k) { return k % 2 === ci; }).forEach(function (src) { var t = document.createElement("div"); t.className = "duo__tile"; t.appendChild(mkImg(src)); tr3.appendChild(t); });
          col.appendChild(tr3);
        }
        duo.appendChild(col);
      });
      fx.appendChild(duo); centerSlot.remove();
    } else if (heroV === "5") {
      // Deux bandeaux de photos qui glissent en sens inverse
      ["top", "bot"].forEach(function (pos, bi) {
        var band = document.createElement("div"); band.className = "band band--" + pos;
        var tr = document.createElement("div"); tr.className = "band__track";
        var list = heroPics.filter(function (_, k) { return k % 2 === bi; });
        list.concat(list).forEach(function (src) { var t = document.createElement("div"); t.className = "band__tile"; t.appendChild(mkImg(src)); tr.appendChild(t); });
        band.appendChild(tr); fx.appendChild(band);
      });
      centerSlot.remove();
    }
  }

  /* ---------- Accueil : éventail de photos qui tourne ---------- */
  var fan = $("[data-fan]");
  if (fan && heroV === "1") {
    var fpics = (C.heroWall || []).filter(function (m) { return typeof m === "string"; }).slice(0, 7);
    var cards = fpics.map(function (src) {
      var d = document.createElement("div"); d.className = "fan__card";
      var im = new Image(); im.src = src; im.alt = ""; im.decoding = "async"; d.appendChild(im);
      fan.appendChild(d); return d;
    });
    var pos = [-30, -15, 0, 15, 30];
    var fanStep = 0;
    var layoutFan = function () {
      cards.forEach(function (c, k) {
        var slot = (k - fanStep + cards.length * 10) % cards.length;   // 0..n-1
        var vis = slot < pos.length;
        var a = vis ? pos[slot] : 30;
        c.style.transform = "rotate(" + a + "deg) translateY(" + (vis ? Math.abs(a) * .25 : 30) + "px)";
        c.style.opacity = vis ? 1 : 0;
        c.style.zIndex = vis ? 10 - Math.abs(slot - 2) : 0;
      });
    };
    layoutFan();
    if (!reduceMotion) setInterval(function () { fanStep++; layoutFan(); }, 2600);
  }

  /* ---------- Accueil : mur de nail arts qui défile ---------- */
  var wall = $("[data-wall]");
  if (wall) {
    var media = C.heroWall || [];
    var cols = $$(".wall__col", wall);
    cols.forEach(function (col, ci) {
      var mine = media.filter(function (_, k) { return k % cols.length === ci; });
      var make = function () {
        var box = document.createElement("div");
        box.className = "wall__track";
        mine.forEach(function (m) {
          var tile = document.createElement("div");
          tile.className = "wall__tile";
          if (typeof m === "object" && m.video) {
            var v = document.createElement("video");
            v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
            v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.src = m.video;
            tile.appendChild(v);
          } else {
            var im = new Image(); im.src = m; im.alt = ""; im.decoding = "async";
            if (ci > 0 || mine.indexOf(m) > 1) im.loading = "lazy";
            tile.appendChild(im);
          }
          box.appendChild(tile);
        });
        return box;
      };
      // deux pistes identiques pour une boucle sans fin
      col.appendChild(make()); col.appendChild(make());
    });
  }
  var rot = $("[data-rotate]"), lines = C.heroLines || [];
  if (rot && lines.length > 1 && !reduceMotion) {
    var lineIdx = 0;
    setInterval(function () {
      rot.classList.add("is-out");
      setTimeout(function () { lineIdx = (lineIdx + 1) % lines.length; rot.textContent = lines[lineIdx]; rot.classList.remove("is-out"); }, 380);
    }, 2400);
  }

  /* ---------- Pourcentage de réduction ---------- */
  $$("[data-discount]").forEach(function (el) { el.textContent = C.discount || "[xx]"; });

  /* ---------- Couleur du mois ---------- */
  var MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  var colors = C.colors || [];
  var m = new Date().getMonth();
  function luminance(hex) {
    var c = hex.replace("#", "");
    var r = parseInt(c.substr(0, 2), 16), g2 = parseInt(c.substr(2, 2), 16), b = parseInt(c.substr(4, 2), 16);
    return (0.299 * r + 0.587 * g2 + 0.114 * b) / 255;
  }
  var card = $("[data-color-card]");
  if (card && colors[m]) {
    var col = colors[m];
    card.style.setProperty("--month", col.hex);
    card.style.setProperty("--on-month", luminance(col.hex) > 0.6 ? "#4E2E22" : "#FFF4EC");
    $("[data-color-month]").textContent = (/^[AO]/.test(MONTHS[m]) ? "Couleur d'" : "Couleur de ") + MONTHS[m].toLowerCase();
    $("[data-color-name]").textContent = col.name;
    // Frise : uniquement des nuances de la couleur du mois (du foncé au crème)
    var year = $("[data-color-year]");
    var hsl = toHsl(col.hex);
    for (var k = 0; k < 12; k++) {
      var li = document.createElement("li");
      var l = 18 + k * 6.5, sat = Math.max(12, hsl[1] - Math.abs(k - 5) * 3);
      li.style.setProperty("--c", "hsl(" + hsl[0] + " " + sat + "% " + l + "%)");
      if (Math.abs(l - hsl[2]) < 3.3) li.className = "is-current";
      li.setAttribute("aria-hidden", "true");
      year.appendChild(li);
    }
    if (!$(".is-current", year)) year.children[Math.round((hsl[2] - 18) / 6.5)] && year.children[Math.max(0, Math.min(11, Math.round((hsl[2] - 18) / 6.5)))].classList.add("is-current");
    // Louise arrive et pousse le carré quand on descend jusqu'ici : le vernis coule
    if ("IntersectionObserver" in window && !reduceMotion) {
      // La bêtise de Louise se rejoue toutes les 30 secondes
      var STEPS = ["is-pushed", "is-gone", "is-back", "is-fixed", "is-done"];
      var playScene = function () {
        card.classList.remove.apply(card.classList, STEPS);
        void card.offsetWidth;
        card.classList.add("is-pushed");
        setTimeout(function () { card.classList.add("is-gone"); }, 2300);
        setTimeout(function () { card.classList.add("is-back"); }, 4200);
        setTimeout(function () { card.classList.add("is-fixed"); }, 5400);
        setTimeout(function () { card.classList.add("is-done"); }, 6500);
      };
      var push = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting) return;
        playScene();
        setInterval(function () { if (!document.hidden) playScene(); }, 20000);
        push.disconnect();
      }, { threshold: 0.6 });
      push.observe(card);
    } else {
      card.classList.add("is-pushed", "is-gone");
    }
  }

  function toHsl(hex) {
    var c = hex.replace("#", "");
    var r = parseInt(c.substr(0, 2), 16) / 255, g = parseInt(c.substr(2, 2), 16) / 255, bl = parseInt(c.substr(4, 2), 16) / 255;
    var mx = Math.max(r, g, bl), mn = Math.min(r, g, bl), h = 0, sa = 0, li = (mx + mn) / 2;
    if (mx !== mn) {
      var d = mx - mn;
      sa = li > .5 ? d / (2 - mx - mn) : d / (mx + mn);
      h = mx === r ? (g - bl) / d + (g < bl ? 6 : 0) : mx === g ? (bl - r) / d + 2 : (r - g) / d + 4;
      h *= 60;
    }
    return [Math.round(h), Math.round(sa * 100), Math.round(li * 100)];
  }

  /* ---------- Carte Google : bloquée dans l'aperçu Claude, on affiche le lien à la place ---------- */


  /* ---------- Horaires : jour en cours + ouvert / fermé (heure de Corse) ---------- */
  (function () {
    var now;
    try { now = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" })); } catch (e) { now = new Date(); }
    var day = now.getDay(), mins = now.getHours() * 60 + now.getMinutes();
    var row = $('[data-hours] tr[data-day="' + day + '"]');
    if (row) row.classList.add("today");
    var open = day >= 1 && day <= 5 && mins >= 540 && mins < 1020;
    var st = $("[data-status]");
    if (st) { st.textContent = open ? "Ouvert maintenant" : "Fermé"; st.classList.add(open ? "open" : "shut"); }
  })();

  (function () {
    var d; try { d = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" })).getDay(); } catch (e) { d = new Date().getDay(); }
    var li = $('.week li[data-day="' + d + '"]'); if (li) li.classList.add("is-today");
  })();
  var y = $("[data-year]"); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Compteur « + de 7 400 » ---------- */
  function countUp(el) {
    var target = +el.dataset.count, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / 1600), v = Math.round(target * (1 - Math.pow(1 - p, 3)));
      el.textContent = v.toLocaleString("fr-FR").replace(/ | /g, " ");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Apparitions au défilement ---------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        var c = $("[data-count]", e.target); if (c) countUp(c);
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 0.08 + "s";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Intro à l'ouverture (une fois par visite) ---------- */
  var intro = $("[data-intro]");
  function startPage() { requestAnimationFrame(function () { doc.classList.add("is-loaded"); }); }
  if (intro) {
    var seen = false;
    try { seen = sessionStorage.getItem("dilerna-intro") === "1"; } catch (e) {}
    if (seen || reduceMotion) {
      intro.remove();
      startPage();
    } else {
      document.body.classList.add("no-scroll");
      var closed = false;
      var closeIntro = function () {
        if (closed) return;
        closed = true;
        try { sessionStorage.setItem("dilerna-intro", "1"); } catch (e) {}
        intro.classList.add("is-out");
        document.body.classList.remove("no-scroll");
        startPage();
        setTimeout(function () { intro.remove(); }, 950);
      };
      setTimeout(closeIntro, 3400);
      $("[data-intro-skip]", intro).addEventListener("click", closeIntro);
      intro.addEventListener("click", closeIntro);
    }
  } else {
    startPage();
  }
})();
