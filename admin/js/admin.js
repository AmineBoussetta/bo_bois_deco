/* ============================================
   Bo Bois Deco — Admin Dashboard
   ============================================ */

const API = 'api.php';
let portfolioData = { items: [] };

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  loadPortfolio();
  loadSettings();
  loadAbout();
  initPortfolioEvents();
  initSettingsForm();
  initAboutForm();
  initModal();
  initSidebar();
});

// ─── Sidebar toggle (mobile) ───
function initSidebar() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('sidebar--open');
  });

  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('sidebar--open') &&
        !sidebar.contains(e.target) && !toggle.contains(e.target)) {
      sidebar.classList.remove('sidebar--open');
    }
  });
}

// ─── Section navigation ───
function initNavigation() {
  document.querySelectorAll('.sidebar__link[data-section]').forEach(link => {
    link.addEventListener('click', () => {
      const target = link.dataset.section;

      document.querySelectorAll('.sidebar__link[data-section]').forEach(l =>
        l.classList.remove('sidebar__link--active'));
      link.classList.add('sidebar__link--active');

      document.querySelectorAll('.panel').forEach(p => p.classList.add('panel--hidden'));
      const section = document.getElementById('section-' + target);
      if (section) section.classList.remove('panel--hidden');

      const sidebar = document.getElementById('sidebar');
      if (sidebar.classList.contains('sidebar--open')) {
        sidebar.classList.remove('sidebar--open');
      }
    });
  });
}

// ─── API helpers ───
async function apiGet(action) {
  const res = await fetch(`${API}?action=${action}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiPost(action, data) {
  const res = await fetch(`${API}?action=${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json;
}

async function apiUpload(file) {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`${API}?action=upload_image`, { method: 'POST', body: form });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json;
}

function showStatus(id, message, isError = false) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.classList.toggle('save-status--error', isError);
  el.classList.add('save-status--visible');
  setTimeout(() => el.classList.remove('save-status--visible'), 3000);
}

// ═══════════════════════════════════════════
// PORTFOLIO
// ═══════════════════════════════════════════

async function loadPortfolio() {
  try {
    portfolioData = await apiGet('get_portfolio');
    renderPortfolioList();
  } catch (e) {
    console.error('Erreur chargement portfolio:', e);
  }
}

function renderPortfolioList() {
  const list = document.getElementById('portfolioList');
  if (!list) return;

  const categoryLabels = {
    residentiel: 'Résidentiel',
    professionnel: 'Professionnel',
    exterieur: 'Extérieur'
  };

  list.innerHTML = portfolioData.items.map((item, i) => `
    <div class="portfolio-item" draggable="true" data-index="${i}">
      <div class="portfolio-item__drag" title="Glisser pour réordonner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/>
          <circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/>
          <circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>
        </svg>
      </div>
      <div class="portfolio-item__thumb">
        ${item.image ? `<img src="${item.image}" alt="${escHtml(item.alt || '')}">` : ''}
      </div>
      <div class="portfolio-item__info">
        <div class="portfolio-item__title">${escHtml(item.title)}</div>
        <div class="portfolio-item__meta">
          <span class="portfolio-item__badge">${categoryLabels[item.category] || item.category}</span>
          ${item.featured ? '<span class="portfolio-item__badge portfolio-item__badge--featured">Mis en avant</span>' : ''}
        </div>
      </div>
      <div class="portfolio-item__actions">
        <button class="btn btn--outline btn--small" onclick="editProject(${i})">Modifier</button>
        <button class="btn btn--danger btn--small" onclick="deleteProject(${i})">Supprimer</button>
      </div>
    </div>
  `).join('');

  initDragAndDrop();
}

function initPortfolioEvents() {
  document.getElementById('addProject')?.addEventListener('click', () => openModal(-1));

  document.getElementById('savePortfolio')?.addEventListener('click', async () => {
    try {
      await apiPost('save_portfolio', portfolioData);
      showStatus('portfolioStatus', 'Enregistré avec succès !');
    } catch (e) {
      showStatus('portfolioStatus', 'Erreur: ' + e.message, true);
    }
  });
}

function editProject(index) {
  openModal(index);
}

function deleteProject(index) {
  const item = portfolioData.items[index];
  if (!confirm(`Supprimer « ${item.title} » ?`)) return;
  portfolioData.items.splice(index, 1);
  renderPortfolioList();
}

// ─── Drag & Drop ───
function initDragAndDrop() {
  const list = document.getElementById('portfolioList');
  if (!list) return;
  let dragIndex = null;

  list.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('dragstart', (e) => {
      dragIndex = parseInt(item.dataset.index);
      item.classList.add('portfolio-item--dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('portfolio-item--dragging');
      list.querySelectorAll('.portfolio-item').forEach(el =>
        el.classList.remove('portfolio-item--dragover'));
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      item.classList.add('portfolio-item--dragover');
    });

    item.addEventListener('dragleave', () => {
      item.classList.remove('portfolio-item--dragover');
    });

    item.addEventListener('drop', (e) => {
      e.preventDefault();
      const dropIndex = parseInt(item.dataset.index);
      if (dragIndex === null || dragIndex === dropIndex) return;

      const moved = portfolioData.items.splice(dragIndex, 1)[0];
      portfolioData.items.splice(dropIndex, 0, moved);
      renderPortfolioList();
    });
  });
}

