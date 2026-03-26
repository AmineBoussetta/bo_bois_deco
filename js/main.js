/* ============================================
   Bo Bois Deco — Main JS
   Navigation, smooth scroll, mobile menu
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');

  // --- Sticky Nav on Scroll ---
  const handleNavScroll = () => {
    if (window.scrollY > 80) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // --- Mobile Menu Toggle ---
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('nav__menu--open');
    navToggle.classList.toggle('nav__toggle--active');
    navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  const closeMenu = () => {
    navMenu.classList.remove('nav__menu--open');
    navToggle.classList.remove('nav__toggle--active');
    document.body.style.overflow = '';
  };

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.querySelector('.nav__cta')?.addEventListener('click', closeMenu);

  // --- Active Nav Link on Scroll ---
  const activateLink = () => {
    const scrollY = window.scrollY + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('nav__link--active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('nav__link--active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', activateLink, { passive: true });

  // --- Close mobile menu on Escape ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });
});
