/* ============================================================
   KOMILAB.ORG — Main JavaScript
   ============================================================ */

'use strict';

/* ── COPY BUTTON ──────────────────────────────────────────── */
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const wrapper = btn.closest('.code-block-wrapper');
      const code = wrapper?.querySelector('code')?.innerText || '';
      try {
        await navigator.clipboard.writeText(code);
        btn.classList.add('copied');
        btn.innerHTML = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="2,8 6,12 14,4"/></svg> Copied!`;
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="9" height="11" rx="1"/><path d="M4 4V3a1 1 0 011-1h7a1 1 0 011 1v9a1 1 0 01-1 1h-1"/></svg> Copy`;
        }, 2200);
      } catch { btn.textContent = 'Failed'; }
    });
  });
}

/* ── MOBILE NAV ───────────────────────────────────────────── */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!hamburger || !mobileNav) return;
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (mobileNav.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}

/* ── SCROLL ANIMATIONS ────────────────────────────────────── */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-in:not(.visible)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  elements.forEach(el => observer.observe(el));
}

/* ── ACTIVE NAV ───────────────────────────────────────────── */
function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === path) link.classList.add('active');
  });
}

/* ── NAV SCROLL ───────────────────────────────────────────── */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.borderBottomColor = window.scrollY > 30 ? 'rgba(26,35,64,0.8)' : 'var(--bg-border)';
  }, { passive: true });
}

/* ── NEWS RSS ─────────────────────────────────────────────── */
const RSS_API = 'https://api.rss2json.com/v1/api.json';
const RSS_SOURCES = {
  cyber: [
    { name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews' },
    { name: 'Bleeping Computer', url: 'https://www.bleepingcomputer.com/feed/' },
    { name: 'CISA', url: 'https://www.cisa.gov/news.xml' },
  ],
  tech: [
    { name: 'LeMagIT', url: 'https://www.lemagit.fr/rss/AllArticles.rss' },
    { name: 'Korben', url: 'https://korben.info/feed' },
    { name: 'Linux Foundation', url: 'https://www.linuxfoundation.org/feed/' },
  ]
};

function timeAgo(dateStr) {
  const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `${Math.floor(diff/60)}min`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h`;
  if (diff < 604800) return `${Math.floor(diff/86400)}j`;
  return new Date(dateStr).toLocaleDateString('fr-FR', { day:'numeric', month:'short' });
}

function truncate(str, n=90) { return str && str.length > n ? str.slice(0,n)+'…' : str || ''; }

async function fetchFeed(source) {
  try {
    const res = await fetch(`${RSS_API}?rss_url=${encodeURIComponent(source.url)}&count=3`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error();
    return data.items.map(item => ({ title: item.title, link: item.link, date: item.pubDate, source: source.name }));
  } catch { return []; }
}

async function loadNewsFeeds() {
  const cyberCol = document.getElementById('news-cyber');
  const techCol  = document.getElementById('news-tech');
  if (!cyberCol && !techCol) return;

  const [cyberAll, techAll] = await Promise.all([
    Promise.all(RSS_SOURCES.cyber.map(fetchFeed)),
    Promise.all(RSS_SOURCES.tech.map(fetchFeed))
  ]);
  const cyberItems = cyberAll.flat().sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,6);
  const techItems  = techAll.flat().sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,6);

  function render(items, container) {
    if (!container) return;
    if (!items.length) {
      container.innerHTML = `<div style="padding:1.5rem;text-align:center;font-family:var(--font-mono);font-size:.72rem;color:var(--text-muted);">⚠ Flux indisponible</div>`;
      return;
    }
    container.innerHTML = items.map(item => `
      <a class="news-item" href="${item.link}" target="_blank" rel="noopener noreferrer">
        <span class="news-item-title">${truncate(item.title)}</span>
        <span class="news-item-meta">
          <span class="news-item-source">${item.source}</span>
          <span class="news-dot">●</span>
          <span>${timeAgo(item.date)}</span>
        </span>
      </a>`).join('');
  }

  render(cyberItems, cyberCol);
  render(techItems,  techCol);
}

/* ── LAB CARDS ────────────────────────────────────────────── */
async function loadFeaturedLabs() {
  const container = document.getElementById('featured-labs');
  if (!container) return;
  try {
    const res = await fetch('data/labs.json');
    const data = await res.json();
    const featured = data.labs.filter(l => l.featured).slice(0,4);
    container.innerHTML = featured.map((lab, i) => `
      <article class="lab-card animate-in" style="transition-delay:${i*0.08}s">
        <div class="lab-card-meta">
          <span class="lab-level level-${lab.level.toLowerCase()}">${lab.level}</span>
          <span class="lab-env">⬡ ${lab.environment}</span>
        </div>
        <h3 class="lab-card-title">${lab.title}</h3>
        <p class="lab-card-excerpt">${lab.excerpt}</p>
        <div class="lab-card-footer">
          <div class="lab-tags">${lab.tags.slice(0,3).map(t=>`<span class="lab-tag">${t}</span>`).join('')}</div>
          <span class="lab-duration">⏱ ${lab.duration}</span>
        </div>
        <a href="${lab.href}" class="lab-card-link">Accéder au lab
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="2" y1="8" x2="14" y2="8"/><polyline points="9,3 14,8 9,13"/>
          </svg>
        </a>
      </article>`).join('');
    initScrollAnimations();
  } catch {}
}

/* ── DOMAINS ──────────────────────────────────────────────── */
async function loadDomains() {
  const container = document.getElementById('domains-grid');
  if (!container) return;
  try {
    const res = await fetch('data/labs.json');
    const data = await res.json();
    const counts = {};
    data.labs.forEach(l => { counts[l.category] = (counts[l.category]||0)+1; });
    container.innerHTML = data.categories.map((cat, i) => `
      <a href="labs.html?cat=${cat.id}" class="domain-card animate-in" style="transition-delay:${i*0.07}s">
        <span class="domain-icon">${cat.icon}</span>
        <div class="domain-title">${cat.label}</div>
        <div class="domain-count">${counts[cat.id]||0} lab${(counts[cat.id]||0)>1?'s':''}</div>
      </a>`).join('');
    initScrollAnimations();
  } catch {}
}

/* ── COUNTER ──────────────────────────────────────────────── */
function initCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.counter);
      let start = null;
      function step(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1200, 1);
        el.textContent = Math.floor((1 - Math.pow(1-p,3)) * target);
        if (p < 1) requestAnimationFrame(step); else el.textContent = target;
      }
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  });
  document.querySelectorAll('[data-counter]').forEach(c => observer.observe(c));
}

/* ── INIT ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCopyButtons();
  initMobileNav();
  initScrollAnimations();
  initActiveNav();
  initNavScroll();
  initCounters();
  loadFeaturedLabs();
  loadDomains();
  loadNewsFeeds();
});
