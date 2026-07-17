import { useEffect, useId, useState } from 'react';
import styled from 'styled-components';
import Button from '../components/ui/Button';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import { useTranslation } from '../i18n/LanguageContext';
import { Section, Container } from '../styles/shared';
import { media } from '../styles/theme';

const PageSection = styled(Section)`
  padding-top: calc(${({ theme }) => theme.layout.navbarHeight} + ${({ theme }) => theme.space.lg});
  padding-bottom: ${({ theme }) => theme.space['2xl']};
  background:
    radial-gradient(ellipse 80% 50% at 10% 0%, rgba(78, 205, 196, 0.12), transparent 55%),
    radial-gradient(ellipse 70% 45% at 90% 10%, rgba(52, 152, 219, 0.1), transparent 50%),
    ${({ theme }) => theme.colors.offWhite};
`;

const Intro = styled.div`
  max-width: 40rem;
  margin: 0 auto ${({ theme }) => theme.space.xl};
  text-align: center;
`;

const Eyebrow = styled.p`
  margin: 0 0 ${({ theme }) => theme.space.sm};
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.aqua};
`;

const Title = styled.h1`
  margin: 0 0 ${({ theme }) => theme.space.sm};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2rem, 4vw, 2.75rem);
  color: ${({ theme }) => theme.colors.deepBlue};
  line-height: 1.2;
`;

const Lead = styled.p`
  margin: 0;
  font-size: 1.0625rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FaqList = styled.div`
  max-width: 44rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FaqItem = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid
    ${({ theme, $open }) => ($open ? 'rgba(52, 152, 219, 0.28)' : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
  transition: border-color ${({ theme }) => theme.transition};
`;

const FaqQuestion = styled.button`
  width: 100%;
  cursor: pointer;
  border: none;
  background: transparent;
  text-align: left;
  padding: 1rem 1.15rem;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.975rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.deepBlue};
  line-height: 1.4;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;

  ${media.md} {
    padding: 1.1rem 1.35rem;
    font-size: 1.025rem;
  }
`;

const FaqIcon = styled.span`
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: rgba(52, 152, 219, 0.08);
  color: ${({ theme }) => theme.colors.ocean};
  font-size: 1.125rem;
  line-height: 1;
`;

const FaqAnswer = styled.div`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? '1fr' : '0fr')};
  transition: grid-template-rows 0.28s cubic-bezier(0.4, 0, 0.2, 1);
`;

const FaqAnswerInner = styled.div`
  overflow: hidden;
  min-height: 0;
`;

const FaqAnswerContent = styled.div`
  padding: 0 1.15rem 1.15rem;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.textMuted};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: translateY(${({ $open }) => ($open ? '0' : '-0.25rem')});
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;

  p {
    margin: 0 0 0.75rem;
  }

  p:last-child {
    margin-bottom: 0;
  }

  ul {
    margin: 0 0 0.75rem;
    padding-left: 1.15rem;
  }

  li {
    margin-bottom: 0.35rem;
  }

  ${media.md} {
    padding: 0 1.35rem 1.25rem;
  }
`;

const CtaBox = styled.div`
  max-width: 44rem;
  margin: ${({ theme }) => theme.space.xl} auto 0;
  padding: 1.5rem 1.25rem;
  text-align: center;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  ${media.md} {
    padding: 1.75rem 2rem;
  }
`;

const CtaTitle = styled.h2`
  margin: 0 0 0.5rem;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.375rem;
  color: ${({ theme }) => theme.colors.deepBlue};
`;

const CtaText = styled.p`
  margin: 0 0 1.25rem;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const CtaActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
`;

function AnswerBody({ paragraphs = [], list }) {
  return (
    <>
      {paragraphs.map((text) => (
        <p key={text}>{text}</p>
      ))}
      {list?.length > 0 && (
        <ul>
          {list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function Faq() {
  const { t } = useTranslation();
  const f = t.faq;
  const baseId = useId();
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    document.title = f.meta.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', f.meta.description);
  }, [f.meta.title, f.meta.description]);

  useEffect(() => {
    setOpenId(null);
  }, [f.items]);

  const toggleItem = (id) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <PageTransition>
      <PageSection>
        <Container>
          <ScrollReveal>
            <Intro>
              <Eyebrow>{f.eyebrow}</Eyebrow>
              <Title>{f.title}</Title>
              <Lead>{f.lead}</Lead>
            </Intro>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <FaqList>
              {f.items.map((item) => {
                const isOpen = openId === item.id;
                const panelId = `${baseId}-${item.id}-panel`;
                const buttonId = `${baseId}-${item.id}-button`;

                return (
                  <FaqItem key={item.id} $open={isOpen}>
                    <FaqQuestion
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleItem(item.id)}
                    >
                      <span>{item.question}</span>
                      <FaqIcon aria-hidden="true">{isOpen ? '−' : '+'}</FaqIcon>
                    </FaqQuestion>

                    <FaqAnswer $open={isOpen}>
                      <FaqAnswerInner>
                        <FaqAnswerContent
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          aria-hidden={!isOpen}
                          $open={isOpen}
                        >
                          <AnswerBody paragraphs={item.answer} list={item.list} />
                        </FaqAnswerContent>
                      </FaqAnswerInner>
                    </FaqAnswer>
                  </FaqItem>
                );
              })}
            </FaqList>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <CtaBox>
              <CtaTitle>{f.cta.title}</CtaTitle>
              <CtaText>{f.cta.text}</CtaText>
              <CtaActions>
                <Button to="/blue-passport/become-a-member" variant="primary" size="lg">
                  {f.cta.primary}
                </Button>
                <Button to="/contact" variant="outline" size="lg">
                  {f.cta.secondary}
                </Button>
              </CtaActions>
            </CtaBox>
          </ScrollReveal>
        </Container>
      </PageSection>
    </PageTransition>
  );
}
