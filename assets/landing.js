// 展示层随滚动渐显；静态外层保持原布局和锚点位置。
(function () {
  'use strict';
  const page = document.getElementById('proof');
  const reveal = document.getElementById('productReveal');
  if (!page || !reveal) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = null;
  let lastProgress = null;

  function update() {
    frame = null;
    if (reducedMotion.matches) {
      reveal.style.removeProperty('--product-opacity');
      reveal.style.removeProperty('--product-offset');
      lastProgress = null;
      return;
    }
    const height = window.innerHeight;
    const top = page.getBoundingClientRect().top;
    const progress = Math.max(0, Math.min(1, (height * 0.85 - top) / (height * 0.4)));
    if (progress === lastProgress) return;
    lastProgress = progress;
    reveal.style.setProperty('--product-opacity', String(progress));
    reveal.style.setProperty('--product-offset', (20 * (1 - progress)) + 'px');
  }

  function schedule() {
    if (frame === null) frame = window.requestAnimationFrame(update);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  reducedMotion.addEventListener('change', schedule);
  update();
})();
