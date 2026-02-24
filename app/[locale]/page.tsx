'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Bed, Bath, Maximize2, Star, ChevronLeft, ChevronRight, Search, Home, DollarSign, Key, Building2, TrendingUp, Truck } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Slide { image?: string; alt?: string }
interface StatItem { value?: string; label?: string; prefix?: string; suffix?: string }
interface ServiceItem { icon?: string; title?: string; description?: string; href?: string }
interface Property {
  slug: string; address?: string; city?: string; state?: string;
  price?: number; priceDisplay?: string; status?: string; type?: string;
  beds?: number; baths?: number; sqft?: number; coverImage?: string; featured?: boolean;
  soldDetails?: { soldPrice?: number; soldDate?: string };
}
interface Neighborhood { slug: string; name?: string; tagline?: string; coverImage?: string; marketSnapshot?: { medianPrice?: string } }
interface Testimonial { id?: string; quote?: string; author?: string; title?: string; rating?: number }
interface BlogPost { slug: string; title?: string; category?: string; date?: string; coverImage?: string; excerpt?: string; type?: string }
interface SiteData { name?: string; stats?: Record<string, string>; phone?: string }

interface HomeData {
  hero?: { variant?: string; overlayMode?: 'focus-text' | 'soft-full'; slides?: Slide[]; headline?: string; subline?: string; ctaPrimary?: { label?: string; href?: string }; ctaSecondary?: { label?: string; href?: string }; overlayOpacity?: number }
  quickSearch?: { headline?: string; submitLabel?: string }
  statsBar?: { variant?: string; items?: StatItem[] }
  featuredListings?: { headline?: string; subline?: string; propertySlugs?: string[]; maxDisplay?: number; ctaLabel?: string; ctaHref?: string }
  servicesOverview?: { headline?: string; subline?: string; items?: ServiceItem[] }
  neighborhoodSpotlight?: { headline?: string; subline?: string; neighborhoodSlugs?: string[]; ctaLabel?: string; ctaHref?: string }
  testimonialPreview?: { headline?: string; testimonialIds?: string[]; ctaLabel?: string; ctaHref?: string }
  recentSold?: { headline?: string; subline?: string; maxDisplay?: number; ctaLabel?: string; ctaHref?: string }
  blogPreview?: { headline?: string; subline?: string; maxDisplay?: number; ctaLabel?: string; ctaHref?: string }
  valuationCta?: { headline?: string; subline?: string; backgroundImage?: string; ctaLabel?: string; ctaHref?: string }
  agentIntro?: { portrait?: string; portraitAlt?: string; headline?: string; body?: string; ctaLabel?: string; ctaHref?: string }
  consultationCta?: { headline?: string; subline?: string; backgroundImage?: string; ctaLabel?: string; ctaHref?: string }
}

// ── Icon map ───────────────────────────────────────────────────────────────────
const ICONS: Record<string, React.ElementType> = {
  Home, DollarSign, Key, Building2, TrendingUp, Truck,
};

// ── Status badge ───────────────────────────────────────────────────────────────
const STATUS_BADGE: Record<string, string> = {
  'for-sale': 'status-badge-active', pending: 'status-badge-pending',
  sold: 'status-badge-sold', 'for-lease': 'status-badge-lease',
};
const STATUS_LABEL: Record<string, string> = {
  'for-sale': 'For Sale', pending: 'Pending', sold: 'Sold', 'for-lease': 'For Lease',
};

