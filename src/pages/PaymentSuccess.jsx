import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import LoadingState from '../components/LoadingState';
import PageTransition from '../components/PageTransition';
import { useTranslation } from '../i18n/LanguageContext';
import { getCheckoutSession } from '../services/api';
import {
  FormPage,
  FormHero,
  FormTitle,
  FormLead,
  FormShell,
  FormCard,
  SuccessIcon,
  Actions,
  FieldError,
} from './BluePassportForm.styles';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const p = t.bluePassport.payment.success;
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applicationId, setApplicationId] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setError(p.missingSession);
      setLoading(false);
      return;
    }

    getCheckoutSession(sessionId)
      .then((data) => {
        if (!data.paid && data.status === 'pending_payment') {
          setError(p.pendingPayment);
          return;
        }
        setApplicationId(data.applicationId);
      })
      .catch(() => setError(p.verifyError))
      .finally(() => setLoading(false));
  }, [sessionId, p.missingSession, p.pendingPayment, p.verifyError]);

  if (loading) {
    return <LoadingState fullPage message={p.loading} />;
  }

  if (error) {
    return (
      <PageTransition>
        <FormPage>
          <FormShell>
            <FormCard>
              <FieldError>{error}</FieldError>
              <Actions>
                <Button to="/blue-passport/become-a-member" variant="primary" size="lg">
                  {p.homeCta}
                </Button>
              </Actions>
            </FormCard>
          </FormShell>
        </FormPage>
      </PageTransition>
    );
  }

  const profileUrl = applicationId
    ? `/blue-passport/profile?applicationId=${applicationId}`
    : '/blue-passport/profile';

  return (
    <PageTransition>
      <FormPage>
        <FormHero>
          <SuccessIcon aria-hidden="true">✓</SuccessIcon>
          <FormTitle>{p.title}</FormTitle>
          <FormLead>{p.lead}</FormLead>
        </FormHero>

        <FormShell>
          <FormCard>
            <Actions>
              <Button to={profileUrl} variant="primary" size="lg">
                {p.profileCta}
              </Button>
              <Button to="/blue-passport" variant="outline" size="lg">
                {p.homeCta}
              </Button>
            </Actions>
          </FormCard>
        </FormShell>
      </FormPage>
    </PageTransition>
  );
}
