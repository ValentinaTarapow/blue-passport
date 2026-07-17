import styled from 'styled-components';
import { media } from '../styles/theme';

export const Page = styled.div`
  padding-top: ${({ theme }) => theme.layout.navbarHeight};
`;

export const Hero = styled.section`
  position: relative;
  overflow-x: clip;
  padding: clamp(1rem, 2.5vw, 1.5rem) 0 0;
`;

export const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 75% 55% at 80% 10%, rgba(78, 205, 196, 0.14) 0%, transparent 55%),
    radial-gradient(ellipse 60% 50% at 10% 90%, rgba(232, 213, 183, 0.18) 0%, transparent 50%),
    linear-gradient(
      180deg,
      ${({ theme }) => theme.colors.offWhite} 0%,
      ${({ theme }) => theme.colors.sandLight} 100%
    );
  z-index: 0;
`;

export const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  max-width: 40rem;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.layout.containerPadding};
  text-align: center;

  ${media.md} {
    padding: 0 2rem;
  }
`;

export const HeroCopy = styled.div`
  display: grid;
  gap: 0.5rem;
`;

export const Eyebrow = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.aqua};
`;

export const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.375rem, 3vw, 1.75rem);
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.deepBlue};
`;

export const Lead = styled.p`
  font-size: 0.9375rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 34rem;
  margin: 0 auto;
`;

export const Main = styled.section`
  position: relative;
  padding: clamp(1.25rem, 3vw, 1.75rem) 0 clamp(3rem, 7vw, 4.5rem);
  background:
    radial-gradient(ellipse 60% 50% at 10% 90%, rgba(232, 213, 183, 0.12) 0%, transparent 50%),
    linear-gradient(
      180deg,
      ${({ theme }) => theme.colors.sandLight} 0%,
      ${({ theme }) => theme.colors.offWhite} 55%,
      ${({ theme }) => theme.colors.white} 100%
    );
`;

export const Shell = styled.div`
  max-width: ${({ theme }) => theme.layout.containerMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.layout.containerPadding};

  ${media.md} {
    padding: 0 2rem;
  }
`;

export const OfferGrid = styled.div`
  display: grid;
  gap: 1.25rem;

  ${media.lg} {
    grid-template-columns: 1.2fr 0.8fr;
    align-items: start;
    gap: 1.5rem;
  }
`;

export const OfferCard = styled.div`
  order: 2;
  padding: clamp(1.25rem, 3vw, 1.75rem);
  border-radius: ${({ theme }) => theme.radius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.md};

  ${media.lg} {
    order: 0;
  }
`;

export const OfferTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.35rem, 2.8vw, 1.75rem);
  color: ${({ theme }) => theme.colors.deepBlue};
  margin-bottom: 0.75rem;
`;

export const OfferText = styled.p`
  font-size: 1rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 1.15rem;
`;

export const FeatureList = styled.ul`
  display: grid;
  gap: 0.75rem;
`;

export const FeatureItem = styled.li`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  align-items: start;
  padding: 0.75rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.offWhite};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const FeatureIcon = styled.span`
  font-size: 1.125rem;
  line-height: 1;
`;

export const FeatureCopy = styled.div`
  display: grid;
  gap: 0.2rem;
`;

export const FeatureTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.deepBlue};
`;

export const FeatureText = styled.p`
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const CheckoutCard = styled.div`
  order: 1;
  position: sticky;
  top: calc(${({ theme }) => theme.layout.navbarHeight} + 1rem);
  padding: 1.25rem 1.35rem;
  border-radius: ${({ theme }) => theme.radius.xl};
  background:
    linear-gradient(${({ theme }) => theme.colors.white}, ${({ theme }) => theme.colors.white}) padding-box,
    linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.aqua} 0%,
      ${({ theme }) => theme.colors.ocean} 50%,
      ${({ theme }) => theme.colors.deepBlue} 100%
    ) border-box;
  border: 2px solid transparent;
  box-shadow:
    0 0 0 4px rgba(52, 152, 219, 0.1),
    ${({ theme }) => theme.shadows.lg};

  ${media.lg} {
    order: 0;
  }
`;

export const CheckoutLabel = styled.span`
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.ocean};
  margin-bottom: 0.5rem;
`;

export const CheckoutTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.375rem;
  color: ${({ theme }) => theme.colors.deepBlue};
  margin-bottom: 0.35rem;
`;

export const CheckoutSubtitle = styled.p`
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 1rem;
`;

export const Price = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.deepBlue};
  margin-bottom: 0.25rem;
`;

export const PriceNote = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 1.5rem;
`;

export const CheckoutActions = styled.div`
  display: grid;
  gap: 0.625rem;
`;

export const SecureNote = styled.p`
  margin-top: 0.75rem;
  font-size: 0.75rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const MissingLinkNote = styled.p`
  margin-top: 1rem;
  padding: 0.875rem 1rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: rgba(231, 76, 60, 0.08);
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  line-height: 1.6;
`;
