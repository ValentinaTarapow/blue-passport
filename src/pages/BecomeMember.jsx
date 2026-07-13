import { useState } from 'react';
import Button from '../components/ui/Button';
import PageTransition from '../components/PageTransition';
import { useTranslation } from '../i18n/LanguageContext';
import { createCheckoutSession } from '../services/api';
import { CHECKOUT_PLANS } from '../utils/checkoutPlans';
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
  Label,
  RequiredMark,
  Input,
  FieldError,
  PlanGrid,
  PlanOption,
  PlanName,
  PlanDesc,
  PlanPrice,
  Actions,
  Note,
} from './BluePassportForm.styles';

const EMPTY_FORM = {
  fullName: '',
  email: '',
  company: '',
  category: '',
  country: '',
  plan: 'standard',
};

export default function BecomeMember() {
  const { t } = useTranslation();
  const m = t.bluePassport.member;
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.fullName.trim() || !form.email.trim() || !form.category.trim() || !form.country.trim()) {
      setError(m.requiredError);
      return;
    }

    setLoading(true);

    try {
      const { url } = await createCheckoutSession({
        plan: form.plan,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        category: form.category.trim(),
        country: form.country.trim(),
      });

      window.location.href = url;
    } catch (checkoutError) {
      setError(checkoutError.message || m.checkoutError);
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
            <Form onSubmit={handleSubmit}>
              <FieldRow>
                <FieldGroup>
                  <Label htmlFor="member-name">
                    {m.fields.fullName} <RequiredMark>*</RequiredMark>
                  </Label>
                  <Input
                    id="member-name"
                    required
                    value={form.fullName}
                    onChange={update('fullName')}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Label htmlFor="member-email">
                    {m.fields.email} <RequiredMark>*</RequiredMark>
                  </Label>
                  <Input
                    id="member-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={update('email')}
                  />
                </FieldGroup>
              </FieldRow>

              <FieldRow>
                <FieldGroup>
                  <Label htmlFor="member-company">{m.fields.company}</Label>
                  <Input
                    id="member-company"
                    value={form.company}
                    onChange={update('company')}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Label htmlFor="member-category">
                    {m.fields.category} <RequiredMark>*</RequiredMark>
                  </Label>
                  <Input
                    id="member-category"
                    required
                    value={form.category}
                    onChange={update('category')}
                  />
                </FieldGroup>
              </FieldRow>

              <FieldGroup>
                <Label htmlFor="member-country">
                  {m.fields.country} <RequiredMark>*</RequiredMark>
                </Label>
                <Input
                  id="member-country"
                  required
                  value={form.country}
                  onChange={update('country')}
                />
              </FieldGroup>

              <FieldGroup>
                <Label>{m.planTitle}</Label>
                <PlanGrid>
                  {CHECKOUT_PLANS.map((plan) => {
                    const copy = m.plans[plan.id];
                    return (
                      <PlanOption key={plan.id} $selected={form.plan === plan.id}>
                        <input
                          type="radio"
                          name="plan"
                          value={plan.id}
                          checked={form.plan === plan.id}
                          onChange={update('plan')}
                        />
                        <span>
                          <PlanName>{copy.name}</PlanName>
                          <PlanDesc>{copy.description}</PlanDesc>
                          <PlanPrice>{copy.price}</PlanPrice>
                        </span>
                      </PlanOption>
                    );
                  })}
                </PlanGrid>
              </FieldGroup>

              {error && <FieldError>{error}</FieldError>}

              <Actions>
                <Button type="submit" variant="primary" size="lg" disabled={loading}>
                  {loading ? m.submitting : m.submit}
                </Button>
                <Button to="/blue-passport" variant="outline" size="lg">
                  {m.back}
                </Button>
              </Actions>

              <Note>{m.note}</Note>
            </Form>
          </FormCard>
        </FormShell>
      </FormPage>
    </PageTransition>
  );
}
