import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import { heroTextReveal } from '../styles/animations';
import { Container } from '../styles/shared';
import { media, patternSvg } from '../styles/theme';

const Hero = styled.section`
  position: relative;
  min-height: 100svh;
  height: ${({ $logoHero }) => ($logoHero ? '100svh' : 'auto')};
  max-height: ${({ $logoHero }) => ($logoHero ? '100svh' : 'none')};
  display: flex;
  flex-direction: column;
  padding-top: ${({ theme }) => theme.layout.navbarHeight};
  box-sizing: border-box;
  overflow-x: clip;
  overflow-y: ${({ $logoHero }) => ($logoHero ? 'hidden' : 'visible')};

  ${media.lg} {
    min-height: 100svh;
    height: 100svh;
    max-height: 100svh;
    overflow: hidden;
  }
`;

const BgGradient = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 70% 20%, rgba(78, 205, 196, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 20% 80%, rgba(232, 213, 183, 0.15) 0%, transparent 50%),
    linear-gradient(180deg, ${({ theme }) => theme.colors.offWhite} 0%, ${({ theme }) => theme.colors.sandLight} 100%);
  z-index: 0;
`;

const BgPattern = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.04;
  background-image: ${patternSvg};
  z-index: 0;
`;

const Inner = styled(Container)`
  position: relative;
  z-index: 1;
  display: grid;
  gap: ${({ $logoHero, theme }) => ($logoHero ? '0.5rem' : theme.space.lg)};
  padding-block: ${({ $logoHero, theme }) =>
    $logoHero ? '0.35rem 0.65rem' : theme.space.lg};
  flex: 1;
  min-height: 0;
  width: 100%;
  height: ${({ $logoHero, theme }) =>
    $logoHero ? `calc(100svh - ${theme.layout.navbarHeight})` : 'auto'};
  max-height: ${({ $logoHero, theme }) =>
    $logoHero ? `calc(100svh - ${theme.layout.navbarHeight})` : 'none'};
  align-content: ${({ $logoHero }) => ($logoHero ? 'center' : 'start')};
  overflow-y: ${({ $logoHero }) => ($logoHero ? 'auto' : 'visible')};
  -webkit-overflow-scrolling: touch;

  ${media.md} {
    gap: ${({ $logoHero, theme }) => ($logoHero ? '0.65rem' : theme.space.xl)};
    padding-block: ${({ $logoHero, theme }) =>
      $logoHero ? '0.5rem 0.75rem' : theme.space.xl};
  }

  ${media.lg} {
    grid-template-columns: ${({ $hasImage }) =>
      $hasImage ? '1.15fr 0.85fr' : '1fr'};
    align-items: center;
    align-content: stretch;
    gap: clamp(2.5rem, 5vw, 4rem);
    padding-block: clamp(1.25rem, 3svh, 2rem);
    height: ${({ $compact, theme }) =>
      $compact ? 'auto' : `calc(100svh - ${theme.layout.navbarHeight})`};
    max-height: ${({ $compact, theme }) =>
      $compact ? 'none' : `calc(100svh - ${theme.layout.navbarHeight})`};
    overflow-y: visible;
  }
`;

const ContentStack = styled.div`
  max-width: 44rem;
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ $compactMobile }) => ($compactMobile ? '0.4rem' : '0.875rem')};
  margin-inline: ${({ $centered }) => ($centered ? 'auto' : '0')};
  text-align: ${({ $centered }) => ($centered ? 'center' : 'left')};
  align-items: ${({ $centered }) => ($centered ? 'center' : 'stretch')};
  min-height: 0;

  ${media.md} {
    gap: ${({ $compactMobile }) => ($compactMobile ? '0.5rem' : '1rem')};
  }

  ${media.lg} {
    gap: clamp(1rem, 2.2svh, 1.375rem);
    justify-content: center;
    margin-inline: 0;
    text-align: left;
    align-items: stretch;
  }
`;

/* Keeps title/logo/text vertically centered like before while real CTAs are pinned. */
const ActionsSpacer = styled.div`
  display: ${({ $active }) => ($active ? 'block' : 'none')};
  flex-shrink: 0;
  width: 100%;
  max-width: 22rem;
  height: calc(0.15rem + 0.5rem + (0.8rem * 2 + 1.25rem) * 2);
  visibility: hidden;
  pointer-events: none;

  ${media.md} {
    display: none;
  }
`;