// ─── Modal ───
function initModal() {
  const modal = document.getElementById('projectModal');
  const form = document.getElementById('projectForm');

  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('modalCancel')?.addEventListener('click', closeModal);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.getElementById('projImageFile')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const result = await apiUpload(file);
      document.getElementById('projImageUrl').value = result.url;
      updatePreview('projImagePreview', result.url);
    } catch (err) {
      alert('Erreur upload: ' + err.message);
    }
  });

  document.getElementById('projImageUrl')?.addEventListener('input', (e) => {
    updatePreview('projImagePreview', e.target.value);
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const index = parseInt(document.getElementById('projectIndex').value);
    const item = {
      title: document.getElementById('projTitle').value.trim(),
      category: document.getElementById('projCategory').value,
      image: document.getElementById('projImageUrl').value.trim(),
      alt: document.getElementById('projAlt').value.trim(),
      featured: document.getElementById('projFeatured').checked,
    };

    if (!item.title) { alert('Le titre est requis.'); return; }

    if (index === -1) {
      portfolioData.items.push(item);
    } else {
      portfolioData.items[index] = item;
    }

    renderPortfolioList();
    closeModal();
  });
}

function openModal(index) {
  const modal = document.getElementById('projectModal');
  document.getElementById('projectIndex').value = index;
  document.getElementById('modalTitle').textContent =
    index === -1 ? 'Ajouter un projet' : 'Modifier le projet';

  if (index >= 0) {
    const item = portfolioData.items[index];
    document.getElementById('projTitle').value = item.title || '';
    document.getElementById('projCategory').value = item.category || 'residentiel';
    document.getElementById('projImageUrl').value = item.image || '';
    document.getElementById('projAlt').value = item.alt || '';
    document.getElementById('projFeatured').checked = !!item.featured;
    updatePreview('projImagePreview', item.image);
  } else {
    document.getElementById('projTitle').value = '';
    document.getElementById('projCategory').value = 'residentiel';
    document.getElementById('projImageUrl').value = '';
    document.getElementById('projAlt').value = '';
    document.getElementById('projFeatured').checked = false;
    updatePreview('projImagePreview', '');
  }

  modal.classList.add('modal-overlay--open');
}

function closeModal() {
  document.getElementById('projectModal').classList.remove('modal-overlay--open');
}

// ═══════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════

async function loadSettings() {
  try {
    const data = await apiGet('get_settings');
    document.getElementById('setTagline').value = data.tagline || '';
    document.getElementById('setSubtitle').value = data.subtitle || '';
    document.getElementById('setEmail').value = data.contact?.email || '';
    document.getElementById('setPhone').value = data.contact?.phone || '';
    document.getElementById('setAddress').value = data.contact?.address || '';
    document.getElementById('setInstagram').value = data.social?.instagram || '';
    document.getElementById('setFacebook').value = data.social?.facebook || '';
  } catch (e) {
    console.error('Erreur chargement paramètres:', e);
  }
}

function initSettingsForm() {
  document.getElementById('settingsForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await apiPost('save_settings', {
        tagline: document.getElementById('setTagline').value.trim(),
        subtitle: document.getElementById('setSubtitle').value.trim(),
        contact: {
          email: document.getElementById('setEmail').value.trim(),
          phone: document.getElementById('setPhone').value.trim(),
          address: document.getElementById('setAddress').value.trim(),
        },
        social: {
          instagram: document.getElementById('setInstagram').value.trim(),
          facebook: document.getElementById('setFacebook').value.trim(),
        },
      });
      showStatus('settingsStatus', 'Paramètres enregistrés !');
    } catch (err) {
      showStatus('settingsStatus', 'Erreur: ' + err.message, true);
    }
  });
}

// ═══════════════════════════════════════════
// ABOUT
// ═══════════════════════════════════════════

async function loadAbout() {
  try {
    const data = await apiGet('get_about');
    document.getElementById('aboutDesc').value = data.description || '';
    document.getElementById('aboutDesc2').value = data.description2 || '';
    document.getElementById('aboutVisionTitle').value = data.vision_title || '';
    document.getElementById('aboutVisionText').value = data.vision_text || '';
    document.getElementById('aboutObjTitle').value = data.objectif_title || '';
    document.getElementById('aboutObjText').value = data.objectif_text || '';
    document.getElementById('aboutAppTitle').value = data.approche_title || '';
    document.getElementById('aboutAppText').value = data.approche_text || '';
    document.getElementById('aboutImage').value = data.image || '';
    updatePreview('aboutImagePreview', data.image);
  } catch (e) {
    console.error('Erreur chargement à propos:', e);
  }
}

function initAboutForm() {
  document.getElementById('aboutImageFile')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const result = await apiUpload(file);
      document.getElementById('aboutImage').value = result.url;
      updatePreview('aboutImagePreview', result.url);
    } catch (err) {
      alert('Erreur upload: ' + err.message);
    }
  });

  document.getElementById('aboutForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await apiPost('save_about', {
        description: document.getElementById('aboutDesc').value.trim(),
        description2: document.getElementById('aboutDesc2').value.trim(),
        vision_title: document.getElementById('aboutVisionTitle').value.trim(),
        vision_text: document.getElementById('aboutVisionText').value.trim(),
        objectif_title: document.getElementById('aboutObjTitle').value.trim(),
        objectif_text: document.getElementById('aboutObjText').value.trim(),
        approche_title: document.getElementById('aboutAppTitle').value.trim(),
        approche_text: document.getElementById('aboutAppText').value.trim(),
        image: document.getElementById('aboutImage').value.trim(),
      });
      showStatus('aboutStatus', 'Page À propos enregistrée !');
    } catch (err) {
      showStatus('aboutStatus', 'Erreur: ' + err.message, true);
    }
  });
}

// ─── Utils ───
function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function updatePreview(containerId, url) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = url ? `<img src="${escHtml(url)}" alt="Aperçu">` : '';
}
