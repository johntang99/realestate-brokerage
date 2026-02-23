'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Property {
  slug: string; address?: string; city?: string; state?: string;
  price?: number; priceDisplay?: string; status?: string; type?: string;
  beds?: number; baths?: number; sqft?: number; neighborhood?: string;
  coverImage?: string; coverImageAlt?: string;
  soldDetails?: { soldPrice?: number; soldDate?: string; daysOnMarket?: number; listPrice?: number };
}

export default function SoldPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [pageData, setPageData] = useState<any>({});
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const [filterType, setFilterType] = useState('all');
  const [filterNeighborhood, setFilterNeighborhood] = useState('all');

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    Promise.all([
      fetch(`/api/content/file?locale=${loc}&path=pages/sold.json`).then(r => r.json()),
      fetch(`/api/content/items?locale=${loc}&directory=properties`).then(r => r.json()),
    ]).then(([pageRes, itemsRes]) => {
      try { setPageData(JSON.parse(pageRes.content || '{}')); } catch {}
      const items = Array.isArray(itemsRes.items) ? itemsRes.items as Property[] : [];
      setProperties(items.filter(p => p && p.status === 'sold'));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = properties.filter(p => {
    if (filterType !== 'all' && p.type !== filterType) return false;
    if (filterNeighborhood !== 'all' && p.neighborhood !== filterNeighborhood) return false;
    return true;
  });

  const displayed = filtered.slice(0, visibleCount);
  const neighborhoods = [...new Set(properties.map(p => p.neighborhood).filter(Boolean))];
  const types = [...new Set(properties.map(p => p.type).filter(Boolean))];
  const typeLabels: Record<string,string> = { 'single-family':'Single Family','condo':'Condo','townhouse':'Townhouse','commercial':'Commercial' };

  return (
    <>
      <section className="pt-32 pb-10 md:pt-40" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-3" style={{ color: 'var(--primary)' }}>
            {pageData.hero?.headline || "Properties I've Sold"}
          </h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>{pageData.hero?.subline}</p>
          {pageData.hero?.aggregateStats && (
            <div className="flex gap-8 mt-6">
              {Object.entries(pageData.hero.aggregateStats).map(([k,v]) => (
                <div key={k}>
                  <p className="font-serif text-2xl font-bold" style={{ color: 'var(--secondary)' }}>{v as string}</p>
                  <p className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>{k.replace(/([A-Z])/g,' $1').trim()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-[var(--border)] py-3">
        <div className="container-custom flex gap-2 flex-wrap">
          <select value={filterType} onChange={e => { setFilterType(e.target.value); setVisibleCount(12); }}
            className="text-xs border border-[var(--border)] rounded px-2 py-1.5 outline-none" style={{ color: 'var(--text-primary)' }}>
            <option value="all">All Types</option>
            {types.map(t => <option key={t} value={t}>{typeLabels[t!] || t}</option>)}
          </select>
          {neighborhoods.length > 0 && (
            <select value={filterNeighborhood} onChange={e => { setFilterNeighborhood(e.target.value); setVisibleCount(12); }}
              className="text-xs border border-[var(--border)] rounded px-2 py-1.5 outline-none" style={{ color: 'var(--text-primary)' }}>
              <option value="all">All Neighborhoods</option>
              {neighborhoods.map(n => <option key={n} value={n}>{n?.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>)}
            </select>
          )}
        </div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_,i) => <div key={i} className="aspect-[4/3] animate-pulse" style={{ background: 'var(--backdrop-primary)', borderRadius: 'var(--card-radius)' }} />)}
            </div>
          ) : (
            <>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{filtered.length} sold {filtered.length===1?'property':'properties'}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayed.map(p => (
                  <Link key={p.slug} href={`/${locale}/properties/${p.slug}`} className="group property-card">
                    <div className="relative aspect-[4/3] overflow-hidden" style={{ borderRadius: 'var(--card-radius) var(--card-radius) 0 0' }}>
                      {p.coverImage ? <Image src={p.coverImage} alt={p.coverImageAlt || ''} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" /> : <div className="w-full h-full" style={{ background: 'var(--backdrop-primary)' }} />}
                      <div className="absolute top-3 left-3"><span className="status-badge status-badge-sold">SOLD</span></div>
                    </div>
                    <div className="p-4">
                      {p.soldDetails?.soldPrice && (
                        <p className="price-display text-xl mb-1">${p.soldDetails.soldPrice.toLocaleString()}</p>
                      )}
                      <p className="text-sm font-medium mb-0.5" style={{ color: 'var(--text-primary)' }}>{p.address}</p>
                      <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{p.city}, {p.state}</p>
                      <div className="flex gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {p.beds ? <span>{p.beds} bd</span> : null}
                        {p.baths ? <span>{p.baths} ba</span> : null}
                        {p.sqft ? <span>{p.sqft.toLocaleString()} sqft</span> : null}
                        {p.soldDetails?.daysOnMarket ? <span>{p.soldDetails.daysOnMarket} DOM</span> : null}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {displayed.length < filtered.length && (
                <div className="text-center mt-10">
                  <button onClick={() => setVisibleCount(v => v + 12)}
                    className="border border-[var(--primary)] px-8 py-3 text-sm font-semibold hover:bg-[var(--primary)] hover:text-white transition-colors"
                    style={{ color: 'var(--primary)' }}>Load More</button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom text-center">
          <p className="font-serif text-2xl md:text-3xl mb-3" style={{ color: 'var(--primary)' }}>
            {pageData.cta?.headline || 'Want results like these?'}
          </p>
          <Link href={`/${locale}${pageData.cta?.ctaHref || '/contact'}`} className="btn-gold mt-4 inline-block">
            {pageData.cta?.ctaLabel || "Let's Get Started"}
          </Link>
        </div>
      </section>
    </>
  );
}
