import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { NAV_LINKS, BRAND, SITE_TAGLINE } from '../utils/constants';
import { useTranslation } from '../i18n/LanguageContext';
import { media } from '../styles/theme';

const NAV_LABEL_KEYS = {
  '/': 'home',
  '/about': 'about',
  '/professionals': 'professionals',
  '/faq': 'faq',
  '/contact': 'contact',
};

const FooterWrapper = styled.footer`
  background: ${({ theme }) => theme.colors.deepBlue};
  color: rgba(255, 255, 255, 0.82);
  border-top: 3px solid ${({ theme }) => theme.colors.aqua};
  padding: clamp(3rem, 7vw, 4.5rem) 0 clamp(2rem, 5vw, 2.75rem);
`;

const Container = styled.div`
  max-width: ${({ theme }) => theme.layout.containerMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.layout.containerPadding};

  ${media.md} {
    padding: 0 2rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space.xl};

  ${media.md} {
    grid-template-columns: 2fr 1fr 1fr;
    gap: ${({ theme }) => theme.space['2xl']};
  }
`;

const BrandTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.space.xs};
`;

const BrandTagline = styled.p`
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.aquaLight};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const BrandDescription = styled.p`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.75;
  max-width: 400px;
`;

const ColumnTitle = styled.h4`
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.aquaLight};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const LinkList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
`;

const FooterLink = styled(Link)`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.78);
  transition: color ${({ theme }) => theme.transition};

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const ExternalLink = styled.a`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.78);
  transition: color ${({ theme }) => theme.transition};

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
  margin-top: ${({ theme }) => theme.space.xl};
  padding-top: ${({ theme }) => theme.space.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  ${media.md} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Copyright = styled.p`
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.white};
`;

const BottomLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.lg};
`;

const LegalLink = styled(Link)`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.aquaLight};
  text-decoration: underline;
  text-underline-offset: 3px;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <FooterWrapper>
      <Container>
        <Grid>
          <div>
            <BrandTitle>{BRAND.name}</BrandTitle>
            <BrandTagline>{SITE_TAGLINE}</BrandTagline>
            <BrandDescription>
              Advancing sustainable maritime excellence through professional certification,
              global networking, and blue economy leadership.
            </BrandDescription>
          </div>

          <div>
            <ColumnTitle>Navigation</ColumnTitle>
            <LinkList>
              {NAV_LINKS.map(({ path, end }) => (
                <li key={path}>
                  <FooterLink to={path} end={end}>
                    {t.nav[NAV_LABEL_KEYS[path]]}
                  </FooterLink>
                </li>
              ))}
            </LinkList>
          </div>

          <div>
            <ColumnTitle>Connect</ColumnTitle>
            <LinkList>
              <li>
                <ExternalLink href="mailto:pagos@thebluepassport.es">pagos@thebluepassport.es</ExternalLink>
              </li>
              <li>
                <FooterLink to="/professionals">Member Directory</FooterLink>
              </li>
              <li>
                <FooterLink to="/about">Certification</FooterLink>
              </li>
            </LinkList>
          </div>
        </Grid>

        <Bottom>
          <Copyright>
            &copy; {year} {BRAND.name}. All rights reserved.
          </Copyright>
          <BottomLinks>
            <LegalLink to="/about">Privacy Policy</LegalLink>
            <LegalLink to="/about">Terms of Service</LegalLink>
          </BottomLinks>
        </Bottom>
      </Container>
    </FooterWrapper>
  );
}
