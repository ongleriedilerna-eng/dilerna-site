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
  document.querySelectorAll("[data-club-open]").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); if (club.showModal) club.showModal(); });
  });
  club.querySelector("[data-club-close]").addEventListener("click", function () { club.close(); });
  club.querySelector("[data-club-join]").addEventListener("click", function () { club.close(); });
  // toucher le fond ferme la fiche
  club.addEventListener("click", function (e) { if (e.target === club) club.close(); });
})();
