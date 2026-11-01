# OSOBAU – Unternehmenswebsite

Website für **OSOBAU** (Trockenbau · Kernsanierung · Brandschutzarbeiten · Q3-Verspachtelung).
Umgesetzt von Nexframe Studio auf Basis des Master-Prompts und des Kundenbriefings (Stand 10/2026).

**Stack:** React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · Motion · Lucide Icons · React Router 7
**Backend Kontaktformular:** PHP 8.1+ (`public/api/contact.php`)

---

## 1. Designkonzept

| Ebene | Entscheidung |
|---|---|
| Haltung | Architekturbüro statt Handwerker-Template: große Projektbilder, viel Weißraum, präzise Linien, ruhige Bewegung |
| Farben | Kalksteinweiß `#F7F7F5`, Graphit `#17191B`, Nachtblau-Grau `#171C20` (dunkle Sektionen), Stein `#72777A`, Bronze `#B49B73` als Akzent. Für Bronze-**Text** auf hellem Grund wird `#7D6644` verwendet (Kontrast WCAG AA) |
| Typografie | Montserrat (Headlines, enges Tracking), Inter (Fließtext) – lokal eingebunden über Fontsource, kein Google-Request |
| Raster | 12-Spalten-Grid, max. 1480 px, asymmetrische Bild-/Textkompositionen, nummerierte Abschnitte (01 / Leistungen …) |
| Logo | Originallogo freigestellt (dunkel + hell), Favicon aus dem Dach-Signet abgeleitet |
| Bewegung | Einmalige Scroll-Reveals, sanfter Hero-Zoom, Bild-Zoom bei Hover, Seitenübergänge; `prefers-reduced-motion` wird respektiert |

## 2. Seitenstruktur (Onepager)

Die Website ist ein **Onepager**: Alle Inhalte stehen auf der Startseite, die Navigation springt zu den Abschnitten.

| Abschnitt (Anker) | Inhalt |
|---|---|
| Hero | Vollbild-Luftbild AOK Magdeburg, Headline, Buttons, Datenzeile |
| `#leistungen` | 4 Leistungen mit Foto, Kurztext und Leistungsumfang |
| `#ueber-uns` | Unternehmensvorstellung + „Was unsere Arbeit auszeichnet“ |
| `#projekte` | Alle 4 Referenzen mit Beschreibung (Link zur Detailseite) |
| `#auftraggeber` | Zwei Einstiege: öffentlich / gewerblich (füllen das Formular vor) |
| Ablauf, `#faq` | 3 Schritte, häufige Fragen |
| `#kontakt` | Kontaktdaten + Anfrageformular mit Datei-Upload |

**Ausnahmen mit eigener Seite:** `/projekte/:slug` (Projektdetail mit Galerie), `/impressum`, `/datenschutz`.
Alte URLs (`/leistungen`, `/ueber-uns`, `/projekte`, `/kontakt`, `/leistungen/:slug`) leiten auf den passenden Abschnitt um.

> SEO-Hinweis: Ohne eigene Leistungsseiten rankt die Startseite allein für „Trockenbau Berlin“ / „Kernsanierung Berlin“. Falls später mehr Sichtbarkeit pro Leistung gewünscht ist, lassen sich Leistungsseiten wieder ergänzen (Daten liegen in `src/data/services.ts`).

### Bildzuordnung Referenzen (laut Kunde, Reihenfolge wie geliefert)

| Projekt | Bilder |
|---|---|
| 01 Saarterrassen Plaza Nord, Saarbrücken | `saarterrassen-plaza-nord-01` … `-04` (4 Bilder; Titelbild: Fassade `-03`) |
| 02 AOK-Gebäude Magdeburg | `aok-gebaeude-magdeburg` (Luftaufnahme) |
| 03 Tabbertstraße 2–3, Berlin | `tabbertstrasse-berlin-visualisierung` – **als Visualisierung gekennzeichnet** |
| 04 Q3-Verspachtelung (Leistungsreferenz) | `q3-verspachtelung-01`, `-02` |

## 3. Ordnerstruktur

