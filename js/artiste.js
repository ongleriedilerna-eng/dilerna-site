/* =========================================================================
   DILERNA · « Artiste ongulaire » à l'accueil (téléphone)
   Demande de Marie (30/10/2026) : qu'on comprenne tout de suite ce qu'est Dilerna.
   Ça se voit dès l'arrivée sur le site (pas à la fin de l'animation).
   Aperçu des idées (2e série) : ?ao=1 à 5 dans l'adresse.
     1 · « ARTISTE ONGULAIRE · PORTO-VECCHIO » sous le logo, dans la même écriture que la ligne du haut (CHOISI)
     2 · un sticker crème penché, tenu par deux washi à pois, sur le socle du logo
     3 · un ruban chocolat qui défile sur le socle du logo
     4 · un tampon rond qui tourne doucement, à droite du logo
     5 · une pastille chocolat sur le socle du logo
   ========================================================================= */
(function () {
  "use strict";
  if (window.matchMedia && window.matchMedia("(min-width: 1024px)").matches) return;   // ordinateur : rien ne change
  var sec = document.querySelector("[data-pour]"), stage = sec && sec.querySelector(".pour__stage"), canvas = sec && sec.querySelector("[data-canvas]");
  if (!stage || !canvas) return;
  var m = /[?&]ao=([1-5])/.exec(location.search);
  var V = m ? m[1] : "1";   // choix de Marie (31/10/2026) : l'idée 1, même écriture que la ligne du haut, mais sous le logo

  // le logo dans l'image 3D (1080 × 2340) : centre x = 540, bas des lettres y ≈ 1695, face du socle de 1700 à 1800
  var W = 1080, H = 2340, Y = V === "4" ? 1450 : 1752, X = V === "4" ? 880 : 540;

  var css = [
    ".ao { position: absolute; z-index: 3; pointer-events: none; transform: translate(-50%, -50%); }",
    ".ao > * { opacity: 0; }",
    ".ao.is-in > * { opacity: 1; }",
    /* 2 · sticker penché */
    ".ao--2 .st { position: relative; display: block; padding: 9px 18px 8px; border-radius: 12px; background: #FFFDF8; color: #4E2E22; white-space: nowrap;",
    "  font: 800 19px/1 'Fraunces', Georgia, serif; font-variation-settings: 'SOFT' 100, 'opsz' 144; box-shadow: 0 10px 18px -10px rgba(78, 46, 34, .7), 0 0 0 1px #EADFD2;",
    "  transform: rotate(-3deg) scale(.6); transition: opacity .3s, transform .55s cubic-bezier(.3, 1.6, .5, 1); }",
    ".ao--2.is-in .st { transform: rotate(-3deg) scale(1); }",
    ".ao--2 .st i { position: absolute; top: -8px; width: 34px; height: 14px; border-radius: 2px; opacity: .95;",
    "  background: radial-gradient(circle, #8A6650 1.4px, transparent 1.8px) 0 0 / 8px 8px, rgb(232, 214, 196); }",
    ".ao--2 .st i:first-child { left: -8px; transform: rotate(-24deg); } .ao--2 .st i:last-child { right: -8px; transform: rotate(20deg); }",
    /* 3 · ruban chocolat qui défile */
    ".ao--3 { left: 0 !important; right: 0; transform: translateY(-50%); overflow: hidden; }",
    ".ao--3 .rb { display: flex; width: max-content; padding: 8px 0; background: #4E2E22; color: #F8F4EC; font: 800 12.5px/1 var(--font-body); letter-spacing: .26em;",
    "  box-shadow: 0 8px 16px -10px rgba(33, 2, 2, .8); animation: aoRuban 14s linear infinite; transition: opacity .6s; }",
    ".ao--3 .rb span { padding-right: 18px; white-space: nowrap; } .ao--3 .rb i { font-style: normal; color: #E8C9A0; margin-left: 18px; }",
    "@keyframes aoRuban { to { transform: translateX(-50%); } }",
    /* 4 · tampon rond */
    ".ao--4 svg { display: block; width: 124px; height: 124px; transition: opacity .6s; }",
    ".ao--4 .tp-rond { transform-origin: 50px 50px; animation: aoTourne 16s linear infinite; }",
    ".ao--4 text { font: 800 8.8px var(--font-body); letter-spacing: 1px; fill: #4E2E22; }",
    "@keyframes aoTourne { to { transform: rotate(360deg); } }",
    /* 5 · pastille chocolat avec un reflet */
    ".ao--5 .pc { position: relative; overflow: hidden; display: block; padding: 9px 16px 8px; border-radius: 999px; background: #4E2E22; color: #F8F4EC; white-space: nowrap;",
    "  font: 800 12.5px/1 var(--font-body); letter-spacing: .26em; box-shadow: 0 0 0 1.5px #E8C9A0, 0 10px 18px -10px rgba(33, 2, 2, .8); transform: scale(.6);",
    "  transition: opacity .3s, transform .55s cubic-bezier(.3, 1.6, .5, 1); }",
    ".ao--5.is-in .pc { transform: scale(1); }",
    ".ao--5 .pc i { font-style: normal; color: #E8C9A0; margin: 0 7px; }",
    ".ao--5 .pc::after { content: ''; position: absolute; inset: 0; background: linear-gradient(110deg, transparent 35%, rgba(255, 240, 215, .45) 50%, transparent 65%) -150% 0 / 220% 100% no-repeat;",
    "  animation: aoReflet 3.2s ease-in-out infinite; }",
    "@keyframes aoReflet { 0%, 50% { background-position: -150% 0; } 85%, 100% { background-position: 150% 0; } }",
    /* 1 · même écriture que la ligne du haut (« PORTO-VECCHIO, CORSE-DU-SUD »), sous le logo */
    ".ao--1 .ln { display: block; white-space: nowrap; font: 500 11.5px/1 var(--font-body); letter-spacing: .24em; padding-left: .24em; text-transform: uppercase; color: #6E4A32;",
    "  transform: translateY(6px); transition: opacity .8s, transform .8s cubic-bezier(.2, .8, .2, 1); }",
    ".ao--1 .ln b { font-weight: 800; color: #4E2E22; }",
    ".ao--1.is-in .ln { transform: none; }",
    "@media (prefers-reduced-motion: reduce) { .ao * { animation: none !important; transition: none !important; } }"
  ].join("\n");
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var el = document.createElement("div"); el.className = "ao ao--" + V; el.setAttribute("aria-hidden", "true");
  if (V === "1") el.innerHTML = '<span class="ln"><b>Artiste ongulaire</b> · Porto-Vecchio</span>';
  else if (V === "2") el.innerHTML = '<span class="st"><i></i>Artiste ongulaire<i></i></span>';
  else if (V === "3") {
    var bout = '<span>ARTISTE ONGULAIRE<i>✦</i></span><span>PORTO-VECCHIO<i>✦</i></span>';
    el.innerHTML = '<div class="rb">' + bout + bout + bout + bout + bout + bout + '</div>';
  }
  else if (V === "4") el.innerHTML = '<svg viewBox="0 0 100 100"><defs><path id="ao-rond" d="M50 50 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1 -72 0"/></defs>' +
    '<circle cx="50" cy="50" r="48" fill="#FFFDF8" stroke="#D5C6AF" stroke-width="1.5"/><circle cx="50" cy="50" r="26" fill="#F2E8E1"/>' +
    '<g class="tp-rond"><text><textPath href="#ao-rond" textLength="222" lengthAdjust="spacing">ARTISTE ONGULAIRE · PORTO-VECCHIO · </textPath></text></g>' +
    '<g transform="translate(43 34)"><rect x="3" y="0" width="8" height="10" rx="2" fill="#2B1A10"/><rect x="0" y="9" width="14" height="22" rx="5" fill="#6B3418"/><rect x="3" y="13" width="2.5" height="12" rx="1.2" fill="rgba(255,255,255,.4)"/></g></svg>';
  else el.innerHTML = '<span class="pc"><i>✦</i>ARTISTE ONGULAIRE<i>✦</i></span>';
  stage.appendChild(el);

  // même calcul que pour.js (« cover ») : on place l'élément sur le logo
  function place() {
    var r = canvas.getBoundingClientRect(), s = Math.max(r.width / W, r.height / H);
    el.style.top = Math.round((r.height - H * s) / 2 + Y * s) + "px";
    if (V !== "3") el.style.left = Math.round((r.width - W * s) / 2 + X * s) + "px";
  }
  place(); addEventListener("resize", place);
  var montre = function () { place(); requestAnimationFrame(function () { el.classList.add("is-in"); }); };
  // tout de suite : dès que l'écran d'accueil (intro) disparaît
  if (document.documentElement.classList.contains("is-loaded")) setTimeout(montre, 150);
  else new MutationObserver(function (l, mo) { if (document.documentElement.classList.contains("is-loaded")) { mo.disconnect(); setTimeout(montre, 150); } })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
})();
