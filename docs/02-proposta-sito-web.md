# Proposta — il miglior sito web per Lorenzo Baldassarri

> Versione 0.2 · 14 ottobre 2026 · basata sul [dossier](01-dossier-lorenzo-baldassarri.md) e sul [materiale fornito](fonti/01-materiale-fornito-dall-utente.md).
> Stato: **strategia e progetto**, non ancora codice. Il prototipo Base44 indicato non è stato visto (dominio bloccato), quindi la proposta non lo tiene in considerazione: vedi §15.

---

## 1. La raccomandazione in 60 secondi

1. **Un sito "hub" personale** su `lorenzobaldassarri.it`, che sostituisce l'attuale WordPress e diventa la fonte canonica per titoli, bio, media e contatti. Eljos (rigore scientifico) e MindUP (squadre e aziende) restano le "case" e ricevono link mirati.
2. **Una sola frase come asse**: *"Sotto pressione, la mente si allena."* — con la sua storia come apertura: **"Dalla Scuola Calcio alla Formula 1"**.
3. **Cinque porte d'ingresso per cinque pubblici**: Atleti e famiglie · Squadre e società · Aziende e leader · Motorsport · Psicoterapia. Nessuno deve leggere il menu per capire dove andare.
4. **Un'idea di metodo che si vede**: il **Cruscotto**, quattro strumenti (Pensiero, Emozione, Corpo, Fisiologia) che traducono i "quattro piani" della Psicologia del Potenziamento in qualcosa di memorabile. La tesi che lo distingue: **oltre l'empowerment cognitivo**.
5. **Look "Carta e Cruscotto"**: pagine chiare, calde e rassicuranti (rispetto per chi cerca psicoterapia) con sezioni scure "da telemetria" per metodo e dati (motorsport, rigore, misurazione). Niente cervelli stilizzati né stock photo.
6. **Prove prima delle promesse**: Albo, ateneo, academy F.I.R., convegni, radio/TV, pubblicazioni, case study anonimizzati. Niente testimonianze di pazienti.
7. **SEO "anti-omonimo"**: il pilota Lorenzo Baldassarri occupa le ricerche e possiede il `.com`. Ogni titolo, URL e dato strutturato lega il nome a *psicologo*, *Montecatini Terme* e alle specializzazioni.
8. **Stack veloce e di proprietà**: Astro (statico) + CMS a file (Keystatic) su Vercel, bilingue IT/EN, analytics senza cookie. Lorenzo (o chi per lui) può modificare i testi senza toccare il codice.
9. **Guardrail deontologici e privacy by design**: Albo e P.IVA in vista, nessun cliente nominato senza liberatoria scritta, minori tutelati, nessuna promessa di risultato.
10. **MVP in circa 4–5 settimane** dopo la raccolta dei contenuti.

---

## 2. I fatti che guidano le scelte

| # | Evidenza | Cosa implica per il sito |
|---|---|---|
| 1 | **Una storia rara e coerente**: 20+ anni di calcio → allenatore di Scuola Calcio → responsabile educativo (progetto di inclusione presentato a Pistoia) → responsabile "mental" di Formula Medicine 2013–2016 (F1, DTM, Serie A, olimpionici) → Eljos (2017) → MindUp (2021). In più studio privato dal 2011 e docenza a Parma dal 2017 | La storia è il primo asset di fiducia e di differenziazione. Va raccontata, non elencata |
| 2 | **Una tesi sul metodo**: "superare i limiti dell'empowerment cognitivo". Quattro piani: cognitivo, emotivo, muscolare-posturale, fisiologico; lavoro basato su dati (es. HRV) e monitorato | È il messaggio che nessun concorrente "mental coach" può copiare facilmente: va visualizzato |
| 3 | **Prove istituzionali** già pronte: psicologi referenti dell'academy toscana F.I.R., relatore KM2025, Radio Bianconera, RTV38, TagMedicina, *Scienza & Sport* | Una pagina Media/Prove forte e una "proof strip" in home |
| 4 | **Frammentazione**: tre siti (personale, Eljos, MindUP) + quattro directory, con indirizzi, titoli e recensioni non allineati; **tre nomi** per lo stesso metodo | Un hub canonico, una bio unica in tre lunghezze, un solo nome del metodo da usare ovunque |
| 5 | **Omonimia con il pilota** (WSBK, `.com`, Wikipedia) | Strategia SEO di disambiguazione (§10) e microcopy dedicato |
| 6 | **Professione sanitaria + segreto professionale + minori** | Compliance come requisito di design, non come footer (§13) |

---

## 3. Obiettivi e metriche

