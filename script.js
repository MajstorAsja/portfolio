import { DotLottie } from 'https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm';

const trigger = document.querySelector('#asja-cat-trigger');
let entranceIndex = 0;
const desktopEntrances = ['bottom', 'left', 'top'];
const mobileEntrances = ['bottom', 'top'];
const activeCats = new Set();

trigger.addEventListener('click', event => {
  event.preventDefault();

  const entrances = window.matchMedia('(max-width: 700px)').matches
    ? mobileEntrances
    : desktopEntrances;

  // Keep one active cat per entrance. Extra clicks wait until one finishes.
  if (activeCats.size >= entrances.length) return;

  const entrance = entrances[entranceIndex % entrances.length];
  entranceIndex += 1;

  const cat = document.createElement('div');
  cat.className = `cat-peek cat-peek--${entrance}`;
  cat.setAttribute('aria-hidden', 'true');

  if (entrance === 'left') {
    const titleBottom = document.querySelector('.hero__title').getBoundingClientRect().bottom;
    cat.style.setProperty('--cat-title-bottom', `${Math.round(titleBottom + 8)}px`);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 360;
  canvas.height = 640;
  cat.append(canvas);
  document.body.append(cat);
  activeCats.add(cat);

  const catAnimation = new DotLottie({
    autoplay: true,
    loop: false,
    speed: 1.35,
    canvas,
    src: './Orange%20Cat%20Peeping.lottie',
  });

  // Commit the hidden edge position before the fast pop-in transition.
  void cat.offsetWidth;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      cat.classList.add('is-visible');
    });
  });

  let removed = false;
  const removeCat = () => {
    if (removed) return;
    removed = true;
    activeCats.delete(cat);
    catAnimation.destroy();
    cat.remove();
  };

  cat.addEventListener('transitionend', transitionEvent => {
    if (transitionEvent.propertyName === 'transform' && !cat.classList.contains('is-visible')) {
      removeCat();
    }
  });

  window.setTimeout(() => {
    cat.classList.add('is-returning');
    void cat.offsetWidth;
    requestAnimationFrame(() => {
      cat.classList.remove('is-visible');
    });
  }, 2500);

  // Fallback cleanup in case a browser suppresses transition events.
  window.setTimeout(removeCat, 3300);
});
