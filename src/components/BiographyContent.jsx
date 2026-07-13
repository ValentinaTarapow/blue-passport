import styled from 'styled-components';
import { formatBiography } from '../utils/formatBiography';

const Biography = styled.div`
  display: grid;
  gap: 0.875rem;

  .bio-lead {
    margin-bottom: 0.25rem;
  }

  .bio-lead-name {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.deepBlue};
  }

  .bio-lead-tagline {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 1.125rem;
    font-style: italic;
    color: ${({ theme }) => theme.colors.ocean};
  }

  .bio-highlight {
    font-size: 1.0625rem;
    font-weight: 500;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.deepBlue};
    padding: 0.875rem 1rem;
    background: rgba(52, 152, 219, 0.06);
    border-left: 3px solid ${({ theme }) => theme.colors.aqua};
    border-radius: 0 ${({ theme }) => theme.radius.sm} ${({ theme }) => theme.radius.sm} 0;
    margin: 0;
  }

  .bio-section {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 1.125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.deepBlue};
    margin: 0.5rem 0 0;
    padding-top: 0.5rem;
  }

  .bio-item {
    padding: 0.75rem 0 0.75rem 1rem;
    border-left: 2px solid rgba(52, 152, 219, 0.35);
  }

  .bio-item-title {
    display: block;
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.ocean};
    margin-bottom: 0.25rem;
  }

  .bio-item-text {
    font-size: 0.9375rem;
    line-height: 1.65;
    color: ${({ theme }) => theme.colors.textMuted};
    margin: 0;
  }

  .bio-quote {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 1.0625rem;
    font-style: italic;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.deepBlue};
    margin: 0.5rem 0 0;
    padding: 1rem 1.25rem;
    background: ${({ theme }) => theme.colors.skyLight};
    border: none;
    border-radius: ${({ theme }) => theme.radius.md};
    position: relative;

    &::before {
      content: '“';
      position: absolute;
      top: 0.25rem;
      left: 0.75rem;
      font-size: 2rem;
      line-height: 1;
      color: ${({ theme }) => theme.colors.aqua};
      opacity: 0.45;
    }
  }

  .bio-paragraph {
    font-size: 1rem;
    line-height: 1.8;
    color: ${({ theme }) => theme.colors.textMuted};
    margin: 0;
  }
`;

export default function BiographyContent({ html }) {
  if (!html?.trim()) return null;

  return (
    <Biography dangerouslySetInnerHTML={{ __html: formatBiography(html) }} />
  );
}
