/* =========================================================================
   DILERNA · Faire voir « Touche pour voir mes Cartes blanches » (téléphone)
   Demande de Marie (31/10/2026) : les gens ne voient pas ce bouton et ne comprennent pas
   qu'en le touchant, on voit ses vraies Cartes blanches.
   Marie a choisi l'idée des ronds des thèmes (Jack, Beetlejuice…) ; 5 versions (aperçu : ?cbv=1 à 5) :
     1 · carte chocolat, ronds bordés d'or, reflet (CHOISIE, sans la petite main)
     2 · ronds en éventail, en arc
     3 · ronds qui défilent, avec le bouton dessous
     4 · ronds qui flottent autour du bouton
     5 · grille des thèmes avec leur nom (on touche un thème, on voit cette Carte blanche)
   ========================================================================= */
(function () {
  "use strict";
  if (window.matchMedia && window.matchMedia("(min-width: 1024px)").matches) return;   // ordinateur : rien ne change
  var flip = document.querySelector("[data-cb-flip]"), btn = flip && flip.querySelector(".cb-flip__btn");
  var list = ((window.DILERNA || {}).carteBlanche || []).filter(function (c) { return c.resultat; });
  if (!flip || !btn || !list.length) return;
  var m = /[?&]cbv=([1-5])/.exec(location.search);
  var V = m ? m[1] : "1";   // choix de Marie (31/10/2026) : la 1, carte chocolat, sans la main
  var MAIN = '<svg class="cbv-main" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 11.5V5.2a1.6 1.6 0 0 1 3.2 0V11l.8-.2a1.6 1.6 0 0 1 1.9.9l.3-.1a1.6 1.6 0 0 1 1.9 1 1.5 1.5 0 0 1 2 1.4v3.3a5 5 0 0 1-5 5h-1.5a5 5 0 0 1-4.3-2.4L6.3 16a1.5 1.5 0 0 1 2.5-1.7l.7.9Z" fill="#FFFDF8" stroke="#4E2E22" stroke-width="1.2" stroke-linejoin="round"/><path d="M9.6 6.4C9.4 3.6 11.1 1 11.1 1s1.7 2.6 1.5 5.4Z" fill="#6B3418"/></svg>';
  var TXT = "Touche pour voir mes Cartes blanches";

  var css = [
    "[class*='cbv-']:not(.is-flipped) .cb-flip__btn { display: none; }",
    ".cb-flip.is-flipped .cbv { display: none !important; }",
    ".cbv { -webkit-tap-highlight-color: transparent; border: 0; cursor: pointer; color: #4E2E22; }",
    ".cbv-main { width: 26px; height: 26px; flex: none; transform-origin: 50% 90%; animation: cbvTape 1.4s ease-in-out infinite; }",
    "@keyframes cbvTape { 0%, 55%, 100% { transform: translateY(0) rotate(0); } 70% { transform: translateY(-5px) rotate(-8deg); } 82% { transform: translateY(1px) scale(.92); } }",
    ".cbv .rd { display: block; border-radius: 50%; object-fit: cover; background: #fff; }",
    "@keyframes cbvSaute { 0%, 70%, 100% { transform: translateY(0); } 80% { transform: translateY(-6px); } 90% { transform: translateY(0); } }",
    /* 1 · carte chocolat */
    ".cbv--1 { position: relative; overflow: hidden; display: grid; justify-items: center; gap: 11px; width: 100%; margin: 14px 0 0; padding: 16px 14px 15px; border-radius: 22px;",
    "  background: linear-gradient(150deg, #5A3626, #2B1A10); color: #F8F4EC; box-shadow: 0 0 0 1.5px #C9A27A, 0 14px 24px -14px rgba(33, 2, 2, .8); }",
    ".cbv--1::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(110deg, transparent 35%, rgba(255, 240, 215, .22) 50%, transparent 65%) -150% 0 / 220% 100% no-repeat; animation: cbvReflet 3s ease-in-out infinite; }",
    "@keyframes cbvReflet { 0%, 45% { background-position: -150% 0; } 85%, 100% { background-position: 150% 0; } }",
    ".cbv--1 .rds { display: flex; }",
    ".cbv--1 .rd { width: 46px; height: 46px; margin-left: -9px; box-shadow: 0 0 0 2.5px #E8C9A0, 0 4px 8px -3px rgba(0, 0, 0, .6); animation: cbvSaute 2.4s ease-in-out infinite; }",
    ".cbv--1 .rd:first-child { margin-left: 0; }",
    ".cbv--1 .tx { display: flex; align-items: center; gap: 8px; font: 800 14.5px/1.2 var(--font-body); }",
    ".cbv--1 small { font-size: 12px; color: #E8C9A0; }",
    /* 2 · éventail en arc */
    ".cbv--2 { display: grid; justify-items: center; gap: 4px; width: 100%; margin: 12px 0 0; padding: 6px 0 2px; background: none; }",
    ".cbv--2 .arc { position: relative; width: 300px; height: 92px; }",
    ".cbv--2 .rd { position: absolute; left: 50%; bottom: 0; width: 52px; height: 52px; margin-left: -26px; transform-origin: 50% 190px; box-shadow: 0 0 0 3px #FFFDF8, 0 6px 10px -5px rgba(33, 2, 2, .55);",
    "  transition: transform .7s cubic-bezier(.3, 1.4, .5, 1); }",
    ".cbv--2 .tx { display: inline-flex; align-items: center; gap: 8px; margin-top: 6px; padding: 12px 18px; border-radius: 999px; background: #4E2E22; color: #F8F4EC; font: 800 14px/1 var(--font-body); }",
    /* 3 · ronds qui défilent + bouton par-dessus */
    ".cbv--3 { position: relative; display: block; width: calc(100% + 2 * var(--gutter, 20px)); margin: 14px calc(-1 * var(--gutter, 20px)) 0; padding: 0; background: none; }",
    ".cbv--3 .lg { display: block; overflow: hidden; padding: 6px 0; -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); }",
    ".cbv--3 .lg > span { display: flex; gap: 10px; width: max-content; animation: cbvDefile 14s linear infinite; }",
    ".cbv--3 .rd { width: 58px; height: 58px; box-shadow: 0 0 0 3px #FFFDF8, 0 5px 9px -5px rgba(33, 2, 2, .5); }",
    "@keyframes cbvDefile { to { transform: translateX(calc(-50% - 5px)); } }",
    ".cbv--3 { display: grid !important; justify-items: center; gap: 8px; }",
    ".cbv--3 .tx { display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; padding: 12px 16px;",
    "  border-radius: 999px; background: #4E2E22; color: #F8F4EC; font: 800 13.5px/1 var(--font-body); box-shadow: 0 0 0 3px #FFFDF8, 0 10px 18px -10px rgba(33, 2, 2, .9); }",
    /* 4 · ronds qui flottent autour du bouton */
    ".cbv--4 { position: relative; display: block; width: 100%; height: 150px; margin: 10px 0 0; background: none; }",
    ".cbv--4 .rd { position: absolute; width: 44px; height: 44px; box-shadow: 0 0 0 3px #FFFDF8, 0 5px 9px -5px rgba(33, 2, 2, .5); animation: cbvFlotte 3s ease-in-out infinite; }",
    "@keyframes cbvFlotte { 0%, 100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-7px) rotate(3deg); } }",
    ".cbv--4 .tx { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; padding: 13px 18px;",
    "  border-radius: 999px; background: #4E2E22; color: #F8F4EC; font: 800 14px/1 var(--font-body); box-shadow: 0 12px 20px -12px rgba(33, 2, 2, .9); }",
    /* 5 · grille des thèmes avec leur nom */
    ".cbv--5 { display: grid; gap: 12px; width: 100%; margin: 14px 0 0; padding: 14px 12px 14px; border-radius: 22px; background: #FFFDF8; box-shadow: 0 0 0 1.5px #D5C6AF; cursor: default; }",
    ".cbv--5 .tx { display: flex; align-items: center; justify-content: center; gap: 8px; font: 800 14.5px/1.2 var(--font-body); }",
    ".cbv--5 .gr { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px 6px; }",
    ".cbv--5 .th { display: grid; justify-items: center; gap: 6px; padding: 0; border: 0; background: none; cursor: pointer; color: #4E2E22; font: 700 11.5px/1.15 var(--font-body); }",
    ".cbv--5 .rd { width: 58px; height: 58px; box-shadow: 0 0 0 3px #F2E8E1, 0 5px 9px -5px rgba(33, 2, 2, .5); animation: cbvSaute 2.8s ease-in-out infinite; }",
    "@media (prefers-reduced-motion: reduce) { .cbv *, .cbv, .cbv::after { animation: none !important; } }"
  ].join("\n");
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  flip.classList.add("cbv-" + V);

  // ouvre le dos de la carte, et va à la Carte blanche n° k (si on a touché un thème)
  function ouvre(k) {
    if (!flip.classList.contains("is-flipped")) btn.click();
    var car = flip.querySelector("[data-cb-car]");
    if (car && k > 0) setTimeout(function () { car.scrollLeft = k * (car.clientWidth + 10); }, 60);
  }
  var th = list.map(function (c, i) { return { src: c.demande || c.resultat, nom: c.titre || c.theme || "", k: i }; });
  var rond = function (t) { return '<img class="rd" src="' + t.src + '" alt="" data-k="' + t.k + '">'; };
  var el = document.createElement(V === "5" ? "div" : "button"); if (V !== "5") el.type = "button";
  el.className = "cbv cbv--" + V;

  if (V === "1") {
    el.innerHTML = '<span class="rds">' + th.map(rond).join("") + '</span><span class="tx">' + TXT + "</span><small>" + list.length + " vraies créations, du thème au résultat</small>";
    el.querySelectorAll(".rd").forEach(function (im, i) { im.style.animationDelay = (i * .15) + "s"; });
  } else if (V === "2") {
    el.innerHTML = '<span class="arc">' + th.map(rond).join("") + '</span><span class="tx">' + MAIN + TXT + "</span>";
    var rds = el.querySelectorAll(".rd"), ouvert = false, pose = function () {
      ouvert = !ouvert;
      rds.forEach(function (im, i) { var a = (i - (rds.length - 1) / 2) * (ouvert ? 15 : 9); im.style.transform = "rotate(" + a + "deg)"; });
    };
    pose(); setInterval(pose, 1600);
  } else if (V === "3") {
    var rs = th.map(rond).join("");
    el.innerHTML = '<span class="lg"><span>' + rs + rs + rs + "</span></span>" + '<span class="tx">' + MAIN + TXT + "</span>";
  } else if (V === "4") {
    el.innerHTML = th.map(rond).join("") + '<span class="tx">' + MAIN + TXT + "</span>";
    var spots = [[4, 8], [74, 2], [2, 62], [80, 58], [26, 76], [56, 80]];   // en % : autour du bouton
    el.querySelectorAll(".rd").forEach(function (im, i) {
      var p = spots[i % spots.length]; im.style.left = p[0] + "%"; im.style.top = p[1] + "%"; im.style.animationDelay = (i * .4) + "s";
    });
  } else {
    el.innerHTML = '<span class="tx">' + MAIN + "Touche un thème pour voir le résultat</span>" +
      '<span class="gr">' + th.map(function (t) { return '<button type="button" class="th" data-k="' + t.k + '">' + rond(t) + "<span>" + t.nom + "</span></button>"; }).join("") + "</span>";
    el.querySelectorAll(".rd").forEach(function (im, i) { im.style.animationDelay = (i * .2) + "s"; });
  }
  el.addEventListener("click", function (e) { var t = e.target.closest("[data-k]"); if (V === "5" && !t) return; ouvre(t ? +t.dataset.k : 0); });
  btn.insertAdjacentElement("afterend", el);

  // aperçu seulement (?cb=1) : on descend tout seul jusqu'à la Carte blanche
  if (/[?&]cb=1/.test(location.search)) setTimeout(function () { scrollTo({ top: flip.getBoundingClientRect().top + scrollY - 60, behavior: "smooth" }); }, 4200);
})();
