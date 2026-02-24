'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InvestingPage() {
  const [locale, setLocale] = useState('en');
  const [form, setForm] = useState({ name:'', email:'', phone:'', investmentType:'', budget:'', timeline:'', message:'' });
  const [submitted, setSubmitted] = useState(false);

  // CAP Rate Calculator state
  const [calc, setCalc] = useState({ price:'400000', rent:'3200', vacancy:'5', tax:'8000', insurance:'2400', maintenance:'4000', mgmtPct:'8', other:'0' });

  useEffect(() => { setLocale(window.location.pathname.startsWith('/zh') ? 'zh' : 'en'); }, []);

  const annualRent = (parseFloat(calc.rent)||0) * 12;
  const effectiveGross = annualRent * (1 - (parseFloat(calc.vacancy)||0)/100);
  const mgmtFee = effectiveGross * (parseFloat(calc.mgmtPct)||0)/100;
  const totalExpenses = (parseFloat(calc.tax)||0) + (parseFloat(calc.insurance)||0) + (parseFloat(calc.maintenance)||0) + mgmtFee + (parseFloat(calc.other)||0);
  const noi = effectiveGross - totalExpenses;
  const price = parseFloat(calc.price)||0;
  const capRate = price > 0 ? (noi/price)*100 : 0;
  const grm = annualRent > 0 ? price/annualRent : 0;

  const capColor = capRate >= 8 ? '#2E6B4F' : capRate >= 6 ? '#C17F24' : capRate >= 4 ? '#D97706' : '#8B1A1A';
  const capLabel = capRate >= 8 ? 'Excellent' : capRate >= 6 ? 'Good' : capRate >= 4 ? 'Fair' : capRate > 0 ? 'Poor' : '—';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ...form, category:'investor', locale }) }).catch(()=>{});
    setSubmitted(true);
  };

  const TYPES = ['Residential Rental','Multifamily (2–4 units)','Commercial','New Construction','Land / Subdivision','1031 Exchange'];

  return (
    <>
      <section className="relative pt-20" style={{ minHeight: '46vh', background: 'var(--primary)' }}>
        <div className="container-custom pt-14 pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Investing</p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-4 max-w-2xl leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Build Wealth Through Real Estate in Westchester County
          </h1>
          <p className="text-white/75 max-w-xl mb-7">Data-driven investment strategy. Cap rate analysis. Off-market access.</p>
          <Link href="#calculator" className="btn-gold px-7 py-3">Try the CAP Rate Calculator</Link>
        </div>
      </section>

      {/* INVESTMENT TYPES */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>What We Support</p>
            <h2 className="font-serif text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Investment Types</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TYPES.map((type, i) => (
              <div key={i} className="p-5 rounded-xl border border-[var(--border)] text-center"
                style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                <p className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>{type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAP RATE CALCULATOR */}
      <section id="calculator" className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Tools</p>
            <h2 className="font-serif text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>CAP Rate Calculator</h2>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>Estimate the capitalization rate and NOI for any investment property.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className="bg-white p-6 rounded-2xl border border-[var(--border)]" style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
              <h3 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-secondary)' }}>Property & Income</h3>
              <div className="space-y-3">
                {[
                  { label: 'Purchase Price ($)', key: 'price' },
                  { label: 'Monthly Gross Rent ($)', key: 'rent' },
                  { label: 'Vacancy Rate (%)', key: 'vacancy' },
                ].map(({ label, key }) => (
                  <div key={key} className="flex items-center justify-between gap-3">
                    <label className="text-sm flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                    <input type="number" value={calc[key as keyof typeof calc]}
                      onChange={e => setCalc(c => ({ ...c, [key]: e.target.value }))}
                      className="calc-input w-32 text-right" />
                  </div>
                ))}
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-widest mt-5 mb-4" style={{ color: 'var(--text-secondary)' }}>Annual Expenses</h3>
              <div className="space-y-3">
                {[
                  { label: 'Property Tax ($)', key: 'tax' },
                  { label: 'Insurance ($)', key: 'insurance' },
                  { label: 'Maintenance ($)', key: 'maintenance' },
                  { label: 'Property Management (%)', key: 'mgmtPct' },
                  { label: 'Other Expenses ($)', key: 'other' },
                ].map(({ label, key }) => (
                  <div key={key} className="flex items-center justify-between gap-3">
                    <label className="text-sm flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                    <input type="number" value={calc[key as keyof typeof calc]}
                      onChange={e => setCalc(c => ({ ...c, [key]: e.target.value }))}
                      className="calc-input w-32 text-right" />
                  </div>
                ))}
              </div>
            </div>
            {/* Results */}
            <div className="bg-white p-6 rounded-2xl border border-[var(--border)]" style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
              <h3 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-secondary)' }}>Results</h3>
              <div className="text-center p-6 rounded-xl mb-5" style={{ background: 'var(--primary)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)' }}>CAP Rate</p>
                <p className="font-serif text-6xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: capColor === '#2E6B4F' ? '#6EE7B7' : capColor === '#C17F24' ? '#FCD34D' : capColor === '#D97706' ? '#FCA5A5' : '#FCA5A5' }}>
                  {capRate > 0 ? `${capRate.toFixed(2)}%` : '—'}
                </p>
                <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: capColor }}>{capLabel}</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Effective Gross Income', value: `$${Math.round(effectiveGross).toLocaleString()}/yr` },
                  { label: 'Total Operating Expenses', value: `$${Math.round(totalExpenses).toLocaleString()}/yr` },
                  { label: 'Net Operating Income (NOI)', value: `$${Math.round(noi).toLocaleString()}/yr`, bold: true },
                  { label: 'Gross Rent Multiplier', value: grm > 0 ? grm.toFixed(1) : '—' },
                ].map((row, i) => (
                  <div key={i} className={`flex justify-between py-2 border-b border-[var(--border)] ${row.bold ? 'font-semibold' : ''}`}>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{row.label}</span>
                    <span className="text-sm" style={{ color: row.bold ? 'var(--primary)' : 'var(--text-primary)' }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-4" style={{ color: 'var(--text-secondary)' }}>This calculator is for estimation purposes only and does not constitute financial advice.</p>
            </div>
          </div>
        </div>
      </section>

      {/* INVESTOR CONSULTATION FORM */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Ready to Build Your Portfolio?</h2>
          </div>
          {submitted ? (
            <div className="text-center py-8">
              <p className="font-semibold" style={{ color: 'var(--primary)' }}>Thank you! An investment specialist will be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Full Name" className="calc-input" />
                <input required type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="Email" className="calc-input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="Phone (optional)" className="calc-input" />
                <select value={form.investmentType} onChange={e=>setForm(f=>({...f,investmentType:e.target.value}))} className="calc-input">
                  <option value="">Investment Type</option>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select value={form.budget} onChange={e=>setForm(f=>({...f,budget:e.target.value}))} className="calc-input">
                  <option value="">Budget Range</option>
                  <option>Under $500K</option>
                  <option>$500K–$1M</option>
                  <option>$1M–$2.5M</option>
                  <option>$2.5M+</option>
                </select>
                <select value={form.timeline} onChange={e=>setForm(f=>({...f,timeline:e.target.value}))} className="calc-input">
                  <option value="">Timeline</option>
                  <option>Ready now</option>
                  <option>3–6 months</option>
                  <option>6–12 months</option>
                  <option>Just researching</option>
                </select>
              </div>
              <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="Tell us about your investment goals…" className="calc-input w-full min-h-[80px]" />
              <button type="submit" className="btn-gold w-full py-3.5">Schedule an Investor Consultation</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
