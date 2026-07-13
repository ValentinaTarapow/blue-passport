import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => theme.space['2xl']} ${({ theme }) => theme.space.lg};
  min-height: ${({ $fullPage }) => ($fullPage ? '60vh' : '200px')};
  text-align: center;
`;

const Icon = styled.div`
  font-size: 2.5rem;
  opacity: 0.6;
`;

const Title = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.75rem;
  color: ${({ theme }) => theme.colors.deepBlue};
`;

const Message = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 480px;
  line-height: 1.7;
`;

const RetryButton = styled.button`
  margin-top: ${({ theme }) => theme.space.sm};
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.aqua},
    ${({ theme }) => theme.colors.ocean}
  );
  border-radius: ${({ theme }) => theme.radius.xl};
  transition: transform ${({ theme }) => theme.transition};

  &:hover {
    transform: translateY(-1px);
  }
`;

const HomeLink = styled(Link)`
  margin-top: ${({ theme }) => theme.space.xs};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.ocean};
  text-decoration: underline;
  text-underline-offset: 3px;

  &:hover {
    color: ${({ theme }) => theme.colors.aqua};
  }
`;

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We were unable to load this content. Please try again later.',
  onRetry,
  fullPage = false,
  showHomeLink = false,
}) {
  return (
    <Wrapper $fullPage={fullPage} role="alert">
      <Icon aria-hidden="true">⚠</Icon>
      <Title>{title}</Title>
      <Message>{message}</Message>
      {onRetry && <RetryButton onClick={onRetry}>Try Again</RetryButton>}
      {showHomeLink && <HomeLink to="/">Return Home</HomeLink>}
    </Wrapper>
  );
}
