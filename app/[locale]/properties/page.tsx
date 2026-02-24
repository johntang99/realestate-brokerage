'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, SlidersHorizontal, X, Bed, Bath, Maximize2 } from 'lucide-react';

interface Property {
  slug: string; address?: string; city?: string; state?: string;
  price?: number; priceDisplay?: string; status?: string; type?: string;
  beds?: number; baths?: number; sqft?: number; coverImage?: string;
  neighborhood?: string; featured?: boolean; listingAgentSlug?: string;
}
interface Agent { slug: string; name?: string }

const STATUS_BADGE: Record<string,string> = { 'active':'bg-[var(--status-active)]','pending':'bg-[var(--status-pending)]','sold':'bg-[var(--status-sold)]','for-lease':'bg-[var(--status-lease)]','coming-soon':'bg-[var(--status-coming-soon)]' };
const STATUS_LABEL: Record<string,string> = { 'active':'For Sale','pending':'Pending','sold':'Sold','for-lease':'For Lease','coming-soon':'Coming Soon' };

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [agent, setAgent] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [beds, setBeds] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    // Read URL query params for pre-filtering
    const params = new URLSearchParams(window.location.search);
    if (params.get('status')) setStatus(params.get('status')!);
    Promise.all([
      fetch(`/api/content/items?locale=${loc}&directory=properties`).then(r => r.json()),
      fetch(`/api/content/items?locale=${loc}&directory=agents`).then(r => r.json()),
    ]).then(([propsRes, agentsRes]) => {
      setProperties(Array.isArray(propsRes.items) ? propsRes.items as Property[] : []);
      setAgents(Array.isArray(agentsRes.items) ? agentsRes.items as Agent[] : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...properties];
    if (status) list = list.filter(p => p.status === status);
    else list = list.filter(p => p.status !== 'sold'); // default: hide sold
    if (type) list = list.filter(p => p.type === type);
    if (agent) list = list.filter(p => p.listingAgentSlug === agent);
    if (neighborhood) list = list.filter(p => p.neighborhood === neighborhood);
    if (beds) list = list.filter(p => (p.beds || 0) >= parseInt(beds));
    if (priceMax) list = list.filter(p => (p.price || 0) <= parseInt(priceMax));
    return list.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.price || 0) - (a.price || 0);
    });
  }, [properties, status, type, agent, neighborhood, beds, priceMax]);

  const neighborhoods = [...new Set(properties.map(p => p.neighborhood).filter(Boolean))] as string[];
  const clearFilters = () => { setStatus(''); setType(''); setAgent(''); setNeighborhood(''); setBeds(''); setPriceMax(''); };
  const hasFilters = status || type || agent || neighborhood || beds || priceMax;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--backdrop-light)' }}>
      <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--secondary)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <>
      {/* HERO */}
      <section className="relative pt-20" style={{ minHeight: '38vh', background: 'var(--primary)' }}>
        <div className="container-custom pt-14 pb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Listings</p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Properties</h1>
          <p className="text-white/70">Westchester County's finest homes, curated by Pinnacle Realty Group.</p>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="sticky top-0 z-30 bg-white border-b border-[var(--border)] shadow-sm">
        <div className="container-custom py-3">
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            <select value={status} onChange={e=>setStatus(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
              <option value="">All (active + pending)</option>
              <option value="active">For Sale</option>
              <option value="pending">Pending</option>
              <option value="coming-soon">Coming Soon</option>
              <option value="sold">Sold</option>
              <option value="for-lease">For Lease</option>
            </select>
            <select value={type} onChange={e=>setType(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
              <option value="">All Types</option>
              <option value="single-family">Single Family</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="multi-family">Multi-Family</option>
              <option value="commercial">Commercial</option>
            </select>
            <select value={beds} onChange={e=>setBeds(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
              <option value="">Any Beds</option>
              <option value="2">2+ Beds</option>
              <option value="3">3+ Beds</option>
              <option value="4">4+ Beds</option>
              <option value="5">5+ Beds</option>
            </select>
            <select value={neighborhood} onChange={e=>setNeighborhood(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
              <option value="">All Neighborhoods</option>
              {neighborhoods.map(n => <option key={n} value={n}>{n.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>)}
            </select>
            <select value={agent} onChange={e=>setAgent(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
              <option value="">All Agents</option>
              {agents.map(a => <option key={a.slug} value={a.slug}>{a.name}</option>)}
            </select>
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
            <p className="text-xs ml-auto" style={{ color: 'var(--text-secondary)' }}>{filtered.length} propert{filtered.length !== 1 ? 'ies' : 'y'}</p>
          </div>
          {/* Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <select value={status} onChange={e=>setStatus(e.target.value)} className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
              <option value="">For Sale + Pending</option>
              <option value="active">For Sale</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </select>
            <button onClick={() => setFiltersOpen(v => !v)} className="flex items-center gap-1.5 text-sm px-3 py-2 border border-gray-200 rounded-lg">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
          {filtersOpen && (
            <div className="md:hidden mt-3 grid grid-cols-2 gap-2">
              <select value={type} onChange={e=>setType(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
                <option value="">All Types</option>
                <option value="single-family">Single Family</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
              </select>
              <select value={beds} onChange={e=>setBeds(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
                <option value="">Any Beds</option>
                <option value="2">2+ Beds</option>
                <option value="3">3+ Beds</option>
                <option value="4">4+ Beds</option>
              </select>
              <select value={agent} onChange={e=>setAgent(e.target.value)} className="col-span-2 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
                <option value="">All Agents</option>
                {agents.map(a => <option key={a.slug} value={a.slug}>{a.name}</option>)}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* GRID */}
      <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
        <div className="container-custom">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(p => (
                <Link key={p.slug} href={`/${locale}/properties/${p.slug}`}
                  className="group block bg-white border border-[var(--border)] hover:border-[var(--secondary)] transition-all overflow-hidden"
                  style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {p.coverImage
                      ? <Image src={p.coverImage} alt={p.address||''} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
                      : <div className="w-full h-full" style={{ background: 'var(--backdrop-mid)' }} />}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 text-xs font-semibold text-white rounded ${STATUS_BADGE[p.status||'']||'bg-gray-500'}`}
                        style={{ borderRadius: 'var(--effect-badge-radius)' }}>
                        {STATUS_LABEL[p.status||'']||p.status}
                      </span>
                    </div>
                    {p.featured && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 text-xs font-semibold text-white rounded"
                          style={{ background: 'var(--secondary)', borderRadius: 'var(--effect-badge-radius)' }}>Featured</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-xl mb-0.5" style={{ color: 'var(--secondary)', fontFamily: 'var(--font-heading)' }}>
                      {p.priceDisplay||(p.price?`$${p.price.toLocaleString()}`:'')}
                    </p>
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--primary)' }}>{p.address}</p>
                    <p className="text-xs mb-2 truncate" style={{ color: 'var(--text-secondary)' }}>{p.city}, {p.state}</p>
                    <div className="flex gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {p.beds&&<span className="flex items-center gap-1"><Bed className="w-3 h-3"/>{p.beds} bd</span>}
                      {p.baths&&<span className="flex items-center gap-1"><Bath className="w-3 h-3"/>{p.baths} ba</span>}
                      {p.sqft&&<span className="flex items-center gap-1"><Maximize2 className="w-3 h-3"/>{p.sqft.toLocaleString()} sf</span>}
                    </div>
                    {p.listingAgentSlug && (
                      <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                        Listed by {agents.find(a=>a.slug===p.listingAgentSlug)?.name || p.listingAgentSlug}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>No properties match your filters.</p>
              <button onClick={clearFilters} className="btn-gold mt-4">Clear Filters</button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14" style={{ background: 'var(--primary)' }}>
        <div className="container-custom text-center">
          <h2 className="font-serif text-2xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Don't see what you're looking for?</h2>
          <p className="text-white/70 text-sm mb-6">We have access to off-market inventory and upcoming listings. Contact us to learn more.</p>
          <Link href={`/${locale}/contact`} className="btn-gold inline-block">Talk to an Agent</Link>
        </div>
      </section>
    </>
  );
}
