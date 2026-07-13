import { useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import SocialIcon from '../components/ui/SocialIcon';
import PageTransition from '../components/PageTransition';
import { useTranslation } from '../i18n/LanguageContext';
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

  useEffect(() => {
    document.title = c.meta.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', c.meta.description);
  }, [c.meta.title, c.meta.description]);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const body = [
      `${c.fields.firstName}: ${form.firstName}`,
      `${c.fields.lastName}: ${form.lastName}`,
      `${c.fields.email}: ${form.email}`,
      '',
      form.message,
    ].join('\n');

    const params = new URLSearchParams({
      subject: c.mailSubject,
      body,
    });

    window.location.href = `mailto:${CONTACT_EMAIL}?${params.toString()}`;
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
                      />
                    </FieldGroup>

                    <SubmitWrap>
                      <Button type="submit" variant="primary" size="lg">
                        {c.submit}
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
