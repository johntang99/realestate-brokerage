'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

interface Property {
  slug: string;
  address?: string;
  city?: string;
  state?: string;
  price?: number;
  priceDisplay?: string;
  status?: 'for-sale' | 'pending' | 'sold' | 'for-lease';
  type?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  neighborhood?: string;
  featured?: boolean;
  coverImage?: string;
  coverImageAlt?: string;
  soldDetails?: { soldPrice?: number; soldDate?: string; daysOnMarket?: number };
  leaseDetails?: { monthlyRent?: number };
}

interface PageData {
  hero?: { headline?: string; subline?: string };
  filters?: {
    statusLabels?: Record<string, string>;
    typeLabels?: Record<string, string>;
    priceRanges?: string[];
    priceRangeLabels?: Record<string, string>;
    bedOptions?: string[];
    bathOptions?: string[];
  };
  grid?: { itemsPerPage?: number };
  cta?: { headline?: string; body?: string; ctaLabel?: string; ctaHref?: string };
}

const STATUS_COLORS: Record<string, string> = {
  'for-sale': 'status-badge-active',
  'pending': 'status-badge-pending',
  'sold': 'status-badge-sold',
  'for-lease': 'status-badge-lease',
};

const STATUS_LABELS: Record<string, string> = {
  'for-sale': 'For Sale',
  'pending': 'Pending',
  'sold': 'Sold',
  'for-lease': 'For Lease',
};

