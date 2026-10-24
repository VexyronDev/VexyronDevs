// Reads server.json (the current address of the Vexyron server) and shows whether it is online.
// The PC that runs the server writes the address there every time it starts: see README.md.
(() => {
  const $ = id => document.getElementById(id);
  const status = $('status'), text = $('status-text'), open = $('open'), apk = $('apk'), win = $('win'), hint = $('hint'), addr = $('addr'), copy = $('copy');

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
      enable(win, url + '/Vexyron-Setup.exe');
      hint.textContent = '';
    } else {
      set('off', 'Der Server ist gerade offline');
      hint.textContent = 'Er läuft nur, wenn der Rechner an ist. Versuch es später noch mal.';
    }
  }

// own download window with a progress bar (the page fetches the installer itself and hands the finished file to the browser's save)
  async function download(href) {
    const ov = $('dl'), bar = ov.querySelector('.dl-bar'), fill = $('dl-f'), note = $('dl-n'), title = $('dl-t'), help = $('dl-h'), cancel = $('dl-x');
    const ac = new AbortController(); let finished = false;
    const close = () => { ov.hidden = true; document.body.style.overflow = ''; };
    const mb = n => (n / 1048576).toFixed(1).replace('.', ',') + ' MB';
    title.textContent = 'Vexyron wird geladen'; help.textContent = ''; note.textContent = 'Starte …'; fill.style.width = '0'; bar.classList.add('wait'); cancel.textContent = 'Abbrechen';
    ov.hidden = false; document.body.style.overflow = 'hidden';
    cancel.onclick = () => { if (!finished) ac.abort(); close(); };
    try {
      const r = await fetch(href, { cache: 'no-store', signal: ac.signal });
      if (!r.ok || !r.body) throw new Error('http');
      const total = +r.headers.get('content-length') || 0, reader = r.body.getReader(), parts = []; let got = 0, t0 = Date.now();
      if (total) bar.classList.remove('wait');
      for (;;) {
        const { done, value } = await reader.read(); if (done) break;
        parts.push(value); got += value.length;
        const sec = (Date.now() - t0) / 1000;
        if (total) { fill.style.width = (got / total * 100).toFixed(1) + '%'; note.textContent = Math.floor(got / total * 100) + ' %  ·  ' + mb(got) + ' von ' + mb(total) + (sec > 1.5 ? '  ·  ' + mb(got / sec) + '/s' : ''); }
        else note.textContent = mb(got) + (sec > 1.5 ? '  ·  ' + mb(got / sec) + '/s' : '');
      }
      finished = true; bar.classList.remove('wait'); fill.style.width = '100%';
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(parts, { type: 'application/octet-stream' })); a.download = 'Vexyron-Setup.exe';
      document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 120000);
      title.textContent = 'Fertig geladen'; note.textContent = 'Vexyron-Setup.exe · ' + mb(got);
      help.textContent = 'Öffne die Datei aus deinem Downloads-Ordner. Das Installationsfenster macht den Rest. Wenn Windows warnt: „Weitere Informationen“ → „Trotzdem ausführen“.';
      cancel.textContent = 'Schließen';
    } catch (e) {
      if (ac.signal.aborted) return;
      close(); location.href = href;        // the direct download as a fallback
    }
  }
  win.addEventListener('click', e => { if (win.getAttribute('aria-disabled') === 'true' || !window.ReadableStream) return; e.preventDefault(); download(win.href); });

  copy.addEventListener('click', async () => {
    const v = addr.textContent;
    if (!/^https:/.test(v)) return;
    try { await navigator.clipboard.writeText(v); copy.textContent = 'Kopiert'; } catch { copy.textContent = 'Markieren und kopieren'; }
    setTimeout(() => { copy.textContent = 'Kopieren'; }, 1800);
  });

  main();
})();
