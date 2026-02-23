'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';

export default function ContactPage() {
  const [pageData, setPageData] = useState<any>({});
  const [siteData, setSiteData] = useState<any>({});
  const [locale, setLocale] = useState('en');
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    Promise.all([
      fetch(`/api/content/file?locale=${loc}&path=pages/contact.json`).then(r => r.json()),
      fetch(`/api/content/file?locale=${loc}&path=site.json`).then(r => r.json()),
    ]).then(([pageRes, siteRes]) => {
      try { setPageData(JSON.parse(pageRes.content || '{}')); } catch {}
      try { setSiteData(JSON.parse(siteRes.content || '{}')); } catch {}
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'consultation', data: formValues }),
    }).catch(() => {});
    setSubmitted(true);
    setSubmitting(false);
  };

  const setField = (name: string, value: string) =>
    setFormValues(v => ({ ...v, [name]: value }));

  const d = pageData;
  const fields = d.form?.fields || [
    { name: 'fullName', type: 'text', label: 'Full Name', required: true },
    { name: 'email', type: 'email', label: 'Email', required: true },
    { name: 'phone', type: 'tel', label: 'Phone', required: true },
    { name: 'interestedIn', type: 'select', label: "I'm Interested In", required: true,
      options: [
        { value: 'buying', label: 'Buying' }, { value: 'selling', label: 'Selling' },
        { value: 'leasing', label: 'Leasing' }, { value: 'commercial', label: 'Commercial' },
        { value: 'investment', label: 'Investment' }, { value: 'other', label: 'Other' },
      ]},
    { name: 'timeline', type: 'select', label: 'Timeline', required: false,
      options: [
        { value: 'asap', label: 'ASAP' }, { value: '1-3-months', label: '1–3 Months' },
        { value: '3-6-months', label: '3–6 Months' }, { value: 'just-exploring', label: 'Just Exploring' },
      ]},
    { name: 'message', type: 'textarea', label: 'Tell me about your real estate goals', required: true },
  ];

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 md:pt-40" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--secondary)' }}>Contact</p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-3" style={{ color: 'var(--primary)' }}>
            {d.hero?.headline || "Let's Talk Real Estate"}
          </h1>
          <p className="text-base max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            {d.hero?.subline || "Reach out about buying, selling, or anything real estate. I respond within 2 hours."}
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-14">

            {/* Form — 60% */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="p-10 border border-[var(--secondary)] rounded-xl text-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: 'var(--backdrop-primary)' }}>
                    <span className="text-2xl">✓</span>
                  </div>
                  <p className="font-serif text-2xl mb-3" style={{ color: 'var(--primary)' }}>Thank you!</p>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {d.form?.successMessage || "I'll be in touch within 2 hours during business hours."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {fields.map((field: any) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                        {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {field.type === 'select' ? (
                        <select required={field.required} className="calc-input"
                          onChange={e => setField(field.name, e.target.value)}>
                          <option value="">Select…</option>
                          {field.options?.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea rows={4} required={field.required} className="calc-input resize-none"
                          onChange={e => setField(field.name, e.target.value)} />
                      ) : (
                        <input type={field.type} required={field.required} placeholder={field.placeholder}
                          className="calc-input" onChange={e => setField(field.name, e.target.value)} />
                      )}
                    </div>
                  ))}
                  <button type="submit" disabled={submitting}
                    className="w-full btn-gold py-3.5 text-sm mt-2">
                    {submitting ? 'Sending…' : (d.form?.submitLabel || 'Request a Consultation')}
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar — 40% */}
            <div className="lg:col-span-2 space-y-8">
              {/* Response promise */}
              {d.directContact?.responsePromise && (
                <div className="p-5 rounded-xl border-l-4" style={{ borderColor: 'var(--secondary)', background: 'var(--backdrop-primary)' }}>
                  <p className="text-sm leading-relaxed italic" style={{ color: 'var(--text-primary)' }}>
                    "{d.directContact.responsePromise}"
                  </p>
                </div>
              )}

              {/* Contact info from site.json */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-semibold" style={{ color: 'var(--primary)' }}>Direct Contact</h3>
                {siteData.phone && (
                  <a href={`tel:${siteData.phone.replace(/\D/g,'')}`}
                    className="flex items-center gap-3 text-sm hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--primary)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--backdrop-primary)' }}>
                      <Phone className="w-4 h-4" style={{ color: 'var(--secondary)' }} />
                    </div>
                    {siteData.phone}
                  </a>
                )}
                {siteData.email && (
                  <a href={`mailto:${siteData.email}`}
                    className="flex items-center gap-3 text-sm hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--primary)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--backdrop-primary)' }}>
                      <Mail className="w-4 h-4" style={{ color: 'var(--secondary)' }} />
                    </div>
                    {siteData.email}
                  </a>
                )}
                {siteData.address?.street && (
                  <div className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'var(--backdrop-primary)' }}>
                      <MapPin className="w-4 h-4" style={{ color: 'var(--secondary)' }} />
                    </div>
                    <span>
                      {siteData.address.street}{siteData.address.suite ? `, ${siteData.address.suite}` : ''}<br />
                      {siteData.address.city}, {siteData.address.state} {siteData.address.zip}
                    </span>
                  </div>
                )}
              </div>

              {/* Social links */}
              {siteData.socialLinks && (
                <div>
                  <h3 className="font-serif text-base font-semibold mb-3" style={{ color: 'var(--primary)' }}>Connect</h3>
                  <div className="flex gap-3">
                    {siteData.socialLinks.instagram && (
                      <a href={siteData.socialLinks.instagram} target="_blank" rel="noreferrer"
                        className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"
                        style={{ background: 'var(--backdrop-primary)' }}>
                        <Instagram className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                      </a>
                    )}
                    {siteData.socialLinks.facebook && (
                      <a href={siteData.socialLinks.facebook} target="_blank" rel="noreferrer"
                        className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"
                        style={{ background: 'var(--backdrop-primary)' }}>
                        <Facebook className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                      </a>
                    )}
                    {siteData.socialLinks.linkedin && (
                      <a href={siteData.socialLinks.linkedin} target="_blank" rel="noreferrer"
                        className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"
                        style={{ background: 'var(--backdrop-primary)' }}>
                        <Linkedin className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                      </a>
                    )}
                    {siteData.socialLinks.youtube && (
                      <a href={siteData.socialLinks.youtube} target="_blank" rel="noreferrer"
                        className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"
                        style={{ background: 'var(--backdrop-primary)' }}>
                        <Youtube className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Brokerage info */}
              {siteData.brokerageName && (
                <div className="pt-4 border-t border-[var(--border)]">
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {siteData.name} is a licensed real estate salesperson affiliated with {siteData.brokerageName}.
                    License: {siteData.licenseNumber}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
