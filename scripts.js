(() => {
  'use strict';

  const doc = document.documentElement;
  const body = document.body;
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.querySelector('#primary-navigation');
  const themeToggle = document.querySelector('.theme-toggle');
  const dialog = document.querySelector('#detail-dialog');
  const dialogContent = document.querySelector('#dialog-content');
  const dialogClose = document.querySelector('.dialog-close');

  const publicationData = Array.isArray(publications)
    ? publications.map((item, index) => ({ ...item, _index: index, _type: 'publication' }))
    : [];

  const conferenceData = Array.isArray(conferences)
    ? conferences.map((item, index) => ({ ...item, _index: index, _type: 'conference' }))
    : [];

  const allowedInlineTags = new Set(['I', 'EM', 'STRONG', 'B', 'U', 'SUB', 'SUP', 'BR']);

  function sanitizeHTML(value = '') {
    const template = document.createElement('template');
    template.innerHTML = String(value);

    const clean = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          clean(child);
          if (!allowedInlineTags.has(child.tagName)) {
            child.replaceWith(...child.childNodes);
            return;
          }
          [...child.attributes].forEach((attribute) => child.removeAttribute(attribute.name));
        } else if (child.nodeType !== Node.TEXT_NODE) {
          child.remove();
        }
      });
    };

    clean(template.content);
    return template.innerHTML;
  }

  function stripHTML(value = '') {
    const template = document.createElement('template');
    template.innerHTML = String(value);
    return template.content.textContent.trim().replace(/\s+/g, ' ');
  }

  function escapeHTML(value = '') {
    return String(value).replace(/[&<>'"]/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    }[char]));
  }

  function isSafeURL(value = '') {
    if (!value) return false;
    try {
      const url = new URL(value, window.location.href);
      return ['http:', 'https:', 'mailto:'].includes(url.protocol);
    } catch {
      return false;
    }
  }

  function truncate(value = '', maxLength = 180) {
    const text = stripHTML(value);
    return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
  }

  function debounce(callback, delay = 140) {
    let timer;
    return (...args) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => callback(...args), delay);
    };
  }

  function getCitationCount(item) {
    return Number.parseInt(item.citations, 10) || 0;
  }

  function getYears(items) {
    return [...new Set(items.map((item) => Number(item.year)).filter(Boolean))]
      .sort((a, b) => b - a);
  }

  function populateYearSelect(select, items) {
    if (!select) return;
    const years = getYears(items);
    years.forEach((year) => {
      const option = document.createElement('option');
      option.value = String(year);
      option.textContent = String(year);
      select.appendChild(option);
    });
  }

  function matchesSearch(item, query, type) {
    if (!query) return true;
    const haystack = [
      item.title,
      item.authors,
      type === 'publication' ? item.journal : item.conference,
      item.abstract,
      item.year,
    ].map(stripHTML).join(' ').toLowerCase();
    return haystack.includes(query.toLowerCase());
  }

  function sortPublications(items, sortMode) {
    const sorted = [...items];
    if (sortMode === 'citations') {
      return sorted.sort((a, b) => getCitationCount(b) - getCitationCount(a) || Number(b.year) - Number(a.year));
    }
    if (sortMode === 'title') {
      return sorted.sort((a, b) => stripHTML(a.title).localeCompare(stripHTML(b.title)));
    }
    return sorted.sort((a, b) => Number(b.year) - Number(a.year) || getCitationCount(b) - getCitationCount(a));
  }

  function externalButton(item, label = 'Open link') {
    if (!isSafeURL(item.url)) return '';
    return `<a class="card-button" href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)} ↗</a>`;
  }

  function emptyStateHTML() {
    const template = document.querySelector('#empty-state-template');
    return template ? template.innerHTML : '<div class="empty-state"><strong>No matches found.</strong></div>';
  }

  function createResultCard(item, type) {
    const isPublication = type === 'publication';
    const venue = isPublication ? item.journal : item.conference;
    const citationCount = getCitationCount(item);
    const citingCount = Array.isArray(item.citingPapers) ? item.citingPapers.length : 0;
    const preview = truncate(item.abstract, 260);

    return `
      <article class="result-card" data-year="${escapeHTML(item.year)}">
        <header>
          <div>
            <h3>
              <button class="title-button" type="button" data-detail-type="${type}" data-detail-index="${item._index}">
                ${sanitizeHTML(item.title)}
              </button>
            </h3>
          </div>
          <div class="card-meta" aria-label="${isPublication ? 'Publication' : 'Conference'} metrics">
            <span class="meta-pill">${escapeHTML(item.year || 'Year n/a')}</span>
            ${isPublication && citationCount > 0 ? `<span class="meta-pill">${citationCount} citation${citationCount === 1 ? '' : 's'}</span>` : ''}
          </div>
        </header>

        <div class="card-meta-block">
          <p class="meta-line"><strong>Authors:</strong> ${escapeHTML(truncate(item.authors, 210))}</p>
          <p class="meta-line"><strong>${isPublication ? 'Journal' : 'Meeting'}:</strong> ${sanitizeHTML(venue || 'Not listed')}</p>
        </div>

        ${preview ? `<p class="preview">${escapeHTML(preview)}</p>` : ''}

        <div class="card-actions">
          <button class="card-button primary-action" type="button" data-detail-type="${type}" data-detail-index="${item._index}">
            Read ${isPublication ? 'abstract' : 'details'}
          </button>
          ${externalButton(item, isPublication ? 'Publication' : 'Abstract')}
          ${citingCount ? `<button class="card-button" type="button" data-citing-type="${type}" data-citing-index="${item._index}">Citing papers (${citingCount})</button>` : ''}
        </div>
      </article>
    `;
  }

  function renderPublications() {
    const list = document.querySelector('#publications-list');
    const summary = document.querySelector('#publication-summary');
    const query = document.querySelector('#publication-search')?.value.trim() || '';
    const year = document.querySelector('#publication-year')?.value || 'all';
    const sortMode = document.querySelector('#publication-sort')?.value || 'newest';

    if (!list) return;

    const filtered = sortPublications(publicationData.filter((item) => {
      const yearMatch = year === 'all' || String(item.year) === year;
      return yearMatch && matchesSearch(item, query, 'publication');
    }), sortMode);

    list.innerHTML = filtered.length ? filtered.map((item) => createResultCard(item, 'publication')).join('') : emptyStateHTML();

    if (summary) {
      summary.textContent = `Showing ${filtered.length} of ${publicationData.length} publication${publicationData.length === 1 ? '' : 's'}`;
    }
  }

  function renderConferences() {
    const list = document.querySelector('#conferences-list');
    const summary = document.querySelector('#conference-summary');
    const query = document.querySelector('#conference-search')?.value.trim() || '';
    const year = document.querySelector('#conference-year')?.value || 'all';

    if (!list) return;

    const filtered = conferenceData
      .filter((item) => {
        const yearMatch = year === 'all' || String(item.year) === year;
        return yearMatch && matchesSearch(item, query, 'conference');
      })
      .sort((a, b) => Number(b.year) - Number(a.year) || stripHTML(a.title).localeCompare(stripHTML(b.title)));

    list.innerHTML = filtered.length ? filtered.map((item) => createResultCard(item, 'conference')).join('') : emptyStateHTML();

    if (summary) {
      summary.textContent = `Showing ${filtered.length} of ${conferenceData.length} conference output${conferenceData.length === 1 ? '' : 's'}`;
    }
  }

  function getItem(type, index) {
    const collection = type === 'publication' ? publicationData : conferenceData;
    return collection[Number(index)];
  }

  function showDialog(html) {
    dialogContent.innerHTML = html;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  function openDetail(item, type) {
    if (!item) return;
    const isPublication = type === 'publication';
    const venueLabel = isPublication ? 'Journal' : 'Meeting';
    const venue = isPublication ? item.journal : item.conference;
    const citationCount = getCitationCount(item);
    const citingCount = Array.isArray(item.citingPapers) ? item.citingPapers.length : 0;

    showDialog(`
      <p class="dialog-kicker">${isPublication ? 'Publication' : 'Conference output'} · ${escapeHTML(item.year || '')}</p>
      <h2 id="dialog-title" class="dialog-title">${sanitizeHTML(item.title)}</h2>
      <div class="dialog-meta">
        <div><strong>Authors:</strong> ${sanitizeHTML(item.authors || 'Not listed')}</div>
        <div><strong>${venueLabel}:</strong> ${sanitizeHTML(venue || 'Not listed')}</div>
        ${isPublication && citationCount > 0 ? `<div><strong>Citations:</strong> ${citationCount}</div>` : ''}
      </div>
      <div class="dialog-body">
        ${item.abstract ? sanitizeHTML(item.abstract) : '<p>No abstract text is currently listed for this item.</p>'}
      </div>
      <div class="dialog-actions">
        ${isSafeURL(item.url) ? `<a class="button button-primary" href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">Open ${isPublication ? 'publication' : 'abstract'} ↗</a>` : ''}
        ${citingCount ? `<button class="button button-secondary" type="button" data-dialog-citing-type="${type}" data-dialog-citing-index="${item._index}">View citing papers (${citingCount})</button>` : ''}
      </div>
    `);
  }

  function openCitingPapers(item, type) {
    if (!item || !Array.isArray(item.citingPapers) || item.citingPapers.length === 0) return;
    const sorted = [...item.citingPapers].sort((a, b) => Number(b.year) - Number(a.year));
    const list = sorted.map((paper) => `
      <li>
        <strong>${sanitizeHTML(paper.title || 'Untitled')}</strong>
        <p>${sanitizeHTML(paper.authors || 'Authors not listed')} ${paper.year ? `(${escapeHTML(paper.year)})` : ''}</p>
        <p>${sanitizeHTML(paper.journal || '')}</p>
        ${isSafeURL(paper.url) ? `<a class="card-button" href="${escapeHTML(paper.url)}" target="_blank" rel="noopener noreferrer">Open source ↗</a>` : ''}
      </li>
    `).join('');

    showDialog(`
      <p class="dialog-kicker">Citing papers · ${type === 'publication' ? 'Publication' : 'Conference output'}</p>
      <h2 id="dialog-title" class="dialog-title">${sanitizeHTML(item.title)}</h2>
      <ul class="citing-list">${list}</ul>
    `);
  }

  function renderStats() {
    const totalCitations = publicationData.reduce((sum, item) => sum + getCitationCount(item), 0);
    const years = getYears([...publicationData, ...conferenceData]);

    const values = {
      '#stat-publications': publicationData.length,
      '#stat-conferences': conferenceData.length,
      '#stat-citations': totalCitations,
      '#stat-years': years.length,
    };

    Object.entries(values).forEach(([selector, value]) => {
      const element = document.querySelector(selector);
      if (element) element.textContent = new Intl.NumberFormat().format(value);
    });
  }

  function renderCitationBars() {
    const container = document.querySelector('#citation-bars');
    const impactTotal = document.querySelector('#impact-total');
    if (!container) return;

    const totalCitations = publicationData.reduce((sum, item) => sum + getCitationCount(item), 0);
    const topItems = [...publicationData]
      .filter((item) => getCitationCount(item) > 0)
      .sort((a, b) => getCitationCount(b) - getCitationCount(a))
      .slice(0, 6);

    const maxCitations = Math.max(...topItems.map(getCitationCount), 1);

    if (impactTotal) {
      impactTotal.textContent = `${new Intl.NumberFormat().format(totalCitations)} citations`;
    }

    container.innerHTML = topItems.length ? topItems.map((item) => {
      const citations = getCitationCount(item);
      const width = Math.max((citations / maxCitations) * 100, 8).toFixed(2);
      return `
        <div class="bar-row">
          <div class="bar-label">
            <strong title="${escapeHTML(stripHTML(item.title))}">${escapeHTML(truncate(item.title, 78))}</strong>
            <span>${escapeHTML(item.year)} · ${escapeHTML(stripHTML(item.journal || ''))}</span>
          </div>
          <span class="bar-value">${citations}</span>
          <div class="bar-track" aria-hidden="true"><span class="bar-fill" style="--bar-width: ${width}%"></span></div>
        </div>
      `;
    }).join('') : emptyStateHTML();
  }

  function updateScrollProgress() {
    const scrollable = body.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    doc.style.setProperty('--scroll-progress', `${Math.min(progress, 100).toFixed(2)}%`);
    if (header) header.dataset.elevated = String(window.scrollY > 12);
  }

  function initNavigation() {
    if (navToggle && primaryNav) {
      navToggle.addEventListener('click', () => {
        const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!isOpen));
        primaryNav.classList.toggle('is-open', !isOpen);
      });

      primaryNav.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
          navToggle.setAttribute('aria-expanded', 'false');
          primaryNav.classList.remove('is-open');
        }
      });
    }

    const navLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (!active) return;
          navLinks.forEach((link) => link.classList.toggle('active', link === active));
        });
      }, { rootMargin: '-35% 0px -55% 0px', threshold: 0.01 });

      sections.forEach((section) => observer.observe(section));
    }
  }

  function initTheme() {
    const safeGetTheme = () => {
      try {
        return window.localStorage.getItem('portfolio-theme');
      } catch {
        return null;
      }
    };

    const safeSetTheme = (theme) => {
      try {
        window.localStorage.setItem('portfolio-theme', theme);
      } catch {
        // Storage can be unavailable in privacy-restricted contexts; the UI still toggles for the session.
      }
    };

    const systemPrefersLight = (() => {
      try {
        return window.matchMedia('(prefers-color-scheme: light)').matches;
      } catch {
        return false;
      }
    })();

    const initialTheme = safeGetTheme() || doc.dataset.theme || (systemPrefersLight ? 'light' : 'dark');

    const applyTheme = (theme) => {
      doc.dataset.theme = theme;
      themeToggle?.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
      const icon = themeToggle?.querySelector('span[aria-hidden="true"]');
      if (icon) icon.textContent = theme === 'dark' ? '☼' : '☾';
    };

    applyTheme(initialTheme);

    themeToggle?.addEventListener('click', () => {
      const nextTheme = doc.dataset.theme === 'dark' ? 'light' : 'dark';
      safeSetTheme(nextTheme);
      applyTheme(nextTheme);
    });
  }

  function initRevealAnimation() {
    const revealItems = [...document.querySelectorAll('.reveal')];
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

    revealItems.forEach((item) => observer.observe(item));
  }

  function initEvents() {
    const debouncedPubRender = debounce(renderPublications);
    const debouncedConfRender = debounce(renderConferences);

    document.querySelector('#publication-search')?.addEventListener('input', debouncedPubRender);
    document.querySelector('#publication-year')?.addEventListener('change', renderPublications);
    document.querySelector('#publication-sort')?.addEventListener('change', renderPublications);
    document.querySelector('#conference-search')?.addEventListener('input', debouncedConfRender);
    document.querySelector('#conference-year')?.addEventListener('change', renderConferences);

    document.addEventListener('click', (event) => {
      const detailButton = event.target.closest('[data-detail-type]');
      if (detailButton) {
        const item = getItem(detailButton.dataset.detailType, detailButton.dataset.detailIndex);
        openDetail(item, detailButton.dataset.detailType);
        return;
      }

      const citingButton = event.target.closest('[data-citing-type]');
      if (citingButton) {
        const item = getItem(citingButton.dataset.citingType, citingButton.dataset.citingIndex);
        openCitingPapers(item, citingButton.dataset.citingType);
        return;
      }

      const dialogCitingButton = event.target.closest('[data-dialog-citing-type]');
      if (dialogCitingButton) {
        const item = getItem(dialogCitingButton.dataset.dialogCitingType, dialogCitingButton.dataset.dialogCitingIndex);
        openCitingPapers(item, dialogCitingButton.dataset.dialogCitingType);
      }
    });

    dialogClose?.addEventListener('click', () => {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    });

    dialog?.addEventListener('click', (event) => {
      const rect = dialog.getBoundingClientRect();
      const clickedBackdrop = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
      if (clickedBackdrop) dialog.close();
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        updateScrollProgress();
        ticking = false;
      });
      ticking = true;
    }, { passive: true });

    window.addEventListener('resize', updateScrollProgress, { passive: true });
  }

  function init() {
    populateYearSelect(document.querySelector('#publication-year'), publicationData);
    populateYearSelect(document.querySelector('#conference-year'), conferenceData);
    renderStats();
    renderPublications();
    renderConferences();
    renderCitationBars();
    initTheme();
    initNavigation();
    initRevealAnimation();
    initEvents();
    updateScrollProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
