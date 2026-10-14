// Fonte unica dei contenuti condivisi. I valori tra [ ] vanno confermati: vedi DA-CONFERMARE.md

export const contatti = {
  indirizzo: 'Via dei Colombi',
  citta: '51016 Montecatini Terme (PT)',
  albo: '6292 [da confermare]',
  piva: '[da inserire]',
  telefono: '+39 346 856 4025',
  whatsapp: '393468564025',
  volto: '/img/lorenzo-volto.jpg',
  // Ritratto: mettere il file in public/img/ e scrivere qui il percorso, es. '/img/lorenzo.jpg'
  // (verticale 4:5, almeno 1200×1500 px, sguardo rivolto verso sinistra, cioè verso il titolo)
  foto: '/img/lorenzo-studio.jpg', // provvisoria 512×512: serve l'originale ad alta risoluzione
};

// Come si presenta: titoli da mettere in evidenza ovunque
export const identita = {
  nome: 'Dott. Lorenzo Baldassarri',
  ruolo: 'Psicologo esperto di performance',
  ruoloBreve: 'Psicologo · Esperto di performance',
  metodo: 'Psicologia del Potenziamento®',
  mindup: {
    nome: 'MindUP Enhancement Psychology®',
    sito: 'https://www.mindup.live/',
    // Logo ufficiale: metterlo in public/img/ e scrivere qui il percorso, es. '/img/mindup-logo.svg'.
    // Finché è null si vede un segnaposto tipografico.
    logo: null,
  },
};

// Le cinque "porte": una per pubblico, una sola azione principale ciascuna.
export const porte = [
  {
    id: 'atleti',
    href: '/psicologo-dello-sport',
    menu: 'Atleti e famiglie',
    porta: 'Gareggio',
    sotto: 'Atleti e famiglie',
    riga: 'Concentrazione, paura di sbagliare, pressione della gara. Dal giovanile al professionismo.',
    cta: { label: 'Prenota una call', href: '/contatti?per=atleti' },
  },
  {
    id: 'squadre',
    href: '/squadre-e-societa',
    menu: 'Squadre e società',
    porta: 'Guido un gruppo',
    sotto: 'Squadre e società',
    riga: 'Psicologo di società, formazione di staff, progetti per i settori giovanili.',
    cta: { label: 'Richiedi una proposta', href: '/contatti?per=squadre' },
  },
  {
    id: 'aziende',
    href: '/aziende-e-leader',
    menu: 'Aziende e leader',
    porta: "Guido un'azienda",
    sotto: 'Aziende e leader',
    riga: 'Lucidità, energia e decisioni sotto pressione, con un metodo nato in pista.',
    cta: { label: 'Richiedi una proposta', href: '/contatti?per=aziende' },
  },
  {
    id: 'motorsport',
    href: '/motorsport',
    menu: 'Motorsport',
    porta: 'Corro in pista',
    sotto: 'Motorsport',
    riga: 'Dal kart alla Formula: il metodo è nato qui.',
    cta: { label: 'Prenota una call', href: '/contatti?per=motorsport' },
  },
  {
    id: 'psicoterapia',
    href: '/psicoterapia',
    menu: 'Psicoterapia',
    porta: 'Cerco aiuto per me',
    sotto: 'Psicoterapia',
    riga: 'Ansia e stress che pesano ogni giorno. Nello studio di Montecatini Terme o online.',
    cta: { label: 'Prenota una prima visita', href: '/contatti?per=psicoterapia' },
  },
];

export const piani = [
  { id: 'pensiero', nome: 'Pensiero', piano: 'Cognitivo', esempio: 'Concentrazione, decisioni, dialogo interno.' },
  { id: 'emozione', nome: 'Emozione', piano: 'Emotivo', esempio: 'Paura di sbagliare, rabbia, fiducia.' },
  { id: 'corpo', nome: 'Corpo', piano: 'Muscolare-posturale', esempio: 'Tensione, postura, scioltezza del gesto.' },
  { id: 'fisiologia', nome: 'Fisiologia', piano: 'Fisiologico', esempio: 'Battito, respiro, variabilità cardiaca (HRV).' },
];

