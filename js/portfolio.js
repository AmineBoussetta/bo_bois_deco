/* ============================================
   Bo Bois Deco — Portfolio Gallery
   Filtering + Lightbox
   ============================================ */

function initPortfolio() {
  const filterButtons = document.querySelectorAll('.portfolio__filter');
  const items = document.querySelectorAll('.portfolio__item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox.querySelector('.lightbox__prev');
  const nextBtn = lightbox.querySelector('.lightbox__next');

  let currentIndex = 0;
  let visibleItems = [];

  const getVisibleItems = () => {
    return Array.from(items).filter(item => !item.classList.contains('portfolio__item--hidden'));
  };

  // --- Filtering ---
  filterButtons.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', () => {
      const filter = newBtn.dataset.filter;

      document.querySelectorAll('.portfolio__filter').forEach(b => b.classList.remove('portfolio__filter--active'));
      newBtn.classList.add('portfolio__filter--active');

      items.forEach(item => {
        const category = item.dataset.category;
        const shouldShow = filter === 'all' || category === filter;

        if (!shouldShow) {
          item.classList.add('portfolio__item--hiding');
          setTimeout(() => {
            item.classList.add('portfolio__item--hidden');
            item.classList.remove('portfolio__item--hiding');
          }, 350);
        } else {
          item.classList.remove('portfolio__item--hidden');
          item.classList.remove('portfolio__item--hiding');
          requestAnimationFrame(() => {
            item.classList.add('portfolio__item--showing');
            setTimeout(() => item.classList.remove('portfolio__item--showing'), 400);
          });
        }
      });
    });
  });

  // --- Lightbox ---
  const openLightbox = (index) => {
    visibleItems = getVisibleItems();
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('lightbox--open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('lightbox--open');
    document.body.style.overflow = '';
  };

  const updateLightboxImage = () => {
    const item = visibleItems[currentIndex];
    if (!item) return;
    const img = item.querySelector('img');
    const title = item.querySelector('.portfolio__item-title');
    lightboxImg.src = img.src.replace('w=600', 'w=1200');
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = title ? title.textContent : '';
  };

  const navigate = (direction) => {
    currentIndex = (currentIndex + direction + visibleItems.length) % visibleItems.length;
    updateLightboxImage();
  };

  items.forEach(item => {
    item.addEventListener('click', () => {
      const visibles = getVisibleItems();
      const visibleIndex = visibles.indexOf(item);
      openLightbox(visibleIndex >= 0 ? visibleIndex : 0);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => navigate(-1));
  nextBtn.addEventListener('click', () => navigate(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox__content')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('lightbox--open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}

window.initPortfolio = initPortfolio;
document.addEventListener('DOMContentLoaded', initPortfolio);
