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
  gap: 0.5rem;
  min-width: 0;
  width: 100%;
  max-width: 90rem;
  margin-inline: auto;
  padding-inline: 0.75rem;

  ${media.md} {
    padding-inline: 1rem;
  }

  ${media.nav} {
    padding-inline: 1.125rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: 0.75rem;

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
  gap: 0.4375rem;
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
  }

  @media (min-width: 1280px) {
    gap: 0.625rem;
  }
`;

const StyledNavLink = styled(NavLink)`
  font-size: 0.6875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color ${({ theme }) => theme.transition};
  position: relative;
  white-space: nowrap;
  text-decoration: none;
  flex-shrink: 0;
  letter-spacing: 0.04em;
  text-transform: uppercase;

  @media (min-width: 1200px) {
    font-size: 0.75rem;
  }

  @media (min-width: 1360px) {
    font-size: 0.8125rem;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: ${({ theme }) => theme.colors.aqua};
    border-radius: 1px;
    transition: width ${({ theme }) => theme.transition};
  }

  &:hover,
  &.active {
    color: ${({ theme }) => theme.colors.deepBlue};
  }

  &:hover::after,
  &.active::after {
    width: 100%;
  }

  ${media.maxNav} {
    font-size: 1.125rem;
    white-space: normal;
    text-transform: none;
    letter-spacing: 0;
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
  gap: 0.5rem;
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
    gap: 0.625rem;
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
  gap: 0.75rem;
  flex-shrink: 0;
  margin-left: auto;

  ${media.nav} {
    margin-left: 0;
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
      <Button to={LIST_WITH_US_URL} variant="outline" size="sm" onClick={onNavigate}>
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
            {NAV_LINKS.map(({ path, end }) => (
              <li key={path}>
                <StyledNavLink to={path} onClick={closeMenu} end={end}>
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
