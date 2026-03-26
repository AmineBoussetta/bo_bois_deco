/* ============================================
   Bo Bois Deco — CMS Content Loader
   Loads content from JSON data files edited
   via Decap CMS and injects into the page.
   Falls back to static HTML if fetch fails.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  loadAboutContent();
  loadPortfolioContent();
  loadSettings();
});

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const data = {};
  match[1].split('\n').forEach(line => {
    const sep = line.indexOf(':');
    if (sep === -1) return;
    const key = line.slice(0, sep).trim();
    let val = line.slice(sep + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (val === 'true') val = true;
    else if (val === 'false') val = false;
    else if (!isNaN(val) && val !== '') val = Number(val);
    data[key] = val;
  });
  return data;
}

async function loadAboutContent() {
  try {
    const res = await fetch('/content/about.json');
    if (!res.ok) return;
    const data = await res.json();

    const texts = document.querySelectorAll('.about__text');
    if (texts[0] && data.description) texts[0].textContent = data.description;
    if (texts[1] && data.description2) texts[1].textContent = data.description2;

    const values = document.querySelectorAll('.about__value');
    if (values[0]) {
      values[0].querySelector('.about__value-title').textContent = data.vision_title;
      values[0].querySelector('p').textContent = data.vision_text;
    }
    if (values[1]) {
      values[1].querySelector('.about__value-title').textContent = data.objectif_title;
      values[1].querySelector('p').textContent = data.objectif_text;
    }
    if (values[2]) {
      values[2].querySelector('.about__value-title').textContent = data.approche_title;
      values[2].querySelector('p').textContent = data.approche_text;
    }

    if (data.image) {
      const img = document.querySelector('.about__image img');
      if (img) img.src = data.image;
    }
  } catch (e) {
    // Keep static HTML content as fallback
  }
}

async function loadPortfolioContent() {
  const PORTFOLIO_FILES = [
    'cuisine-sur-mesure',
    'suite-parentale',
    'restaurant-le-jardin',
    'salon-bibliotheque',
    'terrasse-pergola',
    'espace-bureau'
  ];

  try {
    const items = [];

    const promises = PORTFOLIO_FILES.map(async (slug) => {
      try {
        const res = await fetch(`/content/portfolio/${slug}.md`);
        if (!res.ok) return null;
        const text = await res.text();
        const data = parseFrontmatter(text);
        if (data) data.slug = slug;
        return data;
      } catch {
        return null;
      }
    });

    const results = await Promise.all(promises);
    results.forEach(item => { if (item) items.push(item); });

    if (items.length === 0) return;

    items.sort((a, b) => (a.order || 0) - (b.order || 0));

    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;

    grid.innerHTML = '';

    items.forEach(item => {
      const div = document.createElement('div');
      div.className = `portfolio__item${item.featured ? ' portfolio__item--tall' : ''}`;
      div.dataset.category = item.category;

      const categoryLabels = {
        residentiel: 'Résidentiel',
        professionnel: 'Professionnel',
        exterieur: 'Extérieur'
      };

      div.innerHTML = `
        <img src="${item.image}" alt="${item.alt || item.title}" loading="lazy">
        <div class="portfolio__item-overlay">
          <span class="portfolio__item-category">${categoryLabels[item.category] || item.category}</span>
          <h3 class="portfolio__item-title">${item.title}</h3>
        </div>
      `;

      grid.appendChild(div);
    });

    // Re-initialize portfolio filtering and lightbox on the new items
    if (typeof window.initPortfolio === 'function') {
      window.initPortfolio();
    }
  } catch (e) {
    // Keep static HTML content as fallback
  }
}

async function loadSettings() {
  try {
    const res = await fetch('/content/settings.json');
    if (!res.ok) return;
    const data = await res.json();

    if (data.tagline) {
      const heroTitle = document.querySelector('.hero__title');
      if (heroTitle) heroTitle.innerHTML = data.tagline.replace(/\n/g, '<br>');
    }

    if (data.subtitle) {
      const heroSub = document.querySelector('.hero__subtitle');
      if (heroSub) heroSub.textContent = data.subtitle;
    }

    if (data.social) {
      const instaLink = document.querySelector('.footer__social-link[aria-label="Instagram"]');
      const fbLink = document.querySelector('.footer__social-link[aria-label="Facebook"]');
      if (instaLink && data.social.instagram) instaLink.href = data.social.instagram;
      if (fbLink && data.social.facebook) fbLink.href = data.social.facebook;
    }
  } catch (e) {
    // Keep static HTML content as fallback
  }
}
