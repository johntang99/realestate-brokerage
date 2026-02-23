'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface PageData {
  hero?: { headline?: string; subline?: string; image?: string };
  form?: { fields?: any[]; submitLabel?: string; successMessage?: string };
  whatToExpect?: { headline?: string; steps?: Array<{number:number;title:string;description:string}> };
  whyMyValuation?: { headline?: string; body?: string };
}

export default function HomeValuationPage() {
  const [pageData, setPageData] = useState<PageData>({});
  const [locale, setLocale] = useState('en');
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    fetch(`/api/content/file?locale=${loc}&path=pages/home-valuation.json`).then(r => r.json()).then(res => {
      try { setPageData(JSON.parse(res.content || '{}')); } catch {}
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'valuation', data: formData }),
    }).catch(() => {});
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-0 md:pt-40 min-h-[50vh] flex items-end" style={{ background: 'var(--primary)' }}>
        {pageData.hero?.image && (
          <Image src={pageData.hero.image} alt="Home valuation" fill className="object-cover opacity-30" priority />
        )}
        <div className="relative z-10 container-custom pb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-4 text-white">
            {pageData.hero?.headline || "What's Your Home Worth?"}
          </h1>
          <p className="text-lg text-white/80 max-w-xl">{pageData.hero?.subline}</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Form */}
            <div>
              <h2 className="font-serif text-2xl font-semibold mb-6" style={{ color: 'var(--primary)' }}>
                Get Your Free Valuation
              </h2>
              {submitted ? (
                <div className="p-8 border border-[var(--secondary)] rounded-lg text-center">
                  <p className="font-serif text-xl mb-2" style={{ color: 'var(--primary)' }}>Thank you!</p>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {pageData.form?.successMessage || "I'll send a detailed valuation within 24 hours."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {(pageData.form?.fields || [
                    {name:'propertyAddress',type:'text',label:'Property Address',required:true,placeholder:'123 Main St, Scarsdale, NY'},
                    {name:'fullName',type:'text',label:'Your Name',required:true},
                    {name:'email',type:'email',label:'Email',required:true},
                    {name:'phone',type:'tel',label:'Phone',required:true},
                  ]).map((field: any) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                        {field.label}{field.required && <span className="text-red-500 ml-0.5">*</span>}
                      </label>
                      {field.type === 'select' ? (
                        <select required={field.required}
                          className="calc-input" onChange={e => setFormData(d => ({...d, [field.name]: e.target.value}))}>
                          <option value="">Select…</option>
                          {(field.options||[]).map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      ) : field.type === 'checkboxes' ? (
                        <div className="flex flex-wrap gap-3 mt-1">
                          {(field.options||[]).map((o: any) => (
                            <label key={o.value} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                              <input type="checkbox" value={o.value}
                                onChange={e => {
                                  const cur = (formData[field.name] as string[] || []);
                                  setFormData(d => ({...d, [field.name]: e.target.checked ? [...cur, o.value] : cur.filter((v:string) => v !== o.value)}));
                                }} />
                              {o.label}
                            </label>
                          ))}
                        </div>
                      ) : (
                        <input type={field.type} required={field.required} placeholder={field.placeholder}
                          className="calc-input" onChange={e => setFormData(d => ({...d, [field.name]: e.target.value}))} />
                      )}
                    </div>
                  ))}
                  <button type="submit" disabled={submitting}
                    className="w-full btn-gold text-sm py-3 mt-2">
                    {submitting ? 'Submitting…' : (pageData.form?.submitLabel || 'Get My Free Valuation')}
                  </button>
                </form>
              )}
            </div>

            {/* Right: What to expect + Why */}
            <div className="space-y-10">
              {pageData.whatToExpect && (
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-5" style={{ color: 'var(--primary)' }}>
                    {pageData.whatToExpect.headline || 'What to Expect'}
                  </h3>
                  <div className="space-y-4">
                    {(pageData.whatToExpect.steps || []).map((step: any) => (
                      <div key={step.number} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white"
                          style={{ background: 'var(--secondary)' }}>{step.number}</div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>{step.title}</p>
                          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pageData.whyMyValuation && (
                <div className="p-6 rounded-lg border border-[var(--border)]" style={{ background: 'var(--backdrop-primary)' }}>
                  <h3 className="font-serif text-lg font-semibold mb-3" style={{ color: 'var(--primary)' }}>
                    {pageData.whyMyValuation.headline || 'Why My Valuation is Different'}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{pageData.whyMyValuation.body}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
