// Chat di contatto: WhatsApp diretto oppure richiesta guidata per farsi ricontattare.
// L'invio della richiesta passa da WhatsApp con il messaggio già compilato
// (finché non c'è un endpoint per l'email: vedi DA-CONFERMARE.md).

const radice = document.querySelector('[data-chat]');
if (radice) avvia(radice);

function avvia(radice) {
  const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const numero = radice.dataset.wa;
  const pannello = radice.querySelector('.chat-pannello');
  const bolla = radice.querySelector('[data-chat-apri]');
  const chiudi = radice.querySelector('[data-chat-chiudi]');
  const corpo = radice.querySelector('[data-chat-corpo]');
  const azioni = radice.querySelector('[data-chat-azioni]');
  const invito = radice.querySelector('[data-chat-invito]');
  let avviata = false;

  const wa = (testo) => `https://wa.me/${numero}?text=${encodeURIComponent(testo)}`;
  const pausa = (ms) => new Promise((r) => setTimeout(r, ridotto ? 0 : ms));
  const scorri = () => { corpo.scrollTop = corpo.scrollHeight; };

  function apri() {
    pannello.hidden = false;
    radice.classList.add('chat-aperta');
    bolla.setAttribute('aria-expanded', 'true');
    if (invito) invito.hidden = true;
    try { sessionStorage.setItem('lb-chat-vista', '1'); } catch (_) {}
    if (!avviata) { avviata = true; benvenuto(); }
    else azioni.querySelector('button, a, input, textarea')?.focus();
  }
  function chiudiChat() {
    pannello.hidden = true;
    radice.classList.remove('chat-aperta');
    bolla.setAttribute('aria-expanded', 'false');
    bolla.focus();
  }
  bolla.addEventListener('click', () => (pannello.hidden ? apri() : chiudiChat()));
  chiudi.addEventListener('click', chiudiChat);
  invito?.addEventListener('click', apri);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pannello.hidden) chiudiChat(); });

  // Invito discreto dopo qualche secondo, una sola volta per visita
  let vista = false;
  try { vista = sessionStorage.getItem('lb-chat-vista') === '1'; } catch (_) {}
  if (!vista && invito) setTimeout(() => {
    if (!pannello.hidden) return;
    invito.hidden = false;
    setTimeout(() => { invito.hidden = true; }, 8000);
  }, 6000);

  /* ---------- messaggi ---------- */
  async function lui(testo) {
    const scrive = document.createElement('div');
    scrive.className = 'msg msg-lui';
    scrive.innerHTML = '<span class="msg-scrive" aria-label="Sta scrivendo"><span></span><span></span><span></span></span>';
    corpo.append(scrive); scorri();
    await pausa(450 + Math.min(testo.length * 12, 700));
    scrive.textContent = testo;
    scorri();
  }
  function tu(testo) {
    const m = document.createElement('div');
    m.className = 'msg msg-tu';
    m.textContent = testo;
    corpo.append(m); scorri();
  }
  function pulisci() { azioni.replaceChildren(); }

  function chiediScelta(opzioni) {
    return new Promise((risolvi) => {
      pulisci();
      const box = document.createElement('div');
      box.className = 'scelte';
      opzioni.forEach((o) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'scelta'; b.textContent = o;
        b.addEventListener('click', () => { pulisci(); tu(o); risolvi(o); });
        box.append(b);
      });
      azioni.append(box);
      box.querySelector('button')?.focus({ preventScroll: true });
    });
  }

  function chiediTesto({ segnaposto, tipo = 'text', lungo = false, opzionale = false, valida = null, autocompl = 'off' }) {
    return new Promise((risolvi) => {
      pulisci();
      const form = document.createElement('form');
      form.className = 'chat-campo';
      const campo = document.createElement(lungo ? 'textarea' : 'input');
      if (!lungo) campo.type = tipo;
      if (lungo) campo.rows = 2;
      campo.placeholder = segnaposto;
      campo.setAttribute('aria-label', segnaposto);
      campo.autocomplete = autocompl;
      const invia = document.createElement('button');
      invia.type = 'submit'; invia.className = 'invia'; invia.setAttribute('aria-label', 'Invia');
      invia.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20l18-8L3 4v6l12 2-12 2z"/></svg>';
      form.append(campo, invia);
      const errore = document.createElement('p');
      errore.className = 'chat-errore'; errore.setAttribute('role', 'alert');
      azioni.append(form, errore);
      if (opzionale) {
        const salta = document.createElement('button');
        salta.type = 'button'; salta.className = 'salta'; salta.textContent = 'Preferisco dirlo a voce';
        salta.addEventListener('click', () => { pulisci(); tu('Preferisco dirlo a voce'); risolvi(''); });
        azioni.append(salta);
      }
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const v = campo.value.trim();
        if (!v && !opzionale) { errore.textContent = 'Scrivi qui la risposta per andare avanti.'; return; }
        if (v && valida) { const msg = valida(v); if (msg) { errore.textContent = msg; return; } }
        pulisci(); if (v) tu(v); risolvi(v);
      });
      if (lungo) campo.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
      campo.focus({ preventScroll: true });
    });
  }

  /* ---------- percorsi ---------- */
  async function benvenuto() {
    await lui('Ciao, sono Lorenzo.');
    await lui('Come preferisci contattarmi?');
    mostraStrade();
  }

  function mostraStrade() {
    pulisci();
    const call = document.createElement('button');
    call.type = 'button'; call.className = 'grande grande-call';
    call.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v14H4zM4 10h16M8 3v5M16 3v5"/></svg><span>Prenota una call conoscitiva<small>Scegli tu quando: meno di un minuto</small></span>';
    call.addEventListener('click', () => { pulisci(); tu('Prenota una call conoscitiva'); modulo(); });
    const a = document.createElement('a');
    a.className = 'grande grande-wa';
    a.href = wa('Ciao Lorenzo, ti scrivo dal tuo sito.');
    a.target = '_blank'; a.rel = 'noopener';
    a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.8-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3z"/></svg><span>Scrivimi su WhatsApp<small>Si apre la chat con il messaggio iniziato</small></span>';
    const tel = document.createElement('a');
    tel.className = 'chat-tel';
    tel.href = `tel:+${numero}`;
    tel.textContent = 'Oppure chiamami ora';
    azioni.append(call, a, tel);
    call.focus({ preventScroll: true });
  }

  async function modulo() {
    const r = {};
    await lui('Perfetto, organizziamo una call. Di cosa vorresti parlare?');
    r.per = await chiediScelta(['Sono un atleta o un genitore', 'Squadra o società sportiva', 'Azienda o ruolo da leader', 'Motorsport', 'Supporto psicologico per me', 'Altro']);
    await lui('Raccontami in due righe di cosa hai bisogno.');
    r.bisogno = await chiediTesto({ segnaposto: 'Per esempio: ansia prima delle gare', lungo: true, opzionale: true });
    await lui('Come ti chiami?');
    r.nome = await chiediTesto({ segnaposto: 'Nome e cognome', autocompl: 'name' });
    await lui(`Piacere, ${r.nome.split(' ')[0]}. Dove preferisci fare la call?`);
    r.modo = await chiediScelta(['Telefono', 'Videochiamata WhatsApp', 'Email per accordarci']);
    if (r.modo.startsWith('Email')) {
      await lui('Lasciami la tua email.');
      r.recapito = await chiediTesto({ segnaposto: 'nome@esempio.it', tipo: 'email', autocompl: 'email', valida: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Questa email non sembra completa: controlla e riprova.') });
    } else {
      await lui('Lasciami il tuo numero.');
      r.recapito = await chiediTesto({ segnaposto: '+39 ...', tipo: 'tel', autocompl: 'tel', valida: (v) => (v.replace(/\D/g, '').length >= 8 ? '' : 'Il numero sembra troppo corto: controlla e riprova.') });
    }
    await lui('Quando ti è più comodo essere chiamato?');
    r.quando = await chiediScelta(['Mattina', 'Pomeriggio', 'Sera', 'Indifferente']);
    await lui('Ecco il riepilogo. Se va bene, invialo.');
    riepilogo(r);
  }

  function riepilogo(r) {
    const card = document.createElement('div');
    card.className = 'msg msg-riepilogo';
    const righe = [['Motivo', r.per], ['Richiesta', r.bisogno || 'Ne parliamo a voce'], ['Nome', r.nome], ['Call', `${r.modo} · ${r.recapito}`], ['Quando', r.quando]];
    const dl = document.createElement('dl');
    righe.forEach(([k, v]) => { const dt = document.createElement('dt'); dt.textContent = k; const dd = document.createElement('dd'); dd.textContent = v; dl.append(dt, dd); });
    card.append(dl);
    corpo.append(card); scorri();

    const testo = ['Ciao Lorenzo, ti scrivo dal tuo sito per prenotare una call conoscitiva.', ...righe.map(([k, v]) => `${k}: ${v}`)].join('\n');
    pulisci();
    const consenso = document.createElement('label');
    consenso.className = 'chat-consenso';
    consenso.innerHTML = '<input type="checkbox" /> <span>Acconsento al trattamento dei miei dati per essere ricontattato (<a href="/privacy">informativa</a>).</span>';
    const invia = document.createElement('a');
    invia.className = 'grande grande-wa';
    invia.href = wa(testo); invia.target = '_blank'; invia.rel = 'noopener';
    invia.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20l18-8L3 4v6l12 2-12 2z"/></svg><span>Invia la prenotazione<small>Si apre WhatsApp con il messaggio pronto</small></span>';
    const errore = document.createElement('p');
    errore.className = 'chat-errore'; errore.setAttribute('role', 'alert');
    const ricomincia = document.createElement('button');
    ricomincia.type = 'button'; ricomincia.className = 'salta'; ricomincia.textContent = 'Ricomincia';
    ricomincia.addEventListener('click', () => { corpo.replaceChildren(); pulisci(); benvenuto(); });
    invia.addEventListener('click', async (e) => {
      if (!consenso.querySelector('input').checked) { e.preventDefault(); errore.textContent = 'Per inviare serve il consenso al trattamento dei dati.'; return; }
      pulisci();
      await lui('Grazie! Su WhatsApp trovi il messaggio già scritto: premi Invia e ti richiamo io per fissare la call.');
      const ancora = document.createElement('button');
      ancora.type = 'button'; ancora.className = 'salta'; ancora.textContent = 'Nuova richiesta';
      ancora.addEventListener('click', () => { corpo.replaceChildren(); pulisci(); benvenuto(); });
      azioni.append(ancora);
    });
    azioni.append(consenso, invia, errore, ricomincia);
    consenso.querySelector('input').focus({ preventScroll: true });
  }
}
