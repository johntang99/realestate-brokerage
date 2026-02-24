'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { AgentCard, type AgentData } from '@/components/ui/AgentCard';

const SPECIALTY_OPTIONS = ['Buyers','Sellers','Luxury','Investment','First-Time Buyers','Relocation','Commercial','New Construction','Multifamily','1031 Exchange'];
const LANGUAGE_OPTIONS = ['English','Spanish','Mandarin Chinese','Cantonese','Korean','French','Portuguese','Hindi','Arabic','Russian'];
const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'transactions', label: 'Most Transactions' },
  { value: 'experience', label: 'Most Experience' },
  { value: 'name', label: 'Name A–Z' },
];

export default function TeamPage() {
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [pageData, setPageData] = useState<any>({});
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [language, setLanguage] = useState('');
  const [sort, setSort] = useState('recommended');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    Promise.all([
      fetch(`/api/content/items?locale=${loc}&directory=agents`).then(r => r.json()),
      fetch(`/api/content/file?locale=${loc}&path=pages/team.json`).then(r => r.json()),
    ]).then(([agentsRes, pageRes]) => {
      const raw = Array.isArray(agentsRes.items) ? agentsRes.items as AgentData[] : [];
      setAgents(raw.filter((a: any) => a.status === 'active').sort((a: any, b: any) => (a.displayOrder||99) - (b.displayOrder||99)));
      try { setPageData(JSON.parse(pageRes.content || '{}')); } catch {}
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...agents];
    if (search) list = list.filter(a => a.name?.toLowerCase().includes(search.toLowerCase()));
    if (specialty) list = list.filter(a => a.specialties?.includes(specialty));
    if (language) list = list.filter(a => a.languages?.includes(language));
    switch (sort) {
      case 'transactions': list.sort((a, b) => (b.transactionCount||0) - (a.transactionCount||0)); break;
      case 'experience': list.sort((a, b) => (b.yearsExperience||0) - (a.yearsExperience||0)); break;
      case 'name': list.sort((a, b) => (a.name||'').localeCompare(b.name||'')); break;
    }
    return list;
  }, [agents, search, specialty, language, sort]);

  const clearFilters = () => { setSearch(''); setSpecialty(''); setLanguage(''); setSort('recommended'); };
  const hasFilters = search || specialty || language || sort !== 'recommended';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--backdrop-light)' }}>
      <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--secondary)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <>
      {/* HERO */}
      <section className="relative pt-20" style={{ minHeight: '40vh', background: 'var(--primary)' }}>
        <div className="container-custom pt-16 pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Our Agents</p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            {pageData.hero?.headline || 'Meet Our Agents'}
          </h1>
          <p className="text-lg text-white/75 max-w-xl">
            {pageData.hero?.subline || `A team of ${agents.length} dedicated specialists across Westchester County.`}
          </p>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="sticky top-0 z-30 bg-white border-b border-[var(--border)] shadow-sm">
        <div className="container-custom py-3">
          {/* Desktop filters */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name…"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--secondary)]"
              />
            </div>
            <select value={specialty} onChange={e => setSpecialty(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[var(--secondary)]">
              <option value="">All Specialties</option>
              {SPECIALTY_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={language} onChange={e => setLanguage(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[var(--secondary)]">
              <option value="">All Languages</option>
              {LANGUAGE_OPTIONS.map(l => <option key={l}>{l}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[var(--secondary)]">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
            <p className="text-xs ml-auto" style={{ color: 'var(--text-secondary)' }}>{filtered.length} agent{filtered.length !== 1 ? 's' : ''}</p>
          </div>
          {/* Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none" />
            </div>
            <button onClick={() => setFiltersOpen(v => !v)} className="flex items-center gap-1.5 text-sm px-3 py-2 border border-gray-200 rounded-lg">
              <SlidersHorizontal className="w-4 h-4" /> Filter
            </button>
          </div>
          {/* Mobile drawer */}
          {filtersOpen && (
            <div className="md:hidden mt-3 space-y-2 pb-2">
              <select value={specialty} onChange={e => setSpecialty(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
                <option value="">All Specialties</option>
                {SPECIALTY_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
              <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
                <option value="">All Languages</option>
                {LANGUAGE_OPTIONS.map(l => <option key={l}>{l}</option>)}
              </select>
              <select value={sort} onChange={e => setSort(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* AGENT GRID */}
      <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
        <div className="container-custom">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((agent, i) => (
                <div key={agent.slug} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                  <AgentCard agent={agent} locale={locale} variant="detailed" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>No agents match your filters.</p>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Try adjusting your search or clearing the filters.</p>
              <button onClick={clearFilters} className="btn-gold">Clear Filters</button>
            </div>
          )}
        </div>
      </section>

      {/* BROKERAGE TESTIMONIALS */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Client Stories</p>
          <h2 className="font-serif text-2xl font-semibold mb-8" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
            What Clients Say About Our Team
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
            Our agents' collective expertise, honest counsel, and genuine care for clients is what sets Pinnacle apart. Read their stories.
          </p>
          <Link href={`/${locale}/contact`} className="btn-gold inline-block">Work With Our Team</Link>
        </div>
      </section>

      {/* JOIN CTA */}
      <section className="py-14" style={{ background: 'var(--primary)' }}>
        <div className="container-custom text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Careers</p>
          <h2 className="font-serif text-2xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Are You a Real Estate Agent?</h2>
          <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">We're always looking for talented agents to join our growing team.</p>
          <Link href={`/${locale}/join`} className="btn-gold inline-block">Learn About Joining Pinnacle</Link>
        </div>
      </section>
    </>
  );
}
