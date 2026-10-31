/* =========================================================================
   DILERNA · Faire remarquer le bouton rond « Club Dilerna » (téléphone)
   Demande de Marie (30/10/2026) : les gens ne voient pas le bouton du club,
   il faut que ce soit la première chose qu'on remarque en arrivant.
   Choix de Marie : C (Louise arrive vite et montre le bouton). Les autres restent visibles avec ?clubv=A, B ou D :
     A · une bulle « Nouveau · Le Club Dilerna » au-dessus du bouton
     B · des ondes dorées qui partent du bouton, et le bouton qui saute
     C · Louise arrive sur la barre du bas et montre le bouton (une fois le bloc « Prendre rendez-vous » passé)
     D · A + B
   ========================================================================= */
(function () {
  "use strict";
  if (window.matchMedia && window.matchMedia("(min-width: 1024px)").matches) return;   // ordinateur : rien ne change
  var btn = document.querySelector(".tab-rdv[data-club-open]");
  if (!btn) return;
  var m = /[?&]clubv=([A-D])/.exec(location.search);
  var V = m ? m[1] : "C";   // choix de Marie (30/10/2026) : C, Louise qui arrive vite et montre le bouton
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var css = [
    /* A · la bulle */
    ".club-bulle { position: fixed; z-index: 61; left: 50%; bottom: calc(env(safe-area-inset-bottom, 0px) + 86px); transform: translateX(-50%) scale(.4); opacity: 0;",
    "  display: flex; align-items: center; gap: 7px; padding: 10px 16px 10px 14px; border: 0; border-radius: 999px; background: #4E2E22; color: #FBF7F3;",
    "  font: 700 13.5px/1 var(--font-body); white-space: nowrap; box-shadow: 0 12px 24px -12px rgba(33, 2, 2, .8); cursor: pointer; -webkit-tap-highlight-color: transparent;",
    "  transition: transform .5s cubic-bezier(.3, 1.6, .5, 1), opacity .3s; }",
    ".club-bulle.is-in { opacity: 1; transform: translateX(-50%) scale(1); }",
    ".club-bulle.is-in.is-vole { animation: clubBulle 2.4s ease-in-out infinite; }",
    ".club-bulle::after { content: ''; position: absolute; left: 50%; bottom: -6px; width: 14px; height: 14px; margin-left: -7px; background: #4E2E22; border-radius: 3px; transform: rotate(45deg); }",
    ".club-bulle b { font: 700 15px/1 'Fraunces', Georgia, serif; font-variation-settings: 'SOFT' 100; color: #F3DDB8; }",
    ".club-bulle i { font-style: normal; color: #E8C9A0; animation: clubEtoile 1.4s ease-in-out infinite; }",
    "@keyframes clubBulle { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-5px); } }",
    "@keyframes clubEtoile { 0%, 100% { opacity: .35; transform: scale(.7) rotate(0); } 50% { opacity: 1; transform: scale(1.2) rotate(30deg); } }",
    /* B · les ondes et le saut */
    ".tab-rdv.club-ondes::before, .tab-rdv.club-ondes::after { content: ''; position: absolute; inset: 4px; border-radius: 50%; border: 2.5px solid #D9A86C; opacity: 0; pointer-events: none;",
    "  animation: clubOnde 2.4s ease-out infinite; }",
    ".tab-rdv.club-ondes::after { animation-delay: 1.2s; }",
    "@keyframes clubOnde { 0% { transform: scale(.95); opacity: .9; } 100% { transform: scale(1.75); opacity: 0; } }",
    ".tab-rdv.club-saute { animation: clubSaut 3.2s ease-in-out infinite; }",
    "@keyframes clubSaut { 0%, 70%, 100% { transform: translateY(0) rotate(0); } 76% { transform: translateY(-9px) rotate(-6deg); } 82% { transform: translateY(0) rotate(4deg); } 88% { transform: translateY(-4px) rotate(-2deg); } 94% { transform: translateY(0) rotate(0); } }",
    /* C · Louise */
    ".club-louise { position: fixed; z-index: 61; bottom: calc(env(safe-area-inset-bottom, 0px) + 56px); left: 0; width: 70px; pointer-events: none; transform: translateX(-90px); }",
    ".club-louise svg { display: block; width: 100%; fill: var(--teckel, #6E4A32); overflow: visible; filter: drop-shadow(0 3px 4px rgba(33, 2, 2, .22)); }",
    ".club-louise .leg { transform-box: fill-box; transform-origin: 50% 0; }",
    ".club-louise.is-walking .leg--a { animation: clubPatte .3s ease-in-out infinite alternate; }",
    ".club-louise.is-walking .leg--b { animation: clubPatte .3s ease-in-out infinite alternate-reverse; }",
    ".club-louise .teckel__tail { animation: wag .3s ease-in-out infinite alternate; }",
    "@keyframes clubPatte { from { transform: rotate(-22deg); } to { transform: rotate(22deg); } }",
    ".club-psst { position: fixed; z-index: 61; bottom: calc(env(safe-area-inset-bottom, 0px) + 104px); left: calc(50% - 168px); padding: 8px 12px; border: 0; border-radius: 16px 16px 16px 4px;",
    "  background: #FFFDF8; color: #4E2E22; font: 700 13px/1.2 var(--font-body); box-shadow: 0 0 0 1.5px #D5C6AF, 0 10px 20px -12px rgba(33, 2, 2, .6); opacity: 0; transform: scale(.4); transform-origin: 0 100%;",
    "  transition: transform .45s cubic-bezier(.3, 1.6, .5, 1), opacity .25s; cursor: pointer; }",
    ".club-psst.is-in { opacity: 1; transform: scale(1); }",
    ".club-psst:not(.is-in) { pointer-events: none; }",
    ".club-psst b { color: #6B3418; }",
    ".club-cache { opacity: 0 !important; pointer-events: none !important; transition: opacity .35s !important; }",
    /* de temps en temps, le bouton rond fait coucou (petit saut + une onde dorée) quand Louise n'est plus là */
    ".tab-rdv.club-coucou { animation: clubCoucou 1.3s ease-in-out 1; }",
    ".tab-rdv.club-coucou::before, .tab-rdv.club-coucou::after { content: ''; position: absolute; inset: 4px; border-radius: 50%; border: 2.5px solid #D9A86C; opacity: 0; pointer-events: none; animation: clubOnde 1.3s ease-out 1; }",
    ".tab-rdv.club-coucou::after { animation-delay: .35s; }",
    "@keyframes clubCoucou { 0%, 100% { transform: none; } 20% { transform: translateY(-11px) rotate(-6deg) scale(1.06); } 42% { transform: translateY(0) rotate(4deg); } 62% { transform: translateY(-4px) rotate(-2deg); } 80% { transform: none; } }",
    "@media (prefers-reduced-motion: reduce) { .club-bulle, .club-bulle i, .tab-rdv.club-ondes::before, .tab-rdv.club-ondes::after, .tab-rdv.club-saute { animation: none !important; } }"
  ].join("\n");
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var ouvre = function () { btn.click(); };
  // on attend la fin de l'écran d'accueil (intro), puis un petit moment
  function quandPret(fn) {
    var go = function () { setTimeout(fn, 150); };
    if (document.documentElement.classList.contains("is-loaded")) return go();
    var mo = new MutationObserver(function () { if (document.documentElement.classList.contains("is-loaded")) { mo.disconnect(); go(); } });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  }

  function bulle() {
    var b = document.createElement("button"); b.type = "button"; b.className = "club-bulle";
    b.innerHTML = '<i aria-hidden="true">✦</i>Nouveau · <b>Le Club Dilerna</b><i aria-hidden="true">✦</i>';
    b.addEventListener("click", ouvre); document.body.appendChild(b);
    requestAnimationFrame(function () { requestAnimationFrame(function () { b.classList.add("is-in"); setTimeout(function () { b.classList.add("is-vole"); }, 600); }); });
  }
  function ondes() { btn.classList.add("club-ondes"); if (!reduce) btn.classList.add("club-saute"); }
  // Louise (choix C) : elle entre en trottinant jusqu'au bouton rond, dit « Psst… viens voir le Club ! », puis repart (demi-tour, vers la gauche)
  var lou = null, psst = null, etatLou = "dehors", anim = null;
  var stop = Math.max(8, window.innerWidth / 2 - 40 - 76);   // juste à gauche du bouton rond
  function creer() {
    if (lou) return true;
    var tpl = document.querySelector("[data-louise] svg"); if (!tpl) return false;
    lou = document.createElement("div"); lou.className = "club-louise"; lou.setAttribute("aria-hidden", "true");
    var svg = tpl.cloneNode(true);
    svg.querySelectorAll("rect").forEach(function (r) {
      if (r.getAttribute("width") !== "11") return;
      var x = r.getAttribute("x"); r.classList.add("leg", x === "58" || x === "152" ? "leg--a" : "leg--b");
    });
    lou.appendChild(svg); document.body.appendChild(lou);
    psst = document.createElement("button"); psst.type = "button"; psst.className = "club-psst";
    psst.innerHTML = "Psst… viens voir <b>le Club</b> !";
    psst.style.left = Math.max(8, stop - 6) + "px";
    psst.addEventListener("click", ouvre); document.body.appendChild(psst);
    return true;
  }
  function ici() { var t = getComputedStyle(lou).transform; return t && t !== "none" ? new DOMMatrix(t).m41 : -90; }
  function marche(versX, duree, demiTour, fin) {
    var depuis = ici();
    if (anim) anim.cancel();
    lou.style.transform = "translateX(" + depuis + "px)";
    lou.firstElementChild.style.transform = demiTour ? "scaleX(-1)" : "";
    if (reduce || !lou.animate) { lou.style.transform = "translateX(" + versX + "px)"; return fin(); }
    lou.classList.add("is-walking");
    anim = lou.animate([{ transform: "translateX(" + depuis + "px)" }, { transform: "translateX(" + versX + "px)" }], { duration: duree, easing: demiTour ? "ease-in" : "ease-out" });
    anim.onfinish = function () { anim = null; lou.style.transform = "translateX(" + versX + "px)"; lou.classList.remove("is-walking"); fin(); };
  }
  function entrer() {
    if (etatLou === "dedans" || etatLou === "entre" || !creer()) return;
    etatLou = "entre"; arrivee = true;
    marche(stop, 1100, false, function () { etatLou = "dedans"; lou.firstElementChild.style.transform = ""; psst.classList.add("is-in"); });
  }
  function sortir() {
    if (!lou || etatLou === "dehors" || etatLou === "sort") return;
    etatLou = "sort"; psst.classList.remove("is-in");
    marche(-90, 900, true, function () { etatLou = "dehors"; lou.firstElementChild.style.transform = ""; });
  }

  // Où Louise est là (Marie, 31/10/2026) : elle arrive à la carte « Pose américaine », repart quand on voit la Carte blanche,
  // revient à « A propos » et repart quand on a fini de lire « A propos ».
  var cb = document.getElementById("carte-blanche"), apropos = document.getElementById("a-propos"), pret = false, arrivee = false;
  var pose = Array.prototype.filter.call(document.querySelectorAll("#prestations h3"), function (h) { return /Pose am/.test(h.textContent); })[0];
  function cache() {
    var H = window.innerHeight;
    if (V === "C") {
      if (!pret) return;
      var z1 = !!pose && pose.getBoundingClientRect().top < H * .75 && !(cb && cb.getBoundingClientRect().top < H * .9);
      var a = apropos && apropos.getBoundingClientRect(), z2 = !!a && a.top < H * .75 && a.bottom > H * .55;
      if (z1 || z2) entrer(); else sortir();
      return;
    }
    var bas = !!cb && cb.getBoundingClientRect().top < H * .9;
    document.querySelectorAll(".club-bulle").forEach(function (e) { e.classList.toggle("club-cache", bas); });
  }
  addEventListener("scroll", cache, { passive: true });

  quandPret(function () {
    pret = true;
    if (V === "A") bulle();
    else if (V === "B") ondes();
    else if (V === "D") { bulle(); ondes(); }
    setTimeout(cache, 50);
  });

  // Le bouton fait coucou (petit saut + onde dorée), choix de Marie (31/10/2026) :
  // dès l'ouverture du site, puis 3 s après, puis de moins en moins souvent ; plus du tout une fois que Louise est venue
  // (« Psst… viens voir le Club ! ») ; et un tout dernier coucou en arrivant à « A propos ». Ensuite, c'est fini.
  function coucou() {
    if (document.hidden || document.querySelector("dialog[open]")) return;
    btn.classList.remove("club-coucou"); void btn.offsetWidth; btn.classList.add("club-coucou");
    setTimeout(function () { btn.classList.remove("club-coucou"); }, 1700);
  }
  if (!reduce) {
    var PAUSES = [3000, 5000, 8000, 12000, 18000, 25000], n = 0;
    var suivant = function () {
      if (arrivee) return;   // Louise est venue : on arrête
      coucou();
      setTimeout(suivant, PAUSES[Math.min(n++, PAUSES.length - 1)]);
    };
    quandPret(function () { setTimeout(suivant, 400); });
    var dernier = false;
    if (apropos) addEventListener("scroll", function () {
      if (dernier || apropos.getBoundingClientRect().top > window.innerHeight * .8) return;
      dernier = true; arrivee = true; coucou();
    }, { passive: true });
  }
})();
