import styled from 'styled-components';

export const LangDropdown = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const LangTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 3.25rem;
  padding: 0.4375rem 0.625rem;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.deepBlue};
  background: ${({ theme }) => theme.colors.offWhite};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transition},
    border-color ${({ theme }) => theme.transition};

  &::after {
    content: '▾';
    font-size: 0.75rem;
    transition: transform ${({ theme }) => theme.transition};
    transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'none')};
  }

  &:hover {
    background: rgba(52, 152, 219, 0.08);
    border-color: rgba(52, 152, 219, 0.2);
  }
`;

export const LangPanel = styled.div`
  position: absolute;
  top: calc(100% + 0.375rem);
  right: 0;
  display: ${({ $open }) => ($open ? 'flex' : 'none')};
  flex-direction: column;
  min-width: 100%;
  padding: 0.25rem;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 130;
`;

export const LangOption = styled.button`
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  text-align: left;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.deepBlue : theme.colors.textMuted};
  background: ${({ $active }) => ($active ? 'rgba(52, 152, 219, 0.1)' : 'transparent')};
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  white-space: nowrap;
  transition:
    background ${({ theme }) => theme.transition},
    color ${({ theme }) => theme.transition};

  &:hover {
    color: ${({ theme }) => theme.colors.deepBlue};
    background: rgba(52, 152, 219, 0.08);
  }
`;
