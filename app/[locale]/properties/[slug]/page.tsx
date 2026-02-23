'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bed, Bath, Maximize2, Share2, Phone } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = { 'for-sale':'status-badge-active','pending':'status-badge-pending','sold':'status-badge-sold','for-lease':'status-badge-lease' };
const STATUS_LABELS: Record<string, string> = { 'for-sale':'For Sale','pending':'Pending','sold':'Sold','for-lease':'For Lease' };

function MortgageCalc({ price }: { price?: number }) {
  const [homePrice, setHomePrice] = useState(price || 500000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);

  const loanAmt = homePrice * (1 - downPct / 100);
  const mRate = rate / 100 / 12;
  const n = term * 12;
  const monthly = mRate === 0 ? loanAmt / n : loanAmt * mRate * Math.pow(1 + mRate, n) / (Math.pow(1 + mRate, n) - 1);
  const totalInterest = monthly * n - loanAmt;

  return (
    <div className="p-6 border border-[var(--border)] rounded-xl">
      <h3 className="font-serif text-lg font-semibold mb-5" style={{ color: 'var(--primary)' }}>Mortgage Calculator</h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Home Price</label>
          <input type="number" value={homePrice} onChange={e => setHomePrice(+e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Down Payment ({downPct}%)</label>
          <input type="range" min={3} max={50} value={downPct} onChange={e => setDownPct(+e.target.value)} className="w-full" />
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>${(homePrice * downPct / 100).toLocaleString()}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Interest Rate (%)</label>
            <input type="number" step={0.1} value={rate} onChange={e => setRate(+e.target.value)} className="calc-input" />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Loan Term</label>
            <select value={term} onChange={e => setTerm(+e.target.value)} className="calc-input">
              <option value={15}>15 years</option>
              <option value={20}>20 years</option>
              <option value={30}>30 years</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mt-5 p-4 rounded-lg" style={{ background: 'var(--backdrop-primary)' }}>
        <p className="font-serif text-2xl font-semibold mb-1" style={{ color: 'var(--secondary)' }}>
          ${isNaN(monthly) ? '—' : Math.round(monthly).toLocaleString()}<span className="text-sm font-normal">/mo</span>
        </p>
        <div className="text-xs space-y-1 mt-2" style={{ color: 'var(--text-secondary)' }}>
          <div className="flex justify-between"><span>Loan amount</span><span>${loanAmt.toLocaleString()}</span></div>
          <div className="flex justify-between"><span>Total interest</span><span>${isNaN(totalInterest) ? '—' : Math.round(totalInterest).toLocaleString()}</span></div>
        </div>
      </div>
      <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Estimates only. Contact a licensed lender for actual rates and terms.
      </p>
    </div>
  );
}

export default function PropertyDetailPage({ params }: { params: { slug: string; locale: string } }) {
  const [property, setProperty] = useState<any>(null);
  const [locale, setLocale] = useState('en');
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loc = window.location.pathname.split('/')[1] === 'zh' ? 'zh' : 'en';
    setLocale(loc);
    fetch(`/api/content/file?locale=${loc}&path=properties/${params.slug}.json`).then(r => r.json()).then(res => {
      try { setProperty(JSON.parse(res.content || 'null')); } catch {}
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [params.slug]);

  if (loading) return <div className="pt-40 container-custom"><div className="animate-pulse h-8 bg-gray-100 rounded w-1/2 mb-4" /></div>;
  if (!property) return (
    <div className="pt-40 container-custom text-center">
      <p className="font-serif text-2xl mb-4" style={{ color: 'var(--primary)' }}>Property not found</p>
      <Link href={`/${locale}/properties`} className="text-sm underline" style={{ color: 'var(--secondary)' }}>← Back to Properties</Link>
    </div>
  );

  const p = property;
  const allImages = [p.coverImage, ...(p.images?.map((img: any) => img.url || img) || [])].filter(Boolean);
  const displayPrice = p.status === 'sold' && p.soldDetails?.soldPrice
    ? `$${p.soldDetails.soldPrice.toLocaleString()}`
    : p.status === 'for-lease' && p.leaseDetails?.monthlyRent
    ? `$${p.leaseDetails.monthlyRent.toLocaleString()}/mo`
    : p.priceDisplay || (p.price ? `$${p.price.toLocaleString()}` : '');

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'inquiry', propertySlug: p.slug, propertyAddress: p.address, data: formData }) }).catch(() => {});
    setSubmitted(true);
  };

  return (
    <>
      {/* Photo Gallery */}
      <div className="pt-16 md:pt-20">
        {allImages.length > 0 ? (
          <div>
            <div className="relative w-full" style={{ height: '60vh', minHeight: '400px' }}>
              <Image src={allImages[activeImg]} alt={p.coverImageAlt || p.address || ''} fill className="object-cover" priority sizes="100vw" />
              {p.status && (
                <div className="absolute top-4 left-4 z-10">
                  <span className={`status-badge ${STATUS_COLORS[p.status] || ''}`}>{STATUS_LABELS[p.status] || p.status}</span>
                </div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="container-custom py-3 flex gap-2 overflow-x-auto">
                {allImages.map((img: string, i: number) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 relative w-20 h-14 rounded overflow-hidden border-2 transition-colors ${activeImg===i?'border-[var(--secondary)]':'border-transparent'}`}>
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full" style={{ height: '50vh', background: 'var(--backdrop-primary)' }} />
        )}
      </div>

      {/* Main content */}
      <div className="container-custom py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left — Details */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <Link href={`/${locale}/properties`} className="text-xs uppercase tracking-widest mb-3 block"
                style={{ color: 'var(--secondary)' }}>← All Properties</Link>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-2" style={{ color: 'var(--primary)' }}>{p.address}</h1>
              <p className="text-base mb-3" style={{ color: 'var(--text-secondary)' }}>{p.city}, {p.state} {p.zip}</p>
              <p className="font-serif text-3xl font-bold mb-4" style={{ color: p.status==='sold'?'var(--status-sold)':'var(--secondary)' }}>{displayPrice}</p>
              <div className="flex flex-wrap gap-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {p.beds > 0 && <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{p.beds} Bed{p.beds!==1?'s':''}</span>}
                {p.baths > 0 && <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{p.baths} Bath{p.baths!==1?'s':''}</span>}
                {p.sqft > 0 && <span className="flex items-center gap-1"><Maximize2 className="w-4 h-4" />{p.sqft.toLocaleString()} sqft</span>}
              </div>
              {p.status === 'sold' && p.soldDetails && (
                <div className="mt-4 p-4 rounded-lg border border-[var(--status-sold)] bg-red-50">
                  <p className="text-sm font-semibold" style={{ color: 'var(--status-sold)' }}>
                    Sold for ${p.soldDetails.soldPrice?.toLocaleString()} on {p.soldDetails.soldDate}
                    {p.soldDetails.daysOnMarket && ` · ${p.soldDetails.daysOnMarket} days on market`}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            {p.description && (
              <div className="mb-8">
                <h2 className="font-serif text-xl font-semibold mb-4" style={{ color: 'var(--primary)' }}>About this Property</h2>
                {p.description.split('\n\n').map((para: string, i: number) => (
                  <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-primary)' }}>{para}</p>
                ))}
              </div>
            )}

            {/* Key Details */}
            <div className="mb-8">
              <h2 className="font-serif text-xl font-semibold mb-4" style={{ color: 'var(--primary)' }}>Property Details</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['MLS #', p.mlsNumber],['Type', p.type?.replace(/-/g,' ').replace(/\b\w/g, (c:string)=>c.toUpperCase())],
                  ['Year Built', p.yearBuilt],['Lot Size', p.lotSize],['Garage', p.garage],
                  ['HOA', p.hoa],['Annual Taxes', p.taxAmount],['School District', p.schoolDistrict],
                ].filter(([,v]) => v).map(([label, value]) => (
                  <div key={label as string} className="p-3 rounded border border-[var(--border)]" style={{ background: 'var(--backdrop-primary)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                    <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--text-primary)' }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {p.features && Object.entries(p.features).some(([,v]) => (v as string[]).length > 0) && (
              <div className="mb-8">
                <h2 className="font-serif text-xl font-semibold mb-4" style={{ color: 'var(--primary)' }}>Features & Amenities</h2>
                {Object.entries(p.features).filter(([,v]) => (v as string[]).length > 0).map(([cat, items]) => (
                  <div key={cat} className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)' }}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(items as string[]).map((item, i) => (
                        <span key={i} className="text-xs px-3 py-1 rounded-full border border-[var(--border)]"
                          style={{ color: 'var(--text-primary)', background: 'var(--backdrop-primary)' }}>{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Lease Details */}
            {p.status === 'for-lease' && p.leaseDetails && (
              <div className="mb-8 p-5 rounded-xl border border-[var(--status-lease)]" style={{ background: '#EFF6FF' }}>
                <h2 className="font-serif text-lg font-semibold mb-4" style={{ color: 'var(--primary)' }}>Lease Details</h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {p.leaseDetails.monthlyRent && <div><span style={{ color: 'var(--text-secondary)' }}>Monthly Rent</span><p className="font-semibold">${p.leaseDetails.monthlyRent.toLocaleString()}/mo</p></div>}
                  {p.leaseDetails.leaseTerm && <div><span style={{ color: 'var(--text-secondary)' }}>Lease Term</span><p className="font-semibold">{p.leaseDetails.leaseTerm}</p></div>}
                  {p.leaseDetails.availableDate && <div><span style={{ color: 'var(--text-secondary)' }}>Available</span><p className="font-semibold">{p.leaseDetails.availableDate}</p></div>}
                  {p.leaseDetails.petPolicy && <div><span style={{ color: 'var(--text-secondary)' }}>Pets</span><p className="font-semibold">{p.leaseDetails.petPolicy}</p></div>}
                </div>
              </div>
            )}

            {/* Mortgage Calculator — only for active listings */}
            {(p.status === 'for-sale' || p.status === 'pending') && <MortgageCalc price={p.price} />}

            {/* Neighborhood link */}
            {p.neighborhood && (
              <div className="mt-8 p-5 border border-[var(--border)] rounded-xl">
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)' }}>Neighborhood</p>
                <p className="font-serif text-lg font-semibold mb-1" style={{ color: 'var(--primary)' }}>
                  {p.neighborhood.replace(/-/g,' ').replace(/\b\w/g, (c:string)=>c.toUpperCase())}
                </p>
                <Link href={`/${locale}/neighborhoods/${p.neighborhood}`} className="text-sm underline" style={{ color: 'var(--secondary)' }}>
                  Explore neighborhood →
                </Link>
              </div>
            )}
          </div>

          {/* Right — Inquiry Form (sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 border border-[var(--border)] rounded-xl shadow-lg" style={{ background: 'white' }}>
              <h3 className="font-serif text-lg font-semibold mb-4" style={{ color: 'var(--primary)' }}>
                {p.status === 'for-lease' ? 'Schedule a Viewing' : 'Interested in this Property?'}
              </h3>
              {submitted ? (
                <div className="text-center py-6">
                  <p className="font-semibold mb-2" style={{ color: 'var(--accent)' }}>Thank you!</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>I'll be in touch within 2 hours during business hours.</p>
                </div>
              ) : (
                <form onSubmit={handleInquiry} className="space-y-3">
                  {[{name:'name',type:'text',placeholder:'Your Name',required:true},{name:'email',type:'email',placeholder:'Email',required:true},{name:'phone',type:'tel',placeholder:'Phone'}].map(f => (
                    <input key={f.name} type={f.type} placeholder={f.placeholder} required={f.required}
                      className="calc-input" onChange={e => setFormData(d => ({...d, [f.name]: e.target.value}))} />
                  ))}
                  <textarea rows={3} placeholder={`I'd like more info about ${p.address}`}
                    className="calc-input resize-none"
                    defaultValue={`I'd like more info about ${p.address}`}
                    onChange={e => setFormData(d => ({...d, message: e.target.value}))} />
                  <button type="submit" className="w-full btn-gold text-sm py-3">
                    {p.status === 'for-lease' ? 'Request a Viewing' : 'Request More Info'}
                  </button>
                </form>
              )}
              <div className="mt-5 pt-5 border-t border-[var(--border)]">
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>Alexandra Reeves</p>
                <a href="tel:+19145550178" className="flex items-center gap-2 text-sm font-semibold hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--primary)' }}>
                  <Phone className="w-4 h-4" />(914) 555-0178
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MLS Disclaimer */}
      <div className="container-custom pb-10">
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          The information provided is for consumers' personal, non-commercial use and may not be used for any purpose other than to identify prospective properties. All data is deemed reliable but is not guaranteed accurate.
        </p>
      </div>
    </>
  );
}
