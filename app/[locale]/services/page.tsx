import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRequestSiteId, loadAllItems, loadPageContent } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import { ServicesPage, Locale } from '@/lib/types';
import { Badge, Card, CardHeader, CardTitle, CardDescription, CardContent, Icon, Accordion } from '@/components/ui';
import { Award, Users, Shield } from 'lucide-react';

interface ServicesPageProps {
  params: {
    locale: Locale;
  };
}

interface BlogListItem {
  slug: string;
  title: string;
  excerpt?: string;
  image?: string;
  category?: string;
  publishDate?: string;
}

export async function generateMetadata({ params }: ServicesPageProps): Promise<Metadata> {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const content = await loadPageContent<ServicesPage>('services', locale, siteId);

  return buildPageMetadata({
    siteId,
    locale,
    slug: 'services',
    title: content?.hero?.title,
    description: content?.hero?.subtitle || content?.overview?.introduction,
  });
}

export default async function ServicesPageComponent({ params }: ServicesPageProps) {
  const { locale } = params;
  
  // Load page content
  const siteId = await getRequestSiteId();
  const content = await loadPageContent<ServicesPage>('services', locale, siteId);
  const blogPosts = await loadAllItems<BlogListItem>(siteId, locale, 'blog');
  
  if (!content) {
    notFound();
  }

  const { hero, overview, services, faq, cta } = content;
  const blogBySlug = new Map(blogPosts.map((post) => [post.slug, post]));
  const preferredSlugs = [
    'first-visit-acupuncture-guide',
    'acupuncture-pain-relief-science',
    'chinese-herbal-formulas',
  ];
  const preferredPosts = preferredSlugs
    .map((slug) => blogBySlug.get(slug))
    .filter((post): post is BlogListItem => Boolean(post));
  const relatedPosts = preferredPosts.length
    ? preferredPosts
    : [...blogPosts]
        .sort((a, b) => (b.publishDate || '').localeCompare(a.publishDate || ''))
        .slice(0, 3);
  const trustItems = [
    {
      icon: Award,
      title: locale === 'en' ? 'Licensed Practitioner' : '持牌医师',
      description: locale === 'en' ? 'Certified & experienced' : '认证与经验丰富',
    },
    {
      icon: Users,
      title: locale === 'en' ? 'Personalized Plans' : '个性化方案',
      description: locale === 'en' ? 'Tailored to your needs' : '贴合您的需求',
    },
    {
      icon: Shield,
      title: locale === 'en' ? 'Calm & Private' : '安静私密',
      description: locale === 'en' ? 'Peaceful healing space' : '安心疗愈空间',
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--backdrop-primary)] via-[var(--backdrop-secondary)] to-[var(--backdrop-primary)] pt-20 md:pt-24 pb-16 md:pb-20 px-4 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-primary-100 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-secondary-50 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-display font-bold text-gray-900 mb-6 leading-tight">
                {hero.title}
              </h1>
              <p className="text-subheading text-gray-600 leading-relaxed mb-8">
                {hero.subtitle}
              </p>

              {/* Trust Bar */}
              <div className="grid sm:grid-cols-3 gap-4 mt-8">
                {trustItems.map((item) => {
                  const TrustIcon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex flex-col items-center sm:items-start gap-3 bg-white/80 backdrop-blur rounded-xl p-4 border border-gray-200 shadow-sm"
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                        <TrustIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="hidden md:block w-full">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                {hero.backgroundImage ? (
                  <Image
                    src={hero.backgroundImage}
                    alt={hero.title}
                    width={1200}
                    height={1200}
                    className="w-full h-auto object-contain"
                  />
                ) : (
                  <div className="w-full aspect-square flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 relative p-8">
                    <div className="absolute top-8 left-8 w-20 h-20 bg-primary-50/20 rounded-full"></div>
                    <div className="absolute bottom-8 right-8 w-28 h-28 bg-secondary-50/20 rounded-full"></div>
                    <div className="absolute top-1/3 right-12 w-16 h-16 bg-primary-100/20 rounded-full"></div>

                    <div className="relative z-10 text-center">
                      <div className="text-8xl mb-6">🧘</div>
                      <p className="text-gray-700 font-semibold text-subheading mb-2">
                        {locale === 'en' ? 'Holistic TCM Treatments' : '整体中医疗法'}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {locale === 'en' ? 'Time-tested healing methods' : '经验证的疗愈方法'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed mb-12">
              {overview.introduction}
            </p>

            <div className="bg-gradient-to-br from-primary/5 to-backdrop-primary rounded-2xl p-8 lg:p-12">
              <h2 className="text-heading font-bold text-gray-900 mb-6">
                Benefits of Traditional Chinese Medicine
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {overview.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size="sm" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-backdrop-secondary to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-12 lg:gap-16">
              {services
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((service, index) => (
                  <div
                    key={service.id}
                    id={service.id}
                    className={`grid lg:grid-cols-2 gap-8 items-center ${
                      index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                    }`}
                  >
                    {/* Image */}
                    <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                        {service.image ? (
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                              <Icon name={service.icon as any} size="xl" className="text-primary/30" />
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Icon name={service.icon as any} className="text-primary" />
                        </div>
                        <Badge variant="primary">{`Modality ${service.order}`}</Badge>
                      </div>

                      <h2 className="text-heading font-bold text-gray-900 mb-4">
                        {service.title}
                      </h2>

                      <p className="text-gray-700 leading-relaxed mb-6">
                        {service.fullDescription}
                      </p>

                      {/* Benefits */}
                      <div className="mb-6">
                        <h3 className="text-subheading font-semibold text-gray-900 mb-4">
                          Key Benefits
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {service.benefits?.slice(0, 6).map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Icon name="Check" className="text-primary mt-0.5 flex-shrink-0" size="sm" />
                              <span className="text-sm text-gray-600">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* What to Expect */}
                      {service.whatToExpect && (
                        <div className="bg-white rounded-xl p-6 border border-gray-100">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Icon name="Info" size="sm" className="text-primary" />
                            What to Expect
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {service.whatToExpect}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-heading font-bold text-gray-900 mb-4">
                {faq.title}
              </h2>
              <p className="text-gray-600">
                Common questions about our treatments and what to expect
              </p>
            </div>

            <Accordion
              items={faq.faqs.map((item, index) => ({
                id: `faq-${index}`,
                title: item.question,
                content: item.answer,
              }))}
              allowMultiple
            />
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-backdrop-secondary to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between gap-4 mb-10">
                <div>
                  <h2 className="text-heading font-bold text-gray-900">
                    {locale === 'en' ? 'Related Reading' : '相关阅读'}
                  </h2>
                  <p className="text-gray-600">
                    {locale === 'en'
                      ? 'Learn more about acupuncture, herbs, and wellness.'
                      : '了解更多针灸、中药与健康知识。'}
                  </p>
                </div>
                <Link
                  href={`/${locale}/blog`}
                  className="text-primary font-semibold hover:text-primary-dark"
                >
                  {locale === 'en' ? 'View all' : '查看全部'}
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <Link key={post.slug} href={`/${locale}/blog/${post.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <Badge variant="secondary" size="sm">
                          {post.category || (locale === 'en' ? 'Wellness' : '健康')}
                        </Badge>
                        <CardTitle className="text-base mt-3 line-clamp-2">
                          {post.title}
                        </CardTitle>
                        {post.excerpt && (
                          <CardDescription className="line-clamp-2">
                            {post.excerpt}
                          </CardDescription>
                        )}
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-heading font-bold mb-4 text-white">
              {cta.title}
            </h2>
            {cta.subtitle && (
              <p className="text-subheading mb-10 leading-relaxed max-w-3xl mx-auto text-white/95">
                {cta.subtitle}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={cta.primaryCta.link}
                className="bg-white text-primary px-8 py-4 rounded-lg hover:bg-gray-50 font-semibold text-subheading transition-all shadow-lg hover:shadow-xl"
              >
                {cta.primaryCta.text}
              </Link>
              {cta.secondaryCta && (
                <Link
                  href={cta.secondaryCta.link}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 font-semibold text-subheading transition-all"
                >
                  {cta.secondaryCta.text}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
