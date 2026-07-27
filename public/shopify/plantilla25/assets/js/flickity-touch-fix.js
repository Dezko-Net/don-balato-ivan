/* Flickity touch fix: permite scroll vertical en móvil mientras
   mantiene el swipe horizontal para navegación del slideshow.
   Flickity llama preventDefault() en handleDragMove bloqueando el
   scroll vertical. Este parche hace que solo preventDefault en movimientos
   horizontales, no verticales. */
(function () {
  'use strict';

  if (!window.matchMedia('(max-width: 767px)').matches) return;

  function patchFlickity() {
    if (typeof window.Flickity === 'undefined') return;

    var proto = window.Flickity.prototype;
    if (!proto || proto._touchFixed) return;
    proto._touchFixed = true;

    var originalHandleDragMove = proto.handleDragMove;
    if (!originalHandleDragMove) return;

    proto.handleDragMove = function (event, pointer, moveVector) {
      if (!this.isDraggable) return;

      var angle = Math.atan2(Math.abs(moveVector.y), Math.abs(moveVector.x)) * 180 / Math.PI;

      if (angle > 45) {
        return;
      }

      return originalHandleDragMove.call(this, event, pointer, moveVector);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(patchFlickity, 100);
    });
  } else {
    setTimeout(patchFlickity, 100);
  }

  setTimeout(patchFlickity, 500);
  setTimeout(patchFlickity, 1500);
})();
