import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadItemBySlug, loadAllItems } from '@/lib/content';

interface PageProps { params: { locale: Locale; slug: string } }

interface PostData {
  slug: string; title?: string; titleCn?: string;
  type?: string; category?: string; date?: string; author?: string;
  coverImage?: string;
  excerpt?: string; excerptCn?: string;
  body?: string; bodyCn?: string;
  videoUrl?: string; videoDuration?: string;
  relatedPosts?: string[];
  relatedProducts?: string[];
}
interface RelatedPost { slug: string; title?: string; titleCn?: string; coverImage?: string; date?: string }
interface RelatedProduct { slug: string; title?: string; titleCn?: string; images?: Array<{ src?: string }>; price?: number }

function tx(en?: string, cn?: string, locale?: Locale) { return (locale === 'zh' && cn) ? cn : (en || ''); }

export async function generateStaticParams() { return []; }

export default async function JournalPostPage({ params }: PageProps) {
  const { locale, slug } = params;
  const siteId = await getRequestSiteId();

  const [post, allPosts, allProducts] = await Promise.all([
    loadItemBySlug<PostData>(siteId, locale, 'journal', slug),
    loadAllItems<RelatedPost>(siteId, locale, 'journal'),
    loadAllItems<RelatedProduct>(siteId, locale, 'shop-products'),
  ]);

  if (!post) notFound();

  const relatedPosts = (post.relatedPosts || []).map(s => allPosts.find(p => p.slug === s)).filter(Boolean) as RelatedPost[];
  const relatedProducts = (post.relatedProducts || []).map(s => allProducts.find(p => p.slug === s)).filter(Boolean) as RelatedProduct[];

  const isCn = locale === 'zh';
  const body = tx(post.body, post.bodyCn, locale);

  // Simple markdown → HTML (headers, bold, paragraphs)
  function renderMarkdown(md: string) {
    return md
      .split('\n\n')
      .map(para => {
        if (para.startsWith('## ')) return `<h2 class="font-serif text-xl font-semibold mt-10 mb-4" style="color:var(--primary)">${para.replace('## ', '')}</h2>`;
        if (para.startsWith('# ')) return `<h1 class="font-serif text-2xl font-semibold mt-10 mb-4" style="color:var(--primary)">${para.replace('# ', '')}</h1>`;
        if (para.startsWith('- ')) {
          const items = para.split('\n').map(l => `<li class="mb-1">${l.replace('- ', '')}</li>`).join('');
          return `<ul class="list-disc pl-6 my-4 space-y-1">${items}</ul>`;
        }
        return `<p class="mb-4 leading-loose" style="color:var(--text-secondary)">${para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`;
      }).join('');
  }

  return (
    <>
      {/* Back */}
      <div className="pt-20 border-b border-[var(--border)] bg-white">
        <div className="container-custom py-3">
          <Link href={`/${locale}/journal`} className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
            <ArrowLeft className="w-4 h-4" /> {isCn ? '返回日志' : 'Back to Journal'}
          </Link>
        </div>
      </div>

      {/* Header */}
      <section className="bg-white pt-10 pb-6">
        <div className="container-custom max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--secondary)' }}>{post.category}</span>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mt-3 mb-4" style={{ color: 'var(--primary)' }}>{tx(post.title, post.titleCn, locale)}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{post.author} · {post.date}</p>
        </div>
      </section>

      {/* Cover image or video */}
      <div className="bg-white pb-10">
        <div className="container-custom max-w-3xl mx-auto">
          {post.type === 'video' && post.videoUrl ? (
            <div className="relative aspect-video overflow-hidden mb-8">
              <iframe src={post.videoUrl} className="w-full h-full" allowFullScreen title={post.title} />
            </div>
          ) : post.coverImage ? (
            <div className="relative aspect-[16/9] overflow-hidden mb-10">
              <Image src={post.coverImage} alt={tx(post.title, post.titleCn, locale)} fill className="object-cover" priority sizes="100vw" />
            </div>
          ) : null}

          {/* Body */}
          {body && (
            <div
              className="max-w-reading mx-auto text-base"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
            />
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-semibold mb-8" style={{ color: 'var(--primary)' }}>
              {isCn ? '选购本文商品' : 'Shop This Story'}
            </h2>
            <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-2">
              {relatedProducts.map(p => (
                <Link key={p.slug} href={`/${locale}/shop/${p.slug}`} className="group flex-shrink-0 w-52">
                  <div className="relative aspect-square overflow-hidden mb-3 bg-[var(--primary-50)]">
                    {p.images?.[0]?.src && <Image src={p.images[0].src} alt={tx(p.title, p.titleCn, locale)} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="208px" />}
                  </div>
                  <p className="font-serif text-sm font-medium" style={{ color: 'var(--primary)' }}>{tx(p.title, p.titleCn, locale)}</p>
                  {p.price && <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>${p.price.toLocaleString()}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-semibold mb-8" style={{ color: 'var(--primary)' }}>
              {isCn ? '相关文章' : 'Related Articles'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {relatedPosts.map(p => (
                <Link key={p.slug} href={`/${locale}/journal/${p.slug}`} className="group">
                  <div className="relative aspect-[4/3] overflow-hidden mb-3 bg-[var(--primary-50)]">
                    {p.coverImage && <Image src={p.coverImage} alt={tx(p.title, p.titleCn, locale)} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />}
                  </div>
                  <p className="font-serif text-sm font-medium group-hover:opacity-70 transition-opacity" style={{ color: 'var(--primary)' }}>{tx(p.title, p.titleCn, locale)}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{p.date}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 border-t border-[var(--border)]" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom text-center">
          <p className="font-serif text-xl mb-5" style={{ color: 'var(--primary)' }}>{isCn ? '预约免费咨询' : 'Inspired? Book a complimentary consultation.'}</p>
          <Link href={`/${locale}/contact`} className="btn-gold">{isCn ? '预约咨询' : 'Book Consultation'}</Link>
        </div>
      </section>
    </>
  );
}
