'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';

function toEmbedUrl(url?: string) {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

export default function BlogPostPage({ params }: { params: { slug: string; locale: string } }) {
  const [post, setPost] = useState<any>(null);
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loc = window.location.pathname.split('/')[1] === 'zh' ? 'zh' : 'en';
    setLocale(loc);
    fetch(`/api/content/file?locale=${loc}&path=blog/${params.slug}.json`).then(r => r.json()).then(res => {
      try { setPost(JSON.parse(res.content || 'null')); } catch {}
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [params.slug]);

  if (loading) return <div className="pt-40 container-custom"><div className="animate-pulse h-8 bg-gray-100 rounded w-1/2 mb-4" /></div>;
  if (!post) return (
    <div className="pt-40 container-custom text-center">
      <p className="font-serif text-2xl mb-4" style={{ color: 'var(--primary)' }}>Post not found</p>
      <Link href={`/${locale}/blog`} className="text-sm underline" style={{ color: 'var(--secondary)' }}>← Back to Blog</Link>
    </div>
  );

  const embedUrl = toEmbedUrl(post.videoUrl);

  return (
    <>
      {/* Header */}
      <section className="pt-32 md:pt-40" style={{ background: 'var(--backdrop-primary)' }}>
        {post.coverImage && (
          <div className="relative aspect-[16/6] w-full">
            <Image src={post.coverImage} alt={post.coverImageAlt || post.title || ''} fill className="object-cover" priority sizes="100vw" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(27,40,56,0.6) 0%, transparent 50%)' }} />
          </div>
        )}
        <div className="container-custom py-8">
          <Link href={`/${locale}/blog`} className="text-xs uppercase tracking-widest mb-4 block hover:opacity-70 transition-opacity"
            style={{ color: 'var(--secondary)' }}>← Back to Blog</Link>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--secondary)' }}>
            {post.category?.replace(/-/g,' ').replace(/\b\w/g,(c:string)=>c.toUpperCase())}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mt-2 mb-3 max-w-3xl" style={{ color: 'var(--primary)' }}>{post.title}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{post.author} · {post.date}</p>
        </div>
      </section>

      {/* Video embed */}
      {embedUrl && (
        <section className="bg-white">
          <div className="container-custom max-w-3xl mx-auto py-8">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe src={embedUrl} title={post.title} allowFullScreen
                className="absolute inset-0 w-full h-full rounded-lg" />
            </div>
          </div>
        </section>
      )}

      {/* Body */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl mx-auto">
          {post.body ? (
            <div className="prose prose-slate max-w-none" style={{ color: 'var(--text-primary)', lineHeight: '1.85' }}
              dangerouslySetInnerHTML={{ __html: post.body.replace(/\n/g, '<br>').replace(/## (.*)/g, '<h2 style="font-family:var(--font-heading);font-size:1.5rem;font-weight:600;color:var(--primary);margin:2rem 0 1rem">$1</h2>').replace(/### (.*)/g, '<h3 style="font-family:var(--font-heading);font-size:1.2rem;font-weight:600;color:var(--primary);margin:1.5rem 0 0.75rem">$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No content available.</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom text-center">
          <p className="font-serif text-2xl mb-3" style={{ color: 'var(--primary)' }}>Have questions? Let's talk.</p>
          <Link href={`/${locale}/contact`} className="btn-gold inline-block">Schedule a Consultation</Link>
        </div>
      </section>
    </>
  );
}
