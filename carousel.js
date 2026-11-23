  /* ============ JavaScript : le comportement ============ */
  const carousel = document.querySelector('.carousel');
  const track    = carousel.querySelector('.track');
  const slides   = carousel.querySelectorAll('.slide');
  const dotsBox  = carousel.querySelector('.dots');
  const DELAI    = 8000;          // temps entre deux diapos (ms)

  let index = 0;                  // diapo affichée
  let timer = null;

  // Crée un point par diapo
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.setAttribute('aria-label', 'Aller à la diapositive ' + (i + 1));
    dot.addEventListener('click', () => { goTo(i); restart(); });
    dotsBox.appendChild(dot);
  });
  const dots = dotsBox.querySelectorAll('.dot');

  // Affiche la diapo n°i (en boucle)
  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(' + (-100 * index) + '%)';
    dots.forEach((d, k) => d.setAttribute('aria-current', k === index));
  }

  // Défilement automatique
  function start()   { timer = setInterval(() => goTo(index + 1), DELAI); }
  function stop()    { clearInterval(timer); }
  function restart() { stop(); start(); }

  carousel.querySelector('.prev').addEventListener('click', () => { goTo(index - 1); restart(); });
  carousel.querySelector('.next').addEventListener('click', () => { goTo(index + 1); restart(); });

  // Pause quand la souris ou le clavier est sur le carrousel
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', start);

  // Flèches gauche/droite du clavier
  carousel.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });

  // Balayage tactile sur mobile
  let departX = null;
  carousel.addEventListener('touchstart', e => { departX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    if (departX === null) return;
    const delta = e.changedTouches[0].clientX - departX;
    if (Math.abs(delta) > 50) { goTo(index + (delta < 0 ? 1 : -1)); restart(); }
    departX = null;
  });

  // Démarrage (sans défilement auto si l'utilisateur préfère moins d'animations)
  goTo(0);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) start();