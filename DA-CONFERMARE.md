# Da confermare prima della pubblicazione

Tutti i valori tra `[ ]` nel sito, più le scelte che richiedono l'ok di Lorenzo.

## Dati legali e di contatto (`src/data/sito.js`)
- [ ] Numero di iscrizione all'Albo OPT (oggi `6292 [da confermare]`) e annotazione come psicoterapeuta
- [ ] P.IVA, PEC, email, telefono
- [ ] Indirizzo dello studio (Via dei Colombi, numero civico) e sedi attive
- [ ] Colloqui online: sì/no
- [ ] Onorari da indicare (pagina Psicoterapia)

## Contenuti
- [ ] Ruolo esatto all'Università di Parma ("Docente")
- [ ] Testi delle tappe della timeline e dei numeri in Home ("15+ anni", "20+ anni", "3 anni")
- [ ] Prove sulle pagine-porta (F.I.R., Formula Medicine, F4/Regional con MindUP, RPM Italia)
- [ ] Uso del marchio "Psicologia del Potenziamento®" e "MindUP Enhancement Psychology®" sul sito personale
- [ ] Formula concordata sulla paternità del metodo (oggi: "elaborato con i colleghi del Gruppo Eljos")
- [ ] Nessun cliente è nominato: decidere se e dove, solo con liberatoria scritta

## Materiali da fornire
- [x] Ritratto: foto in alta risoluzione ricevuta (1295×1214); ritaglio 4:5 a 960×1200 per hero e Chi sono, primo piano 256×256 per la chat. Confermare il consenso alla pubblicazione
- [ ] Foto di campo/pista/aula con liberatorie
- [ ] Case study anonimi autorizzati (la sezione "Storie senza nomi" è stata omessa)

## Tecnica
- [ ] Chat: oggi la richiesta guidata si invia aprendo WhatsApp con il messaggio pronto. Per ricevere le richieste anche via email serve un endpoint (es. funzione Vercel + servizio email UE)
- [ ] Confermare il numero +39 346 856 4025 per telefono e WhatsApp, e l'uso della foto del volto nella chat
- [ ] Collegare il modulo contatti a un endpoint reale (oggi mostra un messaggio di anteprima)
- [ ] Testi definitivi di Privacy, Cookie e Note legali (oggi bozze)
- [ ] Analytics senza cookie (Plausible o Umami)
- [ ] Rimuovere `Disallow: /` da `public/robots.txt` quando i contenuti sono confermati
- [ ] Versione inglese (/en) delle pagine chiave
- [x] **Logo MindUP**: SVG ufficiale in `public/logo/mindup-enhancement-psychology.svg`; per gli sfondi chiari c'è una variante con i grigi scuriti (`public/img/mindup-logo-chiaro.svg`).
- [x] **"Creatore della Psicologia del Potenziamento®"**: confermato dall'articolo su *Scienza & Sport* (2021), dove Lorenzo è indicato come "ideatore del mental training 'Protocollo Funzionale per Sportivi' e della Psicologia del Potenziamento". Resta da verificare l'uso del marchio ®.
- [x] **Logo LB**: SVG ufficiali in `public/logo/` (simbolo e completo, bianco / blu notte / nero), usati in header, favicon, footer e schermata d'ingresso.

## Testi semplificati della Home (revisione "da ragazzino")
- [ ] **Chiacchierata iniziale**: la Home dice "20 minuti al telefono o in video". Confermare durata e se è gratuita (se sì, si può scrivere "gratuita": convince molto)
- [ ] **Tempi di risposta**: "Risposta entro un giorno lavorativo" compare in hero e in chiusura. Confermare che è sostenibile
- [ ] **Costi**: la FAQ "Quanto costa?" oggi dice "te lo dico subito, al primo contatto". Se Lorenzo vuole, indicare una cifra o una fascia
- [ ] **Frequenza**: la FAQ dice "all'inizio una volta a settimana, poi più di rado". Confermare
- [ ] **Colloqui online e ricetta**: le FAQ dicono che online funziona come in studio e che non serve la ricetta del medico. Confermare
- [ ] **"Sul campo"**: la sezione con le foto da scattare è stata tolta dalla Home; rimetterla quando ci sono le foto vere
- [ ] **Numeri "Esperienza"**: 15+ anni di psicoterapia, 20+ anni di calcio, 3 anni in Formula 1, docente a Parma dal 2017

## Recensioni (sezione "Lo dicono loro.")
- [x] **Foto delle persone**: ritagliate e inserite in `public/img/recensioni/` (abbinate dai dettagli: maglia Barák 72, tuta Barni Ducati, maglia motocross con logo MindUP, tuta rally, tuta F.I.R., set TV). Paoli e Bertocchi abbinati per esclusione: da confermare
- [ ] Confermare il permesso di usare le foto (alcune sono di fotografi o squadre) e, se possibile, una foto di Emma Balsimelli senza la scritta della TV
- [ ] **Consenso**: confermare che ogni persona ha autorizzato la pubblicazione di nome, ruolo e testo anche sul sito personale di Lorenzo
- [ ] **Regole deontologiche sulla pubblicità sanitaria**: le testimonianze sono un punto delicato per uno psicologo, soprattutto quelle che parlano di terapia o sintomi (Balsimelli cita "la terapia dello stress cronico", Moriconi ansia e malesseri fisici). Valutare con Lorenzo/Ordine se tenerle tutte o solo quelle di performance (sport e aziende)
- [ ] Le "frasi in evidenza" di ogni scheda sono estratte parola per parola dai testi; corretti solo i refusi evidenti