```
osobau-website/
├── assets-src/            Originalbilder (Quelle für die Bildoptimierung)
│   ├── brand/             Logo-Original
│   └── projekte/          Projektfotos mit sprechenden Dateinamen
├── public/
│   ├── api/               contact.php, config.example.php, .htaccess
│   ├── brand/             Logo (dunkel/hell, PNG + WebP)
│   ├── images/            optimierte Bilder (AVIF/WebP/JPG, 480–2048 px)
│   ├── .htaccess          SPA-Routing, HTTPS, Security-Header, Caching (Apache)
│   ├── robots.txt, sitemap.xml, site.webmanifest, og-image.jpg, Favicons
├── scripts/
│   └── optimize-images.mjs   Bildpipeline (sharp)
├── src/
│   ├── config/site.ts     ★ Unternehmensdaten + Platzhalter (zentral)
│   ├── data/              ★ services.ts, projects.ts, images.ts (Inhalte)
│   ├── components/        Navbar, Hero, SectionHeader, ServiceCard, ProjectCard,
│   │                      ProjectGallery, ContactForm, CTASection, Footer, …
│   ├── pages/             eine Datei je Seite
│   ├── lib/schema.ts      strukturierte Daten (schema.org)
│   └── index.css          Design-Tokens (Tailwind @theme)
└── index.html
```

Inhalte werden ausschließlich in `src/config/site.ts` und `src/data/*.ts` gepflegt (FAQ: `src/data/faq.ts`, erscheint nur auf der Startseite).

**Bildregel:** Auf jeder Seite erscheint jedes Foto höchstens einmal. Projekt-Detailseiten haben keinen Bild-Hero, die Galerie zeigt alle Projektbilder.

## 4. Installation & lokaler Start

Voraussetzung: Node.js ≥ 20.

```bash
npm install
cp .env.example .env        # Werte bei Bedarf anpassen
npm run dev                 # http://localhost:5173
```

Das Kontaktformular sendet lokal an `/api/contact.php` – ohne PHP-Server schlägt der Versand fehl und das Formular zeigt eine Fehlermeldung mit Telefon/E-Mail an. Zum Testen mit PHP: `npm run build && php -S localhost:8080 -t dist` (zusätzlich `dist/api/config.php` anlegen).

## 5. Build & Deployment

```bash
npm run build      # Typecheck + Produktions-Build nach dist/
npm run preview    # Build lokal ansehen
```

**Standard-Webhosting (Apache + PHP, z. B. IONOS, all-inkl, Strato):**

1. Inhalt von `dist/` per SFTP ins Webroot laden (inkl. versteckter `.htaccess`-Dateien).
2. Auf dem Server `api/config.example.php` → `api/config.php` kopieren und anpassen (`from` = echtes Postfach der Domain, `salt` = Zufallswert).
3. SPF/DKIM für die Domain prüfen, damit Formular-Mails nicht im Spam landen.
4. Testanfrage mit Datei-Upload senden.
5. PHP-Limits prüfen: `upload_max_filesize ≥ 10M`, `post_max_size ≥ 25M`.

**Andere Hosts (Netlify/Vercel o. Ä.):** SPA-Fallback auf `index.html` einrichten und `VITE_CONTACT_ENDPOINT` auf einen eigenen Formular-Endpunkt (Serverless-Funktion oder Formulardienst mit AV-Vertrag) setzen.

**Neue Bilder:** Datei nach `assets-src/projekte/` legen, `npm run images` ausführen, Eintrag in `src/data/projects.ts` ergänzen.

**Neues Projekt:** Objekt in `src/data/projects.ts` hinzufügen → Übersicht, Detailseite, Footer und Leistungsseiten übernehmen es automatisch. URL in `public/sitemap.xml` ergänzen.

## 6. Technische Qualität

- **SEO:** Title/Description/Canonical/OG je Seite (`components/Seo.tsx`), eine H1 je Seite, sprechende URLs, Sitemap, robots.txt, JSON-LD (`GeneralContractor`, `Service`, `BreadcrumbList`, `FAQPage`) – nur mit belegten Angaben (Straße erst nach bestätigter Hausnummer).
- **Performance:** AVIF/WebP/JPG mit `srcset`, feste Bildmaße (kein CLS), unscharfe Platzhalter, Lazy Loading, Preload des Hero-Bildes, Code-Splitting je Seite, lokale Fonts, lange Cache-Header.
- **Barrierefreiheit:** Skip-Link, sichtbare Fokuszustände, Tastaturbedienung (Menü + Lightbox mit Esc/Pfeiltasten), Labels + Fehlermeldungen mit `aria-invalid`/`aria-describedby`, Fehlerübersicht mit Fokus, reduzierte Bewegung.
- **Datenschutz:** keine Cookies, kein Tracking, keine externen Dienste → kein Cookie-Banner nötig. Uploads werden nur als Mail-Anhang übertragen, nicht gespeichert.
- **Formular-Sicherheit:** Honeypot, Mindest-Ausfüllzeit, Rate-Limit (gehashte IP), Header-Injection-Schutz, Dateiendung + MIME-Prüfung, Größenlimits, Origin-Prüfung, `config.php` per `.htaccess` gesperrt.

