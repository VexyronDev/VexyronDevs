// Reads server.json (the current address of the Vexyron server) and shows status.
// On the status page it renders a Claude-like component list.
(() => {
  const $ = id => document.getElementById(id);
  const status = $('status'), text = $('status-text'), open = $('open'), apk = $('apk'), win = $('win'), hint = $('hint'), addr = $('addr'), copy = $('copy'), loadEl = $('load');
  const banner = $('banner'), bannerText = $('banner-text');
  const compServer = $('comp-server'), compEngine = $('comp-engine'), compTunnel = $('comp-tunnel'), compQueue = $('comp-queue');
  const checked = $('checked');

  const setComp = (el, state, msg) => {
    if (!el) return;
    const s = el.querySelector('.comp-status');
    if (s) {
      const i = s.querySelector('i');
      if (i) i.className = '';
      if (i) i.dataset.state = state;
      const sp = s.querySelector('span');
      if (sp) sp.textContent = msg;
    }
    el.dataset.state = state;
  };

  const setBanner = (state, msg) => {
    if (banner) banner.dataset.state = state;
    if (bannerText) bannerText.textContent = msg;
  };

  const enable = (a, href) => { if (!a) return; a.href = href; a.removeAttribute('aria-disabled'); };

  async function check(url) {
    const ac = new AbortController(), t = setTimeout(() => ac.abort(), 8000);
    try {
      const r = await fetch(url + '/auth/health', { cache: 'no-store', signal: ac.signal });
      return r.ok && (await r.json()).ok === true;
    } catch { return false; } finally { clearTimeout(t); }
  }

  async function loadStatus(url) {
    if (!loadEl) return;
    try {
      const r = await fetch(url + '/auth/load', { cache: 'no-store' });
      if (!r.ok) throw new Error('http');
      const d = await r.json();
      const q = d.queue || {};
      const busy = d.imageBusy ? ' · Bild wird gemalt' : '';
      loadEl.textContent = `Antworten: ${q.running ?? 0} von ${q.slots ?? '?'} laufen, ${q.waiting ?? 0} in der Warteschlange${busy}`;
      if (compQueue) setComp(compQueue, 'on', `${q.running ?? 0}/${q.slots ?? '?'} laufen · ${q.waiting ?? 0} warten`);
    } catch {
      if (loadEl) loadEl.textContent = 'Auslastung nicht verfügbar';
      if (compQueue) setComp(compQueue, 'off', 'Nicht verfügbar');
    }
  }

  async function main() {
    let cfg = {};
    try { cfg = await (await fetch('server.json?' + Date.now(), { cache: 'no-store' })).json(); } catch {}
    const url = String(cfg.url || '').replace(/\/+$/, '');

    // legacy status pill (index.html) - no longer present but keep safe
    if (status) {
      if (!/^https:\/\/[a-z0-9.-]+$/i.test(url)) {
        status.dataset.state = 'off';
        if (text) text.textContent = 'Der Server ist gerade offline';
        if (hint) hint.textContent = 'Komm später noch mal wieder oder frag nach, wann er läuft.';
        if (loadEl) loadEl.textContent = 'Server offline';
        if (compServer) setComp(compServer, 'off', 'Offline');
        if (compEngine) setComp(compEngine, 'off', 'Offline');
        if (compTunnel) setComp(compTunnel, 'off', 'Offline');
        if (compQueue) setComp(compQueue, 'off', 'Offline');
        setBanner('off', 'Server offline');
        if (checked) checked.textContent = new Date().toLocaleTimeString('de-DE');
        return;
      }
      // url valid
      if (addr) addr.textContent = url;
      const online = await check(url);
      if (online) {
        if (status) status.dataset.state = 'on';
        if (text) text.textContent = 'Der Server ist online';
        enable(open, url + '/');
        enable(apk, url + '/Vexyron.apk');
        enable(win, url + '/Vexyron-Setup.exe');
        if (hint) hint.textContent = '';
        setComp(compServer, 'on', 'Aktiv');
        setComp(compEngine, 'on', 'Aktiv');
        setComp(compTunnel, 'on', 'Erreichbar');
        setBanner('on', 'Alle Systeme betriebsbereit');
        loadStatus(url);
      } else {
        if (status) status.dataset.state = 'off';
        if (text) text.textContent = 'Der Server ist gerade offline';
        if (hint) hint.textContent = 'Er läuft nur, wenn der Rechner an ist. Versuch es später noch mal.';
        setComp(compServer, 'off', 'Offline');
        setComp(compEngine, 'off', 'Offline');
        setComp(compTunnel, 'off', 'Nicht erreichbar');
        setComp(compQueue, 'off', 'Nicht verfügbar');
        setBanner('off', 'Server offline');
        if (loadEl) loadEl.textContent = 'Server offline';
      }
      if (checked) checked.textContent = new Date().toLocaleTimeString('de-DE');
    } else {
      // status page without legacy pill
      if (!/^https:\/\/[a-z0-9.-]+$/i.test(url)) {
        if (addr) addr.textContent = '–';
        setComp(compServer, 'off', 'Offline');
        setComp(compEngine, 'off', 'Offline');
        setComp(compTunnel, 'off', 'Offline');
        setComp(compQueue, 'off', 'Offline');
        setBanner('off', 'Server offline');
        if (loadEl) loadEl.textContent = 'Server offline';
        if (checked) checked.textContent = new Date().toLocaleTimeString('de-DE');
        return;
      }
      if (addr) addr.textContent = url;
      const online = await check(url);
      if (online) {
        enable(open, url + '/');
        enable(apk, url + '/Vexyron.apk');
        enable(win, url + '/Vexyron-Setup.exe');
        setComp(compServer, 'on', 'Aktiv');
        setComp(compEngine, 'on', 'Aktiv');
        setComp(compTunnel, 'on', 'Erreichbar');
        setBanner('on', 'Alle Systeme betriebsbereit');
        loadStatus(url);
      } else {
        setComp(compServer, 'off', 'Offline');
        setComp(compEngine, 'off', 'Offline');
        setComp(compTunnel, 'off', 'Nicht erreichbar');
        setComp(compQueue, 'off', 'Nicht verfügbar');
        setBanner('off', 'Server offline');
        if (loadEl) loadEl.textContent = 'Server offline';
      }
      if (checked) checked.textContent = new Date().toLocaleTimeString('de-DE');
    }
  }

  // copy button
  if (copy) copy.addEventListener('click', async () => {
    const v = addr ? addr.textContent : '';
    if (!/^https:/.test(v)) return;
    try { await navigator.clipboard.writeText(v); copy.textContent = 'Kopiert'; } catch { copy.textContent = 'Markieren und kopieren'; }
    setTimeout(() => { copy.textContent = 'Kopieren'; }, 1800);
  });

  // auto-refresh every 30s
  main();
  setInterval(main, 30000);
})();
