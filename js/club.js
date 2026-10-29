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
    b.addEventListener("click", function (e) { e.preventDefault(); location.href = "https://club.dilerna.fr/?v=20261030b";  /* le numéro force la nouvelle version du club */ });
  });
  club.querySelector("[data-club-close]").addEventListener("click", function () { club.close(); });
  club.querySelector("[data-club-join]").addEventListener("click", function () { club.close(); });
  // toucher le fond ferme la fiche
  club.addEventListener("click", function (e) { if (e.target === club) club.close(); });
})();
