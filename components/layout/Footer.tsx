import Link from 'next/link';
import { Instagram, Heart } from 'lucide-react';
import type { Locale } from '@/lib/i18n';

interface FooterColumn {
  title: string;
  titleCn?: string;
  links: Array<{ label: string; labelCn?: string; href: string }>;
}

interface FooterSocialLinks {
  instagram?: string;
  pinterest?: string;
  wechatQrImage?: string;
}

interface FooterLegal {
  copyright?: string;
  copyrightCn?: string;
  privacyLabel?: string;
  privacyHref?: string;
  termsLabel?: string;
  termsHref?: string;
}

interface FooterNewsletter {
  enabled?: boolean;
  headline?: string;
  headlineCn?: string;
  placeholder?: string;
  placeholderCn?: string;
  buttonLabel?: string;
  buttonLabelCn?: string;
}

export interface JuliaFooterData {
  tagline?: string;
  taglineCn?: string;
  columns?: FooterColumn[];
  socialLinks?: FooterSocialLinks;
  legal?: FooterLegal;
  newsletter?: FooterNewsletter;
}

interface FooterProps {
  locale: Locale;
  siteId: string;
  footer?: JuliaFooterData | Record<string, unknown>;
}

export default function Footer({ locale, footer }: FooterProps) {
  const data = (footer ?? {}) as JuliaFooterData;
  const isCn = locale === 'zh';
  const tagline = isCn ? (data.taglineCn || data.tagline) : data.tagline || 'Creating timeless spaces since 2001.';
  const year = new Date().getFullYear();
  const copyright = isCn
    ? (data.legal?.copyrightCn || `© ${year} Julia Studio 版权所有`)
    : (data.legal?.copyright || `© ${year} Julia Studio. All rights reserved.`);

  const columns: FooterColumn[] = data.columns || [
    {
      title: 'Explore', titleCn: '探索',
      links: [
        { label: 'Portfolio', labelCn: '作品集', href: '/portfolio' },
        { label: 'Services', labelCn: '服务', href: '/services' },
        { label: 'Shop', labelCn: '商店', href: '/shop' },
        { label: 'Journal', labelCn: '日志', href: '/journal' },
      ],
    },
    {
      title: 'Studio', titleCn: '工作室',
      links: [
        { label: 'About', labelCn: '关于', href: '/about' },
        { label: 'Press', labelCn: '媒体', href: '/press' },
        { label: 'FAQ', labelCn: '常见问题', href: '/faq' },
        { label: 'Contact', labelCn: '联系', href: '/contact' },
      ],
    },
  ];

  const newsletter = data.newsletter;
  const newsletterHeadline = isCn ? (newsletter?.headlineCn || newsletter?.headline) : newsletter?.headline || 'Design inspiration, delivered weekly.';
  const newsletterPlaceholder = isCn ? (newsletter?.placeholderCn || newsletter?.placeholder) : newsletter?.placeholder || 'Your email address';
  const newsletterBtn = isCn ? (newsletter?.buttonLabelCn || newsletter?.buttonLabel) : newsletter?.buttonLabel || 'Subscribe';

  return (
    <footer style={{ background: 'var(--backdrop-secondary, #1A1A1A)', color: '#FAF8F5' }}>
      <div className="container-custom py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand col */}
          <div className="lg:col-span-1">
            <div className="font-serif text-xl font-semibold mb-3" style={{ color: '#FAF8F5' }}>
              Julia Studio
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-5">{tagline}</p>
            {/* Social icons */}
            <div className="flex gap-4">
              {data.socialLinks?.instagram && (
                <a href={data.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-white/40 hover:text-[var(--secondary)] transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {/* Pinterest text link */}
              {data.socialLinks?.pinterest && (
                <a href={data.socialLinks.pinterest} target="_blank" rel="noreferrer" className="text-xs text-white/40 hover:text-[var(--secondary)] transition-colors font-medium">
                  Pinterest
                </a>
              )}
            </div>
          </div>

          {/* Navigation columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--secondary, #C4A265)' }}>
                {isCn ? (col.titleCn || col.title) : col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={`/${locale}${link.href}`}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {isCn ? (link.labelCn || link.label) : link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          {newsletter?.enabled !== false && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--secondary, #C4A265)' }}>
                {isCn ? '设计通讯' : 'Newsletter'}
              </h4>
              <p className="text-sm text-white/50 mb-4 leading-relaxed">{newsletterHeadline}</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder={newsletterPlaceholder}
                  className="flex-1 bg-white/10 border border-white/20 rounded-sm px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[var(--secondary)]"
                />
                <button className="px-3 py-2 text-xs font-semibold rounded-sm transition-colors" style={{ background: 'var(--secondary, #C4A265)', color: '#1A1A1A' }}>
                  {newsletterBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">{copyright}</p>
          <div className="flex gap-5 text-xs text-white/30">
            {data.legal?.privacyHref && (
              <Link href={`/${locale}${data.legal.privacyHref}`} className="hover:text-white/60 transition-colors">
                {isCn ? '隐私政策' : (data.legal.privacyLabel || 'Privacy Policy')}
              </Link>
            )}
            {data.legal?.termsHref && (
              <Link href={`/${locale}${data.legal.termsHref}`} className="hover:text-white/60 transition-colors">
                {isCn ? '服务条款' : (data.legal.termsLabel || 'Terms')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
