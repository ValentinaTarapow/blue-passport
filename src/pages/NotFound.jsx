import { useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import Button from '../components/ui/Button';
import PageTransition from '../components/PageTransition';
import { useTranslation } from '../i18n/LanguageContext';
import { Container } from '../styles/shared';
import { media, patternSvg } from '../styles/theme';

const Page = styled.section`
  position: relative;
  min-height: calc(100svh - ${({ theme }) => theme.layout.navbarHeight});
  display: flex;
  align-items: center;
  padding-block: ${({ theme }) => theme.space.xl};
  overflow: hidden;
  background:
    radial-gradient(ellipse 80% 50% at 10% 0%, rgba(78, 205, 196, 0.14), transparent 55%),
    radial-gradient(ellipse 70% 45% at 90% 20%, rgba(52, 152, 219, 0.12), transparent 50%),
    radial-gradient(ellipse 60% 40% at 50% 100%, rgba(232, 213, 183, 0.15), transparent 55%),
    ${({ theme }) => theme.colors.offWhite};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: ${patternSvg};
    background-size: 60px 60px;
    opacity: 0.04;
    pointer-events: none;
  }
`;

const Inner = styled(Container)`
  position: relative;
  z-index: 1;
  max-width: 36rem;
  text-align: center;
`;

const Code = styled(motion.p)`
  margin: 0 0 ${({ theme }) => theme.space.sm};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(5rem, 18vw, 8.5rem);
  font-weight: 700;
  font-style: italic;
  line-height: 0.9;
  letter-spacing: -0.04em;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.aqua} 0%,
    ${({ theme }) => theme.colors.ocean} 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Eyebrow = styled(motion.p)`
  margin: 0 0 ${({ theme }) => theme.space.sm};
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.aqua};
`;

const Title = styled(motion.h1)`
  margin: 0 0 ${({ theme }) => theme.space.sm};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.deepBlue};
  text-wrap: balance;
`;

const Lead = styled(motion.p)`
  margin: 0 auto ${({ theme }) => theme.space.lg};
  max-width: 28rem;
  font-size: 1.0625rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textMuted};
  text-wrap: balance;
`;

const Actions = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;

  ${media.md} {
    gap: 1rem;
  }
`;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export default function NotFound() {
  const { t } = useTranslation();
  const n = t.notFound;

  useEffect(() => {
    document.title = n.meta.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', n.meta.description);
  }, [n.meta.title, n.meta.description]);

  return (
    <PageTransition>
      <Page>
        <Inner>
          <Code
            {...fadeUp}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            aria-hidden="true"
          >
            404
          </Code>
          <Eyebrow
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.4, 0, 0.2, 1] }}
          >
            {n.eyebrow}
          </Eyebrow>
          <Title
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.14, ease: [0.4, 0, 0.2, 1] }}
          >
            {n.title}
          </Title>
          <Lead
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {n.lead}
          </Lead>
          <Actions
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            <Button to="/" variant="primary" size="lg">
              {n.homeCta}
            </Button>
            <Button to="/professionals" variant="outline" size="lg">
              {n.directoryCta}
            </Button>
          </Actions>
        </Inner>
      </Page>
    </PageTransition>
  );
}
