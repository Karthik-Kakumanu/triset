/**
 * Kinetic Services Hero
 * ---------------------
 * A restrained, premium alternative to a scattered "physics pile" of tags:
 * pills are seed-placed once (stable across loads), drift gently on their
 * own, and spring away from the cursor within a short radius. Everything
 * moves through transform only (translate3d + rotate + scale) for GPU-
 * friendly rendering. On touch devices / narrow viewports the whole system
 * steps down to a static wrapped row with a very light pulse.
 *
 * Respects prefers-reduced-motion by disabling the animation loop entirely.
 */
(function () {
  'use strict';

  var stage = document.querySelector('[data-skh-stage]');
  var hero = document.querySelector('.services-kinetic-hero');
  if (!stage || !hero) return;

  var SERVICES = [
    { label: 'Web Development', variant: 'deep' },
    { label: 'Mobile App Development', variant: 'primary' },
    { label: 'UI/UX Design', variant: 'frost' },
    { label: 'Cloud & DevOps', variant: 'outline' },
    { label: 'Custom Software', variant: 'primary' },
    { label: 'Cybersecurity', variant: 'outline' },
    { label: 'GIS Mapping', variant: 'deep' },
    { label: 'LiDAR & 3D Terrain', variant: 'frost' },
    { label: 'Drone Surveying', variant: 'primary' },
    { label: 'Remote Sensing', variant: 'outline' },
    { label: 'Photogrammetry', variant: 'frost' },
    { label: 'WebGIS Dashboards', variant: 'primary' },
    { label: 'Digital Marketing', variant: 'signal' },
    { label: 'SEO & SMM', variant: 'outline' },
    { label: 'E-Commerce', variant: 'signal' },
    { label: 'Data Analytics', variant: 'frost' }
  ];

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // --- seeded PRNG so the scatter is identical on every load -------------
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var rand = mulberry32(20260813);

  var pills = []; // { el, x, y, w, h, rot, scale, ampX, ampY, ampR, freq, phase, springX, springY, springR, delay, hover }
  var mode = 'full'; // 'full' | 'flow'
  var raf = null;
  var running = false;
  var pointer = { x: -9999, y: -9999, active: false };
  var ambientDamp = 1; // eases toward 0.55 while a pill is hovered
  var startTime = 0;

  function decideMode() {
    return 'full';
  }

  function buildPills() {
    stage.innerHTML = '';
    pills = [];
    SERVICES.forEach(function (svc) {
      var el = document.createElement('span');
      el.className = 'skh-pill skh-pill--' + svc.variant;
      el.textContent = svc.label;
      stage.appendChild(el);
      var p = { el: el, label: svc.label, hover: false, revealed: false };
      el.addEventListener('pointerenter', function () { p.hover = true; p.el.classList.add('is-hover'); });
      el.addEventListener('pointerleave', function () { p.hover = false; p.el.classList.remove('is-hover'); });
      pills.push(p);
    });
  }

  function layoutFlow() {
    stage.classList.add('is-flow');
    pills.forEach(function (p) {
      p.el.style.left = '';
      p.el.style.top = '';
      p.el.style.transform = '';
    });
    revealFlow();
  }

  function revealFlow() {
    pills.forEach(function (p, i) {
      setTimeout(function () {
        p.el.classList.add('is-visible');
      }, reduceMotion ? 0 : i * 55);
    });
  }

  function layoutFull() {
    stage.classList.remove('is-flow');
    var rect = stage.getBoundingClientRect();
    var W = rect.width || 640;
    var H = rect.height || 480;
    var isMobile = W < 768;
    var pad = isMobile ? 12 : 26;
    var placed = [];

    pills.forEach(function (p, i) {
      var w = p.el.offsetWidth || 120;
      var h = p.el.offsetHeight || 40;
      var halfW = w / 2, halfH = h / 2;
      var best = null, bestScore = -Infinity;

      if (isMobile) {
        // On mobile: settle pills at the BOTTOM of the stage in a wrapped flow
        var colsPerRow = Math.max(2, Math.floor(W / 140));
        var col = i % colsPerRow;
        var row = Math.floor(i / colsPerRow);
        var x = pad + halfW + (col + 0.5) * ((W - pad * 2) / colsPerRow);
        var y = H - pad - (row + 0.6) * 50;
        best = { x: x, y: y };
      } else {
        // Desktop: scatter pills across the stage with random placement
        for (var attempt = 0; attempt < 48; attempt++) {
          var x = pad + halfW + rand() * Math.max(1, (W - pad * 2 - w));
          var yBias = Math.pow(rand(), 0.85);
          var y = pad + halfH + yBias * Math.max(1, (H - pad * 2 - h));

          var minDist = Infinity;
          for (var j = 0; j < placed.length; j++) {
            var q = placed[j];
            var dx = x - q.x, dy = y - q.y;
            var d = Math.sqrt(dx * dx + dy * dy) - (Math.max(halfW, halfH) + Math.max(q.halfW, q.halfH)) * 0.72;
            if (d < minDist) minDist = d;
          }
          if (placed.length === 0) minDist = 999;
          if (minDist > bestScore) { bestScore = minDist; best = { x: x, y: y }; }
          if (minDist > 18) break;
        }
      }

      placed.push({ x: best.x, y: best.y, halfW: halfW, halfH: halfH });

      var longLabel = p.label.length > 16;
      var rot = (rand() * 2 - 1) * (longLabel ? 9 : 15);
      var scale = 0.86 + rand() * 0.3;

      p.x = best.x; p.y = best.y; p.w = w; p.h = h;
      p.baseRot = rot;
      p.baseScale = scale;
      p.ampX = isMobile ? 2 + rand() * 2 : (5 + rand() * 6);
      p.ampY = isMobile ? 1.5 + rand() * 1.5 : (6 + rand() * 7);
      p.ampR = isMobile ? 0.4 + rand() * 0.6 : (1.1 + rand() * 2);
      p.freqX = 0.16 + rand() * 0.12;
      p.freqY = 0.13 + rand() * 0.11;
      p.freqR = 0.1 + rand() * 0.1;
      p.phase = rand() * Math.PI * 2;
      p.springX = 0; p.springY = 0; p.springR = 0;
      p.delay = i * 55 + rand() * 40;
      p.el.style.zIndex = String(Math.round(scale * 100));
    });

    // paint resting position immediately, entrance handled in the loop
    pills.forEach(function (p) {
      p.el.style.left = p.x + 'px';
      p.el.style.top = p.y + 'px';
    });
  }

  function onPointerMove(e) {
    var rect = stage.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.active = true;
  }
  function onPointerLeave() { pointer.active = false; pointer.x = -9999; pointer.y = -9999; }

  function tick(now) {
    if (!running) return;
    if (!startTime) startTime = now;
    var elapsed = now - startTime;
    var t = now / 1000;

    var anyHover = false;
    for (var k = 0; k < pills.length; k++) { if (pills[k].hover) { anyHover = true; break; } }
    ambientDamp += ((anyHover ? 0.55 : 1) - ambientDamp) * 0.06;

    var repelRadius = Math.max(90, Math.min(stage.clientWidth, stage.clientHeight) * 0.24);

    pills.forEach(function (p) {
      // entrance progress (0..1)
      var prog = reduceMotion ? 1 : clamp((elapsed - p.delay) / 800, 0, 1);
      if (prog > 0 && !p.revealed) { p.el.classList.add('is-visible'); p.revealed = true; }
      var ease = easeOutCubic(prog);
      
      // Pills FALL from top (-200px) down to resting position (0)
      var entranceY = (1 - ease) * -200;
      var entranceRot = (1 - ease) * -20;

      var idleX = Math.sin(t * p.freqX * Math.PI + p.phase) * p.ampX * ambientDamp;
      var idleY = Math.cos(t * p.freqY * Math.PI + p.phase * 1.3) * p.ampY * ambientDamp;
      var idleR = Math.sin(t * p.freqR * Math.PI + p.phase * 0.7) * p.ampR * ambientDamp;

      // pointer repulsion target
      var targetSX = 0, targetSY = 0, targetSR = 0;
      if (pointer.active) {
        var cx = p.x + idleX, cy = p.y + idleY;
        var dx = cx - pointer.x, dy = cy - pointer.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
        if (dist < repelRadius) {
          var force = 1 - dist / repelRadius;
          force = force * force;
          targetSX = (dx / dist) * force * 30;
          targetSY = (dy / dist) * force * 30;
          targetSR = (dx / dist) * force * 9;
        }
      }
      p.springX += (targetSX - p.springX) * 0.08;
      p.springY += (targetSY - p.springY) * 0.08;
      p.springR += (targetSR - p.springR) * 0.08;

      var scale = p.baseScale * (p.hover ? 1.1 : 1) * (reduceMotion ? 1 : ease);
      var dx2 = idleX + p.springX;
      var dy2 = idleY + p.springY + entranceY;
      var rot = p.baseRot + idleR + p.springR + entranceRot;

      p.el.style.transform =
        'translate3d(calc(-50% + ' + dx2.toFixed(2) + 'px), calc(-50% + ' + dy2.toFixed(2) + 'px), 0) rotate(' + rot.toFixed(2) + 'deg) scale(' + scale.toFixed(3) + ')';
    });

    raf = requestAnimationFrame(tick);
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }

  function start() {
    if (running) return;
    running = true;
    startTime = 0;
    raf = requestAnimationFrame(tick);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
  }

  function setup() {
    var next = decideMode();
    mode = next;
    buildPills();

    if (mode === 'flow') {
      layoutFlow();
      stop();
    } else {
      // measure requires layout; do it after paint
      requestAnimationFrame(function () {
        layoutFull();
        if (!reduceMotion) start(); else {
          // static resting pose, no loop
          pills.forEach(function (p) {
            p.el.classList.add('is-visible');
            p.el.style.transform = 'translate3d(-50%,-50%,0) rotate(' + p.baseRot + 'deg) scale(' + p.baseScale + ')';
          });
        }
      });
    }
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        hero.classList.add('is-in');
        setup();
        io.disconnect();
      }
    });
  }, { threshold: 0.15 });
  io.observe(hero);

  if (!reduceMotion) {
    stage.addEventListener('pointermove', onPointerMove);
    stage.addEventListener('pointerleave', onPointerLeave);
  }

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var next = decideMode();
      if (next !== mode || next === 'full') {
        stop();
        mode = next;
        if (mode === 'flow') { layoutFlow(); }
        else { requestAnimationFrame(function () { layoutFull(); if (!reduceMotion) start(); }); }
      }
    }, 180);
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else if (mode === 'full' && !reduceMotion && hero.classList.contains('is-in')) start();
  });
})();