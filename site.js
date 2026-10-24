// Reads server.json (the current address of the Vexyron server) and shows whether it is online.
// The PC that runs the server writes the address there every time it starts: see README.md.
(() => {
  const $ = id => document.getElementById(id);
  const status = $('status'), text = $('status-text'), open = $('open'), apk = $('apk'), hint = $('hint'), addr = $('addr'), copy = $('copy');

  const set = (state, msg) => { status.dataset.state = state; text.textContent = msg; };
  const enable = (a, href) => { a.href = href; a.removeAttribute('aria-disabled'); };

  async function check(url) {
    const ac = new AbortController(), t = setTimeout(() => ac.abort(), 8000);
    try {
      const r = await fetch(url + '/auth/health', { cache: 'no-store', signal: ac.signal });
      return r.ok && (await r.json()).ok === true;
    } catch { return false; } finally { clearTimeout(t); }
  }

  async function main() {
    let cfg = {};
    try { cfg = await (await fetch('server.json?' + Date.now(), { cache: 'no-store' })).json(); } catch {}
    const url = String(cfg.url || '').replace(/\/+$/, '');
    if (!/^https:\/\/[a-z0-9.-]+$/i.test(url)) {
      set('off', 'Der Server ist gerade offline');
      hint.textContent = 'Komm später noch mal wieder oder frag nach, wann er läuft.';
      return;
    }
    addr.textContent = url;
    if (await check(url)) {
      set('on', 'Der Server ist online');
      enable(open, url + '/');
      enable(apk, url + '/Vexyron.apk');
      hint.textContent = '';
    } else {
      set('off', 'Der Server ist gerade offline');
      hint.textContent = 'Er läuft nur, wenn der Rechner an ist. Versuch es später noch mal.';
    }
  }

  copy.addEventListener('click', async () => {
    const v = addr.textContent;
    if (!/^https:/.test(v)) return;
    try { await navigator.clipboard.writeText(v); copy.textContent = 'Kopiert'; } catch { copy.textContent = 'Markieren und kopieren'; }
    setTimeout(() => { copy.textContent = 'Kopieren'; }, 1800);
  });

  main();
})();
