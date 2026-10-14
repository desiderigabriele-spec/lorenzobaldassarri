// Scena 3D unica, fissa dietro i contenuti.
// Migliaia di punti = migliaia di dati. Tre forme, un significato:
//   SFERA  → la mente: si agita sotto pressione, si calma quando ti fermi, respira con te
//   ORBITE → i quattro piani del metodo (pensiero, emozione, corpo, fisiologia), integrati
//   PISTA  → un circuito a otto: dove il metodo è nato
// La forma segue un elemento "ancora" del layout: funziona uguale su desktop e mobile.
import * as THREE from 'three';

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const vertexShader = /* glsl */ `
uniform float uTime, uPressure, uBreath, uRing, uTrack, uSize, uPR;
uniform mat3 uRot[4];
attribute float aRingIdx, aAng, aT, aRand;
varying float vRand;
${NOISE}
vec3 pista(float t){ float s=sin(t), c=cos(t); float d=1.0+s*s; return vec3(1.0*c/d, 0.0, 0.72*s*c/d); }
void main(){
  // SFERA: rumore lento a riposo, turbolenza sotto pressione, respiro
  vec3 sfera = position;
  float n  = snoise(sfera*1.6 + vec3(uTime*0.18));
  float n2 = snoise(sfera*4.2 + vec3(uTime*0.9));
  sfera *= (1.0 + n*(0.035 + uPressure*0.42) + n2*uPressure*0.1) * (1.0 + uBreath*0.24);

  // ORBITE: quattro anelli inclinati, i punti scorrono lungo l'anello
  int k = int(aRingIdx + 0.5);
  float ang = aAng + uTime*(0.12 + 0.05*float(k));
  float R = 1.08 + (aRand-0.5)*0.05;
  vec3 anello = vec3(cos(ang)*R, sin(ang)*R, (aRand-0.5)*0.03);
  mat3 rot = uRot[0];
  if (k == 1) rot = uRot[1]; else if (k == 2) rot = uRot[2]; else if (k == 3) rot = uRot[3];
  anello = rot * anello;
  anello *= 1.0 + sin(uTime*2.6 + aRand*40.0) * (0.01 + uPressure*0.16);

  // PISTA: lemniscata (circuito a otto) che scorre, inclinata verso chi guarda
  float t = aT + uTime*0.045;
  vec3 pt = pista(t) * 2.1;
  pt += vec3(sin(aRand*61.0), (aRand-0.5)*0.4, cos(aRand*47.0)) * 0.035;
  float cx = cos(1.05), sx = sin(1.05);
  pt = vec3(pt.x, pt.y*cx - pt.z*sx, pt.y*sx + pt.z*cx);

  vec3 p = mix(sfera, anello, uRing);
  p = mix(p, pt, uTrack);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPR * (0.5 + aRand*0.9) / -mv.z;
  vRand = aRand;
}`;

const fragmentShader = /* glsl */ `
uniform vec3 uColor, uAccent;
uniform float uOpacity, uPressure;
varying float vRand;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.12, d);
  float quota = smoothstep(0.62, 1.0, vRand) * (0.3 + uPressure*0.7);
  gl_FragColor = vec4(mix(uColor, uAccent, quota), a*uOpacity);
}`;

// Parametri per stato: estensione della forma rispetto all'ancora e opacità
const STATI = {
  hero:      { ring: 0, track: 0, fit: 1.0,  opacity: 1.0 },
  respiro:   { ring: 0, track: 0, fit: 1.3,  opacity: 1.0 },
  cruscotto: { ring: 1, track: 0, fit: 1.12, opacity: 0.9 },
  pista:     { ring: 0, track: 1, fit: 2.1,  opacity: 0.6, base: 'w' },
  chiusura:  { ring: 0, track: 0, fit: 1.0,  opacity: 0.85 },
};
const COLORI = {
  carta:     { base: new THREE.Color('#12161C'), accento: new THREE.Color('#B33616') },
  cruscotto: { base: new THREE.Color('#5BE3C1'), accento: new THREE.Color('#FF6A3D') },
};

