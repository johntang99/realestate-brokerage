import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadItemBySlug, loadAllItems } from '@/lib/content';

export const revalidate = 3600;

interface PageProps { params: { locale: Locale; slug: string } }

interface GalleryImage { image?: string; alt?: string; altCn?: string; layout?: 'full' | 'half' }
interface ShopProduct { slug: string; title?: string; titleCn?: string; images?: Array<{ src?: string }>; price?: number }
interface PortfolioItem { slug: string; title?: string; titleCn?: string; coverImage?: string; category?: string }

interface ProjectData {
  slug: string;
  title?: string; titleCn?: string;
  category?: string; style?: string;
  location?: string; year?: string;
  coverImage?: string;
  overview?: { body?: string; bodyCn?: string };
  details?: {
    scope?: string; scopeCn?: string;
    duration?: string; durationCn?: string;
    rooms?: string[]; roomsCn?: string[];
    keyMaterials?: string[]; keyMaterialsCn?: string[];
  };
  gallery?: GalleryImage[];
  shopThisLook?: string[];
  testimonial?: { quote?: string; quoteCn?: string; author?: string; project?: string };
  relatedProjects?: string[];
}

function tx(en?: string, cn?: string, locale?: Locale): string {
  return (locale === 'zh' && cn) ? cn : (en || '');
}

