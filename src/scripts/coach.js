// Tutorial a passi: illumina un elemento, mostra una mano che fa il gesto
// e una nuvoletta con l'istruzione. Parte da solo la prima volta, poi si
// può rivedere dal pulsante "Come si usa".

const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const MANO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-.5V8a1.5 1.5 0 0 1 3 0v2m0-.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-4.7-2.3L4 15.5a1.6 1.6 0 0 1 2.4-2.1L9 15" /></svg>';
let attiva = null;

const crea = (classe, html = '') => {
  const el = document.createElement('div');
  el.className = classe;
  el.innerHTML = html;
  return el;
};

export function giaVista(chiave) {
  try { return sessionStorage.getItem(`lb-guida-${chiave}`) === '1'; } catch (_) { return false; }
}

export function quandoVisibile(el, fn, soglia = 0.55) {
  if (!el) return;
  const io = new IntersectionObserver(([v]) => {
    if (v.intersectionRatio >= soglia) { io.disconnect(); fn(); }
  }, { threshold: [soglia] });
  io.observe(el);
}

/**
 * passi: [{ bersaglio, testo, gesto?: 'tocca'|'tieni'|'trascina'|'muovi', durata, entra?, esci? }]
 */
export function guida({ chiave, passi, onFine }) {
  attiva?.chiudi();
  const luce = crea('guida-luce');
  const mano = crea('guida-mano', MANO);
  const fumetto = crea('guida-fumetto', '<p class="guida-passo"></p><p class="guida-testo"></p><div class="guida-barra"><span></span></div><button type="button" class="guida-salta">Ho capito</button>');
  fumetto.setAttribute('role', 'status');
  fumetto.setAttribute('aria-live', 'polite');
  document.body.append(luce, mano, fumetto);

  let i = -1;
  let timer = 0;
  let raf = 0;
  let chiusa = false;
  let bersaglio = null;

  function posiziona() {
    if (chiusa) return;
    if (bersaglio) {
      const r = bersaglio.getBoundingClientRect();
      const m = 10;
      Object.assign(luce.style, { top: `${r.top - m}px`, left: `${r.left - m}px`, width: `${r.width + 2 * m}px`, height: `${r.height + 2 * m}px` });
      Object.assign(mano.style, { left: `${r.left + r.width / 2}px`, top: `${r.top + r.height / 2}px` });
      const f = fumetto.getBoundingClientRect();
      const sotto = r.bottom + m + 14;
      const top = sotto + f.height < window.innerHeight - 12 ? sotto : Math.max(12, r.top - m - 14 - f.height);
      const left = Math.min(window.innerWidth - f.width - 12, Math.max(12, r.left + r.width / 2 - f.width / 2));
      Object.assign(fumetto.style, { top: `${top}px`, left: `${left}px` });
      // se la sezione esce dallo schermo, la guida si chiude
      if (r.bottom < 0 || r.top > window.innerHeight) { chiudi(); return; }
    }
    raf = requestAnimationFrame(posiziona);
  }

  function vai(n) {
    passi[i]?.esci?.();
    i = n;
    if (i >= passi.length) { chiudi(); return; }
    const p = passi[i];
    bersaglio = typeof p.bersaglio === 'string' ? document.querySelector(p.bersaglio) : p.bersaglio;
    if (!bersaglio) { vai(i + 1); return; }
    // porta il bersaglio in vista, con spazio per la nuvoletta
    const r = bersaglio.getBoundingClientRect();
    if (r.top < 70 || r.bottom > window.innerHeight - 150) {
      const y = window.scrollY + r.top + r.height / 2 - window.innerHeight * 0.42;
      if (window.__lenis) window.__lenis.scrollTo(y, { duration: 0.8 });
      else window.scrollTo({ top: y, behavior: ridotto ? 'auto' : 'smooth' });
    }
    fumetto.querySelector('.guida-passo').textContent = `${i + 1} / ${passi.length}`;
    fumetto.querySelector('.guida-testo').textContent = p.testo;
    mano.className = `guida-mano ${p.gesto ? `gesto-${p.gesto}` : 'nascosta'}`;
    const barra = fumetto.querySelector('.guida-barra span');
    const durata = ridotto ? Math.max(p.durata, 2600) : p.durata;
    barra.style.transition = 'none';
    barra.style.transform = 'scaleX(0)';
    void barra.offsetWidth;
    barra.style.transition = `transform ${durata}ms linear`;
    barra.style.transform = 'scaleX(1)';
    fumetto.classList.remove('entra');
    void fumetto.offsetWidth;
    fumetto.classList.add('entra');
    p.entra?.();
    clearTimeout(timer);
    timer = setTimeout(() => vai(i + 1), durata);
  }

  function chiudi() {
    if (chiusa) return;
    chiusa = true;
    clearTimeout(timer);
    cancelAnimationFrame(raf);
    passi[i]?.esci?.();
    document.removeEventListener('pointerdown', suComando, true);
    document.removeEventListener('click', suTocco, true);
    window.removeEventListener('keydown', suTasto);
    [luce, mano, fumetto].forEach((el) => el.classList.add('esce'));
    setTimeout(() => [luce, mano, fumetto].forEach((el) => el.remove()), 450);
    attiva = null;
    onFine?.();
  }
  // appena usi un comando, o tocchi lo schermo (non per scorrere), la guida lascia il posto a te
  function suComando(e) {
    if (fumetto.contains(e.target)) return;
    if (e.target.closest('button, input, a, select, textarea, [data-tieni]')) chiudi();
  }
  function suTocco(e) {
    if (fumetto.contains(e.target) && !e.target.closest('.guida-salta')) return;
    chiudi();
  }
  function suTasto(e) { if (e.key === 'Escape') chiudi(); }

  fumetto.querySelector('.guida-salta').addEventListener('click', chiudi);
  document.addEventListener('pointerdown', suComando, true);
  document.addEventListener('click', suTocco, true);
  window.addEventListener('keydown', suTasto);
  try { sessionStorage.setItem(`lb-guida-${chiave}`, '1'); } catch (_) { /* storage non disponibile */ }

  attiva = { chiudi };
  vai(0);
  posiziona();
  return attiva;
}
