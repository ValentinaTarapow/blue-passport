import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import BiographyContent from '../components/BiographyContent';
import { useProfessional } from '../hooks/useWordPress';
import { useTranslation } from '../i18n/LanguageContext';
import { Section, Container } from '../styles/shared';
import { media } from '../styles/theme';

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  margin-bottom: ${({ theme }) => theme.space.xl};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ocean};
  transition: gap ${({ theme }) => theme.transition};

  &:hover {
    gap: ${({ theme }) => theme.space.sm};
    color: ${({ theme }) => theme.colors.aqua};
  }
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space.xl};

  ${media.lg} {
    grid-template-columns: 380px 1fr;
    gap: ${({ theme }) => theme.space['2xl']};
  }
`;

const ImageCard = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const ProfileImage = styled.img`
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
`;

const ImagePlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 3 / 4;
  font-size: 5rem;
  opacity: 0.2;
  background: ${({ theme }) => theme.colors.skyLight};
`;

const CategoryBadge = styled.span`
  position: absolute;
  top: ${({ theme }) => theme.space.md};
  left: ${({ theme }) => theme.space.md};
  padding: 0.375rem 0.875rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.aquaLight};
  background: rgba(10, 37, 64, 0.85);
  border-radius: ${({ theme }) => theme.radius.sm};
`;

const Name = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2rem, 4vw, 3rem);
  color: ${({ theme }) => theme.colors.deepBlue};
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const Location = styled.p`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.aqua};
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.space.lg} 0;
`;

const SectionHeading = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.deepBlue};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const ContactList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
`;

const ContactItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ContactLabel = styled.span`
  min-width: 70px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.75rem;
`;

const ContactLink = styled.a`
  color: ${({ theme }) => theme.colors.ocean};
  transition: color ${({ theme }) => theme.transition};

  &:hover {
    color: ${({ theme }) => theme.colors.aqua};
  }
`;

const CertBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  padding: 0.75rem 1.25rem;
  background: rgba(52, 152, 219, 0.08);
  border: 1px solid rgba(52, 152, 219, 0.2);
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ocean};
`;

const ProfileSection = styled(Section)`
  padding-top: calc(${({ theme }) => theme.layout.navbarHeight} + ${({ theme }) => theme.space.lg});
`;

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

  const { name, category, location, featuredImage, biography, email, phone, website } =
    professional;

  const hasContact = email || phone || website;

  return (
    <PageTransition>
      <ProfileSection $bg="white">
        <Container>
          <BackLink to="/professionals">
            <span aria-hidden="true">←</span> {p.backToDirectory}
          </BackLink>

          <ProfileGrid>
            <ScrollReveal>
              <ImageCard>
                {featuredImage ? (
                  <ProfileImage src={featuredImage} alt={name} />
                ) : (
                  <ImagePlaceholder aria-hidden="true">⚓</ImagePlaceholder>
                )}
                {category && <CategoryBadge>{category}</CategoryBadge>}
              </ImageCard>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div>
                <Name>{name}</Name>
                {location && (
                  <Location>
                    <span aria-hidden="true">📍</span>
                    {location}
                  </Location>
                )}

                <CertBadge>
                  <span aria-hidden="true">🏅</span>
                  {p.certBadge}
                </CertBadge>

                <Divider />

                {biography && (
                  <>
                    <SectionHeading>{p.biography}</SectionHeading>
                    <BiographyContent html={biography} />
                  </>
                )}

                {hasContact && (
                  <>
                    <Divider />
                    <SectionHeading>{p.contact}</SectionHeading>
                    <ContactList>
                      {email && (
                        <ContactItem>
                          <ContactLabel>{p.email}</ContactLabel>
                          <ContactLink href={`mailto:${email}`}>{email}</ContactLink>
                        </ContactItem>
                      )}
                      {phone && (
                        <ContactItem>
                          <ContactLabel>{p.phone}</ContactLabel>
                          <ContactLink href={`tel:${phone}`}>{phone}</ContactLink>
                        </ContactItem>
                      )}
                      {website && (
                        <ContactItem>
                          <ContactLabel>{p.web}</ContactLabel>
                          <ContactLink href={website} target="_blank" rel="noopener noreferrer">
                            {website.replace(/^https?:\/\//, '')}
                          </ContactLink>
                        </ContactItem>
                      )}
                    </ContactList>
                  </>
                )}
              </div>
            </ScrollReveal>
          </ProfileGrid>
        </Container>
      </ProfileSection>
    </PageTransition>
  );
}
