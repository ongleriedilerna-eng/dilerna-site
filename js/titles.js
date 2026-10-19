/* =========================================================================
   DILERNA · titres sur une seule ligne
   Chaque titre marqué data-fit garde sa taille normale s'il tient sur une
   ligne ; sinon sa taille est réduite juste ce qu'il faut.
   ========================================================================= */
(function () {
  "use strict";
  var els = [].slice.call(document.querySelectorAll("[data-fit]"));
  function fit() {
    els.forEach(function (el) {
      el.classList.add("t-fit");
      el.style.fontSize = "";
      var w = el.clientWidth, need = el.scrollWidth;
      if (need > w) {
        var size = parseFloat(getComputedStyle(el).fontSize);
        el.style.fontSize = Math.floor(size * w / need * 0.98) + "px";
      }
    });
  }
  fit();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  window.addEventListener("resize", fit);
})();
