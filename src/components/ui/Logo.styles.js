import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { media } from '../../styles/theme';

export const LogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 101;
  flex-shrink: 0;
  text-decoration: none;

  ${media.nav} {
    gap: 0.625rem;
  }
`;

export const LogoImage = styled.img`
  display: block;
  height: 3rem;
  width: 3rem;
  object-fit: contain;
  flex-shrink: 0;

  ${media.md} {
    height: 3.5rem;
    width: 3.5rem;
  }

  ${media.nav} {
    height: 3.75rem;
    width: 3.75rem;
  }
`;

export const LogoWordmark = styled.span`
  display: flex;
  flex-direction: column;
  line-height: 1.05;
`;

export const LogoLine = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.colors.deepBlue};
  white-space: nowrap;

  ${media.md} {
    font-size: 1.0625rem;
  }

  ${media.nav} {
    font-size: 1.125rem;
  }
`;
