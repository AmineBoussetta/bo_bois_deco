<?php
require_once __DIR__ . '/auth.php';
requireLogin();

if (isset($_GET['logout'])) {
    logout();
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bo Bois Deco — Administration</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/admin.css">
</head>
<body class="admin-page">

  <!-- Sidebar -->
  <aside class="sidebar" id="sidebar">
    <div class="sidebar__header">
      <h1 class="sidebar__logo">Bo Bois Deco</h1>
      <span class="sidebar__badge">Admin</span>
    </div>

    <nav class="sidebar__nav">
      <button class="sidebar__link sidebar__link--active" data-section="portfolio">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        <span>Réalisations</span>
      </button>
      <button class="sidebar__link" data-section="settings">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
        <span>Paramètres</span>
      </button>
      <button class="sidebar__link" data-section="about">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span>À propos</span>
      </button>
    </nav>

    <div class="sidebar__footer">
      <a href="/" class="sidebar__link sidebar__link--muted" target="_blank">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        <span>Voir le site</span>
      </a>
      <a href="?logout=1" class="sidebar__link sidebar__link--muted">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        <span>Déconnexion</span>
      </a>
    </div>
  </aside>

  <!-- Mobile header -->
  <header class="topbar" id="topbar">
    <button class="topbar__toggle" id="sidebarToggle">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
    <span class="topbar__title">Bo Bois Deco</span>
  </header>

  <!-- Main content -->
  <main class="main" id="main">

    <!-- ═══════ PORTFOLIO SECTION ═══════ -->
    <section class="panel" id="section-portfolio">
      <div class="panel__header">
        <div>
          <h2 class="panel__title">Réalisations</h2>
          <p class="panel__subtitle">Glissez les éléments pour changer l'ordre d'affichage sur le site.</p>
        </div>
        <div class="panel__actions">
          <button class="btn btn--primary" id="addProject">+ Ajouter un projet</button>
        </div>
      </div>

      <div class="portfolio-list" id="portfolioList">
        <!-- Filled by JS -->
      </div>

      <div class="panel__footer">
        <button class="btn btn--primary" id="savePortfolio">Enregistrer les réalisations</button>
        <span class="save-status" id="portfolioStatus"></span>
      </div>
    </section>

    <!-- ═══════ SETTINGS SECTION ═══════ -->
    <section class="panel panel--hidden" id="section-settings">
      <div class="panel__header">
        <div>
          <h2 class="panel__title">Paramètres du site</h2>
          <p class="panel__subtitle">Informations affichées sur le site public.</p>
        </div>
      </div>

      <form class="admin-form" id="settingsForm">
        <div class="admin-form__group">
          <label class="form-label">Slogan principal</label>
          <input type="text" class="form-input" name="tagline" id="setTagline">
        </div>
        <div class="admin-form__group">
          <label class="form-label">Sous-titre</label>
          <input type="text" class="form-input" name="subtitle" id="setSubtitle">
        </div>

        <h3 class="admin-form__section-title">Coordonnées</h3>
        <div class="admin-form__row">
          <div class="admin-form__group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" name="email" id="setEmail">
          </div>
          <div class="admin-form__group">
            <label class="form-label">Téléphone</label>
            <input type="text" class="form-input" name="phone" id="setPhone">
          </div>
        </div>
        <div class="admin-form__group">
          <label class="form-label">Adresse</label>
          <input type="text" class="form-input" name="address" id="setAddress">
        </div>

        <h3 class="admin-form__section-title">Réseaux sociaux</h3>
        <div class="admin-form__row">
          <div class="admin-form__group">
            <label class="form-label">URL Instagram</label>
            <input type="url" class="form-input" name="instagram" id="setInstagram" placeholder="https://instagram.com/...">
          </div>
          <div class="admin-form__group">
            <label class="form-label">URL Facebook</label>
            <input type="url" class="form-input" name="facebook" id="setFacebook" placeholder="https://facebook.com/...">
          </div>
        </div>

        <div class="panel__footer">
          <button type="submit" class="btn btn--primary">Enregistrer les paramètres</button>
          <span class="save-status" id="settingsStatus"></span>
        </div>
      </form>
    </section>

    <!-- ═══════ ABOUT SECTION ═══════ -->
    <section class="panel panel--hidden" id="section-about">
      <div class="panel__header">
        <div>
          <h2 class="panel__title">Page À propos</h2>
          <p class="panel__subtitle">Textes et photo de la section « Qui sommes-nous ».</p>
        </div>
      </div>

      <form class="admin-form" id="aboutForm">
        <div class="admin-form__group">
          <label class="form-label">Description principale</label>
          <textarea class="form-input form-textarea" name="description" id="aboutDesc" rows="4"></textarea>
        </div>
        <div class="admin-form__group">
          <label class="form-label">Description (suite)</label>
          <textarea class="form-input form-textarea" name="description2" id="aboutDesc2" rows="3"></textarea>
        </div>

        <h3 class="admin-form__section-title">Valeurs</h3>
        <div class="admin-form__row">
          <div class="admin-form__group">
            <label class="form-label">Titre Vision</label>
            <input type="text" class="form-input" name="vision_title" id="aboutVisionTitle">
          </div>
          <div class="admin-form__group">
            <label class="form-label">Texte Vision</label>
            <textarea class="form-input form-textarea" name="vision_text" id="aboutVisionText" rows="3"></textarea>
          </div>
        </div>
        <div class="admin-form__row">
          <div class="admin-form__group">
            <label class="form-label">Titre Objectif</label>
            <input type="text" class="form-input" name="objectif_title" id="aboutObjTitle">
          </div>
          <div class="admin-form__group">
            <label class="form-label">Texte Objectif</label>
            <textarea class="form-input form-textarea" name="objectif_text" id="aboutObjText" rows="3"></textarea>
          </div>
        </div>
        <div class="admin-form__row">
          <div class="admin-form__group">
            <label class="form-label">Titre Approche</label>
            <input type="text" class="form-input" name="approche_title" id="aboutAppTitle">
          </div>
          <div class="admin-form__group">
            <label class="form-label">Texte Approche</label>
            <textarea class="form-input form-textarea" name="approche_text" id="aboutAppText" rows="3"></textarea>
          </div>
        </div>

        <h3 class="admin-form__section-title">Photo</h3>
        <div class="admin-form__group">
          <label class="form-label">Image actuelle</label>
          <div class="image-preview" id="aboutImagePreview"></div>
          <div class="image-upload">
            <input type="file" id="aboutImageFile" accept="image/*" class="image-upload__input">
            <label for="aboutImageFile" class="btn btn--outline">Choisir une image</label>
            <input type="hidden" name="image" id="aboutImage">
          </div>
        </div>

        <div class="panel__footer">
          <button type="submit" class="btn btn--primary">Enregistrer la page À propos</button>
          <span class="save-status" id="aboutStatus"></span>
        </div>
      </form>
    </section>

  </main>

  <!-- Project edit modal -->
  <div class="modal-overlay" id="projectModal">
    <div class="modal">
      <div class="modal__header">
        <h3 class="modal__title" id="modalTitle">Ajouter un projet</h3>
        <button class="modal__close" id="modalClose">&times;</button>
      </div>
      <form class="admin-form" id="projectForm">
        <input type="hidden" id="projectIndex" value="-1">
        <div class="admin-form__group">
          <label class="form-label">Titre du projet</label>
          <input type="text" class="form-input" id="projTitle" required placeholder="Ex: Cuisine Sur Mesure">
        </div>
        <div class="admin-form__group">
          <label class="form-label">Catégorie</label>
          <select class="form-input form-select" id="projCategory">
            <option value="residentiel">Résidentiel</option>
            <option value="professionnel">Professionnel</option>
            <option value="exterieur">Extérieur</option>
          </select>
        </div>
        <div class="admin-form__group">
          <label class="form-label">Photo du projet</label>
          <div class="image-preview" id="projImagePreview"></div>
          <div class="image-upload">
            <input type="file" id="projImageFile" accept="image/*" class="image-upload__input">
            <label for="projImageFile" class="btn btn--outline">Choisir une photo</label>
            <span class="image-upload__or">ou</span>
            <input type="text" class="form-input" id="projImageUrl" placeholder="URL de l'image">
          </div>
        </div>
        <div class="admin-form__group">
          <label class="form-label">Description de l'image (alt)</label>
          <input type="text" class="form-input" id="projAlt" placeholder="Décrivez l'image pour l'accessibilité">
        </div>
        <div class="admin-form__group">
          <label class="form-label">
            <input type="checkbox" id="projFeatured"> Projet mis en avant (affiché plus grand)
          </label>
        </div>
        <div class="modal__footer">
          <button type="button" class="btn btn--outline" id="modalCancel">Annuler</button>
          <button type="submit" class="btn btn--primary">Valider</button>
        </div>
      </form>
    </div>
  </div>

  <script src="js/admin.js"></script>
</body>
</html>
