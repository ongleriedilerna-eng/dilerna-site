/* =========================================================================
   DILERNA · Club Dilerna (abonnement)
   Le bouton en haut des prestations ouvre la fiche du club ; « Je veux faire
   partie du club » ferme la fiche et ouvre la fenêtre de contact avec un
   message prêt (géré par main.js via data-rdv).
   ========================================================================= */
(function () {
  "use strict";
  var club = document.querySelector("[data-club]");
  if (!club) return;
  // places restantes (réglées dans config.js → clubPlaces)
  var n = (window.DILERNA || {}).clubPlaces, places = club.querySelector("[data-club-places]");
  if (places && typeof n === "number") places.textContent = n <= 0 ? "Complet" : n + (n === 1 ? " place restante" : " places restantes");
  // tout doit tenir sur l'écran, bouton compris, sans défiler : si ça dépasse,
  // la liste des avantages est réduite petit à petit jusqu'à ce que tout rentre
  var inner = club.querySelector(".club__inner"), perks = club.querySelector(".club__perks");
  function fit() {
    if (!club.open) return;
    var z = 1;
    perks.style.zoom = 1;
    while (inner.scrollHeight > inner.clientHeight + 1 && z > .6) { z -= .03; perks.style.zoom = z; }
  }
  window.addEventListener("resize", fit);
  document.querySelectorAll("[data-club-open]").forEach(function (b) {
    // le club est ouvert (29/10/2026) : le bouton mène directement au vrai club
    b.addEventListener("click", function (e) { e.preventDefault(); versClub(); });
  });
  // 30/10/2026 (Marie : « ça m'affiche un truc blanc et après le club ») : sur téléphone, une fiche crème « Club Dilerna »
  // monte tout de suite, puis le club s'affiche à sa place, dans la même couleur. On va directement à la page du club (sans page de passage).
  var URL_CLUB = "https://club.dilerna.fr/bouton-club-mobile-v5.html?reel=1&v=20261031c";   /* le numéro force la nouvelle version du club */
  function versClub() {
    if ((window.matchMedia && window.matchMedia("(min-width: 1024px)").matches) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { location.href = URL_CLUB; return; }
    if (!document.getElementById("club-monte-css")) {
      var st = document.createElement("style"); st.id = "club-monte-css";
      st.textContent = ".club-monte { position: fixed; z-index: 9999; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; background: #FDF8F4;" +
        " border-radius: 28px 28px 0 0; transform: translateY(102%); transition: transform .3s cubic-bezier(.2, .8, .3, 1), border-radius .3s; }" +
        ".club-monte.is-in { transform: none; border-radius: 0; }" +
        ".club-monte b { font: 600 30px/1 'Fraunces', Georgia, serif; font-variation-settings: 'SOFT' 100, 'opsz' 144; color: #4E2E22; }" +
        ".club-monte i { display: flex; gap: 6px; } .club-monte i::before, .club-monte i::after, .club-monte i span { content: ''; width: 7px; height: 7px; border-radius: 50%; background: #AB9680; animation: clubPoint 1s ease-in-out infinite; }" +
        ".club-monte i span { animation-delay: .15s; } .club-monte i::after { animation-delay: .3s; }" +
        "@keyframes clubPoint { 0%, 100% { opacity: .3; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-4px); } }";
      document.head.appendChild(st);
    }
    var f = document.createElement("div"); f.className = "club-monte"; f.setAttribute("aria-hidden", "true");
    f.innerHTML = "<b>Club Dilerna</b><i><span></span></i>";
    document.body.appendChild(f);
    requestAnimationFrame(function () { requestAnimationFrame(function () { f.classList.add("is-in"); }); });
    setTimeout(function () { location.href = URL_CLUB; }, 300);
  }
  // retour en arrière dans le navigateur : on enlève la fiche crème
  window.addEventListener("pageshow", function () { document.querySelectorAll(".club-monte").forEach(function (x) { x.remove(); }); });
  club.querySelector("[data-club-close]").addEventListener("click", function () { club.close(); });
  club.querySelector("[data-club-join]").addEventListener("click", function () { club.close(); });
  // toucher le fond ferme la fiche
  club.addEventListener("click", function (e) { if (e.target === club) club.close(); });
})();