// ── Property Card ──────────────────────────────────────────────────────────────
function PropertyCard({ p, locale, showSold }: { p: Property; locale: string; showSold?: boolean }) {
  const price = showSold && p.soldDetails?.soldPrice
    ? `$${p.soldDetails.soldPrice.toLocaleString()}`
    : p.priceDisplay || (p.price ? `$${p.price.toLocaleString()}` : '');

  return (
    <Link href={`/${locale}/properties/${p.slug}`} className="group block property-card flex-shrink-0" style={{ minWidth: '280px' }}>
      <div className="relative aspect-[4/3] overflow-hidden" style={{ borderRadius: 'var(--card-radius) var(--card-radius) 0 0' }}>
        {p.coverImage
          ? <Image src={p.coverImage} alt={p.address || ''} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="300px" />
          : <div className="w-full h-full" style={{ background: 'var(--backdrop-primary)' }} />}
        <div className="absolute top-3 left-3">
          <span className={`status-badge ${showSold ? 'status-badge-sold' : (STATUS_BADGE[p.status || ''] || '')}`}>
            {showSold ? 'SOLD' : (STATUS_LABEL[p.status || ''] || p.status)}
          </span>
        </div>
      </div>
      <div className="p-4">
        <p className="price-display text-lg mb-1">{price}</p>
        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{p.address}</p>
        <p className="text-xs mb-2 truncate" style={{ color: 'var(--text-secondary)' }}>{p.city}, {p.state}</p>
        <div className="flex gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
          {p.beds ? <span className="flex items-center gap-0.5"><Bed className="w-3 h-3" />{p.beds}</span> : null}
          {p.baths ? <span className="flex items-center gap-0.5"><Bath className="w-3 h-3" />{p.baths}</span> : null}
          {p.sqft ? <span className="flex items-center gap-0.5"><Maximize2 className="w-3 h-3" />{p.sqft.toLocaleString()}</span> : null}
        </div>
      </div>
    </Link>
  );
}

