import Button from '../components/ui/Button';
import PageTransition from '../components/PageTransition';
import { useTranslation } from '../i18n/LanguageContext';
import {
  FormPage,
  FormHero,
  FormTitle,
  FormLead,
  FormShell,
  FormCard,
  Actions,
} from './BluePassportForm.styles';

export default function PaymentCancel() {
  const { t } = useTranslation();
  const p = t.bluePassport.payment.cancel;

  return (
    <PageTransition>
      <FormPage>
        <FormHero>
          <FormTitle>{p.title}</FormTitle>
          <FormLead>{p.lead}</FormLead>
        </FormHero>

        <FormShell>
          <FormCard>
            <Actions>
              <Button to="/blue-passport/become-a-member" variant="primary" size="lg">
                {p.retryCta}
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