Lighthouse-Zielwerte (90+/95+/95+) sind Optimierungsziele und nach dem Deployment auf der echten Umgebung zu messen.

## 7. Fehlende Unternehmensangaben (werden auf der Website als ⚠-Platzhalter angezeigt)

| Angabe | Status / Quelle | Wo pflegen |
|---|---|---|
| Hausnummer Firmenanschrift | Briefing: „Französische str. 10117 Berlin“ – Hausnummer fehlt | `site.ts → company.houseNumber` |
| Rechtsform | nicht angegeben (Briefing: „Inhaberin: Luna Müller“) | `company.legalForm` |
| USt-IdNr. | Im Briefing steht `34/449/06414` – das Format entspricht einer **Steuernummer**, nicht einer USt-IdNr. Steuernummer wird bewusst **nicht** veröffentlicht | `company.vatId` |
| Handelsregister | nur falls eingetragen | `company.register` |
| Handwerkskammer / Eintragung | prüfen, ob Angabe erforderlich | `company.chamber` |
| Erreichbarkeit / Bürozeiten | fehlt | `contact.openingHours` |
| E-Mail-Postfach `kontakt@osobau.de` | laut Briefing Empfänger – Postfach muss existieren | `contact.email`, `api/config.php` |
| Domain | `osobau.de` angenommen – Registrierung/Inhaber klären | `.env → VITE_SITE_URL`, `sitemap.xml`, `robots.txt`, `.htaccess`, `index.html` |
| Hosting-Anbieter | für Datenschutzerklärung | `pages/PrivacyPage.tsx` |
| Bildrechte / Urheber | je Bild bestätigen, Urheber der Visualisierung Tabbertstraße | `pages/ImprintPage.tsx` |
| Logo als Vektordatei (SVG) | nur JPG/PNG vorhanden | `public/brand/` |

## 8. Aufgaben vor der Veröffentlichung

- [ ] Alle Platzhalter in `src/config/site.ts` ersetzen (Website zeigt sonst sichtbare ⚠-Markierungen).
- [ ] Impressum + Datenschutzerklärung durch die Texte des Rechtstext-Dienstes ersetzen; Hinweisbox `LegalNotice` entfernen.
- [x] Bildzuordnung der Referenzen vom Kunden bestätigt (Bilder zeigen die jeweiligen Referenzobjekte, Reihenfolge wie geliefert).
- [ ] Freigabe, dass Auftraggeber/Objekte (AOK, Saarterrassen) namentlich als Referenz genannt werden dürfen.
- [ ] Optional: Hero-Video (10–15 s, ohne Ton, ≤ 4 MB) nach `public/video/` legen und in `src/config/site.ts → heroVideo` eintragen.
- [ ] Optional: echte, freigegebene Kundenstimmen in `src/data/testimonials.ts` eintragen (Abschnitt erscheint erst dann).
- [ ] Optional: lizenzfreies Symbolbild für den Hero (z. B. Unsplash-Lizenz) – als Symbolbild kennzeichnen, nicht als OSOBAU-Referenz.
- [ ] Leistungsbausteine („Leistungsumfang“) je Leistung, Auftraggeber-Gruppen, Ablauf-Schritte und FAQ-Antworten von OSOBAU freigeben lassen.
- [ ] Eigenes Projektfoto für **Kernsanierung** ergänzen (aktuell Gerüstfoto als Bildbeispiel, keine Kernsanierungs-Referenz).
- [ ] Einwilligung erkennbarer Personen auf `q3-verspachtelung-02` (Handwerker auf dem Gerüst) klären.
- [ ] `api/config.php` anlegen, Testversand inkl. Anhang, SPF/DKIM prüfen.
- [ ] Google Search Console einrichten, Sitemap einreichen (Konto auf OSOBAU registrieren).
- [ ] Lighthouse/axe auf der Live-Umgebung prüfen, Formulare auf echten Mobilgeräten testen.
- [ ] Optional: Prerendering (z. B. `vite-plugin-prerender` / statischer Export) für noch robustere Indexierung.

## 9. Hinweise zur Übergabe

- Das Briefing nennt „Durchgehend“ als Erreichbarkeit für Rückfragen der Agentur – das ist **nicht** als öffentliche Öffnungszeit übernommen.
- Die private Gmail-Adresse aus dem Briefing wird nirgends veröffentlicht.
- Zielgebiet laut Briefing: Berlin & Brandenburg; SEO-Fokus „Trockenbau Berlin“, „Kernsanierung Berlin“ (Firmensitz Berlin ist belegt).
