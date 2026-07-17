import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import BiographyContent from '../components/BiographyContent';
import SocialIcon from '../components/ui/SocialIcon';
import { useProfessional } from '../hooks/useWordPress';
import { useTranslation } from '../i18n/LanguageContext';
import { Section, Container } from '../styles/shared';
import { media } from '../styles/theme';

const SOCIAL_ICON_MAP = {
  facebook: 'facebook',
  twitter: 'twitter',
  x: 'twitter',
  instagram: 'instagram',
  youtube: 'youtube',
  linkedin: 'linkedin',
  whatsapp: 'whatsapp',
};

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  margin-bottom: ${({ theme }) => theme.space.md};
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ocean};
  transition: gap ${({ theme }) => theme.transition};

  &:hover {
    gap: ${({ theme }) => theme.space.sm};
    color: ${({ theme }) => theme.colors.aqua};
  }
`;

const Card = styled.article`
  max-width: 720px;
  margin: 0 auto;
  padding: 1.25rem;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  ${media.md} {
    padding: 1.5rem 1.75rem;
  }
`;

const Header = styled.header`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

const Photo = styled.div`
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.skyLight};
  border: 1px solid ${({ theme }) => theme.colors.border};

  ${media.md} {
    width: 88px;
    height: 88px;
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImagePlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 1.5rem;
  opacity: 0.25;
`;

const HeaderText = styled.div`
  min-width: 0;
  flex: 1;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
`;

const Name = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.25rem, 3vw, 1.625rem);
  line-height: 1.25;
  color: ${({ theme }) => theme.colors.deepBlue};
  margin: 0;
`;

const ContactIcons = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.15rem;
`;

const IconLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.ocean};
  transition:
    color ${({ theme }) => theme.transition},
    border-color ${({ theme }) => theme.transition},
    background ${({ theme }) => theme.transition};

  svg {
    width: 15px;
    height: 15px;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.aqua};
    border-color: rgba(52, 152, 219, 0.35);
    background: rgba(52, 152, 219, 0.06);
  }
`;

const Meta = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Category = styled.span`
  color: ${({ theme }) => theme.colors.ocean};
  font-weight: 600;
`;

const CertBadge = styled.span`
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.2rem 0.55rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.ocean};
  background: rgba(52, 152, 219, 0.08);
  border: 1px solid rgba(52, 152, 219, 0.18);
  border-radius: ${({ theme }) => theme.radius.sm};
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 1rem 0;
`;

const SectionHeading = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.deepBlue};
  margin: 0 0 0.5rem;
`;

const BioWrap = styled.div`
  & > div {
    gap: 0.5rem;
  }

  .bio-lead {
    margin-bottom: 0.15rem;
  }

  .bio-lead-name {
    font-size: 1rem;
  }

  .bio-lead-tagline {
    font-size: 0.875rem;
  }

  .bio-highlight {
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 0.5rem 0.75rem;
  }

  .bio-section {
    font-size: 0.9375rem;
    margin: 0.35rem 0 0;
    padding-top: 0.35rem;
  }

  .bio-item {
    padding: 0.4rem 0 0.4rem 0.75rem;
  }

  .bio-item-title {
    font-size: 0.8125rem;
    margin-bottom: 0.1rem;
  }

  .bio-item-text,
  .bio-paragraph {
    font-size: 0.8125rem;
    line-height: 1.5;
  }

  .bio-quote {
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 0.65rem 0.85rem;
    margin-top: 0.35rem;

    &::before {
      font-size: 1.25rem;
      top: 0.15rem;
      left: 0.5rem;
    }
  }
`;

const ExtraLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  font-size: 0.8125rem;
`;

const ExtraLink = styled.a`
  color: ${({ theme }) => theme.colors.ocean};
  transition: color ${({ theme }) => theme.transition};

  &:hover {
    color: ${({ theme }) => theme.colors.aqua};
  }
`;

const SocialList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.875rem;
  height: 1.875rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.ocean};
  transition:
    color ${({ theme }) => theme.transition},
    border-color ${({ theme }) => theme.transition},
    background ${({ theme }) => theme.transition};

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.aqua};
    border-color: rgba(52, 152, 219, 0.35);
    background: rgba(52, 152, 219, 0.06);
  }
`;

