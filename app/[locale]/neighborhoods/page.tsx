'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface Neighborhood {
  slug: string;
  name?: string;
  tagline?: string;
  coverImage?: string;
  coverImageAlt?: string;
  marketSnapshot?: { medianPrice?: string };
  featured?: boolean;
  region?: string;
}

export default function NeighborhoodsPage() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [pageData, setPageData] = useState<any>({});
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    Promise.all([
      fetch(`/api/content/file?locale=${loc}&path=pages/neighborhoods.json`).then(r => r.json()),
      fetch(`/api/content/items?locale=${loc}&directory=neighborhoods`).then(r => r.json()),
    ]).then(([pageRes, itemsRes]) => {
      try { setPageData(JSON.parse(pageRes.content || '{}')); } catch {}
      const items = Array.isArray(itemsRes.items) ? itemsRes.items as Neighborhood[] : [];
      setNeighborhoods(items.filter(Boolean).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const featured = pageData.featured?.neighborhoodSlug
    ? neighborhoods.find(n => n.slug === pageData.featured.neighborhoodSlug)
    : neighborhoods.find(n => n.featured);
  const grid = featured ? neighborhoods.filter(n => n.slug !== featured.slug) : neighborhoods;

  return (
    <>
      <section className="pt-32 pb-10 md:pt-40" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-3" style={{ color: 'var(--primary)' }}>
            {pageData.hero?.headline || 'Explore Westchester Neighborhoods'}
          </h1>
          <p className="text-base max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            {pageData.hero?.subline || 'Local knowledge that no algorithm can replicate.'}
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_,i) => <div key={i} className="aspect-[3/2] animate-pulse" style={{ background: 'var(--backdrop-primary)', borderRadius: 'var(--card-radius)' }} />)}
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <Link href={`/${locale}/neighborhoods/${featured.slug}`}
                  className="group block mb-8 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                  <div className="relative aspect-[16/7]">
                    {featured.coverImage ? (
                      <Image src={featured.coverImage} alt={featured.coverImageAlt || featured.name || ''} fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="100vw" />
                    ) : <div className="w-full h-full" style={{ background: 'var(--backdrop-primary)' }} />}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(27,40,56,0.75) 0%, rgba(27,40,56,0.2) 50%, transparent 100%)' }} />
                    <div className="absolute bottom-6 left-6">
                      <span className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: 'var(--secondary)' }}>Featured Neighborhood</span>
                      <h2 className="font-serif text-3xl font-semibold text-white mb-1">{featured.name}</h2>
                      <p className="text-sm text-white/80">{featured.tagline}</p>
                      {featured.marketSnapshot?.medianPrice && (
                        <p className="text-sm mt-2" style={{ color: 'var(--secondary)' }}>Median: {featured.marketSnapshot.medianPrice}</p>
                      )}
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grid.map(n => (
                  <Link key={n.slug} href={`/${locale}/neighborhoods/${n.slug}`}
                    className="group block property-card">
                    <div className="relative aspect-[4/3] overflow-hidden" style={{ borderRadius: 'var(--card-radius) var(--card-radius) 0 0' }}>
                      {n.coverImage ? (
                        <Image src={n.coverImage} alt={n.coverImageAlt || n.name || ''} fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw,(max-width:1024px) 50vw,33vw" />
                      ) : <div className="w-full h-full" style={{ background: 'var(--backdrop-primary)' }} />}
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-lg font-semibold mb-1" style={{ color: 'var(--primary)' }}>{n.name}</h3>
                      <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{n.tagline}</p>
                      {n.marketSnapshot?.medianPrice && (
                        <p className="text-xs font-semibold" style={{ color: 'var(--secondary)' }}>Median: {n.marketSnapshot.medianPrice}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom text-center">
          <p className="font-serif text-2xl md:text-3xl mb-3" style={{ color: 'var(--primary)' }}>
            {pageData.cta?.headline || "Not sure which neighborhood fits you best?"}
          </p>
          <p className="text-base mb-6" style={{ color: 'var(--text-secondary)' }}>
            {pageData.cta?.subline || "I'll match you with the perfect area based on your lifestyle and budget."}
          </p>
          <Link href={`/${locale}${pageData.cta?.ctaHref || '/contact'}`} className="btn-gold">
            {pageData.cta?.ctaLabel || "Let's Talk"}
          </Link>
        </div>
      </section>
    </>
  );
}
