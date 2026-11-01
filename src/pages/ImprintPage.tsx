import Page from '../components/Page';
import Seo from '../components/Seo';
import PageIntro from '../components/PageIntro';
import Placeholder from '../components/Placeholder';
import Block from '../components/LegalBlock';
import { isMissing, site } from '../config/site';

export default function ImprintPage() {
  const c = site.company;
  return (
    <Page>
      <Seo title="Impressum – OSOBAU" description="Impressum und Anbieterkennzeichnung von OSOBAU." />
      <PageIntro title="Impressum" />

      <section className="py-16 lg:py-24">
        <div className="container-x max-w-3xl">
          <div className="grid gap-12 leading-relaxed">
            <Block title="Angaben gemäß § 5 DDG">
              <p>
                {site.name}
                <br />
                Inhaberin: {c.owner}
                <br />
                Rechtsform: <Placeholder value={c.legalForm} />
                <br />
                {c.street} <Placeholder value={c.houseNumber} />
                <br />
                {c.zip} {c.city}
                <br />
                {c.country}
              </p>
            </Block>

            <Block title="Kontakt">
              <p>
                Telefon:{' '}
                <a href={site.contact.phoneHref} className="underline underline-offset-2">
                  {site.contact.phoneDisplay}
                </a>
                <br />
                E-Mail:{' '}
                <a href={`mailto:${site.contact.email}`} className="underline underline-offset-2">
                  {site.contact.email}
                </a>
              </p>
            </Block>

            <Block title="Umsatzsteuer-ID">
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: <Placeholder value={c.vatId} />
              </p>
            </Block>

            <Block title="Registereintrag">
              <p>
                <Placeholder value={c.register} />
              </p>
            </Block>

            <Block title="Handwerksrolle / Kammer">
              <p>
                <Placeholder value={c.chamber} />
              </p>
            </Block>

            <Block title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
              <p>
                {c.owner}
                <br />
                {c.street} {isMissing(c.houseNumber) ? <Placeholder value={c.houseNumber} /> : c.houseNumber}, {c.zip}{' '}
                {c.city}
              </p>
            </Block>

            <Block title="Verbraucherstreitbeilegung">
              <p>
                <Placeholder value={{ todo: 'Angabe zur Teilnahme an Verbraucherschlichtung (§ 36 VSBG) prüfen' }} />
              </p>
            </Block>

            <Block title="Bildnachweise">
              <p>
                Projektfotos: <Placeholder value={{ todo: 'Urheber / Nutzungsrechte je Bild bestätigen' }} />
                <br />
                Visualisierung Tabbertstraße 2–3: <Placeholder value={{ todo: 'Urheber der Visualisierung' }} />
              </p>
            </Block>
          </div>
        </div>
      </section>
    </Page>
  );
}