export function avviaScena(canvas, segnali) {
  const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 820px)').matches;
  const debole = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  } catch (_) {
    return null; // niente WebGL: il sito resta completo senza 3D
  }
  const pr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75);
  renderer.setPixelRatio(pr);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.z = 6;
  const altezzaMondo = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));

  // ---------- Geometria ----------
  const N = mobile ? (debole ? 4200 : 6500) : (debole ? 9000 : 15000);
  const pos = new Float32Array(N * 3);
  const ringIdx = new Float32Array(N);
  const ang = new Float32Array(N);
  const tt = new Float32Array(N);
  const rnd = new Float32Array(N);
  const aureo = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (2 * (i + 0.5)) / N;
    const r = Math.sqrt(1 - y * y);
    const phi = i * aureo;
    pos[i * 3] = Math.cos(phi) * r;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = Math.sin(phi) * r;
    ringIdx[i] = i % 4;
    ang[i] = Math.random() * Math.PI * 2;
    tt[i] = (i / N) * Math.PI * 2 + Math.random() * 0.01;
    rnd[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aRingIdx', new THREE.BufferAttribute(ringIdx, 1));
  geo.setAttribute('aAng', new THREE.BufferAttribute(ang, 1));
  geo.setAttribute('aT', new THREE.BufferAttribute(tt, 1));
  geo.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1));

  const rot = (x, y, z) => new THREE.Matrix3().setFromMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(x, y, z)));
  const uniforms = {
    uTime: { value: 0 },
    uPressure: { value: 0 },
    uBreath: { value: 0 },
    uRing: { value: 0 },
    uTrack: { value: 0 },
    uSize: { value: mobile ? 13 : 15 },
    uPR: { value: pr },
    uOpacity: { value: 0 },
    uColor: { value: COLORI.carta.base.clone() },
    uAccent: { value: COLORI.carta.accento.clone() },
    uRot: { value: [rot(Math.PI / 2, 0, 0), rot(Math.PI / 2, Math.PI / 2, 0), rot(Math.PI / 4, 0, Math.PI / 4), rot(-Math.PI / 4, 0, -Math.PI / 4)] },
  };
  const mat = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true, depthWrite: false });
  const punti = new THREE.Points(geo, mat);
  const gruppo = new THREE.Group();
  gruppo.add(punti);
  scene.add(gruppo);

  // ---------- Dimensioni ----------
  let W = 0, H = 0;
  function ridimensiona() {
    W = window.innerWidth; H = window.innerHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  }
  ridimensiona();
  window.addEventListener('resize', ridimensiona);

  // ---------- Stato attivo dalla sezione al centro dello schermo ----------
  const sezioni = [...document.querySelectorAll('[data-stato]')];
  function statoAttivo() {
    const c = H * 0.5;
    for (const s of sezioni) {
      const r = s.getBoundingClientRect();
      if (r.top <= c && r.bottom >= c) return s;
    }
    return null;
  }

  // ---------- Parallasse del puntatore ----------
  const mira = { x: 0, y: 0 };
  window.addEventListener('pointermove', (e) => {
    mira.x = (e.clientX / W - 0.5) * 2;
    mira.y = (e.clientY / H - 0.5) * 2;
  }, { passive: true });

  // ---------- Ciclo ----------
  const corrente = { x: 0, y: 0, s: 1, ring: 0, track: 0, opacity: 0 };
  let ultimaSezione = null;
  let tempo = 0;
  let prec = performance.now();
  let attiva = true;
  document.addEventListener('visibilitychange', () => { attiva = !document.hidden; if (attiva) { prec = performance.now(); requestAnimationFrame(ciclo); } });

  function ciclo(ora) {
    if (!attiva) return;
    const dt = Math.min((ora - prec) / 1000, 0.05);
    prec = ora;
    tempo += dt * (ridotto ? 0.2 : 1);

    const sez = statoAttivo();
    const nome = sez?.dataset.stato;
    const st = STATI[nome];
    const ancora = sez?.querySelector('[data-ancora]');
    const tema = sez?.dataset.theme || 'carta';
    const wpp = altezzaMondo / H; // unità di mondo per pixel

    let target = { ...corrente, opacity: 0.08 };
    if (st && ancora) {
      const r = ancora.getBoundingClientRect();
      const visibile = r.bottom > 0 && r.top < H;
      target = {
        x: (r.left + r.width / 2 - W / 2) * wpp,
        y: -(r.top + r.height / 2 - H / 2) * wpp,
        s: ((st.base === 'w' ? r.width : Math.min(r.width, r.height)) / 2) * wpp / st.fit,
        ring: st.ring,
        track: st.track,
        opacity: visibile ? st.opacity : 0.08,
      };
      ultimaSezione = sez;
    } else if (ultimaSezione) {
      // tra una scena e l'altra la forma resta, quasi trasparente, per non disturbare la lettura
      target.opacity = 0.07;
    }

    const k = ridotto ? 1 : 1 - Math.pow(0.0025, dt); // inseguimento morbido, curva "respiro"
    const km = ridotto ? 1 : 1 - Math.pow(0.02, dt);
    corrente.x += (target.x - corrente.x) * k;
    corrente.y += (target.y - corrente.y) * k;
    corrente.s += (target.s - corrente.s) * k;
    corrente.ring += (target.ring - corrente.ring) * km;
    corrente.track += (target.track - corrente.track) * km;
    corrente.opacity += (target.opacity - corrente.opacity) * km;

    const pal = COLORI[tema] || COLORI.carta;
    uniforms.uColor.value.lerp(pal.base, km);
    uniforms.uAccent.value.lerp(pal.accento, km);

    const pressione = nome === 'cruscotto' ? segnali.cruscotto : segnali.pressione;
    uniforms.uPressure.value += (pressione - uniforms.uPressure.value) * (1 - Math.pow(0.01, dt));
    uniforms.uBreath.value = segnali.respiro;
    uniforms.uRing.value = corrente.ring;
    uniforms.uTrack.value = corrente.track;
    uniforms.uOpacity.value = corrente.opacity;
    uniforms.uTime.value = tempo;

    gruppo.position.set(corrente.x, corrente.y, 0);
    gruppo.scale.setScalar(Math.max(corrente.s, 0.001));
    // la pista resta di fronte a chi guarda; sfera e orbite ruotano lentamente
    const libero = 1 - corrente.track;
    gruppo.rotation.y = tempo * 0.08 * libero + mira.x * 0.18 + corrente.track * Math.sin(tempo * 0.3) * 0.12;
    gruppo.rotation.x = mira.y * 0.12 + Math.sin(tempo * 0.2) * 0.05;

    renderer.render(scene, camera);
    requestAnimationFrame(ciclo);
  }
  requestAnimationFrame(ciclo);
  requestAnimationFrame(() => canvas.classList.add('pronta'));
  return { uniforms };
}
