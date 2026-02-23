'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export default function FaqPage() {
  const [pageData, setPageData] = useState<any>({});
  const [locale, setLocale] = useState('en');
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    fetch(`/api/content/file?locale=${loc}&path=pages/faq.json`).then(r => r.json()).then(res => {
      try {
        const data = JSON.parse(res.content || '{}');
        setPageData(data);
        if (data.categories?.length > 0) setActiveCategory(data.categories[0].name);
      } catch {}
    });
  }, []);

  const d = pageData;
  const categories = d.categories || [];
  const activeGroup = categories.find((c: any) => c.name === activeCategory);

  return (
    <>
      <section className="pt-32 pb-10 md:pt-40" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--secondary)' }}>FAQ</p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold" style={{ color: 'var(--primary)' }}>
            {d.hero?.headline || 'Frequently Asked Questions'}
          </h1>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

            {/* Category sidebar */}
            {categories.length > 0 && (
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>Categories</p>
                  {categories.map((cat: any) => (
                    <button key={cat.name} onClick={() => { setActiveCategory(cat.name); setOpenItem(null); }}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        activeCategory === cat.name
                          ? 'bg-[var(--primary)] text-white'
                          : 'hover:bg-[var(--backdrop-primary)] text-[var(--text-secondary)]'
                      }`}>
                      {cat.name}
                      <span className="ml-2 text-xs opacity-60">({cat.items?.length || 0})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Accordion */}
            <div className={categories.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'}>
              {activeGroup ? (
                <>
                  <h2 className="font-serif text-xl font-semibold mb-6" style={{ color: 'var(--primary)' }}>
                    {activeGroup.name}
                  </h2>
                  <div className="space-y-2">
                    {(activeGroup.items || []).map((item: any, i: number) => {
                      const key = `${activeGroup.name}-${i}`;
                      const isOpen = openItem === key;
                      return (
                        <div key={key} className="border border-[var(--border)] rounded-xl overflow-hidden">
                          <button
                            className="w-full flex items-center justify-between p-5 text-left"
                            onClick={() => setOpenItem(isOpen ? null : key)}>
                            <span className="font-semibold text-sm pr-4" style={{ color: 'var(--primary)' }}>
                              {item.question}
                            </span>
                            <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                              style={{ color: 'var(--text-secondary)' }} />
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-5 border-t border-[var(--border)]"
                              style={{ paddingTop: '1rem', color: 'var(--text-secondary)' }}>
                              <p className="text-sm leading-relaxed">{item.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Select a category to view questions.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom text-center">
          <h2 className="font-serif text-2xl font-semibold mb-3" style={{ color: 'var(--primary)' }}>
            {d.cta?.headline || 'Still have questions?'}
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            I'm happy to answer anything — call, text, or email.
          </p>
          <Link href={`/${locale}${d.cta?.ctaHref || '/contact'}`} className="btn-gold inline-block">
            {d.cta?.ctaLabel || "Let's Chat"}
          </Link>
        </div>
      </section>
    </>
  );
}
