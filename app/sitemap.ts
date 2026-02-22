import { MetadataRoute } from 'next';
import { locations } from '@/data/seo-locations';
import { serviceTypes } from '@/data/seo-service-types';
import { designStyles } from '@/data/seo-design-styles';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://studio-julia.com';
const LOCALES = ['en', 'zh'] as const;

function entries(path: string, options?: { changeFrequency?: MetadataRoute.Sitemap[0]['changeFrequency']; priority?: number }) {
  return LOCALES.map(locale => ({
    url: `${SITE_URL}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency: options?.changeFrequency || ('monthly' as const),
    priority: options?.priority ?? 0.7,
    alternates: {
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}${path}`])),
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    ...entries('', { changeFrequency: 'weekly', priority: 1.0 }),
    ...entries('/portfolio', { changeFrequency: 'weekly', priority: 0.9 }),
    ...entries('/services', { changeFrequency: 'monthly', priority: 0.9 }),
    ...entries('/shop', { changeFrequency: 'weekly', priority: 0.9 }),
    ...entries('/about', { changeFrequency: 'monthly', priority: 0.8 }),
    ...entries('/journal', { changeFrequency: 'weekly', priority: 0.8 }),
    ...entries('/contact', { changeFrequency: 'monthly', priority: 0.8 }),
    ...entries('/collections', { changeFrequency: 'monthly', priority: 0.7 }),
    ...entries('/press', { changeFrequency: 'monthly', priority: 0.6 }),
    ...entries('/faq', { changeFrequency: 'monthly', priority: 0.6 }),
    ...entries('/testimonials', { changeFrequency: 'monthly', priority: 0.7 }),
  ];

  // Dynamic portfolio projects
  const portfolioSlugs = [
    'the-greenwich-estate', 'hudson-yards-office', 'soho-gallery-exhibition',
    'brooklyn-brownstone', 'midtown-penthouse',
  ];
  const portfolioPages = portfolioSlugs.flatMap(slug => entries(`/portfolio/${slug}`, { changeFrequency: 'monthly', priority: 0.8 }));

  // Dynamic shop products
  const productSlugs = [
    'marin-console-table', 'aria-pendant-light', 'woven-throw-blanket',
    'ceramic-vase-set', 'abstract-wall-art',
  ];
  const shopPages = productSlugs.flatMap(slug => entries(`/shop/${slug}`, { changeFrequency: 'weekly', priority: 0.7 }));

  // Dynamic journal posts
  const journalSlugs = ['5-rules-mixing-patterns', 'greenwich-estate-tour', 'fabric-selection-process'];
  const journalPages = journalSlugs.flatMap(slug => entries(`/journal/${slug}`, { changeFrequency: 'monthly', priority: 0.7 }));

  // Dynamic collections
  const collectionSlugs = ['modern-minimalist', 'east-west-fusion', 'warm-transitional'];
  const collectionPages = collectionSlugs.flatMap(slug => entries(`/collections/${slug}`, { changeFrequency: 'monthly', priority: 0.6 }));

  // Programmatic SEO
  const locationPages = locations.flatMap(l => entries(`/interior-design/${l.slug}`, { changeFrequency: 'monthly', priority: 0.6 }));
  const serviceTypePages = serviceTypes.flatMap(s => entries(`/interior-design-for/${s.slug}`, { changeFrequency: 'monthly', priority: 0.6 }));
  const stylePages = designStyles.flatMap(s => entries(`/design-styles/${s.slug}`, { changeFrequency: 'monthly', priority: 0.6 }));

  return [
    ...staticPages,
    ...portfolioPages,
    ...shopPages,
    ...journalPages,
    ...collectionPages,
    ...locationPages,
    ...serviceTypePages,
    ...stylePages,
  ];
}
