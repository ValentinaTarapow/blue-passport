import { useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import SocialIcon from '../components/ui/SocialIcon';
import PageTransition from '../components/PageTransition';
import { useTranslation } from '../i18n/LanguageContext';
import { submitContact } from '../services/api';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  SOCIAL_LINKS,
  WHATSAPP_URL,
} from '../utils/constants';
import {
  Page,
  Hero,
  HeroBg,
  HeroInner,
  HeroEyebrow,
  HeroTitle,
  HeroActions,
  Main,
  Shell,
  ShellCard,
  ContentGrid,
  InfoPanel,
  InfoInner,
  InfoTitle,
  Divider,
  InfoBlock,
  InfoLabel,
  ContactValue,
  SocialList,
  SocialLink,
  FormPanel,
  FormIntro,
  Form,
  FieldRow,
  FieldGroup,
  Label,
  RequiredMark,
  Input,
  Textarea,
  SubmitWrap,
} from './Contact.styles';
import styled from 'styled-components';

const FormStatus = styled.p`
  margin: 0 0 1rem;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 0.875rem;
  line-height: 1.5;
  background: ${({ $tone, theme }) =>
    $tone === 'error' ? 'rgba(231, 76, 60, 0.08)' : 'rgba(52, 152, 219, 0.08)'};
  border: 1px solid
    ${({ $tone }) => ($tone === 'error' ? 'rgba(231, 76, 60, 0.25)' : 'rgba(52, 152, 219, 0.22)')};
  color: ${({ $tone, theme }) => ($tone === 'error' ? theme.colors.error : theme.colors.ocean)};
`;

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  message: '',
};

export default function Contact() {
  const { t } = useTranslation();
  const c = t.contact;
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    document.title = c.meta.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', c.meta.description);
  }, [c.meta.title, c.meta.description]);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    setSubmitting(true);

    try {
      await submitContact({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      setForm(INITIAL_FORM);
      setStatus({ tone: 'success', message: c.success });
    } catch {
      setStatus({ tone: 'error', message: c.error });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <Page>
        <Hero>
          <HeroBg aria-hidden="true" />
          <HeroInner>
            <HeroEyebrow>{c.hero.eyebrow}</HeroEyebrow>
            <HeroTitle>{c.hero.title}</HeroTitle>
            <HeroActions>
              <Button to="/blue-passport" variant="primary" size="lg">
                {c.hero.passportCta}
              </Button>
              <Button href={WHATSAPP_URL} variant="outline" size="lg" target="_blank" rel="noopener noreferrer">
                {c.hero.whatsappCta}
              </Button>
            </HeroActions>
          </HeroInner>
        </Hero>

        <Main>
          <Shell>
            <ShellCard>
              <ContentGrid>
                <InfoPanel>
                  <InfoInner>
                    <InfoTitle>{c.formTitle}</InfoTitle>
                    <Divider />

                    <InfoBlock>
                      <InfoLabel>{c.phoneLabel}</InfoLabel>
                      <ContactValue href={CONTACT_PHONE_HREF}>{CONTACT_PHONE}</ContactValue>
                    </InfoBlock>

                    <Divider />

                    <InfoBlock>
                      <InfoLabel>{c.emailLabel}</InfoLabel>
                      <ContactValue href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</ContactValue>
                    </InfoBlock>

                    <Divider />

                    <InfoBlock>
                      <InfoLabel>{c.socialLabel}</InfoLabel>
                      <SocialList>
                        {SOCIAL_LINKS.map((social) => (
                          <li key={social.icon}>
                            <SocialLink
                              href={social.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={social.label}
                              title={social.label}
                            >
                              <SocialIcon name={social.icon} />
                            </SocialLink>
                          </li>
                        ))}
                      </SocialList>
                    </InfoBlock>
                  </InfoInner>
                </InfoPanel>

                <FormPanel>
                  <FormIntro>{c.formIntro}</FormIntro>
                  {status && <FormStatus $tone={status.tone}>{status.message}</FormStatus>}
                  <Form onSubmit={handleSubmit}>
                    <FieldRow>
                      <FieldGroup>
                        <Label htmlFor="contact-first-name">
                          {c.fields.firstName} <RequiredMark>*</RequiredMark>
                        </Label>
                        <Input
                          id="contact-first-name"
                          name="firstName"
                          type="text"
                          required
                          autoComplete="given-name"
                          value={form.firstName}
                          onChange={updateField('firstName')}
                          disabled={submitting}
                        />
                      </FieldGroup>
                      <FieldGroup>
                        <Label htmlFor="contact-last-name">
                          {c.fields.lastName} <RequiredMark>*</RequiredMark>
                        </Label>
                        <Input
                          id="contact-last-name"
                          name="lastName"
                          type="text"
                          required
                          autoComplete="family-name"
                          value={form.lastName}
                          onChange={updateField('lastName')}
                          disabled={submitting}
                        />
                      </FieldGroup>
                    </FieldRow>

                    <FieldGroup>
                      <Label htmlFor="contact-email">
                        {c.fields.email} <RequiredMark>*</RequiredMark>
                      </Label>
                      <Input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={form.email}
                        onChange={updateField('email')}
                        disabled={submitting}
                      />
                    </FieldGroup>

                    <FieldGroup>
                      <Label htmlFor="contact-message">
                        {c.fields.message} <RequiredMark>*</RequiredMark>
                      </Label>
                      <Textarea
                        id="contact-message"
                        name="message"
                        required
                        value={form.message}
                        onChange={updateField('message')}
                        disabled={submitting}
                      />
                    </FieldGroup>

                    <SubmitWrap>
                      <Button type="submit" variant="primary" size="lg" disabled={submitting}>
                        {submitting ? c.sending : c.submit}
                      </Button>
                    </SubmitWrap>
                  </Form>
                </FormPanel>
              </ContentGrid>
            </ShellCard>
          </Shell>
        </Main>
      </Page>
    </PageTransition>
  );
}
