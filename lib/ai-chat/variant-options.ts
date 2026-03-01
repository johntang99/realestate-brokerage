export type VariantOption = {
  id: string;
  label: string;
  description: string;
};

const VARIANT_OPTIONS: Record<string, VariantOption[]> = {
  hero: [
    { id: 'centered', label: 'Centered', description: 'Text centered, classic hero.' },
    { id: 'split-photo-right', label: 'Split Photo Right', description: 'Text left, image right.' },
    { id: 'split-photo-left', label: 'Split Photo Left', description: 'Text right, image left.' },
    { id: 'overlap', label: 'Overlap', description: 'Text card overlaps photo.' },
    { id: 'photo-background', label: 'Photo Background', description: 'Full-bleed photo background.' },
    { id: 'video-background', label: 'Video Background', description: 'Full-bleed video background.' },
    { id: 'gallery-background', label: 'Gallery Background', description: 'Rotating gallery background.' },
  ],
  cta: [
    { id: 'centered', label: 'Centered', description: 'Centered content.' },
    { id: 'split', label: 'Split', description: 'Split text and image.' },
    { id: 'banner', label: 'Banner', description: 'Full-width banner.' },
    { id: 'card-elevated', label: 'Card Elevated', description: 'Elevated card style.' },
  ],
  testimonials: [
    { id: 'carousel', label: 'Carousel', description: 'Auto-rotating horizontal carousel.' },
    { id: 'grid', label: 'Grid', description: 'Static grid layout.' },
    { id: 'masonry', label: 'Masonry', description: 'Pinterest-style masonry.' },
    { id: 'slider-vertical', label: 'Slider Vertical', description: 'Stacked vertical list.' },
    { id: 'featured-single', label: 'Featured Single', description: 'One featured testimonial.' },
  ],
  services: [
    { id: 'grid-cards', label: 'Grid Cards', description: 'Equal-sized cards grid.' },
    { id: 'featured-large', label: 'Featured Large', description: 'One large featured card.' },
    { id: 'list-horizontal', label: 'List Horizontal', description: 'Horizontal scroll list.' },
    { id: 'accordion', label: 'Accordion', description: 'Expandable accordion list.' },
    { id: 'tabs', label: 'Tabs', description: 'Tabbed interface.' },
  ],
};

export function getVariantOptions(section?: string) {
  if (!section || section === 'all') return VARIANT_OPTIONS;
  return { [section]: VARIANT_OPTIONS[section] || [] };
}

export function isKnownVariant(section: string, variant: string) {
  const options = VARIANT_OPTIONS[section] || [];
  return options.some((item) => item.id === variant);
}
