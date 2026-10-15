// Interazioni della Home. Un solo "segnale di pressione" condiviso tra
// la linea del battito, la scena 3D e il Cruscotto.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { porte, piani } from '../data/sito.js';
import { guida, giaVista, quandoVisibile } from './coach.js';

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


/* ======================================================================
   2 · LINEA DEL BATTITO NELL'HERO
   ====================================================================== */
const linea = document.querySelector('.tel-linea');
const bpmEl = document.querySelector('[data-bpm]');
const msg = document.querySelector('.tel-msg');
const mente = document.querySelector('.mente');
const barraP = document.querySelector('[data-pressione-barra]');
const valP = document.querySelector('[data-pressione-val]');
let heroVisibile = false;
if (mente) new IntersectionObserver(([v]) => { heroVisibile = v.isIntersecting; if (v.intersectionRatio > 0.35) mente.classList.add('vista'); }, { threshold: [0, 0.35] }).observe(mente);

const FRASI = [['Sono concentrato', 'E se sbaglio?'], ['Carico giusto', 'Ho un nodo allo stomaco'], ['Sciolto', 'Spalle rigide'], ['Respiro calmo', 'Cuore a mille']];
const frasiEl = [...document.querySelectorAll('[data-frase]')];
const statoMente = document.querySelector('[data-mente-stato]');
let sottoPressione = false;
function impostaFrasi(su) {
  sottoPressione = su;
  mente?.classList.toggle('sotto-pressione', su);
  frasiEl.forEach((el) => { el.textContent = FRASI[+el.dataset.frase][su ? 1 : 0]; });
  if (statoMente) statoMente.textContent = su ? 'Sotto pressione: ogni parte va per conto suo' : 'In equilibrio: le tue parti lavorano insieme';
}
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

/* Pulsante "Tieni premuto": la pressione cresce finché tieni, poi torna la calma */
const tieni = document.querySelector('[data-tieni]');
let tenuto = false;
let dimostra = false; // la guida "preme" al posto tuo
let caricoTieni = 0;
let prossimoBattito = 0;
function premi(e) { if (e) e.preventDefault(); tenuto = true; tieni.classList.add('premuto', 'usato'); }
function lascia() { if (!tenuto) return; tenuto = false; tieni.classList.remove('premuto'); }
if (tieni) {
  tieni.addEventListener('pointerdown', (e) => { tieni.setPointerCapture?.(e.pointerId); premi(e); });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((t) => tieni.addEventListener(t, lascia));
  tieni.addEventListener('contextmenu', (e) => e.preventDefault());
  tieni.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) premi(e); });
  tieni.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') lascia(); });
}

