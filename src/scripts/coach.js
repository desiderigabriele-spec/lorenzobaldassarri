// Tutorial interattivo a passi: illumina un comando, mostra una mano che fa
// il gesto e una nuvoletta con l'istruzione. Ogni passo può aspettare che
// sia la persona a fare il gesto; se non lo fa, dopo un po' lo mostra da solo.

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
 * zona: la sezione in cui si svolge la guida (i tocchi lì dentro non la chiudono)
 * passi: [{
 *   bersaglio, testo, gesto?: 'tocca'|'tieni'|'trascina'|'muovi',
 *   durata?: ms (passo che avanza da solo),
 *   attendi?: (avanti) => pulizia   (passo che aspetta il gesto della persona),
 *   demo?: () => pulizia, demoDopo?: ms   (se la persona non agisce, lo fa la guida),
 *   entra?, esci?
 * }]
 */
export function guida({ chiave, zona, passi, onFine }) {
  attiva?.chiudi();
  const luce = crea('guida-luce');
  const mano = crea('guida-mano', MANO);
  const fumetto = crea('guida-fumetto', '<p class="guida-passo"></p><p class="guida-testo"></p><p class="guida-aiuto"></p><div class="guida-barra"><span></span></div><button type="button" class="guida-salta">Chiudi la guida</button>');
  fumetto.setAttribute('role', 'status');
  fumetto.setAttribute('aria-live', 'polite');
  document.body.append(luce, mano, fumetto);

  let i = -1;
  let timer = 0;
  let timerDemo = 0;
  let raf = 0;
  let chiusa = false;
  let bersaglio = null;
  let pulizie = [];
  let ultimo = '';

  // aggiorna le posizioni solo quando il bersaglio si sposta davvero (niente ridisegni inutili)
  function posiziona() {
    if (chiusa) return;
    if (bersaglio) {
      const r = bersaglio.getBoundingClientRect();
      const chiaveR = `${Math.round(r.left)}|${Math.round(r.top)}|${Math.round(r.width)}|${Math.round(r.height)}|${window.innerWidth}`;
      if (chiaveR !== ultimo) {
        ultimo = chiaveR;
        const m = 10;
        luce.style.transform = `translate3d(${r.left - m}px, ${r.top - m}px, 0)`;
        luce.style.width = `${r.width + 2 * m}px`;
        luce.style.height = `${r.height + 2 * m}px`;
        mano.style.transform = `translate3d(${r.left + r.width / 2}px, ${r.top + r.height / 2}px, 0)`;
        const f = fumetto.getBoundingClientRect();
        const sotto = r.bottom + m + 14;
        const top = sotto + f.height < window.innerHeight - 12 ? sotto : Math.max(12, r.top - m - 14 - f.height);
        const left = Math.min(window.innerWidth - f.width - 12, Math.max(12, r.left + r.width / 2 - f.width / 2));
        fumetto.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      }
      // se la sezione esce dallo schermo, la guida si chiude
      if (r.bottom < 0 || r.top > window.innerHeight) { chiudi(); return; }
    }
    raf = requestAnimationFrame(posiziona);
  }

  function pulisci() {
    clearTimeout(timer);
    clearTimeout(timerDemo);
    pulizie.forEach((f) => { try { f?.(); } catch (_) { /* niente */ } });
    pulizie = [];
  }

  function vai(n) {
    if (chiusa) return;
    pulisci();
    passi[i]?.esci?.();
    i = n;
    if (i >= passi.length) { chiudi(); return; }
    const p = passi[i];
    bersaglio = typeof p.bersaglio === 'string' ? document.querySelector(p.bersaglio) : p.bersaglio;
    if (!bersaglio) { vai(i + 1); return; }
    ultimo = '';
    // porta il bersaglio in vista, con spazio per la nuvoletta
    const r = bersaglio.getBoundingClientRect();
    if (r.top < 70 || r.bottom > window.innerHeight - 160) {
      const y = window.scrollY + r.top + r.height / 2 - window.innerHeight * 0.4;
      if (window.__lenis) window.__lenis.scrollTo(y, { duration: 0.8 });
      else window.scrollTo({ top: y, behavior: ridotto ? 'auto' : 'smooth' });
    }
    fumetto.querySelector('.guida-passo').textContent = `${i + 1} / ${passi.length}`;
    fumetto.querySelector('.guida-testo').textContent = p.testo;
    fumetto.querySelector('.guida-aiuto').textContent = p.attendi ? 'Prova tu: la guida aspetta il tuo gesto' : '';
    mano.className = `guida-mano ${p.gesto ? `gesto-${p.gesto}` : 'nascosta'}`;
    fumetto.classList.toggle('attende', !!p.attendi);
    const barra = fumetto.querySelector('.guida-barra span');
    barra.style.transition = 'none';
    barra.style.transform = 'scaleX(0)';
    void barra.offsetWidth;
    fumetto.classList.remove('entra');
    void fumetto.offsetWidth;
    fumetto.classList.add('entra');
    p.entra?.();
    if (p.attendi) {
      pulizie.push(p.attendi(() => setTimeout(() => vai(i + 1), 450)));
      if (p.demo) {
        timerDemo = setTimeout(() => {
          fumetto.querySelector('.guida-aiuto').textContent = 'Te lo mostro io…';
          pulizie.push(p.demo());
        }, ridotto ? 0 : (p.demoDopo ?? 5000));
      }
    } else {
      const durata = ridotto ? Math.max(p.durata, 2600) : p.durata;
      barra.style.transition = `transform ${durata}ms linear`;
      barra.style.transform = 'scaleX(1)';
      timer = setTimeout(() => vai(i + 1), durata);
    }
  }

  function chiudi() {
    if (chiusa) return;
    chiusa = true;
    pulisci();
    cancelAnimationFrame(raf);
    passi[i]?.esci?.();
    document.removeEventListener('pointerdown', suTocco, true);
    window.removeEventListener('keydown', suTasto);
    [luce, mano, fumetto].forEach((el) => el.classList.add('esce'));
    setTimeout(() => [luce, mano, fumetto].forEach((el) => el.remove()), 450);
    attiva = null;
    onFine?.();
  }
  // dentro la sezione la guida ti accompagna; un clic fuori (col mouse) la chiude
  function suTocco(e) {
    if (fumetto.contains(e.target)) return;
    if (zona && zona.contains(e.target)) {
      if (passi[i]?.attendi) return;
      if (e.target.closest('button, input, a, [data-tieni]')) chiudi();
      return;
    }
    if (e.pointerType === 'mouse') chiudi();
  }
  function suTasto(e) { if (e.key === 'Escape') chiudi(); }

  fumetto.querySelector('.guida-salta').addEventListener('click', chiudi);
  document.addEventListener('pointerdown', suTocco, true);
  window.addEventListener('keydown', suTasto);
  try { sessionStorage.setItem(`lb-guida-${chiave}`, '1'); } catch (_) { /* storage non disponibile */ }

  attiva = { chiudi };
  vai(0);
  posiziona();
  return attiva;
}
