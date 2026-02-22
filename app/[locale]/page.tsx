import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadAllItems } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import { ArrowRight, ChevronDown } from 'lucide-react';

export const revalidate = 3600; // 1 hour ISR

interface PageProps { params: { locale: Locale } }

// ── Content types ──────────────────────────────────────────────────────────────
interface HeroSlide { image?: string; alt?: string; altCn?: string }
interface NavCta { label: string; labelCn?: string; href: string }

interface HomeContent {
  hero?: {
    variant?: string;
    slides?: HeroSlide[];
    tagline?: string; taglineCn?: string;
    logoOverlay?: boolean; scrollIndicator?: boolean;
  };
  introduction?: {
    variant?: string;
    headline?: string; headlineCn?: string;
    body?: string; bodyCn?: string;
    image?: string;
    ctaLabel?: string; ctaLabelCn?: string; ctaHref?: string;
  };
  portfolioPreview?: {
    headline?: string; headlineCn?: string;
    projectSlugs?: string[];
    ctaLabel?: string; ctaLabelCn?: string; ctaHref?: string;
  };
  servicesOverview?: {
    headline?: string; headlineCn?: string;
    services?: Array<{ icon?: string; title?: string; titleCn?: string; description?: string; descriptionCn?: string; href?: string }>;
  };
  shopPreview?: {
    headline?: string; headlineCn?: string;
    productSlugs?: string[];
    ctaLabel?: string; ctaLabelCn?: string; ctaHref?: string;
  };
  journalPreview?: {
    headline?: string; headlineCn?: string;
    postCount?: number;
    ctaLabel?: string; ctaLabelCn?: string; ctaHref?: string;
  };
  aboutTeaser?: {
    image?: string;
    headline?: string; headlineCn?: string;
    body?: string; bodyCn?: string;
    ctaLabel?: string; ctaLabelCn?: string; ctaHref?: string;
  };
  consultationCta?: {
    variant?: string;
    headline?: string; headlineCn?: string;
    subline?: string; sublineCn?: string;
    ctaLabel?: string; ctaLabelCn?: string; ctaHref?: string;
    backgroundImage?: string;
  };
}

interface PortfolioItem { slug: string; title?: string; titleCn?: string; coverImage?: string; category?: string }
interface ShopItem { slug: string; title?: string; titleCn?: string; images?: Array<{ src?: string }>; price?: number }
interface JournalItem { slug: string; title?: string; titleCn?: string; coverImage?: string; type?: string; date?: string; category?: string }

export async function generateMetadata({ params }: PageProps) {
  const siteId = await getRequestSiteId();
  return buildPageMetadata({ siteId, locale: params.locale, slug: 'home',
    title: 'Julia Studio — 25 Years of Timeless Interior Design',
    description: 'Julia Studio creates timeless interior spaces for homes, offices, and exhibitions. 25 years of design excellence, 1,000+ projects completed.' });
}

function tx(en: string | undefined, cn: string | undefined, locale: Locale): string {
  return (locale === 'zh' && cn) ? cn : (en || '');
}

