import styled from 'styled-components';
import { media } from './theme';

export const Container = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.containerMax};
  margin-inline: auto;
  padding-inline: ${({ theme }) => theme.layout.containerPadding};

  ${media.md} {
    padding-inline: 2rem;
  }
`;

export const Section = styled.section`
  padding-block: ${({ theme }) => theme.space['2xl']};

  ${media.md} {
    padding-block: 7rem;
  }
`;

export const SectionLabel = styled.span`
  display: inline-block;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.aqua};
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

export const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 600;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.deepBlue};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

export const SectionSubtitle = styled.p`
  font-size: 1.0625rem;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 36rem;
  line-height: 1.7;
`;

export const SectionHeader = styled.header`
  margin-bottom: ${({ theme }) => theme.space.xl};
  text-align: ${({ $align = 'left' }) => $align};

  ${SectionSubtitle} {
    margin-inline: ${({ $align }) => ($align === 'center' ? 'auto' : '0')};
  }

  ${media.md} {
    margin-bottom: 5rem;
  }
`;
