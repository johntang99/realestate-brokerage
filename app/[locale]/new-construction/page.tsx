'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { TrustPromise } from '@/components/sections/TrustPromise';

const STATUS_BADGE: Record<string,string> = { 'under-construction':'bg-[var(--status-pending)]','pre-construction':'bg-[var(--status-coming-soon)]','move-in-ready':'bg-[var(--status-active)]','sold-out':'bg-gray-500' };
const STATUS_LABEL: Record<string,string> = { 'under-construction':'Under Construction','pre-construction':'Pre-Construction','move-in-ready':'Move-In Ready','sold-out':'Sold Out' };

export default function NewConstructionPage() {
  const [d, setD] = useState<any>({});
  const [developments, setDevelopments] = useState<any[]>([]);
  const [locale, setLocale] = useState('en');
  const [form, setForm] = useState({ name:'', email:'', phone:'', interested:'', budget:'', timeline:'', message:'' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    Promise.all([
      fetch(`/api/content/file?locale=${loc}&path=pages/new-construction.json`).then(r => r.json()),
      fetch(`/api/content/items?locale=${loc}&directory=new-construction`).then(r => r.json()),
    ]).then(([pageRes, listRes]) => {
      try { setD(JSON.parse(pageRes.content || '{}')); } catch {}
      setDevelopments(Array.isArray(listRes.items) ? listRes.items : []);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ...form, category:'new-construction', locale }) }).catch(()=>{});
    setSubmitted(true);
  };

  const whyBuyNewWithUs = d.whyBuyNewWithUs?.items || [
    { title: 'Pre-Market Access', description: 'Access pricing and lot options before broad public visibility.' },
    { title: 'Builder Negotiation', description: 'Support with incentive, upgrade, and timing discussions.' },
    { title: 'Construction Guidance', description: 'Guidance from contract through final walkthrough.' },
  ];
  const buyerJourney = d.buyerJourney?.steps || [];
  const upgradeStrategy = d.upgradeStrategy?.items || [];
  const builderResources = d.builderResources?.items || [];
  const leadCapture = d.leadCapture || {};
  const cta = d.cta || {};

  return (
    <>
      <section className="relative pt-20" style={{ minHeight: '46vh', background: 'var(--primary)' }}>
        <div className="container-custom pt-14 pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>{d.hero?.eyebrow || 'New Construction'}</p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-4 max-w-2xl leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            {d.hero?.headline || 'Build Your Dream Home in Orange County, NY'}
          </h1>
          <p className="text-white/75 max-w-xl">{d.hero?.subline || 'Pre-market access to new developments. Builder negotiation. Construction expertise.'}</p>
        </div>
      </section>

      {/* DEVELOPMENTS */}
      {developments.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Available Now</p>
              <h2 className="font-serif text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Active Developments</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {developments.map((dev: any, i: number) => (
                <div key={i} className="rounded-xl border border-[var(--border)] overflow-hidden"
                  style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                  <div className="relative aspect-[16/9]">
                    {dev.heroImage
                      ? <Image src={dev.heroImage} alt={dev.name||''} fill className="object-cover" sizes="50vw" />
                      : <div className="w-full h-full" style={{ background: 'var(--backdrop-mid)' }} />}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 text-xs font-semibold text-white rounded ${STATUS_BADGE[dev.status]||'bg-gray-500'}`}
                        style={{ borderRadius: 'var(--effect-badge-radius)' }}>
                        {STATUS_LABEL[dev.status]||dev.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-xl font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>{dev.name}</h3>
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--secondary)' }}>{dev.priceRange}</p>
                    <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{dev.location} · Builder: {dev.builder}</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{dev.description}</p>
                    {dev.estimatedCompletion && <p className="text-xs mt-3 font-medium" style={{ color: 'var(--secondary)' }}>Est. Completion: {dev.estimatedCompletion}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WHY BUY NEW WITH US */}
      <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
              {d.whyBuyNewWithUs?.headline || 'Why Buy New Construction With Panorama'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {whyBuyNewWithUs.map((item: any, i: number) => (
              <div key={i} className="p-6 bg-white rounded-xl border border-[var(--border)]"
                style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustPromise
        locale={locale}
        title="Why New-Construction Buyers Trust Panorama"
        body="We help you evaluate builders, negotiate smartly, and avoid expensive upgrade and timeline mistakes."
        ctaLabel="Talk to a New Build Specialist"
        ctaHref="/contact"
      />

      {(buyerJourney.length > 0 || upgradeStrategy.length > 0 || builderResources.length > 0) && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            {buyerJourney.length > 0 && (
              <div className="mb-10">
                <h2 className="font-serif text-2xl font-semibold mb-5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                  {d.buyerJourney?.headline || 'New Build Buyer Journey'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {buyerJourney.map((step: string, i: number) => (
                    <div key={i} className="text-center p-4 rounded-xl border border-[var(--border)]">
                      <div className="w-9 h-9 mx-auto rounded-full text-white text-sm font-semibold flex items-center justify-center mb-2" style={{ background: 'var(--secondary)' }}>
                        {i + 1}
                      </div>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upgradeStrategy.length > 0 && (
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                    {d.upgradeStrategy?.headline || 'Upgrade Strategy Guidance'}
                  </h3>
                  <div className="space-y-2">
                    {upgradeStrategy.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--secondary)' }} />
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {builderResources.length > 0 && (
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                    {d.builderResources?.headline || 'Builder and Move-In Resources'}
                  </h3>
                  <div className="space-y-3">
                    {builderResources.map((item: any, i: number) => (
                      <div key={i} className="p-4 rounded-lg border border-[var(--border)]">
                        <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{item.title}</p>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* INQUIRY FORM */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
              {leadCapture.headline || 'Interested in a New Build?'}
            </h2>
            {leadCapture.subline ? (
              <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{leadCapture.subline}</p>
            ) : null}
          </div>
          {submitted ? (
            <div className="text-center py-6 border border-[var(--border)] rounded-2xl" style={{ borderRadius: 'var(--effect-card-radius)' }}>
              <p className="font-semibold" style={{ color: 'var(--primary)' }}>Thank you! We'll be in touch about new construction opportunities.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Full Name" className="calc-input" />
                <input required type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="Email" className="calc-input" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="Phone" className="calc-input" />
                <select value={form.interested} onChange={e=>setForm(f=>({...f,interested:e.target.value}))} className="calc-input">
                  <option value="">Interested Development</option>
                  {developments.map((d: any) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
                  <option value="general">General new construction inquiry</option>
                </select>
              </div>
              <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="Tell us what you're looking for…" className="calc-input w-full min-h-[80px]" />
              <button type="submit" className="btn-gold w-full py-3.5">Send Inquiry</button>
              {leadCapture.consentText ? <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{leadCapture.consentText}</p> : null}
            </form>
          )}
        </div>
      </section>

      <section className="py-16" style={{ background: 'var(--primary)' }}>
        <div className="container-custom text-center">
          <h2 className="font-serif text-3xl font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            {cta.headline || 'Plan Your New Construction Purchase'}
          </h2>
          <p className="text-white/70 mb-7 max-w-md mx-auto">{cta.subline || 'Talk with a specialist before you sign with a builder.'}</p>
          <Link href={`/${locale}${cta.primaryActionHref || '/contact'}`} className="btn-gold inline-flex items-center gap-2 px-8 py-3.5">
            {cta.primaryActionLabel || 'Schedule a New Build Consultation'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
