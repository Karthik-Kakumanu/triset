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
	          <a class="company-marquee__social company-marquee__social--instagram" href="https://www.instagram.com/trisetsolutions/" target="_blank" rel="noopener noreferrer" aria-label="TRISET on Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.4" cy="6.7" r="1.1" class="social-dot"/></svg></a>
	          <a class="company-marquee__social company-marquee__social--facebook" href="https://www.facebook.com/profile.php?id=61594497397035" target="_blank" rel="noopener noreferrer" aria-label="TRISET on Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v6h4v-6h3.2l.8-4H13V9c0-.7.3-1 1-1Z"/></svg></a>
	          <a class="company-marquee__social company-marquee__social--x" href="https://x.com/Trisetsolutions" target="_blank" rel="noopener noreferrer" aria-label="TRISET on X"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4.2l3.2 4.5L16.2 4H19l-5.3 6.1L19.5 20h-4.2l-3.8-5.2L7 20H4.2l5.6-6.6L5 4Zm3 1.8 7.9 12.4h1.2L9.2 5.8H8Z"/></svg></a>
	          <a class="company-marquee__social company-marquee__social--linkedin" href="https://www.linkedin.com/in/triset-solutions-534389440" target="_blank" rel="noopener noreferrer" aria-label="TRISET on LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8.2H2V21h3V8.2ZM3.5 3A1.8 1.8 0 1 0 3.5 6.6 1.8 1.8 0 0 0 3.5 3ZM8.5 8.2h3v1.7h.1c.4-.8 1.5-2.1 3.8-2.1 4 0 4.7 2.6 4.7 6V21h-3v-6.4c0-1.5 0-3.5-2.1-3.5s-2.4 1.6-2.4 3.4V21h-3V8.2Z"/></svg></a>
	          <a class="company-marquee__social company-marquee__social--whatsapp" href="https://wa.me/917382819292" target="_blank" rel="noopener noreferrer" aria-label="Chat with TRISET on WhatsApp at +91 7382 819 292"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a8.8 8.8 0 0 0-7.6 13.2L3 21l4.9-1.3A8.8 8.8 0 1 0 12 3Zm0 15.9a7.1 7.1 0 0 1-3.6-1l-.3-.2-2.9.8.8-2.8-.2-.3A7.1 7.1 0 1 1 12 18.9Zm3.9-5.3c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.1-.3.2-.5.1a5.8 5.8 0 0 1-2.9-2.5c-.2-.3 0-.4.1-.6l.4-.5c.1-.2.1-.3 0-.5l-.7-1.7c-.1-.2-.3-.2-.5-.2h-.4c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7a8.2 8.2 0 0 0 3.1 3c1.8.8 1.8.5 2.1.5.3 0 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2Z"/></svg></a>
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
	  const footerServiceGroups = [
	    {
	      name: 'Photogrammetry',
	      href: 'photogrammetry.html',
	      subservices: ['Image Analysis', '3D Modeling', 'Mapping & Cartography', 'DEM & Orthophoto', 'LiDAR, GIS & Drone Services']
	    },
	    {
	      name: 'Digital Marketing',
	      href: 'digital-marketing.html',
	      subservices: ['SEO & Local SEO', 'Technical SEO', 'PPC & Paid Ads', 'Social Media Marketing', 'Email & Content Marketing']
	    },
	    {
	      name: 'Web Development',
	      href: 'web-development.html',
	      subservices: ['Custom Web Development', 'WordPress', 'UI/UX Design', 'API Integration']
	    },
	    {
	      name: 'App Development',
	      href: 'app-development.html',
	      subservices: ['Android Apps', 'iOS Apps', 'Cross-Platform Apps', 'App UI/UX']
	    },
	    {
	      name: 'Data Entry',
	      href: 'data-entry.html',
	      subservices: ['Data Entry Services', 'Data Processing', 'Data Cleansing', 'Data Conversion', 'Document Digitization']
	    }
	  ];
	  const footerServiceDirectory = `
	    <section class="footer-service-directory" aria-label="Services and subservices">
	      ${footerServiceGroups.map((service) => `
	        <section class="footer-service-column" aria-label="${service.name} subservices">
	          <h2><a href="${service.href}">${service.name}</a></h2>
	          <ul>
	            ${service.subservices.map((subservice) => `<li><a href="${service.href}">${subservice}</a></li>`).join('')}
	          </ul>
	        </section>
	      `).join('')}
	    </section>
	  `;
	  const footerContactPanel = `
	    <section class="footer-contact-panel" aria-label="TRISET contact information">
	      <div class="footer-contact-brand">
	        <a class="footer-brand-link" href="index.html" aria-label="TRISET Solutions home">
	          <img class="footer-logo-img" src="assets/logo_final.png" alt="TRISET Solutions" />
	        </a>
	        <p>Enterprise technology and spatial operations, delivered with care.</p>
	      </div>
	      <div class="footer-contact-details">
	        <h2>Visit or contact us</h2>
	        <p><span aria-hidden="true">⌖</span> Hyderabad, Telangana 500081, India</p>
	        <a href="tel:+917382819292"><span aria-hidden="true">☎</span> +91 73828 19292</a>
	        <a href="mailto:info@trisetsolutions.com"><span aria-hidden="true">✉</span> info@trisetsolutions.com</a>
	      </div>
	    </section>
	  `;
	  const footerLegalBar = `
	    <div class="footer-legal-bar">
	      <span>© 2026 TRISET Solutions India Private Limited. All rights reserved.</span>
	      <nav aria-label="Legal links">
	        <a href="privacy.html">Privacy Policy</a>
	        <a href="terms.html">Terms and Conditions</a>
	        <a href="disclaimer.html">Disclaimer</a>
	      </nav>
	      <span class="footer-designed-by">Designed by the TRISET Team</span>
	    </div>
	  `;
	  if (footer) {
	    footer.innerHTML = `<div class="footer-premium-container">${footerContactPanel}${footerServiceDirectory}${footerLegalBar}</div>`;
	  }
	  if (footer && !footer.querySelector('.footer-premium-container')) {
	    footer.innerHTML = `
	      ${footerServiceDirectory}
	      <div class="container footer-premium-container">
	        <div class="footer-main-columns">
	          <!-- Col 1: Brand, Headquarters & Socials -->
	          <div class="footer-col footer-col-brand">
	            <a class="footer-brand-link" href="index.html" aria-label="TRISET Solutions home">
	              <img class="footer-logo-img" src="assets/logo_final.png" alt="TRISET Solutions India Logo" />
	            </a>
	            <p class="footer-brand-mission">
	              TRISET Solutions India Pvt. Ltd. delivers enterprise-grade software engineering, spatial photogrammetry, custom mobile apps, and structured data operations designed for performance and scale.
	            </p>
	            
	            <div class="footer-office-info">
	              <div class="office-line">
	                <span class="office-pin" aria-hidden="true">📍</span>
	                <span>Hyderabad, Telangana 500081, India</span>
	              </div>
	              <div class="office-line">
	                <span class="office-pin" aria-hidden="true">🕒</span>
	                <span>Mon – Sat: 9:00 AM – 7:00 PM IST</span>
	              </div>
	            </div>

	            <div class="footer-social-strip">
	              <a class="footer-social-btn" href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
	                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74V9.96H5.06v8.54h2.8z"/></svg>
	              </a>
	              <a class="footer-social-btn" href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X Twitter">
	                <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
	              </a>
	              <a class="footer-social-btn" href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
	                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
	              </a>
	              <a class="footer-social-btn" href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
	                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
	              </a>
	            </div>

	            <div class="footer-trust-badges">
	              <span class="trust-badge">🛡️ ISO 9001:2015</span>
	              <span class="trust-badge">🔒 100% Data Confidential</span>
	              <span class="trust-badge">⚡ Enterprise SLA</span>
	            </div>
	          </div>

	          <!-- Col 2: Industry Solutions -->
	          <div class="footer-col">
	            <h3 class="footer-heading">Industry Verticals</h3>
	            <ul class="footer-links-list">
	              <li><a href="industry-healthcare.html">Healthcare &amp; Hospitals</a></li>
	              <li><a href="industry-real-estate.html">Real Estate &amp; Spaces</a></li>
	              <li><a href="industry-it-ites.html">IT &amp; Technology Services</a></li>
	              <li><a href="industry-e-commerce.html">E-Commerce &amp; Retail</a></li>
	              <li><a href="industry-solar.html">Solar &amp; Renewable Energy</a></li>
	              <li><a href="industry-education.html">Education &amp; Academies</a></li>
	              <li><a href="industry-entertainment.html">Entertainment &amp; Media</a></li>
	              <li><a href="industry-human-resources.html">Human Resources &amp; Talent</a></li>
	              <li><a href="industry-manufacturing.html">Manufacturing Operations</a></li>
	              <li><a href="industry-ngos.html">NGOs &amp; Non-Profits</a></li>
	              <li><a href="solutions.html">Browse All 14+ Sectors →</a></li>
	            </ul>
	          </div>

	          <!-- Col 3: Company & Careers & Newsletter -->
	          <div class="footer-col">
	            <h3 class="footer-heading">Company</h3>
	            <ul class="footer-links-list">
	              <li><a href="about.html">About TRISET</a></li>
	              <li><a href="careers.html">Careers <span class="footer-hiring-pill">Hiring</span></a></li>
	              <li><a href="solutions.html">Client Solutions &amp; Work</a></li>
	              <li><a href="contact.html">Contact &amp; Global Office</a></li>
	              <li><a href="about.html#quality">Quality &amp; Standards</a></li>
	            </ul>

	            <div class="footer-newsletter-card">
	              <h4>Stay Connected</h4>
	              <p>Receive quarterly tech developments &amp; spatial innovations.</p>
	              <form class="footer-newsletter-form" onsubmit="event.preventDefault(); this.querySelector('button').textContent='✓'; this.querySelector('input').disabled=true;">
	                <input type="email" placeholder="Your work email..." required aria-label="Work email" />
	                <button type="submit" aria-label="Subscribe">→</button>
	              </form>
	              <span class="newsletter-safe">🔒 Zero spam. Unsubscribe anytime.</span>
	            </div>
	          </div>
	        </div>

	        <!-- Bottom Row: Copyright, Status & Legal -->
	        <div class="footer-bottom-row">
	          <div class="footer-bottom-copy">
	            <span>© 2026 TRISET Solutions India Private Limited. All Rights Reserved.</span>
	            <span class="footer-separator">·</span>
	            <span class="status-indicator-pill">
	              <span class="status-dot"></span>
	              <span>All Systems Operational · 99.98% SLA</span>
	            </span>
	          </div>

	          <div class="footer-legal-links">
	            <a href="privacy.html">Privacy Policy</a>
	            <a href="terms.html">Terms of Use</a>
	            <a href="disclaimer.html">Disclaimer</a>
	            <span class="footer-credit-text">Engineered by TRISET Solutions</span>
	          </div>
	        </div>
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
	          <a class="services-mega-service is-active" href="photogrammetry.html" data-service-menu="photogrammetry" role="tab" aria-selected="true"><span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M4 7h3l1.5-2h7L17 7h3v12H4z"/><circle cx="12" cy="13" r="3.5"/><path d="M18 10h.01"/></svg></span> Photogrammetry</a>
	          <a class="services-mega-service" href="digital-marketing.html" data-service-menu="digital-marketing" role="tab" aria-selected="false"><span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M4 10v4h4l9 5V5l-9 5H4zM8 14l2 6h3l-2.2-5.2M20 9a5 5 0 0 1 0 6M18.5 10.5a2.5 2.5 0 0 1 0 3"/></svg></span> Digital Marketing</a>
	          <a class="services-mega-service" href="web-development.html" data-service-menu="web-development" role="tab" aria-selected="false"><span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 8h18M8 6h.01M6 13l2 2-2 2M12 17l2-4M16 13l2 2-2 2"/></svg></span> Web Development</a>
	          <a class="services-mega-service" href="app-development.html" data-service-menu="app-development" role="tab" aria-selected="false"><span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M10 5h4M11 18.5h2"/></svg></span> App Development</a>
	          <a class="services-mega-service" href="data-entry.html" data-service-menu="data-entry" role="tab" aria-selected="false"><span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4V2h6v2M8 10h8M8 14h8M8 18h4"/></svg></span> Data Entry</a>
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
      const servicesMegaMenu = servicesItem.querySelector('.services-mega-menu');
      const mobileServiceAccordion = document.createElement('div');
      mobileServiceAccordion.className = 'services-mobile-accordion';
      mobileServiceAccordion.setAttribute('aria-label', 'Service categories');

      servicesItem.querySelectorAll('[data-service-menu]').forEach((serviceTab) => {
        const serviceKey = serviceTab.dataset.serviceMenu;
        const servicePanel = servicesItem.querySelector(`[data-service-panel="${serviceKey}"]`);
        const panelContent = servicePanel?.querySelector('.services-mega-panel-column');
        if (!panelContent) {
          throw new Error(`Missing service navigation panel for "${serviceKey}"`);
        }

        const group = document.createElement('section');
        group.className = 'services-mobile-group';
        const heading = document.createElement('div');
        heading.className = 'services-mobile-heading';
        const serviceLink = serviceTab.cloneNode(true);
        serviceLink.classList.remove('is-active');
        serviceLink.removeAttribute('data-service-menu');
        serviceLink.removeAttribute('role');
        serviceLink.removeAttribute('aria-selected');
        serviceLink.classList.add('services-mobile-service-link');

        const subservicesId = `mobile-service-panel-${serviceKey}`;
        const toggle = document.createElement('button');
        toggle.className = 'services-mobile-toggle';
        toggle.type = 'button';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', subservicesId);
        toggle.setAttribute('aria-label', `Expand ${serviceLink.textContent.trim()} subservices`);
        toggle.innerHTML = '<span aria-hidden="true">+</span>';

        const subservices = document.createElement('div');
        subservices.className = 'services-mobile-subservices';
        subservices.id = subservicesId;
        subservices.hidden = true;
        subservices.append(panelContent.cloneNode(true));

        heading.append(serviceLink, toggle);
        group.append(heading, subservices);
        mobileServiceAccordion.appendChild(group);
      });

      servicesMegaMenu.appendChild(mobileServiceAccordion);
      mobileServiceAccordion.addEventListener('click', (event) => {
        const toggle = event.target.closest('.services-mobile-toggle');
        if (!toggle) return;

        const group = toggle.closest('.services-mobile-group');
        const shouldOpen = toggle.getAttribute('aria-expanded') !== 'true';
        mobileServiceAccordion.querySelectorAll('.services-mobile-group').forEach((serviceGroup) => {
          const serviceToggle = serviceGroup.querySelector('.services-mobile-toggle');
          const isOpen = serviceGroup === group && shouldOpen;
          const panel = serviceGroup.querySelector('.services-mobile-subservices');
          serviceGroup.classList.toggle('is-open', isOpen);
          serviceToggle.setAttribute('aria-expanded', String(isOpen));
          serviceToggle.setAttribute('aria-label', `${isOpen ? 'Collapse' : 'Expand'} ${serviceGroup.querySelector('.services-mobile-service-link').textContent.trim()} subservices`);
          serviceToggle.querySelector('span').textContent = isOpen ? '−' : '+';
          panel.hidden = !isOpen;
        });
      });

	    servicesItem.querySelectorAll('[data-service-menu]').forEach((serviceTab) => {
      const activateService = (activeServiceKey, isActive = true) => {
        servicesItem.querySelectorAll('[data-service-menu]').forEach((tab) => {
          const active = isActive && tab.dataset.serviceMenu === activeServiceKey;
          tab.classList.toggle('is-active', active);
          tab.setAttribute('aria-selected', String(active));
        });
        servicesItem.querySelectorAll('[data-service-panel]').forEach((panel) => {
          panel.classList.toggle('is-active', isActive && panel.dataset.servicePanel === activeServiceKey);
        });
      };
      serviceTab.addEventListener('mouseenter', () => {
        if (!window.matchMedia('(max-width: 980px)').matches) activateService(serviceTab.dataset.serviceMenu);
      });
      serviceTab.addEventListener('focus', () => {
        if (!window.matchMedia('(max-width: 980px)').matches) activateService(serviceTab.dataset.serviceMenu);
      });
      serviceTab.addEventListener('click', (event) => {
        if (!window.matchMedia('(max-width: 980px)').matches) return;
        event.preventDefault();
        activateService(serviceTab.dataset.serviceMenu);
      });
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
	      if (window.matchMedia('(max-width: 980px)').matches) setServicesOpen(!servicesItem.classList.contains('is-open'));
	    });

	    servicesItem.addEventListener('mouseenter', () => {
	      if (!window.matchMedia('(max-width: 980px)').matches) servicesLink.setAttribute('aria-expanded', 'true');
	    });
	    servicesItem.addEventListener('mouseleave', () => {
	      if (!window.matchMedia('(max-width: 980px)').matches) servicesLink.setAttribute('aria-expanded', 'false');
	    });
	    servicesItem.addEventListener('focusin', () => {
	      if (!window.matchMedia('(max-width: 980px)').matches) servicesLink.setAttribute('aria-expanded', 'true');
	    });
	    servicesItem.addEventListener('focusout', (event) => {
	      if (!window.matchMedia('(max-width: 980px)').matches && !servicesItem.contains(event.relatedTarget)) {
	        servicesLink.setAttribute('aria-expanded', 'false');
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
	        <a href="industry-healthcare.html">Healthcare</a><a href="industry-education.html">Education</a><a href="industry-it-ites.html">IT &amp; ITES</a><a href="industry-ngos.html">NGOs</a><a href="industry-real-estate.html">Real Estate</a><a href="industry-fintech.html">Fintech</a><a href="industry-manufacturing.html">Manufacturers</a><a href="industry-entertainment.html">Entertainment</a><a href="industry-fashion-beauty.html">Fashion &amp; Beauty</a><a href="industry-solar.html">Solar</a><a href="industry-e-commerce.html">E-Commerce</a><a href="industry-human-resources.html">Human Resources</a>
	      </div>`);
	    const industriesToggle = industriesItem.querySelector('.nav-expand-toggle');

	    const setIndustriesOpen = (open) => {
	      industriesItem.classList.toggle('is-open', open);
	      industriesLink.setAttribute('aria-expanded', String(open));
	      industriesToggle.setAttribute('aria-expanded', String(open));
	      industriesToggle.setAttribute('aria-label', `${open ? 'Collapse' : 'Expand'} Industries`);
	      industriesToggle.querySelector('span').textContent = open ? '−' : '+';
	    };
	    const closeIndustries = () => {
	      setIndustriesOpen(false);
	    };
	    industriesToggle.addEventListener('click', (event) => {
	      event.preventDefault();
	      event.stopPropagation();
	      if (window.matchMedia('(max-width: 980px)').matches) setIndustriesOpen(!industriesItem.classList.contains('is-open'));
	    });
	    industriesItem.addEventListener('mouseenter', () => {
	      if (!window.matchMedia('(max-width: 980px)').matches) industriesLink.setAttribute('aria-expanded', 'true');
	    });
	    industriesItem.addEventListener('mouseleave', () => {
	      if (!window.matchMedia('(max-width: 980px)').matches) closeIndustries();
	    });
	    industriesItem.addEventListener('focusin', () => {
	      if (!window.matchMedia('(max-width: 980px)').matches) industriesLink.setAttribute('aria-expanded', 'true');
	    });
	    industriesItem.addEventListener('focusout', (event) => {
	      if (!window.matchMedia('(max-width: 980px)').matches && !industriesItem.contains(event.relatedTarget)) {
	        closeIndustries();
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
        ink: '#000000',
        ink2: '#000000',
        muted: '#5B6B7C',
        paper: '#FBFCFD',
        surface: '#ffffff',
        surface2: '#f4f8fc',
        line: 'rgba(0, 0, 0, 0.12)',
        gridLine: 'rgba(0, 0, 0, 0.06)',
        themePanel: '#ffffff',
        themePanelSoft: '#f4f8fc',
        themePanelGlass: 'rgba(255, 255, 255, 0.86)',
        themeBorder: 'rgba(0, 0, 0, 0.12)',
        themeInput: '#ffffff',
        themeInputText: '#000000'
      },
      dark: {
        ink: '#f6f9fc',
        ink2: '#F8E2E3',
        muted: '#a9b8c8',
        paper: '#050b12',
        surface: '#000000',
        surface2: '#000000',
        line: 'rgba(248, 232, 233, 0.16)',
        gridLine: 'rgba(248, 232, 233, 0.07)',
        themePanel: '#000000',
        themePanelSoft: '#000000',
        themePanelGlass: 'rgba(0, 0, 0, 0.88)',
        themeBorder: 'rgba(248, 232, 233, 0.16)',
        themeInput: '#000000',
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
      themeMeta.setAttribute('content', theme === 'dark' ? '#050b12' : '#FF0000');
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
            <stop offset="0%" stop-color="#000000" />
            <stop offset="100%" stop-color="#000000" />
          </linearGradient>
          <radialGradient id="themeEye" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="62%" stop-color="#FCEDEE" />
            <stop offset="100%" stop-color="#4c5b6a" />
          </radialGradient>
          <filter id="themeSoftShadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="#000000" flood-opacity="0.22" />
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
      if (event.target.closest('a') && !event.defaultPrevented) {
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

  const revealItems = document.querySelectorAll('.services-hero, .services-overview, .service-category, .services-cta, .section-header, .panel, .metric, .service-explorer, .service-card, .project-card, .story-node, .process-step, .process-scroll-step, .cta-band, .contact-card, .team-card, .image-panel, .story-visual, .story-copy, .value-row, .locations-map, .about-final-cta-inner');
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
        context.strokeStyle = row % 4 === 0 ? 'rgba(255, 0, 0,.36)' : 'rgba(231, 197, 199,.20)';
        context.stroke();
      }

      for (let i = 0; i < 72; i += 1) {
        const x = w * (0.12 + ((i * 37) % 77) / 100);
        const y = h * (0.18 + ((i * 19) % 62) / 100) + Math.sin(frame * 0.02 + i) * 4;
        context.fillStyle = i % 9 === 0 ? 'rgba(255, 0, 0,.82)' : 'rgba(231, 197, 199,.56)';
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
