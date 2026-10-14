// Interazioni della Home. Un solo "segnale di pressione" condiviso tra
// la linea del battito, la scena 3D e il Cruscotto.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { porte, piani } from '../data/sito.js';

gsap.registerPlugin(ScrollTrigger);
const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const segnali = { pressione: 0, respiro: 0, cruscotto: 0.1 };
window.__segnali = segnali;

/* ======================================================================
   1 · SEGNALE DI PRESSIONE (velocità del cursore, del dito o dello scroll)
   ====================================================================== */
let spinta = 0;
let ultimo = null;
function misura(x, y, t) {
  if (ultimo) {
    const dt = Math.max(t - ultimo.t, 1);
    const v = Math.hypot(x - ultimo.x, y - ultimo.y) / dt; // px/ms
    spinta = Math.max(spinta, clamp(v / 2.4));
  }
  ultimo = { x, y, t };
}
window.addEventListener('pointermove', (e) => misura(e.clientX, e.clientY, e.timeStamp), { passive: true });
let ultimoScroll = { y: window.scrollY, t: performance.now() };
window.addEventListener('scroll', () => {
  const t = performance.now();
  const v = Math.abs(window.scrollY - ultimoScroll.y) / Math.max(t - ultimoScroll.t, 1);
  if (window.matchMedia('(pointer: coarse)').matches) spinta = Math.max(spinta, clamp(v / 4));
  ultimoScroll = { y: window.scrollY, t };
}, { passive: true });

/* ======================================================================
   2 · LINEA DEL BATTITO NELL'HERO
   ====================================================================== */
const linea = document.querySelector('.tel-linea');
const bpmEl = document.querySelector('[data-bpm]');
const msg = document.querySelector('.tel-msg');
const hero = document.querySelector('.hero');
let heroVisibile = true;
new IntersectionObserver(([v]) => { heroVisibile = v.isIntersecting; }).observe(hero);

let fase = 0;
let picco = 0;
let quieteDa = 0;
let mostrato = false;
let prec = performance.now();
const PUNTI = 140;

function battito(x) {
  // complesso P-QRS-T stilizzato, x in [0,1)
  const g = (c, w, h) => h * Math.exp(-Math.pow((x - c) / w, 2));
  return g(0.18, 0.035, 0.12) - g(0.36, 0.012, 0.18) + g(0.4, 0.016, 1) - g(0.44, 0.014, 0.32) + g(0.66, 0.06, 0.22);
}

function tick(ora) {
  const dt = Math.min((ora - prec) / 1000, 0.05);
  prec = ora;

  // la spinta decade: fermarsi riporta la calma
  spinta *= Math.pow(0.04, dt);
  const target = segnali.respiro > 0 ? 0 : spinta;
  segnali.pressione += (target - segnali.pressione) * (1 - Math.pow(0.002, dt));
  const p = segnali.pressione;

  if (heroVisibile && linea) {
    const bpm = 60 + p * 95;
    fase += dt * (bpm / 60) * (ridotto ? 0.3 : 1);
    let d = '';
    for (let i = 0; i <= PUNTI; i++) {
      const xs = i / PUNTI;
      const cicli = 3.2;
      const u = (xs * cicli + fase) % 1;
      const rumore = (Math.sin(xs * 90 + ora * 0.02) * 0.5 + Math.sin(xs * 37 - ora * 0.013) * 0.5) * p * 0.35;
      const y = 60 - (battito(u) * (0.75 + p * 0.6) + rumore) * 46;
      d += (i ? 'L' : 'M') + (xs * 1000).toFixed(1) + ' ' + y.toFixed(1);
    }
    linea.setAttribute('d', d);
    if (bpmEl) bpmEl.textContent = String(Math.round(bpm));
    linea.style.stroke = p > 0.45 ? 'var(--terracotta)' : 'var(--inchiostro)';

    // "Ecco. La calma si allena." quando torni quieto dopo un picco
    if (p > 0.42) { picco = ora; quieteDa = 0; }
    if (picco && p < 0.06) {
      if (!quieteDa) quieteDa = ora;
      if (ora - quieteDa > 900 && !mostrato) {
        mostrato = true;
        msg.classList.add('calma');
        msg.textContent = 'Ecco. La calma si allena.';
        setTimeout(() => { mostrato = false; picco = 0; }, 5000);
      }
    }
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

/* ======================================================================
   3 · SCENA 3D (caricata dopo il primo disegno, solo se c'è WebGL)
   ====================================================================== */
const tela = document.querySelector('.tela-3d');
if (tela) {
  const avvia = () => import('./scena3d.js').then(({ avviaScena }) => avviaScena(tela, segnali)).catch(() => {});
  if ('requestIdleCallback' in window) requestIdleCallback(avvia, { timeout: 1200 });
  else setTimeout(avvia, 400);
}

/* ======================================================================
   4 · PORTE: la scelta personalizza il sito
   ====================================================================== */
const esito = document.querySelector('.porta-esito');
const bottoniPorta = [...document.querySelectorAll('[data-porta]')];
function segnaPorta(id, annuncia = true) {
  const p = porte.find((x) => x.id === id);
  if (!p) return;
  bottoniPorta.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.porta === id)));
  esito.hidden = false;
  esito.querySelector('.porta-riga').textContent = p.riga;
  const link = esito.querySelector('.porta-link');
  link.href = p.href;
  link.firstChild.textContent = `Vai a ${p.menu} `;
  if (annuncia) window.__applicaPorta?.(id);
  if (!ridotto && annuncia) gsap.fromTo(esito, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
}
bottoniPorta.forEach((b) => b.addEventListener('click', () => segnaPorta(b.dataset.porta)));
try { const s = sessionStorage.getItem('lb-porta'); if (s) segnaPorta(s, false); } catch (_) {}

