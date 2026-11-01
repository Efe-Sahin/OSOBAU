import Page from '../components/Page';
import Seo from '../components/Seo';
import Button from '../components/Button';
import { lp, useLang, useT } from '../i18n';

export default function NotFoundPage() {
  const lang = useLang();
  const n = useT().notFound;
  return (
    <Page>
      <Seo title={n.seoTitle} description={n.seoDescription} noindex />
      <section className="flex min-h-[80vh] items-center pt-32 pb-24">
        <div className="container-x">
          <p className="eyebrow mb-6 text-bronze-ink">{n.eyebrow}</p>
          <h1 className="display-lg max-w-3xl">{n.title}</h1>
          <p className="lead mt-6 max-w-xl">{n.text}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button to={lp('/', lang)}>{n.home}</Button>
            <Button to={lp('/#projekte', lang)} variant="outline">
              {n.projects}
            </Button>
          </div>
        </div>
      </section>
    </Page>
  );
}
