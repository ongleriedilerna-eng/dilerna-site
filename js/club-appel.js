/* =========================================================================
   DILERNA · Faire remarquer le bouton rond « Club Dilerna » (téléphone)
   Demande de Marie (30/10/2026) : les gens ne voient pas le bouton du club,
   il faut que ce soit la première chose qu'on remarque en arrivant.
   Choix de Marie : C (Louise arrive vite et montre le bouton). Les autres restent visibles avec ?clubv=A, B ou D :
     A · une bulle « Nouveau · Le Club Dilerna » au-dessus du bouton
     B · des ondes dorées qui partent du bouton, et le bouton qui saute
     C · Louise arrive sur la barre du bas et montre le bouton
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
  function louise() {
    var tpl = document.querySelector("[data-louise] svg"); if (!tpl) return bulle();
    var w = document.createElement("div"); w.className = "club-louise"; w.setAttribute("aria-hidden", "true");
    var svg = tpl.cloneNode(true);
    svg.querySelectorAll("rect").forEach(function (r) {
      if (r.getAttribute("width") !== "11") return;
      var x = r.getAttribute("x"); r.classList.add("leg", x === "58" || x === "152" ? "leg--a" : "leg--b");
    });
    w.appendChild(svg); document.body.appendChild(w);
    var stop = Math.max(8, window.innerWidth / 2 - 40 - 76);   // juste à gauche du bouton rond
    var fin = function () {
      w.classList.remove("is-walking"); w.style.transform = "translateX(" + stop + "px)";
      var p = document.createElement("button"); p.type = "button"; p.className = "club-psst";
      p.innerHTML = "Psst… viens voir <b>le Club</b> !";
      p.style.left = Math.max(8, stop - 6) + "px";
      p.addEventListener("click", ouvre); document.body.appendChild(p);
      requestAnimationFrame(function () { requestAnimationFrame(function () { p.classList.add("is-in"); }); });
    };
    if (reduce || !w.animate) return fin();
    w.classList.add("is-walking");
    w.animate([{ transform: "translateX(-90px)" }, { transform: "translateX(" + stop + "px)" }], { duration: 1100, easing: "ease-out", fill: "forwards" }).onfinish = fin;
  }

  // Louise et sa bulle s'effacent quand on descend jusqu'à la Carte blanche, et reviennent quand on remonte (demande de Marie, 31/10/2026)
  var cb = document.getElementById("carte-blanche");
  function cache() {
    var bas = !!cb && cb.getBoundingClientRect().top < window.innerHeight * .9;
    document.querySelectorAll(".club-louise, .club-psst, .club-bulle").forEach(function (e) { e.classList.toggle("club-cache", bas); });
  }
  addEventListener("scroll", cache, { passive: true });

  quandPret(function () {
    if (V === "A") bulle();
    else if (V === "B") ondes();
    else if (V === "C") louise();
    else { bulle(); ondes(); }
    setTimeout(cache, 50);
  });

  // toutes les 9 secondes, si Louise et sa bulle ne sont plus là (on a descendu la page), le bouton fait coucou
  if (!reduce) setInterval(function () {
    if (document.hidden || document.querySelector("dialog[open]")) return;
    var b = document.querySelector(".club-psst, .club-bulle");
    if (b && !b.classList.contains("club-cache")) return;
    btn.classList.remove("club-coucou"); void btn.offsetWidth; btn.classList.add("club-coucou");
    setTimeout(function () { btn.classList.remove("club-coucou"); }, 1700);
  }, 9000);
})();
