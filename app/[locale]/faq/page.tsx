'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface FAQItem { question?: string; questionCn?: string; answer?: string; answerCn?: string }
interface FAQCategory { name?: string; nameCn?: string; items?: FAQItem[] }
interface FAQData {
  hero?: { headline?: string; headlineCn?: string; subline?: string; sublineCn?: string };
  categories?: FAQCategory[];
  cta?: { headline?: string; headlineCn?: string; ctaLabel?: string; ctaLabelCn?: string; ctaHref?: string };
}

export default function FAQPage() {
  const [data, setData] = useState<FAQData>({});
  const [locale, setLocale] = useState('en');
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    fetch(`/api/admin/content/file?siteId=julia-studio&locale=${loc}&path=pages/faq.json`)
      .then(r => r.json()).then(d => { try { setData(JSON.parse(d.content || '{}')); } catch {} });
  }, []);

  const isCn = locale === 'zh';
  const tx = (en?: string, cn?: string) => (isCn && cn) ? cn : (en || '');
  const toggle = (key: string) => setOpenKeys(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom max-w-2xl">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-3" style={{ color: 'var(--primary)' }}>
            {tx(data.hero?.headline, data.hero?.headlineCn) || (isCn ? '常见问题' : 'FAQ')}
          </h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>{tx(data.hero?.subline, data.hero?.sublineCn)}</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-2xl">
          {(data.categories || []).map((cat, ci) => (
            <div key={ci} className="mb-10">
              <h2 className="font-serif text-lg font-semibold mb-5 pb-3 border-b border-[var(--border)]" style={{ color: 'var(--primary)' }}>
                {tx(cat.name, cat.nameCn)}
              </h2>
              <div className="space-y-3">
                {(cat.items || []).map((item, qi) => {
                  const key = `${ci}-${qi}`;
                  const open = openKeys.has(key);
                  return (
                    <div key={qi} className="border border-[var(--border)]">
                      <button onClick={() => toggle(key)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                        <span className="font-serif text-base font-medium pr-4" style={{ color: 'var(--primary)' }}>{tx(item.question, item.questionCn)}</span>
                        <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: 'var(--secondary)' }} />
                      </button>
                      {open && (
                        <div className="px-5 pb-5 text-sm leading-loose border-t border-[var(--border)]" style={{ color: 'var(--text-secondary)', paddingTop: '16px' }}>
                          {tx(item.answer, item.answerCn)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 border-t border-[var(--border)]" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom text-center">
          <p className="font-serif text-xl mb-5" style={{ color: 'var(--primary)' }}>{tx(data.cta?.headline, data.cta?.headlineCn) || (isCn ? '还有疑问？' : 'Still have questions?')}</p>
          <Link href={`/${locale}${data.cta?.ctaHref || '/contact'}`} className="btn-gold">{tx(data.cta?.ctaLabel, data.cta?.ctaLabelCn) || (isCn ? '联系我们' : 'Contact Us')}</Link>
        </div>
      </section>
    </>
  );
}
