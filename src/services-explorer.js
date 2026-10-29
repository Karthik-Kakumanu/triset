(function(){
  function formatCaps(caps){
    return (caps||[]).slice(0,5).map(c=>`<li>${c}</li>`).join('');
  }

  function preloadImage(src){
    if(!src) return; const img = new Image(); img.src = src; return img;
  }

  function initExplorer(){
    const root = document.getElementById('services-explorer');
    if(!root) return;
    const listEl = root.querySelector('.explorer-list');
    const catButtons = Array.from(root.querySelectorAll('.cat-btn'));
    const titleEl = root.querySelector('.service-title');
    const catEl = root.querySelector('.service-cat');
    const tagEl = root.querySelector('.service-tagline');
    const capsEl = root.querySelector('.service-caps');
    const ctaEl = root.querySelector('.service-cta');
    const heroImg = document.getElementById('services-hero-image');
    const canvas = document.getElementById('services-3d');

    let services = (window.siteData && window.siteData.services) ? window.siteData.services.slice() : [];

    // ensure canonical IDs: map service ids in siteData to explorer ids (fallback)
    services = services.map(s => ({ ...s, id: s.id || s.name.toLowerCase().replace(/[^a-z0-9]+/g,'-') }));

    // preferred category order
    const orderedCats = ['Digital Solutions', 'Geo-Spatial Solutions', 'Digital Marketing', 'Data & Processing'];

    const categoryMap = {};
    orderedCats.forEach(c=>categoryMap[c]=[]);
    // populate categories based on exact match or heuristics
    services.forEach(s => {
      const cat = s.category || '';
      if(orderedCats.includes(cat)) categoryMap[cat].push(s);
      else if(/marketing|seo|digital marketing/i.test(s.name) || s.id==='digital-marketing') categoryMap['Digital Marketing'].push(s);
      else if(/data|entry|processing|data-entry/i.test(s.name) || s.id==='data-entry') categoryMap['Data & Processing'].push(s);
      else if(/gis|lidar|photogrammetry|bim|drone|orthophoto|dem|cartography|3d/i.test(s.name) || /Geo/i.test(cat)) categoryMap['Geo-Spatial Solutions'].push(s);
      else categoryMap['Digital Solutions'].push(s);
    });

    // ensure ordering: Digital primary, Geo secondary
    function renderListForCategory(catName){
      const items = categoryMap[catName] || [];
      listEl.innerHTML = items.map((svc, idx)=>`
        <button role="listitem" class="explorer-item" data-id="${svc.id}" tabindex="0" aria-controls="service-meta">
          <div class="index">${String(idx+1).padStart(2,'0')}</div>
          <div class="meta"><strong>${svc.name}</strong><small>${svc.shortDescription || ''}</small></div>
        </button>
      `).join('');

      // attach events and keyboard navigation
      const itemsEls = Array.from(listEl.querySelectorAll('.explorer-item'));
      itemsEls.forEach((btn,i)=>{
        btn.addEventListener('click', ()=>selectService(btn.dataset.id));
        btn.addEventListener('keydown', (e)=>{
          if(e.key==='Enter' || e.key===' '){ e.preventDefault(); selectService(btn.dataset.id); }
          if(e.key==='ArrowDown'){ e.preventDefault(); const next = itemsEls[i+1] || itemsEls[0]; next && next.focus(); }
          if(e.key==='ArrowUp'){ e.preventDefault(); const prev = itemsEls[i-1] || itemsEls[itemsEls.length-1]; prev && prev.focus(); }
        });
      });

      if(itemsEls[0]) itemsEls[0].click();
    }

    function selectService(id){
      const svc = services.find(s=>s.id===id) || {};
      titleEl.textContent = svc.name || '';
      catEl.textContent = svc.category || '';
      tagEl.textContent = svc.shortDescription || svc.description || '';
      capsEl.innerHTML = formatCaps(svc.capabilities || svc.subservices || []);
      ctaEl.textContent = svc.cta || 'Contact TRISET';
      ctaEl.href = 'contact.html';

      // preload and crossfade hero image
      if(svc.image){
        const p = preloadImage(svc.image);
        p.onload = ()=>{ heroImg.style.transition = 'opacity .45s ease'; heroImg.style.opacity = '0'; setTimeout(()=>{ heroImg.src = svc.image; heroImg.style.opacity = '1'; }, 180); };
      }

      Array.from(listEl.querySelectorAll('.explorer-item')).forEach(b=>b.classList.toggle('active', b.dataset.id===id));

      // show 3D visual; if not ready, run a simple canvas fallback pulse
      if(window.__TRISET_3D && typeof window.__TRISET_3D.show === 'function'){
        window.__TRISET_3D.show(id);
      } else {
        runCanvasFallback(canvas, id);
      }
    }

    // category buttons wiring
    catButtons.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        catButtons.forEach(b=>b.classList.toggle('active', b===btn));
        catButtons.forEach(b=>b.setAttribute('aria-selected', String(b===btn)));
        renderListForCategory(btn.dataset.cat);
      });
    });

    // initialize default category
    const activeCat = catButtons.find(b=>b.classList.contains('active'))?.dataset.cat || orderedCats[0];
    renderListForCategory(activeCat);

    // lazy-load three.js and let the existing 3D module take over if available
    function loadThreeThenInit(){
      if(window.__TRISET_3D) return;
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/three@0.152.2/build/three.min.js';
      script.onload = ()=>{
        // if our page-level 3D init already exists (from services.html script), it will initialize via IntersectionObserver; otherwise, do nothing
      };
      script.onerror = ()=>console.warn('Three.js failed to load');
      document.head.appendChild(script);
    }

    // fallback simple canvas animation while 3D loads
    function runCanvasFallback(canvasEl, id){
      if(!canvasEl) return;
      const ctx = canvasEl.getContext('2d');
      let w = canvasEl.clientWidth; let h = canvasEl.clientHeight; canvasEl.width = w; canvasEl.height = h;
      let t=0; function resize(){ w=canvasEl.clientWidth; h=canvasEl.clientHeight; canvasEl.width=w; canvasEl.height=h; }
      window.addEventListener('resize', resize);
      function draw(){ ctx.clearRect(0,0,w,h); ctx.globalCompositeOperation='lighter';
        // soft radial brand glow
        const grd = ctx.createRadialGradient(w*0.65, h*0.35, 20, w*0.65, h*0.35, Math.max(w,h));
        grd.addColorStop(0, 'rgba(11,102,255,0.10)'); grd.addColorStop(0.6, 'rgba(217,43,43,0.04)'); grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd; ctx.fillRect(0,0,w,h);
        // animated grid lines
        ctx.strokeStyle = 'rgba(197,214,231,0.12)'; ctx.lineWidth=1;
        for(let y=0;y<h;y+=28){ ctx.beginPath(); ctx.moveTo(0,(y+Math.sin(t*0.02+y*0.01)*6)); ctx.lineTo(w,(y+Math.sin(t*0.02+y*0.01)*6)); ctx.stroke(); }
        t+=1; if(!window.__TRISET_3D) requestAnimationFrame(draw);
      }
      draw();
    }

    // start lazy loading of 3D when explorer becomes visible
    if('IntersectionObserver' in window){
      const obs = new IntersectionObserver((entries)=>{ entries.forEach(en=>{ if(en.isIntersecting){ loadThreeThenInit(); obs.disconnect(); } }); }, { rootMargin: '600px' });
      obs.observe(root);
    } else loadThreeThenInit();
  }

  if(document.readyState === 'complete' || document.readyState === 'interactive') setTimeout(initExplorer,30);
  else document.addEventListener('DOMContentLoaded', initExplorer);
})();
