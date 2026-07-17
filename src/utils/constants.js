export const BRAND = {
  logo: '/assets/blue-passport-logo.png',
  name: 'The Blue Passport',
  wordmark: ['Blue', 'Passport'],
};

export const SITE_NAME = 'The Blue Passport';
export const SITE_TAGLINE = 'Navigating the Sustainable Future';
export const HERO_IMAGE = '/assets/blue-passport-hero-logo.png';

export const HOME_IMAGES = {
  about: '/assets/about-story-map.jpg',
  serviceCertification: '/assets/service-certification.png',
  serviceConnection: '/assets/service-connection.png',
  serviceLegal: '/assets/service-legal.png',
  serviceTraining: '/assets/service-training.png',
  whyUs: '/assets/home-why-us-marina.jpg',
  career: '/assets/about-megayacht.png',
};

export const ABOUT_IMAGES = {
  marina: '/assets/about-marina.png',
  megayacht: '/assets/about-story-map.jpg',
};

export const SITE_DESCRIPTION =
  'A global certification authority and professional network advancing sustainable maritime excellence.';

export const NAV_LINKS = [
  { path: '/', end: true },
  { path: '/professionals', featured: true },
  { path: '/about' },
  { path: '/faq' },
  { path: '/contact' },
];

export const BLUE_PASSPORT_URL = '/blue-passport';

export const BLUE_PASSPORT_PAYMENT_URL =
  import.meta.env.VITE_BLUE_PASSPORT_PAYMENT_LINK || '';

export const LIST_WITH_US_URL = BLUE_PASSPORT_URL;

export const CONTACT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL || 'pagos@thebluepassport.es';

export const CONTACT_PHONE = '+34 633378032';
export const CONTACT_PHONE_HREF = 'tel:+34633378032';
export const WHATSAPP_URL = 'https://api.whatsapp.com/send?phone=34633378032';

export const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://www.facebook.com/bluecertificate/', icon: 'facebook' },
  { label: 'X', href: 'https://x.com/bluecertificate', icon: 'twitter' },
  { label: 'Instagram', href: 'https://www.instagram.com/blue.certificate/', icon: 'instagram' },
  { label: 'YouTube', href: 'https://www.youtube.com/@bluecertificate', icon: 'youtube' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/108642098/', icon: 'linkedin' },
];

export const PROFESSIONAL_CATEGORIES = [
  {
    id: 'yacht-brokers',
    title: 'Yacht Brokers',
    description: 'Certified professionals in luxury yacht sales and acquisitions.',
    icon: '⚓',
  },
  {
    id: 'marine-engineers',
    title: 'Marine Engineers',
    description: 'Technical experts in vessel systems and maritime engineering.',
    icon: '⚙️',
  },
  {
    id: 'naval-architects',
    title: 'Naval Architects',
    description: 'Design specialists shaping the future of vessel construction.',
    icon: '📐',
  },
  {
    id: 'sustainability-consultants',
    title: 'Sustainability Consultants',
    description: 'Advisors driving blue economy and environmental compliance.',
    icon: '🌊',
  },
  {
    id: 'maritime-law',
    title: 'Maritime Law',
    description: 'Legal professionals specializing in international maritime affairs.',
    icon: '⚖️',
  },
  {
    id: 'crew-management',
    title: 'Crew Management',
    description: 'Experts in yacht crew recruitment and vessel operations.',
    icon: '👥',
  },
];

export const QUERY_KEYS = {
  pages: ['pages'],
  page: (slug) => ['page', slug],
  professionals: ['professionals'],
  professional: (id) => ['professional', id],
  professionalCategories: ['professional-categories'],
  professionalLocations: ['professional-locations'],
};
