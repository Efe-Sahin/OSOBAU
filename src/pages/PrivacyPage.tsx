import Page from '../components/Page';
import Seo from '../components/Seo';
import PageIntro from '../components/PageIntro';
import Placeholder from '../components/Placeholder';
import Block from '../components/LegalBlock';
import { fullAddress, isMissing, site } from '../config/site';

/**
 * Entwurfsstruktur der Datenschutzerklärung – beschreibt den technischen
 * Ist-Zustand dieser Website (keine Cookies, kein Tracking, lokale Schriften).
 * Muss durch den Text des Rechtstext-Dienstes ersetzt bzw. abgeglichen werden.
 */
export default function PrivacyPage() {
  return (
    <Page>
      <Seo title="Datenschutzerklärung – OSOBAU" description="Informationen zur Verarbeitung personenbezogener Daten auf der Website von OSOBAU." />
      <PageIntro title="Datenschutzerklärung" />

      <section className="py-16 lg:py-24">
        <div className="container-x max-w-3xl">
          <div className="grid gap-12 leading-relaxed">
            <Block title="1. Verantwortliche Stelle">
              <p>
                {site.name}, Inhaberin {site.company.owner}
                <br />
                {fullAddress()}{' '}
                {isMissing(site.company.houseNumber) && <Placeholder value={site.company.houseNumber} />}
                <br />
                Telefon: {site.contact.phoneDisplay} · E-Mail: {site.contact.email}
              </p>
            </Block>

            <Block title="2. Hosting und Server-Logfiles">
              <p>
                Diese Website wird gehostet bei: <Placeholder value={{ todo: 'Hosting-Anbieter inkl. Anschrift' }} />. Beim
                Aufruf der Website verarbeitet der Server technisch notwendige Daten (z. B. IP-Adresse, Datum und Uhrzeit,
                aufgerufene Seite, Browsertyp). Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (sicherer und stabiler
                Betrieb). Speicherdauer: <Placeholder value={{ todo: 'Speicherdauer der Logfiles' }} />.
              </p>
            </Block>

            <Block title="3. Kontaktformular und Datei-Upload">
              <p>
                Wenn Sie uns über das Anfrageformular kontaktieren, verarbeiten wir Ihre Angaben (Name, Unternehmen,
                E-Mail, Telefon, Projektangaben) sowie hochgeladene Dateien ausschließlich zur Bearbeitung Ihrer Anfrage.
                Die Übertragung erfolgt verschlüsselt. Die Daten werden per E-Mail an {site.contact.email} übermittelt;
                hochgeladene Dateien werden auf dem Webserver nicht dauerhaft gespeichert.
              </p>
              <p>
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) bzw. Art. 6 Abs. 1 lit. f DSGVO.
                Die Daten werden gelöscht, sobald sie für die Bearbeitung nicht mehr erforderlich sind und keine
                gesetzlichen Aufbewahrungspflichten entgegenstehen.
              </p>
            </Block>

            <Block title="4. Kontakt per E-Mail oder Telefon">
              <p>
                Bei einer Kontaktaufnahme per E-Mail oder Telefon verarbeiten wir Ihre Angaben zur Bearbeitung Ihres
                Anliegens (Art. 6 Abs. 1 lit. b bzw. f DSGVO).
              </p>
            </Block>

            <Block title="5. Schriftarten, Cookies und Analyse">
              <p>
                Die verwendeten Schriftarten werden lokal von unserem Server geladen; es findet keine Verbindung zu Servern
                Dritter (z. B. Google) statt. Diese Website setzt keine Cookies zu Analyse- oder Werbezwecken und verwendet
                keine Tracking-Dienste.
              </p>
            </Block>

            <Block title="6. Ihre Rechte">
              <p>
                Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
                Datenübertragbarkeit sowie Widerspruch gegen die Verarbeitung (Art. 15–21 DSGVO). Zudem können Sie sich bei
                einer Datenschutz-Aufsichtsbehörde beschweren, z. B. bei der Berliner Beauftragten für Datenschutz und
                Informationsfreiheit.
              </p>
            </Block>
          </div>
        </div>
      </section>
    </Page>
  );
}