function tick(ora) {
  const dt = Math.min((ora - prec) / 1000, 0.05);
  prec = ora;
  // tenere premuto fa salire la pressione in circa 2 secondi; lasciare la fa scendere
  caricoTieni = (tenuto || dimostra) ? Math.min(1, caricoTieni + dt * 0.55) : Math.max(0, caricoTieni - dt * 2);
  if (caricoTieni > 0) spinta = Math.max(spinta, caricoTieni);
  if (tieni) tieni.style.setProperty('--p', caricoTieni.toFixed(3));
  // vibrazione a ritmo di battito, dove il telefono la supporta
  if (tenuto && navigator.vibrate && ora > prossimoBattito) {
    navigator.vibrate(18);
    prossimoBattito = ora + 60000 / (60 + segnali.pressione * 95);
  }

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
    if (barraP) barraP.style.transform = `scaleX(${Math.max(0.02, p).toFixed(3)})`;
    if (valP) valP.textContent = `${Math.round(p * 100)}%`;

    // le frasi della persona cambiano con la pressione (con un po' di isteresi per non sfarfallare)
    if (!sottoPressione && p > 0.45) impostaFrasi(true);
    else if (sottoPressione && p < 0.3) impostaFrasi(false);

    // "Ecco. La calma si allena." quando torni quieto dopo un picco
    if (p > 0.42) { mente?.classList.add('provato'); picco = ora; quieteDa = 0; if (!mostrato) { msg.classList.remove('calma'); msg.textContent = 'Sotto pressione: ogni parte va per conto suo…'; } }
    if (picco && p < 0.06) {
      if (!quieteDa) quieteDa = ora;
      if (ora - quieteDa > 900 && !mostrato) {
        mostrato = true;
        msg.classList.add('calma');
        msg.textContent = 'Ecco: le tue parti tornano insieme. La calma si allena.';
        setTimeout(() => { mostrato = false; picco = 0; }, 5000);
      }
    }
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

/* Guida della sfera: aspetta il tuo gesto; se non arriva, lo mostra lei */
const touch = window.matchMedia('(pointer: coarse)').matches;
// osserva una condizione a ogni fotogramma, finché diventa vera
function osserva(cond, poi) {
  let id = 0;
  let da = 0;
  const giro = (t) => {
    if (cond()) { if (!da) da = t; if (t - da > 350) { poi(); return; } } else da = 0;
    id = requestAnimationFrame(giro);
  };
  id = requestAnimationFrame(giro);
  return () => cancelAnimationFrame(id);
}
function guidaMente() {
  const sale = (avanti) => osserva(() => segnali.pressione > 0.55, avanti);
  const scende = (avanti) => osserva(() => !tenuto && segnali.pressione < 0.12, avanti);
  const passi = touch ? [
    { bersaglio: '[data-tieni]', testo: 'Tieni premuto questo pulsante', gesto: 'tieni', attendi: sale, demo: () => { dimostra = true; }, demoDopo: 4500 },
    { bersaglio: '.mente-ancora', testo: 'Guarda la sfera: sotto pressione ogni parte di te va per conto suo', durata: 2600 },
    { bersaglio: '[data-tieni]', testo: 'Ora lascia il pulsante: tornano insieme', gesto: 'tocca', entra: () => { dimostra = false; }, attendi: scende },
    { bersaglio: '.mente-ancora', testo: 'Visto? La calma si allena. Ora prova quando vuoi.', durata: 2600 },
  ] : [
    { bersaglio: '.mente-ancora', testo: 'Muovi il mouse veloce sopra la sfera', gesto: 'muovi', attendi: sale, demo: () => { dimostra = true; }, demoDopo: 4500 },
    { bersaglio: '.mente-ancora', testo: 'Visto? Sotto pressione ogni parte di te va per conto suo', durata: 2400 },
    { bersaglio: '.mente-ancora', testo: 'Ora fermati: lascia il mouse immobile', entra: () => { dimostra = false; }, attendi: scende },
    { bersaglio: '.mente-ancora', testo: 'Tornano insieme: la calma si allena.', durata: 2400 },
  ];
  guida({ chiave: 'mente', zona: mente, passi, onFine: () => { dimostra = false; } });
}
if (mente) {
  if (!giaVista('mente') && !ridotto) quandoVisibile(mente, () => setTimeout(guidaMente, 700));
  mente.querySelector('[data-guida="mente"]')?.addEventListener('click', (e) => { e.stopPropagation(); setTimeout(guidaMente, 50); });
}

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
// i numeri restano fermi sul valore vero: niente "0+" prima di scorrere

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
const pianoScelto = document.querySelector('[data-piano-scelto]');
// Ogni piano ha un punto di equilibrio al centro (50). Troppo poco o troppo: fuori asse.
const LETTURE = {
  pensiero: { basso: 'Distratto', giusto: 'Lucido', alto: 'Agitato' },
  emozione: { basso: 'Piatto', giusto: 'Carico', alto: 'In ansia' },
  corpo: { basso: 'Molle', giusto: 'Sciolto', alto: 'Rigido' },
  fisiologia: { basso: 'Spento', giusto: 'Regolare', alto: 'Battito alto' },
};
const strumenti = [...document.querySelectorAll('[data-strumento]')];
const base = { pensiero: 50, emozione: 50, corpo: 50, fisiologia: 50 };
let scelto = 'pensiero';
let allenato = false;
const bottoniAllenamento = [...document.querySelectorAll('[data-allenato]')];
function impostaAllenamento(si) {
  allenato = si;
  bottoniAllenamento.forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.allenato === 'si') === si)));
  aggiornaCruscotto();
}
bottoniAllenamento.forEach((b) => b.addEventListener('click', () => impostaAllenamento(b.dataset.allenato === 'si')));
// verde → ambra → rosso in base alla distanza dal centro
// sfumatura continua: azzurro al centro, poi verdolino, giallo, arancione, rosso
const SCALA = [[0, 178], [0.12, 140], [0.3, 58], [0.5, 30], [0.72, 0]];
function coloreStato(d) {
  let h = 0;
  for (let k = 1; k < SCALA.length; k++) {
    const [d0, h0] = SCALA[k - 1];
    const [d1, h1] = SCALA[k];
    if (d <= d1) { h = h0 + (h1 - h0) * ((d - d0) / (d1 - d0)); break; }
  }
  return `hsl(${Math.max(0, h).toFixed(0)} 90% 58%)`;
}
function aggiornaCruscotto() {
  const valori = {};
  let somma = 0;
  const nomiFuori = [];
  for (const id of Object.keys(base)) {
    // senza allenamento: il piano mosso va fino in fondo e trascina molto gli altri
    // con allenamento: il piano regge di più e gli altri quasi non si muovono
    let v = 50 + (base[id] - 50) * (allenato ? 0.55 : 1);
    for (const altro of Object.keys(base)) if (altro !== id) v += (base[altro] - 50) * (allenato ? 0.1 : 0.6);
    valori[id] = clamp(v / 100) * 100;
  }
  strumenti.forEach((s) => {
    const id = s.dataset.strumento;
    const v = valori[id];
    const d = Math.abs(v - 50) / 50;
    somma += d;
    const l = LETTURE[id];
    const stato = d < 0.18 ? l.giusto : (v > 50 ? l.alto : l.basso);
    s.style.setProperty('--stato', coloreStato(d));
    s.style.setProperty('--bagliore', d.toFixed(2));
    s.querySelector('.lancetta').style.transform = `rotate(${-90 + (v / 100) * 180}deg)`;
    s.querySelector('[data-val]').textContent = stato;
    s.classList.toggle('fuori', d >= 0.4);
    if (d >= 0.4) nomiFuori.push(piani.find((x) => x.id === id).nome);
  });
  const dSel = Math.abs(valori[scelto] - 50) / 50;
  const lSel = LETTURE[scelto];
  const statoSel = dSel < 0.18 ? 'In equilibrio' : (valori[scelto] > 50 ? lSel.alto : lSel.basso);
  out.textContent = statoSel;
  out.style.setProperty('--stato-sel', coloreStato(dSel));
  slider.setAttribute('aria-valuetext', `${piani.find((x) => x.id === scelto).nome}: ${statoSel}`);
  segnali.cruscotto = clamp(somma / 4);
  const tuttiVerdi = Object.values(valori).every((v) => Math.abs(v - 50) / 50 < 0.18);
  dettaglio.classList.toggle('equilibrio', tuttiVerdi);
  dettaglio.classList.toggle('allarme', nomiFuori.length > 1);
  const spinto = Object.values(base).some((v) => Math.abs(v - 50) > 30);
  if (allenato && spinto) dettaglio.textContent = 'Dopo il percorso la parte regge e le altre restano tranquille. Per questo le alleno insieme.';
  else if (nomiFuori.length === 0) dettaglio.textContent = tuttiVerdi ? 'Tutto in equilibrio: le tue parti lavorano insieme.' : 'Quasi in equilibrio: riportala verso il centro.';
  else if (nomiFuori.length === 1) dettaglio.textContent = `${nomiFuori[0]} in tilt: guarda, si spostano anche le altre.`;
  else dettaglio.textContent = 'Oggi una parte in tilt si trascina dietro tutte le altre.';
}
// riporta al centro le parti indicate, con una breve animazione
let tweenCentro = null;
function riportaAlCentro(ids, durata = 0.8) {
  tweenCentro?.kill();
  const da = { ...base };
  const o = { t: 0 };
  tweenCentro = gsap.to(o, { t: 1, duration: ridotto ? 0 : durata, ease: 'power2.inOut', onUpdate: () => {
    ids.forEach((k) => { base[k] = da[k] + (50 - da[k]) * o.t; });
    slider.value = String(Math.round(base[scelto]));
    aggiornaCruscotto();
  } });
}
function scegli(id) {
  // si muove una parte alla volta: cambiando parte, le altre tornano al centro
  if (id !== scelto) {
    demoTween?.kill();
    const spostate = Object.keys(base).filter((k) => k !== id && Math.abs(base[k] - 50) > 0.5);
    if (spostate.length) riportaAlCentro(spostate, 0.6);
  }
  scelto = id;
  strumenti.forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.strumento === id)));
  if (pianoScelto) pianoScelto.textContent = piani.find((x) => x.id === id).nome;
  slider.value = String(base[id]);
  aggiornaCruscotto();
}
let toccato = false;
slider?.addEventListener('input', () => { toccato = true; base[scelto] = Number(slider.value); aggiornaCruscotto(); });
strumenti.forEach((s) => s.addEventListener('click', () => { toccato = true; scegli(s.dataset.strumento); }));
document.querySelector('[data-equilibrio]')?.addEventListener('click', () => {
  toccato = true;
  riportaAlCentro(Object.keys(base));
});
let demoTween = null;
function animaPiano(id, a, durata = 1.8) {
  demoTween?.kill();
  const o = { v: base[id] };
  demoTween = gsap.to(o, { v: a, duration: ridotto ? 0 : durata, ease: 'power2.inOut', onUpdate: () => {
    base[id] = o.v;
    if (scelto === id) slider.value = String(Math.round(o.v));
    aggiornaCruscotto();
  } });
}
function guidaCruscotto() {
  demoTween?.kill();
  for (const id of Object.keys(base)) base[id] = 50;
  impostaAllenamento(false);
  scegli('pensiero');
  const sez = document.getElementById('cruscotto');
  const ascolta = (el, tipo, fn) => { el.addEventListener(tipo, fn); return () => el.removeEventListener(tipo, fn); };
  const conAllenamento = document.querySelector('[data-allenato="si"]');
  guida({
    chiave: 'cruscotto',
    zona: sez,
    passi: [
      {
        bersaglio: '[data-strumento="emozione"]', testo: 'Tocca una parte, per esempio Emozioni', gesto: 'tocca',
        attendi: (avanti) => { const via = strumenti.map((x) => ascolta(x, 'click', avanti)); return () => via.forEach((f) => f()); },
        demo: () => { strumenti.find((x) => x.dataset.strumento === 'emozione')?.click(); }, demoDopo: 4500,
      },
      {
        bersaglio: '.pressione input', testo: 'Trascina la barra verso destra, fino al rosso', gesto: 'trascina',
        attendi: (avanti) => osserva(() => base[scelto] >= 84, avanti),
        demo: () => animaPiano(scelto, 94, 2), demoDopo: 5000,
      },
      { bersaglio: '.cruscotto-grid', testo: 'Guarda: la parte in rosso si trascina dietro anche le altre', durata: 3200 },
      {
        bersaglio: '[data-allenato="si"]', testo: 'Ora tocca “Dopo il percorso”', gesto: 'tocca',
        attendi: (avanti) => ascolta(conAllenamento, 'click', avanti),
        demo: () => conAllenamento.click(), demoDopo: 4500,
      },
      { bersaglio: '.cruscotto-grid', testo: 'Stessa spinta: la parte regge e le altre restano tranquille. Per questo le alleno insieme.', durata: 4000 },
    ],
    onFine: () => { demoTween?.kill(); },
  });
}
if (slider) {
  scegli('pensiero');
  const sez = document.getElementById('cruscotto');
  if (!giaVista('cruscotto') && !ridotto) quandoVisibile(sez, () => setTimeout(guidaCruscotto, 600), 0.5);
  sez?.querySelector('[data-guida="cruscotto"]')?.addEventListener('click', (e) => { e.stopPropagation(); setTimeout(guidaCruscotto, 50); });
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
    // su mobile le tappe scorrono di lato: il progresso segue lo scorrimento orizzontale
    const binario = tappe.parentElement;
    const suScorri = () => {
      const max = binario.scrollWidth - binario.clientWidth;
      segnaProgresso(max > 0 ? binario.scrollLeft / max : 1);
    };
    binario.addEventListener('scroll', suScorri, { passive: true });
    suScorri();
    return () => binario.removeEventListener('scroll', suScorri);
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
    esitoQuiz.querySelector('.quiz-titolo-esito').textContent = `La parte di te più sotto pressione: ${piani[top].nome}.`;
    const ESERCIZI = [
      'Un esercizio da provare: scrivi su un foglio i pensieri che girano, poi scegli un solo primo passo concreto.',
      'Un esercizio da provare: dai un nome a quello che senti ("è paura", "è rabbia"). Dargli un nome aiuta a gestirlo.',
      'Un esercizio da provare: stringi forte i pugni per 5 secondi, poi lascia andare. Senti la differenza.',
      'Un esercizio da provare: il respiro 4–6 qui sopra, per 30 secondi.',
    ];
    const es = esitoQuiz.querySelector('[data-quiz-esercizio]');
    if (es) es.textContent = `${ESERCIZI[top]} In un percorso lavoriamo su questa parte, senza trascurare le altre.`;
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

/* ======================================================================
   PERCHÉ LA PSICOLOGIA FUNZIONALE: il grattacielo
   Scorrendo: i piani salgono su una base sottile e oscillano;
   poi arrivano le fondamenta sui quattro piani e la torre si ferma.
   ====================================================================== */
const torreBox = document.querySelector('.torre-box');
if (torreBox) {
  const torre = torreBox.querySelector('.torre');
  const pianiTorre = [...torreBox.querySelectorAll('[data-piano]')];
  const fondi = [...torreBox.querySelectorAll('[data-fondo]')];
  const fase = torreBox.querySelector('[data-fase]');
  let prog = ridotto ? 1 : 0;
  let ampiezza = 0;
  let testo = '';
  function disegnaTorre(p) {
    const costruiti = clamp(0.25 + p / 0.5) * pianiTorre.length;
    pianiTorre.forEach((el, k) => el.classList.toggle('su', k < costruiti));
    const fondamenta = clamp((p - 0.5) / 0.25);
    fondi.forEach((el, k) => el.classList.toggle('su', fondamenta > k / fondi.length + 0.01));
    ampiezza = (costruiti / pianiTorre.length) * 4.5 * (1 - fondamenta);
    torreBox.classList.toggle('instabile', ampiezza > 2.2);
    torreBox.classList.toggle('stabile', fondamenta >= 0.99);
    torreBox.classList.toggle('con-piani', costruiti >= 1);
    torreBox.classList.toggle('con-fondamenta', fondamenta > 0);
    const nuovo = fondamenta >= 0.99 ? 'Con le fondamenta su tutte e 4 le parti di te, il palazzo resta in piedi.'
      : fondamenta > 0 ? 'Arrivano le fondamenta: testa, emozioni, corpo, respiro…'
      : costruiti >= 3 ? 'Su una base stretta, più sale e più traballa.'
      : 'Questo palazzo sono i tuoi obiettivi. Scorri e guarda.';
    if (nuovo !== testo) { testo = nuovo; fase.textContent = nuovo; }
  }
  disegnaTorre(prog);
  // PC: la frase più vicina al centro dello schermo è quella attiva e guida la costruzione
  // telefono: palazzo e scheda restano fermi; lo scorrimento sceglie la scheda (una ogni quarto di sezione)
  const passi = [...document.querySelectorAll('.passo')];
  const telefono = window.matchMedia('(max-width: 860px)');
  const attiva = (k) => passi.forEach((el, j) => el.classList.toggle('attivo', j === k));
  const segnaPasso = () => {
    if (telefono.matches) return;
    const centro = window.innerHeight * 0.5;
    let migliore = 0, dist = Infinity;
    passi.forEach((el, j) => { const r = el.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - centro); if (d < dist) { dist = d; migliore = j; } });
    attiva(migliore);
  };
  attiva(0);
  segnaPasso();
  window.addEventListener('scroll', segnaPasso, { passive: true });
  if (ridotto && !telefono.matches) passi.forEach((el) => el.classList.add('attivo'));
  const mmTorre = gsap.matchMedia();
  mmTorre.add('(max-width: 860px)', () => {
    const st = ScrollTrigger.create({
      trigger: '.storia', start: 'top 74px', end: 'bottom bottom',
      onUpdate: (x) => { attiva(Math.min(passi.length - 1, Math.floor(x.progress * passi.length))); prog = ridotto ? 1 : x.progress; disegnaTorre(prog); },
    });
    return () => st.kill();
  });
  if (!ridotto) {
    mmTorre.add('(min-width: 861px)', () => {
      const st = ScrollTrigger.create({
        trigger: '.passi', start: 'top 60%', end: 'bottom 75%', scrub: 0.5,
        onUpdate: (x) => { prog = x.progress; disegnaTorre(prog); },
      });
      return () => st.kill();
    });
    const oscilla = (t) => {
      const angolo = ampiezza * Math.sin(t / 1000 * 2.4) + ampiezza * 0.25 * Math.sin(t / 1000 * 5.3);
      torre.style.transform = `rotate(${angolo.toFixed(2)}deg)`;
      requestAnimationFrame(oscilla);
    };
    requestAnimationFrame(oscilla);
  }
}