// ── Star rating ───────────────────────────────────────────────────────────────
function Stars({ count }: { count?: number }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= (count || 5) ? 'star-filled fill-current' : 'star-empty'}`} />
      ))}
    </div>
  );
}

// ── Animated count ─────────────────────────────────────────────────────────────
function AnimatedStat({ item }: { item: StatItem }) {
  const [displayed, setDisplayed] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const target = parseInt(item.value?.replace(/\D/g, '') || '0', 10);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) { setStarted(true); }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started || target === 0) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      setDisplayed(Math.round(current));
      if (current >= target) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <div ref={ref} className="text-center px-4">
      <p className="stat-number text-4xl md:text-5xl mb-2">
        {item.prefix}{displayed.toLocaleString()}{item.suffix}
      </p>
      <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{item.label}</p>
    </div>
  );
}

// ── Hero Slideshow ─────────────────────────────────────────────────────────────
function HeroSlideshow({ slides, headline, subline, ctaPrimary, ctaSecondary, overlayOpacity, locale, variant }: {
  slides: Slide[]; headline?: string; subline?: string;
  ctaPrimary?: { label?: string; href?: string }; ctaSecondary?: { label?: string; href?: string };
  overlayOpacity?: number; locale: string; variant?: string;
}) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setActive(i => (i + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden flex items-end">
      {slides.map((slide, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === active ? 'opacity-100' : 'opacity-0'}`}>
          {slide.image
            ? <Image src={slide.image} alt={slide.alt || ''} fill className="object-cover opacity-100" priority={i === 0} sizes="100vw" />
            : <div className="w-full h-full" style={{ background: 'var(--primary)' }} />}
        </div>
      ))}
      <div
        className="absolute inset-0"
        style={{
          background: variant === 'gallery-background'
            ? 'linear-gradient(to top right, rgba(26,26,26,0.26) 0%, rgba(26,26,26,0.08) 42%, rgba(26,26,26,0.02) 72%, transparent 100%)'
            : `linear-gradient(to top right, rgba(27,40,56,${Math.min((overlayOpacity ?? 0.2) + 0.12, 0.34)}) 0%, rgba(27,40,56,${Math.min((overlayOpacity ?? 0.2) * 0.45, 0.11)}) 42%, rgba(27,40,56,0.02) 72%, transparent 100%)`,
        }}
      />

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === active ? 'bg-white w-6' : 'bg-white/40'}`} />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container-custom pb-24 md:pb-32 w-full">
        <div
          className={variant === 'gallery-background' ? 'max-w-2xl rounded-sm px-6 py-6 md:px-8 md:py-7' : 'max-w-3xl'}
          style={variant === 'gallery-background'
            ? {
                background: 'rgba(26,26,26,0.10)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.22)',
              }
            : undefined}
        >
          <h1 className="font-serif text-4xl md:text-6xl font-semibold text-white mb-4 leading-tight"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.35)' }}>
            {headline || 'Find Your Perfect Home'}
          </h1>
          <p className="text-lg md:text-xl text-white/85 mb-8 max-w-xl"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.28)' }}>
            {subline}
          </p>
          <div className="flex flex-wrap gap-3">
            {ctaPrimary?.href && (
              <Link href={`/${locale}${ctaPrimary.href}`} className="btn-gold text-sm px-7 py-3">
                {ctaPrimary.label || 'Schedule Consultation'}
              </Link>
            )}
            {ctaSecondary?.href && (
              <Link href={`/${locale}${ctaSecondary.href}`}
                className="border-2 border-white text-white hover:bg-white/15 transition-colors text-sm px-7 py-3 font-semibold"
                style={{ borderRadius: 'max(var(--radius-small,2px),3px)' }}>
                {ctaSecondary.label || 'View Properties'}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 right-8 z-20 flex flex-col items-center gap-1">
        <div className="w-px h-12 bg-white/40" />
        <span className="text-white/50 text-xs rotate-90 tracking-widest">SCROLL</span>
      </div>
    </section>
  );
}

// ── Quick Search Bar ───────────────────────────────────────────────────────────
function QuickSearch({ locale, headline }: { locale: string; headline?: string }) {
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [beds, setBeds] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (price) params.set('price', price);
    if (beds) params.set('beds', beds);
    window.location.href = `/${locale}/properties?${params.toString()}`;
  };

  return (
    <div className="relative z-20 -mt-8">
      <div className="container-custom">
        <div className="bg-white shadow-2xl p-5 md:p-6" style={{ borderRadius: 'var(--card-radius)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>
            {headline || 'Search Properties'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <select value={type} onChange={e => setType(e.target.value)}
              className="calc-input col-span-2 md:col-span-1">
              <option value="">All Types</option>
              <option value="single-family">Single Family</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="commercial">Commercial</option>
              <option value="multi-family">Multi-Family</option>
            </select>
            <select value={price} onChange={e => setPrice(e.target.value)} className="calc-input">
              <option value="">Any Price</option>
              <option value="0-500000">Under $500K</option>
              <option value="500000-1000000">$500K–$1M</option>
              <option value="1000000-2000000">$1M–$2M</option>
              <option value="2000000-3500000">$2M–$3.5M</option>
              <option value="3500000+">$3.5M+</option>
            </select>
            <select value={beds} onChange={e => setBeds(e.target.value)} className="calc-input">
              <option value="">Any Beds</option>
              <option value="1">1+ Bed</option>
              <option value="2">2+ Beds</option>
              <option value="3">3+ Beds</option>
              <option value="4">4+ Beds</option>
              <option value="5+">5+ Beds</option>
            </select>
            <input value={location} onChange={e => setLocation(e.target.value)}
              placeholder="Neighborhood or city…"
              className="calc-input col-span-2 md:col-span-1"
              onKeyDown={e => e.key === 'Enter' && handleSearch()} />
            <button onClick={handleSearch}
              className="btn-gold flex items-center justify-center gap-2 col-span-2 md:col-span-1">
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [homeData, setHomeData] = useState<HomeData>({});
  const [siteData, setSiteData] = useState<SiteData>({});
  const [properties, setProperties] = useState<Property[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    Promise.all([
      fetch(`/api/content/file?locale=${loc}&path=pages/home.json`).then(r => r.json()),
      fetch(`/api/content/file?locale=${loc}&path=site.json`).then(r => r.json()),
      fetch(`/api/content/items?locale=${loc}&directory=properties`).then(r => r.json()),
      fetch(`/api/content/items?locale=${loc}&directory=neighborhoods`).then(r => r.json()),
      fetch(`/api/content/file?locale=${loc}&path=testimonials.json`).then(r => r.json()),
      fetch(`/api/content/items?locale=${loc}&directory=blog`).then(r => r.json()),
    ]).then(([homeRes, siteRes, propsRes, nbRes, testRes, blogRes]) => {
      try { setHomeData(JSON.parse(homeRes.content || '{}')); } catch {}
      try { setSiteData(JSON.parse(siteRes.content || '{}')); } catch {}
      setProperties(Array.isArray(propsRes.items) ? propsRes.items as Property[] : []);
      setNeighborhoods(Array.isArray(nbRes.items) ? nbRes.items as Neighborhood[] : []);
      try {
        const t = JSON.parse(testRes.content || '{}');
        setTestimonials(Array.isArray(t.items) ? t.items : []);
      } catch {}
      const blogItems = Array.isArray(blogRes.items) ? blogRes.items as BlogPost[] : [];
      setPosts(blogItems.sort((a, b) => (b.date || '').localeCompare(a.date || '')));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Auto-rotate testimonial
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const t = setInterval(() => setActiveTestimonial(i => (i + 1) % Math.min(testimonials.length, 3)), 6000);
    return () => clearInterval(t);
  }, [testimonials.length]);

  const h = homeData;
  const slides = h.hero?.slides?.filter(s => s.image) || [];
  const featuredProps = properties.filter(p => p.featured && p.status !== 'sold').slice(0, h.featuredListings?.maxDisplay || 6);
  const spotlightNbs = (h.neighborhoodSpotlight?.neighborhoodSlugs || []).map(s => neighborhoods.find(n => n.slug === s)).filter(Boolean) as Neighborhood[];
  const displayNbs = spotlightNbs.length > 0 ? spotlightNbs : neighborhoods.slice(0, 3);
  const previewTests = (h.testimonialPreview?.testimonialIds || []).map(id => testimonials.find(t => t.id === id)).filter(Boolean) as Testimonial[];
  const displayTests = previewTests.length > 0 ? previewTests : testimonials.filter(t => (t as any).featured).slice(0, 3);
  const soldProps = properties.filter(p => p.status === 'sold').slice(0, h.recentSold?.maxDisplay || 4);
  const recentPosts = posts.slice(0, h.blogPreview?.maxDisplay || 3);
  const stats: StatItem[] = h.statsBar?.items || [
    { value: '150', label: 'In Career Sales', prefix: '$', suffix: 'M+' },
    { value: '500', label: 'Families Helped', suffix: '+' },
    { value: '18', label: 'Years of Experience' },
    { value: '200', label: 'Five-Star Reviews', suffix: '+' },
  ];
  const services: ServiceItem[] = h.servicesOverview?.items || [
    { icon: 'Home', title: 'Buying', description: 'Expert guidance from search to closing.', href: '/services#buying' },
    { icon: 'DollarSign', title: 'Selling', description: 'Strategic pricing and premium marketing.', href: '/services#selling' },
    { icon: 'Key', title: 'Leasing', description: 'Rental placement for landlords and tenants.', href: '/services#leasing' },
    { icon: 'Building2', title: 'Commercial', description: 'Office, retail, and investment transactions.', href: '/services#commercial' },
    { icon: 'TrendingUp', title: 'Investment', description: 'Portfolio analysis and ROI modeling.', href: '/services#investment' },
    { icon: 'Truck', title: 'Relocation', description: 'Seamless transitions to Westchester County.', href: '/services#relocation' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-2 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--secondary)', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 1. HERO SLIDESHOW */}
      {slides.length > 0 ? (
        <HeroSlideshow
          slides={slides}
          headline={h.hero?.headline}
          subline={h.hero?.subline}
          ctaPrimary={h.hero?.ctaPrimary}
          ctaSecondary={h.hero?.ctaSecondary}
          overlayOpacity={h.hero?.overlayOpacity}
          variant={h.hero?.variant}
          locale={locale}
        />
      ) : (
        <section className="relative min-h-[70vh] flex items-end" style={{ background: 'var(--primary)' }}>
          <div className="relative z-10 container-custom pb-20 w-full">
            <h1 className="font-serif text-4xl md:text-6xl font-semibold text-white mb-4 max-w-3xl leading-tight">
              {h.hero?.headline || 'Find Your Perfect Home in Westchester County'}
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-xl">{h.hero?.subline}</p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/${locale}${h.hero?.ctaPrimary?.href || '/contact'}`} className="btn-gold px-7 py-3">
                {h.hero?.ctaPrimary?.label || 'Schedule Consultation'}
              </Link>
              <Link href={`/${locale}${h.hero?.ctaSecondary?.href || '/properties'}`}
                className="border-2 border-white text-white hover:bg-white/15 transition-colors px-7 py-3 font-semibold text-sm"
                style={{ borderRadius: 'max(var(--radius-small,2px),3px)' }}>
                {h.hero?.ctaSecondary?.label || 'View Properties'}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 2. QUICK SEARCH */}
      <QuickSearch locale={locale} headline={h.quickSearch?.headline} />

      {/* 3. STATS BAR */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[var(--border)]">
            {stats.map((item, i) => <AnimatedStat key={i} item={item} />)}
          </div>
        </div>
      </section>

      {/* 4. FEATURED LISTINGS */}
      {featuredProps.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
          <div className="container-custom">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)' }}>Listings</p>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold" style={{ color: 'var(--primary)' }}>
                  {h.featuredListings?.headline || 'Featured Properties'}
                </h2>
                {h.featuredListings?.subline && <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{h.featuredListings.subline}</p>}
              </div>
              <Link href={`/${locale}${h.featuredListings?.ctaHref || '/properties'}`}
                className="hidden md:flex items-center gap-2 text-sm font-semibold group" style={{ color: 'var(--secondary)' }}>
                {h.featuredListings?.ctaLabel || 'View All'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProps.map(p => <PropertyCard key={p.slug} p={p} locale={locale} />)}
            </div>
            <div className="text-center mt-8 md:hidden">
              <Link href={`/${locale}${h.featuredListings?.ctaHref || '/properties'}`} className="btn-gold inline-block">
                {h.featuredListings?.ctaLabel || 'View All Properties'}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 5. SERVICES OVERVIEW */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)' }}>Services</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold" style={{ color: 'var(--primary)' }}>
              {h.servicesOverview?.headline || 'How I Can Help'}
            </h2>
            {h.servicesOverview?.subline && <p className="text-sm mt-3 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>{h.servicesOverview.subline}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((svc, i) => {
              const Icon = ICONS[svc.icon || ''] || Home;
              return (
                <Link key={i} href={`/${locale}${svc.href || '/services'}`}
                  className="group p-6 border border-[var(--border)] rounded-xl hover:border-[var(--secondary)] hover:shadow-md transition-all bg-white">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: 'var(--backdrop-primary)' }}>
                    <Icon className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-2 group-hover:text-[var(--secondary)] transition-colors" style={{ color: 'var(--primary)' }}>
                    {svc.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{svc.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. NEIGHBORHOOD SPOTLIGHT */}
      {displayNbs.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
          <div className="container-custom">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)' }}>Local Expertise</p>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold" style={{ color: 'var(--primary)' }}>
                  {h.neighborhoodSpotlight?.headline || 'Explore Neighborhoods'}
                </h2>
                {h.neighborhoodSpotlight?.subline && <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{h.neighborhoodSpotlight.subline}</p>}
              </div>
              <Link href={`/${locale}${h.neighborhoodSpotlight?.ctaHref || '/neighborhoods'}`}
                className="hidden md:flex items-center gap-2 text-sm font-semibold group" style={{ color: 'var(--secondary)' }}>
                {h.neighborhoodSpotlight?.ctaLabel || 'All Neighborhoods'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayNbs.map(n => (
                <Link key={n.slug} href={`/${locale}/neighborhoods/${n.slug}`} className="group property-card">
                  <div className="relative aspect-[3/2] overflow-hidden" style={{ borderRadius: 'var(--card-radius) var(--card-radius) 0 0' }}>
                    {n.coverImage
                      ? <Image src={n.coverImage} alt={n.name || ''} fill className="object-cover transition-transform duration-600 group-hover:scale-105" sizes="33vw" />
                      : <div className="w-full h-full" style={{ background: 'var(--primary)', opacity: 0.3 }} />}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(27,40,56,0.2)' }} />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-lg font-semibold mb-1" style={{ color: 'var(--primary)' }}>{n.name}</h3>
                    <p className="text-sm mb-2 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{n.tagline}</p>
                    {n.marketSnapshot?.medianPrice && (
                      <p className="text-xs font-semibold" style={{ color: 'var(--secondary)' }}>Median: {n.marketSnapshot.medianPrice}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. TESTIMONIAL PREVIEW */}
      {displayTests.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--primary)' }}>
          <div className="container-custom max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: 'var(--secondary)' }}>
              {h.testimonialPreview?.headline || 'Client Testimonials'}
            </p>
            <div className="relative min-h-[180px]">
              {displayTests.map((t, i) => (
                <div key={i} className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ${i === activeTestimonial % displayTests.length ? 'opacity-100' : 'opacity-0'}`}>
                  <Stars count={t.rating} />
                  <blockquote className="font-serif text-xl md:text-2xl font-medium text-white leading-relaxed mb-6"
                    style={{ borderLeft: '3px solid var(--secondary)', paddingLeft: '1.5rem', textAlign: 'left' }}>
                    "{t.quote}"
                  </blockquote>
                  <p className="text-sm font-semibold text-white">{t.author}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--secondary)' }}>{t.title}</p>
                </div>
              ))}
            </div>
            {/* Dots */}
            {displayTests.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {displayTests.map((_, i) => (
                  <button key={i} onClick={() => setActiveTestimonial(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === activeTestimonial % displayTests.length ? 'bg-[var(--secondary)] w-6' : 'bg-white/30'}`} />
                ))}
              </div>
            )}
            <Link href={`/${locale}${h.testimonialPreview?.ctaHref || '/testimonials'}`}
              className="inline-flex items-center gap-2 text-sm font-semibold mt-8 group" style={{ color: 'var(--secondary)' }}>
              {h.testimonialPreview?.ctaLabel || 'Read All Reviews'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      )}

      {/* 8. RECENT SOLD */}
      {soldProps.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)' }}>Track Record</p>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold" style={{ color: 'var(--primary)' }}>
                  {h.recentSold?.headline || 'Recently Sold'}
                </h2>
                {h.recentSold?.subline && <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{h.recentSold.subline}</p>}
              </div>
              <Link href={`/${locale}${h.recentSold?.ctaHref || '/sold'}`}
                className="hidden md:flex items-center gap-2 text-sm font-semibold group" style={{ color: 'var(--secondary)' }}>
                {h.recentSold?.ctaLabel || 'View Portfolio'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {soldProps.map(p => <PropertyCard key={p.slug} p={p} locale={locale} showSold />)}
            </div>
          </div>
        </section>
      )}

      {/* 9. BLOG PREVIEW */}
      {recentPosts.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
          <div className="container-custom">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)' }}>Insights</p>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold" style={{ color: 'var(--primary)' }}>
                  {h.blogPreview?.headline || 'Real Estate Insights'}
                </h2>
              </div>
              <Link href={`/${locale}${h.blogPreview?.ctaHref || '/blog'}`}
                className="hidden md:flex items-center gap-2 text-sm font-semibold group" style={{ color: 'var(--secondary)' }}>
                {h.blogPreview?.ctaLabel || 'All Posts'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts.map(post => (
                <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="group property-card">
                  <div className="relative aspect-[4/3] overflow-hidden" style={{ borderRadius: 'var(--card-radius) var(--card-radius) 0 0' }}>
                    {post.coverImage
                      ? <Image src={post.coverImage} alt={post.title || ''} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="33vw" />
                      : <div className="w-full h-full" style={{ background: 'var(--primary)', opacity: 0.15 }} />}
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--secondary)' }}>
                      {post.category?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </span>
                    <h3 className="font-serif text-base font-semibold mt-2 mb-2 leading-snug group-hover:opacity-70 transition-opacity" style={{ color: 'var(--primary)' }}>
                      {post.title}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{post.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. VALUATION CTA */}
      <section className="relative min-h-[56vh] md:min-h-[62vh] overflow-hidden flex items-end">
        {h.valuationCta?.backgroundImage && (
          <Image src={h.valuationCta.backgroundImage} alt="" fill className="object-cover opacity-100" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top left, rgba(10,14,22,0.2) 0%, rgba(10,14,22,0.12) 36%, rgba(10,14,22,0.06) 68%, rgba(10,14,22,0.02) 100%)',
          }}
        />
        <div className="relative z-10 w-full pb-12 md:pb-16 pr-4 sm:pr-8 md:pr-12 lg:pr-20 flex justify-end text-left">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--secondary)' }}>For Sellers</p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-white mb-3">
              {h.valuationCta?.headline || 'Thinking of Selling?'}
            </h2>
            <p className="text-lg text-white/85 mb-8">
              {h.valuationCta?.subline || 'Get Your Free Home Valuation — no obligation, no pressure.'}
            </p>
            <Link href={`/${locale}${h.valuationCta?.ctaHref || '/home-valuation'}`} className="btn-gold text-sm px-8 py-3.5">
              {h.valuationCta?.ctaLabel || 'Get My Free Estimate'}
            </Link>
          </div>
        </div>
      </section>

      {/* 11. AGENT INTRO */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden" style={{ boxShadow: 'var(--card-shadow)' }}>
              {h.agentIntro?.portrait
                ? <Image src={h.agentIntro.portrait} alt={h.agentIntro.portraitAlt || 'Alexandra Reeves'} fill className="object-cover" sizes="50vw" />
                : <div className="w-full h-full flex items-center justify-center font-serif text-6xl font-bold text-white/30"
                    style={{ background: 'var(--primary)' }}>AR</div>}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--secondary)' }}>About</p>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-5" style={{ color: 'var(--primary)' }}>
                {h.agentIntro?.headline || `Meet ${siteData.name || 'Alexandra Reeves'}`}
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                {h.agentIntro?.body}
              </p>
              <Link href={`/${locale}${h.agentIntro?.ctaHref || '/about'}`}
                className="inline-flex items-center gap-2 font-semibold group" style={{ color: 'var(--secondary)' }}>
                {h.agentIntro?.ctaLabel || 'My Story'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 12. CONSULTATION CTA */}
      <section className="relative section-padding overflow-hidden" style={{ background: 'var(--backdrop-primary)', borderTop: '1px solid var(--border)' }}>
        {h.consultationCta?.backgroundImage && (
          <Image src={h.consultationCta.backgroundImage} alt="" fill className="object-cover" />
        )}
        {h.consultationCta?.backgroundImage && (
          <div className="absolute inset-0" style={{ background: 'rgba(27,40,56,0.68)' }} />
        )}
        <div className="relative z-10 container-custom text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--secondary)' }}>Get Started</p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4" style={{ color: h.consultationCta?.backgroundImage ? '#fff' : 'var(--primary)' }}>
            {h.consultationCta?.headline || 'Ready to Make Your Move?'}
          </h2>
          <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: h.consultationCta?.backgroundImage ? 'rgba(255,255,255,0.86)' : 'var(--text-secondary)' }}>
            {h.consultationCta?.subline || "I respond to every inquiry within 2 hours. Let's talk."}
          </p>
          <Link href={`/${locale}${h.consultationCta?.ctaHref || '/contact'}`} className="btn-gold text-sm px-10 py-4">
            {h.consultationCta?.ctaLabel || 'Schedule a Consultation'}
          </Link>
        </div>
      </section>
    </>
  );
}