function PropertyCard({ property, locale }: { property: Property; locale: string }) {
  const displayPrice = property.status === 'sold' && property.soldDetails?.soldPrice
    ? `$${property.soldDetails.soldPrice.toLocaleString()}`
    : property.status === 'for-lease' && property.leaseDetails?.monthlyRent
    ? `$${property.leaseDetails.monthlyRent.toLocaleString()}/mo`
    : property.priceDisplay || (property.price ? `$${property.price.toLocaleString()}` : '');

  return (
    <Link href={`/${locale}/properties/${property.slug}`} className="group block property-card">
      <div className="relative aspect-[4/3] overflow-hidden" style={{ borderRadius: 'var(--card-radius,8px) var(--card-radius,8px) 0 0' }}>
        {property.coverImage ? (
          <Image
            src={property.coverImage}
            alt={property.coverImageAlt || property.address || ''}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width:768px) 100vw,(max-width:1024px) 50vw,33vw"
          />
        ) : (
          <div className="w-full h-full" style={{ background: 'var(--backdrop-primary,#FAF9F7)' }} />
        )}
        {property.status && (
          <div className="absolute top-3 left-3">
            <span className={`status-badge ${STATUS_COLORS[property.status] || ''}`}>
              {STATUS_LABELS[property.status] || property.status}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="text-white text-sm font-semibold bg-black/50 px-4 py-2 rounded">View Details</span>
        </div>
      </div>
      <div className="p-4">
        <p className="price-display text-xl mb-1">{displayPrice}</p>
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          {property.address}
        </p>
        <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
          {property.city}, {property.state}
        </p>
        {(property.beds || property.baths || property.sqft) ? (
          <div className="flex gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
            {property.beds ? <span>{property.beds} bd</span> : null}
            {property.baths ? <span>{property.baths} ba</span> : null}
            {property.sqft ? <span>{property.sqft.toLocaleString()} sqft</span> : null}
          </div>
        ) : null}
      </div>
    </Link>
  );
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [pageData, setPageData] = useState<PageData>({});
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');
  const [filterBeds, setFilterBeds] = useState('all');
  const [filterNeighborhood, setFilterNeighborhood] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    Promise.all([
      fetch(`/api/content/file?locale=${loc}&path=pages/properties.json`).then(r => r.json()),
      fetch(`/api/content/items?locale=${loc}&directory=properties`).then(r => r.json()),
    ]).then(([pageRes, itemsRes]) => {
      try { setPageData(JSON.parse(pageRes.content || '{}')); } catch {}
      const items = Array.isArray(itemsRes.items) ? itemsRes.items as Property[] : [];
      setProperties(items.filter(Boolean));
      setLoading(false);
    }).catch(() => setLoading(false));

    // read URL params
    const params = new URLSearchParams(window.location.search);
    if (params.get('status')) setFilterStatus(params.get('status')!);
    if (params.get('type')) setFilterType(params.get('type')!);
    if (params.get('beds')) setFilterBeds(params.get('beds')!);
  }, []);

  const filtered = properties.filter(p => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterType !== 'all' && p.type !== filterType) return false;
    if (filterNeighborhood !== 'all' && p.neighborhood !== filterNeighborhood) return false;
    if (filterBeds !== 'all') {
      const minBeds = filterBeds === '5+' ? 5 : parseInt(filterBeds);
      if (!p.beds || (filterBeds === '5+' ? p.beds < 5 : p.beds !== minBeds)) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'sqft') return (b.sqft || 0) - (a.sqft || 0);
    return 0;
  });

  const displayed = sorted.slice(0, visibleCount);

  const neighborhoods = [...new Set(properties.map(p => p.neighborhood).filter(Boolean))];

  const statusOptions = ['for-sale', 'pending', 'sold', 'for-lease'];
  const typeOptions = ['single-family', 'condo', 'townhouse', 'commercial', 'land', 'multi-family'];
  const typeLabels: Record<string, string> = { 'single-family': 'Single Family', 'condo': 'Condo', 'townhouse': 'Townhouse', 'commercial': 'Commercial', 'land': 'Land', 'multi-family': 'Multi-Family' };

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-10 md:pt-40 md:pb-12" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-3" style={{ color: 'var(--primary)' }}>
            {pageData.hero?.headline || 'Properties'}
          </h1>
          <p className="text-base max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            {pageData.hero?.subline || 'Browse active listings, pending sales, and sold portfolio.'}
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-0 z-30 border-b border-[var(--border)] backdrop-blur-sm bg-white/90 py-3">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 items-center">
            {/* Status */}
            <div className="flex gap-1">
              <button onClick={() => { setFilterStatus('all'); setVisibleCount(12); }}
                className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors ${filterStatus==='all' ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] text-[var(--text-secondary)]'}`}>
                All
              </button>
              {statusOptions.map(s => (
                <button key={s} onClick={() => { setFilterStatus(s); setVisibleCount(12); }}
                  className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors ${filterStatus===s ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] text-[var(--text-secondary)]'}`}>
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>

            {/* Type */}
            <select value={filterType} onChange={e => { setFilterType(e.target.value); setVisibleCount(12); }}
              className="text-xs border border-[var(--border)] rounded px-2 py-1.5 outline-none" style={{ color: 'var(--text-primary)' }}>
              <option value="all">All Types</option>
              {typeOptions.map(t => <option key={t} value={t}>{typeLabels[t]}</option>)}
            </select>

            {/* Beds */}
            <select value={filterBeds} onChange={e => { setFilterBeds(e.target.value); setVisibleCount(12); }}
              className="text-xs border border-[var(--border)] rounded px-2 py-1.5 outline-none" style={{ color: 'var(--text-primary)' }}>
              <option value="all">Any Beds</option>
              {['1','2','3','4','5+'].map(b => <option key={b} value={b}>{b} Bed{b!=='1'?'s':''}</option>)}
            </select>

            {/* Neighborhood */}
            {neighborhoods.length > 0 && (
              <select value={filterNeighborhood} onChange={e => { setFilterNeighborhood(e.target.value); setVisibleCount(12); }}
                className="text-xs border border-[var(--border)] rounded px-2 py-1.5 outline-none" style={{ color: 'var(--text-primary)' }}>
                <option value="all">All Neighborhoods</option>
                {neighborhoods.map(n => <option key={n} value={n}>{n?.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>)}
              </select>
            )}

            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="text-xs border border-[var(--border)] rounded px-2 py-1.5 outline-none ml-auto" style={{ color: 'var(--text-primary)' }}>
              <option value="newest">Newest</option>
              <option value="price-low">Price ↑</option>
              <option value="price-high">Price ↓</option>
              <option value="sqft">Largest</option>
            </select>

            {(filterStatus!=='all'||filterType!=='all'||filterBeds!=='all'||filterNeighborhood!=='all') && (
              <button onClick={() => { setFilterStatus('all'); setFilterType('all'); setFilterBeds('all'); setFilterNeighborhood('all'); setVisibleCount(12); }}
                className="text-xs underline" style={{ color: 'var(--text-secondary)' }}>Clear</button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_,i) => <div key={i} className="aspect-[4/3] animate-pulse rounded-lg" style={{ background: 'var(--backdrop-primary)' }} />)}
            </div>
          ) : displayed.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-xl mb-3" style={{ color: 'var(--primary)' }}>No properties match your criteria.</p>
              <button onClick={() => { setFilterStatus('all'); setFilterType('all'); setFilterBeds('all'); setFilterNeighborhood('all'); }}
                className="text-sm underline" style={{ color: 'var(--secondary)' }}>Clear all filters</button>
            </div>
          ) : (
            <>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{sorted.length} {sorted.length===1?'property':'properties'} found</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayed.map(p => <PropertyCard key={p.slug} property={p} locale={locale} />)}
              </div>
              {displayed.length < sorted.length && (
                <div className="text-center mt-10">
                  <button onClick={() => setVisibleCount(v => v + 12)}
                    className="border border-[var(--primary)] px-8 py-3 text-sm font-semibold hover:bg-[var(--primary)] hover:text-white transition-colors"
                    style={{ color: 'var(--primary)' }}>
                    Load More Properties
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom text-center">
          <p className="font-serif text-2xl md:text-3xl mb-3" style={{ color: 'var(--primary)' }}>
            {pageData.cta?.headline || "Don't see what you're looking for?"}
          </p>
          <p className="text-base mb-6 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            {pageData.cta?.body || "Tell me your criteria and I'll find it — often before it hits the MLS."}
          </p>
          <Link href={`/${locale}${pageData.cta?.ctaHref || '/contact'}`}
            className="inline-flex items-center gap-2 btn-gold">
            {pageData.cta?.ctaLabel || 'Get in Touch'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
