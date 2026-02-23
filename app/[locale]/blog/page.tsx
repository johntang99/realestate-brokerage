'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';

interface BlogPost {
  slug: string; title?: string; type?: string; category?: string;
  date?: string; author?: string; coverImage?: string; coverImageAlt?: string;
  excerpt?: string; videoDuration?: string; featured?: boolean;
}

const CAT_LABELS: Record<string, string> = {
  all: 'All', 'market-updates': 'Market Updates', 'buyer-tips': 'Buyer Tips',
  'seller-tips': 'Seller Tips', 'neighborhood-spotlight': 'Neighborhood Spotlight',
  investment: 'Investment', lifestyle: 'Lifestyle', video: 'Video',
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pageData, setPageData] = useState<any>({});
  const [locale, setLocale] = useState('en');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    Promise.all([
      fetch(`/api/content/file?locale=${loc}&path=pages/blog.json`).then(r => r.json()),
      fetch(`/api/content/items?locale=${loc}&directory=blog`).then(r => r.json()),
    ]).then(([pageRes, itemsRes]) => {
      try { setPageData(JSON.parse(pageRes.content || '{}')); } catch {}
      const items = Array.isArray(itemsRes.items) ? itemsRes.items as BlogPost[] : [];
      setPosts(items.filter(Boolean).sort((a, b) => (b.date || '').localeCompare(a.date || '')));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const featured = posts.find(p => p.slug === pageData.featured?.postSlug) || posts.find(p => p.featured);
  const filtered = posts.filter(p => activeCategory === 'all' || p.category === activeCategory || (activeCategory === 'video' && p.type === 'video'));
  const gridPosts = featured ? filtered.filter(p => p.slug !== featured.slug) : filtered;
  const displayed = gridPosts.slice(0, visibleCount);
  const categories = Object.keys(CAT_LABELS);

  return (
    <>
      <section className="pt-32 pb-10 md:pt-40" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-3" style={{ color: 'var(--primary)' }}>
            {pageData.hero?.headline || 'Real Estate Insights'}
          </h1>
        </div>
      </section>

      {/* Featured */}
      {!loading && featured && (
        <section className="bg-white border-b border-[var(--border)]">
          <div className="container-custom py-12">
            <Link href={`/${locale}/blog/${featured.slug}`}
              className="group grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="relative aspect-[4/3] overflow-hidden" style={{ borderRadius: 'var(--card-radius)', boxShadow: 'var(--card-shadow)' }}>
                {featured.coverImage ? <Image src={featured.coverImage} alt={featured.coverImageAlt || ''} fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="50vw" priority /> : <div className="w-full h-full" style={{ background: 'var(--backdrop-primary)' }} />}
                {featured.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
                      <Play className="w-6 h-6 ml-1" style={{ color: 'var(--primary)' }} />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--secondary)' }}>
                  Featured · {CAT_LABELS[featured.category || ''] || featured.category}
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mt-3 mb-4 group-hover:opacity-70 transition-opacity" style={{ color: 'var(--primary)' }}>{featured.title}</h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{featured.excerpt}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{featured.author} · {featured.date}</p>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Filters */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-[var(--border)] py-3">
        <div className="container-custom flex gap-2 overflow-x-auto hide-scrollbar">
          {categories.map(cat => (
            <button key={cat} onClick={() => { setActiveCategory(cat); setVisibleCount(9); }}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${activeCategory === cat ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-[var(--border)] text-[var(--text-secondary)]'}`}>
              {CAT_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {[...Array(6)].map((_,i) => <div key={i} className="aspect-[4/3] animate-pulse bg-white" />)}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                {displayed.map(post => (
                  <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="group property-card">
                    <div className="relative aspect-[4/3] overflow-hidden" style={{ borderRadius: 'var(--card-radius) var(--card-radius) 0 0' }}>
                      {post.coverImage ? <Image src={post.coverImage} alt={post.coverImageAlt || ''} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" /> : <div className="w-full h-full" style={{ background: 'var(--backdrop-primary)' }} />}
                      {post.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                            <Play className="w-5 h-5 ml-0.5" style={{ color: 'var(--primary)' }} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--secondary)' }}>
                        {CAT_LABELS[post.category || ''] || post.category}
                      </span>
                      <h3 className="font-serif text-base font-medium mt-2 mb-2 group-hover:opacity-70 transition-opacity" style={{ color: 'var(--primary)' }}>{post.title}</h3>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{post.author} · {post.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
              {displayed.length < gridPosts.length && (
                <div className="text-center mt-12">
                  <button onClick={() => setVisibleCount(v => v + 9)}
                    className="border border-[var(--primary)] px-8 py-3 text-sm font-semibold hover:bg-[var(--primary)] hover:text-white transition-colors"
                    style={{ color: 'var(--primary)' }}>Load More</button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter */}
      {pageData.newsletter && (
        <section className="py-16 bg-white border-t border-[var(--border)]">
          <div className="container-custom max-w-lg mx-auto text-center">
            <h2 className="font-serif text-2xl font-semibold mb-3" style={{ color: 'var(--primary)' }}>
              {pageData.newsletter.headline || 'Get Market Updates Weekly'}
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{pageData.newsletter.subline}</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Your email address"
                className="flex-1 border border-[var(--border)] px-4 py-2.5 text-sm outline-none focus:border-[var(--secondary)] transition-colors" />
              <button className="btn-gold text-sm px-5">{pageData.newsletter.submitLabel || 'Subscribe'}</button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