/* ======================================================================
   5 · NUMERI che contano (una volta sola)
   ====================================================================== */
document.querySelectorAll('[data-conta]').forEach((el) => {
  const fine = Number(el.dataset.conta);
  if (ridotto) return;
  el.textContent = '0';
  ScrollTrigger.create({
    trigger: el, start: 'top 88%', once: true,
    onEnter: () => {
      const o = { v: 0 };
      gsap.to(o, { v: fine, duration: 1.6, ease: 'power2.out', onUpdate: () => { el.textContent = String(Math.round(o.v)); } });
    },
  });
});

/* ======================================================================
   6 · RESPIRA CON ME (3 cicli: inspira 4 s, espira 6 s)
   ====================================================================== */
const btnStart = document.querySelector('[data-respiro-start]');
const btnStop = document.querySelector('[data-respiro-stop]');
const faseEl = document.querySelector('.respiro-fase');
const contoEl = document.querySelector('[data-respiro-conto]');
const progresso = document.querySelector('.anello-progresso');
const fineEl = document.querySelector('.respiro-fine');
const INS = 4, ESP = 6, CICLI = 3, TOT = (INS + ESP) * CICLI;
let respiroRaf = 0;
let inizio = 0;
const morbido = (x) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(x));

function fermaRespiro(completato) {
  cancelAnimationFrame(respiroRaf);
  respiroRaf = 0;
  btnStop.hidden = true;
  btnStart.hidden = false;
  btnStart.firstChild.textContent = completato ? 'Ancora ' : 'Inizia ';
  gsap.to(segnali, { respiro: 0, duration: 1.2, ease: 'sine.inOut' });
  progresso.style.strokeDashoffset = '1';
  if (completato) {
    faseEl.textContent = 'Fatto.';
    contoEl.textContent = '00';
    fineEl.hidden = false;
    if (!ridotto) gsap.fromTo(fineEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' });
  } else {
    faseEl.textContent = 'Pronto?';
    contoEl.textContent = '30';
  }
}
function passoRespiro(ora) {
  const t = (ora - inizio) / 1000;
  if (t >= TOT) return fermaRespiro(true);
  const nelCiclo = t % (INS + ESP);
  const inspira = nelCiclo < INS;
  const v = inspira ? morbido(nelCiclo / INS) : 1 - morbido((nelCiclo - INS) / ESP);
  segnali.respiro = v;
  const testo = inspira ? 'Inspira' : 'Espira';
  if (faseEl.textContent !== testo) faseEl.textContent = testo;
  contoEl.textContent = String(Math.ceil(TOT - t)).padStart(2, '0');
  progresso.style.strokeDashoffset = String(1 - t / TOT);
  respiroRaf = requestAnimationFrame(passoRespiro);
}
btnStart?.addEventListener('click', () => {
  fineEl.hidden = true;
  btnStart.hidden = true;
  btnStop.hidden = false;
  btnStop.focus();
  inizio = performance.now();
  respiroRaf = requestAnimationFrame(passoRespiro);
});
btnStop?.addEventListener('click', () => { fermaRespiro(false); btnStart.focus(); });

/* ======================================================================
   7 · IL CRUSCOTTO: una pressione, quattro lancette
   ====================================================================== */
const slider = document.getElementById('pressione');
const out = document.querySelector('.pressione-out');
const dettaglio = document.getElementById('cruscotto-dettaglio');
const LETTURE = {
  pensiero: { nome: 'Attenzione', da: 92, a: 28, unita: '%', alto: (v) => v < 45, testo: "Sotto pressione l'attenzione si restringe: si vede meno, si decide peggio." },
  emozione: { nome: 'Attivazione', da: 18, a: 92, unita: '%', alto: (v) => v > 70, testo: 'La paura di sbagliare sale e chiede tutta l’energia.' },
  corpo: { nome: 'Tensione', da: 12, a: 88, unita: '%', alto: (v) => v > 65, testo: 'I muscoli si irrigidiscono: il gesto perde precisione.' },
  fisiologia: { nome: 'Battito', da: 58, a: 156, unita: ' bpm', alto: (v) => v > 125, testo: 'Battito e respiro accelerano: il corpo entra in allarme.' },
};
const strumenti = [...document.querySelectorAll('[data-strumento]')];
function aggiornaCruscotto(valore) {
  const p = valore / 100;
  segnali.cruscotto = p;
  out.textContent = String(valore);
  slider.setAttribute('aria-valuetext', `Pressione ${valore} su 100`);
  strumenti.forEach((s) => {
    const l = LETTURE[s.dataset.strumento];
    const v = l.da + (l.a - l.da) * p;
    const norm = clamp((v - Math.min(l.da, l.a)) / Math.abs(l.a - l.da));
    s.querySelector('.arco-val').style.strokeDashoffset = String(100 - norm * 100);
    s.querySelector('.lancetta').style.transform = `rotate(${-90 + norm * 180}deg)`;
    s.querySelector('[data-val]').textContent = `${l.nome} ${Math.round(v)}${l.unita}`;
    s.classList.toggle('alto', l.alto(v));
  });
}
let toccato = false;
slider?.addEventListener('input', () => { toccato = true; aggiornaCruscotto(Number(slider.value)); });
strumenti.forEach((s) => s.addEventListener('click', () => {
  const aperto = s.getAttribute('aria-expanded') === 'true';
  strumenti.forEach((x) => x.setAttribute('aria-expanded', 'false'));
  if (aperto) { dettaglio.textContent = 'Tocca uno strumento per capire cosa misura.'; return; }
  s.setAttribute('aria-expanded', 'true');
  const piano = piani.find((x) => x.id === s.dataset.strumento);
  dettaglio.textContent = `${piano.nome} · piano ${piano.piano.toLowerCase()}. ${LETTURE[s.dataset.strumento].testo}`;
}));
if (slider) {
  aggiornaCruscotto(Number(slider.value));
  if (!ridotto) {
    // dimostrazione unica: la pressione sale e scende da sola, finché non la tocchi tu
    ScrollTrigger.create({
      trigger: '.cruscotto-grid', start: 'top 70%', once: true,
      onEnter: () => {
        const o = { v: Number(slider.value) };
        gsap.timeline()
          .to(o, { v: 82, duration: 2.4, ease: 'power2.inOut', onUpdate: () => { if (!toccato) { slider.value = Math.round(o.v); aggiornaCruscotto(Math.round(o.v)); } } })
          .to(o, { v: 22, duration: 2.6, ease: 'power2.inOut', delay: 0.6, onUpdate: () => { if (!toccato) { slider.value = Math.round(o.v); aggiornaCruscotto(Math.round(o.v)); } } });
      },
    });
  }
}

/* ======================================================================
   8 · DALLA SCUOLA CALCIO ALLA FORMULA 1 (orizzontale su desktop)
   ====================================================================== */
const pista = document.querySelector('.pista');
const tappe = document.querySelector('.pista-tappe');
const traccia = document.querySelector('.traccia-viva');
const numTappa = document.querySelector('[data-tappa]');
const barra = document.querySelector('.pista-progresso .barra');
const totTappe = tappe ? tappe.children.length : 0;
function segnaProgresso(p) {
  if (traccia) traccia.style.strokeDashoffset = String(1 - p);
  if (barra) barra.style.setProperty('--p', p.toFixed(3));
  if (numTappa) numTappa.textContent = String(Math.min(totTappe, 1 + Math.floor(p * totTappe * 0.999))).padStart(2, '0');
}
if (pista && tappe) {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 821px) and (prefers-reduced-motion: no-preference)', () => {
    const distanza = () => Math.max(0, tappe.scrollWidth - window.innerWidth);
    const tween = gsap.to(tappe, {
      x: () => -distanza(),
      ease: 'none',
      scrollTrigger: {
        trigger: pista, start: 'top top', end: () => '+=' + distanza(),
        pin: true, scrub: 0.8, invalidateOnRefresh: true,
        onUpdate: (st) => segnaProgresso(st.progress),
      },
    });
    return () => tween.kill();
  });
  mm.add('(max-width: 820px), (prefers-reduced-motion: reduce)', () => {
    const st = ScrollTrigger.create({
      trigger: tappe, start: 'top 70%', end: 'bottom 60%',
      onUpdate: (s) => segnaProgresso(s.progress),
    });
    if (ridotto) segnaProgresso(1);
    return () => st.kill();
  });
}

