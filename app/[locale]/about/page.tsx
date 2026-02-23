'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Award } from 'lucide-react';

export default function AboutPage() {
  const [pageData, setPageData] = useState<any>({});
  const [siteData, setSiteData] = useState<any>({});
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    Promise.all([
      fetch(`/api/content/file?locale=${loc}&path=pages/about.json`).then(r => r.json()),
      fetch(`/api/content/file?locale=${loc}&path=site.json`).then(r => r.json()),
    ]).then(([pageRes, siteRes]) => {
      try { setPageData(JSON.parse(pageRes.content || '{}')); } catch {}
      try { setSiteData(JSON.parse(siteRes.content || '{}')); } catch {}
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const d = pageData;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-20" style={{ minHeight: '50vh', background: 'var(--primary)' }}>
        {d.hero?.image && (
          <Image src={d.hero.image} alt={d.hero.imageAlt || ''} fill className="object-cover opacity-30" priority />
        )}
        <div className="relative z-10 container-custom pt-20 pb-16 md:pt-28">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--secondary)' }}>About</p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-3">
            {d.hero?.headline || siteData.name || 'Alexandra Reeves'}
          </h1>
          <p className="text-lg text-white/70">{d.hero?.subline || siteData.tagline}</p>
        </div>
      </section>

      {/* Story blocks */}
      {d.story?.blocks?.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="space-y-16">
              {d.story.blocks.map((block: any, i: number) => (
                <div key={i} className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'md:direction-rtl' : ''}`}>
                  <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                    {block.image ? (
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden" style={{ boxShadow: 'var(--card-shadow)' }}>
                        <Image src={block.image} alt={block.imageAlt || ''} fill className="object-cover" sizes="50vw" />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] rounded-xl" style={{ background: 'var(--backdrop-primary)' }} />
                    )}
                  </div>
                  <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                    <p className="text-base leading-relaxed" style={{ color: 'var(--text-primary)', lineHeight: '1.85' }}>{block.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      {d.stats?.items?.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {d.stats.items.map((item: any, i: number) => (
                <div key={i} className="text-center">
                  <p className="font-serif text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--secondary)' }}>{item.value}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Credentials */}
      {d.credentials?.items?.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-semibold mb-8 text-center" style={{ color: 'var(--primary)' }}>
              {d.credentials?.headline || 'Professional Designations'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {d.credentials.items.map((item: any, i: number) => (
                <div key={i} className="p-5 border border-[var(--border)] rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-serif text-2xl font-bold" style={{ color: 'var(--secondary)' }}>{item.abbreviation}</span>
                  </div>
                  <p className="font-semibold text-sm mb-1" style={{ color: 'var(--primary)' }}>{item.name}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {d.team?.members?.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-semibold mb-10 text-center" style={{ color: 'var(--primary)' }}>
              {d.team?.headline || 'The Team'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {d.team.members.map((member: any, i: number) => (
                <div key={i} className={`${member.featured ? 'md:col-span-1' : ''} text-center`}>
                  <div className={`relative mx-auto mb-5 rounded-full overflow-hidden ${member.featured ? 'w-40 h-40' : 'w-28 h-28'}`}
                    style={{ boxShadow: 'var(--card-shadow)' }}>
                    {member.photo ? (
                      <Image src={member.photo} alt={member.name || ''} fill className="object-cover" sizes="160px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-serif text-2xl font-bold text-white"
                        style={{ background: 'var(--primary)' }}>
                        {(member.name || 'A').charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-1" style={{ color: 'var(--primary)' }}>{member.name}</h3>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--secondary)' }}>{member.title}</p>
                  {member.bio && <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{member.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Awards */}
      {d.awards?.items?.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-semibold mb-8 text-center" style={{ color: 'var(--primary)' }}>
              {d.awards?.headline || 'Awards & Recognition'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {d.awards.items.map((item: any, i: number) => (
                <div key={i} className="flex items-start gap-4 p-4 border border-[var(--border)] rounded-lg">
                  <Award className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--secondary)' }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>{item.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.organization} · {item.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Community */}
      {d.community?.body && (
        <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
          <div className="container-custom max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-2xl font-semibold mb-5" style={{ color: 'var(--primary)' }}>
              {d.community?.headline || 'Community Involvement'}
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d.community.body}</p>
          </div>
        </section>
      )}

      {/* Brokerage */}
      {d.brokerage?.name && (
        <section className="py-10 bg-white border-t border-[var(--border)]">
          <div className="container-custom text-center">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>Brokerage Affiliation</p>
            {d.brokerage.logo && <Image src={d.brokerage.logo} alt={d.brokerage.name} width={140} height={40} className="mx-auto mb-3 object-contain" />}
            <p className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>{d.brokerage.name}</p>
            <p className="text-xs max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>{d.brokerage.description}</p>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding" style={{ background: 'var(--primary)' }}>
        <div className="container-custom text-center">
          <h2 className="font-serif text-3xl font-semibold text-white mb-4">
            {d.cta?.headline || "Let's work together."}
          </h2>
          <p className="text-white/70 mb-6 max-w-md mx-auto">{d.cta?.subline}</p>
          <Link href={`/${locale}${d.cta?.ctaHref || '/contact'}`} className="btn-gold inline-block">
            {d.cta?.ctaLabel || 'Schedule a Consultation'}
          </Link>
        </div>
      </section>
    </>
  );
}