// ── Service icon map (simple) ──────────────────────────────────────────────────
function ServiceIcon({ icon }: { icon?: string }) {
  const size = 'w-6 h-6';
  if (icon === 'hammer') return <svg className={size} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 5.25L18.75 8.25M3.75 20.25l9-9M14.25 3.75L20.25 9.75l-1.5 1.5L12.75 5.25l1.5-1.5z"/></svg>;
  if (icon === 'sofa') return <svg className={size} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5V15m0 0H3.75M20.25 15v2.25M3.75 15V7.5m0 7.5v2.25M6 7.5A2.25 2.25 0 018.25 5.25h7.5A2.25 2.25 0 0118 7.5v2.25H6V7.5z"/></svg>;
  // palette default
  return <svg className={size} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"/></svg>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [content, portfolioItems, shopItems, journalItems] = await Promise.all([
    loadPageContent<HomeContent>('home', locale, siteId),
    loadAllItems<PortfolioItem>(siteId, locale, 'portfolio'),
    loadAllItems<ShopItem>(siteId, locale, 'shop-products'),
    loadAllItems<JournalItem>(siteId, locale, 'journal'),
  ]);

  if (!content) notFound();

  const h = content.hero || {};
  const slides = h.slides?.filter(s => s.image) || [];
  const tagline = tx(h.tagline, h.taglineCn, locale);

  // Sort and limit collection items
  const previewProjects = (content.portfolioPreview?.projectSlugs || [])
    .map(slug => portfolioItems.find(p => p.slug === slug))
    .filter(Boolean) as PortfolioItem[];
  const fallbackProjects = portfolioItems.slice(0, 6);
  const displayProjects = previewProjects.length ? previewProjects : fallbackProjects;

  const previewProducts = (content.shopPreview?.productSlugs || [])
    .map(slug => shopItems.find(p => p.slug === slug))
    .filter(Boolean) as ShopItem[];
  const displayProducts = previewProducts.length ? previewProducts : shopItems.slice(0, 5);

  const displayJournal = journalItems.slice(0, content.journalPreview?.postCount || 3);

  const intro = content.introduction || {};
  const services = content.servicesOverview || {};
  const shop = content.shopPreview || {};
  const journal = content.journalPreview || {};
  const about = content.aboutTeaser || {};
  const cta = content.consultationCta || {};

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-end overflow-hidden" style={{ background: '#1A1A1A' }}>
        {/* Slideshow background */}
        {slides.length > 0 ? (
          slides.slice(0, 1).map((slide, i) => (
            <div key={i} className="absolute inset-0">
              <Image
                src={slide.image!}
                alt={tx(slide.alt, slide.altCn, locale) || 'Julia Studio'}
                fill
                className="object-cover opacity-75"
                priority
                sizes="100vw"
              />
            </div>
          ))
        ) : (
          // placeholder gradient when no images yet
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #2C2C2C 0%, #1A1A1A 60%, #4A4A4A 100%)' }} />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,26,26,0.7) 0%, rgba(26,26,26,0.2) 60%, transparent 100%)' }} />

        {/* Content */}
        <div className="relative z-10 container-custom pb-20 pt-32">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: 'var(--secondary, #C4A265)' }}>
              Julia Studio
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-semibold text-white leading-tight mb-6">
              {tagline || '25 Years of Timeless Design'}
            </h1>
            <Link
              href={`/${locale}/portfolio`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors group"
            >
              {locale === 'zh' ? '探索作品集' : 'Explore Our Work'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        {h.scrollIndicator !== false && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
            <ChevronDown className="w-5 h-5 text-white/50" />
          </div>
        )}
      </section>

      {/* ── INTRODUCTION ────────────────────────────────────────────────────── */}
      <section className="section-padding" style={{ background: 'var(--backdrop-primary, #FAF8F5)' }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-6" style={{ color: 'var(--primary)' }}>
                {tx(intro.headline, intro.headlineCn, locale) || 'Spaces That Transcend Trends'}
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)', maxWidth: '44ch' }}>
                {tx(intro.body, intro.bodyCn, locale)}
              </p>
              {intro.ctaHref && (
                <Link
                  href={`/${locale}${intro.ctaHref}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold group"
                  style={{ color: 'var(--secondary)' }}
                >
                  {tx(intro.ctaLabel, intro.ctaLabelCn, locale) || 'Our Story'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              {intro.image ? (
                <Image src={intro.image} alt="Julia Studio" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
              ) : (
                <div className="w-full h-full" style={{ background: 'var(--primary-50, #F5F5F5)' }} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO PREVIEW ─────────────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold" style={{ color: 'var(--primary)' }}>
              {tx(content.portfolioPreview?.headline, content.portfolioPreview?.headlineCn, locale) || 'Selected Work'}
            </h2>
            <Link href={`/${locale}${content.portfolioPreview?.ctaHref || '/portfolio'}`}
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold group" style={{ color: 'var(--secondary)' }}>
              {tx(content.portfolioPreview?.ctaLabel, content.portfolioPreview?.ctaLabelCn, locale) || 'View All'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayProjects.map((project, i) => (
              <Link
                key={project.slug}
                href={`/${locale}/portfolio/${project.slug}`}
                className={`group relative overflow-hidden block ${i === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
              >
                <div className={`relative overflow-hidden ${i === 0 ? 'aspect-[4/3]' : 'aspect-[4/3]'}`}>
                  {project.coverImage ? (
                    <Image
                      src={project.coverImage}
                      alt={tx(project.title, project.titleCn, locale) || ''}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full" style={{ background: `hsl(${(i * 37) % 360}, 10%, 88%)` }} />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ background: 'linear-gradient(transparent, rgba(26,26,26,0.7))' }}>
                    <p className="text-white font-serif text-lg font-medium">{tx(project.title, project.titleCn, locale)}</p>
                    <p className="text-white/60 text-xs uppercase tracking-widest mt-1">{project.category}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 md:hidden text-center">
            <Link href={`/${locale}${content.portfolioPreview?.ctaHref || '/portfolio'}`} className="btn-gold text-sm">
              {tx(content.portfolioPreview?.ctaLabel, content.portfolioPreview?.ctaLabelCn, locale) || 'View All Projects'}
            </Link>
          </div>
        </div>
      </section>

      {/* ── SERVICES OVERVIEW ─────────────────────────────────────────────────── */}
      <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-12 text-center" style={{ color: 'var(--primary)' }}>
            {tx(services.headline, services.headlineCn, locale) || 'What We Do'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(services.services || []).map((svc, i) => (
              <Link
                key={i}
                href={`/${locale}${svc.href || '/services'}`}
                className="group p-8 border border-[var(--border)] hover:border-[var(--secondary)] transition-colors bg-white"
              >
                <div className="mb-5 text-[var(--secondary)]">
                  <ServiceIcon icon={svc.icon} />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3" style={{ color: 'var(--primary)' }}>
                  {tx(svc.title, svc.titleCn, locale)}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {tx(svc.description, svc.descriptionCn, locale)}
                </p>
                <div className="mt-5 flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all" style={{ color: 'var(--secondary)' }}>
                  {locale === 'zh' ? '了解更多' : 'Learn More'} <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOP PREVIEW ─────────────────────────────────────────────────────── */}
      {displayProducts.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-10">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold" style={{ color: 'var(--primary)' }}>
                {tx(shop.headline, shop.headlineCn, locale) || 'Shop Julia Studio'}
              </h2>
              <Link href={`/${locale}${shop.ctaHref || '/shop'}`} className="hidden md:flex items-center gap-1.5 text-sm font-semibold group" style={{ color: 'var(--secondary)' }}>
                {tx(shop.ctaLabel, shop.ctaLabelCn, locale) || 'Shop All'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar">
              {displayProducts.map(product => (
                <Link
                  key={product.slug}
                  href={`/${locale}/shop/${product.slug}`}
                  className="group flex-shrink-0 w-60"
                >
                  <div className="relative aspect-square overflow-hidden mb-3 bg-[var(--primary-50)]">
                    {product.images?.[0]?.src ? (
                      <Image src={product.images[0].src} alt={tx(product.title, product.titleCn, locale) || ''} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="240px" />
                    ) : (
                      <div className="w-full h-full bg-[var(--primary-50)]" />
                    )}
                  </div>
                  <p className="font-serif text-sm font-medium" style={{ color: 'var(--primary)' }}>{tx(product.title, product.titleCn, locale)}</p>
                  {product.price && <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>${product.price.toLocaleString()}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── JOURNAL PREVIEW ──────────────────────────────────────────────────── */}
      {displayJournal.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
          <div className="container-custom">
            <div className="flex items-end justify-between mb-10">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold" style={{ color: 'var(--primary)' }}>
                {tx(journal.headline, journal.headlineCn, locale) || 'From the Journal'}
              </h2>
              <Link href={`/${locale}${journal.ctaHref || '/journal'}`} className="hidden md:flex items-center gap-1.5 text-sm font-semibold group" style={{ color: 'var(--secondary)' }}>
                {tx(journal.ctaLabel, journal.ctaLabelCn, locale) || 'Read More'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {displayJournal.map(post => (
                <Link key={post.slug} href={`/${locale}/journal/${post.slug}`} className="group">
                  <div className="relative aspect-[4/3] overflow-hidden mb-4 bg-[var(--primary-50)]">
                    {post.coverImage ? (
                      <Image src={post.coverImage} alt={tx(post.title, post.titleCn, locale) || ''} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
                    ) : (
                      <div className="w-full h-full bg-[var(--primary-50)]" />
                    )}
                    {post.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center">
                          <svg className="w-5 h-5 ml-1" fill="var(--primary)" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--secondary)' }}>{post.category}</span>
                  <h3 className="font-serif text-lg font-medium mt-2 group-hover:opacity-70 transition-opacity" style={{ color: 'var(--primary)' }}>
                    {tx(post.title, post.titleCn, locale)}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{post.date}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ABOUT TEASER ─────────────────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[3/4] overflow-hidden max-w-sm mx-auto lg:mx-0">
              {about.image ? (
                <Image src={about.image} alt="Julia" fill className="object-cover" sizes="(max-width:1024px) 100vw, 400px" />
              ) : (
                <div className="w-full h-full" style={{ background: 'var(--primary-50)' }} />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: 'var(--secondary)' }}>
                {tx(about.headline, about.headlineCn, locale) || 'Meet Julia'}
              </p>
              <p className="font-serif text-2xl md:text-3xl leading-relaxed mb-8" style={{ color: 'var(--primary)' }}>
                {tx(about.body, about.bodyCn, locale) || '25 years. 1,000+ projects. One vision: timeless design.'}
              </p>
              {about.ctaHref && (
                <Link href={`/${locale}${about.ctaHref}`} className="inline-flex items-center gap-2 text-sm font-semibold group" style={{ color: 'var(--secondary)' }}>
                  {tx(about.ctaLabel, about.ctaLabelCn, locale) || 'Our Story'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONSULTATION CTA ─────────────────────────────────────────────────── */}
      <section className="relative section-padding overflow-hidden" style={{ background: 'var(--primary, #2C2C2C)' }}>
        {cta.backgroundImage && (
          <>
            <div className="absolute inset-0">
              <Image src={cta.backgroundImage} alt="" fill className="object-cover opacity-30" sizes="100vw" />
            </div>
            <div className="absolute inset-0 bg-[var(--primary)]/70" />
          </>
        )}
        <div className="relative z-10 container-custom text-center">
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-white mb-5 max-w-2xl mx-auto">
            {tx(cta.headline, cta.headlineCn, locale) || 'Begin Your Design Journey'}
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
            {tx(cta.subline, cta.sublineCn, locale)}
          </p>
          <Link href={`/${locale}${cta.ctaHref || '/contact'}`} className="btn-gold text-base px-10 py-4">
            {tx(cta.ctaLabel, cta.ctaLabelCn, locale) || 'Book Consultation'}
          </Link>
        </div>
      </section>
    </>
  );
}
