// Video background at top that fades to black on scroll
(() => {
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saver = navigator.connection && navigator.connection.saveData;

  const video = document.createElement('video');
  video.id = 'bg-video';
  video.poster = 'bg-poster.jpg';
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.preload = reduce || saver ? 'none' : 'auto';
  video.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;pointer-events:none;';
  if (!reduce && !saver) { video.src = 'bg.mp4'; video.autoplay = true; }
  document.body.prepend(video);

  // black fade layer that increases on scroll
  const fade = document.createElement('div');
  fade.id = 'bg-fade';
  fade.style.cssText = 'position:fixed;inset:0;z-index:1;pointer-events:none;background:#000;opacity:0;transition:opacity .1s linear;';
  document.body.prepend(fade);

  // vignette for text readability over video
  const vignette = document.createElement('div');
  vignette.style.cssText = 'position:fixed;inset:0;z-index:1;pointer-events:none;background:radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%);';
  document.body.prepend(vignette);

  function update() {
    const h = window.innerHeight || 1;
    const y = window.scrollY || 0;
    // fade from 0 to 1 over first viewport height
    let p = y / (h * 0.8);
    if (p < 0) p = 0;
    if (p > 1) p = 1;
    fade.style.opacity = String(p);
    video.style.opacity = String(1 - p * 0.85);
    // video no longer visible: pause to save battery, resume when scrolling back up
    if (!reduce && !saver) { if (p >= 1) video.pause(); else if (video.paused) video.play().catch(() => {}); }
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();

  if (!reduce && !saver) video.play().catch(() => {});
})();
