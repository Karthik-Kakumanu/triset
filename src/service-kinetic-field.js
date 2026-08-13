(function () {
  'use strict';

  function initServiceKineticField() {
    var categories = document.querySelectorAll('.service-category');
    if (!categories.length) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function buildMotionConfig(categoryEl) {
      var categoryName = categoryEl.id || categoryEl.className || 'service';
      var base = {
        driftX: 12,
        driftY: 16,
        rotate: 6,
        depth: 0.8,
        density: 1,
        phase: 0
      };

      if (categoryName.indexOf('digital') !== -1) {
        base.driftX = 18; base.driftY = 12; base.rotate = 7; base.depth = 1; base.phase = 0.3;
      } else if (categoryName.indexOf('geospatial') !== -1) {
        base.driftX = 14; base.driftY = 22; base.rotate = 9; base.depth = 1.18; base.phase = 0.9;
      } else if (categoryName.indexOf('marketing') !== -1) {
        base.driftX = 16; base.driftY = 18; base.rotate = 8; base.depth = 0.9; base.phase = 1.4;
      } else {
        base.driftX = 20; base.driftY = 15; base.rotate = 6; base.depth = 1.1; base.phase = 2.1;
      }

      return base;
    }

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function setupCategory(categoryEl) {
      var items = categoryEl.querySelectorAll('.service-item');
      if (!items.length) return;

      var config = buildMotionConfig(categoryEl);
      var field = { x: 0, y: 0 };
      var pointer = { x: 0, y: 0, active: false };

      items.forEach(function (item, index) {
        var amplitudeX = (index % 2 === 0 ? 1 : -1) * (config.driftX * (0.5 + ((index + 1) / items.length) * 0.8));
        var amplitudeY = (index % 3 === 0 ? 1 : -1) * (config.driftY * (0.45 + ((index + 2) / (items.length + 2)) * 0.9));
        var rotation = ((index % 2 === 0 ? 1 : -1) * config.rotate) * (0.35 + (index % 5) * 0.16);
        var scaleBase = 0.96 + ((index % 4) * 0.045);
        var duration = 8.5 + (index % 6) * 1.7 + (config.depth * 0.8);
        var delay = (index * 0.42) + config.phase;
        var depth = 0.72 + ((index % 6) * 0.12) + config.depth * 0.17;

        item.dataset.motionX = String(amplitudeX);
        item.dataset.motionY = String(amplitudeY);
        item.dataset.motionRot = String(rotation);
        item.dataset.motionScale = String(scaleBase);
        item.dataset.duration = String(duration);
        item.dataset.delay = String(delay);
        item.dataset.depth = String(depth);

        item.style.setProperty('--motion-scale', String(scaleBase));
        item.style.setProperty('--motion-shadow', '0 18px 32px rgba(7,16,24, ' + (0.06 + (index % 3) * 0.02) + ')');

        if (reduceMotion) {
          item.style.transform = 'translate3d(0,0,0) rotate(0deg) scale(1)';
          return;
        }

        var localFloat = function () {
          var phase = (performance.now() / 1000) + delay + index * 0.4;
          var driftX = Math.sin(phase * 0.9 + index) * amplitudeX;
          var driftY = Math.cos(phase * 1.1 + index * 1.3) * amplitudeY;
          var driftRot = Math.sin(phase * 0.75 + index * 0.8) * rotation;
          var hoverBoost = 1;

          if (pointer.active) {
            var rect = item.getBoundingClientRect();
            var cx = rect.left + rect.width / 2;
            var cy = rect.top + rect.height / 2;
            var dx = cx - pointer.x;
            var dy = cy - pointer.y;
            var dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist < 220) {
              var influence = (1 - dist / 220) * 12;
              driftX += (dx / dist) * influence * 0.45;
              driftY += (dy / dist) * influence * 0.45;
              hoverBoost = 1.04;
            }
          }

          item.style.transform = 'translate3d(' + driftX.toFixed(2) + 'px, ' + driftY.toFixed(2) + 'px, 0) rotate(' + driftRot.toFixed(2) + 'deg) scale(' + (scaleBase * hoverBoost).toFixed(3) + ')';
          item.style.zIndex = String(10 + index);
        };

        item.__kineticTicker = localFloat;
      });

      function animate() {
        if (reduceMotion) return;
        items.forEach(function (item) {
          if (item.__kineticTicker) item.__kineticTicker();
        });
        requestAnimationFrame(animate);
      }

      function updatePointer(event) {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.active = true;
      }

      function clearPointer() {
        pointer.active = false;
      }

      categoryEl.addEventListener('pointermove', updatePointer, { passive: true });
      categoryEl.addEventListener('pointerleave', clearPointer, { passive: true });

      if (categoryEl.getBoundingClientRect().top < window.innerHeight + 120) {
        requestAnimationFrame(animate);
      }

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (!entry.target.dataset.kineticStarted) {
              entry.target.dataset.kineticStarted = 'true';
              requestAnimationFrame(animate);
            }
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

      observer.observe(categoryEl);
    }

    categories.forEach(function (categoryEl) {
      setupCategory(categoryEl);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServiceKineticField);
  } else {
    initServiceKineticField();
  }
})();
