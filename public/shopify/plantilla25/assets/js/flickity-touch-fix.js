/* Flickity touch fix: permite scroll vertical en móvil mientras
   mantiene el swipe horizontal para navegación del slideshow.
   Flickity llama preventDefault() en handleDragMove bloqueando el
   scroll vertical. Este parche hace que solo preventDefault en movimientos
   horizontales, no verticales. */
(function () {
  'use strict';

  if (!window.matchMedia('(max-width: 767px)').matches) return;

  var patched = false;

  function patchFlickity() {
    if (patched) return;
    if (typeof window.Flickity === 'undefined') return;

    var proto = window.Flickity.prototype;
    if (!proto || proto._touchFixed) return;
    proto._touchFixed = true;
    patched = true;

    var originalHandleDragMove = proto.handleDragMove;
    if (!originalHandleDragMove) return;

    proto.handleDragMove = function (event, pointer, moveVector) {
      if (!this.isDraggable) return;
      if (!moveVector) return originalHandleDragMove.call(this, event, pointer, moveVector);

      var dx = Math.abs(moveVector.x);
      var dy = Math.abs(moveVector.y);

      if (dy > dx) {
        if (this.isDragging) {
          this.isDragging = false;
          if (this.slider) this.slider.style.pointerEvents = '';
        }
        return;
      }

      return originalHandleDragMove.call(this, event, pointer, moveVector);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(patchFlickity, 50);
      setTimeout(patchFlickity, 300);
      setTimeout(patchFlickity, 1000);
      setTimeout(patchFlickity, 2000);
    });
  } else {
    setTimeout(patchFlickity, 50);
    setTimeout(patchFlickity, 300);
    setTimeout(patchFlickity, 1000);
    setTimeout(patchFlickity, 2000);
  }

  document.addEventListener('page:loaded', function () {
    setTimeout(patchFlickity, 50);
    setTimeout(patchFlickity, 300);
  });
})();
