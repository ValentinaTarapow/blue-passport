import { useEffect } from 'react';
import styled from 'styled-components';
import Button from '../components/ui/Button';
import SectionTitle from '../components/SectionTitle';
import ScrollReveal from '../components/ScrollReveal';
import PageTransition from '../components/PageTransition';
import { useTranslation } from '../i18n/LanguageContext';
import { ABOUT_IMAGES } from '../utils/constants';
import { Container, Section, TwoColumn, Prose } from '../styles/shared';
import { media, patternSvg, skySectionGradient } from '../styles/theme';

const Hero = styled.section`
  position: relative;
  padding: calc(${({ theme }) => theme.layout.navbarHeight} + 3rem) 0 4rem;
  overflow-x: clip;
`;

const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  background: ${skySectionGradient};
  z-index: 0;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.04;
    background-image: ${patternSvg};
  }
`;

const HeroGrid = styled(Container)`
  position: relative;
  z-index: 1;
  display: grid;
  gap: ${({ theme }) => theme.space['2xl']};
  align-items: center;

  ${media.lg} {
    grid-template-columns: 1.1fr 0.9fr;
    gap: clamp(2rem, 5vw, 4rem);
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
`;

const Eyebrow = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.aqua};
`;

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.15;
  color: ${({ theme }) => theme.colors.deepBlue};
`;

const IntroQuote = styled.blockquote`
  font-size: 1.0625rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.textMuted};
  border-left: 3px solid ${({ theme }) => theme.colors.aqua};
  padding-left: ${({ theme }) => theme.space.lg};
  margin: 0;
`;

const HeroImage = styled.img`
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const SkySection = styled(Section)`
  background: ${skySectionGradient};
`;

const MissionBanner = styled(ScrollReveal)`
  text-align: center;
  max-width: 44rem;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space.xl};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const MissionLabel = styled.span`
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.aqua};
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const MissionQuote = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.5rem, 3.5vw, 2rem);
  font-style: italic;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.deepBlue};
`;

const ContentCard = styled(ScrollReveal)`
  padding: ${({ theme }) => theme.space.xl};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  height: 100%;
`;

const CardEyebrow = styled.span`
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.aqua};
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const CardTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.375rem, 3vw, 1.75rem);
  color: ${({ theme }) => theme.colors.deepBlue};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const CardText = styled.p`
  font-size: 1.0625rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const PillarGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space.lg};

  ${media.lg} {
    grid-template-columns: 1fr 1fr;
  }
`;

const MegayachtImage = styled.img`
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  object-fit: cover;
`;

export default function About() {
  const { t } = useTranslation();
  const a = t.about;

  useEffect(() => {
    document.title = a.meta.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', a.meta.description);
  }, [a.meta.title, a.meta.description]);

  return (
    <PageTransition>
      <Hero>
        <HeroBg aria-hidden="true" />
        <HeroGrid>
          <HeroContent>
            <Eyebrow>{a.hero.eyebrow}</Eyebrow>
            <HeroTitle>{a.hero.title}</HeroTitle>
            <IntroQuote>{a.hero.intro}</IntroQuote>
            <Button to="/professionals" variant="primary" size="lg">
              {a.hero.exploreCta}
            </Button>
          </HeroContent>
          <ScrollReveal delay={0.1}>
            <HeroImage src={ABOUT_IMAGES.marina} alt={a.hero.imageAlt} loading="eager" />
          </ScrollReveal>
        </HeroGrid>
      </Hero>

      <Section id="mission" $bg="white">
        <Container>
          <MissionBanner>
            <MissionLabel>{a.mission.label}</MissionLabel>
            <MissionQuote>{a.mission.quote}</MissionQuote>
          </MissionBanner>
        </Container>
      </Section>

      <SkySection>
        <Container>
          <SectionTitle title={a.blueEconomy.title} align="left" />
          <Prose>
            <p>{a.blueEconomy.text}</p>
          </Prose>
        </Container>
      </SkySection>

      <Section $bg="white">
        <Container>
          <PillarGrid>
            <ScrollReveal>
              <ContentCard>
              <CardEyebrow>{a.certificate.eyebrow}</CardEyebrow>
              <CardTitle>{a.certificate.title}</CardTitle>
              <CardText>{a.certificate.text}</CardText>
              </ContentCard>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <ContentCard>
                <CardEyebrow>{a.newBlueGate.eyebrow}</CardEyebrow>
                <CardTitle>{a.newBlueGate.title}</CardTitle>
                <CardText>{a.newBlueGate.text}</CardText>
              </ContentCard>
            </ScrollReveal>
          </PillarGrid>
        </Container>
      </Section>

      <SkySection>
        <Container>
          <TwoColumn>
            <ScrollReveal>
              <MegayachtImage src={ABOUT_IMAGES.megayacht} alt={a.megayacht.imageAlt} />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <CardTitle as="h2" style={{ marginBottom: '1rem' }}>
                {a.megayacht.title}
              </CardTitle>
              <CardText>{a.megayacht.text}</CardText>
            </ScrollReveal>
          </TwoColumn>
        </Container>
      </SkySection>
    </PageTransition>
  );
}
