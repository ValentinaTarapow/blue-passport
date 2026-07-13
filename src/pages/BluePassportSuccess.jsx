import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import PageTransition from '../components/PageTransition';
import { useTranslation } from '../i18n/LanguageContext';
import { useProfessionalCategories } from '../hooks/useWordPress';
import { APPLICATION_STATUS } from '../utils/applicationFields';
import {
  clearCheckoutApplicationId,
  getApplication,
  getCheckoutApplicationId,
  markAdminNotified,
  updateApplication,
  wasAdminNotified,
} from '../services/applicationStorage';
import {
  formatApplicationEmailBody,
  notifyTeamByEmail,
} from '../services/applicationNotify';
import { downloadProfileImage, shareProfileImage } from '../utils/profileImage';
import { downloadApplicationFile } from '../utils/applicationDocuments';
import {
  FormPage,
  FormHero,
  FormTitle,
  FormLead,
  FormShell,
  FormCard,
  WizardSteps,
  WizardStep,
  SuccessIcon,
  PhotoAttachCard,
  FileList,
  Actions,
  ReviewNote,
} from './BluePassportForm.styles';

const STEPS = ['apply', 'pay', 'done'];

export default function BluePassportSuccess() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const s = t.bluePassport.success;
  const labels = t.bluePassport.apply.emailLabels;
  const paramId = searchParams.get('application_id');
  const checkoutId = getCheckoutApplicationId();
  const applicationId = paramId || checkoutId;
  const application = applicationId ? getApplication(applicationId) : null;
  const { data: categories = [] } = useProfessionalCategories();
  const [shareSupported, setShareSupported] = useState(false);

  useEffect(() => {
    setShareSupported(typeof navigator.canShare === 'function');
  }, []);

  useEffect(() => {
    if (!applicationId || !application) return;

    updateApplication(applicationId, { status: APPLICATION_STATUS.PAID_PENDING_REVIEW });
    clearCheckoutApplicationId();

    if (wasAdminNotified(applicationId)) return;

    markAdminNotified(applicationId);
    const body = formatApplicationEmailBody(
      { ...application, status: APPLICATION_STATUS.PAID_PENDING_REVIEW },
      labels,
      categories,
    );

    const timer = window.setTimeout(() => {
      notifyTeamByEmail({
        subject: `${s.mailSubject} — ${application.fullName}`,
        body,
      });
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [applicationId, application, categories, labels, s.mailSubject]);

  const handleDownloadPhoto = () => {
    if (!application?.profileImage) return;
    downloadProfileImage(application.profileImage, application.fullName);
  };

  const handleSharePhoto = async () => {
    if (!application?.profileImage) return;
    try {
      await shareProfileImage(
        application.profileImage,
        s.mailSubject,
        s.sharePhotoText,
      );
    } catch {
      handleDownloadPhoto();
    }
  };

  return (
    <PageTransition>
      <FormPage>
        <FormHero>
          <SuccessIcon aria-hidden="true">✓</SuccessIcon>
          <FormTitle>{s.title}</FormTitle>
          <FormLead>{s.lead}</FormLead>
        </FormHero>

        <FormShell>
          <WizardSteps>
            {STEPS.map((step, index) => (
              <WizardStep key={step} $active={index === 2} $done={index < 2}>
                {t.bluePassport.wizard[step]}
              </WizardStep>
            ))}
          </WizardSteps>

          <FormCard>
            {application?.profileImage && (
              <PhotoAttachCard>
                <img
                  src={application.profileImage.dataUrl}
                  alt={s.profilePhotoAlt}
                />
                <p>{s.photoAttachNote}</p>
                <Actions>
                  <Button type="button" variant="primary" onClick={handleDownloadPhoto}>
                    {s.downloadPhotoCta}
                  </Button>
                  {shareSupported && (
                    <Button type="button" variant="outline" onClick={handleSharePhoto}>
                      {s.sharePhotoCta}
                    </Button>
                  )}
                </Actions>
              </PhotoAttachCard>
            )}

            {application?.accreditationDocuments?.length > 0 && (
              <PhotoAttachCard>
                <p>{s.documentsAttachNote}</p>
                <FileList>
                  {application.accreditationDocuments.map((document, index) => (
                    <li key={`${document.fileName}-${index}`}>
                      <span>{document.fileName}</span>
                      <button
                        type="button"
                        onClick={() => downloadApplicationFile(document, document.fileName)}
                      >
                        {s.downloadDocumentCta}
                      </button>
                    </li>
                  ))}
                </FileList>
              </PhotoAttachCard>
            )}

            <ReviewNote>{t.bluePassport.reviewNote}</ReviewNote>
            <ReviewNote>{s.adminNote}</ReviewNote>

            <Actions>
              <Button to="/blue-passport" variant="primary" size="lg">
                {s.homeCta}
              </Button>
              <Button to="/professionals" variant="outline" size="lg">
                {s.directoryCta}
              </Button>
            </Actions>
          </FormCard>
        </FormShell>
      </FormPage>
    </PageTransition>
  );
}