export async function generateStaticParams() {
  // Only called at build — dynamic in dev
  return [];
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { locale, slug } = params;
  const siteId = await getRequestSiteId();

  const [project, allProducts, allProjects] = await Promise.all([
    loadItemBySlug<ProjectData>(siteId, locale, 'portfolio', slug),
    loadAllItems<ShopProduct>(siteId, locale, 'shop-products'),
    loadAllItems<PortfolioItem>(siteId, locale, 'portfolio'),
  ]);

  if (!project) notFound();

  const shopProducts = (project.shopThisLook || [])
    .map(s => allProducts.find(p => p.slug === s))
    .filter(Boolean) as ShopProduct[];

  const relatedProjects = (project.relatedProjects || [])
    .map(s => allProjects.find(p => p.slug === s))
    .filter(Boolean) as PortfolioItem[];

  return (
    <>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden" style={{ background: 'var(--primary-50)' }}>
        {project.coverImage && (
          <Image src={project.coverImage} alt={tx(project.title, project.titleCn, locale)} fill className="object-cover" priority sizes="100vw" />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,26,26,0.65) 0%, transparent 60%)' }} />
        <div className="absolute bottom-0 left-0 right-0 container-custom pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-2" style={{ color: 'var(--secondary)' }}>{project.category}</p>
          <h1 className="font-serif text-3xl md:text-5xl font-semibold text-white mb-2">{tx(project.title, project.titleCn, locale)}</h1>
          <div className="flex gap-5 text-white/60 text-sm">
            {project.location && <span>{project.location}</span>}
            {project.year && <span>{project.year}</span>}
          </div>
        </div>
      </section>

      {/* Back link */}
      <div className="border-b border-[var(--border)] bg-white">
        <div className="container-custom py-3">
          <Link href={`/${locale}/portfolio`} className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
            <ArrowLeft className="w-4 h-4" /> {locale === 'zh' ? '返回作品集' : 'Back to Portfolio'}
          </Link>
        </div>
      </div>

      {/* Overview + Details */}
      <section className="section-padding bg-white">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-3 gap-14">
          <div className="lg:col-span-2">
            <p className="text-base leading-loose" style={{ color: 'var(--text-secondary)', maxWidth: '60ch' }}>
              {tx(project.overview?.body, project.overview?.bodyCn, locale)}
            </p>
          </div>
          {project.details && (
            <div className="border border-[var(--border)] p-7 h-fit">
              {project.details.scope && (
                <div className="mb-4"><p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">{locale==='zh'?'项目范围':'Scope'}</p><p className="font-serif font-medium mt-1" style={{ color: 'var(--primary)' }}>{tx(project.details.scope, project.details.scopeCn, locale)}</p></div>
              )}
              {project.details.duration && (
                <div className="mb-4"><p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">{locale==='zh'?'工期':'Duration'}</p><p className="font-serif font-medium mt-1" style={{ color: 'var(--primary)' }}>{tx(project.details.duration, project.details.durationCn, locale)}</p></div>
              )}
              {project.details.rooms?.length && (
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">{locale==='zh'?'空间':'Rooms'}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {(locale==='zh' ? (project.details.roomsCn || project.details.rooms) : project.details.rooms).map(r => (
                      <span key={r} className="text-xs px-2 py-0.5 border border-[var(--border)]" style={{ color: 'var(--primary)' }}>{r}</span>
                    ))}
                  </div>
                </div>
              )}
              {project.details.keyMaterials?.length && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">{locale==='zh'?'主要材料':'Key Materials'}</p>
                  <ul className="mt-1 space-y-0.5">
                    {(locale==='zh' ? (project.details.keyMaterialsCn || project.details.keyMaterials) : project.details.keyMaterials).map(m => (
                      <li key={m} className="text-sm" style={{ color: 'var(--primary)' }}>— {m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="bg-white pb-16">
          <div className="container-custom space-y-4">
            {(() => {
              const items = project.gallery!;
              const result: React.ReactNode[] = [];
              let i = 0;
              while (i < items.length) {
                const item = items[i];
                if (item.layout === 'full' || i === items.length - 1) {
                  result.push(
                    <div key={i} className="relative w-full aspect-[16/9] overflow-hidden">
                      {item.image ? <Image src={item.image} alt={tx(item.alt, item.altCn, locale) || ''} fill className="object-cover" sizes="100vw" /> : <div className="w-full h-full bg-[var(--primary-50)]" />}
                    </div>
                  );
                  i++;
                } else {
                  const next = items[i + 1];
                  result.push(
                    <div key={i} className="grid grid-cols-2 gap-4">
                      {[item, next].map((img, j) => (
                        <div key={j} className="relative aspect-[4/3] overflow-hidden">
                          {img?.image ? <Image src={img.image} alt={tx(img.alt, img.altCn, locale) || ''} fill className="object-cover" sizes="50vw" /> : <div className="w-full h-full bg-[var(--primary-50)]" />}
                        </div>
                      ))}
                    </div>
                  );
                  i += 2;
                }
              }
              return result;
            })()}
          </div>
        </section>
      )}

      {/* Shop This Look */}
      {shopProducts.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-semibold mb-8" style={{ color: 'var(--primary)' }}>
              {locale === 'zh' ? '选购同款' : 'Shop This Look'}
            </h2>
            <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-2">
              {shopProducts.map(product => (
                <Link key={product.slug} href={`/${locale}/shop/${product.slug}`} className="group flex-shrink-0 w-56">
                  <div className="relative aspect-square overflow-hidden mb-3 bg-[var(--primary-50)]">
                    {product.images?.[0]?.src && <Image src={product.images[0].src} alt={tx(product.title, product.titleCn, locale)} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="224px" />}
                  </div>
                  <p className="font-serif text-sm font-medium" style={{ color: 'var(--primary)' }}>{tx(product.title, product.titleCn, locale)}</p>
                  {product.price && <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>${product.price.toLocaleString()}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial */}
      {project.testimonial?.quote && (
        <section className="section-padding bg-white">
          <div className="container-custom max-w-2xl mx-auto text-center">
            <div className="mb-6 text-5xl font-serif" style={{ color: 'var(--secondary)' }}>"</div>
            <blockquote className="font-serif text-xl md:text-2xl leading-relaxed mb-6" style={{ color: 'var(--primary)' }}>
              {tx(project.testimonial.quote, project.testimonial.quoteCn, locale)}
            </blockquote>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>— {project.testimonial.author}</p>
          </div>
        </section>
      )}

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-semibold mb-8" style={{ color: 'var(--primary)' }}>
              {locale === 'zh' ? '相关项目' : 'Related Projects'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map(p => (
                <Link key={p.slug} href={`/${locale}/portfolio/${p.slug}`} className="group">
                  <div className="relative aspect-[4/3] overflow-hidden mb-3">
                    {p.coverImage ? <Image src={p.coverImage} alt={tx(p.title, p.titleCn, locale)} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" /> : <div className="w-full h-full bg-[var(--primary-50)]" />}
                  </div>
                  <p className="font-serif text-sm font-medium" style={{ color: 'var(--primary)' }}>{tx(p.title, p.titleCn, locale)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding" style={{ background: 'var(--primary)' }}>
        <div className="container-custom text-center">
          <p className="font-serif text-2xl md:text-3xl text-white mb-6">{locale==='zh'?'准备好改变您的空间了吗？':'Ready to transform your space?'}</p>
          <Link href={`/${locale}/contact`} className="btn-gold">{locale==='zh'?'预约咨询':'Book Consultation'}</Link>
        </div>
      </section>
    </>
  );
}
