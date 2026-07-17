import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import { heroTextReveal } from '../styles/animations';
import { Container } from '../styles/shared';
import { media, patternSvg } from '../styles/theme';

const Hero = styled.section`
  position: relative;
  min-height: ${({ $logoHero }) => ($logoHero ? 'auto' : '100svh')};
  display: flex;
  flex-direction: column;
  padding-top: ${({ theme }) => theme.layout.navbarHeight};
  box-sizing: border-box;
  overflow-x: clip;

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
  gap: ${({ theme }) => theme.space.lg};
  padding-block: ${({ theme }) => theme.space.lg};
  flex: 1;
  min-height: 0;
  width: 100%;

  ${media.md} {
    gap: ${({ theme }) => theme.space.xl};
    padding-block: ${({ theme }) => theme.space.xl};
  }

  ${media.lg} {
    grid-template-columns: ${({ $hasImage }) =>
      $hasImage ? '1.15fr 0.85fr' : '1fr'};
    align-items: center;
    gap: clamp(2.5rem, 5vw, 4rem);
    padding-block: clamp(1.25rem, 3svh, 2rem);
    height: ${({ $compact, theme }) =>
      $compact ? 'auto' : `calc(100svh - ${theme.layout.navbarHeight})`};
    max-height: ${({ $compact, theme }) =>
      $compact ? 'none' : `calc(100svh - ${theme.layout.navbarHeight})`};
  }
`;

const ContentStack = styled.div`
  max-width: 44rem;
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin-inline: ${({ $centered }) => ($centered ? 'auto' : '0')};
  text-align: ${({ $centered }) => ($centered ? 'center' : 'left')};
  align-items: ${({ $centered }) => ($centered ? 'center' : 'stretch')};

  ${media.md} {
    gap: 1rem;
  }

  ${media.lg} {
    gap: clamp(1rem, 2.2svh, 1.375rem);
    justify-content: center;
    margin-inline: 0;
    text-align: left;
    align-items: stretch;
  }
`;

const InlineLogo = styled(motion.div)`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0.15rem 0;

  ${media.lg} {
    display: none;
  }
`;

const InlineLogoImage = styled.img`
  display: block;
  width: min(100%, 17rem);
  height: auto;
  max-height: 10.5rem;
  object-fit: contain;

  ${media.md} {
    width: min(100%, 20rem);
    max-height: 12rem;
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
  font-size: clamp(1.875rem, 7vw, 2.5rem);
  font-weight: 700;
  line-height: 1.15;
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
  font-size: clamp(1.0625rem, 3.6vw, 1.375rem);
  line-height: 1.5;
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
  font-size: 0.975rem;
  line-height: 1.7;
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
  gap: 0.75rem;
  margin: 0.35rem 0 0;
  width: 100%;
  max-width: 22rem;

  a {
    width: 100%;
    justify-content: center;
  }

  ${media.md} {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    max-width: none;
    gap: 0.875rem;

    a {
      width: auto;
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
      <ContentStack $centered={isLogo}>
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
        {(primaryCta || secondaryCta) && (
          <Actions custom={3} initial="hidden" animate="visible" variants={heroTextReveal}>
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
      <Inner $hasImage={Boolean(image)}>{content}</Inner>
    </Hero>
  );
}
