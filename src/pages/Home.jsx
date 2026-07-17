import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import HeroSection from '../components/HeroSection';
import Button from '../components/ui/Button';
import MemberCard from '../components/MemberCard';
import ScrollReveal from '../components/ScrollReveal';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import PageTransition from '../components/PageTransition';
import { useProfessionals } from '../hooks/useWordPress';
import { useTranslation } from '../i18n/LanguageContext';
import ServiceIcon from '../components/ServiceIcon';
import { HERO_IMAGE, HOME_IMAGES, LIST_WITH_US_URL } from '../utils/constants';
import { staggerContainer, staggerItem } from '../styles/animations';
import { Section, Container, TwoColumn } from '../styles/shared';
import { media, skySectionGradient } from '../styles/theme';

const SkySection = styled(Section)`
  background: ${skySectionGradient};
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.aqua};
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const SectionHeading = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: ${({ theme }) => theme.colors.deepBlue};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const ImpactTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  color: ${({ theme }) => theme.colors.deepBlue};
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const BodyText = styled.p`
  font-size: 1.0625rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ReadMoreLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: ${({ theme }) => theme.space.lg};
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ocean};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.aqua};
  }
`;

const AboutImage = styled.img`
  width: 100%;
  aspect-ratio: 16 / 10;
  max-height: 12.5rem;
  object-fit: cover;
  object-position: center;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};

  ${media.md} {
    aspect-ratio: 16 / 9;
    max-height: 16rem;
  }

  ${media.lg} {
    aspect-ratio: 16 / 10;
    max-height: none;
  }
`;

const ServicesSection = styled(Section)`
  padding: 2rem 0 1rem;

  ${media.md} {
    padding: 2.5rem 0 1.25rem;
  }
`;

const ServicesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.875rem;

  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  ${media.lg} {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
`;

const ServiceCard = styled(motion.article)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.25rem 1rem;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    transform ${({ theme }) => theme.transition},
    box-shadow ${({ theme }) => theme.transition};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const ServiceIconCircle = styled.div`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.white};
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.aquaLight} 0%,
    ${({ theme }) => theme.colors.aqua} 55%,
    ${({ theme }) => theme.colors.ocean} 100%
  );
  flex-shrink: 0;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const ServiceTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.deepBlue};
  margin: 0 0 0.5rem;
  line-height: 1.3;
`;

const ServiceText = styled.p`
  font-size: 0.8125rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`;

const CareerSection = styled(Section)`
  padding-block: 0.75rem;

  ${media.md} {
    padding-block: 1rem;
  }
`;

const CareerBanner = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.xl};
  min-height: 12rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.lg};

  ${media.md} {
    min-height: 13rem;
    padding: 2.5rem;
  }
`;

const CareerBg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;
`;

const CareerOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(10, 24, 42, 0.94) 0%,
    rgba(20, 42, 72, 0.9) 50%,
    rgba(27, 54, 93, 0.88) 100%
  );
`;

const CareerContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  display: grid;
  gap: 1rem;
  justify-items: center;
`;

const CareerTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.5rem, 3.5vw, 2.125rem);
  max-width: 22ch;
  color: ${({ theme }) => theme.colors.white};
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.35);
`;

const WhySkySection = styled(SkySection)`
  padding-top: 1.25rem;
  padding-bottom: 2rem;

  ${media.md} {
    padding-top: 2rem;
    padding-bottom: 2.5rem;
  }

  ${media.lg} {
    padding-top: 2.5rem;
  }
`;

const WhyHeader = styled.div`
  text-align: center;
  margin-bottom: 1.125rem;

  ${media.md} {
    margin-bottom: 1.5rem;
  }

  ${media.lg} {
    margin-bottom: 2.25rem;
  }

  ${Eyebrow} {
    margin-bottom: 0.5rem;
  }

  ${SectionHeading} {
    margin-bottom: 0;
  }
`;

const WhyLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  align-items: start;

  ${media.md} {
    gap: 1.5rem;
  }

  ${media.lg} {
    grid-template-columns: 0.95fr 1.05fr;
    gap: 2.5rem;
    align-items: center;
  }
`;

const WhyImage = styled.img`
  width: 100%;
  aspect-ratio: 16 / 10;
  max-height: 12.5rem;
  object-fit: cover;
  object-position: center 45%;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};

  ${media.md} {
    aspect-ratio: 16 / 11;
    max-height: 16rem;
  }

  ${media.lg} {
    aspect-ratio: 1;
    max-height: none;
    object-position: center;
  }
`;

const WhyList = styled.ol`
  display: grid;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const WhyItem = styled.li`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.875rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const WhyNumber = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.aqua};
  line-height: 1;
  padding-top: 0.125rem;
`;

const WhyTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.deepBlue};
  margin-bottom: 0.25rem;
`;

const WhyText = styled.p`
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FeaturedSection = styled.section`
  padding: 2rem 0 2.25rem;
  background: ${({ theme }) => theme.colors.offWhite};

  ${media.md} {
    padding: 2.5rem 0 2.75rem;
  }
