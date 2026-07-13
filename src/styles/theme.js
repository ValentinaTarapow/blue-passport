export const theme = {
  colors: {
    deepBlue: '#1b365d',
    ocean: '#234876',
    aqua: '#3498db',
    aquaLight: '#5dade2',
    teal: '#4ecdc4',
    sand: '#e8d5b7',
    sandLight: '#f5ede0',
    white: '#ffffff',
    offWhite: '#fafbfc',
    skyLight: '#eef8f9',
    text: '#1a2e3b',
    textMuted: '#5a7184',
    border: 'rgba(10, 37, 64, 0.08)',
    error: '#e74c3c',
    overlay: 'rgba(10, 37, 64, 0.88)',
  },
  fonts: {
    display: "'Playfair Display', Georgia, serif",
    body: "'DM Sans', system-ui, sans-serif",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    md: '1.0625rem',
    lg: '1.125rem',
    xl: '1.5rem',
    '2xl': '2rem',
    '3xl': '2.5rem',
    hero: 'clamp(2.25rem, 6vw, 4.5rem)',
  },
  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  space: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2.5rem',
    xl: '4rem',
    '2xl': '6rem',
    '3xl': '8rem',
  },
  layout: {
    containerMax: '1200px',
    containerPadding: '1.25rem',
    navbarHeight: '5.5rem',
  },
  radius: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  shadows: {
    sm: '0 2px 8px rgba(10, 37, 64, 0.06)',
    md: '0 8px 32px rgba(10, 37, 64, 0.1)',
    lg: '0 16px 48px rgba(10, 37, 64, 0.12)',
    button: '0 4px 16px rgba(78, 205, 196, 0.35)',
    buttonHover: '0 6px 24px rgba(78, 205, 196, 0.45)',
  },
  transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  breakpoints: {
    md: '768px',
    lg: '1024px',
    nav: '1100px',
  },
  zIndex: {
    navbar: 100,
    overlay: 110,
    modal: 120,
  },
};

export const media = {
  md: `@media (min-width: ${theme.breakpoints.md})`,
  lg: `@media (min-width: ${theme.breakpoints.lg})`,
  nav: `@media (min-width: ${theme.breakpoints.nav})`,
  maxMd: `@media (max-width: 767px)`,
  maxNav: `@media (max-width: 1099px)`,
};

export const patternSvg = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230a2540' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

export const sectionGradient = `
  radial-gradient(ellipse 80% 60% at 70% 20%, rgba(78, 205, 196, 0.12) 0%, transparent 60%),
  radial-gradient(ellipse 60% 50% at 20% 80%, rgba(232, 213, 183, 0.15) 0%, transparent 50%),
  linear-gradient(180deg, #fafbfc 0%, #f5ede0 100%)
`;

export const skySectionGradient = `
  linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(238, 248, 249, 0.75) 10%, transparent 26%),
  radial-gradient(ellipse 75% 55% at 75% 15%, rgba(78, 205, 196, 0.14) 0%, transparent 60%),
  radial-gradient(ellipse 55% 45% at 15% 85%, rgba(52, 152, 219, 0.1) 0%, transparent 55%),
  #eef8f9
`;