// Contenuti delle pagine-porta di performance
export const paginePorta = {
  'psicologo-dello-sport': {
    id: 'atleti',
    title: 'Psicologo dello sport per atleti e famiglie — Lorenzo Baldassarri',
    description: 'Preparazione mentale per atleti di ogni livello e per i genitori che li accompagnano. Lorenzo Baldassarri, psicologo dello sport a Montecatini Terme e online.',
    eyebrow: 'Psicologo dello sport',
    h1: 'La testa è parte del gesto.',
    lead: 'Per atleti di ogni livello e per i genitori che li accompagnano. Dal settore giovanile al professionismo.',
    alleniamo: [
      { piano: 'pensiero', titolo: 'Concentrazione', testo: 'Restare sul compito quando tutto spinge a distrarsi.' },
      { piano: 'emozione', titolo: 'Paura di sbagliare', testo: "Trasformare l'errore in informazione, non in freno." },
      { piano: 'corpo', titolo: 'Scioltezza', testo: 'Sciogliere la tensione che irrigidisce il gesto.' },
      { piano: 'fisiologia', titolo: 'Recupero', testo: 'Respiro e battito al servizio della prestazione.' },
    ],
    formati: ['Percorso individuale', 'Valutazione sui quattro piani', 'Incontri per genitori'],
    prove: [
      { dato: '20+', testo: 'anni nel calcio, da giocatore e allenatore di Scuola Calcio' },
      { dato: '2013–16', testo: 'responsabile area mental in Formula Medicine' },
      { dato: 'F.I.R.', testo: "psicologi referenti dell'academy toscana di rugby" },
    ],
    nota: 'Con i minorenni lavoro sempre con il consenso dei genitori, e li coinvolgo nel percorso.',
    tema: 'carta',
  },
  'squadre-e-societa': {
    id: 'squadre',
    title: 'Psicologo per squadre e società sportive — Lorenzo Baldassarri',
    description: 'Psicologo di società, formazione di staff e allenatori, progetti educativi per i settori giovanili. Lorenzo Baldassarri, psicologo dello sport.',
    eyebrow: 'Società sportive e federazioni',
    h1: 'Una squadra pensa insieme.',
    lead: 'Psicologo di società, formazione di staff e allenatori, progetti per i settori giovanili.',
    alleniamo: [
      { piano: 'pensiero', titolo: 'Obiettivi condivisi', testo: 'Un linguaggio comune tra staff e atleti.' },
      { piano: 'emozione', titolo: 'Clima di gruppo', testo: 'Gestire tensioni, sconfitte e momenti difficili.' },
      { piano: 'corpo', titolo: 'Crescita completa', testo: 'La persona accanto al gesto tecnico e atletico.' },
      { piano: 'fisiologia', titolo: 'Carichi e recupero', testo: 'Leggere i segnali di stress prima che diventino problemi.' },
    ],
    formati: ['Psicologo di società', 'Formazione per allenatori e staff', 'Progetto educativo per settori giovanili'],
    prove: [
      { dato: 'F.I.R.', testo: "psicologi referenti dell'academy toscana della Federazione Italiana Rugby" },
      { dato: 'Giovanili', testo: 'responsabile educativo, con un progetto di inclusione presentato a Pistoia' },
      { dato: 'Oggi', testo: "nell'organigramma di società calcistiche dilettantistiche" },
    ],
    nota: 'Ogni progetto parte da un incontro con la dirigenza e da una valutazione del contesto.',
    tema: 'carta',
  },
  'aziende-e-leader': {
    id: 'aziende',
    title: 'Mental training per aziende e leader — Lorenzo Baldassarri',
    description: 'Lucidità, energia e decisioni sotto pressione per dirigenti, manager e imprenditori, con il Protocollo Funzionale Integrato.',
    eyebrow: 'Dirigenti, manager, imprenditori',
    h1: 'Decidere bene, sotto pressione.',
    lead: 'Il metodo nato nel motorsport, adattato a chi guida persone e decisioni.',
    alleniamo: [
      { piano: 'pensiero', titolo: 'Lucidità', testo: 'Decisioni chiare quando il tempo stringe.' },
      { piano: 'emozione', titolo: 'Tensioni', testo: 'Conflitti e incertezza, senza perdere la rotta.' },
      { piano: 'corpo', titolo: 'Energia', testo: 'Sostenere il ritmo nel lungo periodo.' },
      { piano: 'fisiologia', titolo: 'Recupero', testo: 'Misurare lo stress, non solo percepirlo.' },
    ],
    formati: ['Percorsi individuali', 'Workshop per team', 'Interventi e keynote'],
    prove: [
      { dato: 'KM2025', testo: 'relatore all\'Industry Day, Università di Siena' },
      { dato: 'Dal 2017', testo: 'docente all\'Università degli Studi di Parma' },
      { dato: 'MindUP', testo: 'co-fondatore di MindUP Enhancement Psychology®' },
    ],
    nota: 'Per le aziende i progetti si sviluppano con MindUP Enhancement Psychology®.',
    tema: 'carta',
  },
  motorsport: {
    id: 'motorsport',
    title: 'Psicologo per il motorsport e preparazione mentale dei piloti — Lorenzo Baldassarri',
    description: 'Preparazione mentale per piloti, famiglie e team, dal kart alla Formula. Il metodo di Lorenzo Baldassarri è nato in pista.',
    eyebrow: 'Piloti, team, academy',
    h1: 'Il metodo è nato in pista.',
    lead: 'Dal kart alla Formula: preparazione mentale per piloti, famiglie e team.',
    alleniamo: [
      { piano: 'pensiero', titolo: 'Qualifica', testo: 'Un giro, zero margine: attenzione al punto giusto.' },
      { piano: 'emozione', titolo: 'Paura e rabbia', testo: 'Dopo un contatto, tornare subito sul ritmo.' },
      { piano: 'corpo', titolo: 'Tensione al volante', testo: 'Mani e spalle sciolte, guida più precisa.' },
      { piano: 'fisiologia', titolo: 'Battito in gara', testo: 'Respiro e frequenza cardiaca sotto controllo.' },
    ],
    formati: ['Valutazione mentale del pilota', 'Percorso stagionale', 'Camp per academy e team'],
    prove: [
      { dato: '2013–16', testo: 'responsabile area mental in Formula Medicine: piloti di Formula 1 e DTM' },
      { dato: 'F4 · Regional', testo: 'camp di valutazione per piloti (MindUP)' },
      { dato: 'RPM', testo: 'MindUP è nella rete del motorsport italiano RPM Italia' },
    ],
    nota: 'I nomi dei piloti seguiti restano riservati, salvo loro esplicita autorizzazione.',
    tema: 'cruscotto',
  },
};

export const ctaPerPorta = Object.fromEntries(porte.map((p) => [p.id, p.cta]));
