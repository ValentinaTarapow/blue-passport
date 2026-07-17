import { useMemo, useState } from 'react';
import Button from '../components/ui/Button';
import PageTransition from '../components/PageTransition';
import { useTranslation } from '../i18n/LanguageContext';
import { createCheckoutSession } from '../services/api';
import { CHECKOUT_PLANS } from '../utils/checkoutPlans';
import { getCountryOptions } from '../utils/countries';
import {
  FormPage,
  FormHero,
  FormEyebrow,
  FormTitle,
  FormLead,
  FormShell,
  FormCard,
  Form,
  FieldRow,
  FieldGroup,
  FieldMessage,
  Label,
  LabelWithError,
  RequiredMark,
  Input,
  Select,
  ConsentOption,
  FieldError,
  PlanGrid,
  PlanOption,
  PlanBody,
  PlanFooter,
  PlanName,
  PlanSubtitle,
  PlanDesc,
  PlanIncludes,
  PlanPrice,
  PlanBreakdown,
  Actions,
  FormClosing,
  Note,
} from './BluePassportForm.styles';

const EMPTY_FORM = {
  fullName: '',
  email: '',
  nationality: '',
  consent: false,
  plan: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function BecomeMember() {
  const { t, lang } = useTranslation();
  const m = t.bluePassport.member;
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const countryOptions = useMemo(() => getCountryOptions(lang), [lang]);

  const validate = (values) => {
    const next = {};

    if (!values.fullName.trim()) {
      next.fullName = m.errors.fullName;
    }

    if (!values.email.trim() || !EMAIL_RE.test(values.email.trim())) {
      next.email = m.errors.email;
    }

    if (!values.nationality.trim()) {
      next.nationality = m.errors.nationality;
    }

    if (!values.plan || !CHECKOUT_PLANS.some((plan) => plan.id === values.plan)) {
      next.plan = m.errors.plan;
    }

    if (!values.consent) {
      next.consent = m.errors.consent;
    }

    return next;
  };

  const update = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => {
      const nextForm = { ...current, [field]: value };
      if (attempted) {
        setErrors(validate(nextForm));
      } else {
        setErrors((currentErrors) => {
          if (!currentErrors[field]) return currentErrors;
          const { [field]: _removed, ...rest } = currentErrors;
          return rest;
        });
      }
      return nextForm;
    });
    setFormError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAttempted(true);
    setFormError('');

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFormError(m.requiredError);
      return;
    }

    setLoading(true);

    try {
      const { url } = await createCheckoutSession({
        plan: form.plan,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        company: '',
        category: '',
        country: form.nationality.trim(),
        nationality: form.nationality.trim(),
        reviewConsent: form.consent,
      });

      window.location.href = url;
    } catch (checkoutError) {
      setFormError(checkoutError.message || m.checkoutError);
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <FormPage>
        <FormHero>
          <FormEyebrow>{m.eyebrow}</FormEyebrow>
          <FormTitle>{m.title}</FormTitle>
          <FormLead>{m.lead}</FormLead>
        </FormHero>

        <FormShell>
          <FormCard>
            <Form onSubmit={handleSubmit} noValidate>
              <FieldRow $columns={3}>
                <FieldGroup>
                  <Label htmlFor="member-name">
                    {m.fields.fullName} <RequiredMark>*</RequiredMark>
                  </Label>
                  <Input
                    id="member-name"
                    value={form.fullName}
                    onChange={update('fullName')}
                    $invalid={Boolean(errors.fullName)}
                    aria-invalid={Boolean(errors.fullName)}
                    autoComplete="name"
                  />
                  <FieldMessage>
                    {errors.fullName ? <FieldError>{errors.fullName}</FieldError> : null}
                  </FieldMessage>
                </FieldGroup>

                <FieldGroup>
                  <Label htmlFor="member-email">
                    {m.fields.email} <RequiredMark>*</RequiredMark>
                  </Label>
                  <Input
                    id="member-email"
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    $invalid={Boolean(errors.email)}
                    aria-invalid={Boolean(errors.email)}
                    autoComplete="email"
                  />
                  <FieldMessage>
                    {errors.email ? <FieldError>{errors.email}</FieldError> : null}
                  </FieldMessage>
                </FieldGroup>

                <FieldGroup>
                  <Label htmlFor="member-nationality">
                    {m.fields.nationality} <RequiredMark>*</RequiredMark>
                  </Label>
                  <Select
                    id="member-nationality"
                    value={form.nationality}
                    onChange={update('nationality')}
                    $invalid={Boolean(errors.nationality)}
                    aria-invalid={Boolean(errors.nationality)}
                  >
                    <option value="">{m.nationalityPlaceholder}</option>
                    {countryOptions.map((country) => (
                      <option key={country.code} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </Select>
                  <FieldMessage>
                    {errors.nationality ? <FieldError>{errors.nationality}</FieldError> : null}
                  </FieldMessage>
                </FieldGroup>
              </FieldRow>

              <FieldGroup>
                <LabelWithError>
                  <Label as="span">
                    {m.planTitle} <RequiredMark>*</RequiredMark>
                  </Label>
                  {errors.plan && <FieldError as="span">{errors.plan}</FieldError>}
                </LabelWithError>
                <PlanGrid>
                  {CHECKOUT_PLANS.map((plan) => {
                    const copy = m.plans[plan.id];

                    return (
                      <PlanOption
                        key={plan.id}
                        $selected={form.plan === plan.id}
                      >
                        <input
                          type="radio"
                          name="plan"
                          value={plan.id}
                          checked={form.plan === plan.id}
                          onChange={update('plan')}
                        />
                        <PlanBody>
                          <PlanName>{copy.name}</PlanName>
                          {copy.subtitle && <PlanSubtitle>{copy.subtitle}</PlanSubtitle>}
                          <PlanDesc>{copy.description}</PlanDesc>
                          {copy.includes?.length > 0 && (
                            <PlanIncludes>
                              {copy.includes.map((item) => (
                                <li key={typeof item === 'string' ? item : item.title}>
                                  {typeof item === 'string' ? (
                                    item
                                  ) : (
                                    <>
                                      <strong>{item.title}</strong>
                                      {item.text ? ` — ${item.text}` : ''}
                                    </>
                                  )}
                                </li>
                              ))}
                            </PlanIncludes>
                          )}
                          <PlanFooter>
                            <PlanPrice>{copy.price}</PlanPrice>
                            {copy.breakdown && <PlanBreakdown>{copy.breakdown}</PlanBreakdown>}
                          </PlanFooter>
                        </PlanBody>
                      </PlanOption>
                    );
                  })}
                </PlanGrid>
              </FieldGroup>

              <ConsentOption $invalid={Boolean(errors.consent)}>
                <input
                  id="member-consent"
                  type="checkbox"
                  checked={form.consent}
                  onChange={update('consent')}
                />
                <span>{m.reviewConsent}</span>
              </ConsentOption>
              {errors.consent && <FieldError>{errors.consent}</FieldError>}

              <FormClosing>
                {formError && <FieldError>{formError}</FieldError>}

                <Actions>
                  <Button type="submit" variant="primary" size="lg" disabled={loading}>
                    {loading ? m.submitting : m.submit}
                  </Button>
                </Actions>
              </FormClosing>

              <Note>{m.note}</Note>
            </Form>
          </FormCard>
        </FormShell>
      </FormPage>
    </PageTransition>
  );
}