const InlineLogo = styled(motion.div)`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0;
  flex-shrink: 1;
  min-height: 0;

  ${media.lg} {
    display: none;
  }
`;

const InlineLogoImage = styled.img`
  display: block;
  width: min(100%, 13.5rem);
  height: auto;
  max-height: min(7.5rem, 22svh);
  object-fit: contain;

  ${media.md} {
    width: min(100%, 16rem);
    max-height: min(9rem, 24svh);
  }
`;

const Badge = styled(motion.span)`
  display: inline-block;
  padding: 0.5rem 1.125rem;
  background: rgba(78, 205, 196, 0.12);
  color: ${({ theme }) => theme.colors.ocean};
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  border-radius: ${({ theme }) => theme.radius.xl};
  width: fit-content;
`;

const Tagline = styled(motion.p)`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.125rem, 2.5vw, 1.375rem);
  font-style: italic;
  color: ${({ theme }) => theme.colors.ocean};
  margin: 0;
  max-width: 36rem;
`;

const Title = styled(motion.h1)`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.625rem, 6.5vw, 2.25rem);
  font-weight: 700;
  line-height: 1.12;
  color: ${({ theme }) => theme.colors.deepBlue};
  text-wrap: balance;
  margin: 0;

  ${media.lg} {
    font-size: clamp(2.25rem, 4.8svh, 3.25rem);
  }
`;

