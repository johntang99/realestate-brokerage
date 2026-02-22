// Julia Studio — Schema.org structured data helpers

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://studio-julia.com';
const SITE_NAME = 'Julia Studio';
const FOUNDER = 'Julia';

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'InteriorDesigner',
    name: SITE_NAME,
    description: 'Julia Studio creates timeless interior spaces for homes, offices, and exhibitions. 25 years of design excellence, 1,000+ projects completed.',
    url: SITE_URL,
    logo: `${SITE_URL}/icon`,
    telephone: '(XXX) XXX-XXXX',
    email: 'hello@studio-julia.com',
    founder: { '@type': 'Person', name: FOUNDER },
    foundingDate: '2001',
    numberOfEmployees: '5-20',
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'XXX Main Street',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: 'XXXXX',
      addressCountry: 'US',
    },
    areaServed: ['New York', 'Manhattan', 'Brooklyn', 'Queens', 'Westchester', 'Connecticut', 'New Jersey'],
    sameAs: [
      'https://instagram.com/juliastudio',
      'https://pinterest.com/juliastudio',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Interior Design Services',
      itemListElement: [
        { '@type': 'Offer', name: 'Full-Service Interior Design', description: 'Complete design from concept to installation' },
        { '@type': 'Offer', name: 'Virtual Design', description: 'Remote design consultations with mood boards and shopping lists' },
        { '@type': 'Offer', name: 'Room Refresh', description: 'Targeted updates for a single room' },
        { '@type': 'Offer', name: 'Construction & Installation', description: 'In-house construction team' },
        { '@type': 'Offer', name: 'Furniture & Décor Sourcing', description: 'Trade pricing on furniture and décor' },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '500',
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'hello@studio-julia.com',
    },
    sameAs: ['https://instagram.com/juliastudio', 'https://pinterest.com/juliastudio'],
  };
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/portfolio?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generatePortfolioProjectSchema(project: {
  title?: string;
  description?: string;
  coverImage?: string;
  year?: string;
  location?: string;
  slug?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: project.title,
    description: project.description,
    image: project.coverImage,
    datePublished: project.year ? `${project.year}-01-01` : undefined,
    author: { '@type': 'Person', name: FOUNDER },
    publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon` } },
    mainEntityOfPage: `${SITE_URL}/portfolio/${project.slug}`,
  };
}

export function generateProductSchema(product: {
  title?: string;
  description?: string;
  price?: number;
  images?: Array<{ src?: string }>;
  slug?: string;
  status?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images?.map(i => i.src).filter(Boolean),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.price,
      availability: product.status === 'sold-out' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      url: `${SITE_URL}/shop/${product.slug}`,
    },
    brand: { '@type': 'Brand', name: SITE_NAME },
  };
}

export function generateArticleSchema(post: {
  title?: string;
  excerpt?: string;
  coverImage?: string;
  date?: string;
  author?: string;
  slug?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author || FOUNDER },
    publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon` } },
    mainEntityOfPage: `${SITE_URL}/journal/${post.slug}`,
  };
}

export function generateFAQSchema(categories: Array<{
  items?: Array<{ question?: string; answer?: string }>;
}>) {
  const items = categories.flatMap(cat => cat.items || []).map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  }));
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items,
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
