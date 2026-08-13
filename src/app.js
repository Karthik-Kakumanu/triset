document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const siteNav = document.querySelector('[data-site-nav]');
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const siteHeader = document.querySelector('.site-header');

  localStorage.setItem('triset-theme', 'light');
  root.dataset.theme = 'light';

  document.querySelectorAll('[data-theme-toggle]').forEach((toggle) => {
    toggle.style.display = 'none';
    toggle.setAttribute('aria-pressed', 'false');
    toggle.textContent = 'Light';
  });

  if (menuToggle && themeToggle && !document.querySelector('.mobile-theme-toggle')) {
    const mobileThemeToggle = themeToggle.cloneNode(true);
    mobileThemeToggle.classList.add('mobile-theme-toggle');
    mobileThemeToggle.setAttribute('aria-label', 'Theme is fixed to light mode');
    mobileThemeToggle.style.display = 'none';
    menuToggle.before(mobileThemeToggle);
  }

  if (menuToggle && siteNav) {
    function setMenuOpen(isOpen) {
      siteNav.classList.toggle('open', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    }

    menuToggle.addEventListener('click', () => {
      setMenuOpen(!siteNav.classList.contains('open'));
    });

    siteNav.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        setMenuOpen(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && siteNav.classList.contains('open')) {
        setMenuOpen(false);
        menuToggle.focus();
      }
    });
  }

  if (siteHeader) {
    let lastScrollY = 0;
    let lastScrollTime = 0;
    let headerTimeout;

    const syncHeader = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      const isScrollingDown = scrollDelta > 0;
      const scrollThreshold = 18;
      const hasScrolled = currentScrollY > scrollThreshold;

      // Add is-scrolled class when scrolled past threshold
      siteHeader.classList.toggle('is-scrolled', hasScrolled);

      // Optional: Hide header on scroll down (comment out if not desired)
      // if (isScrollingDown && hasScrolled) {
      //   siteHeader.style.transform = 'translateY(-100%)';
      // } else {
      //   siteHeader.style.transform = 'translateY(0)';
      // }

      lastScrollY = currentScrollY;
      lastScrollTime = Date.now();
    };

    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });
  }

  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => {
      const frame = img.closest('.image-panel, .service-stage, .service-card__image, .project-card, .spatial-visual');
      if (frame) frame.classList.add('image-fallback');
      img.style.display = 'none';
    });
  });

  const revealItems = document.querySelectorAll('.services-hero, .services-overview, .service-category, .services-cta, .section-header, .panel, .metric, .service-explorer, .service-card, .project-card, .story-node, .process-step, .cta-band, .contact-card, .team-card, .image-panel, .story-visual, .story-copy, .value-row, .locations-map, .about-final-cta-inner');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach((item) => {
      item.classList.add('reveal');
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-service-grid]').forEach((serviceGrid) => {
    const selectedCategory = serviceGrid.dataset.serviceGrid;
    const services = window.siteData.services.filter((service) => {
      return selectedCategory === 'all' || service.category === selectedCategory;
    });

    serviceGrid.innerHTML = services.map((service) => `
      <article class="service-card" id="${service.id}">
        <div class="service-card__image">
          <img src="${service.image}" alt="${service.name}" loading="lazy">
        </div>
        <div class="service-card__body">
          <p class="eyebrow">${service.category}</p>
          <h3>${service.name}</h3>
          <p>${service.shortDescription}</p>
          <button class="icon-link" type="button" data-service-trigger="${service.id}" aria-label="View ${service.name} details">View details <span aria-hidden="true">+</span></button>
        </div>
      </article>
    `).join('');
  });

  const serviceDrawer = document.querySelector('[data-service-drawer]');
  const serviceDialog = document.querySelector('[data-service-dialog]');
  const serviceClose = document.querySelector('[data-service-close]');

  function renderService(serviceId) {
    const service = window.siteData.services.find((item) => item.id === serviceId);
    if (!service || !serviceDialog) return;

    serviceDialog.querySelector('[data-service-image]').src = service.image;
    serviceDialog.querySelector('[data-service-image]').alt = service.name;
    serviceDialog.querySelector('[data-service-category]').textContent = service.category;
    serviceDialog.querySelector('[data-service-name]').textContent = service.name;
    serviceDialog.querySelector('[data-service-description]').textContent = service.description;
    serviceDialog.querySelector('[data-service-capabilities]').innerHTML = service.capabilities.map((item) => `<li>${item}</li>`).join('');
    const subservices = service.subservices || service.capabilities;
    const subserviceList = serviceDialog.querySelector('[data-service-subservices]');
    if (subserviceList) {
      subserviceList.innerHTML = subservices.map((item) => `<li>${item}</li>`).join('');
    }
    serviceDialog.querySelector('[data-service-related]').innerHTML = service.relatedServices.map((item) => `<li>${item}</li>`).join('');
    serviceDialog.querySelector('[data-service-cta]').textContent = service.cta;
    serviceDrawer.classList.add('open');
    serviceClose.focus();
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-service-trigger]');
    if (trigger) renderService(trigger.dataset.serviceTrigger);
  });

  if (serviceClose && serviceDrawer) {
    serviceClose.addEventListener('click', () => serviceDrawer.classList.remove('open'));
    serviceDrawer.addEventListener('click', (event) => {
      if (event.target === serviceDrawer) serviceDrawer.classList.remove('open');
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') serviceDrawer.classList.remove('open');
    });
  }

  const processGrid = document.querySelector('[data-process-grid]');
  if (processGrid) {
    processGrid.innerHTML = window.siteData.process.map(([number, title, text]) => `
      <article class="process-step">
        <span>${number}</span>
        <h3>${title}</h3>
        <p>${text}</p>
      </article>
    `).join('');
  }

  const projectGrid = document.querySelector('[data-project-grid]');
  if (projectGrid) {
    projectGrid.innerHTML = window.siteData.projects.map((project) => `
      <article class="project-card">
        <img src="${project.image}" alt="${project.title}" loading="lazy">
        <div>
          <p class="eyebrow">${project.type}</p>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
        </div>
      </article>
    `).join('');
  }

  const teamImages = {
    'Ramu Tiruveedula': 'assets/2d_3d.webp',
    'Bhanu Chennamsetty': 'assets/dataentry.webp',
    'Karthik Kakumanu': 'assets/web_development.jpeg',
    'Poonam Purohit': 'assets/app-development.webp',
    'Sowjanya Yenuganti': 'assets/digital_market.webp',
    'Jayanth Mukkala': 'assets/e-commerce.webp'
  };

  const teamGrid = document.querySelector('[data-team-grid]');
  if (teamGrid) {
    teamGrid.innerHTML = window.siteData.team.map((member) => {
      const normalized = Array.isArray(member)
        ? { name: member[0], role: member[1], experience: member[2] }
        : { name: member.name, role: member.role, experience: member.experience };
      const { name, role, experience } = normalized;
      const imgSrc = teamImages[name] || 'assets/lidar.webp';
      return `
        <article class="team-card">
          <img src="${imgSrc}" alt="${name}" class="team-avatar" loading="lazy" width="80" height="80">
          <div class="team-info">
            <h3>${name}</h3>
            <p>${role}</p>
            <small>${experience}</small>
          </div>
        </article>
      `;
    }).join('');
  }

  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const notice = contactForm.querySelector('[data-form-notice]');
      const submit = contactForm.querySelector('button[type="submit"]');
      const payload = Object.fromEntries(new FormData(contactForm).entries());

      if (notice) {
        notice.classList.remove('error');
        notice.textContent = 'Sending inquiry...';
      }
      if (submit) {
        submit.disabled = true;
        submit.textContent = 'Sending...';
      }

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await response.json();

        if (!response.ok || !result.ok) {
          const errors = result.errors ? Object.values(result.errors).join(' ') : result.error || 'Unable to send inquiry.';
          throw new Error(errors);
        }

        contactForm.reset();
        if (notice) {
          notice.textContent = result.message || 'Inquiry received. TRISET will respond using the details provided.';
        }
      } catch (error) {
        if (notice) {
          notice.classList.add('error');
          notice.textContent = error.message || 'Network error. Please email info@trisetsolutions.com directly.';
        }
      } finally {
        if (submit) {
          submit.disabled = false;
          submit.textContent = 'Send inquiry';
        }
      }
    });
  }

  const heroMesh = document.querySelector('[data-hero-mesh]');
  if (heroMesh) {
    const context = heroMesh.getContext('2d');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let frame = 0;

    function resizeMesh() {
      const rect = heroMesh.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width * ratio));
      height = Math.max(1, Math.floor(rect.height * ratio));
      heroMesh.width = width;
      heroMesh.height = height;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function drawMesh() {
      const rect = heroMesh.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      context.clearRect(0, 0, w, h);
      context.lineWidth = 1;

      for (let row = 0; row < 16; row += 1) {
        const yBase = h * 0.28 + row * 18;
        context.beginPath();
        for (let col = 0; col < 28; col += 1) {
          const x = w * 0.08 + col * (w * 0.84 / 27);
          const wave = Math.sin(col * 0.7 + row * 0.42 + frame * 0.018) * 16;
          const y = yBase + wave + col * 4.2;
          if (col === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.strokeStyle = row % 4 === 0 ? 'rgba(255,0,0,.36)' : 'rgba(197,214,231,.20)';
        context.stroke();
      }

      for (let i = 0; i < 72; i += 1) {
        const x = w * (0.12 + ((i * 37) % 77) / 100);
        const y = h * (0.18 + ((i * 19) % 62) / 100) + Math.sin(frame * 0.02 + i) * 4;
        context.fillStyle = i % 9 === 0 ? 'rgba(255,0,0,.82)' : 'rgba(197,214,231,.56)';
        context.fillRect(x, y, i % 9 === 0 ? 3 : 2, i % 9 === 0 ? 3 : 2);
      }

      frame += 1;
      if (!motionQuery.matches) requestAnimationFrame(drawMesh);
    }

    resizeMesh();
    drawMesh();
    window.addEventListener('resize', resizeMesh);
  }

  if (window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.spatial-visual').forEach((visual) => {
      visual.addEventListener('pointermove', (event) => {
        const rect = visual.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        visual.style.setProperty('--mx-shift', `${(x * 10).toFixed(2)}px`);
        visual.style.setProperty('--my-shift', `${(y * 8).toFixed(2)}px`);
        visual.style.setProperty('--mx-shift-inverse', `${(x * -8).toFixed(2)}px`);
        visual.style.setProperty('--my-shift-inverse', `${(y * -8).toFixed(2)}px`);
      });
      visual.addEventListener('pointerleave', () => {
        visual.style.setProperty('--mx-shift', '0px');
        visual.style.setProperty('--my-shift', '0px');
        visual.style.setProperty('--mx-shift-inverse', '0px');
        visual.style.setProperty('--my-shift-inverse', '0px');
      });
    });
  }

  document.querySelectorAll('[data-service-explorer]').forEach((explorer) => {
    const rail = explorer.querySelector('[data-service-rail]');
    const image = explorer.querySelector('[data-explorer-image]');
    const category = explorer.querySelector('[data-explorer-category]');
    const title = explorer.querySelector('[data-explorer-title]');
    const description = explorer.querySelector('[data-explorer-description]');
    const capabilities = explorer.querySelector('[data-explorer-capabilities]');
    const cta = explorer.querySelector('[data-explorer-cta]');
    const mode = explorer.dataset.serviceExplorer || 'all';
    const featuredServiceIds = ['web-development', 'app-development', 'e-commerce', 'photogrammetry', 'gis', 'lidar', 'bim', 'drone'];
    const services = window.siteData.services.filter((service) => {
      if (mode === 'featured') return featuredServiceIds.includes(service.id);
      return mode === 'all' || service.category === mode;
    });
    if (!rail || !image || !category || !title || !description || !capabilities || !cta || !services.length) return;

    rail.innerHTML = services.map((service, index) => `
      <button class="service-tab" type="button" data-explorer-trigger="${service.id}">
        <span>${String(index + 1).padStart(2, '0')}</span>
        <strong>${service.name}<small>${service.category}</small></strong>
      </button>
    `).join('');

    const tabs = Array.from(rail.querySelectorAll('[data-explorer-trigger]'));

    function selectExplorer(serviceId) {
      const service = services.find((item) => item.id === serviceId);
      if (!service) return;
      image.style.opacity = '0';
      image.style.transform = 'scale(1.025)';
      window.setTimeout(() => {
        image.onload = () => {
          image.style.opacity = '1';
          image.style.transform = 'scale(1)';
        };
        image.src = service.image;
        image.alt = service.name;
      }, 120);
      category.textContent = service.category;
      title.textContent = service.name;
      description.textContent = service.shortDescription;
      capabilities.innerHTML = service.capabilities.slice(0, 5).map((item) => `<li>${item}</li>`).join('');
      cta.textContent = service.cta;
      tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.explorerTrigger === serviceId));
    }

    tabs.forEach((tab) => {
      tab.addEventListener('mouseenter', () => selectExplorer(tab.dataset.explorerTrigger));
      tab.addEventListener('focus', () => selectExplorer(tab.dataset.explorerTrigger));
      tab.addEventListener('click', () => selectExplorer(tab.dataset.explorerTrigger));
    });
    if (tabs[0]) selectExplorer(tabs[0].dataset.explorerTrigger);
  });

  document.querySelectorAll('.service-card:not(.reveal), .project-card:not(.reveal), .process-step:not(.reveal), .team-card:not(.reveal)').forEach((item, index) => {
    item.classList.add('reveal');
    window.setTimeout(() => item.classList.add('is-visible'), 80 + index * 28);
  });
});
