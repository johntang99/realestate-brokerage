'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SellersGuidePage() {
  const [pageData, setPageData] = useState<any>({});
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    fetch(`/api/content/file?locale=${loc}&path=pages/sellers-guide.json`).then(r => r.json()).then(res => {
      try { setPageData(JSON.parse(res.content || '{}')); } catch {}
    });
  }, []);

  return (
    <>
      <section className="pt-32 pb-12 md:pt-40" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-3" style={{ color: 'var(--primary)' }}>
            {pageData.hero?.headline || 'Your Complete Home Selling Guide'}
          </h1>
          <p className="text-base max-w-xl" style={{ color: 'var(--text-secondary)' }}>{pageData.hero?.subline}</p>
        </div>
      </section>

      {pageData.process?.steps && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-semibold mb-10 text-center" style={{ color: 'var(--primary)' }}>The Selling Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pageData.process.steps.map((step: any) => (
                <div key={step.number} className="p-5 rounded-lg border border-[var(--border)]">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white mb-4"
                    style={{ background: 'var(--secondary)' }}>{step.number}</div>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--primary)' }}>{step.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {pageData.marketingShowcase && (
        <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-semibold mb-8 text-center" style={{ color: 'var(--primary)' }}>How I Market Your Home</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pageData.marketingShowcase.map((item: any, i: number) => (
                <div key={i} className="p-5 bg-white rounded-lg border border-[var(--border)]">
                  <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--primary)' }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-white">
        <div className="container-custom text-center">
          <p className="font-serif text-2xl md:text-3xl mb-3" style={{ color: 'var(--primary)' }}>
            {pageData.cta?.headline || 'Ready to find out what your home is worth?'}
          </p>
          <Link href={`/${locale}${pageData.cta?.ctaHref || '/home-valuation'}`} className="btn-gold inline-block mt-4">
            {pageData.cta?.ctaLabel || 'Get Your Free Home Valuation'}
          </Link>
        </div>
      </section>
    </>
  );
}
