import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadPageContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import ContactForm from './ContactForm';

interface PageProps { params: { locale: Locale } }

export async function generateMetadata({ params }: PageProps) {
  const siteId = await getRequestSiteId();
  return buildPageMetadata({ siteId, locale: params.locale, slug: 'contact',
    title: 'Book a Consultation — Julia Studio',
    description: 'Begin your design journey with Julia Studio. Book a complimentary consultation to discuss your project.' });
}

interface ContactData {
  hero?: { headline?: string; headlineCn?: string; subline?: string; sublineCn?: string };
  form?: {
    submitLabel?: string; submitLabelCn?: string;
    successMessage?: string; successMessageCn?: string;
    fields?: Record<string, { label?: string; labelCn?: string; type?: string; required?: boolean; options?: Array<{ value: string; label: string; labelCn?: string }> }>;
  };
  directContact?: { headline?: string; headlineCn?: string; showPhone?: boolean; showEmail?: boolean; showAddress?: boolean; showHours?: boolean; hours?: string; hoursCn?: string };
  socialLinks?: { headline?: string; headlineCn?: string; showInstagram?: boolean; showPinterest?: boolean; showWechatQr?: boolean; showXiaohongshu?: boolean };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const [data, siteInfo] = await Promise.all([
    loadPageContent<ContactData>('contact', locale, siteId),
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom max-w-xl">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-4" style={{ color: 'var(--primary)' }}>
            {locale === 'zh' ? (data?.hero?.headlineCn || '开启您的设计之旅') : (data?.hero?.headline || 'Begin Your Design Journey')}
          </h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            {locale === 'zh' ? (data?.hero?.sublineCn || '我们期待了解您的项目。') : (data?.hero?.subline || "We'd love to hear about your project.")}
          </p>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="section-padding bg-white">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16">
          <ContactForm locale={locale} formConfig={data?.form} siteId={siteId} />

          {/* Sidebar */}
          <div className="space-y-8">
            {data?.directContact && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: 'var(--secondary)' }}>
                  {locale === 'zh' ? (data.directContact.headlineCn || '直接联系') : (data.directContact.headline || 'Or reach us directly')}
                </p>
                <div className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {data.directContact.showPhone && siteInfo?.phone && <p><span className="font-medium" style={{ color: 'var(--primary)' }}>{siteInfo.phone}</span></p>}
                  {data.directContact.showEmail && siteInfo?.email && <p><a href={`mailto:${siteInfo.email}`} style={{ color: 'var(--secondary)' }}>{siteInfo.email}</a></p>}
                  {data.directContact.showAddress && siteInfo?.address && <p>{siteInfo.address}</p>}
                  {data.directContact.showHours && <p>{locale === 'zh' ? (data.directContact.hoursCn || data.directContact.hours) : data.directContact.hours}</p>}
                </div>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--secondary)' }}>
                {locale === 'zh' ? '关注我们' : 'Follow Along'}
              </p>
              <div className="space-y-2 text-sm">
                {data?.socialLinks?.showInstagram && <a href="#" className="block" style={{ color: 'var(--text-secondary)' }}>Instagram</a>}
                {data?.socialLinks?.showPinterest && <a href="#" className="block" style={{ color: 'var(--text-secondary)' }}>Pinterest</a>}
                {data?.socialLinks?.showWechatQr && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{locale === 'zh' ? '微信：JuliaStudioDesign' : 'WeChat: JuliaStudioDesign'}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
