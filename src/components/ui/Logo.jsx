import { Link } from 'react-router-dom';
import { BRAND } from '../../utils/constants';
import { LogoImage, LogoLine, LogoLink, LogoWordmark } from './Logo.styles';

export default function Logo({ onClick }) {
  return (
    <LogoLink to="/" onClick={onClick} aria-label={BRAND.name}>
      <LogoImage src={BRAND.logo} alt="" aria-hidden="true" />
      <LogoWordmark aria-hidden="true">
        {BRAND.wordmark.map((line) => (
          <LogoLine key={line}>{line}</LogoLine>
        ))}
      </LogoWordmark>
    </LogoLink>
  );
}
