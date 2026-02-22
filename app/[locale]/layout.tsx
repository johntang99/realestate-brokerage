import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { defaultLocale, locales, type Locale } from '@/lib/i18n';
import { getDefaultSite, getSiteById } from '@/lib/sites';
import { getRequestSiteId, loadContent, loadFooter, loadSeo, loadTheme, loadSiteInfo } from '@/lib/content';
import type { SeoConfig, SiteInfo } from '@/lib/types';
import Header, { type JuliaHeaderConfig } from '@/components/layout/Header';
import Footer, { type JuliaFooterData } from '@/components/layout/Footer';
import { getBaseUrlFromHost } from '@/lib/seo';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const host = headers().get('host');
  const baseUrl = getBaseUrlFromHost(host);
  const requestSiteId = await getRequestSiteId();
  const site = (await getSiteById(requestSiteId)) || (await getDefaultSite());
  const locale = params.locale as Locale;
  const seo = site ? await loadSeo(site.id, locale) as SeoConfig | null : null;

  return {
    metadataBase: baseUrl,
    title: {
      default: seo?.title || 'Julia Studio — 25 Years of Timeless Interior Design',
      template: `%s | Julia Studio`,
    },
    description: seo?.description || 'Julia Studio creates timeless interior spaces for homes, offices, and exhibitions.',
    alternates: {
      canonical: new URL(`/${locale}`, baseUrl).toString(),
      languages: Object.fromEntries(
        locales.map(l => [l, new URL(`/${l}`, baseUrl).toString()])
          .concat([['x-default', new URL(`/${defaultLocale}`, baseUrl).toString()]])
      ),
    },
    openGraph: {
      type: 'website',
      siteName: 'Julia Studio',
      images: seo?.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!locales.includes(locale as Locale)) notFound();

  const host = headers().get('host');
  const requestSiteId = await getRequestSiteId();
  const site = (await getSiteById(requestSiteId)) || (await getDefaultSite());
  if (!site) return <div style={{ padding: '2rem', fontFamily: 'serif' }}>No site configured.</div>;

  const [theme, headerConfig, footer, siteInfo] = await Promise.all([
    loadTheme(site.id),
    loadContent<JuliaHeaderConfig>(site.id, locale as Locale, 'header.json'),
    loadFooter<JuliaFooterData>(site.id, locale as Locale),
    loadSiteInfo(site.id, locale as Locale) as Promise<SiteInfo | null>,
  ]);

  // Build CSS vars from theme.json
  const t = (theme as any)?.colors;
  const cssVars = t ? `:root {
    --primary: ${t.primary?.DEFAULT || '#2C2C2C'};
    --primary-dark: ${t.primary?.dark || '#1A1A1A'};
    --primary-light: ${t.primary?.light || '#4A4A4A'};
    --primary-50: ${t.primary?.['50'] || '#F5F5F5'};
    --primary-100: ${t.primary?.['100'] || '#EBEBEB'};
    --secondary: ${t.secondary?.DEFAULT || '#C4A265'};
    --secondary-dark: ${t.secondary?.dark || '#A88B50'};
    --secondary-light: ${t.secondary?.light || '#D4B87A'};
    --secondary-50: ${t.secondary?.['50'] || '#FDF8F0'};
    --accent: ${t.accent?.DEFAULT || '#8B9D83'};
    --accent-light: ${t.accent?.light || '#A3B39B'};
    --backdrop-primary: ${t.backdrop?.primary || '#FAF8F5'};
    --backdrop-secondary: ${t.backdrop?.secondary || '#1A1A1A'};
    --border: ${t.border || '#E5E2DD'};
    --text-primary: ${t.text?.primary || '#2C2C2C'};
    --text-secondary: ${t.text?.secondary || '#6B6B6B'};
  }` : '';

  return (
    <>
      {cssVars && <style dangerouslySetInnerHTML={{ __html: cssVars }} />}
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--backdrop-primary, #FAF8F5)' }}>
        <Header
          locale={locale as Locale}
          siteId={site.id}
          siteInfo={siteInfo as Record<string, unknown> | null}
          headerConfig={headerConfig}
        />
        <main className="flex-grow">{children}</main>
        <Footer
          locale={locale as Locale}
          siteId={site.id}
          footer={footer ?? undefined}
        />
      </div>
    </>
  );
}
