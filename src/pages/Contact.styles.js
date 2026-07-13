import styled from 'styled-components';
import { media } from '../styles/theme';

export const Page = styled.div`
  padding-top: ${({ theme }) => theme.layout.navbarHeight};
`;

export const Hero = styled.section`
  position: relative;
  overflow-x: clip;
  padding: clamp(2.5rem, 6vw, 4rem) 0 clamp(2rem, 5vw, 3rem);
`;

export const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 55% at 50% 0%, rgba(78, 205, 196, 0.14) 0%, transparent 55%),
    linear-gradient(
      180deg,
      ${({ theme }) => theme.colors.skyLight} 0%,
      ${({ theme }) => theme.colors.offWhite} 100%
    );
  z-index: 0;
`;

export const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  max-width: ${({ theme }) => theme.layout.containerMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.layout.containerPadding};

  ${media.md} {
    padding: 0 2rem;
  }
`;

export const HeroEyebrow = styled.span`
  display: inline-block;
  margin-bottom: 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.aqua};
`;

export const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2rem, 5vw, 3.25rem);
  line-height: 1.12;
  color: ${({ theme }) => theme.colors.deepBlue};
  max-width: 16ch;
  margin-bottom: 1.5rem;
`;

export const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const Main = styled.section`
  padding: 0 0 clamp(3.5rem, 8vw, 5.5rem);
  background: ${({ theme }) => theme.colors.offWhite};
`;

export const Shell = styled.div`
  max-width: ${({ theme }) => theme.layout.containerMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.layout.containerPadding};

  ${media.md} {
    padding: 0 2rem;
  }
`;

export const ShellCard = styled.div`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

export const ContentGrid = styled.div`
  display: grid;

  ${media.lg} {
    grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  }
`;

export const InfoPanel = styled.aside`
  padding: clamp(2rem, 5vw, 3rem);
  background:
    radial-gradient(ellipse 90% 70% at 0% 0%, rgba(78, 205, 196, 0.08) 0%, transparent 55%),
    ${({ theme }) => theme.colors.white};

  ${media.lg} {
    border-right: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export const InfoInner = styled.div`
  max-width: 22rem;
  margin: 0 auto;
`;

export const InfoTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.625rem, 3.5vw, 2.125rem);
  font-weight: 600;
  line-height: 1.25;
  color: ${({ theme }) => theme.colors.deepBlue};
  text-align: center;
  margin-bottom: 2rem;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 2rem 0;
`;

export const InfoBlock = styled.div`
  text-align: left;
`;

export const InfoLabel = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.deepBlue};
  margin-bottom: 0.625rem;
`;

export const ContactValue = styled.a`
  display: inline-block;
  font-size: 1.0625rem;
  color: ${({ theme }) => theme.colors.deepBlue};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transition};

  &:hover {
    color: ${({ theme }) => theme.colors.aqua};
  }
`;

export const SocialList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

export const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.deepBlue};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.offWhite};
  transition:
    color ${({ theme }) => theme.transition},
    border-color ${({ theme }) => theme.transition},
    background ${({ theme }) => theme.transition},
    transform ${({ theme }) => theme.transition};

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    background: ${({ theme }) => theme.colors.ocean};
    border-color: ${({ theme }) => theme.colors.ocean};
    transform: translateY(-2px);
  }
`;

export const FormPanel = styled.div`
  padding: clamp(2rem, 5vw, 3rem);
  background: ${({ theme }) => theme.colors.offWhite};

  ${media.lg} {
    padding: clamp(2.25rem, 4vw, 3.25rem);
  }
`;

export const FormIntro = styled.p`
  font-size: 1.0625rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 1.75rem;
  max-width: 34rem;
`;

export const Form = styled.form`
  display: grid;
  gap: 1.25rem;
`;

export const FieldRow = styled.div`
  display: grid;
  gap: 1.25rem;

  ${media.md} {
    grid-template-columns: 1fr 1fr;
  }
`;

export const FieldGroup = styled.div`
  display: grid;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.deepBlue};
`;

export const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.aqua};
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 0.9375rem;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  transition:
    border-color ${({ theme }) => theme.transition},
    box-shadow ${({ theme }) => theme.transition};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.aqua};
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.12);
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 10rem;
  padding: 0.875rem 1rem;
  font-size: 0.9375rem;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  resize: vertical;
  transition:
    border-color ${({ theme }) => theme.transition},
    box-shadow ${({ theme }) => theme.transition};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.aqua};
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.12);
  }
`;

export const SubmitWrap = styled.div`
  padding-top: 0.5rem;
`;
