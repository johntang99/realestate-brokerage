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
      default: seo?.title || 'Alexandra Reeves — Westchester County Real Estate',
      template: seo?.titleTemplate || '%s | Alexandra Reeves Real Estate',
    },
    description: seo?.description || 'Alexandra Reeves is Westchester County\'s premier real estate agent. 18 years of expertise, $150M+ in career sales.',
    alternates: {
      canonical: new URL(`/${locale}`, baseUrl).toString(),
    },
    openGraph: {
      type: 'website',
      siteName: 'Alexandra Reeves Real Estate',
      images: seo?.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
    icons: {
      icon: [
        { url: '/favicon.svg?v=1', type: 'image/svg+xml' },
        { url: '/icon?v=1', type: 'image/png', sizes: '32x32' },
      ],
      shortcut: '/favicon.svg?v=1',
      apple: [{ url: '/icon?v=1', type: 'image/png', sizes: '180x180' }],
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

  const requestSiteId = await getRequestSiteId();
  const site = (await getSiteById(requestSiteId)) || (await getDefaultSite());
  if (!site) return <div style={{ padding: '2rem', fontFamily: 'serif' }}>No site configured.</div>;

  const [theme, headerConfig, footer, siteInfo] = await Promise.all([
    loadTheme(site.id),
    loadContent<JuliaHeaderConfig>(site.id, locale as Locale, 'header.json'),
    loadFooter<JuliaFooterData>(site.id, locale as Locale),
    loadSiteInfo(site.id, locale as Locale) as Promise<SiteInfo | null>,
  ]);

  const c = (theme as any)?.colors || {};
  const r = (theme as any)?.borderRadius || {};
  const fx = (theme as any)?.effects || {};
  const sp = (theme as any)?.spacing || {};

  const cssVars = `:root {
    --primary: ${c.primary || '#1B2838'};
    --secondary: ${c.secondary || '#C8A97E'};
    --accent: ${c.accent || '#4A7C5B'};
    --backdrop-primary: ${c.backdropLight || '#FAF9F7'};
    --backdrop-secondary: ${c.backdropDark || '#1A1A1A'};
    --border: ${c.border || '#E5E7EB'};
    --text-primary: ${c.textPrimary || '#2C2C2C'};
    --text-secondary: ${c.textSecondary || '#6B7280'};
    --text-on-dark: ${c.textOnDark || '#FFFFFF'};
    --text-on-dark-muted: ${c.textOnDarkMuted || '#D1D5DB'};
    --status-sold: ${c.statusSold || '#C53030'};
    --status-pending: ${c.statusPending || '#D97706'};
    --status-active: ${c.statusActive || '#059669'};
    --status-lease: ${c.statusLease || '#3B82F6'};
    --gold-star: ${c.goldStar || '#F59E0B'};
    --success: ${c.success || '#059669'};
    --warning: ${c.warning || '#D97706'};
    --error: ${c.error || '#C53030'};
    --radius-small: ${r.small || '4px'};
    --radius-medium: ${r.medium || '8px'};
    --radius-large: ${r.large || '12px'};
    --card-radius: ${r.card || '8px'};
    --card-shadow: ${fx.cardShadow || '0 4px 20px rgba(0,0,0,0.08)'};
    --card-shadow-hover: ${fx.cardHoverShadow || '0 8px 30px rgba(0,0,0,0.15)'};
    --card-hover-scale: ${fx.cardHoverScale || '1.02'};
    --hero-overlay-opacity: ${fx.heroOverlayOpacity || '0.45'};
    --section-gap: ${sp.sectionGap || '80px'};
    --section-gap-mobile: ${sp.sectionGapMobile || '48px'};
    --card-gap: ${sp.cardGap || '24px'};
    --content-max-width: ${sp.contentMaxWidth || '1280px'};
    --btn-gold-fill: ${c.secondary || '#C8A97E'};
    --btn-gold-fill-hover: #b8956a;
    --btn-gold-text: #1A1A1A;
    --on-dark-medium: rgba(255,255,255,0.65);
    --on-dark-subtle: rgba(255,255,255,0.4);
    --backdrop-primary-rgb: 250 249 247;
    --hero-overlay-rgb: 27 40 56;
  }`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--backdrop-primary, #FAF9F7)' }}>
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
          siteInfo={siteInfo as Record<string, unknown> | null}
        />
      </div>
    </>
  );
}