const ProfileSection = styled(Section)`
  padding-top: calc(${({ theme }) => theme.layout.navbarHeight} + ${({ theme }) => theme.space.md});
  padding-bottom: ${({ theme }) => theme.space.xl};
`;

function socialLabel(id = '') {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function toWhatsAppUrl(value = '') {
  const trimmed = String(value).trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : '';
}

export default function ProfessionalDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const p = t.profile;
  const { data: professional, isLoading, isError, refetch } = useProfessional(id);

  if (isLoading) {
    return <LoadingState fullPage message={p.loading} />;
  }

  if (isError || !professional) {
    return (
      <Section>
        <Container>
          <ErrorState
            fullPage
            title={p.notFoundTitle}
            message={p.notFoundMessage}
            onRetry={refetch}
            showHomeLink
          />
        </Container>
      </Section>
    );
  }

  const {
    name,
    category,
    location,
    featuredImage,
    biography,
    email,
    phone,
    whatsapp,
    website,
    linkedin,
    social,
  } = professional;

  const whatsappUrl = toWhatsAppUrl(whatsapp || phone);
  const socialLinks = (social || []).filter((link) => link.id !== 'linkedin' || !linkedin);
  const displaySocial = [
    ...(linkedin ? [{ id: 'linkedin', url: linkedin }] : []),
    ...socialLinks,
  ].filter((link) => SOCIAL_ICON_MAP[link.id]);

  const hasExtra = website || displaySocial.length > 0;

  return (
    <PageTransition>
      <ProfileSection $bg="offWhite">
        <Container>
          <BackLink to="/professionals">
            <span aria-hidden="true">←</span> {p.backToDirectory}
          </BackLink>

          <ScrollReveal>
            <Card>
              <Header>
                <Photo>
                  {featuredImage ? (
                    <ProfileImage src={featuredImage} alt={name} />
                  ) : (
                    <ImagePlaceholder aria-hidden="true">⚓</ImagePlaceholder>
                  )}
                </Photo>

                <HeaderText>
                  <TitleRow>
                    <Name>{name}</Name>
                    {(email || whatsappUrl) && (
                      <ContactIcons>
                        {email && (
                          <IconLink href={`mailto:${email}`} aria-label={p.email} title={email}>
                            <SocialIcon name="email" />
                          </IconLink>
                        )}
                        {whatsappUrl && (
                          <IconLink
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={p.whatsapp}
                            title={whatsapp || phone}
                          >
                            <SocialIcon name="whatsapp" />
                          </IconLink>
                        )}
                      </ContactIcons>
                    )}
                  </TitleRow>

                  {(category || location) && (
                    <Meta>
                      {category && <Category>{category}</Category>}
                      {category && location && ' · '}
                      {location}
                    </Meta>
                  )}
                  <CertBadge>{p.certBadge}</CertBadge>
                </HeaderText>
              </Header>

              {biography && (
                <>
                  <Divider />
                  <SectionHeading>{p.biography}</SectionHeading>
                  <BioWrap>
                    <BiographyContent html={biography} />
                  </BioWrap>
                </>
              )}

              {hasExtra && (
                <>
                  <Divider />
                  <ExtraLinks>
                    {website && (
                      <ExtraLink href={website} target="_blank" rel="noopener noreferrer">
                        {website.replace(/^https?:\/\//, '')}
                      </ExtraLink>
                    )}
                    {displaySocial.length > 0 && (
                      <SocialList>
                        {displaySocial.map((link) => {
                          const iconName = SOCIAL_ICON_MAP[link.id];
                          const label = link.id === 'linkedin' ? p.linkedin : socialLabel(link.id);
                          return (
                            <li key={`${link.id}-${link.url}`}>
                              <SocialLink
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                title={label}
                              >
                                <SocialIcon name={iconName} />
                              </SocialLink>
                            </li>
                          );
                        })}
                      </SocialList>
                    )}
                  </ExtraLinks>
                </>
              )}
            </Card>
          </ScrollReveal>
        </Container>
      </ProfileSection>
    </PageTransition>
  );
}