/* ======================================================================
   9 · AUTOVALUTAZIONE: cinque tocchi, profilo sui quattro piani
   ====================================================================== */
const quiz = document.querySelector('.quiz');
if (quiz) {
  const domande = [...quiz.querySelectorAll('[data-domanda]')];
  const barraQuiz = quiz.querySelector('.quiz-barra span');
  const esitoQuiz = quiz.querySelector('.quiz-esito');
  let punti = [0, 0, 0, 0];
  let i = 0;
  const mostra = (el) => {
    el.hidden = false;
    if (!ridotto) gsap.fromTo(el, { opacity: 0, x: 16 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' });
  };
  quiz.addEventListener('click', (e) => {
    const scelta = e.target.closest('.quiz-scelta');
    if (!scelta) return;
    punti[Number(scelta.dataset.piano)] += 1;
    domande[i].hidden = true;
    i += 1;
    barraQuiz.style.setProperty('--p', String(i / domande.length));
    if (i < domande.length) {
      mostra(domande[i]);
      domande[i].querySelector('.quiz-scelta').focus({ preventScroll: true });
      return;
    }
    const max = Math.max(...punti);
    const top = punti.indexOf(max);
    piani.forEach((p, k) => {
      const bar = esitoQuiz.querySelector(`[data-bar="${p.id}"]`);
      bar.classList.toggle('top', k === top);
      bar.style.transform = 'scaleX(0)';
      requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transform = `scaleX(${(punti[k] + 0.4) / (domande.length + 0.4)})`; }));
    });
    esitoQuiz.querySelector('.quiz-titolo-esito').textContent = `Il piano più sollecitato: ${piani[top].nome}.`;
    mostra(esitoQuiz);
    esitoQuiz.querySelector('.quiz-titolo-esito').setAttribute('tabindex', '-1');
    esitoQuiz.querySelector('.quiz-titolo-esito').focus({ preventScroll: true });
  });
  quiz.querySelector('[data-quiz-reset]').addEventListener('click', () => {
    punti = [0, 0, 0, 0];
    i = 0;
    esitoQuiz.hidden = true;
    barraQuiz.style.setProperty('--p', '0');
    mostra(domande[0]);
    domande[0].querySelector('.quiz-scelta').focus({ preventScroll: true });
  });
}
