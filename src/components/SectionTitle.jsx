import styled from 'styled-components';
import ScrollReveal from './ScrollReveal';
import { media } from '../styles/theme';

const Wrapper = styled(ScrollReveal)`
  text-align: ${({ $align }) => $align || 'center'};
  margin-bottom: ${({ theme }) => theme.space.xl};
  max-width: ${({ $narrow }) => ($narrow ? '720px' : 'none')};
  margin-left: ${({ $align }) => ($align === 'center' ? 'auto' : '0')};
  margin-right: ${({ $align }) => ($align === 'center' ? 'auto' : '0')};

  ${media.md} {
    margin-bottom: 5rem;
  }
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

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 600;
  color: ${({ theme }) => theme.colors.deepBlue};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const Description = styled.p`
  font-size: 1.0625rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.75;
  max-width: 680px;
  margin: ${({ $align }) => ($align === 'center' ? '0 auto' : '0')};
`;

export default function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'center',
  narrow = false,
}) {
  return (
    <Wrapper $align={align} $narrow={narrow}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Title>{title}</Title>
      {description && <Description $align={align}>{description}</Description>}
    </Wrapper>
  );
}
