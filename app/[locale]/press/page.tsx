import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';

interface PageProps { params: { locale: Locale } }
interface PressData {
  hero?: { headline?: string; headlineCn?: string; subline?: string; sublineCn?: string };
  awards?: { headline?: string; headlineCn?: string; items?: Array<{ name?: string; organization?: string; year?: string; logo?: string }> };
  press?: { headline?: string; headlineCn?: string; items?: Array<{ publication?: string; title?: string; titleCn?: string; date?: string; url?: string; logo?: string }> };
}

function tx(en?: string, cn?: string, locale?: Locale) { return (locale === 'zh' && cn) ? cn : (en || ''); }

export async function generateMetadata({ params }: PageProps) {
  const siteId = await getRequestSiteId();
  return buildPageMetadata({ siteId, locale: params.locale, slug: 'press', title: 'Press & Awards — Julia Studio', description: 'Julia Studio in the press. Awards and media features.' });
}

export default async function PressPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const data = await loadPageContent<PressData>('press', locale, siteId);
  const isCn = locale === 'zh';

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom max-w-xl">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-3" style={{ color: 'var(--primary)' }}>
            {tx(data?.hero?.headline, data?.hero?.headlineCn, locale) || (isCn ? '媒体与奖项' : 'Press & Awards')}
          </h1>
        </div>
      </section>

      {data?.awards?.items && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-semibold mb-8" style={{ color: 'var(--primary)' }}>{tx(data.awards.headline, data.awards.headlineCn, locale) || (isCn ? '奖项' : 'Awards')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {data.awards.items.map((award, i) => (
                <div key={i} className="border border-[var(--border)] p-6 text-center hover:border-[var(--secondary)] transition-colors">
                  <p className="font-serif text-sm font-medium" style={{ color: 'var(--primary)' }}>{award.name}</p>
                  {award.organization && <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{award.organization}</p>}
                  <p className="text-xs mt-1" style={{ color: 'var(--secondary)' }}>{award.year}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {data?.press?.items && (
        <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-semibold mb-8" style={{ color: 'var(--primary)' }}>{tx(data.press.headline, data.press.headlineCn, locale) || (isCn ? '媒体报道' : 'Featured In')}</h2>
            <div className="space-y-4">
              {data.press.items.map((item, i) => (
                <div key={i} className="bg-white border border-[var(--border)] p-6 flex items-center gap-6">
                  <div className="flex-shrink-0 w-24 text-right">
                    <p className="font-serif text-sm font-semibold" style={{ color: 'var(--primary)' }}>{item.publication}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{item.date}</p>
                  </div>
                  <div className="border-l border-[var(--border)] pl-6 flex-1">
                    <p className="font-serif text-base" style={{ color: 'var(--primary)' }}>{tx(item.title, item.titleCn, locale)}</p>
                    {item.url && <a href={item.url} target="_blank" rel="noreferrer" className="text-xs mt-1 block" style={{ color: 'var(--secondary)' }}>{isCn ? '阅读文章 →' : 'Read Article →'}</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 border-t border-[var(--border)] bg-white">
        <div className="container-custom text-center">
          <Link href={`/${locale}/contact`} className="btn-gold">{isCn ? '预约咨询' : 'Book Consultation'}</Link>
        </div>
      </section>
    </>
  );
}
