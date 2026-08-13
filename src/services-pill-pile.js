/**
 * TRISET Service Pill Pile
 * -------------------------
 * A small hand-rolled physics sim (no Matter.js / no external libs):
 * colorful service tags drop in, land in a pile, collide with each
 * other and the floor, and can be grabbed + flung with the pointer.
 *
 * Everything moves through transform (translate3d + rotate) only —
 * GPU-friendly, paused off-screen and when the tab is hidden, and
 * replaced with a calm static wrapped layout under
 * prefers-reduced-motion or on touch/narrow viewports.
 */
(function () {
  'use strict';

  var stage = document.querySelector('[data-pill-pile]');
  if (!stage) return;

  var FALLBACK_TAGS = [
    { label: 'Web Development', color: 'blue' },
    { label: 'App Development', color: 'coral' },
    { label: 'UI/UX Design', color: 'mint' },
    { label: 'E-Commerce', color: 'amber' },
    { label: 'Digital Marketing', color: 'violet' },
    { label: 'GIS Mapping', color: 'mint' },
    { label: 'LiDAR', color: 'blue' },
    { label: 'Drone Surveying', color: 'amber' },
    { label: 'Photogrammetry', color: 'coral' },
    { label: 'BIM', color: 'violet' },
    { label: 'SEO & SMM', color: 'mint' },
    { label: 'Data Entry', color: 'blue' },
    { label: 'Remote Sensing', color: 'coral' },
    { label: 'Cloud & APIs', color: 'amber' }
  ];

  // Pull the live list straight from the services page data (window.siteData.services)
  // so every service actually offered shows up here, instead of a hand-picked subset.
  function buildTagList() {
    var colors = ['blue', 'coral', 'mint', 'amber', 'violet'];
    var services = (window.siteData && Array.isArray(window.siteData.services)) ? window.siteData.services : null;
    if (!services || !services.length) return FALLBACK_TAGS;
    return services.map(function (svc, i) {
      return { label: svc.name, color: colors[i % colors.length] };
    });
  }

  var TAGS = buildTagList();

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isCompact = window.matchMedia('(max-width: 760px)').matches || !window.matchMedia('(pointer: fine)').matches;

  var GRAVITY = 1500;      // px/s^2
  var FLOOR_BOUNCE = 0.26;
  var WALL_BOUNCE = 0.32;
  var FRICTION = 0.985;
  var AIR_DAMP = 0.999;

  var pills = [];
  var stageW = 0, stageH = 0;
  var running = false;
  var raf = null;
  var lastT = 0;
  var dragging = null;

  function buildDom() {
    stage.innerHTML = '';
    pills = [];
    TAGS.forEach(function (tag, i) {
      var el = document.createElement('div');
      el.className = 'pp-pill pp-pill--' + tag.color;
      el.textContent = tag.label;
      el.setAttribute('tabindex', '0');
      stage.appendChild(el);
      pills.push({
        el: el,
        x: 0, y: 0, w: 0, h: 0,
        vx: 0, vy: 0,
        rot: (Math.random() * 2 - 1) * 10,
        vrot: 0,
        seedX: 0.08 + (i % 7) * 0.12 + (Math.random() * 0.04 - 0.02),
        dropDelay: i * 90
      });
    });
  }

  function measure() {
    var rect = stage.getBoundingClientRect();
    stageW = rect.width;
    stageH = rect.height;
    pills.forEach(function (p, i) {
      p.w = p.el.offsetWidth;
      p.h = p.el.offsetHeight;
      p.x = Math.max(4, Math.min(stageW - p.w - 4, stageW * p.seedX));
      p.y = -p.h - 40 - i * 46;
      p.vx = (Math.random() * 2 - 1) * 40;
    });
  }

  function paint(p) {
    p.el.style.transform =
      'translate3d(' + p.x.toFixed(1) + 'px,' + p.y.toFixed(1) + 'px,0) rotate(' + p.rot.toFixed(1) + 'deg)';
  }

  function layoutStatic() {
    stage.classList.add('pp-static');
    pills.forEach(function (p) {
      p.el.style.transform = '';
    });
  }

  function step(now) {
    if (!running) return;
    if (!lastT) lastT = now;
    var dt = Math.min((now - lastT) / 1000, 0.032);
    lastT = now;

    pills.forEach(function (p) {
      if (p === dragging) return;
      p.vy += GRAVITY * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= AIR_DAMP;
      p.vrot *= 0.96;
      p.rot += p.vrot * dt;

      // floor
      if (p.y + p.h > stageH) {
        p.y = stageH - p.h;
        if (p.vy > 30) { p.vy *= -FLOOR_BOUNCE; p.vrot += p.vx * 0.02; }
        else { p.vy = 0; }
        p.vx *= FRICTION;
      }
      // walls
      if (p.x < 0) { p.x = 0; p.vx *= -WALL_BOUNCE; }
      if (p.x + p.w > stageW) { p.x = stageW - p.w; p.vx *= -WALL_BOUNCE; }
    });

    // pairwise separation (cheap AABB push-apart, a few iterations for stability)
    for (var iter = 0; iter < 2; iter++) {
      for (var i = 0; i < pills.length; i++) {
        for (var j = i + 1; j < pills.length; j++) {
          var a = pills[i], b = pills[j];
          var ax2 = a.x + a.w, ay2 = a.y + a.h;
          var bx2 = b.x + b.w, by2 = b.y + b.h;
          var overlapX = Math.min(ax2, bx2) - Math.max(a.x, b.x);
          var overlapY = Math.min(ay2, by2) - Math.max(a.y, b.y);
          if (overlapX > 0 && overlapY > 0) {
            if (overlapX < overlapY) {
              var pushX = overlapX / 2;
              if (a.x < b.x) { if (a !== dragging) a.x -= pushX; if (b !== dragging) b.x += pushX; }
              else { if (a !== dragging) a.x += pushX; if (b !== dragging) b.x -= pushX; }
              if (a !== dragging) a.vx *= 0.7; if (b !== dragging) b.vx *= 0.7;
            } else {
              var pushY = overlapY / 2;
              if (a.y < b.y) { if (a !== dragging) a.y -= pushY; if (b !== dragging) b.y += pushY; }
              else { if (a !== dragging) a.y += pushY; if (b !== dragging) b.y -= pushY; }
              if (a !== dragging) { a.vy *= 0.5; } if (b !== dragging) { b.vy *= 0.5; }
            }
          }
        }
      }
    }

    pills.forEach(paint);
    raf = requestAnimationFrame(step);
  }

  function start() {
    if (running) return;
    running = true;
    lastT = 0;
    raf = requestAnimationFrame(step);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
  }

  function attachDrag(p) {
    var el = p.el;
    var offX = 0, offY = 0, lastX = 0, lastY = 0, lastMoveT = 0;

    el.addEventListener('pointerdown', function (e) {
      el.setPointerCapture(e.pointerId);
      var rect = stage.getBoundingClientRect();
      offX = (e.clientX - rect.left) - p.x;
      offY = (e.clientY - rect.top) - p.y;
      lastX = p.x; lastY = p.y; lastMoveT = performance.now();
      dragging = p;
      el.classList.add('is-dragging');
      p.vx = 0; p.vy = 0;
    });

    el.addEventListener('pointermove', function (e) {
      if (dragging !== p) return;
      var rect = stage.getBoundingClientRect();
      var nx = (e.clientX - rect.left) - offX;
      var ny = (e.clientY - rect.top) - offY;
      var now = performance.now();
      var dt = Math.max(1, now - lastMoveT);
      p.vx = ((nx - lastX) / dt) * 16;
      p.vy = ((ny - lastY) / dt) * 16;
      p.x = Math.max(0, Math.min(stageW - p.w, nx));
      p.y = Math.max(-stageH, Math.min(stageH - p.h, ny));
      lastX = p.x; lastY = p.y; lastMoveT = now;
      paint(p);
    });

    function release(e) {
      if (dragging !== p) return;
      dragging = null;
      el.classList.remove('is-dragging');
      el.releasePointerCapture(e.pointerId);
    }
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);

    // keyboard nudge for accessibility
    el.addEventListener('keydown', function (e) {
      var step = 24;
      if (e.key === 'ArrowLeft') { p.vx -= step; }
      else if (e.key === 'ArrowRight') { p.vx += step; }
      else if (e.key === 'ArrowUp') { p.vy -= step * 4; }
      else return;
      e.preventDefault();
    });
  }

  function setup() {
    buildDom();
    if (reduceMotion || isCompact) {
      layoutStatic();
      return;
    }
    requestAnimationFrame(function () {
      measure();
      pills.forEach(paint);
      pills.forEach(attachDrag);
      start();
    });
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        if (!stage.dataset.ppInit) {
          stage.dataset.ppInit = 'true';
          setup();
        } else if (!reduceMotion && !isCompact) {
          start();
        }
      } else {
        stop();
      }
    });
  }, { threshold: 0.1 });
  io.observe(stage);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else if (stage.dataset.ppInit && !reduceMotion && !isCompact) start();
  });

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var nowCompact = window.matchMedia('(max-width: 760px)').matches || !window.matchMedia('(pointer: fine)').matches;
      if (nowCompact !== isCompact) {
        isCompact = nowCompact;
        stop();
        stage.classList.remove('pp-static');
        setup();
      } else if (!isCompact && !reduceMotion) {
        var rect = stage.getBoundingClientRect();
        stageW = rect.width; stageH = rect.height;
      }
    }, 160);
  });
})();