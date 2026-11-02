import { isMissing, site } from '../config/site';

/**
 * Strukturierte Daten (schema.org) – nur belegte Angaben.
 * Straße/Hausnummer werden erst ausgegeben, wenn die Hausnummer bestätigt ist.
 */
export function organizationSchema() {
  const c = site.company;
  const address: Record<string, string> = {
    '@type': 'PostalAddress',
    postalCode: c.zip,
    addressLocality: c.city,
    addressCountry: 'DE',
  };
  if (!isMissing(c.houseNumber)) address.streetAddress = `${c.street} ${c.houseNumber}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    '@id': `${site.url}/#organisation`,
    name: site.name,
    url: site.url,
    logo: `${site.url}/brand/osobau-logo-dunkel.png`,
    image: `${site.url}/og-image.jpg`,
    telephone: site.contact.phoneDisplay.replace(/\s/g, ''),
    email: site.contact.email,
    address,
    areaServed: site.serviceArea.map((name) => ({ '@type': 'AdministrativeArea', name })),
    foundingDate: '2022',
    numberOfEmployees: { '@type': 'QuantitativeValue', value: 13 },
    knowsAbout: ['Trockenbau', 'Kernsanierung', 'Brandschutzarbeiten im Trockenbau', 'Innenausbau'],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path}`,
    })),
  };
}
