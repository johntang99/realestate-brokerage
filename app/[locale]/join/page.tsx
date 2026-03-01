'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { AgentCard, type AgentData } from '@/components/ui/AgentCard';
import { trackLeadEvent } from '@/lib/leads/client';

const AGENT_FAQ = [
  { q: "What's the commission split?", a: "We offer competitive splits that we discuss in detail during your consultation. We believe splits should be part of a full conversation, not a one-line website pitch." },
  { q: "Do you provide leads?", a: "Yes — we have a referral program and marketing support. That said, we build agents who generate their own business, not agents who depend on company leads." },
  { q: "Is there a desk fee?", a: "We keep our fee structure simple. Schedule a call and we'll walk you through exactly what to expect." },
  { q: "What training does a new agent receive?", a: "New agents are paired with a senior agent for their first 3 transactions, plus weekly training sessions covering pricing, negotiation, contracts, and marketing." },
  { q: "Do I need to be full-time?", a: "We work with full-time agents. We're building a professional team — not a part-time roster." },
  { q: "Can I keep my current listings if I transfer?", a: "In most cases, yes. We'll walk through your specific situation confidentially." },
];

const WHAT_WE_OFFER = [
  { title: 'Competitive Split', desc: 'Discuss details in a confidential conversation.' },
  { title: 'Training & Mentorship', desc: 'Structured mentorship for new agents. Advanced training for veterans.' },
  { title: 'Marketing Support', desc: 'Professional photography, listing templates, and social media support.' },
  { title: 'Technology', desc: 'CRM, your own brokerage profile page, marketing templates, and transaction management.' },
  { title: 'Culture', desc: 'Collaborative team. Weekly meetings. People who actually pick up the phone.' },
  { title: 'Administrative Support', desc: 'Transaction coordinator support so you can focus on clients, not paperwork.' },
];

