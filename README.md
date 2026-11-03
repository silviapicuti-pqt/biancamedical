# Biancamedical

Sito istituzionale di Biancamedical di Clementi Paolo, con catalogo, ricerca dei prodotti e schede interne al sito.

## Struttura

- `dist/`: sito completo pronto per la pubblicazione, con immagini, dati e cataloghi PDF.
- `.github/workflows/pages.yml`: pubblicazione automatica su GitHub Pages dopo ogni aggiornamento del ramo `main`.
- `preview.cjs`: anteprima locale, senza dipendenze aggiuntive.

## Anteprima

Con Node.js installato, eseguire `node preview.cjs` e aprire http://127.0.0.1:8091/.

## Pubblicazione

1. Caricare il progetto in un repository GitHub dedicato, sul ramo `main`.
2. In **Settings > Pages > Build and deployment**, selezionare **GitHub Actions**.
3. Eseguire il workflow **Pubblica Biancamedical** dalla scheda Actions, oppure inviare un nuovo aggiornamento a `main`.
4. Controllare che il workflow sia concluso con successo e verificare il sito all'indirizzo restituito da GitHub.

La pubblicazione riguarda soltanto la cartella `dist`. Non occorre un servizio di compilazione.

## Dominio biancamedical.it

Prima di modificare Aruba, configurare e salvare `biancamedical.it` in **Settings > Pages > Custom domain** del repository corretto. Verificare il dominio in GitHub con il record TXT generato dal proprio account, quando richiesto. Il file CNAME non e' necessario per la pubblicazione tramite GitHub Actions.

Solo dopo la configurazione su GitHub, sostituire i due record A attualmente diretti al precedente hosting con i quattro record A seguenti, tutti con nome host `@`:

| Tipo | Host | Valore |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

Il record CNAME `www` deve puntare a **NOME-ACCOUNT.github.io**, sostituendo NOME-ACCOUNT con il proprietario effettivo del repository. Non aggiungere il nome del repository al valore DNS.

Lasciare invariati i record della posta e i Name Server Aruba. I vecchi TXT di verifica dell'hosting precedente non puntano il traffico al sito e non vanno sostituiti con il codice GitHub: la verifica GitHub usa un record dedicato generato nell'account.

Attendere la verifica DNS e la disponibilita' del certificato, poi abilitare **Enforce HTTPS** in GitHub Pages. Prima di concludere il trasferimento verificare entrambi gli indirizzi, il catalogo, la ricerca e i contatti. Il sito precedente va conservato fino alla verifica del nuovo.

## Riservatezza e piani

Il proprietario ha autorizzato la pubblicazione del sito su GitHub Pages. La visibilita' del repository deve essere scelta separatamente in base al piano dell'account. GitHub Free supporta Pages da repository pubblici; GitHub Pro e altri piani supportano anche repository privati. Un repository privato non rende privato il sito Pages.

## Catalogo

La ricerca indicizza 2.977 codici prodotto tratti dal catalogo fornito. Le immagini vengono caricate dal produttore in base al codice; se non disponibili, l'immagine viene nascosta. Sono incluse due immagini locali. I campi tecnici aggiuntivi del prodotto 28912 sono stati verificati sulla documentazione del produttore; non e' stata effettuata una sincronizzazione completa delle schede del fornitore. La disponibilita' dei prodotti viene richiesta a Biancamedical.

Il catalogo completo e' composto da 483 pagine e viene assemblato nel browser dalle sezioni PDF presenti in `dist/assets/catalogo`.

## Documentazione ufficiale

- [Workflow GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Domini personalizzati](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Visibilita' dei siti Pages](https://docs.github.com/en/enterprise-cloud%40latest/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site)

Biancamedical. Tutti i diritti riservati. Il file di licenza di PDF-lib e' incluso in `dist/assets/pdf-lib-LICENSE.txt`.
