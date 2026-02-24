'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
import type { Locale } from '@/lib/i18n';

export interface JuliaHeaderConfig {
  logo?: string;
  logoText?: string;
  navigation?: Array<{
    label: string; labelCn?: string; href: string;
    children?: Array<{ label: string; labelCn?: string; href: string }>;
  }>;
  ctaButton?: { label?: string; labelCn?: string; href?: string; variant?: string };
  showLanguageSwitcher?: boolean;
  showPhone?: boolean;
  transparentOnHero?: boolean;
}

interface HeaderProps {
  locale: Locale;
  siteId: string;
  siteInfo?: Record<string, unknown> | null;
  headerConfig?: JuliaHeaderConfig | null;
}

export default function Header({ locale, siteInfo, headerConfig }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const config = headerConfig || {};
  const transparentOnHero = config.transparentOnHero !== false;
  const phone = (siteInfo as any)?.phone as string | undefined;
  const navItems = config.navigation || [
    { label: 'Properties', href: '/properties' },
    { label: 'Neighborhoods', href: '/neighborhoods' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];
  const cta = config.ctaButton || { label: 'Schedule Consultation', href: '/contact' };
  const logoText = config.logoText || (siteInfo as any)?.name || 'Alexandra Reeves';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const pathWithoutLocale = (pathname || '/').replace(/^\/(en|zh)(?=\/|$)/, '') || '/';
  const isHomeRoute = pathWithoutLocale === '/';
  const allowTransparent = transparentOnHero && isHomeRoute;
  const isSolid = !allowTransparent || scrolled || mobileOpen;

  const navLink = `text-sm font-medium transition-colors hover:opacity-70 ${isSolid ? '' : 'text-white'}`;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: isSolid ? 'white' : 'rgba(15, 23, 42, 0.18)',
          boxShadow: isSolid ? '0 1px 20px rgba(0,0,0,0.08)' : '0 1px 10px rgba(0,0,0,0.10)',
          backdropFilter: isSolid ? 'none' : 'blur(6px) saturate(120%)',
          borderBottom: isSolid ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.16)',
        }}
      >
        <div className="container-custom flex items-center justify-between h-16 md:h-18">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 flex-shrink-0">
            {(() => {
              const logoSrc = typeof config.logo === 'string' ? config.logo : (config.logo as any)?.src;
              return logoSrc ? (
                <img src={logoSrc} alt={logoText} className="h-8 w-auto" />
              ) : (
                <span className="font-serif text-lg font-semibold tracking-wide transition-colors"
                  style={{ color: isSolid ? 'var(--primary)' : 'rgba(255,255,255,0.96)', textShadow: isSolid ? 'none' : '0 1px 8px rgba(0,0,0,0.35)' }}>
                  {logoText}
                </span>
              );
            })()}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map(item => (
              <Link key={item.href} href={`/${locale}${item.href}`}
                className={navLink}
                style={{ color: isSolid ? 'var(--primary)' : 'rgba(255,255,255,0.96)', textShadow: isSolid ? 'none' : '0 1px 8px rgba(0,0,0,0.35)' }}>
                {locale === 'zh' ? (item.labelCn || item.label) : item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-4">
            {config.showPhone && phone && (
              <a href={`tel:${phone.replace(/\D/g, '')}`}
                className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: isSolid ? 'var(--primary)' : 'rgba(255,255,255,0.96)', textShadow: isSolid ? 'none' : '0 1px 8px rgba(0,0,0,0.35)' }}>
                <Phone className="w-3.5 h-3.5" />{phone}
              </a>
            )}
            {cta.href && (
              <Link href={`/${locale}${cta.href}`} className="btn-gold text-xs px-5 py-2.5">
                {locale === 'zh' ? (cta.labelCn || cta.label) : (cta.label || 'Schedule Consultation')}
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen
              ? <X className="w-6 h-6" style={{ color: 'white' }} />
              : <Menu className="w-6 h-6" style={{ color: isSolid ? 'var(--primary)' : 'rgba(255,255,255,0.96)', filter: isSolid ? 'none' : 'drop-shadow(0 1px 6px rgba(0,0,0,0.35))' }} />}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 flex flex-col transition-all duration-300 lg:hidden ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'var(--primary)' }}
      >
        <div className="flex items-center justify-between px-6 h-16">
          <span className="font-serif text-lg font-semibold text-white">{logoText}</span>
          <button onClick={() => setMobileOpen(false)}>
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-6 py-6 flex-1">
          {navItems.map(item => (
            <Link key={item.href} href={`/${locale}${item.href}`}
              onClick={() => setMobileOpen(false)}
              className="font-serif text-2xl font-medium text-white py-3 border-b border-white/10 hover:opacity-70 transition-opacity">
              {locale === 'zh' ? (item.labelCn || item.label) : item.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 pb-10 space-y-4">
          {phone && (
            <a href={`tel:${phone.replace(/\D/g, '')}`}
              className="flex items-center gap-2 text-white/70 text-sm font-medium">
              <Phone className="w-4 h-4" />{phone}
            </a>
          )}
          {cta.href && (
            <Link href={`/${locale}${cta.href}`} onClick={() => setMobileOpen(false)}
              className="block w-full btn-gold text-center py-3.5">
              {cta.label || 'Schedule Consultation'}
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
