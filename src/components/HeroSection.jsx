import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import { heroTextReveal } from '../styles/animations';
import { Container } from '../styles/shared';
import { media, patternSvg } from '../styles/theme';

const Hero = styled.section`
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  padding-top: ${({ theme }) => theme.layout.navbarHeight};
  box-sizing: border-box;
  overflow-x: clip;

  ${media.lg} {
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
  gap: ${({ theme }) => theme.space.xl};
  padding-block: ${({ theme }) => theme.space.xl};
  flex: 1;
  min-height: 0;
  width: 100%;

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
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  ${media.lg} {
    gap: clamp(1rem, 2.2svh, 1.375rem);
    justify-content: center;
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
  font-size: clamp(2rem, 5vw, 3.25rem);
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
  font-size: clamp(1.125rem, 2.5vw, 1.5rem);
  line-height: 1.6;
  font-style: italic;
  color: ${({ theme }) => theme.colors.ocean};
  margin: 0;
  max-width: 40rem;
  text-wrap: balance;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.0625rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
  max-width: 48rem;
`;

const Actions = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 0;
`;

const Visual = styled(motion.div)`
  position: relative;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  ${media.lg} {
    height: 100%;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.radius.xl};
  overflow: hidden;
  width: 100%;
  margin: 0 auto;
  aspect-ratio: 1;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ $logo }) => ($logo ? '1.5rem' : '0')};

  ${media.lg} {
    max-width: min(28rem, 100%);
    margin: 0 0 0 auto;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: ${({ $logo }) => ($logo ? 'contain' : 'cover')};
  display: block;
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
  const content = (
    <>
      <ContentStack>
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
              <Button to={secondaryCta.href} variant="outline" size="lg">
                {secondaryCta.label}
              </Button>
            )}
          </Actions>
        )}
      </ContentStack>

      {image && (
        <Visual custom={1} initial="hidden" animate="visible" variants={heroTextReveal}>
          <ImageWrapper $logo={imageVariant === 'logo'}>
            <Image src={image} alt={imageAlt} loading="eager" $logo={imageVariant === 'logo'} />
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
    <Hero>
      <BgGradient aria-hidden="true" />
      <BgPattern aria-hidden="true" />
      <Inner $hasImage={Boolean(image)}>{content}</Inner>
    </Hero>
  );
}
