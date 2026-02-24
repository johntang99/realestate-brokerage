'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

const DEFAULT_STEPS = [
  { number: '01', name: 'Get Pre-Approved', description: 'Secure a mortgage pre-approval before you search. In Westchester, sellers expect it.' },
  { number: '02', name: 'Define Your Search', description: 'School district, commute, lifestyle, budget — we help you prioritize what matters most.' },
  { number: '03', name: 'Tour Properties', description: 'We schedule showings, including off-market properties not yet on the MLS.' },
  { number: '04', name: 'Make an Offer', description: 'We craft a competitive offer strategy and negotiate on your behalf.' },
  { number: '05', name: 'Inspection Period', description: 'Home inspection, attorney review, and due diligence — we guide every step.' },
  { number: '06', name: 'Closing Day', description: 'We coordinate with attorneys and lenders to get you to the closing table smoothly.' },
];

const FAQ_ITEMS = [
  { q: "Do I need a buyer's agent?", a: "In New York, buyer representation is strongly recommended. Your agent's commission is typically paid by the seller — so you get expert representation at no cost to you." },
  { q: "How long does it take to buy a home in Westchester?", a: "From accepted offer to closing typically takes 60–90 days. The search itself varies — some buyers find the right home in 2 weeks, others take 6 months." },
  { q: "What's the difference between pre-qualification and pre-approval?", a: "Pre-qualification is a quick estimate. Pre-approval involves a full lender review and is required to be taken seriously as a buyer in this market." },
  { q: "Can I buy and sell at the same time?", a: "Yes — it requires careful coordination. We specialize in synchronized buy/sell transactions and can structure contingencies to protect you." },
  { q: "What are typical closing costs for buyers in New York?", a: "Budget 2–4% of the purchase price. This includes attorney fees, lender fees, title insurance, and transfer taxes (varies by town and price point)." },
];

export default function BuyingPage() {
  const [d, setD] = useState<any>({});
  const [locale, setLocale] = useState('en');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [calcForm, setCalcForm] = useState({ price: '', down: '20', rate: '6.75', term: '30' });

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    fetch(`/api/content/file?locale=${loc}&path=pages/buying.json`)
      .then(r => r.json()).then(res => { try { setD(JSON.parse(res.content || '{}')); } catch {} });
  }, []);

  const monthly = (() => {
    const price = parseFloat(calcForm.price.replace(/,/g,'')) || 0;
    const down = parseFloat(calcForm.down) / 100;
    const r = parseFloat(calcForm.rate) / 100 / 12;
    const n = parseInt(calcForm.term) * 12;
    const principal = price * (1 - down);
    if (!principal || !r) return 0;
    return principal * (r * Math.pow(1+r,n)) / (Math.pow(1+r,n)-1);
  })();

  return (
    <>
      {/* HERO */}
      <section className="relative pt-20" style={{ minHeight: '52vh', background: 'var(--primary)' }}>
        <div className="container-custom pt-16 pb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Buying</p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-4 max-w-2xl leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            {d.hero?.headline || 'Find Your Perfect Home in Westchester County'}
          </h1>
          <p className="text-lg text-white/75 mb-8 max-w-xl">{d.hero?.subline || 'Expert buyer representation. Off-market access. Proven negotiation.'}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/${locale}/properties`} className="btn-gold px-7 py-3">Search Properties</Link>
            <Link href={`/${locale}/team`} className="border-2 border-white text-white hover:bg-white/10 transition-colors px-7 py-3 text-sm font-semibold"
              style={{ borderRadius: 'var(--effect-button-radius)' }}>Talk to a Buyer's Agent</Link>
          </div>
        </div>
      </section>

      {/* WHY BUY WITH US */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Why Pinnacle</p>
            <h2 className="font-serif text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
              Why Buy With Us
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(d.whyBuyWithUs?.items || [
              { heading: 'Deep Local Expertise', description: 'We know every school district, street, and micro-market in Westchester County.' },
              { heading: 'Off-Market Access', description: 'Our agent network surfaces properties before they hit the MLS.' },
              { heading: 'Proven Negotiation', description: '103% average sale-to-list ratio — we know how to win the right way.' },
              { heading: 'First-Time Buyer Guidance', description: 'Patient, thorough guidance through every step for first-time buyers.' },
              { heading: 'Competitive Strategy', description: 'In multiple-offer situations, our clients win more often than not.' },
              { heading: 'No Buyer Agent Fee*', description: 'Your buyer representation is typically paid by the seller under standard New York practice.' },
            ]).map((item: any, i: number) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl border border-[var(--border)]"
                style={{ borderRadius: 'var(--effect-card-radius)' }}>
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--secondary)' }} />
                <div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--primary)' }}>{item.heading}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUYING PROCESS */}
      <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>The Process</p>
            <h2 className="font-serif text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>How Buying Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEFAULT_STEPS.map((step, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-[var(--border)]"
                style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                <p className="font-serif text-3xl font-bold mb-3" style={{ color: 'var(--secondary)', fontFamily: 'var(--font-heading)' }}>{step.number}</p>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>{step.name}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MORTGAGE CALCULATOR */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Tools</p>
            <h2 className="font-serif text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Estimate Your Monthly Payment</h2>
          </div>
          <div className="bg-white p-7 rounded-2xl border border-[var(--border)]"
            style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Home Price ($)', key: 'price', placeholder: '875,000' },
                { label: 'Down Payment (%)', key: 'down', placeholder: '20' },
                { label: 'Interest Rate (%)', key: 'rate', placeholder: '6.75' },
                { label: 'Loan Term (years)', key: 'term', placeholder: '30' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-500 mb-1">{label}</label>
                  <input
                    type="number"
                    value={calcForm[key as keyof typeof calcForm]}
                    onChange={e => setCalcForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="calc-input w-full"
                  />
                </div>
              ))}
            </div>
            {monthly > 0 && (
              <div className="text-center p-6 rounded-xl" style={{ background: 'var(--primary)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)' }}>Estimated Monthly Payment</p>
                <p className="font-serif text-5xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  ${Math.round(monthly).toLocaleString()}
                </p>
                <p className="text-xs mt-2" style={{ color: 'var(--text-on-dark-muted)' }}>Principal + interest only. Does not include taxes, insurance, or HOA.</p>
              </div>
            )}
            <p className="text-xs mt-4 text-center" style={{ color: 'var(--text-secondary)' }}>
              This calculator provides estimates only and is not a commitment to lend. Contact a licensed lender for a full pre-approval.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Questions</p>
            <h2 className="font-serif text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Buyer FAQ</h2>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
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

      {/* CTA */}
      <section className="py-16" style={{ background: 'var(--primary)' }}>
        <div className="container-custom text-center">
          <h2 className="font-serif text-3xl font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Ready to Start Your Search?</h2>
          <p className="text-white/70 mb-7 max-w-md mx-auto">Let's find you a buyer's agent who specializes in exactly what you're looking for.</p>
          <div className="flex justify-center flex-wrap gap-4">
            <Link href={`/${locale}/team`} className="btn-gold px-8 py-3.5">Find a Buyer's Agent</Link>
            <Link href={`/${locale}/properties`} className="border-2 border-white text-white hover:bg-white/10 transition-colors px-8 py-3.5 text-sm font-semibold"
              style={{ borderRadius: 'var(--effect-button-radius)' }}>Browse Properties</Link>
          </div>
        </div>
      </section>
    </>
  );
}
