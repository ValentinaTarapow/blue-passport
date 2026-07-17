import styled, { css } from 'styled-components';

const sizeStyles = {
  sm: css`
    padding: 0.5rem 1.125rem;
    font-size: 0.875rem;
  `,
  md: css`
    padding: 0.75rem 1.5rem;
    font-size: 0.9375rem;
  `,
  lg: css`
    padding: 1rem 2rem;
    font-size: 1rem;
  `,
};

const variantStyles = {
  primary: css`
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.aqua} 0%,
      ${({ theme }) => theme.colors.ocean} 100%
    );
    color: ${({ theme }) => theme.colors.white};
    box-shadow: ${({ theme }) => theme.shadows.button};

    &:hover {
      box-shadow: ${({ theme }) => theme.shadows.buttonHover};
      transform: translateY(-1px);
    }
  `,
  secondary: css`
    background-color: ${({ theme }) => theme.colors.deepBlue};
    color: ${({ theme }) => theme.colors.white};

    &:hover {
      background-color: ${({ theme }) => theme.colors.ocean};
      transform: translateY(-1px);
    }
  `,
  outline: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.deepBlue};
    border: 1.5px solid ${({ theme }) => theme.colors.border};

    &:hover {
      border-color: ${({ theme }) => theme.colors.aqua};
      color: ${({ theme }) => theme.colors.ocean};
      background-color: rgba(78, 205, 196, 0.06);
    }
  `,
  gradientOutline: css`
    position: relative;
    color: ${({ theme }) => theme.colors.ocean};
    background-color: rgba(255, 255, 255, 0.3);
    border: none;
    box-shadow: none;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: 1.5px;
      background: linear-gradient(
        135deg,
        ${({ theme }) => theme.colors.aqua} 0%,
        ${({ theme }) => theme.colors.ocean} 55%,
        ${({ theme }) => theme.colors.deepBlue} 100%
      );
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }

    &:hover {
      color: ${({ theme }) => theme.colors.ocean};
      background-color: rgba(78, 205, 196, 0.14);
      transform: none;
    }

    &:active {
      transform: none;
    }
  `,
  ghost: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.deepBlue};

    &:hover {
      color: ${({ theme }) => theme.colors.aqua};
    }
  `,
};

export const StyledButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radius.xl};
  transition:
    background-color ${({ theme }) => theme.transition},
    color ${({ theme }) => theme.transition},
    box-shadow ${({ theme }) => theme.transition},
    transform ${({ theme }) => theme.transition},
    border-color ${({ theme }) => theme.transition};
  white-space: nowrap;
  text-decoration: none;

  &:active {
    transform: scale(0.98);
  }

  ${({ $size = 'md' }) => sizeStyles[$size]}
  ${({ $variant = 'primary' }) => variantStyles[$variant]}
`;
