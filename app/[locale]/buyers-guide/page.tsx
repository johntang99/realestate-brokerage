'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export default function BuyersGuidePage() {
  const [pageData, setPageData] = useState<any>({});
  const [locale, setLocale] = useState('en');
  const [openTopic, setOpenTopic] = useState<number | null>(null);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    fetch(`/api/content/file?locale=${loc}&path=pages/buyers-guide.json`).then(r => r.json()).then(res => {
      try { setPageData(JSON.parse(res.content || '{}')); } catch {}
    });
  }, []);

  return (
    <>
      <section className="pt-32 pb-12 md:pt-40" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-3" style={{ color: 'var(--primary)' }}>
            {pageData.hero?.headline || 'Your Complete Home Buying Guide'}
          </h1>
          <p className="text-base max-w-xl" style={{ color: 'var(--text-secondary)' }}>{pageData.hero?.subline}</p>
        </div>
      </section>

      {pageData.process?.steps && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-semibold mb-10 text-center" style={{ color: 'var(--primary)' }}>The Buying Process</h2>
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

      {pageData.topics && (
        <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
          <div className="container-custom max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl font-semibold mb-8" style={{ color: 'var(--primary)' }}>Key Topics</h2>
            <div className="space-y-2">
              {pageData.topics.map((topic: any, i: number) => (
                <div key={i} className="border border-[var(--border)] rounded-lg bg-white overflow-hidden">
                  <button className="w-full flex items-center justify-between p-5 text-left"
                    onClick={() => setOpenTopic(openTopic === i ? null : i)}>
                    <span className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>{topic.title}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openTopic === i ? 'rotate-180' : ''}`}
                      style={{ color: 'var(--text-secondary)' }} />
                  </button>
                  {openTopic === i && (
                    <div className="px-5 pb-5 text-sm leading-relaxed border-t border-[var(--border)]"
                      style={{ color: 'var(--text-secondary)', paddingTop: '1rem' }}>{topic.body}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-white">
        <div className="container-custom text-center">
          <p className="font-serif text-2xl md:text-3xl mb-3" style={{ color: 'var(--primary)' }}>
            {pageData.cta?.headline || 'Ready to start your home search?'}
          </p>
          <Link href={`/${locale}${pageData.cta?.ctaHref || '/contact'}`} className="btn-gold inline-block mt-4">
            {pageData.cta?.ctaLabel || 'Schedule a Free Buyer Consultation'}
          </Link>
        </div>
      </section>
    </>
  );
}
