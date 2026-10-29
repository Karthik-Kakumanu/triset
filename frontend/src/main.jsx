import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import parse, { attributesToProps, domToReact } from 'html-react-parser';

function revealPage() {
  document.documentElement.classList.remove('page-loading');
}

const pageFiles = import.meta.glob('../../*.html', {
  query: '?raw',
  import: 'default',
});

const routeFiles = new Map(
  Object.keys(pageFiles)
    .map((filePath) => {
      const fileName = filePath.split('/').pop().replace(/\.html$/, '');
      if (fileName === 'industries' || fileName === 'work') return null;
      const route = fileName === 'index'
        ? '/'
        : fileName === 'solutions'
          ? '/industries'
          : `/${fileName}`;
      return [route, filePath];
    })
    .filter(Boolean),
);
routeFiles.set('/work', '../../projects.html');

function cleanPageHref(href) {
  if (!href || href.startsWith('#')) return href;

  const url = new URL(href, `${window.location.origin}/`);
  if (
    url.origin !== window.location.origin
    && !['www.trisetsolutions.com', 'trisetsolutions.com'].includes(url.hostname)
  ) return href;
  const match = url.pathname.match(/^\/?([^/]+)\.html$/i);
  if (!match) return href;

  const pageName = match[1].toLowerCase();
  if (pageName === 'solutions') {
    url.pathname = '/industries';
  } else {
    url.pathname = pageName === 'index' ? '/' : `/${pageName}`;
  }
  return `${url.pathname}${url.search}${url.hash}`;
}

function PageView() {
  const [page, setPage] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let active = true;
    const pagePath = routeFiles.get(window.location.pathname.replace(/\/$/, '') || '/');
    const sourcePath = pageFiles[pagePath || '../../404.html'];

    if (!sourcePath) {
      setMissing(true);
      revealPage();
      return undefined;
    }

    sourcePath().then((source) => {
      if (active) {
        setPage(source);
        setMissing(!pagePath);
      }
    }).catch((error) => {
      console.error('Unable to load page content.', error);
      revealPage();
      if (active) setMissing(true);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!page) return undefined;

    document.documentElement.classList.add('page-loading');

    const source = new DOMParser().parseFromString(page, 'text/html');
    const previousBodyClass = document.body.className;
    document.body.className = source.body.className;
    document.title = source.title;

    const headElements = [];
    source.head.querySelectorAll('meta[name], meta[property]').forEach((meta) => {
      const selector = meta.name
        ? `meta[name="${CSS.escape(meta.name)}"]`
        : `meta[property="${CSS.escape(meta.getAttribute('property'))}"]`;
      let existing = document.head.querySelector(selector);
      if (!existing) {
        existing = document.createElement('meta');
        if (meta.name) existing.name = meta.name;
        if (meta.getAttribute('property')) existing.setAttribute('property', meta.getAttribute('property'));
        document.head.appendChild(existing);
        headElements.push(existing);
      }
      existing.content = meta.content;
    });

    source.head.querySelectorAll('link[rel="canonical"], link[rel="icon"], link[rel="preload"], link[rel="stylesheet"]').forEach((link) => {
      const href = new URL(link.getAttribute('href'), `${window.location.origin}/`).href;
      if (document.head.querySelector(`link[rel="${CSS.escape(link.rel)}"][href="${CSS.escape(href)}"]`)) return;
      const addedLink = document.createElement('link');
      addedLink.rel = link.rel;
      addedLink.href = link.rel === 'canonical'
        ? `${window.location.origin}${cleanPageHref(window.location.pathname)}`
        : href;
      if (link.as) addedLink.as = link.as;
      if (link.type) addedLink.type = link.type;
      document.head.appendChild(addedLink);
      headElements.push(addedLink);
    });

    source.head.querySelectorAll('style').forEach((style) => {
      const addedStyle = document.createElement('style');
      addedStyle.textContent = style.textContent;
      document.head.appendChild(addedStyle);
      headElements.push(addedStyle);
    });

    source.body.querySelectorAll('a[href]').forEach((link) => {
      link.setAttribute('href', cleanPageHref(link.getAttribute('href')));
    });

    const sourceScripts = Array.from(source.querySelectorAll('script'));
    sourceScripts
      .filter((script) => script.type === 'application/ld+json')
      .forEach((script) => {
        const structuredData = document.createElement('script');
        structuredData.type = script.type;
        structuredData.textContent = script.textContent;
        document.head.appendChild(structuredData);
        headElements.push(structuredData);
      });
    const scripts = sourceScripts
      .filter((script) => !['src/theme-init.js', '/src/theme-init.js'].includes(script.getAttribute('src')))
      .filter((script) => !script.type || ['text/javascript', 'application/javascript', 'module'].includes(script.type));

    let cancelled = false;
    const runScripts = async () => {
      for (const script of scripts) {
        if (cancelled) return;
        const addedScript = document.createElement('script');
        if (script.type) addedScript.type = script.type;
        const scriptSource = script.getAttribute('src');
        if (scriptSource) {
          addedScript.src = new URL(scriptSource, `${window.location.origin}/`).href;
          addedScript.async = false;
          await new Promise((resolve, reject) => {
            addedScript.onload = resolve;
            addedScript.onerror = () => reject(new Error(`Unable to load script: ${addedScript.src}`));
            document.body.appendChild(addedScript);
          });
        } else {
          addedScript.textContent = script.textContent;
          document.body.appendChild(addedScript);
        }
        headElements.push(addedScript);
      }
    };

    runScripts()
      .catch((error) => console.error('Unable to initialize page scripts.', error))
      .finally(() => {
        if (!cancelled) {
          revealPage();
        }
      });

    const bodyObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            if (node.matches('a[href]')) node.setAttribute('href', cleanPageHref(node.getAttribute('href')));
            node.querySelectorAll('a[href]').forEach((link) => {
              link.setAttribute('href', cleanPageHref(link.getAttribute('href')));
            });
          }
        });
      });
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      bodyObserver.disconnect();
      document.body.className = previousBodyClass;
      headElements.forEach((element) => element.remove());
    };
  }, [page]);

  if (!page) return null;

  const source = new DOMParser().parseFromString(page, 'text/html');
  source.body.querySelectorAll('script, style').forEach((element) => element.remove());
  const options = {
    replace(node) {
      if (node.type !== 'tag') return undefined;
      const needsPageLink = node.name === 'a' && node.attribs?.href;
      const inlineSubmit = node.attribs?.onsubmit;
      const inlineClick = node.attribs?.onclick;
      if (!needsPageLink && !inlineSubmit && !inlineClick) return undefined;

      const props = attributesToProps(node.attribs);
      delete props.onsubmit;
      delete props.onSubmit;
      delete props.onclick;
      delete props.onClick;
      if (needsPageLink) props.href = cleanPageHref(node.attribs.href);
      if (inlineSubmit?.includes("this.querySelector('button').textContent")) {
        props.onSubmit = (event) => {
          event.preventDefault();
          const form = event.currentTarget;
          form.querySelector('button').textContent = '✓';
          form.querySelector('input').disabled = true;
        };
      }
      if (inlineClick?.trim() === 'copyEmail()') {
        props.onClick = (event) => {
          event.preventDefault();
          window.copyEmail();
        };
      }
      return React.createElement(
        node.name,
        props,
        domToReact(node.children, options),
      );
    },
  };

  return (
    <div className={missing ? 'page-not-found' : 'react-page'}>
      {parse(source.body.innerHTML, options)}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<PageView />);
