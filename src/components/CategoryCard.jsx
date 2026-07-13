import { motion } from 'framer-motion';
import styled from 'styled-components';

const Card = styled(motion.article)`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.space.lg};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid rgba(52, 152, 219, 0.14);
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition:
    transform ${({ theme }) => theme.transition},
    box-shadow ${({ theme }) => theme.transition};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const Icon = styled.div`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const Title = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.deepBlue};
  margin-bottom: ${({ theme }) => theme.space.xs};
`;

const Description = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.75;
`;

export default function CategoryCard({ category }) {
  const { icon, title, description } = category;

  return (
    <Card whileTap={{ scale: 0.99 }}>
      <Icon aria-hidden="true">{icon}</Icon>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Card>
  );
}
