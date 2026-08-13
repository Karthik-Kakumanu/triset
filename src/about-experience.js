(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    if (!document.body.classList.contains('about-page')) return;

    initReveal();
    initLocationConnector();
    initTeamSlider();
  });

  // ---------------------------------------------------------------------
  // Reveal-on-scroll for the new About sections (app.js only watches its
  // own selector list, so these classnames get their own observer).
  // ---------------------------------------------------------------------
  function initReveal() {
    var items = document.querySelectorAll(
      '.ax-story-visual, .ax-statement, .ax-detail, .ax-profile-item, .ax-value, .ax-loc-node, .ax-cta-heading, .ax-cta-lead, .ax-cta-inner .hero-actions'
    );
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('reveal', 'is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = reduceMotion ? '0s' : (Math.min(i % 4, 3) * 0.08) + 's';
      observer.observe(el);
    });
  }

  // ---------------------------------------------------------------------
  // Locations: draw the connecting line once the section is in view.
  // ---------------------------------------------------------------------
  function initLocationConnector() {
    var root = document.querySelector('[data-ax-connector-root]');
    if (!root) return;

    if (!('IntersectionObserver' in window)) {
      root.classList.add('is-connected');
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          root.classList.add('is-connected');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    observer.observe(root);
  }

  // ---------------------------------------------------------------------
  // Team: an editorial portrait showcase. We keep the original team data
  // and simply map each person to a real image asset for a premium,
  // gallery-like treatment instead of the older monogram grid.
  // ---------------------------------------------------------------------
  var SPATIAL_KEYWORDS = ['photogrammetry', 'gis', 'lidar', 'bim', 'drone', 'dem', 'orthophoto', 'cartography', 'geospatial', 'geo-spatial', 'remote sensing', '3d'];

  var TEAM_IMAGES = {
    'Ramu Tiruveedula': 'assets/ramu.jpg',
    'Bhanu Chennamsetty': 'assets/dataentry.webp',
    'Karthik Kakumanu': 'assets/web_development.jpeg',
    'Poonam Purohit': 'assets/app_development.jpeg',
    'Sowjanya Yenuganti': 'assets/digital_mark.jpg'
  };

  function normalizeMember(member) {
    if (Array.isArray(member)) return { name: member[0], role: member[1], experience: member[2] };
    return { name: member.name, role: member.role, experience: member.experience };
  }

  function domainForRole(role) {
    var text = String(role || '').toLowerCase();
    for (var i = 0; i < SPATIAL_KEYWORDS.length; i++) {
      if (text.indexOf(SPATIAL_KEYWORDS[i]) !== -1) return 'spatial';
    }
    return 'digital';
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function initTeamSlider() {
    var grid = document.querySelector('[data-ax-team-grid]');
    if (!grid) return;

    var team = (window.siteData && Array.isArray(window.siteData.team)) ? window.siteData.team : [];
    if (!team.length) return;

    var countEl = document.querySelector('[data-ax-team-count]');
    if (countEl) countEl.textContent = 'Team of ' + String(team.length).padStart(2, '0');

    grid.innerHTML = team.map(function (member, i) {
      var normalized = normalizeMember(member);
      var name = escapeHtml(normalized.name);
      var role = escapeHtml(normalized.role);
      var experience = escapeHtml(normalized.experience);
      var domain = domainForRole(normalized.role);
      var domainLabel = domain === 'spatial' ? 'Spatial' : 'Digital';
      var image = TEAM_IMAGES[normalized.name] || 'assets/lidar.webp';

      return (
        '<article class="ax-team-card" data-domain="' + domain + '" data-name="' + name + '" style="--ax-i:' + i + '">' +
          '<img src="' + image + '" alt="' + name + '" loading="lazy" />' +
          '<div class="ax-team-card-overlay"></div>' +
          '<div class="ax-team-card-top">' +
            '<span class="ax-team-index">' + String(i + 1).padStart(2, '0') + ' / ' + String(team.length).padStart(2, '0') + '</span>' +
            '<span class="ax-team-domain">' + domainLabel + '</span>' +
          '</div>' +
          '<div class="ax-team-card-body">' +
            '<h3>' + name + '</h3>' +
            '<p>' + role + '</p>' +
            '<small>' + experience + '</small>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    var cards = Array.from(grid.children);
    var activeIndex = 0;
    var prevButton = document.querySelector('[data-ax-team-prev]');
    var nextButton = document.querySelector('[data-ax-team-next]');
    var dotsWrap = document.querySelector('[data-ax-team-dots]');
    var autoTimer = null;

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = cards.map(function (_, index) {
        return '<button type="button" class="ax-team-dot" data-ax-team-dot="' + index + '" aria-label="Go to team member ' + (index + 1) + '"></button>';
      }).join('');

      dotsWrap.querySelectorAll('[data-ax-team-dot]').forEach(function (dot) {
        dot.addEventListener('click', function () {
          updateSlider(Number(dot.dataset.axTeamDot));
          restartAuto();
        });
      });
    }

    function updateSlider(nextIndex) {
      activeIndex = (nextIndex + cards.length) % cards.length;

      cards.forEach(function (card, index) {
        var delta = index - activeIndex;
        if (delta > cards.length / 2) delta -= cards.length;
        if (delta < -(cards.length / 2)) delta += cards.length;

        var abs = Math.abs(delta);
        var translateX = delta * 170;
        var rotateY = -delta * 24;
        var scale = 1 - abs * 0.14;
        var opacity = abs > 2 ? 0.18 : 1 - abs * 0.22;
        var blur = abs > 2 ? '2px' : '0px';

        card.classList.toggle('is-active', delta === 0);
        card.style.opacity = String(Math.max(opacity, 0.16));
        card.style.filter = 'blur(' + blur + ')';
        card.style.zIndex = String(100 - abs);
        card.style.transform = 'translate3d(calc(-50% + ' + translateX + 'px), -50%, 0) scale(' + scale + ') rotateY(' + rotateY + 'deg)';
      });

      if (dotsWrap) {
        var dots = dotsWrap.querySelectorAll('[data-ax-team-dot]');
        dots.forEach(function (dot, index) {
          dot.classList.toggle('is-active', index === activeIndex);
        });
      }
    }

    function restartAuto() {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = setInterval(function () {
        updateSlider(activeIndex + 1);
      }, 4200);
    }

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        updateSlider(activeIndex - 1);
        restartAuto();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        updateSlider(activeIndex + 1);
        restartAuto();
      });
    }

    buildDots();
    updateSlider(0);
    restartAuto();

    if (!('IntersectionObserver' in window)) {
      grid.classList.add('is-visible');
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          grid.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });
    observer.observe(grid);
  }
})();