/* ======================================================================
   TI RICONOSCI? — le frasi toccate accendono il messaggio e la prenotazione
   ====================================================================== */
const situazioni = [...document.querySelectorAll('.situazione')];
const esitoRiconosci = document.querySelector('[data-riconosci-esito]');
const $r = (k) => esitoRiconosci?.querySelector(`[data-riconosci-${k}]`);
let ordineScelte = [];
let esitoMostrato = false;
const TITOLI = [
  'Succede a tantissime persone. Ecco perché.',
  'Più cose insieme? È normale: le parti di te sono collegate.',
  'Tante cose insieme: vale la pena parlarne.',
];
situazioni.forEach((b) => b.addEventListener('click', () => {
  const acceso = b.getAttribute('aria-pressed') !== 'true';
  b.setAttribute('aria-pressed', String(acceso));
  ordineScelte = ordineScelte.filter((x) => x !== b);
  if (acceso) ordineScelte.push(b);
  if (!esitoRiconosci) return;
  esitoRiconosci.hidden = ordineScelte.length === 0;
  if (!ordineScelte.length) return;
  const n = ordineScelte.length;
  $r('titolo').textContent = TITOLI[n === 1 ? 0 : n <= 3 ? 1 : 2];
  // la risposta parla dell'ultima frase toccata
  const ultima = ordineScelte[n - 1];
  const risposta = $r('risposta');
  risposta.className = `riconosci-risposta p-${ultima.dataset.parte}`;
  void risposta.offsetWidth;
  risposta.classList.add('cambia');
  $r('quale').textContent = ultima.textContent.trim();
  $r('spiega').textContent = ultima.dataset.spiega;
  $r('lavoro').textContent = ultima.dataset.lavoro;
  // la mappa: quanto pesa ogni parte (2 frasi per parte)
  const conta = {};
  ordineScelte.forEach((x) => { conta[x.dataset.parte] = (conta[x.dataset.parte] || 0) + 1; });
  esitoRiconosci.querySelectorAll('[data-mappa]').forEach((li) => {
    const c = conta[li.dataset.mappa] || 0;
    li.classList.toggle('acceso', c > 0);
    li.querySelector('i').style.setProperty('--n', String(Math.min(1, c / 2)));
  });
  // il collegamento porta alla prova più utile: respiro se pesa il corpo, sfera se pesano testa ed emozioni
  const fisico = (conta.corpo || 0) + (conta.fisiologia || 0);
  const mentale = (conta.pensiero || 0) + (conta.emozione || 0);
  const link = $r('link');
  if (fisico > mentale) { link.href = '#respiro'; $r('link-testo').textContent = 'Prova subito: calmati in 30 secondi'; }
  else { link.href = '#mente'; $r('link-testo').textContent = 'Prova: cosa ti succede sotto pressione'; }
  // la prima volta, se la risposta resta fuori dallo schermo, la porta in vista
  if (!esitoMostrato) {
    esitoMostrato = true;
    requestAnimationFrame(() => {
      const r = esitoRiconosci.getBoundingClientRect();
      const extra = r.top + Math.min(r.height, window.innerHeight * 0.55) - window.innerHeight;
      if (extra > 0) {
        if (window.__lenis) window.__lenis.scrollTo(window.scrollY + extra + 16, { duration: 0.9 });
        else window.scrollBy({ top: extra + 16, behavior: 'smooth' });
      }
    });
  }
}));


