'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Property {
  slug: string; address?: string; city?: string; state?: string; price?: number;
  priceDisplay?: string; status?: string; type?: string; beds?: number;
  baths?: number; sqft?: number; neighborhood?: string; coverImage?: string; coverImageAlt?: string;
}

export default function NeighborhoodDetailPage({ params }: { params: { slug: string; locale: string } }) {
  const [neighborhood, setNeighborhood] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loc = window.location.pathname.split('/')[1] === 'zh' ? 'zh' : 'en';
    setLocale(loc);
    Promise.all([
      fetch(`/api/content/file?locale=${loc}&path=neighborhoods/${params.slug}.json`).then(r => r.json()),
      fetch(`/api/content/items?locale=${loc}&directory=properties`).then(r => r.json()),
    ]).then(([nRes, pRes]) => {
      try { setNeighborhood(JSON.parse(nRes.content || 'null')); } catch {}
      const items = Array.isArray(pRes.items) ? pRes.items as Property[] : [];
      setProperties(items.filter(p => p && p.neighborhood === params.slug && p.status === 'for-sale'));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [params.slug]);

  if (loading) return <div className="pt-40 container-custom"><div className="animate-pulse h-8 bg-gray-100 rounded w-1/2 mb-4" /></div>;
  if (!neighborhood) return (
    <div className="pt-40 container-custom text-center">
      <p className="font-serif text-2xl mb-4" style={{ color: 'var(--primary)' }}>Neighborhood not found</p>
      <Link href={`/${locale}/neighborhoods`} className="text-sm underline" style={{ color: 'var(--secondary)' }}>← Back to Neighborhoods</Link>
    </div>
  );

  const n = neighborhood;
  const ms = n.marketSnapshot;

  return (
    <>
      {/* Hero */}
      <div className="relative min-h-[50vh] flex items-end">
        {n.coverImage ? <Image src={n.coverImage} alt={n.coverImageAlt || n.name || ''} fill className="object-cover" priority sizes="100vw" />
          : <div className="absolute inset-0" style={{ background: 'var(--primary)' }} />}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(27,40,56,0.8) 0%, rgba(27,40,56,0.3) 60%, transparent 100%)' }} />
        <div className="relative z-10 container-custom py-16">
          <Link href={`/${locale}/neighborhoods`} className="text-xs text-white/60 uppercase tracking-widest mb-4 block">← Neighborhoods</Link>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-2">{n.name}</h1>
          <p className="text-lg text-white/80 mb-4">{n.tagline}</p>
          {ms && (
            <div className="flex flex-wrap gap-6">
              {ms.medianPrice && <div><p className="text-white/60 text-xs">Median Price</p><p className="text-white font-semibold">{ms.medianPrice}</p></div>}
              {ms.avgDaysOnMarket && <div><p className="text-white/60 text-xs">Avg Days on Market</p><p className="text-white font-semibold">{ms.avgDaysOnMarket}</p></div>}
              {ms.yoyChange && <div><p className="text-white/60 text-xs">YoY Change</p><p className="font-semibold" style={{ color: 'var(--secondary)' }}>{ms.yoyChange}</p></div>}
            </div>
          )}
        </div>
      </div>

      {/* Overview */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold mb-6" style={{ color: 'var(--primary)' }}>About {n.name}</h2>
          {n.overview?.split('\n\n').map((para: string, i: number) => (
            <p key={i} className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-primary)' }}>{para}</p>
          ))}
        </div>
      </section>

      {/* Available Properties */}
      <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom">
          <h2 className="font-serif text-2xl font-semibold mb-6" style={{ color: 'var(--primary)' }}>Active Listings in {n.name}</h2>
          {properties.length === 0 ? (
            <div className="text-center py-12 border border-[var(--border)] rounded-lg bg-white">
              <p className="font-serif text-lg mb-2" style={{ color: 'var(--primary)' }}>No active listings right now.</p>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Contact me to be first to know when something comes on the market.</p>
              <Link href={`/${locale}/contact`} className="btn-gold inline-block text-sm">Get Notified</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(p => (
                <Link key={p.slug} href={`/${locale}/properties/${p.slug}`} className="group property-card">
                  <div className="relative aspect-[4/3] overflow-hidden" style={{ borderRadius: 'var(--card-radius) var(--card-radius) 0 0' }}>
                    {p.coverImage ? <Image src={p.coverImage} alt={p.coverImageAlt || ''} fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                      : <div className="w-full h-full" style={{ background: 'var(--backdrop-primary)' }} />}
                    <div className="absolute top-3 left-3"><span className="status-badge status-badge-active">For Sale</span></div>
                  </div>
                  <div className="p-4">
                    <p className="price-display text-lg mb-1">{p.priceDisplay || (p.price ? `$${p.price.toLocaleString()}` : '')}</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{p.address}</p>
                    <div className="flex gap-3 text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                      {p.beds && <span>{p.beds} bd</span>}{p.baths && <span>{p.baths} ba</span>}{p.sqft && <span>{p.sqft.toLocaleString()} sqft</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Schools + Lifestyle */}
      {(n.schools?.length > 0 || n.lifestyle) && (
        <section className="section-padding bg-white">
          <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-12">
            {n.schools?.length > 0 && (
              <div>
                <h2 className="font-serif text-xl font-semibold mb-5" style={{ color: 'var(--primary)' }}>Schools</h2>
                <div className="space-y-3">
                  {n.schools.map((s: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded border border-[var(--border)]">
                      <div className="flex-1">
                        <p className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>{s.name}</p>
                        <p className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>{s.type}</p>
                      </div>
                      {s.rating && <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>{s.rating}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {n.lifestyle && (
              <div>
                <h2 className="font-serif text-xl font-semibold mb-5" style={{ color: 'var(--primary)' }}>Lifestyle & Amenities</h2>
                {Object.entries(n.lifestyle).map(([cat, items]) => items && (items as string[]).length > 0 ? (
                  <div key={cat} className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)' }}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(items as string[]).map((item, i) => (
                        <span key={i} className="text-xs px-3 py-1 rounded-full border border-[var(--border)] bg-white"
                          style={{ color: 'var(--text-primary)' }}>{item}</span>
                      ))}
                    </div>
                  </div>
                ) : null)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Nearby */}
      {n.nearbyNeighborhoods?.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
          <div className="container-custom">
            <h2 className="font-serif text-xl font-semibold mb-5" style={{ color: 'var(--primary)' }}>Nearby Neighborhoods</h2>
            <div className="flex flex-wrap gap-3">
              {n.nearbyNeighborhoods.map((slug: string) => (
                <Link key={slug} href={`/${locale}/neighborhoods/${slug}`}
                  className="px-5 py-2.5 border border-[var(--border)] rounded-lg bg-white hover:border-[var(--secondary)] transition-colors text-sm"
                  style={{ color: 'var(--primary)' }}>
                  {slug.replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase())}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding" style={{ background: 'var(--primary)' }}>
        <div className="container-custom text-center">
          <p className="font-serif text-2xl md:text-3xl font-semibold text-white mb-3">
            Want to live in {n.name}?
          </p>
          <p className="text-white/70 mb-6">Let me find your perfect home.</p>
          <Link href={`/${locale}/contact`} className="btn-gold inline-block">Schedule a Consultation</Link>
        </div>
      </section>
    </>
  );
}
