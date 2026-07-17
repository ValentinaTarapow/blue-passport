import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Logo from './ui/Logo';
import Button from './ui/Button';
import LanguageSwitcher from './ui/LanguageSwitcher';
import { useTranslation } from '../i18n/LanguageContext';
import { LIST_WITH_US_URL, NAV_LINKS } from '../utils/constants';
import { media } from '../styles/theme';

const NAV_LABEL_KEYS = {
  '/': 'home',
  '/about': 'about',
  '/professionals': 'professionals',
  '/faq': 'faq',
  '/contact': 'contact',
};

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.navbar};
  height: ${({ theme }) => theme.layout.navbarHeight};
  background: ${({ theme }) => theme.colors.white};
  transition: box-shadow ${({ theme }) => theme.transition};
  box-shadow: ${({ $scrolled }) =>
    $scrolled ? '0 2px 12px rgba(27, 54, 93, 0.08)' : 'none'};
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  gap: 0.75rem;
  min-width: 0;
  width: 100%;
  max-width: 90rem;
  margin-inline: auto;
  padding-inline: 1rem;

  ${media.md} {
    padding-inline: 1.25rem;
  }

  ${media.nav} {
    gap: 1.25rem;
    padding-inline: 1.5rem;
  }

  @media (min-width: 1280px) {
    gap: 1.75rem;
    padding-inline: 2rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: 1rem;

  ${media.maxNav} {
    position: fixed;
    inset: 0;
    flex: none;
    flex-direction: column;
    justify-content: center;
    gap: ${({ theme }) => theme.space.lg};
    background: ${({ theme }) => theme.colors.white};
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
    transition:
      opacity ${({ theme }) => theme.transition},
      visibility ${({ theme }) => theme.transition};
  }
`;

const NavList = styled.ul`
  display: none;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;

  ${media.maxNav} {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.space.lg};
    text-align: center;
  }

  ${media.nav} {
    display: flex;
    flex: 1;
    min-width: 0;
    justify-content: center;
    gap: 1rem;
  }

  @media (min-width: 1280px) {
    gap: 1.35rem;
  }

  @media (min-width: 1440px) {
    gap: 1.75rem;
  }
`;

const StyledNavLink = styled(NavLink)`
  font-size: 0.6875rem;
  font-weight: ${({ $featured }) => ($featured ? 600 : 500)};
  color: ${({ theme, $featured }) => ($featured ? theme.colors.ocean : theme.colors.textMuted)};
  transition: color ${({ theme }) => theme.transition};
  position: relative;
  white-space: nowrap;
  text-decoration: none;
  flex-shrink: 0;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.35rem 0.15rem;
  border-radius: 0;
  background: transparent;

  @media (min-width: 1200px) {
    font-size: 0.75rem;
    padding: 0.35rem 0.25rem;
  }

  @media (min-width: 1360px) {
    font-size: 0.8125rem;
    padding: 0.4rem 0.35rem;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0.15rem;
    right: 0.15rem;
    width: auto;
    height: 2px;
    background: ${({ theme }) => theme.colors.aqua};
    border-radius: 1px;
    transform: scaleX(0);
    transform-origin: center;
    transition: transform ${({ theme }) => theme.transition};
  }

  &:hover,
  &.active {
    color: ${({ theme }) => theme.colors.deepBlue};
  }

  &:hover::after,
  &.active::after {
    transform: scaleX(1);
  }

  ${media.maxNav} {
    font-size: 1.125rem;
    white-space: normal;
    text-transform: none;
    letter-spacing: 0;
    padding: 0.25rem 0;

    &::after {
      left: 0;
      right: 0;
    }
  }
`;

const MenuToggle = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 2rem;
  height: 2rem;
  z-index: 101;
  flex-shrink: 0;

  span {
    display: block;
    width: 100%;
    height: 2px;
    background: ${({ theme }) => theme.colors.deepBlue};
    border-radius: 2px;
    transition:
      transform ${({ theme }) => theme.transition},
      opacity ${({ theme }) => theme.transition};
  }

  ${({ $open }) =>
    $open &&
    `
    span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    span:nth-child(2) { opacity: 0; }
    span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  `}

  ${media.nav} {
    display: none;
  }
`;

const NavCtas = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-shrink: 0;

  ${media.maxNav} {
    flex-direction: column;
    width: min(100%, 20rem);
    gap: 0.75rem;

    a {
      width: 100%;
      justify-content: center;
    }
  }

  ${media.nav} {
    gap: 0.75rem;
  }
`;

const DesktopCtas = styled(NavCtas)`
  display: none;

  ${media.nav} {
    display: flex;
  }
`;

const MobileCtas = styled(NavCtas)`
  display: flex;

  ${media.nav} {
    display: none;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  flex-shrink: 0;
  margin-left: auto;

  ${media.nav} {
    margin-left: 0;
    gap: 1rem;
  }
`;

export default function Navbar() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const ctaButtons = (onNavigate) => (
    <>
      <Button to="/professionals" variant="primary" size="sm" onClick={onNavigate}>
        {t.nav.cta.searchProfessionals}
      </Button>
      <Button to={LIST_WITH_US_URL} variant="gradientOutline" size="sm" onClick={onNavigate}>
        {t.nav.cta.listWithUs}
      </Button>
    </>
  );

  return (
    <Header $scrolled={scrolled}>
      <Inner>
        <Logo onClick={closeMenu} />

        <Nav $open={menuOpen}>
          <NavList>
            {NAV_LINKS.map(({ path, end, featured }) => (
              <li key={path}>
                <StyledNavLink to={path} onClick={closeMenu} end={end} $featured={featured}>
                  {t.nav[NAV_LABEL_KEYS[path]]}
                </StyledNavLink>
              </li>
            ))}
          </NavList>
          <MobileCtas>{ctaButtons(closeMenu)}</MobileCtas>
        </Nav>

        <NavActions>
          <DesktopCtas>{ctaButtons()}</DesktopCtas>
          <LanguageSwitcher />
          <MenuToggle
            $open={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </MenuToggle>
        </NavActions>
      </Inner>
    </Header>
  );
}
