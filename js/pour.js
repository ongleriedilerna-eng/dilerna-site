/* =========================================================================
   DILERNA · Accueil animé
   Séquence 3D rendue sous Blender (100 images, décor compris) qui se joue
   toute seule : le flacon se dévisse, se penche, remplit le logo en verre,
   puis le moule disparaît.
   Toucher l'animation la rejoue.
   ========================================================================= */
(function () {
  "use strict";
  var sec = document.querySelector("[data-pour]");
  if (!sec) return;
  var canvas = sec.querySelector("[data-canvas]"), ctx = canvas.getContext("2d");
  var reveals = sec.querySelectorAll("[data-reveal]");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // séquence HD avec décor : 1080×2340 (la définition d'un écran de téléphone), qui remplit l'écran (« cover »)
  var N = 100, W = 1080, H = 2340, FPS = 18, COVER = true;
  // mise en page : infos en haut (par défaut) ou en bas (#…bas dans l'adresse)
  if (/bas/.test(location.hash)) sec.classList.add("pour--bas");
  var dir = "assets/hero3d/";
  // sur ordinateur (1024 px et plus) : une version en largeur, plus nette, avec le vernis marron ; le téléphone garde la sienne
  // qualité maximale : rendu en 4K ; 2560×1440 pour la plupart des écrans, la vraie 4K pour les grands écrans et les écrans Retina
  if (window.matchMedia && window.matchMedia("(min-width: 1024px)").matches) {
    var big = window.innerWidth * Math.min(window.devicePixelRatio || 1, 3) > 2700;
    dir = big ? "assets/hero3d-ordi-4k/" : "assets/hero3d-ordi/"; W = big ? 3840 : 2560; H = big ? 2160 : 1440;
  }
  var src = function (i) { return dir + "f" + ("00" + i).slice(-3) + ".webp"; };
  var frames = new Array(N), loaded = 0;

  // chargement : la première image d'abord, puis toutes les autres
  function load(i, cb) {
    var img = new Image();
    img.decoding = "async";
    img.onload = function () { frames[i] = img; loaded++; cb && cb(); };
    img.onerror = function () { loaded++; cb && cb(); };
    img.src = src(i);
  }

  // canvas net (densité d'écran), l'image remplit tout l'écran (« cover »)
  var cw = 0, ch = 0;
  function size() {
    var r = canvas.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 3);
    cw = Math.round(r.width * dpr); ch = Math.round(r.height * dpr);
    if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
    draw(shown, true);
  }

  var shown = 0;
  function draw(i, force) {
    // si l'image n'est pas encore arrivée, on garde la précédente
    while (i > 0 && !frames[i]) i--;
    if (!frames[i] || (i === shown && !force)) return;
    shown = i;
    var s = (COVER ? Math.max : Math.min)(cw / W, ch / H), dw = W * s, dh = H * s;
    ctx.clearRect(0, 0, cw, ch);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(frames[i], (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }

  function reveal(on) {
    reveals.forEach(function (el, i) {
      clearTimeout(el._t);
      if (on) el._t = setTimeout(function () { el.classList.add("in"); }, i * 140);
      else el.classList.remove("in");
    });
  }

  // lecture : une fois, puis on reste sur l'image finale
  var playing = false, start = 0, raf = 0;
  function tick(now) {
    if (!start) start = now;
    var i = Math.min(N - 1, Math.floor((now - start) / 1000 * FPS));
    draw(i);
    if (i < N - 1) raf = requestAnimationFrame(tick);
    else playing = false;
  }
  function play() {
    if (playing) return;
    playing = true; start = 0;
    raf = requestAnimationFrame(tick);
  }

  window.addEventListener("resize", size);
  size();
  reveal(true);           // les infos sont en haut dès l'arrivée

  if (reduce) {
    load(N - 1, function () { draw(N - 1, true); reveal(true); });
    return;
  }

  load(0, function () {
    draw(0, true);
    for (var i = 1; i < N; i++) load(i, ready);
  });
  var started = false;
  function ready() {
    if (started || loaded < N) return;
    started = true;
    // on attend que l'accueil soit visible pour lancer l'animation
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { io.disconnect(); setTimeout(play, 350); }
      }, { threshold: 0.4 });
      io.observe(sec);
    } else setTimeout(play, 350);
  }

  // toucher l'animation la rejoue
  canvas.style.cursor = "pointer";
  canvas.addEventListener("click", function () { if (!playing) play(); });
})();
