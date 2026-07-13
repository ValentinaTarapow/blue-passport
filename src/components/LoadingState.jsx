import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => theme.space['2xl']} ${({ theme }) => theme.space.lg};
  min-height: ${({ $fullPage }) => ($fullPage ? '60vh' : '200px')};
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 2px solid rgba(52, 152, 219, 0.2);
  border-top-color: ${({ theme }) => theme.colors.aqua};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Label = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export default function LoadingState({ message = 'Loading', fullPage = false }) {
  return (
    <Wrapper $fullPage={fullPage} role="status" aria-live="polite">
      <Spinner aria-hidden="true" />
      <Label>{message}</Label>
    </Wrapper>
  );
}
