# Horse Hotel AMS — Documentatie

## Overzicht

Horse Hotel AMS is een uitgebreid beheersysteem voor paardenhotels, ontworpen voor het beheren van gastaanmeldingen van paarden, personeelstaken, klantboekingen, transportlogistiek, aankondigingen en planning — allemaal met rolgebaseerde toegangscontrole en meertalige ondersteuning (Engels, Portugees, Nederlands).

## Technologie Stack

- **Frontend:** React 18 + TypeScript 5 + Vite 5
- **Styling:** Tailwind CSS 3.4
- **Routing:** React Router 6
- **Iconen:** Lucide React
- **Datumverwerking:** date-fns
- **Gegevensopslag:** localStorage (sleutel: `horse_hotel_data_v4`)
- **Authenticatie:** Context-gebaseerd met rolbeheer

## Rollen & Rechten

| Functionaliteit | Beheerder | Medewerker | Klant |
|---|---|---|---|
| Dashboard | Volledige statistieken | Volledige statistieken | Mijn paarden en verzoeken |
| Paarden | Alles bekijken/toevoegen/bewerken/verwijderen | Alles bekijken/toevoegen/bewerken | Alleen eigen paarden |
| Taken | Aanmaken/toewijzen/voltooien | Bekijken/voltooien toegewezen | — |
| Boekingen | Beoordelen/goedkeuren/afwijzen | Beoordelen/goedkeuren/afwijzen | Verzoeken indienen |
| Transport | Aanmaken/beheren | Aanmaken/beheren | — |
| Aankondigingen | Aanmaken voor alle doelgroepen, Archiveren, Permanent verwijderen | Aanmaken voor iedereen/personeel, Archiveren, Herstellen | Alleen bekijken |
| Gebruikers | Toevoegen/rol wijzigen/verwijderen | — | — |
| Agenda | Alle evenementen bekijken/bewerken | Alle evenementen bekijken/bewerken | Eigen + openbare evenementen |
| Profiel | Bekijken | Naam/telefoon bewerken, Wachtwoord wijzigen | Naam/telefoon bewerken, Wachtwoord wijzigen, Paarden registreren |

## Pagina's & Functionaliteiten

### 1. Landingspagina (`/`)
Publieke pagina met hotelinformatie, diensten, faciliteiten, transportdetails en contactformulier. Volledig responsief.

### 2. Authenticatie (`/login`, `/signup`)
- Inloggen met e-mail/wachtwoord
- Zelfregistratie (status: in afwachting → goedkeuring beheerder vereist)
- Wachtwoord instellen via uitnodigingstoken (`/set-password/:token`)

### 3. Dashboard (`/app/dashboard`)
- **Personeelsweergave:** Paardentellingen, openstaande taken, openstaande verzoeken, geplande transporten. Snelle kaarten voor aankomsten/vertrek vandaag, quarantainewaarschuwingen, urgente taken.
- **Klantweergave:** Aantal mijn paarden, aantal mijn verzoeken.

### 4. Paardenbeheer (`/app/horses`)
- Zoeken op paardnaam, eigenaarsnaam of paspoort-ID
- Filteren op status: alle, verwacht, ingecheckt, uitgecheckt
- Volledig paardprofiel: naam, paspoort-ID, moeder, eigenaar, in-/uitcheckdatums en -tijden, staltype (houtkrullen/stro), stallocatie (A-D, pension links/midden/rechts), wandelaar/paddock-schema, quarantaine met datumbereik, transportbestemming
- Speciale verzorging: voedseltype (hooi/gras/beide), voertype (standaard/klant-bereid/anders), verzorgingsnotities
- Veilige datumformattering — geen crashes bij lege/ongeldige datums

### 5. Takenbeheer (`/app/tasks`) — Alleen personeel
- Taken aanmaken met titel, beschrijving, toegewezen medewerker, gerelateerd paard, deadline, prioriteit (laag/gemiddeld/hoog/urgent)
- Secties: Taken van vandaag, Alle actieve, Aankomende, Voltooid
- Taken als voltooid markeren

### 6. Boekingen (`/app/bookings`)
- **Klanten:** Faciliteitverzoeken indienen (arena, paddock, rondpen, anders) met datum en tijdslots (start/eindtijd)
- **Personeel:** Verzoeken beoordelen met beheerdersnotities, goedkeuren of afwijzen
- **Meldingen:** Personeel ontvangt melding bij nieuw verzoek. Klant ontvangt melding bij goedkeuring/afwijzing.
- **Snelle acties vanuit meldingen:** Beheerder kan direct goedkeuren/afwijzen vanuit het meldingenpaneel.

### 7. Transport (`/app/transport`) — Alleen personeel
- Transport plannen: paard selecteren, datum, tijd, herkomst, bestemming, chauffeur (met gebruikers-autocomplete)
- Status volgen: gepland → onderweg → voltooid

### 8. Aankondigingen (`/app/announcements`)
- **Doelgroep:** iedereen, alleen personeel, alleen klanten
- **Vastpinnen:** Belangrijke aankondigingen bovenaan
- **Categorieën:** Algemeen, Onderhoud, Transport, Belangrijk (kleurgecodeerde badges)
- **Archiefsysteem:** Personeel kan aankondigingen archiveren. Gearchiveerde items tonen resterende dagen voor auto-verwijdering. Na 10 dagen permanent verwijderd. Personeel kan herstellen. Beheerder kan direct permanent verwijderen.

### 9. Gebruikersbeheer (`/app/users`) — Alleen personeel
- Gebruikers zoeken op naam, e-mail, telefoon, paardnaam of paspoort-ID
- Gekoppelde paarden per gebruiker bekijken
- Wachtende goedkeuringen: goedkeuren met roltoewijzing of afwijzen
- **Rolwijziging door beheerder:** Beheerder kan de rol van elke gebruiker wijzigen (klant ↔ medewerker ↔ beheerder)
- Nieuwe gebruikers aanmaken met tijdelijk wachtwoord
- Gebruikers verwijderen (alleen beheerder)

### 10. Agenda (`/app/schedule`)
- **Weekweergave:** 7-daags raster met compacte evenementkaarten
- **Dagweergave:** Volledige evenementenlijst
- **Evenementtypes:** Boeking (blauw), Transport (paars), Aankomst (groen), Vertrek (amber)
- Navigatie: vorige/volgende week/dag, "Vandaag"-knop

### 11. Profiel (`/app/profile`)
- Naam, e-mail (alleen-lezen), telefoon bekijken/bewerken
- Wachtwoord wijzigen
- **Mijn Paarden:** Paarden registreren en bewerken

## Meldingensysteem

- Rolgebaseerde filtering per doelgroep en gebruiker
- Typen: aankomst, vertrek, verzoek, taak, transport, aankondiging, registratie
- Belpictogram met ongelezen telling
- Klik op melding → navigeer naar gekoppelde pagina
- Verzoek-meldingen bevatten "Goedkeuren" en "Afwijzen" knoppen

## Internationalisering (i18n)

Drie talen volledig ondersteund: Engels (`en`), Portugees (`pt`), Nederlands (`nl`). Taalschakelaar in de koptekst.

## Project Uitvoeren

```bash
npm install
npm run dev          # Ontwikkelingsserver (http://localhost:5173)
npm run build        # Productiebouw
```

## Standaard Login

- **Beheerder:** admin@admin.com / admin
