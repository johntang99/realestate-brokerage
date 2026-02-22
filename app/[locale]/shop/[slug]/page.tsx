import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadItemBySlug, loadAllItems } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';

interface PageProps { params: { locale: Locale; slug: string } }

interface PortfolioItem { slug: string; title?: string; titleCn?: string; coverImage?: string }
interface ProductData {
  slug: string; title?: string; titleCn?: string;
  category?: string; room?: string;
  price?: number; status?: string;
  images?: Array<{ src?: string; alt?: string }>;
  description?: string; descriptionCn?: string;
  specifications?: { dimensions?: string; material?: string; materialCn?: string; finish?: string; finishCn?: string; leadTime?: string; leadTimeCn?: string };
  seenInProjects?: string[];
  relatedProducts?: string[];
}
interface RelatedProduct { slug: string; title?: string; titleCn?: string; images?: Array<{ src?: string }> }

function tx(en?: string, cn?: string, locale?: Locale) { return (locale === 'zh' && cn) ? cn : (en || ''); }

export async function generateStaticParams() { return []; }

export async function generateMetadata({ params }: PageProps) {
  const siteId = await getRequestSiteId();
  const product = await loadItemBySlug<ProductData>(siteId, params.locale, 'shop-products', params.slug);
  return buildPageMetadata({ siteId, locale: params.locale,
    title: `${product?.title || params.slug} — Julia Studio Shop`,
    description: product?.description || 'Curated furniture and décor by Julia Studio.' });
}

export default async function ShopProductPage({ params }: PageProps) {
  const { locale, slug } = params;
  const siteId = await getRequestSiteId();

  const [product, allProjects, allProducts] = await Promise.all([
    loadItemBySlug<ProductData>(siteId, locale, 'shop-products', slug),
    loadAllItems<PortfolioItem>(siteId, locale, 'portfolio'),
    loadAllItems<RelatedProduct>(siteId, locale, 'shop-products'),
  ]);

  if (!product) notFound();

  const seenProjects = (product.seenInProjects || [])
    .map(s => allProjects.find(p => p.slug === s)).filter(Boolean) as PortfolioItem[];
  const related = (product.relatedProducts || [])
    .map(s => allProducts.find(p => p.slug === s)).filter(Boolean) as RelatedProduct[];

  const isCn = locale === 'zh';
  const images = product.images?.filter(i => i.src) || [];
  const specs = product.specifications;

  return (
    <>
      {/* Back */}
      <div className="pt-20 border-b border-[var(--border)] bg-white">
        <div className="container-custom py-3">
          <Link href={`/${locale}/shop`} className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
            <ArrowLeft className="w-4 h-4" /> {isCn ? '返回商店' : 'Back to Shop'}
          </Link>
        </div>
      </div>

      {/* Product */}
      <section className="section-padding bg-white">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* Images */}
          <div>
            <div className="relative aspect-square overflow-hidden mb-3 bg-[var(--primary-50)]">
              {images[0]?.src ? <Image src={images[0].src} alt={tx(product.title, product.titleCn, locale)} fill className="object-cover" priority sizes="(max-width:1024px) 100vw, 50vw" /> : <div className="w-full h-full" />}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(1).map((img, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden bg-[var(--primary-50)]">
                    {img.src && <Image src={img.src} alt={img.alt || ''} fill className="object-cover" sizes="100px" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:sticky lg:top-24 h-fit">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)' }}>{product.category}</p>
            <h1 className="font-serif text-3xl font-semibold mb-4" style={{ color: 'var(--primary)' }}>{tx(product.title, product.titleCn, locale)}</h1>
            {product.price && (
              <p className="text-2xl font-semibold mb-6" style={{ color: 'var(--primary)' }}>${product.price.toLocaleString()}</p>
            )}
            <p className="text-sm leading-loose mb-8" style={{ color: 'var(--text-secondary)' }}>
              {tx(product.description, product.descriptionCn, locale)}
            </p>

            {/* Specs */}
            {specs && (
              <div className="border-t border-[var(--border)] pt-6 mb-8 space-y-3">
                {specs.dimensions && <div className="flex gap-4"><span className="text-xs font-semibold uppercase tracking-wider w-24 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>{isCn ? '尺寸' : 'Dimensions'}</span><span className="text-sm" style={{ color: 'var(--primary)' }}>{specs.dimensions}</span></div>}
                {specs.material && <div className="flex gap-4"><span className="text-xs font-semibold uppercase tracking-wider w-24 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>{isCn ? '材料' : 'Material'}</span><span className="text-sm" style={{ color: 'var(--primary)' }}>{tx(specs.material, specs.materialCn, locale)}</span></div>}
                {specs.finish && <div className="flex gap-4"><span className="text-xs font-semibold uppercase tracking-wider w-24 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>{isCn ? '表面处理' : 'Finish'}</span><span className="text-sm" style={{ color: 'var(--primary)' }}>{tx(specs.finish, specs.finishCn, locale)}</span></div>}
                {specs.leadTime && <div className="flex gap-4"><span className="text-xs font-semibold uppercase tracking-wider w-24 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>{isCn ? '交货时间' : 'Lead Time'}</span><span className="text-sm" style={{ color: 'var(--primary)' }}>{tx(specs.leadTime, specs.leadTimeCn, locale)}</span></div>}
              </div>
            )}

            {/* CTA */}
            <Link href={`/${locale}/contact?product=${slug}`} className="btn-gold w-full justify-center text-center block py-4 text-base">
              {isCn ? '咨询此商品' : 'Inquire About This Piece'}
            </Link>
            <p className="text-xs text-center mt-3" style={{ color: 'var(--text-secondary)' }}>
              {isCn ? '我们将在24小时内回复' : 'We respond within 24 hours'}
            </p>
          </div>
        </div>
      </section>

      {/* Seen In Projects */}
      {seenProjects.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-semibold mb-8" style={{ color: 'var(--primary)' }}>
              {isCn ? '相关项目' : 'Seen in These Projects'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {seenProjects.map(p => (
                <Link key={p.slug} href={`/${locale}/portfolio/${p.slug}`} className="group">
                  <div className="relative aspect-[4/3] overflow-hidden mb-3 bg-[var(--primary-50)]">
                    {p.coverImage && <Image src={p.coverImage} alt={tx(p.title, p.titleCn, locale)} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />}
                  </div>
                  <p className="font-serif text-sm font-medium" style={{ color: 'var(--primary)' }}>{tx(p.title, p.titleCn, locale)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-semibold mb-8" style={{ color: 'var(--primary)' }}>
              {isCn ? '相关产品' : 'You May Also Like'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map(p => (
                <Link key={p.slug} href={`/${locale}/shop/${p.slug}`} className="group">
                  <div className="relative aspect-square overflow-hidden mb-3 bg-[var(--primary-50)]">
                    {p.images?.[0]?.src && <Image src={p.images[0].src} alt={tx(p.title, p.titleCn, locale)} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />}
                  </div>
                  <p className="font-serif text-sm font-medium" style={{ color: 'var(--primary)' }}>{tx(p.title, p.titleCn, locale)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
