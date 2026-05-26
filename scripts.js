(() => {
  'use strict';

  const doc = document.documentElement;
  const siteHeader = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.querySelector('#primary-navigation');
  const themeToggle = document.querySelector('.theme-toggle');
  const dialog = document.querySelector('#detail-dialog');
  const dialogContent = document.querySelector('#dialog-content');
  const dialogClose = document.querySelector('.dialog-close');
  const toggleConferencesButton = document.querySelector('#toggle-conferences');
  const togglePublicationsButton = document.querySelector('#toggle-publications');

  const rawPublications = (() => {
    try {
      if (Array.isArray(window.publications)) return window.publications;
      if (typeof publications !== 'undefined' && Array.isArray(publications)) return publications;
    } catch (_) {
      return [];
    }
    return [];
  })();

  const rawConferences = (() => {
    try {
      if (Array.isArray(window.conferences)) return window.conferences;
      if (typeof conferences !== 'undefined' && Array.isArray(conferences)) return conferences;
    } catch (_) {
      return [];
    }
    return [];
  })();

  const publicationData = rawPublications.map((item, index) => ({ ...item, _index: index, _type: 'publication' }));
  const conferenceEntries = rawConferences.map((item, index) => ({ ...item, _index: index, _type: 'conference-entry' }));
  const conferenceData = groupConferences(conferenceEntries);
  let showAllConferences = false;
  let showAllPublications = false;

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


  function normalizeTitle(value = '') {
    return stripHTML(value)
      .toLowerCase()
      .replace(/[^a-z0-9\s]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function groupConferences(items) {
    const groups = new Map();
    items.forEach((item) => {
      const key = normalizeTitle(item.title || `conference-${item._index}`) || `conference-${item._index}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });

    return [...groups.values()].map((entries, index) => {
      const sorted = [...entries].sort((a, b) => Number(b.year) - Number(a.year) || a._index - b._index);
      const latest = sorted[0] || entries[0];
      const years = [...new Set(entries.map((entry) => Number(entry.year)).filter(Boolean))].sort((a, b) => b - a);
      return {
        ...latest,
        _index: index,
        _type: 'conference',
        _items: sorted,
        presentationCount: entries.length,
        years,
      };
    }).sort((a, b) => Number(b.year) - Number(a.year) || a._index - b._index);
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
    } catch (_) {
      return false;
    }
  }

  function truncate(value = '', maxLength = 150) {
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
    return Number.parseInt(item?.citations, 10) || 0;
  }

  function getYears(items) {
    return [...new Set(items.map((item) => Number(item.year)).filter(Boolean))]
      .sort((a, b) => b - a);
  }

  function populateYearSelect(select, items) {
    if (!select) return;
    getYears(items).forEach((year) => {
      const option = document.createElement('option');
      option.value = String(year);
      option.textContent = String(year);
      select.appendChild(option);
    });
  }

  function getSearchText(item, type) {
    const fieldsFor = (entry) => [
      entry.title,
      entry.authors,
      type === 'publication' ? entry.journal : entry.conference,
      entry.abstract,
      entry.year,
    ];

    const fields = type === 'conference' && Array.isArray(item._items)
      ? item._items.flatMap(fieldsFor)
      : fieldsFor(item);

    return fields.map(stripHTML).join(' ').toLowerCase();
  }

  function matchesSearch(item, query, type) {
    if (!query) return true;
    return getSearchText(item, type).includes(query.toLowerCase());
  }

  function sortPublications(items, sortMode) {
    const sorted = [...items];
    if (sortMode === 'citations') {
      return sorted.sort((a, b) => getCitationCount(b) - getCitationCount(a) || Number(b.year) - Number(a.year) || a._index - b._index);
    }
    if (sortMode === 'title') {
      return sorted.sort((a, b) => stripHTML(a.title).localeCompare(stripHTML(b.title)));
    }
    if (sortMode === 'newest') {
      return sorted.sort((a, b) => Number(b.year) - Number(a.year) || a._index - b._index);
    }

    return sorted.sort((a, b) => {
      const priorityA = getPriorityScore(a);
      const priorityB = getPriorityScore(b);
      return priorityB - priorityA || Number(b.year) - Number(a.year) || a._index - b._index;
    });
  }

  function getPriorityScore(item) {
    const text = getSearchText(item, 'publication');
    let score = 0;
    if (text.includes('exo70') || text.includes('tsc2')) score += 50;
    if (text.includes('crisper') || text.includes('crispr')) score += 20;
    if (text.includes('nature communications')) score += 20;
    if (text.includes('kasp') || text.includes('faasa') || text.includes('marker')) score += 10;
    score += Math.min(getCitationCount(item), 20);
    return score;
  }

  function inferTags(item, type) {
    const text = getSearchText(item, type);
    const rules = [
      [/\b(tsc2|exo70|tan spot|ptr toxb)\b/i, 'Tsc2 / tan spot'],
      [/\bcrispr|gene editing|knockout\b/i, 'CRISPR validation'],
      [/\bqtl|gwas|genome-wide association\b/i, 'QTL / GWAS'],
      [/\bkasp|faasa|pace|marker\b/i, 'Markers'],
      [/\bnematode|pratylenchus|heterodera|scn\b/i, 'Nematodes'],
      [/\bgbs|genotyping-by-sequencing|snp\b/i, 'GBS / SNPs'],
      [/\bai|artificial intelligence|image|yolo|computer vision\b/i, 'AI phenotyping'],
      [/\bwheat|triticale|soybean|dry bean|field pea\b/i, 'Crop genetics'],
    ];

    const tags = [];
    rules.forEach(([pattern, label]) => {
      if (pattern.test(text) && !tags.includes(label)) tags.push(label);
    });
    return tags.slice(0, 3);
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
    const isConferenceGroup = type === 'conference' && item.presentationCount > 1;
    const venue = isPublication ? item.journal : item.conference;
    const citationCount = getCitationCount(item);
    const tags = inferTags(item, type);
    const year = item.year || 'Year n/a';
    const title = sanitizeHTML(item.title || 'Untitled');
    const venueText = venue ? sanitizeHTML(venue) : 'Not listed';
    const authors = truncate(item.authors || 'Authors not listed', 178);
    const venueLabel = isPublication ? 'Journal' : (isConferenceGroup ? 'Latest meeting' : 'Meeting');

    return `
      <article class="result-card" data-year="${escapeHTML(year)}">
        <div class="result-card-top">
          <span class="meta-pill accent">${escapeHTML(year)}</span>
          ${isPublication && citationCount > 0 ? `<span class="meta-pill">${citationCount} citation${citationCount === 1 ? '' : 's'}</span>` : ''}
          ${isConferenceGroup ? `<span class="meta-pill">${item.presentationCount} presentations</span>` : ''}
        </div>

        <h3>
          <button class="title-button" type="button" data-detail-type="${type}" data-detail-index="${item._index}">
            ${title}
          </button>
        </h3>

        <p class="card-meta-line"><strong>${venueLabel}:</strong> ${venueText}</p>
        <p class="card-meta-line"><strong>Authors:</strong> ${escapeHTML(authors)}</p>

        ${tags.length ? `<div class="tag-row">${tags.map((tag) => `<span class="tag-pill">${escapeHTML(tag)}</span>`).join('')}</div>` : ''}

        <div class="card-actions">
          <button class="card-button primary-action" type="button" data-detail-type="${type}" data-detail-index="${item._index}">${isPublication ? 'Abstract' : 'Details'}</button>
          ${externalButton(item, isPublication ? 'Publication' : 'Abstract')}
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

    if (!publicationData.length) {
      list.innerHTML = '<div class="empty-state"><strong>Publication data did not load.</strong><p>Check that <code>data.js</code> is committed beside <code>index.html</code>.</p></div>';
      if (summary) summary.textContent = '0 publications loaded';
      return;
    }

    const filtered = sortPublications(publicationData.filter((item) => {
      const yearMatch = year === 'all' || String(item.year) === year;
      return yearMatch && matchesSearch(item, query, 'publication');
    }), sortMode);

    const shouldLimit = !showAllPublications && !query && year === 'all';
    const visible = shouldLimit ? filtered.slice(0, 6) : filtered;

    list.innerHTML = visible.length ? visible.map((item) => createResultCard(item, 'publication')).join('') : emptyStateHTML();

    if (summary) {
      summary.textContent = `${visible.length} of ${filtered.length} shown`;
    }

    if (togglePublicationsButton) {
      const canToggle = !query && year === 'all' && filtered.length > 6;
      togglePublicationsButton.hidden = !canToggle;
      togglePublicationsButton.textContent = showAllPublications ? 'Show fewer publications' : `Show all ${filtered.length} publications`;
    }
  }

  function renderConferences() {
    const list = document.querySelector('#conferences-list');
    const summary = document.querySelector('#conference-summary');
    const query = document.querySelector('#conference-search')?.value.trim() || '';
    const year = document.querySelector('#conference-year')?.value || 'all';

    if (!list) return;

    if (!conferenceData.length) {
      list.innerHTML = '<div class="empty-state"><strong>Conference data did not load.</strong><p>Check that <code>data.js</code> is committed beside <code>index.html</code>.</p></div>';
      if (summary) summary.textContent = '0 talks loaded';
      return;
    }

    const filtered = conferenceData
      .filter((item) => {
        const yearMatch = year === 'all' || (Array.isArray(item._items) && item._items.some((entry) => String(entry.year) === year));
        return yearMatch && matchesSearch(item, query, 'conference');
      })
      .sort((a, b) => Number(b.year) - Number(a.year) || a._index - b._index);

    const shouldLimit = !showAllConferences && !query && year === 'all';
    const visible = shouldLimit ? filtered.slice(0, 6) : filtered;

    list.innerHTML = visible.length ? visible.map((item) => createResultCard(item, 'conference')).join('') : emptyStateHTML();

    if (summary) {
      const shown = visible.length;
      summary.textContent = `${shown} of ${filtered.length} topics shown`;
    }

    if (toggleConferencesButton) {
      const canToggle = !query && year === 'all' && filtered.length > 6;
      toggleConferencesButton.hidden = !canToggle;
      toggleConferencesButton.textContent = showAllConferences ? 'Show fewer topics' : `Show all ${filtered.length} topics`;
    }
  }

  function renderStats() {
    const citationTotal = publicationData.reduce((sum, item) => sum + getCitationCount(item), 0);
    const stats = {
      '#stat-publications': publicationData.length,
      '#stat-conferences': conferenceEntries.length,
      '#stat-citations': citationTotal,
    };

    Object.entries(stats).forEach(([selector, value]) => {
      const element = document.querySelector(selector);
      if (element) element.textContent = String(value);
    });
  }

  function getItem(type, index) {
    const collection = type === 'publication' ? publicationData : conferenceData;
    return collection[Number(index)];
  }

  function showDialog(html) {
    if (!dialog || !dialogContent) return;
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
    const isConferenceGroup = type === 'conference' && Array.isArray(item._items) && item._items.length > 1;
    const venueLabel = isPublication ? 'Journal' : (isConferenceGroup ? 'Latest meeting' : 'Meeting');
    const venue = isPublication ? item.journal : item.conference;
    const citationCount = getCitationCount(item);
    const presentationList = isConferenceGroup
      ? `<div class="presentation-list"><strong>Presented at:</strong><ul>${item._items.map((entry) => `<li><span>${escapeHTML(entry.year || '')}</span>${sanitizeHTML(entry.conference || 'Not listed')}</li>`).join('')}</ul></div>`
      : '';

    showDialog(`
      <p class="dialog-kicker">${isPublication ? 'Publication' : 'Conference output'} · ${escapeHTML(item.year || '')}</p>
      <h2 id="dialog-title" class="dialog-title">${sanitizeHTML(item.title || 'Untitled')}</h2>
      <div class="dialog-meta">
        <div><strong>Authors:</strong> ${sanitizeHTML(item.authors || 'Not listed')}</div>
        <div><strong>${venueLabel}:</strong> ${sanitizeHTML(venue || 'Not listed')}</div>
        ${isConferenceGroup ? `<div><strong>Presentations:</strong> ${item._items.length}</div>` : ''}
        ${isPublication && citationCount > 0 ? `<div><strong>Citations:</strong> ${citationCount}</div>` : ''}
      </div>
      <div class="dialog-body">
        ${item.abstract ? `<p>${sanitizeHTML(item.abstract)}</p>` : '<p>No abstract text is currently listed for this item.</p>'}
        ${presentationList}
      </div>
      <div class="dialog-actions">
        ${isSafeURL(item.url) ? `<a class="button button-primary" href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">Open ${isPublication ? 'publication' : 'abstract'} ↗</a>` : ''}
      </div>
    `);
  }

  function initTheme() {
    const safeGetTheme = () => {
      try { return window.localStorage.getItem('portfolio-theme'); } catch (_) { return null; }
    };

    const safeSetTheme = (theme) => {
      try { window.localStorage.setItem('portfolio-theme', theme); } catch (_) {}
    };

    const applyTheme = (theme) => {
      doc.dataset.theme = theme;
      themeToggle?.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
      const icon = themeToggle?.querySelector('span[aria-hidden="true"]');
      if (icon) icon.textContent = theme === 'dark' ? '☼' : '☾';
    };

    applyTheme(safeGetTheme() || doc.dataset.theme || 'dark');

    themeToggle?.addEventListener('click', () => {
      const nextTheme = doc.dataset.theme === 'dark' ? 'light' : 'dark';
      safeSetTheme(nextTheme);
      applyTheme(nextTheme);
    });
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
    const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (!active) return;
          navLinks.forEach((link) => link.classList.toggle('active', link === active));
        });
      }, { rootMargin: '-42% 0px -50% 0px', threshold: 0.01 });

      sections.forEach((section) => observer.observe(section));
    }
  }

  function initEvents() {
    const debouncedPubRender = debounce(renderPublications);
    const debouncedConfRender = debounce(renderConferences);

    document.querySelector('#publication-search')?.addEventListener('input', debouncedPubRender);
    document.querySelector('#publication-year')?.addEventListener('change', () => {
      showAllPublications = false;
      renderPublications();
    });
    document.querySelector('#publication-sort')?.addEventListener('change', () => {
      showAllPublications = false;
      renderPublications();
    });
    document.querySelector('#conference-search')?.addEventListener('input', debouncedConfRender);
    document.querySelector('#conference-year')?.addEventListener('change', () => {
      showAllConferences = false;
      renderConferences();
    });

    togglePublicationsButton?.addEventListener('click', () => {
      showAllPublications = !showAllPublications;
      renderPublications();
    });

    toggleConferencesButton?.addEventListener('click', () => {
      showAllConferences = !showAllConferences;
      renderConferences();
    });

    document.addEventListener('click', (event) => {
      const detailButton = event.target.closest('[data-detail-type]');
      if (detailButton) {
        const item = getItem(detailButton.dataset.detailType, detailButton.dataset.detailIndex);
        openDetail(item, detailButton.dataset.detailType);
      }
    });

    dialogClose?.addEventListener('click', () => {
      if (typeof dialog?.close === 'function') dialog.close();
      else dialog?.removeAttribute('open');
    });

    dialog?.addEventListener('click', (event) => {
      const rect = dialog.getBoundingClientRect();
      const clickedBackdrop = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
      if (clickedBackdrop && typeof dialog.close === 'function') dialog.close();
    });

    window.addEventListener('scroll', () => {
      if (!siteHeader) return;
      siteHeader.dataset.elevated = String(window.scrollY > 10);
    }, { passive: true });
  }

  function init() {
    populateYearSelect(document.querySelector('#publication-year'), publicationData);
    populateYearSelect(document.querySelector('#conference-year'), conferenceEntries);
    renderStats();
    renderPublications();
    renderConferences();
    initTheme();
    initNavigation();
    initEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