`;

const FeaturedHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
  margin-bottom: 1.25rem;

  ${media.md} {
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const FeaturedTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.375rem, 3vw, 1.75rem);
  color: ${({ theme }) => theme.colors.deepBlue};
  margin: 0;
  line-height: 1.25;
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.875rem;

  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  ${media.lg} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ViewAllLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ocean};
  transition:
    gap ${({ theme }) => theme.transition},
    color ${({ theme }) => theme.transition};

  &:hover {
    gap: 0.55rem;
    color: ${({ theme }) => theme.colors.aqua};
  }
`;

const ViewAllWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.25rem;

  ${media.md} {
    display: none;
  }
`;

const ViewAllDesktop = styled(ViewAllLink)`
  display: none;

  ${media.md} {
    display: inline-flex;
    flex-shrink: 0;
  }
`;

const SERVICE_ICON_KEYS = ['certification', 'connection', 'legal', 'training'];

export default function Home() {
  const { t } = useTranslation();
  const { data: professionals, isLoading, isError, refetch } = useProfessionals();
  const featured = professionals?.slice(0, 6) ?? [];
  const h = t.home;

  return (
    <PageTransition>
      <HeroSection
        title={h.hero.title}
        quote={h.hero.quote}
        subtitle={h.hero.subtitle}
        image={HERO_IMAGE}
        imageAlt={h.hero.imageAlt}
        imageVariant="logo"
        primaryCta={{ label: h.hero.primaryCta, href: '/professionals' }}
        secondaryCta={{ label: h.hero.secondaryCta, href: LIST_WITH_US_URL }}
      />

      <FeaturedSection>
        <Container>
          <FeaturedHeader>
            <FeaturedTitle>{h.professionals.title}</FeaturedTitle>
            <ViewAllDesktop to="/professionals">
              {h.professionals.viewAll} <span aria-hidden="true">→</span>
            </ViewAllDesktop>
          </FeaturedHeader>

          {isLoading && <LoadingState message={h.professionals.loading} />}
          {isError && (
            <ErrorState
              title={h.professionals.errorTitle}
              message={h.professionals.errorMessage}
              onRetry={refetch}
            />
          )}
          {!isLoading && !isError && (
            <>
              <FeaturedGrid>
                {featured.length > 0 ? (
                  featured.map((professional) => (
                    <MemberCard key={professional.id} professional={professional} />
                  ))
                ) : (
                  <BodyText style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                    {h.professionals.empty}
                  </BodyText>
                )}
              </FeaturedGrid>
              <ViewAllWrap>
                <ViewAllLink to="/professionals">
                  {h.professionals.viewAll} <span aria-hidden="true">→</span>
                </ViewAllLink>
              </ViewAllWrap>
            </>
          )}
        </Container>
      </FeaturedSection>

      <SkySection>
        <Container>
          <TwoColumn>
            <ScrollReveal>
              <Eyebrow>{h.aboutTeaser.eyebrow}</Eyebrow>
              <SectionHeading>{h.aboutTeaser.title}</SectionHeading>
              <ImpactTitle>{h.aboutTeaser.impactTitle}</ImpactTitle>
              <BodyText>{h.aboutTeaser.mission}</BodyText>
              <ReadMoreLink to="/about">
                {h.aboutTeaser.readMore} <span aria-hidden="true">→</span>
              </ReadMoreLink>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <AboutImage src={HOME_IMAGES.about} alt={h.aboutTeaser.imageAlt} loading="lazy" />
            </ScrollReveal>
          </TwoColumn>
        </Container>
      </SkySection>

      <ServicesSection $bg="white">
        <Container>
          <ServicesGrid
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {h.services.items.map((service, index) => (
              <ServiceCard key={service.title} variants={staggerItem}>
                <ServiceIconCircle>
                  <ServiceIcon name={SERVICE_ICON_KEYS[index]} />
                </ServiceIconCircle>
                <ServiceTitle>{service.title}</ServiceTitle>
                <ServiceText>{service.text}</ServiceText>
              </ServiceCard>
            ))}
          </ServicesGrid>
        </Container>
      </ServicesSection>

      <CareerSection $bg="white">
        <Container>
          <CareerBanner>
            <CareerBg src={HOME_IMAGES.career} alt="" aria-hidden="true" />
            <CareerOverlay aria-hidden="true" />
            <CareerContent>
              <CareerTitle>{h.careerCta.title}</CareerTitle>
              <Button to="/blue-passport" variant="primary" size="lg">
                {h.careerCta.cta}
              </Button>
            </CareerContent>
          </CareerBanner>
        </Container>
      </CareerSection>

      <WhySkySection>
        <Container>
          <WhyHeader>
            <ScrollReveal>
              <Eyebrow>{h.whyUs.eyebrow}</Eyebrow>
              <SectionHeading>{h.whyUs.title}</SectionHeading>
            </ScrollReveal>
          </WhyHeader>
          <WhyLayout>
            <ScrollReveal>
              <WhyImage src={HOME_IMAGES.whyUs} alt={h.whyUs.imageAlt} loading="lazy" />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <WhyList>
                {h.whyUs.items.map((item) => (
                  <WhyItem key={item.number}>
                    <WhyNumber>{item.number}</WhyNumber>
                    <div>
                      <WhyTitle>{item.title}</WhyTitle>
                      <WhyText>{item.text}</WhyText>
                    </div>
                  </WhyItem>
                ))}
              </WhyList>
            </ScrollReveal>
          </WhyLayout>
        </Container>
      </WhySkySection>
    </PageTransition>
  );
}
