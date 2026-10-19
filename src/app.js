document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop().toLowerCase();
  if (currentPage === 'projects.html' || currentPage === 'work.html') {
    window.location.replace('index.html');
    return;
  }

  document.querySelectorAll('a[href$="projects.html"]').forEach((link) => link.remove());

  const root = document.documentElement;
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const siteNav = document.querySelector('[data-site-nav]');
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const siteHeader = document.querySelector('.site-header');

	  // Shared company-information marquee above the sticky site header.
	  if (siteHeader && !document.querySelector('.company-marquee')) {
	    const marquee = document.createElement('aside');
	    marquee.className = 'company-marquee';
	    marquee.setAttribute('aria-label', 'TRISET company information');
	    marquee.innerHTML = `
	      <div class="company-marquee__inner">
	        <div class="company-marquee__contact-group">
	          <span class="company-marquee__item"><span class="company-marquee__icon" aria-hidden="true">☎</span> Sales: <a href="tel:+917382819292">+91 7382 819 292</a></span>
	          <span class="company-marquee__divider" aria-hidden="true"></span>
	          <span class="company-marquee__item"><span class="company-marquee__icon" aria-hidden="true">✉</span> <a href="mailto:info@trisetsolutions.com">info@trisetsolutions.com</a></span>
	        </div>
	        <div class="company-marquee__socials" aria-label="Social media links">
	          <span class="company-marquee__social company-marquee__social--facebook" aria-label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v6h4v-6h3.2l.8-4H13V9c0-.7.3-1 1-1Z"/></svg></span>
	          <span class="company-marquee__social company-marquee__social--x" aria-label="X"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4.2l3.2 4.5L16.2 4H19l-5.3 6.1L19.5 20h-4.2l-3.8-5.2L7 20H4.2l5.6-6.6L5 4Zm3 1.8 7.9 12.4h1.2L9.2 5.8H8Z"/></svg></span>
	          <a class="company-marquee__social company-marquee__social--instagram" href="https://www.instagram.com/trisetsolutions/" target="_blank" rel="noopener noreferrer" aria-label="TRISET on Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.4" cy="6.7" r="1.1" class="social-dot"/></svg></a>
	          <a class="company-marquee__social company-marquee__social--linkedin" href="https://www.linkedin.com/in/triset-solutions-534389440" target="_blank" rel="noopener noreferrer" aria-label="TRISET on LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8.2H2V21h3V8.2ZM3.5 3A1.8 1.8 0 1 0 3.5 6.6 1.8 1.8 0 0 0 3.5 3ZM8.5 8.2h3v1.7h.1c.4-.8 1.5-2.1 3.8-2.1 4 0 4.7 2.6 4.7 6V21h-3v-6.4c0-1.5 0-3.5-2.1-3.5s-2.4 1.6-2.4 3.4V21h-3V8.2Z"/></svg></a>
	          <span class="company-marquee__social company-marquee__social--whatsapp" aria-label="WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a8.8 8.8 0 0 0-7.6 13.2L3 21l4.9-1.3A8.8 8.8 0 1 0 12 3Zm0 15.9a7.1 7.1 0 0 1-3.6-1l-.3-.2-2.9.8.8-2.8-.2-.3A7.1 7.1 0 1 1 12 18.9Zm3.9-5.3c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.1-.3.2-.5.1a5.8 5.8 0 0 1-2.9-2.5c-.2-.3 0-.4.1-.6l.4-.5c.1-.2.1-.3 0-.5l-.7-1.7c-.1-.2-.3-.2-.5-.2h-.4c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7a8.2 8.2 0 0 0 3.1 3c1.8.8 1.8.5 2.1.5.3 0 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2Z"/></svg></span>
	        </div>
	      </div>`;
	    document.body.insertBefore(marquee, siteHeader);
	  }

	  if (!document.querySelector('.floating-contact-actions')) {
	    const floatingActions = document.createElement('div');
	    floatingActions.className = 'floating-contact-actions';
	    floatingActions.innerHTML = `
	      <a class="floating-contact-action floating-contact-action--call" href="tel:+917382819292" aria-label="Call TRISET Sales">
	        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.1 3.5 9.8 3c.7-.1 1.3.3 1.5 1l1 3.1c.2.6 0 1.2-.5 1.5l-1.8 1.1a12 12 0 0 0 4.3 4.3l1.1-1.8c.3-.5.9-.7 1.5-.5l3.1 1c.7.2 1.1.8 1 1.5l-.5 2.7c-.1.7-.7 1.2-1.4 1.2C11.5 17.6 6.4 12.5 5.3 5c-.1-.7.4-1.4 1.1-1.5l.7-.1Z"/></svg>
	      </a>
		      <a class="floating-contact-action floating-contact-action--email" href="mailto:info@trisetsolutions.com" aria-label="Email TRISET at info@trisetsolutions.com">
		        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.5h18a1.5 1.5 0 0 1 1.5 1.5v10A1.5 1.5 0 0 1 21 18.5H3A1.5 1.5 0 0 1 1.5 17V7A1.5 1.5 0 0 1 3 5.5Zm0 2.4V17h18V7.9l-8.24 5.86a1.3 1.3 0 0 1-1.52 0L3 7.9Zm1.5-.4L12 12.83l7.5-5.33H4.5Z"/></svg>
		      </a>
	      <a class="floating-contact-action floating-contact-action--whatsapp" href="https://wa.me/917382819292" target="_blank" rel="noopener noreferrer" aria-label="Chat with TRISET on WhatsApp">
	        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8a9.2 9.2 0 0 0-7.9 13.8L2.8 21.2l4.8-1.3A9.2 9.2 0 1 0 12 2.8Zm0 16.7a7.5 7.5 0 0 1-3.8-1l-.3-.2-2.8.8.8-2.7-.2-.3A7.5 7.5 0 1 1 12 19.5Zm4-5.6c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1a6.2 6.2 0 0 1-3-2.6c-.2-.3 0-.5.1-.6l.4-.5c.1-.2.1-.3 0-.5l-.7-1.7c-.1-.2-.3-.2-.5-.2h-.4c-.2 0-.5.1-.7.3-.2.3-.9 1-.9 2.3s.9 2.6 1.1 2.8a8.5 8.5 0 0 0 3.2 3.1c1.9.8 1.9.5 2.2.5.3 0 1.5-.6 1.7-1.2.2-.6.2-1.2.1-1.3Z"/></svg>
	      </a>
	      <button class="floating-contact-action floating-contact-action--top" type="button" aria-label="Scroll to top" data-scroll-top>
	        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6.7 14.7 5.3-5.3 5.3 5.3 1.4-1.4-6.7-6.7-6.7 6.7 1.4 1.4Z"/></svg>
	      </button>`;
	    document.body.appendChild(floatingActions);
	    floatingActions.querySelector('[data-scroll-top]').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
	  }

	  const footer = document.querySelector('.footer');
	  const serviceDetailPage = document.querySelector('.service-detail-page');
	  if (serviceDetailPage) {
	    const serviceKey = window.location.pathname.split('/').pop().replace('.html', '') || 'services';
	    serviceDetailPage.dataset.serviceDetail = serviceKey;
	  }
	  if (footer && !footer.querySelector('.footer-service-directory')) {
	    footer.innerHTML = `
	      <div class="container">
	        <div class="footer-intro">
	          <div><a class="footer-brand footer-brand-logo" href="index.html" aria-label="TRISET Solutions India home"><img src="assets/logo_final.png" alt="TRISET Solutions India Pvt. Ltd." /></a><p class="footer-service-caption">From precise Photogrammetry and Data Entry to Digital Marketing, Web Development, and App Development, TRISET turns complex business needs into clear, reliable digital solutions.</p></div>
	          <div class="footer-contact"><a href="mailto:info@trisetsolutions.com">info@trisetsolutions.com</a><a href="tel:+917382819292">+91 7382 819 292</a></div>
	        </div>
	        <div class="footer-service-directory">
	          <div class="footer-service-column"><h3>Data Entry</h3><a href="data-entry.html">Data Entry Services</a><a href="data-entry.html">Data Processing</a><a href="data-entry.html">Data Cleansing</a><a href="data-entry.html">Data Conversion</a><a href="data-entry.html">Document Digitization</a></div>
	          <div class="footer-service-column"><h3>Photogrammetry</h3><a href="photogrammetry.html">Image Analysis</a><a href="photogrammetry.html">3D Modeling</a><a href="photogrammetry.html">Mapping &amp; Cartography</a><a href="photogrammetry.html">DEM &amp; Orthophoto</a><a href="photogrammetry.html">LiDAR, GIS &amp; Drone Services</a></div>
	          <div class="footer-service-column"><h3>Web Development</h3><a href="web-development.html">Custom Web Development</a><a href="web-development.html">WordPress</a><a href="web-development.html">Shopify</a><a href="web-development.html">UI/UX Design</a><a href="web-development.html">API Integration</a></div>
	          <div class="footer-service-column"><h3>App Development</h3><a href="app-development.html">Android Apps</a><a href="app-development.html">iOS Apps</a><a href="app-development.html">Cross-Platform Apps</a><a href="app-development.html">App UI/UX</a><a href="app-development.html">Integrations &amp; Support</a></div>
	          <div class="footer-service-column"><h3>Digital Marketing</h3><a href="digital-marketing.html">SEO &amp; Local SEO</a><a href="digital-marketing.html">Technical SEO</a><a href="digital-marketing.html">PPC &amp; Paid Ads</a><a href="digital-marketing.html">Social Media</a><a href="digital-marketing.html">Email &amp; Content Marketing</a></div>
	        </div>
	        <div class="footer-bottom"><span>Copyright © 2026 Triset Solutions India Private Limited. All Rights Reserved.</span><span><a href="privacy.html">Privacy Policy</a><a href="terms.html">Terms of Use</a><a href="disclaimer.html">Disclaimer</a><span class="footer-credit">Designed &amp; Developed by Triset Team</span></span></div>
	      </div>`;
	  }

	  // Services mega-menu shared by every public page.
	  const servicesLink = siteNav && Array.from(siteNav.querySelectorAll('a')).find((link) => link.textContent.trim() === 'Services');
	  if (servicesLink && !siteNav.querySelector('.services-nav-item')) {
	    const servicesItem = document.createElement('div');
	    servicesItem.className = 'services-nav-item';
	    servicesLink.parentNode.insertBefore(servicesItem, servicesLink);
	    servicesItem.appendChild(servicesLink);
	    servicesLink.setAttribute('aria-haspopup', 'true');
	    servicesLink.setAttribute('aria-expanded', 'false');
	    servicesLink.insertAdjacentHTML('afterend', '<button class="nav-expand-toggle" type="button" aria-label="Expand Services" aria-expanded="false"><span aria-hidden="true">+</span></button>');
	    servicesItem.insertAdjacentHTML('beforeend', `
	      <div class="services-mega-menu" role="menu" aria-label="Services menu">
	        <div class="services-mega-sidebar" role="tablist" aria-label="Service categories">
	          <a class="services-mega-service is-active" href="photogrammetry.html" data-service-menu="photogrammetry" role="tab" aria-selected="true"><span aria-hidden="true">◉</span> Photogrammetry</a>
	          <a class="services-mega-service" href="digital-marketing.html" data-service-menu="digital-marketing" role="tab" aria-selected="false"><span aria-hidden="true">◈</span> Digital Marketing</a>
	          <a class="services-mega-service" href="web-development.html" data-service-menu="web-development" role="tab" aria-selected="false"><span aria-hidden="true">▣</span> Web Development</a>
	          <a class="services-mega-service" href="app-development.html" data-service-menu="app-development" role="tab" aria-selected="false"><span aria-hidden="true">▯</span> App Development</a>
	          <a class="services-mega-service" href="data-entry.html" data-service-menu="data-entry" role="tab" aria-selected="false"><span aria-hidden="true">▤</span> Data Entry</a>
	        </div>
	        <div class="services-mega-content">
	          <section class="services-mega-panel is-active" data-service-panel="photogrammetry" role="tabpanel">
	            <div class="services-mega-panel-column"><h3>Services</h3><a href="photogrammetry.html">Image Analysis</a><a href="photogrammetry.html">3D Modeling</a><a href="photogrammetry.html">Mapping &amp; Cartography</a><a href="photogrammetry.html">DEM &amp; Orthophoto</a><a href="photogrammetry.html">LiDAR, GIS &amp; Drone Services</a></div>
	          </section>
	          <section class="services-mega-panel" data-service-panel="web-development" role="tabpanel">
	            <div class="services-mega-panel-column"><h3>Services</h3><a href="web-development.html">Custom Web Development</a><a href="web-development.html">WordPress</a><a href="web-development.html">UI/UX Design</a><a href="web-development.html">API Integration</a></div>
	          </section>
	          <section class="services-mega-panel" data-service-panel="app-development" role="tabpanel">
	            <div class="services-mega-panel-column"><h3>Services</h3><a href="app-development.html">Android Apps</a><a href="app-development.html">iOS Apps</a><a href="app-development.html">Cross-Platform Apps</a><a href="app-development.html">App UI/UX</a></div>
	          </section>
	          <section class="services-mega-panel" data-service-panel="data-entry" role="tabpanel">
	            <div class="services-mega-panel-column"><h3>Services</h3><a href="data-entry.html">Data Entry Services</a><a href="data-entry.html">Data Processing</a><a href="data-entry.html">Data Cleansing</a><a href="data-entry.html">Data Conversion</a><a href="data-entry.html">Document Digitization</a></div>
	          </section>
	          <section class="services-mega-panel" data-service-panel="digital-marketing" role="tabpanel">
	            <div class="services-mega-panel-column"><h3>Services</h3><a href="digital-marketing.html">SEO &amp; Local SEO</a><a href="digital-marketing.html">Technical SEO</a><a href="digital-marketing.html">PPC &amp; Paid Ads</a><a href="digital-marketing.html">Social Media Marketing</a><a href="digital-marketing.html">Email &amp; Content Marketing</a></div>
	          </section>
	        </div>
	      </div>`);
	    servicesItem.querySelectorAll('[data-service-menu]').forEach((serviceTab) => {
	      const activateService = () => {
	        const serviceKey = serviceTab.dataset.serviceMenu;
	        servicesItem.querySelectorAll('[data-service-menu]').forEach((tab) => {
	          const active = tab === serviceTab;
	          tab.classList.toggle('is-active', active);
	          tab.setAttribute('aria-selected', String(active));
	        });
	        servicesItem.querySelectorAll('[data-service-panel]').forEach((panel) => {
	          panel.classList.toggle('is-active', panel.dataset.servicePanel === serviceKey);
	        });
	      };
      serviceTab.addEventListener('mouseenter', activateService);
      serviceTab.addEventListener('focus', activateService);
    });
	    const servicesToggle = servicesItem.querySelector('.nav-expand-toggle');
	    const setServicesOpen = (open) => {
	      servicesItem.classList.toggle('is-open', open);
	      servicesLink.setAttribute('aria-expanded', String(open));
	      servicesToggle.setAttribute('aria-expanded', String(open));
	      servicesToggle.setAttribute('aria-label', `${open ? 'Collapse' : 'Expand'} Services`);
	      servicesToggle.querySelector('span').textContent = open ? '−' : '+';
	    };
	    servicesToggle.addEventListener('click', (event) => {
	      event.preventDefault();
	      event.stopPropagation();
	      if (window.matchMedia('(max-width: 720px)').matches) setServicesOpen(!servicesItem.classList.contains('is-open'));
	    });

	    servicesItem.addEventListener('mouseenter', () => servicesLink.setAttribute('aria-expanded', 'true'));
	    servicesItem.addEventListener('mouseleave', () => servicesLink.setAttribute('aria-expanded', 'false'));
	    servicesItem.addEventListener('focusin', () => servicesLink.setAttribute('aria-expanded', 'true'));
	    servicesItem.addEventListener('focusout', (event) => {
	      if (!servicesItem.contains(event.relatedTarget)) servicesLink.setAttribute('aria-expanded', 'false');
	    });
	    servicesLink.addEventListener('click', (event) => {
	      if (window.matchMedia('(max-width: 720px)').matches && servicesLink.getAttribute('aria-expanded') !== 'true') {
	        event.preventDefault();
	        servicesLink.setAttribute('aria-expanded', 'true');
	      }
	    });
	  }

	  // Click-open Industries dropdown, matching the compact reference menu.
	  const industriesLink = siteNav && Array.from(siteNav.querySelectorAll('a')).find((link) => /industries\.html/.test(link.getAttribute('href') || ''));
	  if (industriesLink && !siteNav.querySelector('.industries-nav-item')) {
	    const industriesItem = document.createElement('div');
	    industriesItem.className = 'industries-nav-item';
	    industriesLink.parentNode.insertBefore(industriesItem, industriesLink);
	    industriesItem.appendChild(industriesLink);
    industriesLink.setAttribute('aria-haspopup', 'true');
    industriesLink.setAttribute('aria-expanded', 'false');
	    industriesLink.insertAdjacentHTML('afterend', '<button class="nav-expand-toggle" type="button" aria-label="Expand Industries" aria-expanded="false"><span aria-hidden="true">+</span></button>');
    industriesItem.insertAdjacentHTML('beforeend', `
	      <div class="industries-dropdown" role="menu" aria-label="Industries menu">
	        <a href="industry-detail.html?industry=healthcare">Healthcare</a><a href="industry-detail.html?industry=education">Education</a><a href="industry-detail.html?industry=it-ites">IT &amp; ITES</a><a href="industry-detail.html?industry=ngos">NGOs</a><a href="industry-detail.html?industry=real-estate">Real Estate</a><a href="industry-detail.html?industry=fintech">Fintech</a><a href="industry-detail.html?industry=manufacturing">Manufacturers</a><a href="industry-detail.html?industry=entertainment">Entertainment</a><a href="industry-detail.html?industry=fashion-beauty">Fashion &amp; Beauty</a><a href="industry-detail.html?industry=solar">Solar</a><a href="industry-detail.html?industry=e-commerce">E-Commerce</a><a href="industry-detail.html?industry=human-resources">Human Resources</a>
	      </div>`);
	    const industriesToggle = industriesItem.querySelector('.nav-expand-toggle');

	    const closeIndustries = () => {
	      industriesItem.classList.remove('is-open');
	      industriesLink.setAttribute('aria-expanded', 'false');
	      industriesToggle.setAttribute('aria-expanded', 'false');
	      industriesToggle.setAttribute('aria-label', 'Expand Industries');
	      industriesToggle.querySelector('span').textContent = '+';
	    };
	    industriesToggle.addEventListener('click', (event) => {
	      event.preventDefault();
	      event.stopPropagation();
	      if (window.matchMedia('(max-width: 720px)').matches) {
	        if (industriesItem.classList.contains('is-open')) closeIndustries();
	        else {
	          industriesItem.classList.add('is-open');
	          industriesLink.setAttribute('aria-expanded', 'true');
	          industriesToggle.setAttribute('aria-expanded', 'true');
	          industriesToggle.setAttribute('aria-label', 'Collapse Industries');
	          industriesToggle.querySelector('span').textContent = '−';
	        }
	      }
	    });
	    industriesItem.addEventListener('mouseenter', () => industriesLink.setAttribute('aria-expanded', 'true'));
	    industriesItem.addEventListener('mouseleave', closeIndustries);
	    industriesItem.addEventListener('focusin', () => industriesLink.setAttribute('aria-expanded', 'true'));
	    industriesItem.addEventListener('focusout', (event) => {
	      if (!industriesItem.contains(event.relatedTarget)) closeIndustries();
	    });
	    industriesLink.addEventListener('click', (event) => {
	      // On mobile there is no hover, so the first tap opens the submenu;
	      // desktop clicks keep the normal Industries page navigation.
	      if (window.matchMedia('(max-width: 720px)').matches && !industriesItem.classList.contains('is-open')) {
	        event.preventDefault();
	        industriesItem.classList.add('is-open');
	        industriesLink.setAttribute('aria-expanded', 'true');
	      }
	    });
	    document.addEventListener('click', (event) => {
	      if (!industriesItem.contains(event.target)) closeIndustries();
	    });
	    document.addEventListener('keydown', (event) => {
	      if (event.key === 'Escape') closeIndustries();
	    });
	  }

  const storedTheme = localStorage.getItem('triset-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  const themeMotion = {
    active: false,
    state: initialTheme === 'dark' ? 'darkIdle' : 'idle',
    raf: 0,
    duration: 1650,
    palette: {
      light: {
        ink: '#0F1724',
        ink2: '#152331',
        muted: '#5B6B7C',
        paper: '#FBFCFD',
        surface: '#ffffff',
        surface2: '#f4f8fc',
        line: 'rgba(15, 23, 36, 0.12)',
        gridLine: 'rgba(15, 23, 36, 0.06)',
        themePanel: '#ffffff',
        themePanelSoft: '#f4f8fc',
        themePanelGlass: 'rgba(255, 255, 255, 0.86)',
        themeBorder: 'rgba(15, 23, 36, 0.12)',
        themeInput: '#ffffff',
        themeInputText: '#0f1724'
      },
      dark: {
        ink: '#f6f9fc',
        ink2: '#e2edf8',
        muted: '#a9b8c8',
        paper: '#050b12',
        surface: '#0b1724',
        surface2: '#0f2236',
        line: 'rgba(232, 240, 248, 0.16)',
        gridLine: 'rgba(232, 240, 248, 0.07)',
        themePanel: '#0b1724',
        themePanelSoft: '#0f2236',
        themePanelGlass: 'rgba(11, 23, 36, 0.88)',
        themeBorder: 'rgba(232, 240, 248, 0.16)',
        themeInput: '#071523',
        themeInputText: '#f6f9fc'
      }
    }
  };

  function parseColor(value) {
    const canvas = parseColor.canvas || (parseColor.canvas = document.createElement('canvas'));
    const context = canvas.getContext('2d');
    context.fillStyle = value;
    const normalized = context.fillStyle;

    if (normalized.startsWith('#')) {
      const hex = normalized.slice(1);
      const size = hex.length === 3 ? 1 : 2;
      const parts = size === 1
        ? hex.split('').map((part) => part + part)
        : [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)];
      return parts.map((part) => parseInt(part, 16)).concat(1);
    }

    const channels = normalized.match(/[\d.]+/g).map(Number);
    return [
      channels[0] || 0,
      channels[1] || 0,
      channels[2] || 0,
      channels[3] === undefined ? 1 : channels[3]
    ];
  }

  function mixColor(from, to, progress) {
    const start = parseColor(from);
    const end = parseColor(to);
    const mixed = start.map((channel, index) => channel + (end[index] - channel) * progress);
    return `rgba(${Math.round(mixed[0])}, ${Math.round(mixed[1])}, ${Math.round(mixed[2])}, ${mixed[3].toFixed(3)})`;
  }

  function applyThemeProgress(fromTheme, toTheme, progress) {
    const from = themeMotion.palette[fromTheme];
    const to = themeMotion.palette[toTheme];
    const pairs = {
      '--ink': ['ink', 'ink'],
      '--ink-2': ['ink2', 'ink2'],
      '--muted': ['muted', 'muted'],
      '--paper': ['paper', 'paper'],
      '--surface': ['surface', 'surface'],
      '--surface-2': ['surface2', 'surface2'],
      '--line': ['line', 'line'],
      '--grid-line': ['gridLine', 'gridLine'],
      '--theme-panel': ['themePanel', 'themePanel'],
      '--theme-panel-soft': ['themePanelSoft', 'themePanelSoft'],
      '--theme-panel-glass': ['themePanelGlass', 'themePanelGlass'],
      '--theme-text': ['ink', 'ink'],
      '--theme-muted': ['muted', 'muted'],
      '--theme-border': ['themeBorder', 'themeBorder'],
      '--theme-input': ['themeInput', 'themeInput'],
      '--theme-input-text': ['themeInputText', 'themeInputText']
    };

    Object.entries(pairs).forEach(([property, [fromKey, toKey]]) => {
      root.style.setProperty(property, mixColor(from[fromKey], to[toKey], progress));
    });
    root.style.setProperty('--theme-progress', progress.toFixed(3));
  }

  function clearThemeProgress() {
    [
      '--ink',
      '--ink-2',
      '--muted',
      '--paper',
      '--surface',
      '--surface-2',
      '--line',
      '--grid-line',
      '--theme-panel',
      '--theme-panel-soft',
      '--theme-panel-glass',
      '--theme-text',
      '--theme-muted',
      '--theme-border',
      '--theme-input',
      '--theme-input-text',
      '--theme-progress'
    ].forEach((property) => root.style.removeProperty(property));
  }

  function syncThemeButtons(theme) {
    const isDark = theme === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach((toggle) => {
      toggle.style.display = '';
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      toggle.innerHTML = `
        <span class="theme-bulb ${isDark ? 'theme-bulb--off' : 'theme-bulb--on'}" aria-hidden="true">
          <svg viewBox="0 0 40 40" focusable="false">
            <path class="theme-bulb-glass" d="M20 4.5c-7 0-12.2 5.1-12.2 11.7 0 4.5 2.4 7.2 4.6 9.6 1.3 1.4 2.2 2.7 2.5 4.6h10.2c.3-1.9 1.2-3.2 2.5-4.6 2.2-2.4 4.6-5.1 4.6-9.6C32.2 9.6 27 4.5 20 4.5Z" />
            <path class="theme-bulb-filament" d="M15.3 18.5c1.7-2.3 3.1-2.3 4.7 0 1.6 2.3 3 2.3 4.7 0" />
            <path class="theme-bulb-stem" d="M17.1 30.5h5.8" />
            <path class="theme-bulb-base" d="M15.4 29.6h9.2v5.1c0 1.1-.9 2-2 2h-5.2c-1.1 0-2-.9-2-2v-5.1Z" />
            <path class="theme-bulb-ridge" d="M15.2 31.5h9.6M15.8 33.6h8.4" />
          </svg>
        </span>
      `;
    });
    document.querySelectorAll('[data-theme-micro]').forEach((micro) => {
      micro.dataset.themeState = theme;
    });
  }

  function syncThemeMeta(theme) {
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', theme === 'dark' ? '#050b12' : '#185B9F');
    }
  }

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem('triset-theme', theme);
    syncThemeButtons(theme);
    syncThemeMeta(theme);
  }

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const lerp = (from, to, progress) => from + (to - from) * progress;
  const easeInOut = (time) => time < 0.5 ? 4 * time * time * time : 1 - Math.pow(-2 * time + 2, 3) / 2;
  const easeOut = (time) => 1 - Math.pow(1 - time, 3);

  function phase(progress, start, end) {
    return clamp((progress - start) / (end - start));
  }

  function timelinePose(progress, toDark) {
    const prepare = easeInOut(phase(progress, 0.00, 0.15));
    const stand = easeInOut(phase(progress, 0.15, 0.30));
    const reach = easeInOut(phase(progress, 0.30, 0.55));
    const grip = easeInOut(phase(progress, 0.55, 0.62));
    const pull = easeInOut(phase(progress, 0.62, 0.82));
    const hold = easeInOut(phase(progress, 0.82, 0.90));
    const release = easeOut(phase(progress, 0.90, 1.00));
    const contact = Math.max(reach, grip, pull, hold) * (1 - release);
    const force = Math.max(pull, hold) * (1 - release);
    const direction = toDark ? 1 : -1;
    const themeProgress = easeInOut(phase(progress, 0.55, 0.82));
    const threadTop = { x: 24, y: 2 };
    const gripPoint = {
      x: lerp(31, 33, reach) + lerp(0, 10, force),
      y: lerp(37, 33, reach) + direction * lerp(0, 7, force)
    };
    const leftShoulder = {
      x: 50 + lerp(0, -3, stand) + lerp(0, -4, force),
      y: 27 + lerp(0, -1, prepare) + direction * lerp(0, 2, force)
    };
    const rightShoulder = {
      x: 38 + lerp(0, -2, stand) + lerp(0, -5, force),
      y: 27 + lerp(0, -1, prepare) + direction * lerp(0, 2, force)
    };
    const leftIdleHand = { x: 54, y: 43 };
    const rightIdleHand = { x: 34, y: 43 };
    const leftGripHand = { x: gripPoint.x + 2.2, y: gripPoint.y + 2.2 };
    const rightGripHand = { x: gripPoint.x - 1.9, y: gripPoint.y - 1.8 };
    const leftHand = {
      x: lerp(leftIdleHand.x, leftGripHand.x, contact),
      y: lerp(leftIdleHand.y, leftGripHand.y, contact)
    };
    const rightHand = {
      x: lerp(rightIdleHand.x, rightGripHand.x, contact),
      y: lerp(rightIdleHand.y, rightGripHand.y, contact)
    };

    return {
      theme: themeProgress,
      bodyX: lerp(2, 0, stand) + lerp(0, -5, reach) + lerp(0, -6, force) + lerp(0, 12, release),
      bodyY: lerp(0, -1, prepare) + direction * lerp(0, 4, force) - direction * lerp(0, 4, release),
      bodyRotate: lerp(6, 1, stand) + lerp(0, -6, reach) + direction * lerp(0, -8, force) + lerp(0, 14 + direction * 7, release),
      bodySkew: lerp(1.5, 0, stand) + direction * lerp(0, -4, force),
      headRotate: lerp(-4, -1, stand) + lerp(0, -4, reach) + direction * lerp(0, -6, force) + lerp(0, 8 + direction * 5, release),
      leftShoulder,
      rightShoulder,
      leftHand,
      rightHand,
      leftElbow: {
        x: lerp((leftShoulder.x + leftIdleHand.x) / 2 + 5, (leftShoulder.x + leftGripHand.x) / 2 + 3, contact) + direction * lerp(0, -2, force),
        y: lerp((leftShoulder.y + leftIdleHand.y) / 2 + 3, (leftShoulder.y + leftGripHand.y) / 2 - 4, contact)
      },
      rightElbow: {
        x: lerp((rightShoulder.x + rightIdleHand.x) / 2 - 4, (rightShoulder.x + rightGripHand.x) / 2 - 2, contact) + direction * lerp(0, -2, force),
        y: lerp((rightShoulder.y + rightIdleHand.y) / 2 - 1, (rightShoulder.y + rightGripHand.y) / 2 - 5, contact)
      },
      legFrontRotate: lerp(-3, -8, contact) + direction * lerp(0, -4, force),
      legBackRotate: lerp(5, 2, contact) + direction * lerp(0, 3, force),
      threadTop,
      threadGrip: {
        x: lerp(24, gripPoint.x, contact),
        y: lerp(34, gripPoint.y, contact)
      },
      threadTension: 1 + lerp(0, 0.18, force),
      grip
    };
  }

  function setTransform(element, transform) {
    if (element) element.style.transform = transform;
  }

  function setAttr(element, name, value) {
    if (element) element.setAttribute(name, value);
  }

  function armPath(shoulder, elbow, hand) {
    return `M${shoulder.x.toFixed(1)} ${shoulder.y.toFixed(1)} C${elbow.x.toFixed(1)} ${elbow.y.toFixed(1)} ${elbow.x.toFixed(1)} ${elbow.y.toFixed(1)} ${hand.x.toFixed(1)} ${hand.y.toFixed(1)}`;
  }

  function updateThemeMicro(progress, toDark) {
    const micro = document.querySelector('[data-theme-micro]');
    if (!micro) return 0;

    const pose = timelinePose(progress, toDark);
    const person = micro.querySelector('.theme-person');
    const torso = micro.querySelector('.theme-torso');
    const shoulders = micro.querySelector('.theme-shoulders');
    const head = micro.querySelector('.theme-head');
    const leftArm = micro.querySelector('.theme-arm-left path');
    const rightArm = micro.querySelector('.theme-arm-right path');
    const leftHand = micro.querySelector('.theme-hand-left');
    const rightHand = micro.querySelector('.theme-hand-right');
    const frontLeg = micro.querySelector('.theme-leg-front');
    const backLeg = micro.querySelector('.theme-leg-back');
    const threadLine = micro.querySelector('.theme-thread-line');
    const threadGlint = micro.querySelector('.theme-thread-glint');
    const threadKnot = micro.querySelector('.theme-thread-knot');

    setTransform(person, `translate(${pose.bodyX.toFixed(2)}px, ${pose.bodyY.toFixed(2)}px) rotate(${pose.bodyRotate.toFixed(2)}deg) skewX(${pose.bodySkew.toFixed(2)}deg)`);
    setTransform(torso, `rotate(${(pose.bodyRotate * 0.22).toFixed(2)}deg)`);
    setTransform(shoulders, `rotate(${(pose.bodySkew * -0.7).toFixed(2)}deg)`);
    setTransform(head, `rotate(${pose.headRotate.toFixed(2)}deg)`);
    setTransform(frontLeg, `rotate(${pose.legFrontRotate.toFixed(2)}deg)`);
    setTransform(backLeg, `rotate(${pose.legBackRotate.toFixed(2)}deg)`);
    setAttr(leftArm, 'd', armPath(pose.leftShoulder, pose.leftElbow, pose.leftHand));
    setAttr(rightArm, 'd', armPath(pose.rightShoulder, pose.rightElbow, pose.rightHand));
    setAttr(leftHand, 'cx', pose.leftHand.x.toFixed(1));
    setAttr(leftHand, 'cy', pose.leftHand.y.toFixed(1));
    setAttr(rightHand, 'cx', pose.rightHand.x.toFixed(1));
    setAttr(rightHand, 'cy', pose.rightHand.y.toFixed(1));
    setAttr(threadLine, 'd', `M${pose.threadTop.x} ${pose.threadTop.y} C${(pose.threadTop.x - 1).toFixed(1)} ${(12 * pose.threadTension).toFixed(1)} ${(pose.threadGrip.x - 2).toFixed(1)} ${(pose.threadGrip.y - 7).toFixed(1)} ${pose.threadGrip.x.toFixed(1)} ${pose.threadGrip.y.toFixed(1)}`);
    setAttr(threadGlint, 'd', `M${(pose.threadTop.x + 2).toFixed(1)} ${pose.threadTop.y + 1} C${(pose.threadTop.x + 2).toFixed(1)} 10 ${(pose.threadGrip.x + 1).toFixed(1)} ${(pose.threadGrip.y - 8).toFixed(1)} ${(pose.threadGrip.x + 1).toFixed(1)} ${(pose.threadGrip.y - 2).toFixed(1)}`);
    setAttr(threadKnot, 'cx', pose.threadGrip.x.toFixed(1));
    setAttr(threadKnot, 'cy', pose.threadGrip.y.toFixed(1));
    micro.dataset.grip = pose.grip > 0.5 ? 'true' : 'false';
    return pose.theme;
  }

  function animateThemeSwitch(targetTheme) {
    // Theme changes should feel immediate; keep the control responsive and
    // avoid delaying the page style update with the decorative transition.
    if (themeMotion.active) return;
    setTheme(targetTheme);
    return;

    const sourceTheme = root.dataset.theme === 'dark' ? 'dark' : 'light';
    const toDark = targetTheme === 'dark';
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (motionQuery.matches) {
      setTheme(targetTheme);
      return;
    }

    themeMotion.active = true;
    themeMotion.state = toDark ? 'animatingToDark' : 'animatingToLight';
    root.classList.add('is-theme-animating');
    root.dataset.themeTarget = targetTheme;

    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const raw = Math.min(1, elapsed / themeMotion.duration);
      const themeProgress = updateThemeMicro(raw, toDark);
      applyThemeProgress(sourceTheme, targetTheme, themeProgress);

      if (raw < 1) {
        themeMotion.raf = requestAnimationFrame(tick);
        return;
      }

      cancelAnimationFrame(themeMotion.raf);
      setTheme(targetTheme);
      clearThemeProgress();
      root.classList.remove('is-theme-animating');
      root.removeAttribute('data-theme-target');
      updateThemeMicro(0, toDark);
      themeMotion.active = false;
      themeMotion.state = toDark ? 'darkIdle' : 'idle';
    }

    themeMotion.raf = requestAnimationFrame(tick);
  }

  setTheme(initialTheme);

  if (menuToggle) {
    menuToggle.textContent = '';
    menuToggle.insertAdjacentHTML('afterbegin', '<span class="menu-toggle-icon" aria-hidden="true"><span></span><span></span><span></span></span>');
    menuToggle.setAttribute('aria-label', 'Open menu');
  }

  let mobileActions = document.querySelector('.header-mobile-actions');
  if (menuToggle && themeToggle && !document.querySelector('.mobile-theme-toggle')) {
    const mobileThemeToggle = themeToggle.cloneNode(true);
    mobileThemeToggle.classList.add('mobile-theme-toggle');
    mobileThemeToggle.removeAttribute('id');
    mobileActions = document.createElement('span');
    mobileActions.className = 'header-mobile-actions';
    menuToggle.before(mobileActions);
    mobileActions.appendChild(mobileThemeToggle);
    mobileActions.appendChild(menuToggle);
    syncThemeButtons(root.dataset.theme);
  }

  function createThemeMicro() {
    const micro = document.createElement('span');
    micro.className = 'theme-micro';
    micro.dataset.themeMicro = '';
    micro.dataset.themeState = root.dataset.theme || initialTheme;
    micro.setAttribute('aria-hidden', 'true');
    micro.innerHTML = `
      <svg class="theme-rigger" viewBox="0 0 72 64" role="presentation" focusable="false" aria-hidden="true">
        <defs>
          <linearGradient id="themeSkin" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#ffd9b0" />
            <stop offset="56%" stop-color="#d89061" />
            <stop offset="100%" stop-color="#a75d3b" />
          </linearGradient>
          <linearGradient id="themeJacket" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#fbfbf4" />
            <stop offset="55%" stop-color="#e9e5d7" />
            <stop offset="100%" stop-color="#c8beaa" />
          </linearGradient>
          <linearGradient id="themePants" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#152331" />
            <stop offset="100%" stop-color="#071523" />
          </linearGradient>
          <radialGradient id="themeEye" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="62%" stop-color="#eaf7ff" />
            <stop offset="100%" stop-color="#4c5b6a" />
          </radialGradient>
          <filter id="themeSoftShadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="#071018" flood-opacity="0.22" />
          </filter>
        </defs>
        <g class="theme-thread">
          <path class="theme-thread-line" d="M24 2 C24 12 24 24 24 34" />
          <path class="theme-thread-glint" d="M26 3 C26 12 26 22 25 31" />
          <circle class="theme-thread-knot" cx="24" cy="34" r="2.5" />
        </g>
        <ellipse class="theme-person-shadow" cx="47" cy="59" rx="14" ry="3" />
        <g class="theme-person">
          <g class="theme-leg theme-leg-back">
            <path d="M43 39 C41 45 40 51 39 56" />
            <path class="theme-shoe" d="M35 57 C38 55 43 55 45 58 C41 60 37 60 35 57Z" />
          </g>
          <g class="theme-leg theme-leg-front">
            <path d="M50 39 C52 45 54 50 57 55" />
            <path class="theme-shoe" d="M54 57 C57 55 62 56 64 58 C60 60 56 60 54 57Z" />
          </g>
          <path class="theme-neck" d="M44 20 L50 20 L50 25 L44 25Z" />
          <g class="theme-shoulders">
            <path d="M37 26 C41 23 50 23 55 27" />
          </g>
          <g class="theme-torso">
            <path d="M37 25 C41 22 51 22 56 27 C58 34 55 39 51 42 C46 44 39 42 36 38 C35 32 35 28 37 25Z" />
            <path class="theme-shirt" d="M44 25 L50 25 L48 41 C45 39 43 32 44 25Z" />
            <path class="theme-jacket-line" d="M40 27 C43 31 44 36 43 41" />
            <path class="theme-sleeve-stripe" d="M37 31 L43 32" />
            <path class="theme-sleeve-stripe" d="M51 32 L56 31" />
          </g>
          <g class="theme-arm theme-arm-left">
            <path d="M50 27 C55 31 56 37 54 43" />
            <circle class="theme-hand theme-hand-left" cx="54" cy="43" r="2.1" />
          </g>
          <g class="theme-arm theme-arm-right">
            <path d="M38 27 C34 31 33 37 34 43" />
            <circle class="theme-hand theme-hand-right" cx="34" cy="43" r="2.1" />
          </g>
          <g class="theme-head">
            <path class="theme-face" d="M38 12 C39 6 44 3 50 5 C56 7 59 14 55 19 C51 24 42 23 39 18 C38 16 37 14 38 12Z" />
            <path class="theme-hair" d="M37 13 C39 6 45 2 51 4 C55 5 58 9 58 13 C53 9 49 9 43 11 C42 15 40 18 37 19 C36 17 36 15 37 13Z" />
            <ellipse class="theme-eye" cx="45" cy="15" rx="1.9" ry="2.3" />
            <ellipse class="theme-eye" cx="52" cy="15" rx="1.8" ry="2.2" />
            <circle class="theme-pupil" cx="45.4" cy="15.3" r="0.85" />
            <circle class="theme-pupil" cx="52.2" cy="15.3" r="0.82" />
            <path class="theme-brow" d="M43 12.4 L47 12.1" />
            <path class="theme-brow" d="M50 12.2 L54 12.8" />
            <path class="theme-mouth" d="M47 19 C48 20 51 20 52 19" />
          </g>
        </g>
      </svg>
    `;
    return micro;
  }

  // Keep the light/dark control, but do not add the decorative character.
  const themeMicro = null;

  function positionThemeMicro() {
    if (!themeMicro) return;
    const mobileToggle = document.querySelector('.mobile-theme-toggle');
    const navToggle = siteNav ? siteNav.querySelector('[data-theme-toggle]') : themeToggle;
    const useMobile = window.matchMedia('(max-width: 980px)').matches && mobileToggle;
    const anchor = useMobile ? mobileToggle : navToggle;

    if (!anchor) return;
    themeMicro.classList.toggle('mobile-theme-micro', Boolean(useMobile));
    if (anchor.nextElementSibling !== themeMicro) {
      anchor.insertAdjacentElement('afterend', themeMicro);
    }
    if (useMobile && mobileActions && !mobileActions.contains(themeMicro)) {
      mobileActions.insertBefore(themeMicro, menuToggle);
    }
    updateThemeMicro(0, root.dataset.theme === 'dark');
  }

  positionThemeMicro();
  window.addEventListener('resize', positionThemeMicro);
  syncThemeButtons(root.dataset.theme);

  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-theme-toggle]');
    if (!toggle) return;
    animateThemeSwitch(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  if (menuToggle && siteNav) {
    function setMenuOpen(isOpen) {
      siteNav.classList.toggle('open', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
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

  const revealItems = document.querySelectorAll('.services-hero, .services-overview, .service-category, .services-cta, .section-header, .panel, .metric, .service-explorer, .service-card, .project-card, .story-node, .process-step, .process-showcase-copy, .process-showcase-stage, .process-scroll-step, .cta-band, .contact-card, .team-card, .image-panel, .story-visual, .story-copy, .value-row, .locations-map, .about-final-cta-inner');
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

  document.querySelectorAll('[data-scroll-process]').forEach((processSection) => {
    const steps = Array.from(processSection.querySelectorAll('[data-process-step]'));
    const markers = Array.from(processSection.querySelectorAll('[data-stage-marker]'));
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!steps.length) return;

    let ticking = false;

    function setActiveStep(activeIndex) {
      steps.forEach((step, index) => step.classList.toggle('active', index <= activeIndex));
      markers.forEach((marker, index) => marker.classList.toggle('active', index <= activeIndex));
    }

    function syncProcess() {
      const rect = processSection.getBoundingClientRect();
      const viewport = window.innerHeight || document.documentElement.clientHeight;
      const travel = Math.max(1, rect.height - viewport * 0.35);
      const rawProgress = (viewport * 0.68 - rect.top) / travel;
      const progress = Math.min(1, Math.max(0, rawProgress));
      const activeIndex = Math.min(steps.length - 1, Math.max(0, Math.floor(progress * steps.length)));

      processSection.style.setProperty('--process-progress', progress.toFixed(3));
      setActiveStep(activeIndex);
      ticking = false;
    }

    function requestSync() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(syncProcess);
    }

    setActiveStep(0);
    syncProcess();

    if (motionQuery.matches) {
      processSection.style.setProperty('--process-progress', '1');
      setActiveStep(steps.length - 1);
    } else {
      window.addEventListener('scroll', requestSync, { passive: true });
      window.addEventListener('resize', requestSync);
    }
  });

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

  document.querySelectorAll('a[href^="industry-detail.html?industry="]').forEach((link) => {
    const industry = new URL(link.href, window.location.href).searchParams.get('industry');
    if (industry) link.href = `industry-${industry}.html`;
  });

  document.querySelectorAll('.service-card:not(.reveal), .project-card:not(.reveal), .process-step:not(.reveal), .team-card:not(.reveal)').forEach((item, index) => {
    item.classList.add('reveal');
    window.setTimeout(() => item.classList.add('is-visible'), 80 + index * 28);
  });
});