/* ======================================================================
   RECENSIONI — nastro infinito: scorre da solo, si ferma col bottone,
   passandoci sopra o trascinandolo; "Leggi tutta" apre la recensione intera
   ====================================================================== */
const binarioRec = document.querySelector('[data-rec-binario]');
const nastroRec = document.querySelector('[data-rec-nastro]');
if (binarioRec && nastroRec) {
  const bottonePlay = document.querySelector('[data-rec-play]');
  const testoPlay = document.querySelector('[data-rec-play-testo]');
  const dialogo = document.querySelector('[data-rec-dialog]');
  const corpoDialogo = document.querySelector('[data-rec-dialog-corpo]');
  const VEL = 38; // px al secondo
  let x = 0;
  let periodo = 1;
  let passo = 400;
  let inCorsa = !ridotto;
  let sopra = false;
  let visibile = false;
  let tween = null;

  const misura = () => {
    const schede = nastroRec.children;
    const n = schede.length / 2;
    periodo = schede[n].offsetLeft - schede[0].offsetLeft;
    passo = schede[1].offsetLeft - schede[0].offsetLeft;
  };
  const avvolgi = () => {
    while (x <= -periodo) x += periodo;
    while (x > 0) x -= periodo;
  };
  const disegna = () => { avvolgi(); nastroRec.style.transform = `translate3d(${x}px,0,0)`; };
  const aggiornaPlay = () => {
    bottonePlay.classList.toggle('ferma', !inCorsa);
    testoPlay.textContent = inCorsa ? 'Ferma' : 'Fai scorrere';
    bottonePlay.setAttribute('aria-label', inCorsa ? 'Ferma lo scorrimento' : 'Fai scorrere le recensioni');
  };
  misura();
  window.addEventListener('resize', () => { misura(); disegna(); });
  aggiornaPlay();

  let prima = performance.now();
  const giro = (ora) => {
    const dt = Math.min(0.05, (ora - prima) / 1000);
    prima = ora;
    if (inCorsa && !sopra && !trascino && !tween && visibile && !dialogo.open) { x -= VEL * dt; disegna(); }
    requestAnimationFrame(giro);
  };
  requestAnimationFrame(giro);
  new IntersectionObserver(([v]) => { visibile = v.isIntersecting; }).observe(binarioRec);

  bottonePlay.addEventListener('click', () => { inCorsa = !inCorsa; aggiornaPlay(); });
  const sposta = (verso) => {
    inCorsa = false; aggiornaPlay();
    tween?.kill();
    // si ferma sempre a filo di una scheda
    const arrivo = Math.round((x - verso * passo) / passo) * passo;
    const stato = { x };
    tween = gsap.to(stato, { x: arrivo, duration: ridotto ? 0 : 0.6, ease: 'power3.out', onUpdate: () => { x = stato.x; disegna(); }, onComplete: () => { tween = null; } });
  };
  document.querySelector('[data-rec-prec]')?.addEventListener('click', () => sposta(-1));
  document.querySelector('[data-rec-succ]')?.addEventListener('click', () => sposta(1));

  // col mouse: passandoci sopra si ferma
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    binarioRec.addEventListener('mouseenter', () => { sopra = true; });
    binarioRec.addEventListener('mouseleave', () => { sopra = false; });
  }
  binarioRec.addEventListener('focusin', () => { sopra = true; });
  binarioRec.addEventListener('focusout', () => { sopra = false; });

  // trascinamento con dito o mouse
  let trascino = false;
  let inizio = null;
  let appenaTrascinato = false;
  binarioRec.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    tween?.kill(); tween = null;
    inizio = { px: e.clientX, py: e.clientY, x, id: e.pointerId };
  });
  binarioRec.addEventListener('pointermove', (e) => {
    if (!inizio || e.pointerId !== inizio.id) return;
    const dx = e.clientX - inizio.px;
    if (!trascino) {
      if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(e.clientY - inizio.py)) return;
      trascino = true;
      binarioRec.classList.add('trascina');
      binarioRec.setPointerCapture(e.pointerId);
    }
    x = inizio.x + dx;
    disegna();
  });
  const fineTrascino = () => {
    if (trascino) { appenaTrascinato = true; setTimeout(() => { appenaTrascinato = false; }, 0); }
    trascino = false; inizio = null;
    binarioRec.classList.remove('trascina');
  };
  binarioRec.addEventListener('pointerup', fineTrascino);
  binarioRec.addEventListener('pointercancel', fineTrascino);
  binarioRec.addEventListener('click', (e) => { if (appenaTrascinato) { e.preventDefault(); e.stopPropagation(); } }, true);

  // "Leggi tutta": la recensione intera in una finestra
  nastroRec.addEventListener('click', (e) => {
    const b = e.target.closest('[data-rec-apri]');
    if (!b) return;
    const li = b.closest('.recensione');
    const scheda = li.querySelector('.rec-scheda').cloneNode(true);
    scheda.querySelector('[data-rec-apri]')?.remove();
    scheda.querySelector('.rec-nome').id = 'rec-dialog-nome';
    corpoDialogo.className = `rec-dialog-corpo ${[...li.classList].find((c) => c.startsWith('p-')) || ''}`;
    corpoDialogo.replaceChildren(...scheda.childNodes);
    window.__lenis?.stop();
    dialogo.showModal();
  });
  dialogo.addEventListener('close', () => { window.__lenis?.start(); });
  dialogo.addEventListener('click', (e) => { if (e.target === dialogo) dialogo.close(); });
  document.querySelector('[data-rec-chiudi]')?.addEventListener('click', () => dialogo.close());
}