export default function JoinPage() {
  const [d, setD] = useState<any>({});
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [site, setSite] = useState<any>({});
  const [locale, setLocale] = useState('en');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', currentSituation:'', yearsExperience:'', lastYearVolume:'', bestTime:'', message:'' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    Promise.all([
      fetch(`/api/content/file?locale=${loc}&path=pages/join.json`).then(r=>r.json()),
      fetch(`/api/content/items?locale=${loc}&directory=agents`).then(r=>r.json()),
      fetch(`/api/content/file?locale=${loc}&path=site.json`).then(r=>r.json()),
    ]).then(([pageRes, agentsRes, siteRes]) => {
      try { setD(JSON.parse(pageRes.content||'{}')); } catch {}
      setAgents(Array.isArray(agentsRes.items) ? agentsRes.items as AgentData[] : []);
      try { setSite(JSON.parse(siteRes.content||'{}')); } catch {}
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    const siteId = process.env.NEXT_PUBLIC_DEFAULT_SITE_ID || 'reb-template';
    const source = d.leadCapture?.sourceTag || 'join-page';
    await trackLeadEvent({ siteId, locale, eventName: 'form_submit', source, pagePath: `/${locale}/join` });
    await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        name:`${form.firstName} ${form.lastName}`,
        ...form,
        category:'join',
        locale,
        siteId,
        source,
        pagePath: `/${locale}/join`,
        consentAccepted: true,
        consentText: d.leadCapture?.consentText || '',
      }) }).catch(()=>{});
    setSubmitted(true); setSubmitting(false);
  };
  const faqItems = d.faq?.items || AGENT_FAQ;
  const offerItems = d.whatWeOffer?.items || WHAT_WE_OFFER;
  const brokerMessage = d.brokerMessage || {};
  const leadCapture = d.leadCapture || {};
  const cta = d.cta || {};

  return (
    <>
      {/* RECRUITMENT HERO */}
      <section className="relative pt-20" style={{ minHeight: '58vh', background: 'var(--backdrop-dark)' }}>
        <div className="container-custom pt-14 pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>{d.hero?.eyebrow || 'Careers'}</p>
          <h1 className="font-serif text-4xl md:text-6xl font-semibold text-white mb-4 max-w-3xl leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            {d.hero?.headline || 'Build Your Real Estate Career Where It Matters.'}
          </h1>
          <p className="text-lg max-w-xl mb-8" style={{ color: 'var(--text-on-dark-muted)' }}>
            {d.hero?.subline || "We're a growing independent brokerage. Join a team that actually invests in your success."}
          </p>
          {/* Mini stats */}
          <div className="flex flex-wrap gap-6">
            {(d.proofStats?.items || [
              { v: site.stats?.agentCount || '18', l: 'Agents' },
              { v: site.stats?.totalVolume || '$180M+', l: 'Volume' },
              { v: site.stats?.yearsInBusiness || '12', l: 'Years in Business' },
            ]).map((s: any, i: number) => (
              <div key={i}>
                <p className="font-serif text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--secondary)' }}>{s.value || s.v}</p>
                <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>{s.label || s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BROKER MESSAGE */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden max-w-sm" style={{ boxShadow: 'var(--photo-shadow)' }}>
              {agents.find((a: any) => a.role === 'principal_broker')?.photo ? (
                <Image src={agents.find((a: any) => a.role === 'principal_broker')!.photo!} alt="Principal Broker" fill className="object-cover object-top" sizes="50vw" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20 text-6xl font-bold"
                  style={{ background: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>P</div>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>A Message from the Broker</p>
              <h2 className="font-serif text-3xl font-semibold mb-5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                {brokerMessage.headline || "Why I Started Panorama — and What We're Building"}
              </h2>
              {(Array.isArray(brokerMessage.paragraphs) ? brokerMessage.paragraphs : [
                'I started Panorama because I believed there was a better way to run a real estate brokerage. Not just for clients — but for agents. Too many talented agents are trapped in franchise models that take a huge cut, provide minimal support, and treat them as interchangeable.',
                "At Panorama, every agent on our team has real mentorship, marketing support, and the backing of a company that genuinely wants them to succeed. If that's what you're looking for, let's have a conversation.",
              ]).map((paragraph: string, index: number) => (
                <p key={index} className={`text-base leading-relaxed ${index === 0 ? 'mb-4' : ''}`} style={{ color: 'var(--text-secondary)', lineHeight: '1.85' }}>
                  {paragraph}
                </p>
              ))}
              <p className="mt-5 font-serif text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                — {site.license?.principalBrokerName || 'Jane Smith'}, Principal Broker
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
        <div className="container-custom">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>What You Get</p>
            <h2 className="font-serif text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>What We Offer</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {offerItems.map((item: any, i: number) => (
              <div key={i} className="flex gap-4 p-5 bg-white rounded-xl border border-[var(--border)]"
                style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--secondary)' }} />
                <div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--primary)' }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.desc || item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AGENT SUCCESS STORIES */}
      {agents.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Agent Stories</p>
              <h2 className="font-serif text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>What Our Agents Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {agents.slice(0, 3).map(agent => <AgentCard key={agent.slug} agent={agent} locale={locale} variant="detailed" />)}
            </div>
          </div>
        </section>
      )}

      {/* AGENT FAQ */}
      <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqItems.map((item: any, i: number) => (
              <div key={i} className="bg-white rounded-xl border border-[var(--border)] overflow-hidden"
                style={{ borderRadius: 'var(--effect-card-radius)' }}>
                <button className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>{item.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--secondary)' }} />
                    : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm" style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN FORM */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-2xl">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Apply</p>
            <h2 className="font-serif text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>{leadCapture.headline || "Let's Have a Conversation"}</h2>
            <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              {leadCapture.subline || "No pressure. No hard sell. Just an honest conversation about whether we're a good fit."}
            </p>
          </div>
          {submitted ? (
            <div className="text-center py-8 border border-[var(--border)] rounded-2xl" style={{ borderRadius: 'var(--effect-card-radius)' }}>
              <p className="font-serif text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Thank you!</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {site.license?.principalBrokerName || 'Our broker'} will be in touch within 1 business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input required value={form.firstName} onChange={e=>setForm(f=>({...f,firstName:e.target.value}))} placeholder="First Name" className="calc-input" />
                <input required value={form.lastName} onChange={e=>setForm(f=>({...f,lastName:e.target.value}))} placeholder="Last Name" className="calc-input" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input required type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="Email" className="calc-input" />
                <input required value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="Phone" className="calc-input" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select value={form.currentSituation} onChange={e=>setForm(f=>({...f,currentSituation:e.target.value}))} className="calc-input">
                  <option value="">Current Situation</option>
                  <option>Currently with another brokerage</option>
                  <option>Newly licensed</option>
                  <option>Considering getting licensed</option>
                  <option>Independent agent</option>
                  <option>Other</option>
                </select>
                <select value={form.yearsExperience} onChange={e=>setForm(f=>({...f,yearsExperience:e.target.value}))} className="calc-input">
                  <option value="">Years of Experience</option>
                  <option>0–1 years</option>
                  <option>1–3 years</option>
                  <option>3–7 years</option>
                  <option>7–15 years</option>
                  <option>15+ years</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select value={form.lastYearVolume} onChange={e=>setForm(f=>({...f,lastYearVolume:e.target.value}))} className="calc-input">
                  <option value="">Last Year's Volume (optional)</option>
                  <option>Under $1M</option>
                  <option>$1M–$5M</option>
                  <option>$5M–$15M</option>
                  <option>$15M–$30M</option>
                  <option>$30M+</option>
                </select>
                <select value={form.bestTime} onChange={e=>setForm(f=>({...f,bestTime:e.target.value}))} className="calc-input">
                  <option value="">Best Time to Chat</option>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                  <option>Weekends</option>
                </select>
              </div>
              <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="Tell us a little about yourself and what you're looking for…" className="calc-input w-full min-h-[90px]" />
              <button type="submit" disabled={submitting} className="btn-gold w-full py-3.5 font-semibold">
                {submitting ? 'Sending…' : 'Send My Information'}
              </button>
              <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                {leadCapture.consentText || 'Your inquiry is completely confidential. We will never contact your current broker.'}
              </p>
            </form>
          )}
        </div>
      </section>
      <section className="py-16" style={{ background: 'var(--primary)' }}>
        <div className="container-custom text-center">
          <h2 className="font-serif text-3xl font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{cta.headline || 'Ready for the Next Step?'}</h2>
          <p className="text-white/70 mb-7 max-w-md mx-auto">{cta.subline || 'Share your goals and schedule a confidential career conversation.'}</p>
        </div>
      </section>
    </>
  );
}
