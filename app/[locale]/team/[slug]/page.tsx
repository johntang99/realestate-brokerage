'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, Instagram, Linkedin, Facebook, Star, ArrowLeft, Globe, Award, Bed, Bath, Maximize2 } from 'lucide-react';
import { AgentCard, type AgentData } from '@/components/ui/AgentCard';

interface Property {
  slug: string; address?: string; city?: string; state?: string;
  price?: number; priceDisplay?: string; status?: string;
  beds?: number; baths?: number; sqft?: number; coverImage?: string;
  listingAgentSlug?: string;
}

const STATUS_BADGE: Record<string,string> = { 'active':'bg-[var(--status-active)]', 'pending':'bg-[var(--status-pending)]', 'sold':'bg-[var(--status-sold)]' };
const STATUS_LABEL: Record<string,string> = { 'active':'For Sale', 'pending':'Pending', 'sold':'Sold' };

export default function AgentProfilePage() {
  const [agent, setAgent] = useState<any>(null);
  const [listings, setListings] = useState<Property[]>([]);
  const [sold, setSold] = useState<Property[]>([]);
  const [related, setRelated] = useState<AgentData[]>([]);
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({ firstName:'', lastName:'', email:'', phone:'', category:'', message:'' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    const slug = window.location.pathname.split('/').pop() || '';

    Promise.all([
      fetch(`/api/content/items?locale=${loc}&directory=agents`).then(r => r.json()),
      fetch(`/api/content/items?locale=${loc}&directory=properties`).then(r => r.json()),
    ]).then(([agentsRes, propsRes]) => {
      const allAgents = Array.isArray(agentsRes.items) ? agentsRes.items : [];
      const agentData = allAgents.find((a: any) => a.slug === slug);
      setAgent(agentData || null);

      const allProps = Array.isArray(propsRes.items) ? propsRes.items as Property[] : [];
      setListings(allProps.filter(p => p.listingAgentSlug === slug && p.status !== 'sold'));
      setSold(allProps.filter(p => p.listingAgentSlug === slug && p.status === 'sold').slice(0, 6));

      // Related agents: share a specialty, different agent
      const agentSpecialties = agentData?.specialties || [];
      const rel = allAgents
        .filter((a: any) => a.slug !== slug && a.status === 'active')
        .filter((a: any) => (a.specialties || []).some((s: string) => agentSpecialties.includes(s)))
        .slice(0, 3) as AgentData[];
      setRelated(rel.length > 0 ? rel : allAgents.filter((a: any) => a.slug !== slug).slice(0, 3));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...contactForm, agentSlug: agent?.slug, locale }),
    }).catch(() => {});
    setSubmitted(true);
    setSubmitting(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--backdrop-light)' }}>
      <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--secondary)', borderTopColor: 'transparent' }} />
    </div>
  );

  if (!agent) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'var(--backdrop-light)' }}>
      <p className="text-lg font-semibold" style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>Agent not found.</p>
      <Link href={`/${locale}/team`} className="btn-gold">← Back to Team</Link>
    </div>
  );

  const testimonials = Array.isArray(agent.testimonials) ? agent.testimonials : [];
  const testimonialItems =
    testimonials.length > 0
      ? testimonials
      : [
          {
            id: 'default-review',
            rating: 5,
            text: `${agent.name?.split(' ')[0] || 'This agent'} is known for clear communication, local expertise, and reliable transaction support.`,
            reviewer: 'Panorama Client',
            transactionType: 'Client Service',
            verified: true,
          },
        ];
  const avgRating = testimonials.length > 0
    ? Math.round(testimonials.reduce((s: number, t: any) => s + (t.rating || 5), 0) / testimonials.length)
    : 5;

  return (
    <>
      {/* BACK LINK */}
      <div className="pt-20" style={{ background: 'var(--primary)' }}>
        <div className="container-custom pt-6">
          <Link href={`/${locale}/team`} className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Team
          </Link>
        </div>
      </div>

      {/* AGENT HERO */}
      <section style={{ background: 'var(--primary)' }}>
        <div className="container-custom pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start pt-6">
            {/* Photo */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden max-w-sm mx-auto lg:mx-0"
              style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.35)' }}>
              {agent.photo
                ? <Image src={agent.photo} alt={agent.name || ''} fill className="object-cover object-top" sizes="50vw" priority />
                : <div className="w-full h-full flex items-center justify-center text-white/20 font-serif text-8xl font-bold"
                    style={{ fontFamily: 'var(--font-heading)', background: 'rgba(255,255,255,0.05)' }}>
                    {(agent.name || 'A').charAt(0)}
                  </div>}
            </div>
            {/* Info */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-2" style={{ color: 'var(--secondary)' }}>
                Panorama Realty Group
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-1 leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}>{agent.name}</h1>
              <p className="text-lg font-medium mb-5" style={{ color: 'var(--secondary)' }}>{agent.title}</p>

              {/* Quick stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Transactions', value: agent.transactionCount ? `${agent.transactionCount}+` : null },
                  { label: 'Volume', value: agent.volumeLabel },
                  { label: 'Avg DOM', value: agent.avgDaysOnMarket ? `${agent.avgDaysOnMarket} days` : null },
                  { label: 'Sale-to-List', value: agent.saleToListRatio },
                ].filter(s => s.value).map((s, i) => (
                  <div key={i} className="text-center px-3 py-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <p className="font-serif font-bold text-xl text-white" style={{ fontFamily: 'var(--font-heading)' }}>{s.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-on-dark-muted)' }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Specialties */}
              {agent.specialties?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {agent.specialties.map((s: string) => (
                    <span key={s} className="px-3 py-1 rounded-full text-xs font-medium text-white border border-white/20">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Languages */}
              {agent.languages?.length > 0 && (
                <div className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-on-dark-muted)' }}>
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span>{agent.languages.join(' · ')}</span>
                </div>
              )}

              {/* Contact bar */}
              <div className="flex flex-wrap gap-3 mb-6">
                {agent.phone && (
                  <a href={`tel:${agent.phone.replace(/\D/g,'')}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors">
                    <Phone className="w-4 h-4" /> {agent.phone}
                  </a>
                )}
                {agent.email && (
                  <a href={`mailto:${agent.email}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors">
                    <Mail className="w-4 h-4" /> Email
                  </a>
                )}
                {agent.social?.instagram && (
                  <a href={agent.social.instagram} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors">
                    <Instagram className="w-4 h-4 text-white" />
                  </a>
                )}
                {agent.social?.linkedin && (
                  <a href={agent.social.linkedin} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors">
                    <Linkedin className="w-4 h-4 text-white" />
                  </a>
                )}
                {agent.social?.facebook && (
                  <a href={agent.social.facebook} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors">
                    <Facebook className="w-4 h-4 text-white" />
                  </a>
                )}
              </div>

              {/* License */}
              {agent.licenseNumber && (
                <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
                  License #{agent.licenseNumber} · {agent.licenseState} · Affiliated with Panorama Realty Group
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BIO */}
      {agent.bio && (
        <section className="section-padding bg-white">
          <div className="container-custom max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: 'var(--secondary)' }}>About {agent.name?.split(' ')[0]}</p>
            <p className="text-base leading-relaxed editorial-body">{agent.bio}</p>
            {agent.awards?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {agent.awards.map((award: string, i: number) => (
                  <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-full"
                    style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}>
                    <Award className="w-3 h-3" /> {award}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ACTIVE LISTINGS */}
      {listings.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
              {agent.name?.split(' ')[0]}'s Active Listings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map(p => (
                <Link key={p.slug} href={`/${locale}/properties/${p.slug}`}
                  className="group block bg-white border border-[var(--border)] hover:border-[var(--secondary)] transition-all overflow-hidden"
                  style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {p.coverImage
                      ? <Image src={p.coverImage} alt={p.address||''} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="33vw" />
                      : <div className="w-full h-full" style={{ background: 'var(--backdrop-mid)' }} />}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 text-xs font-semibold text-white rounded ${STATUS_BADGE[p.status||'']||'bg-gray-500'}`}
                        style={{ borderRadius: 'var(--effect-badge-radius)' }}>
                        {STATUS_LABEL[p.status||'']||p.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-lg" style={{ color: 'var(--secondary)', fontFamily: 'var(--font-heading)' }}>
                      {p.priceDisplay||(p.price?`$${p.price.toLocaleString()}`:'')}
                    </p>
                    <p className="text-sm truncate" style={{ color: 'var(--primary)' }}>{p.address}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p.city}, {p.state}</p>
                    <div className="flex gap-3 text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                      {p.beds&&<span className="flex items-center gap-1"><Bed className="w-3 h-3"/>{p.beds}</span>}
                      {p.baths&&<span className="flex items-center gap-1"><Bath className="w-3 h-3"/>{p.baths}</span>}
                      {p.sqft&&<span className="flex items-center gap-1"><Maximize2 className="w-3 h-3"/>{p.sqft.toLocaleString()}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SOLD */}
      {sold.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Recent Sales</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {sold.map(p => (
                <div key={p.slug} className="relative aspect-[4/3] rounded-xl overflow-hidden" style={{ borderRadius: 'var(--effect-card-radius)' }}>
                  {p.coverImage&&<Image src={p.coverImage} alt={p.address||''} fill className="object-cover" sizes="33vw"/>}
                  <div className="absolute inset-0" style={{ background: 'rgba(139,26,26,0.8)' }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-3">
                    <span className="text-xs font-bold uppercase tracking-widest mb-1">SOLD</span>
                    <p className="font-serif text-base font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{p.priceDisplay||(p.price?`$${p.price.toLocaleString()}`:'')}</p>
                    <p className="text-xs text-white/80 mt-0.5 truncate">{p.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="font-serif text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
              What Clients Say About {agent.name?.split(' ')[0]}
            </h2>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i<=avgRating?'fill-current':''}`} style={{color:'var(--gold-star)'}} />)}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonialItems.map((t: any, i: number) => (
              <div key={t.id||i} className="bg-white p-6 rounded-xl border border-[var(--border)]"
                style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s<=(t.rating||5)?'fill-current':''}`} style={{color:'var(--gold-star)'}} />)}
                </div>
                <blockquote className="font-serif text-base leading-relaxed mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                  "{t.text}"
                </blockquote>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{t.reviewer}</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs rounded-full" style={{ background: 'var(--backdrop-mid)', color: 'var(--text-secondary)' }}>
                      {t.transactionType}
                    </span>
                    {t.verified && <span className="text-xs" style={{ color: 'var(--accent)' }}>✓ Verified</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {testimonials.length === 0 ? (
            <p className="text-xs mt-4" style={{ color: 'var(--text-secondary)' }}>
              Add agent-specific testimonials in admin to replace this default trust review.
            </p>
          ) : null}
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-2xl">
          <h2 className="font-serif text-2xl font-semibold mb-2 text-center" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
            Contact {agent.name?.split(' ')[0]}
          </h2>
          <p className="text-sm text-center mb-8" style={{ color: 'var(--text-secondary)' }}>
            Send a message directly to {agent.name?.split(' ')[0]}. You'll hear back within 2 hours.
          </p>
          {submitted ? (
            <div className="text-center py-8">
              <p className="text-lg font-semibold mb-1" style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>Message sent!</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{agent.name?.split(' ')[0]} will be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleContact} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required value={contactForm.firstName} onChange={e=>setContactForm(f=>({...f,firstName:e.target.value}))} placeholder="First Name" className="calc-input" />
                <input required value={contactForm.lastName} onChange={e=>setContactForm(f=>({...f,lastName:e.target.value}))} placeholder="Last Name" className="calc-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input required type="email" value={contactForm.email} onChange={e=>setContactForm(f=>({...f,email:e.target.value}))} placeholder="Email" className="calc-input" />
                <input value={contactForm.phone} onChange={e=>setContactForm(f=>({...f,phone:e.target.value}))} placeholder="Phone (optional)" className="calc-input" />
              </div>
              <select value={contactForm.category} onChange={e=>setContactForm(f=>({...f,category:e.target.value}))} className="calc-input w-full">
                <option value="">How can I help you?</option>
                <option value="buy">I want to buy</option>
                <option value="sell">I want to sell</option>
                <option value="invest">Investment inquiry</option>
                <option value="general">General question</option>
              </select>
              <textarea required value={contactForm.message} onChange={e=>setContactForm(f=>({...f,message:e.target.value}))} placeholder="Your message…" className="calc-input w-full min-h-[100px]" />
              <button type="submit" disabled={submitting} className="btn-gold w-full py-3.5">
                {submitting ? 'Sending…' : `Send Message to ${agent.name?.split(' ')[0]}`}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* RELATED AGENTS */}
      {related.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
          <div className="container-custom">
            <h2 className="font-serif text-xl font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>You Might Also Work With</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map(a => <AgentCard key={a.slug} agent={a} locale={locale} variant="compact" />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
