import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import ScrollReveal from './ScrollReveal';
import { skySectionGradient } from '../styles/theme';

const Section = styled(ScrollReveal)`
  position: relative;
  overflow: hidden;
  background: ${skySectionGradient};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Container = styled.div`
  max-width: ${({ theme }) => theme.layout.containerMax};
  margin: 0 auto;
  padding: ${({ theme }) => theme.space['2xl']} ${({ theme }) => theme.layout.containerPadding};
  text-align: center;
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  color: ${({ theme }) => theme.colors.deepBlue};
  margin-bottom: ${({ theme }) => theme.space.md};
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const Description = styled.p`
  font-size: 1.0625rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.75;
  max-width: 560px;
  margin: 0 auto ${({ theme }) => theme.space.lg};
`;

const Button = styled(motion(Link))`
  display: inline-flex;
  align-items: center;
  padding: 0.875rem 1.75rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.aqua},
    ${({ theme }) => theme.colors.ocean}
  );
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadows.button};
  transition:
    transform ${({ theme }) => theme.transition},
    box-shadow ${({ theme }) => theme.transition};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.buttonHover};
  }
`;

export default function CTASection({ title, description, cta }) {
  return (
    <Section>
      <Container>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
        {cta && (
          <Button to={cta.href} whileTap={{ scale: 0.98 }}>
            {cta.label}
          </Button>
        )}
      </Container>
    </Section>
  );
}
