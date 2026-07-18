import styled from 'styled-components';

const Wrap = styled.span`
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  margin: 0;
  vertical-align: middle;
  cursor: ${({ $showTooltip }) => ($showTooltip ? 'help' : 'default')};

  &:hover .cert-tooltip,
  &:focus-visible .cert-tooltip {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, 0);
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => ($size === 'sm' ? '1.25rem' : '1.375rem')};
  height: ${({ $size }) => ($size === 'sm' ? '1.25rem' : '1.375rem')};
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.aqua} 0%,
    ${({ theme }) => theme.colors.ocean} 100%
  );
  color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 1px 3px rgba(10, 37, 64, 0.18);

  svg {
    width: ${({ $size }) => ($size === 'sm' ? '0.7rem' : '0.78rem')};
    height: ${({ $size }) => ($size === 'sm' ? '0.7rem' : '0.78rem')};
    display: block;
  }
`;

const Tooltip = styled.span`
  position: absolute;
  left: 50%;
  bottom: calc(100% + 0.4rem);
  z-index: 5;
  padding: 0.35rem 0.55rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.deepBlue};
  color: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.3;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transform: translate(-50%, 0.15rem);
  transition:
    opacity 0.15s ease,
    transform 0.15s ease,
    visibility 0.15s ease;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: ${({ theme }) => theme.colors.deepBlue};
  }
`;

/** Circular Blue Certificate seal. */
export default function CertificateBadge({ label, size = 'md', showTooltip = true }) {
  return (
    <Wrap
      $showTooltip={showTooltip}
      tabIndex={showTooltip ? 0 : undefined}
      role="img"
      aria-label={label}
    >
      <Badge $size={size} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M6.5 12.5l3.5 3.5 7.5-8"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Badge>
      {showTooltip && label ? (
        <Tooltip className="cert-tooltip" role="tooltip">
          {label}
        </Tooltip>
      ) : null}
    </Wrap>
  );
}