Obiettivi di business (da confermare con Lorenzo: l'ordine cambia il layout):
**(a)** percorsi 1:1 di performance e **(b)** progetti con società/aziende (valore più alto) · **(c)** studio clinico (flusso locale costante) · **(d)** autorevolezza: conferenze, docenza, media.

| Metrica | Come si misura | Obiettivo a 90 giorni (proposto) |
|---|---|---|
| Presidio del nome | Posizione per "lorenzo baldassarri psicologo" | Top 3 |
| Visibilità tematica | 5 query prioritarie non di brand (es. "psicologo dello sport Toscana", "preparazione mentale atleti") | Ingresso in top 20; top 10 a 6 mesi |
| Conversione | Contatti + prenotazioni / visitatori unici | 2–3% come soglia iniziale |
| Qualità dei contatti | Quota di richieste coerenti con il pubblico (atleta, società, azienda, paziente) | > 70% |
| Performance | Core Web Vitals su mobile | LCP < 2,0 s · INP < 200 ms · CLS < 0,05 |
| Accessibilità/SEO tecnica | Lighthouse | ≥ 95 su Accessibilità, SEO, Best Practices |
| Coerenza dei dati | Indirizzo, titoli, bio uguali su sito, Eljos, MindUP, 4 directory, LinkedIn | 100% |

*Soglie di partenza proposte, da ritarare dopo 60 giorni di dati reali.*

---

## 4. Pubblici e percorsi

| Porta | Chi è | Cosa cerca | Dubbio principale | Prova da mostrare | CTA |
|---|---|---|---|---|---|
| **Atleti e famiglie** | Atleti (dal giovanile al professionismo), genitori | Rendere di più sotto pressione; accompagnare un figlio senza sbagliare | "È per me / per mio figlio? È un mental coach o uno psicologo?" | Albo, Scuola Calcio, F.I.R., FAQ su minori | Call conoscitiva |
| **Squadre e società** | Dirigenti, direttori sportivi, allenatori, settori giovanili, federazioni | Psicologo di società, formazione staff, progetti educativi | "Ha esperienza con gruppi e con il giovanile?" | Academy toscana F.I.R., progetto educativo, RBN | Richiedi una proposta |
| **Aziende e leader** | Dirigenti, manager, imprenditori | Reggere la pressione, energia, decisioni | "È credibile fuori dallo sport?" | Protocollo Funzionale Integrato, KM2025, docenza Parma | Richiedi una proposta |
| **Motorsport** | Piloti, famiglie, team, academy | Metodo "da pista" | "Capisce davvero il mondo delle corse?" | Formula Medicine (F1, DTM), Proracing, RPM Italia | Call conoscitiva (IT/EN) |
| **Psicoterapia** | Persone con ansia e stress cronico, anche non sportive | Un professionista di fiducia, vicino | "È il posto giusto per me? Quanto costa?" | Albo, anni di pratica (dal 2011), approccio funzionale | Prima visita |
| *Trasversale* | Giornalisti, organizzatori di eventi, atenei | Un esperto da intervistare/invitare | "Chi è, di cosa parla?" | Pagina Media + kit stampa | Invita Lorenzo |

Regola d'oro: **ogni pagina ha un solo pubblico e una sola azione principale**.

---

## 5. Posizionamento, messaggi, voce

**Promessa**: *Allenare ciò che decide la prestazione sotto pressione — pensiero, emozione, corpo, fisiologia — con rigore clinico, metodo e dati.*

**Tre pilastri**
1. **Rigore clinico** — psicologo-psicoterapeuta dal 2011, docente universitario.
2. **Metodo integrato** — oltre l'empowerment cognitivo: quattro piani, misurati.
3. **Esperienza di campo** — dalla Scuola Calcio alla Formula 1, dal rugby giovanile ai dirigenti d'azienda.

**Voce**: competente, diretta, umana. Frasi brevi. Dati senza sensazionalismo. Mai "motivatore": è uno psicologo che spiega. Prima persona singolare (è un sito personale); il "noi" solo per Eljos e MindUP.

| Sì | No |
|---|---|
| "Lavoro con…", "Accompagno…", "Misuro…" | "Garantisco", "il migliore", "risultati assicurati" |
| "Approccio basato su dati" | "Scientificamente provato" (senza fonte) |
| "Psicologo dello sport" | "Mental coach" come titolo (non è una professione regolamentata) |
| Esempi concreti e anonimi | Nomi di clienti senza liberatoria |

**Hero (proposta)**
- *Eyebrow*: **Dalla Scuola Calcio alla Formula 1**
- *H1*: **Sotto pressione, la mente si allena.**
- *Sottotitolo*: *Sono Lorenzo Baldassarri, psicologo e psicoterapeuta. Lavoro con atleti, squadre e professionisti su ciò che decide la prestazione sotto pressione: pensieri, emozioni, corpo e fisiologia.*
- *CTA*: **Prenota una call conoscitiva** · *Scopri il metodo*
- *Riga di fiducia*: Psicologo-psicoterapeuta · Albo Toscana n. 6292 *(da verificare)* · Docente, Università di Parma

**Alternative H1 considerate**: "Dove la psicologia incontra la prestazione." (descrittiva ma tiepida) · "Dalla Scuola Calcio alla Formula 1, la mente si allena." (forte ma lunga; meglio come eyebrow + storia).

**Microcopy anti-omonimo** (nella pagina Chi sono; tono da concordare con Lui): *"Sì, esiste un pilota con il mio stesso nome. No, non sono io — anche se con i piloti ci lavoro."*

---

## 6. Architettura informativa

```text
/                        Home
/metodo                  Il metodo — Psicologia del Potenziamento®
/psicologo-dello-sport   Atleti e famiglie
/squadre-e-societa       Società, settori giovanili, federazioni, staff
/aziende-e-leader        Dirigenti, manager, imprenditori
/motorsport              Piloti, team, academy
/psicoterapia            Psicologo e psicoterapeuta a Montecatini Terme
/chi-sono                Storia, titoli, formazione, timeline
/media                   Radio/TV, stampa, convegni, scritti + kit stampa
/articoli                Blog "Mente e prestazione"  (+ /articoli/[slug])
/contatti                Modulo, prenotazione, mappa
/privacy  /cookie  /note-legali
/en/…                    Home · Method · Sports psychologist · Motorsport · About · Contact
```

- **Menu principale**: Metodo · *Per chi lavoro ▾* (le cinque porte) · Chi sono · Articoli · Contatti + CTA "Prenota una call" + selettore IT/EN. *Media* e legali in footer.
- **Slug "keyword-first"** per le pagine che devono posizionarsi (`/psicologo-dello-sport`, `/psicoterapia`).
- **Redirect 301 dal WordPress attuale** (da completare con una scansione del vecchio sito): `/?page_id=161` → `/chi-sono` · `/?page_id=335` e `/psicologia-del-potenziamento/` → `/metodo`. Su Vercel le regole sulla query string `page_id` si fanno con `redirects` + `has`.
- **EN** al lancio per Home, Metodo, Sports psychologist, Motorsport, About, Contact (il pubblico motorsport e il talk KM2025 sono internazionali); il resto in fase 2.

---

## 7. La Home, sezione per sezione

```text
┌──────────────────────────────────────────────────────────────────┐
│ Lorenzo Baldassarri · Psicologo e Psicoterapeuta   Menu  IT|EN  │
├──────────────────────────────────────────────────────────────────┤
│ DALLA SCUOLA CALCIO ALLA FORMULA 1        ┌───────────────────┐ │
│ Sotto pressione,                          │ ritratto B/N +    │ │
│ la mente si allena.                       │ traccia telemetria│ │
│ Sono Lorenzo Baldassarri…                 │ (SVG animato)     │ │
│ [Prenota una call]  Scopri il metodo →    └───────────────────┘ │
│ Psicologo-psicoterapeuta · Albo n. … · Docente Univ. Parma      │
├──────────────────────────────────────────────────────────────────┤
│ Chi sei?  [Atleta/Genitore] [Squadra/Società] [Azienda/Leader]  │
│           [Motorsport]      [Cerco supporto psicologico]        │
├──────────────────────────────────────────────────────────────────┤
│ KM2025 Siena · Radio Bianconera · RTV38 · Academy F.I.R. · …    │
├████████████████████████ (sezione scura) ████████████████████████┤
│ IL CRUSCOTTO — Non basta cambiare i pensieri.                   │
│ (Pensiero) (Emozione) (Corpo) (Fisiologia)  → Il metodo         │
├──────────────────────────────────────────────────────────────────┤
│ LA STORIA — Scuola Calcio → Progetti educativi → Formula        │
│ Medicine → Eljos/Parma → MindUp/F.I.R.     → Chi sono          │
├──────────────────────────────────────────────────────────────────┤
│ COME LAVORO — 1 Colloquio · 2 Valutazione · 3 Piano · 4 Misura  │
├──────────────────────────────────────────────────────────────────┤
│ STORIE SENZA NOMI (solo se reali e autorizzate)                 │
├──────────────────────────────────────────────────────────────────┤
│ MEDIA E ARTICOLI recenti        │   Newsletter "Mente e prest."  │
├──────────────────────────────────────────────────────────────────┤
│ FAQ (5 domande)                                                  │
├──────────────────────────────────────────────────────────────────┤
│ Parliamone. 20 minuti per capire se e come posso esserti utile. │
│ [Prenota una call]                                               │
└──────────────────────────────────────────────────────────────────┘
```

| # | Sezione | Scopo | Contenuti chiave |
|---|---|---|---|
| 1 | **Hero** | Dire chi è, cosa fa, per chi, in 5 secondi | Eyebrow + H1 + sottotitolo + CTA + riga di fiducia; ritratto con traccia telemetrica (SVG che si disegna in ~1 s; rispetta `prefers-reduced-motion`) |
| 2 | **Porte** | Instradare il pubblico | 5 card con una frase e un'icona sobria |
| 3 | **Proof strip** | Fiducia immediata | Solo testo finché non ci sono permessi per i loghi: Relatore KM2025 (Univ. di Siena) · Ospite Radio Bianconera · RTV38 · Academy F.I.R. · Autore TagMedicina |
| 4 | **Il Cruscotto** (scuro) | Differenziazione | Quattro "strumenti": **Pensiero** (concentrazione, decisioni), **Emozione** (paura, rabbia, fiducia), **Corpo** (tensione, postura), **Fisiologia** (battito, respiro, HRV). Idea da usare (parafrasi, **da verificare** nel testo del webinar F.I.R.): l'ansia come reazione a un'emozione precisa, la paura, più che emozione a sé. Grafico d'esempio **dichiarato illustrativo** |
| 5 | **La storia** | Umanizzare e dare credibilità | Timeline orizzontale con 5 tappe, ciascuna con un fatto verificabile |
| 6 | **Come lavoro** | Ridurre l'incertezza | 4 passi: colloquio · valutazione sui quattro piani · piano su misura · allenamento e monitoraggio |
| 7 | **Storie senza nomi** | Prova concreta | Contesto → sfida → piani coinvolti → cosa è cambiato (qualitativo). **Se non esistono casi autorizzati, la sezione non compare: non si inventa nulla** |
| 8 | **Media e articoli** | Autorevolezza e freschezza | 3 elementi + iscrizione newsletter (doppio opt-in) |
| 9 | **FAQ** | Rimuovere dubbi, intercettare ricerche conversazionali | (1) Psicologo dello sport o mental coach? (2) È solo per professionisti? (3) Lavori con i minorenni? (4) Quanto dura un percorso? (5) Differenza tra percorso di performance e psicoterapia? |
| 10 | **CTA finale** | Azione | "Parliamone. 20 minuti per capire se e come posso esserti utile." |

---

## 8. Le altre pagine chiave

| Pagina | Struttura | Note |
|---|---|---|
| **Metodo** | Tesi ("oltre l'empowerment cognitivo") → i quattro piani → come entrano i dati → fasi → applicazioni (sport, giovani, motorsport, aziende) → pubblicazioni (*Scienza & Sport* 2021, webinar F.I.R., KM2025) → limiti e onestà del metodo | Un solo nome del metodo in tutto il sito; link a Eljos per la teoria e a MindUP per l'offerta. Linguaggio "basato su dati", non "scientificamente provato" |
| **Psicologo dello sport (atleti e famiglie)** | A chi serve · giovani: la personalità accanto al gesto tecnico · percorso individuale · ruolo dei genitori · cosa NON è (non è magia né sostituisce un'eventuale psicoterapia) · FAQ minori | Tutela dei minori in evidenza (consenso dei genitori) |
| **Squadre e società** | Servizi (psicologo di società, valutazione mentale, formazione di staff e allenatori, workshop per genitori) · **idea di pacchetto**: *Progetto educativo per Scuole Calcio e settori giovanili*, che replica quanto fatto da responsabile educativo, con percorso di inclusione · prova: academy toscana F.I.R. | Il pacchetto è un'ipotesi da condividere con Lorenzo |
| **Aziende e leader** | Pressione, energia, decisioni · Protocollo Funzionale Integrato · formati (1:1, workshop, keynote) · prova: KM2025, docenza | Chiarire il rapporto con MindUP (contraente) |
| **Motorsport** | Origine del metodo · il Cruscotto applicato alla pista · assessment per piloti (modello "camp") · per famiglie e team | Pagina anche in EN; massima prudenza sui nomi (§13) |
| **Psicoterapia** | Chi sono e come lavoro (approccio funzionale, corpo-mente) · ansia e stress cronico · Metodologia Funzionale Antistress · primo incontro · modalità (studio/online) · dove · onorari (solo se confermati) · privacy · "in emergenza chiama il 112" | **Look più caldo e sobrio**; nessun linguaggio da performance; prenotazione separata |
| **Chi sono** | Racconto in prima persona · timeline · titoli e formazione (tabella) · incarichi (Parma, F.I.R., Eljos, MindUp) · foto · microcopy anti-omonimo · bio scaricabili | Qui, e solo qui, si valuta se nominare un cliente noto (con consenso) |
| **Media** | Filtri: Radio/TV · Stampa · Convegni · Scritti · Video · **Kit stampa** (bio 50/150/400 parole, foto, temi su cui parla, contatto) · "Invita Lorenzo" | I commenti su singoli giocatori restano link esterni |
| **Articoli** | 10 temi di partenza (§10) · autore, data di aggiornamento, fonti citate | Segnali E-E-A-T per un tema che riguarda la salute |
| **Contatti** | Modulo con scelta del pubblico · prenotazione call · telefono · mappa · orari · dati legali | Un solo modulo, instradato per pubblico |

---

## 9. Identità visiva e UX

**Idea**: *Carta e Cruscotto* — la serenità e la leggibilità di una pagina stampata, più la precisione di una schermata di telemetria.

### Palette (contrasti calcolati con la formula WCAG)

| Token | Esadecimale | Uso | Contrasto |
|---|---|---|---|
| `--carta` | `#F6F2EA` | Sfondo principale | — |
| `--inchiostro` | `#12161C` | Testi e titoli | **16,25:1** su carta (AAA) |
| `--grafite` | `#4A5360` | Testo secondario | **6,97:1** su carta (AA) |
| `--terracotta` | `#B33616` | Link e pulsanti primari | **5,44:1** su carta (AA); bianco su terracotta **6,08:1** |
| `--cruscotto` | `#0C1117` | Sfondo sezioni "dati" | Testo `#F1EEE6` **16,34:1**; secondario `#A5AFBC` **8,53:1** |
| `--segnale` | `#FF6A3D` | Accenti su scuro | **6,66:1** su cruscotto |
| `--telemetria` | `#5BE3C1` | Linee e grafici su scuro | **11,91:1** su cruscotto |

### Tipografia (tutta open source, **ospitata in locale**, niente Google Fonts remoti)
- **Sora** — titoli (geometrica, tecnica ma amichevole)
- **Inter** — testo
- **JetBrains Mono** — etichette e numeri "da telemetria"

### Immagini e movimento
- Ritratto professionale in bianco e nero con un unico accento; foto reali di campo/pista/aula (con liberatorie); **zero stock, zero cervelli stilizzati, zero sagome che meditano**.
- Grafici in SVG generati da dati d'esempio **etichettati come illustrativi**.
- Una sola animazione "firma" (la linea di telemetria nell'hero). Rispetta `prefers-reduced-motion`. Nessun video in autoplay.

### Componenti
Card-porta · Strumento del Cruscotto · Timeline · Proof strip · Citazione · Scheda storia · Accordion FAQ (`<details>`) · Banda CTA · Scheda media · Scheda articolo · Kit stampa.

### Accessibilità e prestazioni (requisiti, non optional)
WCAG 2.2 AA · navigazione da tastiera e stati di focus visibili · skip link · target touch ≥ 44 px · testo alternativo e trascrizioni · `lang="it"`/`hreflang` · immagini AVIF/WebP · JavaScript sotto ~60 KB in home · layout senza scorrimento orizzontale a 360 px.

### Perché non un sito tutto scuro "da performance"
Chi cerca psicoterapia (e i genitori di un ragazzo) può trovare un look aggressivo respingente. La base chiara protegge il pubblico clinico e giovanile; le sezioni scure danno identità e raccontano il rigore.

---

## 10. Contenuti e SEO

### Query per pagina (italiano)

| Pagina | Query principale | Secondarie |
|---|---|---|
| Home / Chi sono | **lorenzo baldassarri psicologo** | lorenzo baldassarri psicologo dello sport · lorenzo baldassarri mindup |
| `/psicologo-dello-sport` | psicologo dello sport | preparazione mentale atleti · mental training · psicologo per giovani calciatori |
| `/squadre-e-societa` | psicologo per società sportive | psicologo di squadra · formazione allenatori · progetto educativo scuola calcio |
| `/aziende-e-leader` | mental training per aziende | gestione della pressione manager · energia e performance dirigenti |
| `/motorsport` | psicologo motorsport | preparazione mentale piloti · HRV pilota · mental training karting |
| `/psicoterapia` | psicologo psicoterapeuta Montecatini Terme | ansia · stress cronico · psicoterapia funzionale · psicologo Pistoia/Pescia/Lucca/Firenze |
| `/metodo` | psicologia del potenziamento | oltre l'empowerment cognitivo · mental training integrato |

*Nessuna promessa di posizionamento: le query orientano la scrittura.*

### Il problema dell'omonimo
Il pilota Lorenzo Baldassarri domina i risultati, ha una pagina Wikipedia e il dominio `.com`. Contromisure:
- **Sempre "psicologo" accanto al nome**: title tag tipo *"Lorenzo Baldassarri – Psicologo dello sport e Psicoterapeuta"* (≈ 58 caratteri), H1 e anchor text.
- **Dati strutturati (JSON-LD)**: `Person` con `jobTitle`, `alumniOf` (Firenze, Urbino, SEF, CISSPAT), `memberOf` (Ordine Psicologi Toscana), `worksFor`/`founder` (MindUP, Eljos), `knowsAbout`, `sameAs` (LinkedIn, MindUP, Eljos, GuidaPsicologi, MioDottore, TagMedicina, YouTube) e `disambiguatingDescription`; `ProfessionalService` per lo studio; `Article`, `FAQPage`, `VideoObject`, `BreadcrumbList`.
- **Un unico profilo coerente** ovunque: stesso nome ("Dott. Lorenzo Baldassarri"), stessa bio, stesso indirizzo, link al nuovo sito dai profili che li permettono.
- **Link in ingresso "puliti"**: dalle proprietà che già lo ospitano (MindUP, Eljos, TagMedicina, psicologidellosport.it, GuidaPsicologi, MioDottore, RPM Italia, KM2025) verso `/chi-sono` e `/metodo`.

### E-E-A-T (tema "salute")
Autore e qualifica su ogni articolo · numero di iscrizione all'Albo · data di aggiornamento · fonti citate · niente claim senza riferimento.

### 10 articoli di partenza (ancorati ai suoi materiali)
1. **Psicologo dello sport o mental coach: che differenza c'è e perché conta** (professione regolamentata vs titolo libero)
2. **Oltre l'empowerment cognitivo**: perché la mente non si allena solo con i pensieri *(articolo-bandiera del metodo)*
3. **Ansia da prestazione**: reazione alla paura, non emozione a sé *(da webinar F.I.R.)*
4. **Scuola Calcio**: far crescere la personalità, non solo il gesto tecnico *(genitori e allenatori)*
5. **Sport e inclusione**: cosa insegna inserire un bambino con autismo in una squadra *(solo anonimizzato e con consenso)*
6. **La pressione in pista**: cosa succede a mente e corpo in qualifica *(motorsport)*
7. **HRV e prestazione mentale**: cosa misura davvero, cosa no
8. **Creare un gruppo**: cosa fa funzionare una squadra *(dal tema RBN)*
9. **Stress cronico**: segnali, cause, percorsi *(clinica, E-E-A-T)*
10. **Manager sotto pressione**: gestire l'energia, non solo il tempo

Cadenza: 1–2 articoli al mese + newsletter mensile "Mente e prestazione". Poi video brevi (1–2 minuti) in versione senza cookie (`youtube-nocookie`, caricamento su richiesta).

### Ricerca conversazionale/IA
Pagina Chi sono con dati essenziali in chiaro, FAQ concise, frasi dichiarative e verificabili: aiutano i motori generativi a rispondere correttamente alla domanda "chi è Lorenzo Baldassarri psicologo?".

---

## 11. Conversione

- **Scala di azioni**: leggere → iscriversi alla newsletter → *call conoscitiva di 20 minuti* → valutazione → percorso. Per le società e le aziende: *richiedi una proposta*.
- **Un modulo, quattro campi** (nome, email, "Sono…" con scelta del pubblico, messaggio). **Mai dati clinici** nel messaggio (avviso esplicito). Casella privacy, risposta promessa entro 1 giorno lavorativo.
- **Prenotazione**: calendario con caricamento su richiesta (Cal.com in regione UE) per le call di performance; per le visite cliniche si può continuare a usare MioDottore o un contatto diretto. **I due flussi restano separati.**
- **Telefono e WhatsApp** (solo per un primo contatto, con avviso sui dati) e barra CTA fissa su mobile.
- **Lead magnet (fase 2)**: checklist di una pagina *"La mia preparazione mentale prima della gara"*; eventuale autovalutazione non diagnostica con avvertenze chiare.
- **Eventi misurati** (senza cookie): clic su CTA, invio modulo, clic prenotazione, clic telefono, download kit stampa.

---

## 12. Tecnologia

| Opzione | Pro | Contro | Giudizio |
|---|---|---|---|
| **A. Astro (statico) + Keystatic + Vercel** | Velocissimo, SEO e accessibilità sotto controllo, codice di proprietà nel repo, costo basso, modifica testi senza toccare codice | Richiede sviluppo iniziale | **Raccomandata** |
| B. WordPress (tema premium) | Familiare, tanti plugin | Manutenzione, sicurezza, prestazioni, rischio di plugin non conformi (cookie, font) | Solo se serve evitare qualsiasi cambio di abitudini |
| C. Webflow/Framer/app builder AI (es. Base44) | Ottimi per validare un'idea in pochi giorni | Dipendenza dalla piattaforma, controllo limitato su SEO tecnica, dati strutturati, privacy e hosting; costi ricorrenti | Utili per bozze e contenuti, **meno adatti a un sito sanitario di riferimento** (da verificare sul prototipo) |

**Architettura raccomandata**
- **Astro** (output statico, TypeScript) con Content Collections per Articoli, Media, FAQ, Casi.
- **Keystatic** (CMS su Git, interfaccia semplice) per i testi; foto ottimizzate in build.
- **i18n** nativo (IT/EN) con `hreflang` e sitemap multilingua.
- **Vercel** (piano adatto all'uso commerciale), dominio `lorenzobaldassarri.it` + redirect da `www`, intestazioni di sicurezza (CSP, HSTS), anteprime per ogni modifica da far approvare a Lorenzo.
- **Modulo**: funzione serverless in regione UE → invio email (provider UE), antispam senza tracciamento (honeypot + captcha leggero solo all'invio), conservazione minima.
- **Analytics**: Plausible o Umami (senza cookie). Search Console e Bing Webmaster.
- **Qualità automatica** in CI: Lighthouse CI, axe (accessibilità), controllo link, validazione HTML e dei dati strutturati.
- **Ricerca interna** (se il blog cresce): Pagefind, statica.

---

## 13. Guardrail deontologici, legali e di privacy

> Raccomandazioni operative, **non consulenza legale**: da verificare con l'Ordine (OPT) e un consulente.

| Tema | Cosa fare |
|---|---|
| **Trasparenza del professionista** | In ogni pagina o nel footer: nome, titolo, Ordine e numero di iscrizione, sede, P.IVA, contatti/PEC (D.Lgs. 70/2003, art. 7) |
| **Informazione sanitaria** | Contenuti informativi, non promozionali né suggestivi; niente confronti o superlativi (L. 145/2018, art. 1, commi 525 ss.; Codice Deontologico, artt. relativi alla pubblicità) |
| **Segreto professionale** | Nessun cliente nominato senza consenso scritto (art. 11): vale anche per il pilota di F1 citato nella bio, giocatori di Serie A, olimpionici, società. In mancanza: "piloti di Formula 1", "giocatori di Serie A", ecc. |
| **Minori** | Nessuna immagine o dettaglio riconoscibile; consenso di chi esercita la responsabilità genitoriale; casi sempre anonimizzati |
| **Recensioni/testimonianze** | Nessuna recensione di pazienti sul sito né incentivata; vanno bene referenze istituzionali e *case study* anonimi. "Prima visita gratuita" e altre offerte promozionali: da evitare o da validare con l'OPT |
| **Claim sul metodo** | "Basato su dati", "approccio integrato", citando le pubblicazioni. Evitare "scientificamente provato", "validato", "garantito" senza documentazione. L'uso di ® va confermato con il titolare del marchio |
| **Commenti su persone non in carico** | Come in radio: analisi generale, non diagnosi; sul sito solo link esterni |
| **Privacy (GDPR)** | Informativa; modulo senza dati particolari; cookie banner conforme alle Linee guida del Garante (2021) solo se servono cookie non tecnici; **font in locale**; incorporazioni (video, mappe, calendario) caricate **solo su richiesta**; fornitori in UE con DPA |
| **Telepsicologia** | Se offre sedute online, seguire le linee guida CNOP sui servizi psicologici a distanza |
| **Emergenze** | Riquadro: "In caso di emergenza chiama il 112" nelle pagine cliniche |

---

## 14. Roadmap e impegno stimato

| Fase | Durata | Risultati | Dipende da |
|---|---|---|---|
| **0 — Fondamenta** | 1 settimana | Fonti sbloccate o testi incollati · decisioni di §15 · dati legali · inventario del vecchio sito · bio in tre lunghezze · piano foto/video | Lorenzo (2–3 ore), accesso alle fonti |
| **1 — MVP** | 4–5 settimane | Home, Metodo, Chi sono, 5 pagine-porta, Media, Contatti, pagine legali; IT; redirect; sitemap; dati strutturati; analytics; test di accessibilità e prestazioni | Fase 0 |
| **2 — Crescita** | 4–6 settimane | EN (pagine chiave), 6 articoli, 2–3 case study autorizzati, newsletter, video breve, allineamento di tutte le directory | Foto/video, liberatorie |
| **3 — Continuità** | Mensile | Calendario editoriale, kit stampa aggiornato, lead magnet, pagine per eventi/keynote, revisione dei dati | Disponibilità di Lorenzo |

Stima di lavoro per la fase 1 (indicativa, per una persona che segue design e sviluppo): design ~4–6 giorni · sviluppo ~8–12 giorni · contenuti e revisione ~5–8 giorni · test e messa online ~2 giorni, cioè **circa 20–28 giorni-persona**. I tempi di calendario dipendono dalla rapidità con cui arrivano contenuti e approvazioni.
Servizi esterni ricorrenti (ordine di grandezza): hosting Vercel (piano adatto all'uso commerciale) + dominio + email transazionale + eventuale calendario/newsletter. Nessun canone di piattaforma obbligato.

---

## 15. Decisioni aperte (con la mia raccomandazione)

| # | Decisione | Raccomandazione |
|---|---|---|
| 1 | **Ruolo di sito personale, Eljos e MindUP** | Sito personale = hub e unico punto d'ingresso (un modulo, instradato per pubblico); Eljos = casa della teoria e del team; MindUP = veicolo commerciale per società/aziende/motorsport. Testi diversi, mai copiati (niente contenuto duplicato). *Da condividere con i soci* |
| 2 | **Nominare clienti noti** (es. il pilota di F1 citato nella bio) | Home e pagine-porta **senza nomi**. Nome solo in *Chi sono* e solo con liberatoria scritta e formulazione concordata |
| 3 | **Nome unico del metodo e paternità** | "Psicologia del Potenziamento®" come nome; "elaborata con i colleghi del Gruppo Eljos" come formula. Verificare i marchi |
| 4 | **Priorità tra i pubblici** | Performance 1:1 e società/aziende in primo piano; psicoterapia ben visibile ma in una pagina propria |
| 5 | **Tariffe online** | Clinica: forchetta solo se confermata. B2B: "su proposta" |
| 6 | **Lingue** | IT + EN al lancio per le 6 pagine chiave |
| 7 | **Prototipo Base44** | Non l'ho potuto aprire. Se è la bozza già condivisa con Lorenzo, allineo palette, testi e struttura a ciò che ha approvato; se è un esperimento, lo uso come riferimento di contenuti. Da verificare nel prototipo: indicizzazione, meta tag, dati strutturati, prestazioni, cookie/hosting, proprietà del codice, dominio |
| 8 | **Foto e video** | Mezza giornata di shooting (ritratto + campo/pista/aula) e un video di 2–3 minuti con la sua voce |
| 9 | **Prenotazione clinica** | Mantenere MioDottore o un contatto diretto, separato dalle call di performance |

---

## 16. Cosa serve per partire

**Sblocchi tecnici (uno dei due)**
- Aggiungere questi host in *Allowed domains* dell'ambiente (Network access): `lorenzobaldassarri.it`, `www.lorenzobaldassarri.it`, `www.mindup.live`, `www.eljos.it`, `www.psicologidellosport.it`, `www.miodottore.it`, `www.tagmedicina.it`, `www.cicloturismo.it`, `www.guidapsicologi.it`, `lorenzobaldassarri.base44.app`, `www.tuttojuve.com`, `www.bianconeranews.it`, `toscana.italiaeconomy.it`, `www.iiakm.org`, `share.google`.
- Oppure incollare in chat i testi (e gli screenshot) delle pagine più importanti.

**Dati e decisioni** → vedi [dossier §14](01-dossier-lorenzo-baldassarri.md) e §15 sopra.

**Quick win indipendenti dal nuovo sito (una settimana)**
1. Allineare indirizzo, titoli e bio su GuidaPsicologi, MioDottore, psicologidellosport.it, Eljos, MindUP, LinkedIn.
2. Riscrivere titolo e "Informazioni" di LinkedIn con il nome del metodo e la storia.
3. Verificare/rivendicare la scheda Google (e capire a cosa porta `share.google/…`).
4. Chiudere o aggiornare le schede datate (MioDottore, studio di Santa Lucia).
5. Preparare la bio canonica in tre lunghezze.

---

## 17. Cosa non fare

- Stock photo di cervelli, ingranaggi o persone che meditano.
- Timer, "posti limitati", pop-up, chat automatica aggressiva.
- Recensioni di pazienti, prima/dopo, confronti con altri professionisti.
- Loghi di testate, club o aziende senza autorizzazione.
- Più pagine quasi identiche per "città" o "servizio" (doorway page).
- Mescolare nello stesso flusso la prenotazione clinica e quella di performance.
- Pubblicare dati non verificati (Albo, titoli, collaborazioni) solo perché compaiono in una directory.
