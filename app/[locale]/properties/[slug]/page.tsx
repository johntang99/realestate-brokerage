'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Bed, Bath, Maximize2, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { AgentCard, type AgentData } from '@/components/ui/AgentCard';

export default function PropertyDetailPage() {
  const [property, setProperty] = useState<any>(null);
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' });
  const [submitted, setSubmitted] = useState(false);
  // Mortgage calculator
  const [calcDown, setCalcDown] = useState('20');
  const [calcRate, setCalcRate] = useState('6.75');
  const [calcTerm, setCalcTerm] = useState('30');

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    const slug = window.location.pathname.split('/').filter(Boolean).pop() || '';
    Promise.all([
      fetch(`/api/content/items?locale=${loc}&directory=properties`).then(r=>r.json()),
      fetch(`/api/content/items?locale=${loc}&directory=agents`).then(r=>r.json()),
    ]).then(([propsRes, agentsRes]) => {
      const allProps = Array.isArray(propsRes.items) ? propsRes.items : [];
      const p = allProps.find((x: any) => x.slug === slug);
      setProperty(p || null);
      if (p?.listingAgentSlug) {
        const allAgents = Array.isArray(agentsRes.items) ? agentsRes.items as AgentData[] : [];
        setAgent(allAgents.find((a: any) => a.slug === p.listingAgentSlug) || null);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ...form, agentSlug: property?.listingAgentSlug, propertySlug: property?.slug, category:'property-inquiry', locale }) }).catch(()=>{});
    setSubmitted(true);
  };

  const monthly = (() => {
    const price = property?.price || 0;
    const down = parseFloat(calcDown)/100;
    const r = parseFloat(calcRate)/100/12;
    const n = parseInt(calcTerm)*12;
    const principal = price*(1-down);
    if (!principal||!r) return 0;
    return principal*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
  })();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--secondary)', borderTopColor: 'transparent' }} /></div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center pt-20"><Link href={`/${locale}/properties`} className="btn-gold">← Back to Properties</Link></div>;

  const images = [property.coverImage, ...(property.gallery||[]).map((g: any) => g.image||g)].filter(Boolean);
  const STATUS_LABEL: Record<string,string> = { 'active':'For Sale','pending':'Pending','sold':'Sold','for-lease':'For Lease','coming-soon':'Coming Soon' };

  return (
    <>
      {/* BACK */}
      <div className="pt-20 pb-4" style={{ background: 'var(--primary)' }}>
        <div className="container-custom">
          <Link href={`/${locale}/properties`} className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Properties
          </Link>
        </div>
      </div>

      {/* PHOTO GALLERY */}
      <div style={{ background: 'var(--primary)' }}>
        <div className="container-custom pb-0">
          <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-t-xl">
            {images[activeImage]
              ? <Image src={images[activeImage]} alt={property.address||''} fill className="object-cover" sizes="100vw" priority />
              : <div className="w-full h-full" style={{ background: 'var(--backdrop-mid)' }} />}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-3 hide-scrollbar">
              {images.slice(0,8).map((img: string, i: number) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`relative flex-shrink-0 w-20 h-14 overflow-hidden rounded-lg border-2 transition-all ${i === activeImage ? 'border-[var(--secondary)]' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
            {/* Main */}
            <div>
              {/* Header */}
              <div className="mb-6 pb-6 border-b border-[var(--border)]">
                <div className="flex items-start justify-between flex-wrap gap-3 mb-2">
                  <div>
                    <p className="font-serif text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--secondary)' }}>
                      {property.priceDisplay||(property.price?`$${property.price.toLocaleString()}`:'')}
                    </p>
                    <span className="px-2 py-0.5 text-xs font-semibold text-white rounded mt-1 inline-block" style={{ background: 'var(--status-active)', borderRadius: 'var(--effect-badge-radius)' }}>
                      {STATUS_LABEL[property.status]||property.status}
                    </span>
                  </div>
                  {property.mlsNumber && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>MLS# {property.mlsNumber}</p>}
                </div>
                <h1 className="font-serif text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>{property.address}</h1>
                <p className="flex items-center gap-1 text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  <MapPin className="w-3.5 h-3.5" />{property.city}, {property.state} {property.zip}
                </p>
                <div className="flex flex-wrap gap-5 mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {property.beds&&<span className="flex items-center gap-1.5"><Bed className="w-4 h-4"/><strong style={{color:'var(--primary)'}}>{property.beds}</strong> Bedrooms</span>}
                  {property.baths&&<span className="flex items-center gap-1.5"><Bath className="w-4 h-4"/><strong style={{color:'var(--primary)'}}>{property.baths}</strong> Bathrooms</span>}
                  {property.sqft&&<span className="flex items-center gap-1.5"><Maximize2 className="w-4 h-4"/><strong style={{color:'var(--primary)'}}>{property.sqft.toLocaleString()}</strong> Sq Ft</span>}
                </div>
              </div>

              {/* Key details */}
              {[property.lotSize,property.yearBuilt,property.garage,property.schoolDistrict,property.hoa].some(Boolean) && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-[var(--border)]">
                  {[
                    { l: 'Lot Size', v: property.lotSize },
                    { l: 'Year Built', v: property.yearBuilt },
                    { l: 'Garage', v: property.garage },
                    { l: 'School District', v: property.schoolDistrict },
                    { l: 'HOA', v: property.hoa ? `$${property.hoa}/mo` : 'None' },
                    { l: 'Property Type', v: property.type?.replace(/-/g,' ').replace(/\b\w/g,(c:string)=>c.toUpperCase()) },
                  ].filter(s=>s.v).map((s,i)=>(
                    <div key={i}>
                      <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--text-secondary)' }}>{s.l}</p>
                      <p className="font-medium text-sm mt-0.5" style={{ color: 'var(--primary)' }}>{s.v}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              {property.description && (
                <div className="mb-6 pb-6 border-b border-[var(--border)]">
                  <h2 className="font-serif text-xl font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>About This Home</h2>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>{property.description}</p>
                </div>
              )}

              {/* Features */}
              {property.features && Object.keys(property.features).length > 0 && (
                <div className="mb-6 pb-6 border-b border-[var(--border)]">
                  <h2 className="font-serif text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Features & Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {Object.entries(property.features).map(([cat, items]: [string, any]) => (
                      <div key={cat}>
                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)' }}>{cat}</p>
                        <ul className="space-y-1">
                          {(items as string[]).map((item: string, i: number) => (
                            <li key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>· {item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mortgage calculator */}
              <div className="mb-6">
                <h2 className="font-serif text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Estimate Your Payment</h2>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[{l:'Down Payment (%)',k:'calcDown',v:calcDown,set:setCalcDown},{l:'Interest Rate (%)',k:'calcRate',v:calcRate,set:setCalcRate},{l:'Loan Term (yrs)',k:'calcTerm',v:calcTerm,set:setCalcTerm}].map(({l,k,v,set})=>(
                    <div key={k}>
                      <label className="text-xs text-gray-500 block mb-1">{l}</label>
                      <input type="number" value={v} onChange={e=>set(e.target.value)} className="calc-input w-full" />
                    </div>
                  ))}
                </div>
                {monthly > 0 && (
                  <div className="p-4 rounded-xl text-center" style={{ background: 'var(--backdrop-light)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Est. Monthly Payment</p>
                    <p className="font-serif text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>${Math.round(monthly).toLocaleString()}/mo</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Principal + interest only. Taxes and insurance not included.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              {/* Listing agent */}
              {agent && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>Listed By</p>
                  <AgentCard agent={agent} locale={locale} variant="compact" />
                  <div className="flex gap-2 mt-3">
                    {(agent as any).phone && (
                      <a href={`tel:${(agent as any).phone?.replace(/\D/g,'')}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold border border-[var(--border)] hover:bg-gray-50"
                        style={{ color: 'var(--primary)' }}>
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                    )}
                    {(agent as any).email && (
                      <a href={`mailto:${(agent as any).email}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold border border-[var(--border)] hover:bg-gray-50"
                        style={{ color: 'var(--primary)' }}>
                        <Mail className="w-3.5 h-3.5" /> Email
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Inquiry form */}
              <div className="p-5 bg-white rounded-xl border border-[var(--border)]"
                style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                {submitted ? (
                  <p className="text-sm text-center py-4 font-semibold" style={{ color: 'var(--primary)' }}>Message sent! We'll be in touch shortly.</p>
                ) : (
                  <form onSubmit={handleInquiry} className="space-y-3">
                    <p className="font-semibold text-sm mb-3" style={{ color: 'var(--primary)' }}>Inquire About This Property</p>
                    <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Your Name" className="calc-input w-full text-sm" />
                    <input required type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="Email" className="calc-input w-full text-sm" />
                    <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="Phone (optional)" className="calc-input w-full text-sm" />
                    <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="I'm interested in this property…" className="calc-input w-full text-sm min-h-[80px]" />
                    <button type="submit" className="btn-gold w-full py-2.5 text-sm">Send Message</button>
                  </form>
                )}
              </div>

              {/* Showing request */}
              <Link href={`/${locale}/contact`} className="flex items-center justify-center gap-2 w-full py-3 border-2 border-[var(--primary)] text-sm font-semibold hover:bg-[var(--primary)] hover:text-white transition-colors"
                style={{ borderRadius: 'var(--effect-button-radius)', color: 'var(--primary)' }}>
                <Calendar className="w-4 h-4" /> Schedule a Showing
              </Link>

              {/* Compliance */}
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Listed by Pinnacle Realty Group · License #{process.env.NEXT_PUBLIC_DEFAULT_SITE_ID||'—'} · All information deemed reliable but not guaranteed.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
