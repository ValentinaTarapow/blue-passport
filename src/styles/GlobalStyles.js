import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    scroll-padding-top: 5rem;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 1rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.offWhite};
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 600;
    line-height: 1.2;
    color: ${({ theme }) => theme.colors.deepBlue};
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }

  ul, ol {
    list-style: none;
  }

  ::selection {
    background-color: rgba(52, 152, 219, 0.25);
    color: ${({ theme }) => theme.colors.deepBlue};
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.aqua};
    outline-offset: 2px;
  }

  .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition:
      opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .revealDelay1 { transition-delay: 0.1s; }
  .revealDelay2 { transition-delay: 0.2s; }
  .revealDelay3 { transition-delay: 0.3s; }
  .revealDelay4 { transition-delay: 0.4s; }

  @media (min-width: 768px) {
    :root {
      --container-padding: 2rem;
    }
  }
`;
