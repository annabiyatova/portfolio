const gallery = document.querySelector('.natgeo-gallery');
const track = gallery.querySelector('.gallery-track');
const dots = [...gallery.querySelectorAll('[data-slide]')];
const previous = gallery.querySelector('.gallery-prev');
const next = gallery.querySelector('.gallery-next');
const status = gallery.querySelector('.gallery-status');
let active = 0;
let scrollTimer;
let trackWidth = track.clientWidth;

function select(index) {
  active = index;
  dots.forEach((dot, position) => {
    if (position === index) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });
  status.textContent = `Кадр ${index + 1} из ${dots.length}`;
}

function goTo(index) {
  const position = (index + dots.length) % dots.length;
  select(position);
  track.scrollTo({left: position * track.clientWidth});
}

previous.addEventListener('click', () => goTo(active - 1));
next.addEventListener('click', () => goTo(active + 1));
dots.forEach(dot => dot.addEventListener('click', () => goTo(Number(dot.dataset.slide))));

gallery.addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  goTo(active + (event.key === 'ArrowLeft' ? -1 : 1));
});

track.addEventListener('scroll', () => {
  window.clearTimeout(scrollTimer);
  scrollTimer = window.setTimeout(() => {
    const index = Math.round(track.scrollLeft / track.clientWidth);
    if (index !== active) select(index);
  }, 100);
}, {passive: true});

new ResizeObserver(() => {
  if (trackWidth === track.clientWidth) return;
  trackWidth = track.clientWidth;
  track.scrollTo({left: active * trackWidth, behavior: 'instant'});
}).observe(track);

select(0);
gallery.querySelectorAll('[hidden]').forEach(control => { control.hidden = false; });
