// Comportamenti comuni a tutte le pagine: scroll morbido, header adattivo,
// menu mobile, barra CTA, comparse, personalizzazione delle CTA.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ctaPerPorta } from '../data/sito.js';

gsap.registerPlugin(ScrollTrigger);

const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;

/* ---------- Scroll morbido (solo desktop, mai con reduced motion) ---------- */
let lenis = null;
if (!ridotto && window.matchMedia('(pointer: fine)').matches) {
  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 3) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  // Ancore interne con lo stesso scroll morbido
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el, { offset: -72 });
  });
}
window.__lenis = lenis;

/* ---------- Header: colore secondo la sezione sotto, compatto, a scomparsa ---------- */
const header = document.querySelector('.site-header');
const sezioniTema = [...document.querySelectorAll('[data-theme]')];
function aggiornaHeader() {
  const y = 36; // linea di lettura sotto l'header
  let tema = 'carta';
  for (const s of sezioniTema) {
    const r = s.getBoundingClientRect();
    if (r.top <= y && r.bottom > y) { tema = s.dataset.theme; }
  }
  header.dataset.on = tema;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = tema === 'cruscotto' ? '#0B1230' : '#FAF8F4';
}
let ultimoY = window.scrollY;
function suScroll() {
  const yy = window.scrollY;
  header.classList.toggle('compatto', yy > 40);
  const giu = yy > ultimoY + 4;
  const su = yy < ultimoY - 4;
  if (giu && yy > 400 && !root.classList.contains('menu-aperto')) header.classList.add('nascosto');
  if (su) header.classList.remove('nascosto');
  ultimoY = yy;
  aggiornaHeader();
}
window.addEventListener('scroll', suScroll, { passive: true });

/* ---------- Menu mobile ---------- */
const toggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('menu-mobile');
function chiudiMenu() {
  root.classList.remove('menu-aperto');
  toggle?.setAttribute('aria-expanded', 'false');
  menu?.setAttribute('inert', '');
  lenis?.start();
}
toggle?.addEventListener('click', () => {
  const aperto = root.classList.toggle('menu-aperto');
  toggle.setAttribute('aria-expanded', String(aperto));
  if (aperto) { menu.removeAttribute('inert'); header.classList.remove('nascosto'); lenis?.stop(); }
  else chiudiMenu();
});
menu?.addEventListener('click', (e) => { if (e.target.closest('a')) chiudiMenu(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && root.classList.contains('menu-aperto')) { chiudiMenu(); toggle.focus(); } });

/* ---------- Comparse ---------- */
const io = new IntersectionObserver((voci) => {
  for (const v of voci) if (v.isIntersecting) { v.target.classList.add('visto'); io.unobserve(v.target); }
}, { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

/* ---------- Personalizzazione: la porta scelta adatta le CTA ---------- */
export function applicaPorta(id) {
  const cta = ctaPerPorta[id];
  if (!cta) return;
  document.querySelectorAll('[data-cta]').forEach((a) => {
    a.textContent = cta.label;
    a.setAttribute('href', cta.href);
  });
}
let porta = null;
try { porta = sessionStorage.getItem('lb-porta'); } catch (_) { /* storage non disponibile */ }
if (porta) applicaPorta(porta);
window.__applicaPorta = (id) => {
  try { sessionStorage.setItem('lb-porta', id); } catch (_) {}
  applicaPorta(id);
};

suScroll();
window.addEventListener('load', () => ScrollTrigger.refresh());

/* ---------- Menu a tendina "Percorsi" ---------- */
const gruppo = document.querySelector('.nav-gruppo');
const apri = gruppo?.querySelector('.nav-apri');
function chiudiPercorsi() { gruppo?.classList.remove('aperto'); apri?.setAttribute('aria-expanded', 'false'); }
apri?.addEventListener('click', () => {
  const aperto = gruppo.classList.toggle('aperto');
  apri.setAttribute('aria-expanded', String(aperto));
});
document.addEventListener('click', (e) => { if (gruppo && !gruppo.contains(e.target)) chiudiPercorsi(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && gruppo?.classList.contains('aperto')) { chiudiPercorsi(); apri.focus(); } });
