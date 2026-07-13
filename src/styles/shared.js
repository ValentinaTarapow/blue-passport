import styled from 'styled-components';
import { media, patternSvg } from './theme';

export const Section = styled.section`
  position: relative;
  padding-block: ${({ theme }) => theme.space['2xl']};
  background: ${({ $bg, theme }) => {
    if ($bg === 'sky') return theme.colors.skyLight;
    if ($bg === 'white') return theme.colors.white;
    if ($bg === 'gradient') return 'transparent';
    return theme.colors.offWhite;
  }};

  ${media.md} {
    padding-block: 7rem;
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.containerMax};
  margin-inline: auto;
  padding-inline: ${({ theme }) => theme.layout.containerPadding};

  ${media.md} {
    padding-inline: 2rem;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space.lg};

  ${media.md} {
    grid-template-columns: repeat(${({ $cols }) => $cols || 2}, 1fr);
  }

  ${media.lg} {
    grid-template-columns: repeat(${({ $colsLg }) => $colsLg || $cols || 3}, 1fr);
  }
`;

export const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space.xl};
  align-items: center;

  ${media.lg} {
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => theme.space['2xl']};
  }
`;

export const Prose = styled.div`
  font-size: 1.0625rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.8;

  p + p {
    margin-top: ${({ theme }) => theme.space.md};
  }

  h3 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.deepBlue};
    margin-bottom: ${({ theme }) => theme.space.sm};
  }
`;

export const FeatureBox = styled.div`
  padding: ${({ theme }) => theme.space.lg};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    transform ${({ theme }) => theme.transition},
    box-shadow ${({ theme }) => theme.transition};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: rgba(52, 152, 219, 0.2);
  }
`;

export const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

export const FeatureTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.deepBlue};
  margin-bottom: ${({ theme }) => theme.space.xs};
`;

export const FeatureText = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.75;
`;

export const BgLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
`;

export const PatternLayer = styled(BgLayer)`
  opacity: 0.04;
  background-image: ${patternSvg};
`;
