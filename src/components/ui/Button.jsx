import { Link } from 'react-router-dom';
import { StyledButton } from './Button.styles';

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  ...props
}) {
  if (to) {
    return (
      <StyledButton as={Link} to={to} $variant={variant} $size={size} {...props}>
        {children}
      </StyledButton>
    );
  }

  if (href) {
    return (
      <StyledButton as="a" href={href} $variant={variant} $size={size} {...props}>
        {children}
      </StyledButton>
    );
  }

  return (
    <StyledButton as="button" type="button" $variant={variant} $size={size} {...props}>
      {children}
    </StyledButton>
  );
}