const TitleAccent = styled.em`
  font-style: italic;
  display: inline;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.aqua} 0%,
    ${({ theme }) => theme.colors.ocean} 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Quote = styled(motion.blockquote)`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(0.9375rem, 3.2vw, 1.2rem);
  line-height: 1.4;
  font-style: italic;
  color: ${({ theme }) => theme.colors.ocean};
  margin: 0;
  max-width: 36rem;
  text-wrap: balance;

  ${media.lg} {
    font-size: clamp(1.125rem, 2.5vw, 1.5rem);
    line-height: 1.6;
    max-width: 40rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
  max-width: 36rem;

  ${media.lg} {
    font-size: 1.0625rem;
    line-height: 1.8;
    max-width: 48rem;
  }
`;

const Actions = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
  margin: 0.15rem 0 0;
  width: 100%;
  max-width: 22rem;
  flex-shrink: 0;

  ${({ $pinBottom, theme }) =>
    $pinBottom &&
    `
    position: absolute;
    left: ${theme.layout.containerPadding};
    right: ${theme.layout.containerPadding};
    bottom: max(0.65rem, env(safe-area-inset-bottom, 0px));
    z-index: 2;
    margin: 0 auto;
    width: auto;
  `}

  a {
    width: 100%;
    justify-content: center;
    padding-block: 0.8rem;
    font-size: 0.9375rem;
  }

  ${media.md} {
    position: static;
    left: auto;
    right: auto;
    bottom: auto;
    z-index: auto;
    margin: 0.15rem 0 0;
    width: 100%;
    max-width: none;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;

    a {
      width: auto;
      padding-block: 1rem;
      font-size: 1rem;
    }
  }

  ${media.lg} {
    justify-content: flex-start;
    margin: 0;
  }
`;

const Visual = styled(motion.div)`
  position: relative;
  min-height: 0;
  display: ${({ $logo }) => ($logo ? 'none' : 'flex')};
  align-items: center;
  justify-content: center;

  ${media.lg} {
    display: flex;
    height: 100%;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: ${({ $logo }) => ($logo ? 'auto' : '100%')};
  margin: ${({ $logo }) => ($logo ? '0 0 0 auto' : '0 auto')};
  max-width: ${({ $logo }) => ($logo ? '30rem' : '100%')};
  box-shadow: ${({ $logo, theme }) => ($logo ? 'none' : theme.shadows.lg)};
  background: ${({ $logo, theme }) => ($logo ? 'transparent' : theme.colors.white)};
  border-radius: ${({ theme, $logo }) => ($logo ? '0' : theme.radius.lg)};
  overflow: ${({ $logo }) => ($logo ? 'visible' : 'hidden')};
  aspect-ratio: ${({ $logo }) => ($logo ? 'auto' : '1')};

  ${media.lg} {
    max-width: ${({ $logo }) => ($logo ? '32rem' : 'min(28rem, 100%)')};
  }
`;

const Image = styled.img`
  display: block;
  width: 100%;
  height: ${({ $logo }) => ($logo ? 'auto' : '100%')};
  max-width: ${({ $logo }) => ($logo ? '32rem' : '100%')};
  max-height: ${({ $logo }) => ($logo ? '21rem' : 'none')};
  object-fit: ${({ $logo }) => ($logo ? 'contain' : 'cover')};
`;

const CompactHero = styled.section`
  position: relative;
  padding: calc(${({ theme }) => theme.layout.navbarHeight} + 2.5rem) 0 1rem;
  overflow-x: clip;
`;

const CompactInner = styled(Container)`
  position: relative;
  z-index: 1;
`;

export default function HeroSection({
  eyebrow,
  tagline,
  title,
  titleAccent,
  quote,
  subtitle,
  primaryCta,
  secondaryCta,
  image,
  imageAlt = '',
  imageVariant = 'photo',
  compact = false,
}) {
  const isLogo = imageVariant === 'logo';

  const content = (
    <>
      <ContentStack $centered={isLogo} $compactMobile={isLogo}>
        {eyebrow && (
          <Badge custom={0} initial="hidden" animate="visible" variants={heroTextReveal}>
            {eyebrow}
          </Badge>
        )}
        {tagline && (
          <Tagline custom={0} initial="hidden" animate="visible" variants={heroTextReveal}>
            {tagline}
          </Tagline>
        )}
        <Title custom={1} initial="hidden" animate="visible" variants={heroTextReveal}>
          {title}
          {titleAccent && (
            <>
              <br />
              <TitleAccent>{titleAccent}</TitleAccent>
            </>
          )}
        </Title>
        {isLogo && image && (
          <InlineLogo custom={1} initial="hidden" animate="visible" variants={heroTextReveal}>
            <InlineLogoImage src={image} alt="" aria-hidden="true" loading="eager" />
          </InlineLogo>
        )}
        {quote && (
          <Quote custom={2} initial="hidden" animate="visible" variants={heroTextReveal}>
            {quote}
          </Quote>
        )}
        {subtitle && (
          <Subtitle custom={2} initial="hidden" animate="visible" variants={heroTextReveal}>
            {subtitle}
          </Subtitle>
        )}
        <ActionsSpacer $active={isLogo} aria-hidden="true" />
        {(primaryCta || secondaryCta) && (
          <Actions
            $pinBottom={isLogo}
            custom={3}
            initial="hidden"
            animate="visible"
            variants={heroTextReveal}
          >
            {primaryCta && (
              <Button to={primaryCta.href} variant="primary" size="lg">
                {primaryCta.label}
              </Button>
            )}
            {secondaryCta && (
              <Button to={secondaryCta.href} variant="gradientOutline" size="lg">
                {secondaryCta.label}
              </Button>
            )}
          </Actions>
        )}
      </ContentStack>

      {image && (
        <Visual custom={1} initial="hidden" animate="visible" variants={heroTextReveal} $logo={isLogo}>
          <ImageWrapper $logo={isLogo}>
            <Image src={image} alt={imageAlt} loading="eager" $logo={isLogo} />
          </ImageWrapper>
        </Visual>
      )}
    </>
  );

  if (compact) {
    return (
      <CompactHero>
        <BgGradient aria-hidden="true" />
        <BgPattern aria-hidden="true" />
        <CompactInner>
          <Inner $compact $hasImage={Boolean(image)}>
            {content}
          </Inner>
        </CompactInner>
      </CompactHero>
    );
  }

  return (
    <Hero $logoHero={isLogo}>
      <BgGradient aria-hidden="true" />
      <BgPattern aria-hidden="true" />
      <Inner $hasImage={Boolean(image)} $logoHero={isLogo}>
        {content}
      </Inner>
    </Hero>
  );
}
